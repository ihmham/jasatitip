const express = require('express')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const pool = require('./db')

const app = express()

app.use(cors({ origin: process.env.CLIENT_ORIGIN || true }))
app.use(express.json())

const jwtSecret = process.env.JWT_SECRET || 'development-only-change-this-secret'

function createAdminToken(admin) {
  return jwt.sign(
    { sub: admin.id, email: admin.email, role: 'admin' },
    jwtSecret,
    { expiresIn: '8h' }
  )
}

function requireAdmin(req, res, next) {
  const authorization = req.headers.authorization || ''
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : null

  if (!token) return res.status(401).json({ message: 'Token admin diperlukan' })

  try {
    req.admin = jwt.verify(token, jwtSecret)
    next()
  } catch (error) {
    res.status(401).json({ message: 'Token admin tidak valid atau sudah kedaluwarsa' })
  }
}

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1')
    res.json({ status: 'ok', database: 'connected' })
  } catch (error) {
    res.status(503).json({ status: 'error', database: 'disconnected' })
  }
})

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) return res.status(400).json({ message: 'Email dan password wajib diisi' })

  try {
    const result = await pool.query(
      'SELECT id, name, email, password_hash FROM admins WHERE email = $1',
      [email.trim().toLowerCase()]
    )

    const admin = result.rows[0]
    const passwordMatches = admin && await bcrypt.compare(password, admin.password_hash)

    if (!passwordMatches) return res.status(401).json({ message: 'Email atau password salah' })

    const { password_hash: ignoredPassword, ...safeAdmin } = admin
    res.json({ data: { admin: safeAdmin, token: createAdminToken(admin) } })
  } catch (error) {
    console.error('Failed to login admin:', error)
    res.status(500).json({ message: 'Gagal melakukan login' })
  }
})

app.get('/api/auth/me', requireAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email FROM admins WHERE id = $1', [req.admin.sub])
    if (result.rowCount === 0) return res.status(404).json({ message: 'Admin tidak ditemukan' })
    res.json({ data: result.rows[0] })
  } catch (error) {
    console.error('Failed to fetch admin:', error)
    res.status(500).json({ message: 'Gagal mengambil data admin' })
  }
})

const orderStatuses = ['Menunggu Pembayaran', 'Diproses', 'Dikirim', 'Selesai']

