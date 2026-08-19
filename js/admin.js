const adminProducts = [
  { id: 101, name: 'Luffy Gear 5 Figure', category: 'Anime', subcategory: 'One Piece', price: 9000, stock: 134, image: 'https://picsum.photos/id/1011/120/120' },
  { id: 104, name: 'Enamel Pin Gojo', category: 'Anime', subcategory: 'Jujutsu Kaisen', price: 19600, stock: 19, image: 'https://picsum.photos/id/160/120/120' },
  { id: 106, name: 'Paket Blind Box Cats', category: 'General', subcategory: 'Animals', price: 35000, stock: 65, image: 'https://picsum.photos/id/106/120/120' },
  { id: 109, name: 'Hat Pin Valorant Jett', category: 'Video Games', subcategory: 'Valorant', price: 18000, stock: 14, image: 'https://picsum.photos/id/251/120/120' }
]

const API_BASE = 'http://localhost:3000/api'
let authToken = localStorage.getItem('jasatitip_admin_token')

const adminOrders = [
  { id: 'NS-26081201', customer: 'Ilham Maulana', total: 54000, status: 'Diproses', items: 'Enamel Pin Gojo ×2, Pin Zoro ×1' },
  { id: 'NS-26081188', customer: 'Salsa Putri', total: 35000, status: 'Menunggu Pembayaran', items: 'Paket Blind Box Cats ×1' },
  { id: 'NS-26081142', customer: 'Raka Aditya', total: 9000, status: 'Selesai', items: 'Luffy Gear 5 Figure ×1' },
  { id: 'NS-26081110', customer: 'Nadia Aulia', total: 18000, status: 'Dikirim', items: 'Hat Pin Valorant Jett ×1' }
]

let productList = [...adminProducts]
let orderList = [...adminOrders]
let categoryList = []
let editingProductId = null

const money = value => `Rp${value.toLocaleString('id-ID')}`
const $ = id => document.getElementById(id)

async function showApp() {
  $('login-screen').classList.add('hidden')
  $('admin-app').classList.remove('hidden')
  await loadAdminData()
  renderAll()
}

async function apiRequest(path, options = {}) {
  const headers = { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}), ...(options.headers || {}) }
  const response = await fetch(`${API_BASE}${path}`, { ...options, headers })
  const payload = response.status === 204 ? null : await response.json()
  if (!response.ok) throw new Error(payload?.message || 'Permintaan ke server gagal')
  return payload
}

async function loadAdminData() {
  try {
    const [productPayload, orderPayload, categoryPayload] = await Promise.all([apiRequest('/products'), apiRequest('/orders'), apiRequest('/categories')])
    productList = productPayload.data.map(product => ({ ...product, id: Number(product.id) }))
    orderList = orderPayload.data.map(order => ({ ...order, id: Number(order.id) }))
    categoryList = categoryPayload.data.map(category => ({ ...category, id: Number(category.id) }))
    renderCategoryOptions()
  } catch (error) {
    alert(error.message || 'Gagal memuat data admin')
  }
}

function renderAll() {
  $('stat-products').textContent = productList.length
  $('stat-orders').textContent = orderList.length
  $('stat-revenue').textContent = money(orderList.reduce((sum, order) => sum + order.total, 0))
  $('stat-low-stock').textContent = productList.filter(product => product.stock < 20).length
  renderProducts()
  renderOrders()
  renderRecentOrders()
  renderCategories()
}

function statusClass(status) {
  const classes = { 'Menunggu Pembayaran': 'status-waiting', Diproses: 'status-processing', Dikirim: 'status-shipped', Selesai: 'status-done' }
  return classes[status] || 'status-waiting'
}

function renderProducts() {
  const query = ($('product-search').value || '').toLowerCase().trim()
  const visible = productList.filter(product => product.name.toLowerCase().includes(query) || product.category.toLowerCase().includes(query))
  $('products-table').innerHTML = visible.length ? visible.map(product => `
    <tr>
      <td><div class="flex items-center gap-3"><img src="${product.image}" alt="${product.name}" class="w-10 h-10 rounded-xl object-cover"><div><div class="font-medium">${product.name}</div><div class="text-xs text-stone-500">${product.subcategory}</div></div></div></td>
      <td>${product.category}</td><td>${money(product.price)}</td><td><span class="${product.stock < 20 ? 'text-rose-600 font-semibold' : ''}">${product.stock}</span></td>
      <td><div class="flex gap-2"><button data-edit-product="${product.id}" class="table-action">Edit</button><button data-delete-product="${product.id}" class="table-action danger">Hapus</button></div></td>
    </tr>`).join('') : '<tr><td colspan="5" class="text-center text-stone-500 py-10">Produk tidak ditemukan.</td></tr>'
}

