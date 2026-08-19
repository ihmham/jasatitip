const API_BASE = 'http://localhost:3000/api'

// ==================== MOCK DATA / FALLBACK ====================
    let products = [
      {
        id: 101, name: "Luffy Gear 5 Figure (Titipan)", price: 9000, originalPrice: null,
        category: "Anime", subcategory: "One Piece",
        type: "simple", image: "https://picsum.photos/id/1011/400/400",
        desc: "15 cm • Import Jepang • Edisi terbatas", stock: 134
      },
      {
        id: 102, name: "Gojo Satoru Acrylic Stand", price: 9000, originalPrice: null,
        category: "Anime", subcategory: "Jujutsu Kaisen",
        type: "simple", image: "https://picsum.photos/id/1005/400/400",
        desc: "Acrylic standee 15 cm • Double-sided print", stock: 87
      },
      {
        id: 103, name: "Enamel Pin Zoro", price: 28000, originalPrice: 28000,
        category: "Anime", subcategory: "One Piece",
        type: "simple", image: "https://picsum.photos/id/201/400/400",
        desc: "3.2 cm • Enamel + Nickel • Pin back included", stock: 42
      },
      {
        id: 104, name: "Enamel Pin Gojo", price: 19600, originalPrice: 28000,
        category: "Anime", subcategory: "Jujutsu Kaisen",
        type: "simple", image: "https://picsum.photos/id/160/400/400",
        desc: "3 cm • Enamel Pin • Limited", stock: 19, badge: "SALE"
      },
      {
        id: 105, name: "Keychain Witch Hat Atelier", price: 25000, originalPrice: null,
        category: "Anime", subcategory: "Keychain",
        type: "variable",
        variants: [
          { id: "v1", name: "Coco", price: 25000 },
          { id: "v2", name: "Qifrey", price: 25000 },
          { id: "v3", name: "Tetia", price: 25000 },
          { id: "v4", name: "Agott", price: 25000 },
          { id: "v5", name: "Riche", price: 25000 },
          { id: "v6", name: "Olruggio", price: 25000 }
        ],
        image: "https://picsum.photos/id/180/400/400",
        desc: "Acrylic keychain double sided • 6 karakter", stock: 31
      },
      {
        id: 106, name: "Paket Blind Box Cats", price: 35000, originalPrice: null,
        category: "General", subcategory: "Animals",
        type: "simple", image: "https://picsum.photos/id/106/400/400",
        desc: "5 pcs blind box • Random design", stock: 65, badge: "PAKET"
      },
      {
        id: 107, name: "Enamel Pin Link", price: 24000, originalPrice: null,
        category: "Video Games", subcategory: "Zelda",
        type: "variable",
        variants: [
          { id: "z1", name: "Link", price: 24000 },
          { id: "z2", name: "Majora's Mask", price: 24000 },
          { id: "z3", name: "Master Sword", price: 24000 }
        ],
        image: "https://picsum.photos/id/251/400/400",
        desc: "2.8 cm • Legend of Zelda series", stock: 28
      },
      {
        id: 108, name: "Spongebob Meme Plush Keychain", price: 8500, originalPrice: null,
        category: "Cartoons", subcategory: "Spongebob",
        type: "simple", image: "https://picsum.photos/id/29/400/400",
        desc: "25 cm plush keychain • Soft fabric", stock: 210
      },
      {
        id: 109, name: "Hat Pin Valorant Jett", price: 18000, originalPrice: 22000,
        category: "Video Games", subcategory: "Valorant",
        type: "simple", image: "https://picsum.photos/id/160/400/400",
        desc: "2.5 cm • Hard Enamel • Sale", stock: 14, badge: "SALE"
      },
      {
        id: 110, name: "Paket Frog Blind Box", price: 32000, originalPrice: null,
        category: "General", subcategory: "Animals",
        type: "simple", image: "https://picsum.photos/id/201/400/400",
        desc: "4 pcs blind box • Random frog designs", stock: 54, badge: "PAKET"
      },
      {
        id: 111, name: "Enamel Pin Naruto", price: 27500, originalPrice: null,
        category: "Anime", subcategory: "Naruto",
        type: "simple", image: "https://picsum.photos/id/1009/400/400",
        desc: "3.1 cm • Uzumaki Edition", stock: 37
      },
      {
        id: 112, name: "Coffee Addict Tumbler", price: 9000, originalPrice: null,
        category: "General", subcategory: "Coffee",
        type: "simple", image: "https://picsum.photos/id/312/400/400",
        desc: "6 x 4 cm • Perfect for tumbler", stock: 98
      },
      {
        id: 113, name: "Keychain Initial D AE86", price: 19500, originalPrice: null,
        category: "Anime", subcategory: "Initial D",
        type: "simple", image: "https://picsum.photos/id/160/400/400",
        desc: "Acrylic • Double side print", stock: 22
      },
      {
        id: 114, name: "Ghibli Totoro Plush Keychain", price: 9500, originalPrice: null,
        category: "Anime", subcategory: "Ghibli",
        type: "simple", image: "https://picsum.photos/id/1018/400/400",
        desc: "20 cm plush • Collectible edition", stock: 76
      },
      {
        id: 115, name: "Enamel Pin Pikachu", price: 22000, originalPrice: 26000,
        category: "Anime", subcategory: "Pokémon",
        type: "simple", image: "https://picsum.photos/id/251/400/400",
        desc: "2.8 cm • Classic", stock: 9, badge: "SALE"
      },
      {
        id: 116, name: "Programmer Desk Set (Paket)", price: 38000, originalPrice: null,
        category: "General", subcategory: "Profession",
        type: "simple", image: "https://picsum.photos/id/29/400/400",
        desc: "6 pcs • Laptop ready", stock: 41, badge: "PAKET"
      },
      {
        id: 117, name: "Enamel Pin Demon Slayer", price: 26500, originalPrice: null,
        category: "Anime", subcategory: "Demon Slayer",
        type: "variable",
        variants: [
          { id: "ds1", name: "Tanjiro", price: 26500 },
          { id: "ds2", name: "Nezuko", price: 26500 },
          { id: "ds3", name: "Zenitsu", price: 26500 }
        ],
        image: "https://picsum.photos/id/106/400/400",
        desc: "3 cm • Kimetsu no Yaiba series", stock: 33
      },
      {
        id: 118, name: "Chainsaw Man Mini Figure", price: 9000, originalPrice: null,
        category: "Anime", subcategory: "Chainsaw Man",
        type: "simple", image: "https://picsum.photos/id/180/400/400",
        desc: "12 cm mini figure • Articulated", stock: 58
      }
    ]

    let cart = []
    let currentProduct = null
    let currentVariant = null
    let activeCategory = null

    // ==================== TAILWIND CONFIG ====================
    function initTailwind() {
      document.documentElement.style.setProperty('--accent', '#fbbf24')
    }

    // ==================== RENDER CATEGORIES ====================
    function renderCategories() {
      const container = document.getElementById('category-chips')
      container.innerHTML = ''

      const categories = [
        { label: 'Semua', value: null },
        { label: 'Titipan', value: 'Titipan' },
        { label: 'Enamel Pin', value: 'Enamel Pin' },
        { label: 'Keychains' , value: 'Keychains' },
        { label: 'Anime', value: 'Anime' },
        { label: 'General', value: 'General' },
        { label: 'Video Games', value: 'Video Games' },
        { label: 'Cartoons', value: 'Cartoons' },
        { label: 'Sale', value: 'sale' }
      ]

      categories.forEach(cat => {
        const btn = document.createElement('button')
        btn.className = `category-chip px-4 py-1.5 text-xs border border-slate-200 rounded-2xl whitespace-nowrap ${activeCategory === cat.value ? 'active bg-amber-400 text-white border-amber-400' : 'hover:bg-slate-100'}`
        btn.textContent = cat.label
        btn.onclick = () => {
          activeCategory = cat.value
          filterProducts()
          // update active visual
          document.querySelectorAll('#category-chips button').forEach(b => b.classList.remove('active', 'bg-amber-400', 'text-white', 'border-amber-400'))
          btn.classList.add('active', 'bg-amber-400', 'text-white', 'border-amber-400')
        }
        container.appendChild(btn)
      })
    }

    // ==================== RENDER PRODUCTS ====================
    function renderProducts(filteredProducts) {
      const grid = document.getElementById('product-grid')
      grid.innerHTML = ''

      const countEl = document.getElementById('results-count')
      countEl.textContent = `Menampilkan ${filteredProducts.length} dari ${products.length} produk`

      if (filteredProducts.length === 0) {
        grid.innerHTML = `<div class="col-span-full py-10 text-center text-slate-400">Tidak ada produk yang cocok.</div>`
        return
      }

      filteredProducts.forEach(product => {
        const card = document.createElement('div')
        card.className = 'product-card bg-white border border-slate-200 rounded-3xl overflow-hidden cursor-pointer flex flex-col'
        
        let priceHTML = ''
        if (product.originalPrice && product.originalPrice > product.price) {
          priceHTML = `
            <div class="flex items-baseline gap-x-1.5">
              <span class="font-semibold">Rp${product.price.toLocaleString('id-ID')}</span>
              <span class="text-xs line-through text-slate-400">Rp${product.originalPrice.toLocaleString('id-ID')}</span>
            </div>`
        } else {
          priceHTML = `<span class="font-semibold">Rp${product.price.toLocaleString('id-ID')}</span>`
        }

        let badgeHTML = ''
        if (product.badge) {
          const badgeColor = product.badge === 'SALE' ? 'bg-rose-600' : 'bg-amber-600'
          badgeHTML = `<div class="absolute top-2 right-2 ${badgeColor} text-white text-[10px] px-2 py-px rounded font-medium tracking-wider">${product.badge}</div>`
        }

        const isVariable = product.type === 'variable'
        
        card.innerHTML = `
          <div class="relative aspect-square bg-slate-100">
            <img src="${product.image}" loading="lazy" class="w-full h-full object-cover" alt="${product.name}">
            ${badgeHTML}
            ${isVariable ? `<div class="absolute bottom-2 left-2 text-[10px] px-2 py-0.5 bg-white/90 rounded font-medium">+${product.variants.length} varian</div>` : ''}
          </div>
          <div class="p-3 flex-1 flex flex-col">
            <div class="text-xs text-amber-600 mb-0.5">${product.subcategory}</div>
            <div class="font-semibold text-sm leading-tight line-clamp-2 flex-1">${product.name}</div>
            
            <div class="mt-auto pt-3">
              ${priceHTML}
              <div class="flex items-center justify-between mt-2">
                <span class="text-[10px] text-slate-500">${product.stock} tersedia</span>
                <button onclick="event.stopImmediatePropagation(); quickAddToCart(${product.id})" 
                        class="text-xs px-3 py-1 bg-amber-400 hover:bg-amber-500 text-white rounded-2xl flex items-center gap-x-1">
                  <i class="fa-solid fa-plus text-xs"></i>
                  <span class="text-[11px]">Tambah</span>
                </button>
              </div>
            </div>
          </div>
        `
        
        card.onclick = () => showProductModal(product)
        grid.appendChild(card)
      })
    }

    // ==================== FILTER & SEARCH ====================
    function filterProducts() {
      const search = document.getElementById('search-input').value.toLowerCase().trim()
      const sort = document.getElementById('sort-select').value

      let filtered = [...products]

      // Category filter
      if (activeCategory === 'sale') {
        filtered = filtered.filter(p => p.originalPrice && p.originalPrice > p.price)
      } else if (activeCategory) {
        filtered = filtered.filter(p => 
          p.category === activeCategory || 
          p.subcategory === activeCategory ||
          (activeCategory === 'Titipan' && p.name.toLowerCase().includes('titip')) ||
          (activeCategory === 'Enamel Pin' && p.name.toLowerCase().includes('enamel')) ||
          (activeCategory === 'Keychains' && p.name.toLowerCase().includes('keychain'))
        )
      }

      // Search
      if (search) {
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(search) || 
          p.subcategory.toLowerCase().includes(search) ||
          p.category.toLowerCase().includes(search)
        )
      }

      // Sort
      if (sort === 'price-low') {
        filtered.sort((a, b) => a.price - b.price)
      } else if (sort === 'price-high') {
        filtered.sort((a, b) => b.price - a.price)
      } else if (sort === 'name') {
        filtered.sort((a, b) => a.name.localeCompare(b.name))
      }

      renderProducts(filtered)
    }

    function resetFilters() {
      activeCategory = null
      document.getElementById('search-input').value = ''
      const mobileSearchInput = document.getElementById('mobile-search-input')
      if (mobileSearchInput) mobileSearchInput.value = ''
      document.getElementById('sort-select').value = 'default'
      
      // reset chip styles
      document.querySelectorAll('#category-chips button').forEach(b => {
        b.classList.remove('active', 'bg-amber-400', 'text-white', 'border-amber-400')
        if (b.textContent === 'Semua') b.classList.add('active', 'bg-amber-400', 'text-white', 'border-amber-400')
      })
      
      renderProducts(products)
    }

    function showSaleOnly() {
      activeCategory = 'sale'
      document.getElementById('search-input').value = ''
      const mobileSearchInput = document.getElementById('mobile-search-input')
      if (mobileSearchInput) mobileSearchInput.value = ''
      filterProducts()
      
      // highlight sale chip if exists
      document.querySelectorAll('#category-chips button').forEach(b => {
        b.classList.remove('active', 'bg-amber-400', 'text-white')
        if (b.textContent === 'Sale') b.classList.add('active', 'bg-amber-400', 'text-white')
      })
    }

    // ==================== PRODUCT MODAL ====================
    async function showProductModal(product) {
      if (product.type === 'variable' && !product.variants) {
        try {
          const response = await fetch(`${API_BASE}/products/${product.id}`)
          if (response.ok) {
            const payload = await response.json()
            product = payload.data
            product.id = Number(product.id)
            product.variants = (product.variants || []).map(variant => ({ ...variant, id: String(variant.id) }))
            product.desc = product.description || product.desc || ''
            products = products.map(item => item.id === product.id ? product : item)
          }
        } catch (error) {
          showToast('Detail varian tidak dapat dimuat')
        }
      }

      currentProduct = product
      currentVariant = null

      const modal = document.getElementById('product-modal')
      const content = document.getElementById('modal-content')
      const addBtn = document.getElementById('modal-add-btn')

      let variantHTML = ''
      if (product.type === 'variable' && product.variants) {
        variantHTML = `
          <div class="mt-4">
            <div class="text-xs font-medium mb-2 text-slate-500">Pilih Varian</div>
            <div class="flex flex-wrap gap-2" id="variant-options">
              ${product.variants.map(v => `
                <button data-vid="${v.id}" 
                        class="variant-btn px-3 py-1 text-sm border rounded-2xl hover:bg-slate-100"
                        onclick="selectVariant(${product.id}, '${v.id}', this)">
                  ${v.name} — Rp${v.price.toLocaleString('id-ID')}
                </button>
              `).join('')}
            </div>
          </div>
        `
      }

      let priceDisplay = ''
      if (product.originalPrice && product.originalPrice > product.price) {
        priceDisplay = `<div class="flex items-center gap-x-2 mt-1"><span class="text-2xl font-semibold">Rp${product.price.toLocaleString('id-ID')}</span><span class="line-through text-sm text-slate-400">Rp${product.originalPrice.toLocaleString('id-ID')}</span></div>`
      } else {
        priceDisplay = `<div class="text-2xl font-semibold mt-1">Rp${product.price.toLocaleString('id-ID')}</div>`
      }

      content.innerHTML = `
        <div class="aspect-video md:aspect-square -mx-5 -mt-5 mb-4 bg-slate-100">
          <img src="${product.image}" class="w-full h-full object-cover" alt="${product.name}">
        </div>
        
        <div>
          <div class="flex items-center gap-x-2">
            <span class="text-xs px-2 py-0.5 bg-amber-100 text-amber-600 rounded">${product.category}</span>
            <span class="text-xs text-slate-500">${product.subcategory}</span>
          </div>
          <h3 class="font-semibold text-xl leading-tight mt-1">${product.name}</h3>
          ${priceDisplay}
          
          <div class="mt-3 text-sm text-slate-600">${product.desc}</div>
          
          ${variantHTML}
          
          <div class="mt-5 flex items-center gap-x-2 text-xs">
            <div class="px-3 py-1 bg-amber-100 text-amber-400 rounded-2xl">Stok: ${product.stock}</div>
            <div class="text-slate-400">• Tersedia</div>
          </div>
        </div>
      `

      // Setup add button
      addBtn.onclick = () => {
        if (product.type === 'variable') {
          if (!currentVariant) {
            alert('Pilih varian dulu')
            return
          }
          addToCart(product, currentVariant)
        } else {
          addToCart(product)
        }
        closeProductModal()
      }

      modal.classList.remove('hidden')
      modal.classList.add('flex')
      modal.focus()
    }

    function selectVariant(productId, variantId, element) {
      // deselect others
      document.querySelectorAll('#variant-options .variant-btn').forEach(el => {
        el.classList.remove('!border-amber-500', 'bg-amber-50')
      })
      element.classList.add('!border-amber-500', 'bg-amber-50')

      const product = products.find(p => p.id === productId)
      currentVariant = product.variants.find(v => v.id === variantId)
    }

    function closeProductModal() {
      const modal = document.getElementById('product-modal')
      modal.classList.remove('flex')
      modal.classList.add('hidden')
      currentProduct = null
      currentVariant = null
    }

    // ==================== CART ====================
    function quickAddToCart(productId) {
      const product = products.find(p => p.id === productId)
      if (!product) return
      
      if (product.type === 'variable') {
        // open modal instead for variant selection
        showProductModal(product)
      } else {
        addToCart(product)
      }
    }

    function addToCart(product, variant = null) {
      const variantId = variant ? variant.id : null
      const existing = cart.findIndex(item => 
        item.id === product.id && 
        item.variantId === variantId
      )

      if (existing > -1) {
        if (cart[existing].qty >= product.stock) {
          showToast('Stok produk tidak mencukupi')
          return
        }
        cart[existing].qty++
      } else {
        cart.push({
          ...product,
          qty: 1,
          variantId: variant ? variant.id : null,
          variantName: variant ? variant.name : null,
          displayPrice: variant ? variant.price : product.price
        })
      }

      updateCartCount()
      showToast(`Ditambahkan: ${product.name}${variant ? ' - ' + variant.name : ''}`)
    }

    function updateCartCount() {
      const count = cart.reduce((sum, item) => sum + item.qty, 0)
      document.getElementById('cart-count').textContent = count
    }

    function toggleCart() {
      const drawer = document.getElementById('cart-drawer')
      const isOpen = !drawer.classList.contains('hidden')

      if (isOpen) {
        drawer.classList.add('hidden')
      } else {
        drawer.classList.remove('hidden')
        renderCart()
      }
    }

    function renderCart() {
      const container = document.getElementById('cart-items')
      const subtotalEl = document.getElementById('cart-subtotal')

      if (cart.length === 0) {
        container.innerHTML = `
          <div class="py-10 text-center text-slate-400">
            <i class="fa-solid fa-shopping-bag text-3xl mb-2 opacity-50"></i>
            <div>Keranjang kosong</div>
          </div>
        `
        subtotalEl.textContent = 'Rp0'
        return
      }

      let html = ''
      let subtotal = 0

      cart.forEach((item, index) => {
        const itemTotal = item.displayPrice * item.qty
        subtotal += itemTotal

        const variantText = item.variantName ? `<span class="text-xs text-amber-400">(${item.variantName})</span>` : ''

        html += `
          <div class="flex gap-x-3 border-b pb-3 mb-3 last:border-none last:pb-0 last:mb-0">
              <div class="w-14 h-14 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
              <img src="${item.image}" loading="lazy" class="w-full h-full object-cover" alt="${item.name}">
            </div>
            <div class="flex-1 min-w-0">
              <div class="font-medium text-sm leading-tight">${item.name} ${variantText}</div>
              <div class="text-amber-600 text-sm font-semibold mt-0.5">Rp${item.displayPrice.toLocaleString('id-ID')}</div>
              
              <div class="flex items-center justify-between mt-2">
                <div class="flex items-center border rounded-xl text-sm">
                  <button onclick="changeQty(${index}, -1)" class="px-2 py-0.5 text-lg leading-none">-</button>
                  <span class="px-3 font-medium">${item.qty}</span>
                  <button onclick="changeQty(${index}, 1)" class="px-2 py-0.5 text-lg leading-none">+</button>
                </div>
                <button onclick="removeFromCart(${index})" class="text-xs text-rose-500 px-2">Hapus</button>
              </div>
            </div>
          </div>
        `
      })

      container.innerHTML = html
      subtotalEl.textContent = `Rp${subtotal.toLocaleString('id-ID')}`
    }

    function changeQty(index, delta) {
      const item = cart[index]
      if (!item) return

      item.qty += delta
      if (item.qty < 1) item.qty = 1
      if (item.qty > item.stock) {
        item.qty = item.stock
        showToast('Jumlah maksimal sesuai stok')
      }
      renderCart()
      updateCartCount()
    }

    function removeFromCart(index) {
      cart.splice(index, 1)
      renderCart()
      updateCartCount()
    }

    // ==================== CHECKOUT ====================
    function proceedToCheckout() {
      if (cart.length === 0) return
      
      toggleCart() // close cart first
      
      const modal = document.getElementById('checkout-modal')
      const summary = document.getElementById('checkout-summary')
      
      let subtotal = 0
      let html = ''
      
      cart.forEach(item => {
        const total = item.displayPrice * item.qty
        subtotal += total
        const v = item.variantName ? ` (${item.variantName})` : ''
        html += `<div class="flex justify-between"><span>${item.name}${v} ×${item.qty}</span><span>Rp${total.toLocaleString('id-ID')}</span></div>`
      })

      html += `<div class="pt-2 mt-2 border-t flex justify-between font-semibold"><span>Total</span><span>Rp${subtotal.toLocaleString('id-ID')}</span></div>`
      summary.innerHTML = html
      
      modal.classList.remove('hidden')
      modal.classList.add('flex')
    }

    function closeCheckoutModal() {
      const modal = document.getElementById('checkout-modal')
      modal.classList.remove('flex')
      modal.classList.add('hidden')
    }

    async function completeOrder() {
      const name = document.getElementById('checkout-name').value.trim()
      const phone = document.getElementById('checkout-phone').value.trim()
      const address = document.getElementById('checkout-address').value.trim()

      if (!name || !phone || !address) {
        alert('Lengkapi nama, nomor HP, dan alamat pengiriman terlebih dahulu')
        return
      }

      if (!/^(\+62|0)[0-9]{9,13}$/.test(phone.replace(/[\s-]/g, ''))) {
        alert('Masukkan nomor HP Indonesia yang valid')
        return
      }

      try {
        const response = await fetch(`${API_BASE}/orders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerName: name,
            customerPhone: phone,
            shippingAddress: address,
            paymentMethod: document.querySelector('input[name="pay"]:checked')?.value || 'transfer',
            items: cart.map(item => ({ productId: item.id, variantId: item.variantId, quantity: item.qty }))
          })
        })

        const payload = await response.json()
        if (!response.ok) throw new Error(payload.message || 'Pesanan gagal dibuat')

        closeCheckoutModal()
        document.getElementById('order-id').textContent = payload.data.orderNumber
        document.getElementById('success-modal').classList.remove('hidden')
        document.getElementById('success-modal').classList.add('flex')
        cart = []
        updateCartCount()
        await loadProducts()
      } catch (error) {
        alert(error.message || 'Gagal menghubungi server')
      }
    }

    function hideSuccess() {
      const modal = document.getElementById('success-modal')
      modal.classList.remove('flex')
      modal.classList.add('hidden')
    }

    function resetAfterOrder() {
      hideSuccess()
      // already cleared cart
      document.getElementById('search-input').value = ''
      const mobileSearchInput = document.getElementById('mobile-search-input')
      if (mobileSearchInput) mobileSearchInput.value = ''
      activeCategory = null
      document.getElementById('sort-select').value = 'default'
      renderProducts(products)
      renderCategories()
    }

    // ==================== UTILS ====================
    function scrollToSection(id) {
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }

    function showToast(message) {
      const toast = document.createElement('div')
      toast.className = 'fixed bottom-5 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-4 py-2 rounded-3xl text-sm shadow-lg z-[100]'
      toast.setAttribute('role', 'status')
      toast.setAttribute('aria-live', 'polite')
      toast.textContent = message
      document.body.appendChild(toast)
      
      setTimeout(() => {
        toast.style.transition = 'all .2s'
        toast.style.opacity = '0'
        setTimeout(() => toast.remove(), 200)
      }, 1400)
    }

    function toggleMobileMenu() {
      const menu = document.getElementById('mobile-menu')
      if (!menu) return

      const isOpen = !menu.classList.contains('hidden')
      menu.classList.toggle('hidden', isOpen)

      if (!isOpen) {
        const search = document.getElementById('mobile-search-input')
        if (search) search.focus()
      }
    }

    function initFilters() {
      // search on input
      const searchInput = document.getElementById('search-input')
      searchInput.addEventListener('input', () => {
        filterProducts()
      })

      const mobileSearchInput = document.getElementById('mobile-search-input')
      if (mobileSearchInput) {
        mobileSearchInput.addEventListener('input', () => {
          searchInput.value = mobileSearchInput.value
          filterProducts()
        })
      }

      // initial active chip
      setTimeout(() => {
        const allBtn = Array.from(document.querySelectorAll('#category-chips button')).find(b => b.textContent === 'Semua')
        if (allBtn) allBtn.classList.add('active', 'bg-amber-400', 'text-white', 'border-amber-400')
      }, 50)
    }

    async function loadProducts() {
      try {
        const response = await fetch(`${API_BASE}/products`)
        if (!response.ok) throw new Error('Katalog API tidak tersedia')
        const payload = await response.json()
        products = payload.data.map(product => ({
          ...product,
          id: Number(product.id),
          desc: product.description || ''
        }))
        renderProducts(products)
        return true
      } catch (error) {
        showToast('Server belum aktif, menampilkan data demo')
        return false
      }
    }

    // ==================== INIT ====================
    async function init() {
      initTailwind()
      renderCategories()
      renderProducts(products)
      updateCartCount()
      initFilters()
      await loadProducts()

      // demo: add one item after load (optional, comment if not needed)
      // setTimeout(() => { cart.push({...products[0], qty:1, displayPrice: products[0].price}); updateCartCount() }, 1800)

      // keyboard escape for modals
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          const modals = ['product-modal', 'checkout-modal', 'success-modal']
          for (let id of modals) {
            const m = document.getElementById(id)
            if (!m.classList.contains('hidden')) {
              if (id === 'product-modal') closeProductModal()
              else if (id === 'checkout-modal') closeCheckoutModal()
              else hideSuccess()
              break
            }
          }
          const drawer = document.getElementById('cart-drawer')
          if (!drawer.classList.contains('hidden')) drawer.classList.add('hidden')
        }
      })

      console.log('%c[Jasatitip Prototype] Ready — 18 mock products loaded', 'color:#64748b')
    }

    window.onload = init