app.post('/api/orders', async (req, res) => {
  const { customerName, customerPhone, shippingAddress, paymentMethod = 'transfer', items } = req.body

  if (!customerName || !customerPhone || !shippingAddress || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Data pelanggan dan item pesanan wajib diisi' })
  }

  const client = await pool.connect()

  try {
    await client.query('BEGIN')
    let subtotal = 0
    const orderItems = []

    for (const item of items) {
      const quantity = Number(item.quantity)
      if (!Number.isInteger(quantity) || quantity < 1) throw Object.assign(new Error('Jumlah item tidak valid'), { statusCode: 400 })

      const productResult = await client.query(`
        SELECT id, name, price, stock
        FROM products
        WHERE id = $1 AND is_active = TRUE
        FOR UPDATE
      `, [item.productId])

      const product = productResult.rows[0]
      if (!product) throw Object.assign(new Error('Produk tidak ditemukan'), { statusCode: 404 })
      if (product.stock < quantity) throw Object.assign(new Error(`Stok ${product.name} tidak mencukupi`), { statusCode: 409 })

      let unitPrice = product.price
      let variantName = null
      if (item.variantId) {
        const variantResult = await client.query(`
          SELECT id, name, price, stock
          FROM product_variants
          WHERE id = $1 AND product_id = $2
          FOR UPDATE
        `, [item.variantId, product.id])

        const variant = variantResult.rows[0]
        if (!variant) throw Object.assign(new Error('Varian produk tidak ditemukan'), { statusCode: 404 })
        if (variant.stock < quantity) throw Object.assign(new Error(`Stok varian ${variant.name} tidak mencukupi`), { statusCode: 409 })
        unitPrice = variant.price
        variantName = variant.name
        await client.query('UPDATE product_variants SET stock = stock - $1 WHERE id = $2', [quantity, variant.id])
      }

      const totalPrice = unitPrice * quantity
      subtotal += totalPrice
      orderItems.push({ product, variantId: item.variantId || null, variantName, quantity, unitPrice, totalPrice })
      await client.query('UPDATE products SET stock = stock - $1, updated_at = NOW() WHERE id = $2', [quantity, product.id])
    }

    const orderNumber = `NS-${Date.now().toString().slice(-8)}`
    const orderResult = await client.query(`
      INSERT INTO orders (order_number, customer_name, customer_phone, shipping_address, payment_method, payment_status, order_status, subtotal, total)
      VALUES ($1, $2, $3, $4, $5, 'pending', $6, $7, $7)
      RETURNING id, order_number AS "orderNumber", order_status AS status, subtotal, total, created_at AS "createdAt"
    `, [orderNumber, customerName.trim(), customerPhone.trim(), shippingAddress.trim(), paymentMethod, 'Menunggu Pembayaran', subtotal])

    for (const item of orderItems) {
      await client.query(`
        INSERT INTO order_items (order_id, product_id, variant_id, product_name, variant_name, quantity, unit_price, total_price)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [orderResult.rows[0].id, item.product.id, item.variantId, item.product.name, item.variantName, item.quantity, item.unitPrice, item.totalPrice])
    }

    await client.query('COMMIT')
    res.status(201).json({ data: orderResult.rows[0] })
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Failed to create order:', error)
    res.status(error.statusCode || 500).json({ message: error.statusCode ? error.message : 'Gagal membuat pesanan' })
  } finally {
    client.release()
  }
})

app.get('/api/orders', requireAdmin, async (req, res) => {
  try {
    const statusFilter = req.query.status && orderStatuses.includes(req.query.status) ? req.query.status : null
    const result = await pool.query(`
      SELECT o.id, o.order_number AS "orderNumber", o.customer_name AS customer,
             o.customer_phone AS phone, o.shipping_address AS address,
             o.payment_status AS "paymentStatus", o.order_status AS status,
             o.subtotal, o.shipping_cost AS "shippingCost", o.total,
             o.created_at AS "createdAt", COUNT(oi.id)::INTEGER AS "itemCount"
      FROM orders o
      LEFT JOIN order_items oi ON oi.order_id = o.id
      WHERE ($1::VARCHAR IS NULL OR o.order_status = $1)
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `, [statusFilter])

    res.json({ data: result.rows })
  } catch (error) {
    console.error('Failed to fetch orders:', error)
    res.status(500).json({ message: 'Gagal mengambil data pesanan' })
  }
})

app.get('/api/orders/:id', requireAdmin, async (req, res) => {
  try {
    const orderResult = await pool.query(`
      SELECT id, order_number AS "orderNumber", customer_name AS customer,
             customer_phone AS phone, shipping_address AS address,
             payment_method AS "paymentMethod", payment_status AS "paymentStatus",
             order_status AS status, subtotal, shipping_cost AS "shippingCost",
             total, created_at AS "createdAt"
      FROM orders WHERE id = $1
    `, [req.params.id])

    if (orderResult.rowCount === 0) return res.status(404).json({ message: 'Pesanan tidak ditemukan' })

    const itemsResult = await pool.query(`
      SELECT product_id AS "productId", variant_id AS "variantId", product_name AS name,
             variant_name AS "variantName", quantity, unit_price AS "unitPrice", total_price AS "totalPrice"
      FROM order_items WHERE order_id = $1 ORDER BY id
    `, [req.params.id])

    res.json({ data: { ...orderResult.rows[0], items: itemsResult.rows } })
  } catch (error) {
    console.error('Failed to fetch order:', error)
    res.status(500).json({ message: 'Gagal mengambil detail pesanan' })
  }
})

app.patch('/api/orders/:id/status', requireAdmin, async (req, res) => {
  const { status } = req.body
  if (!orderStatuses.includes(status)) return res.status(400).json({ message: 'Status pesanan tidak valid' })

  try {
    const result = await pool.query(`
      UPDATE orders SET order_status = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING id, order_number AS "orderNumber", order_status AS status, updated_at AS "updatedAt"
    `, [status, req.params.id])

    if (result.rowCount === 0) return res.status(404).json({ message: 'Pesanan tidak ditemukan' })
    res.json({ data: result.rows[0] })
  } catch (error) {
    console.error('Failed to update order status:', error)
    res.status(500).json({ message: 'Gagal memperbarui status pesanan' })
  }
})

app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, name, slug, description, category, subcategory,
             category_id AS "categoryId",
             price, original_price AS "originalPrice", image_url AS image,
             stock, product_type AS type, badge
      FROM products
      WHERE is_active = TRUE
      ORDER BY created_at DESC
    `)

    res.json({ data: result.rows })
  } catch (error) {
    console.error('Failed to fetch products:', error)
    res.status(500).json({ message: 'Gagal mengambil data produk' })
  }
})

app.get('/api/categories', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, name, slug, parent_id AS "parentId"
      FROM categories
      ORDER BY parent_id NULLS FIRST, name
    `)
    res.json({ data: result.rows })
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    res.status(500).json({ message: 'Gagal mengambil kategori' })
  }
})

app.post('/api/categories', requireAdmin, async (req, res) => {
  const { name, slug, parentId = null } = req.body
  if (!name || !slug) return res.status(400).json({ message: 'Nama dan slug kategori wajib diisi' })

  try {
    const result = await pool.query(`
      INSERT INTO categories (name, slug, parent_id)
      VALUES ($1, $2, $3)
      RETURNING id, name, slug, parent_id AS "parentId"
    `, [name.trim(), slug.trim(), parentId || null])
    res.status(201).json({ data: result.rows[0] })
  } catch (error) {
    if (error.code === '23505') return res.status(409).json({ message: 'Slug kategori sudah digunakan' })
    res.status(500).json({ message: 'Gagal membuat kategori' })
  }
})

app.put('/api/categories/:id', requireAdmin, async (req, res) => {
  const { name, slug, parentId = null } = req.body
  if (!name || !slug) return res.status(400).json({ message: 'Nama dan slug kategori wajib diisi' })

  try {
    const result = await pool.query(`
      UPDATE categories SET name = $1, slug = $2, parent_id = $3, updated_at = NOW()
      WHERE id = $4
      RETURNING id, name, slug, parent_id AS "parentId"
    `, [name.trim(), slug.trim(), parentId || null, req.params.id])
    if (result.rowCount === 0) return res.status(404).json({ message: 'Kategori tidak ditemukan' })
    res.json({ data: result.rows[0] })
  } catch (error) {
    if (error.code === '23505') return res.status(409).json({ message: 'Slug kategori sudah digunakan' })
    res.status(500).json({ message: 'Gagal memperbarui kategori' })
  }
})

app.delete('/api/categories/:id', requireAdmin, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM categories WHERE id = $1 RETURNING id', [req.params.id])
    if (result.rowCount === 0) return res.status(404).json({ message: 'Kategori tidak ditemukan' })
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus kategori' })
  }
})

app.get('/api/products/:id', async (req, res) => {
  try {
    const productResult = await pool.query(`
      SELECT id, name, slug, description, category, subcategory,
             category_id AS "categoryId",
             price, original_price AS "originalPrice", image_url AS image,
             stock, product_type AS type, badge
      FROM products
      WHERE id = $1 AND is_active = TRUE
    `, [req.params.id])

    if (productResult.rowCount === 0) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' })
    }

    const variantsResult = await pool.query(`
      SELECT id, name, price, stock
      FROM product_variants
      WHERE product_id = $1
      ORDER BY id
    `, [req.params.id])

    res.json({ data: { ...productResult.rows[0], variants: variantsResult.rows } })
  } catch (error) {
    console.error('Failed to fetch product:', error)
    res.status(500).json({ message: 'Gagal mengambil detail produk' })
  }
})

app.post('/api/products/:id/variants', requireAdmin, async (req, res) => {
  const { name, price, stock } = req.body
  if (!name || !Number.isInteger(Number(price)) || Number(price) < 0 || !Number.isInteger(Number(stock)) || Number(stock) < 0) {
    return res.status(400).json({ message: 'Nama, harga, dan stok varian wajib valid' })
  }

  try {
    const result = await pool.query(`
      INSERT INTO product_variants (product_id, name, price, stock)
      SELECT $1, $2, $3, $4
      WHERE EXISTS (SELECT 1 FROM products WHERE id = $1 AND is_active = TRUE)
      RETURNING id, product_id AS "productId", name, price, stock
    `, [req.params.id, name.trim(), Number(price), Number(stock)])
    if (result.rowCount === 0) return res.status(404).json({ message: 'Produk tidak ditemukan' })
    res.status(201).json({ data: result.rows[0] })
  } catch (error) {
    res.status(500).json({ message: 'Gagal membuat varian' })
  }
})

app.put('/api/variants/:id', requireAdmin, async (req, res) => {
  const { name, price, stock } = req.body
  if (!name || !Number.isInteger(Number(price)) || Number(price) < 0 || !Number.isInteger(Number(stock)) || Number(stock) < 0) {
    return res.status(400).json({ message: 'Nama, harga, dan stok varian wajib valid' })
  }

  try {
    const result = await pool.query(`
      UPDATE product_variants SET name = $1, price = $2, stock = $3
      WHERE id = $4
      RETURNING id, product_id AS "productId", name, price, stock
    `, [name.trim(), Number(price), Number(stock), req.params.id])
    if (result.rowCount === 0) return res.status(404).json({ message: 'Varian tidak ditemukan' })
    res.json({ data: result.rows[0] })
  } catch (error) {
    res.status(500).json({ message: 'Gagal memperbarui varian' })
  }
})

app.delete('/api/variants/:id', requireAdmin, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM product_variants WHERE id = $1 RETURNING id', [req.params.id])
    if (result.rowCount === 0) return res.status(404).json({ message: 'Varian tidak ditemukan' })
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus varian' })
  }
})

function validateProductPayload(payload) {
  const requiredFields = ['name', 'slug', 'category', 'subcategory', 'image']
  const missingField = requiredFields.find(field => !String(payload[field] || '').trim())

  if (missingField) return `Field ${missingField} wajib diisi`
  if (!Number.isInteger(Number(payload.price)) || Number(payload.price) < 0) return 'Harga produk tidak valid'
  if (!Number.isInteger(Number(payload.stock)) || Number(payload.stock) < 0) return 'Stok produk tidak valid'
  if (payload.originalPrice !== null && payload.originalPrice !== undefined && (!Number.isInteger(Number(payload.originalPrice)) || Number(payload.originalPrice) < Number(payload.price))) return 'Harga normal tidak valid'
  if (!['simple', 'variable'].includes(payload.type || 'simple')) return 'Tipe produk tidak valid'

  return null
}

app.post('/api/products', requireAdmin, async (req, res) => {
  const validationError = validateProductPayload(req.body)
  if (validationError) return res.status(400).json({ message: validationError })

  const { name, slug, description = '', category, subcategory, categoryId = null, price, originalPrice = null, image, stock, type = 'simple', badge = null } = req.body

  try {
    const result = await pool.query(`
      INSERT INTO products (name, slug, description, category, subcategory, category_id, price, original_price, image_url, stock, product_type, badge)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING id, name, slug, description, category, subcategory, price,
                original_price AS "originalPrice", image_url AS image, stock,
                product_type AS type, badge
    `, [name.trim(), slug.trim(), description.trim(), category.trim(), subcategory.trim(), categoryId || null, Number(price), originalPrice === null ? null : Number(originalPrice), image.trim(), Number(stock), type, badge])

    res.status(201).json({ data: result.rows[0] })
  } catch (error) {
    if (error.code === '23505') return res.status(409).json({ message: 'Slug produk sudah digunakan' })
    console.error('Failed to create product:', error)
    res.status(500).json({ message: 'Gagal membuat produk' })
  }
})

app.put('/api/products/:id', requireAdmin, async (req, res) => {
  const validationError = validateProductPayload(req.body)
  if (validationError) return res.status(400).json({ message: validationError })

  const { name, slug, description = '', category, subcategory, categoryId = null, price, originalPrice = null, image, stock, type = 'simple', badge = null } = req.body

  try {
    const result = await pool.query(`
      UPDATE products
      SET name = $1, slug = $2, description = $3, category = $4, subcategory = $5,
          category_id = $6, price = $7, original_price = $8, image_url = $9, stock = $10,
          product_type = $11, badge = $12, updated_at = NOW()
      WHERE id = $13 AND is_active = TRUE
      RETURNING id, name, slug, description, category, subcategory, price,
                original_price AS "originalPrice", image_url AS image, stock,
                product_type AS type, badge
    `, [name.trim(), slug.trim(), description.trim(), category.trim(), subcategory.trim(), categoryId || null, Number(price), originalPrice === null ? null : Number(originalPrice), image.trim(), Number(stock), type, badge, req.params.id])

    if (result.rowCount === 0) return res.status(404).json({ message: 'Produk tidak ditemukan' })
    res.json({ data: result.rows[0] })
  } catch (error) {
    if (error.code === '23505') return res.status(409).json({ message: 'Slug produk sudah digunakan' })
    console.error('Failed to update product:', error)
    res.status(500).json({ message: 'Gagal memperbarui produk' })
  }
})

app.delete('/api/products/:id', requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(`
      UPDATE products
      SET is_active = FALSE, updated_at = NOW()
      WHERE id = $1 AND is_active = TRUE
      RETURNING id
    `, [req.params.id])

    if (result.rowCount === 0) return res.status(404).json({ message: 'Produk tidak ditemukan' })
    res.status(204).send()
  } catch (error) {
    console.error('Failed to delete product:', error)
    res.status(500).json({ message: 'Gagal menghapus produk' })
  }
})

module.exports = app