function renderOrders() {
  const filter = $('order-filter').value
  const visible = filter === 'all' ? orderList : orderList.filter(order => order.status === filter)
  $('orders-table').innerHTML = visible.length ? visible.map(order => `
    <tr><td class="font-medium">${order.orderNumber}</td><td>${order.customer}</td><td>${money(order.total)}</td>
      <td><span class="status-pill ${statusClass(order.status)}">${order.status}</span></td>
      <td><select data-order-status="${order.id}" class="order-status"><option ${order.status === 'Menunggu Pembayaran' ? 'selected' : ''}>Menunggu Pembayaran</option><option ${order.status === 'Diproses' ? 'selected' : ''}>Diproses</option><option ${order.status === 'Dikirim' ? 'selected' : ''}>Dikirim</option><option ${order.status === 'Selesai' ? 'selected' : ''}>Selesai</option></select></td>
    </tr>`).join('') : '<tr><td colspan="5" class="text-center text-stone-500 py-10">Pesanan tidak ditemukan.</td></tr>'
}

function renderRecentOrders() {
  $('recent-orders').innerHTML = `<table class="admin-table"><thead><tr><th>Pesanan</th><th>Pelanggan</th><th>Total</th><th>Status</th></tr></thead><tbody>${orderList.slice(0, 3).map(order => `<tr><td class="font-medium">${order.orderNumber}</td><td>${order.customer}</td><td>${money(order.total)}</td><td><span class="status-pill ${statusClass(order.status)}">${order.status}</span></td></tr>`).join('')}</tbody></table>`
}

function renderCategories() {
  const table = $('categories-table')
  if (!table) return
  table.innerHTML = categoryList.length ? categoryList.map(category => `
    <tr><td class="font-medium">${category.name}</td><td class="text-stone-500">${category.slug}</td><td><div class="flex gap-2"><button data-edit-category="${category.id}" class="table-action">Edit</button><button data-delete-category="${category.id}" class="table-action danger">Hapus</button></div></td></tr>
  `).join('') : '<tr><td colspan="3" class="text-center text-stone-500 py-10">Belum ada kategori.</td></tr>'
}

function renderCategoryOptions() {
  const select = $('product-category')
  if (!select) return
  select.innerHTML = '<option value="">Pilih kategori</option>' + categoryList.filter(category => category.slug !== 'sale').map(category => `<option value="${category.id}" data-name="${category.name}">${category.name}</option>`).join('')
}

function openProductModal(product = null) {
  editingProductId = product ? product.id : null
  $('product-modal-title').textContent = product ? 'Edit Produk' : 'Tambah Produk'
  $('product-id').value = product?.id || ''
  $('product-name').value = product?.name || ''
  $('product-category').value = product?.categoryId || categoryList.find(category => category.name === product?.category)?.id || ''
  $('product-subcategory').value = product?.subcategory || ''
  $('product-price').value = product?.price || ''
  $('product-stock').value = product?.stock ?? ''
  $('product-image').value = product?.image || 'https://picsum.photos/id/1011/400/400'
  $('variant-manager').classList.toggle('hidden', !product)
  if (product) loadProductVariants(product.id)
  $('product-modal').classList.remove('hidden')
}

function closeProductModal() { $('product-modal').classList.add('hidden') }

async function loadProductVariants(productId) {
  try {
    const payload = await apiRequest(`/products/${productId}`)
    $('variants-list').innerHTML = payload.data.variants.length ? payload.data.variants.map(variant => `
      <div class="flex items-center justify-between rounded-xl bg-stone-50 px-3 py-2 text-xs"><span>${variant.name} · ${money(Number(variant.price))} · stok ${variant.stock}</span><button data-delete-variant="${variant.id}" class="text-rose-600">Hapus</button></div>
    `).join('') : '<div class="text-xs text-stone-500">Belum ada varian.</div>'
  } catch (error) {
    $('variants-list').innerHTML = `<div class="text-xs text-rose-600">${error.message}</div>`
  }
}

function saveCategory(event) {
  event.preventDefault()
  const id = Number($('category-id').value)
  const name = $('category-name').value.trim()
  const slug = $('category-slug').value.trim()
  const options = { method: id ? 'PUT' : 'POST', body: JSON.stringify({ name, slug }) }
  apiRequest(id ? `/categories/${id}` : '/categories', options).then(async () => {
    $('category-form').reset()
    $('category-id').value = ''
    $('category-form-title').textContent = 'Tambah Kategori'
    await loadAdminData()
    renderAll()
  }).catch(error => alert(error.message))
}

function saveProduct(event) {
  event.preventDefault()
  const name = $('product-name').value.trim()
  const categoryOption = $('product-category').selectedOptions[0]
  const data = { name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''), description: '', category: categoryOption?.dataset.name || '', categoryId: Number($('product-category').value) || null, subcategory: $('product-subcategory').value.trim(), price: Number($('product-price').value), image: $('product-image').value.trim(), stock: Number($('product-stock').value), type: 'simple' }
  const request = editingProductId ? apiRequest(`/products/${editingProductId}`, { method: 'PUT', body: JSON.stringify(data) }) : apiRequest('/products', { method: 'POST', body: JSON.stringify(data) })
  request.then(async () => { closeProductModal(); await loadAdminData(); renderAll() }).catch(error => alert(error.message))
}

function navigate(view) {
  document.querySelectorAll('.admin-page').forEach(page => page.classList.toggle('hidden', page.dataset.page !== view))
  document.querySelectorAll('.nav-item[data-view], [data-view].text-xs').forEach(button => button.classList.toggle('active', button.dataset.view === view))
  $('page-title').textContent = view === 'dashboard' ? 'Dashboard' : view === 'products' ? 'Produk' : view === 'categories' ? 'Kategori' : 'Pesanan'
  $('admin-sidebar').classList.remove('open')
  $('sidebar-overlay').classList.add('hidden')
}

document.addEventListener('DOMContentLoaded', () => {
  $('login-form').addEventListener('submit', async event => { event.preventDefault(); const button = event.submitter; button.disabled = true; try { const payload = await apiRequest('/auth/login', { method: 'POST', body: JSON.stringify({ email: $('login-email').value.trim(), password: $('login-password').value }) }); authToken = payload.data.token; localStorage.setItem('jasatitip_admin_token', authToken); $('login-error').classList.add('hidden'); await showApp() } catch (error) { $('login-error').textContent = error.message; $('login-error').classList.remove('hidden') } finally { button.disabled = false } })
  $('logout-btn').addEventListener('click', () => { authToken = null; localStorage.removeItem('jasatitip_admin_token'); $('admin-app').classList.add('hidden'); $('login-screen').classList.remove('hidden') })
  document.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => navigate(button.dataset.view)))
  $('product-search').addEventListener('input', renderProducts)
  $('order-filter').addEventListener('change', renderOrders)
  $('add-product-btn').addEventListener('click', () => openProductModal())
  $('close-product-modal').addEventListener('click', closeProductModal)
  $('cancel-product').addEventListener('click', closeProductModal)
  $('product-form').addEventListener('submit', saveProduct)
  $('category-form').addEventListener('submit', saveCategory)
  $('cancel-category').addEventListener('click', () => { $('category-form').reset(); $('category-id').value = ''; $('category-form-title').textContent = 'Tambah Kategori' })
  $('products-table').addEventListener('click', event => { const editId = Number(event.target.dataset.editProduct); const deleteId = Number(event.target.dataset.deleteProduct); if (editId) openProductModal(productList.find(product => product.id === editId)); if (deleteId && confirm('Hapus produk ini?')) { apiRequest(`/products/${deleteId}`, { method: 'DELETE' }).then(async () => { await loadAdminData(); renderAll() }).catch(error => alert(error.message)) } })
  $('orders-table').addEventListener('change', event => { const id = event.target.dataset.orderStatus; if (id) { apiRequest(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status: event.target.value }) }).then(async () => { await loadAdminData(); renderAll() }).catch(error => alert(error.message)) } })
  $('categories-table').addEventListener('click', event => { const editId = Number(event.target.dataset.editCategory); const deleteId = Number(event.target.dataset.deleteCategory); if (editId) { const category = categoryList.find(item => item.id === editId); $('category-id').value = category.id; $('category-name').value = category.name; $('category-slug').value = category.slug; $('category-form-title').textContent = 'Edit Kategori' } if (deleteId && confirm('Hapus kategori ini?')) { apiRequest(`/categories/${deleteId}`, { method: 'DELETE' }).then(async () => { await loadAdminData(); renderAll() }).catch(error => alert(error.message)) } })
  $('add-variant-btn').addEventListener('click', () => { const productId = Number($('product-id').value); const data = { name: $('variant-name').value.trim(), price: Number($('variant-price').value), stock: Number($('variant-stock').value) }; apiRequest(`/products/${productId}/variants`, { method: 'POST', body: JSON.stringify(data) }).then(async () => { $('variant-name').value = ''; $('variant-price').value = ''; $('variant-stock').value = ''; await loadProductVariants(productId) }).catch(error => alert(error.message)) })
  $('variants-list').addEventListener('click', event => { const variantId = Number(event.target.dataset.deleteVariant); if (variantId && confirm('Hapus varian ini?')) { apiRequest(`/variants/${variantId}`, { method: 'DELETE' }).then(() => loadProductVariants(Number($('product-id').value))).catch(error => alert(error.message)) } })
  $('sidebar-toggle').addEventListener('click', () => { $('admin-sidebar').classList.add('open'); $('sidebar-overlay').classList.remove('hidden') })
  $('sidebar-overlay').addEventListener('click', () => { $('admin-sidebar').classList.remove('open'); $('sidebar-overlay').classList.add('hidden') })
  if (authToken) showApp()
})
