// src/App.jsx - Updated Joburg Market PWA with Modern Daily Price List
import React, { useState, useEffect } from 'react'
import { supabase, getCurrentUser, signIn, signUp, signOut } from './supabaseClient'

// Inject modern, futuristic, clean CSS with Joburg Market colors (green #0f5d3a, yellow #f4c430, white, light gray)
const style = document.createElement('style')
style.textContent = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
body { 
  margin: 0; 
  font-family: 'Inter', sans-serif; 
  background: linear-gradient(135deg, #f6f8f7 0%, #e8f0e8 100%); 
  color: #333; 
  line-height: 1.6; 
}
.container { max-width: 1400px; margin: 0 auto; padding: 20px; }
.header { 
  background: linear-gradient(90deg, #0f5d3a 0%, #1a7a4e 100%); 
  color: white; 
  padding: 20px; 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  border-radius: 12px; 
  margin-bottom: 30px; 
  box-shadow: 0 4px 20px rgba(15,93,58,0.1); 
}
.logo-section { display: flex; align-items: center; gap: 20px; }
.joburg-logo { height: 50px; } /* Placeholder for Joburg Market logo */
.kdot-logo { height: 40px; } /* Placeholder for K-Dot Solutions logo */
.title { font-size: 28px; font-weight: 700; margin: 0; }
.nav { display: flex; gap: 16px; align-items: center; }
.nav button { 
  background: rgba(255,255,255,0.2); 
  border: 1px solid rgba(255,255,255,0.3); 
  color: white; 
  padding: 10px 20px; 
  border-radius: 8px; 
  cursor: pointer; 
  font-weight: 500; 
  transition: all 0.3s ease; 
}
.nav button:hover { background: #f4c430; color: #0f5d3a; }
.main { display: grid; grid-template-columns: 1fr; gap: 30px; }
.section { 
  background: rgba(255,255,255,0.9); 
  padding: 30px; 
  border-radius: 16px; 
  box-shadow: 0 8px 32px rgba(0,0,0,0.05); 
  backdrop-filter: blur(10px); 
  border: 1px solid rgba(255,255,255,0.2); 
  transition: transform 0.3s ease; 
}
.section:hover { transform: translateY(-2px); }
.section h2 { 
  color: #0f5d3a; 
  font-size: 24px; 
  margin-bottom: 20px; 
  display: flex; 
  align-items: center; 
  gap: 10px; 
}
.section h3 { color: #1a7a4e; font-size: 20px; margin: 25px 0 15px 0; border-left: 4px solid #f4c430; padding-left: 15px; }
.price-table { 
  width: 100%; 
  border-collapse: collapse; 
  font-size: 14px; 
  background: white; 
  border-radius: 12px; 
  overflow: hidden; 
  box-shadow: 0 4px 16px rgba(0,0,0,0.05); 
}
.price-row { 
  border-bottom: 1px solid #e8f0e8; 
  transition: background 0.2s ease; 
}
.price-row:hover { background: #f8f9fa; }
.price-row th, .price-row td { 
  padding: 12px 16px; 
  text-align: left; 
}
.price-row th { 
  background: linear-gradient(90deg, #0f5d3a, #1a7a4e); 
  color: white; 
  font-weight: 600; 
  text-transform: uppercase; 
  letter-spacing: 0.5px; 
}
.price-cell { 
  font-weight: 500; 
  color: #0f5d3a; 
}
.price-value { 
  font-weight: 600; 
  color: #f4c430; 
  font-family: 'Courier New', monospace; 
}
.listing { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  padding: 15px; 
  border: 1px solid #e8f0e8; 
  border-radius: 8px; 
  margin-bottom: 10px; 
  background: white; 
  transition: all 0.3s ease; 
}
.listing:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
.btn { 
  background: linear-gradient(135deg, #f4c430 0%, #e6b800 100%); 
  color: #0f5d3a; 
  padding: 12px 24px; 
  border: none; 
  border-radius: 8px; 
  cursor: pointer; 
  font-weight: 600; 
  transition: all 0.3s ease; 
  box-shadow: 0 2px 8px rgba(244,196,48,0.3); 
}
.btn:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(244,196,48,0.4); }
.input { 
  padding: 12px; 
  border: 1px solid #d1d9d9; 
  border-radius: 8px; 
  flex: 1; 
  font-size: 14px; 
  transition: border 0.3s ease; 
}
.input:focus { border-color: #0f5d3a; outline: none; }
.formRow { display: flex; gap: 12px; margin-bottom: 12px; align-items: center; }
.modalMask { 
  position: fixed; 
  top: 0; left: 0; right: 0; bottom: 0; 
  background: rgba(15,93,58,0.8); 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  backdrop-filter: blur(5px); 
}
.modal { 
  background: white; 
  padding: 30px; 
  border-radius: 16px; 
  max-width: 500px; 
  width: 90%; 
  box-shadow: 0 20px 60px rgba(0,0,0,0.2); 
  animation: slideIn 0.3s ease; 
}
@keyframes slideIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
.footer { 
  text-align: center; 
  margin-top: 40px; 
  padding: 20px; 
  color: #666; 
  font-size: 12px; 
  border-top: 1px solid #e8f0e8; 
}
@media (max-width: 768px) { 
  .container { padding: 10px; } 
  .header { flex-direction: column; gap: 10px; text-align: center; } 
  .price-row th, .price-row td { padding: 8px 10px; font-size: 12px; } 
}
`
document.head.appendChild(style)

function App() {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState('buyer')
  const [listings, setListings] = useState([])
  const [orders, setOrders] = useState([])
  const [wallet, setWallet] = useState({ balance: 0 })
  const [marketPrices, setMarketPrices] = useState([])
  const [availability, setAvailability] = useState({})
  const [showLogin, setShowLogin] = useState(false)
  const [showSignup, setShowSignup] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showTopUp, setShowTopUp] = useState(false)
  const [topUpAmount, setTopUpAmount] = useState('')
  const [showNewListing, setShowNewListing] = useState(false)
  const [newListing, setNewListing] = useState({ name: '', qty: '', grade: 'A', price_per_kg: '' })
  const [orderQty, setOrderQty] = useState({})
  const [showUpdatePrice, setShowUpdatePrice] = useState(false)
  const [newPrice, setNewPrice] = useState({ product: '', average_price: '', unit: 'kg' })

  // Static daily price list data (as of October 14, 2025 - demo; in production, fetch from API or update daily)
  const dailyPriceList = {
    vegetables: [
      { item: 'Baby Marrow', price: 'R 8.00', unit: '/kg' },
      { item: 'Beetroot', price: 'R 12.50', unit: '/kg' },
      { item: 'Broccoli', price: 'R 25.00', unit: '/kg' },
      { item: 'Brussels Sprouts', price: 'R 35.00', unit: '/kg' },
      { item: 'Butternut', price: 'R 9.50', unit: '/kg' },
      { item: 'Cabbage - Green', price: 'R 6.00', unit: '/each' },
      { item: 'Cabbage - Red', price: 'R 8.50', unit: '/each' },
      { item: 'Carrots', price: 'R 10.00', unit: '/kg' },
      { item: 'Cauliflower', price: 'R 18.00', unit: '/each' },
      { item: 'Celery', price: 'R 15.00', unit: '/bunch' },
      { item: 'Chillies', price: 'R 45.00', unit: '/kg' },
      { item: 'Corn', price: 'R 22.00', unit: '/each' },
      { item: 'Cucumber', price: 'R 12.00', unit: '/kg' },
      { item: 'Gem Squash', price: 'R 18.00', unit: '/each' },
      { item: 'Green Beans', price: 'R 28.00', unit: '/kg' },
      { item: 'Green Pepper', price: 'R 25.00', unit: '/kg' },
      { item: 'Leeks', price: 'R 20.00', unit: '/kg' },
      { item: 'Lettuce', price: 'R 9.00', unit: '/head' },
      { item: 'Onions - Brown', price: 'R 11.00', unit: '/kg' },
      { item: 'Onions - Red', price: 'R 15.00', unit: '/kg' },
      { item: 'Patty Pans', price: 'R 22.00', unit: '/kg' },
      { item: 'Potatoes', price: 'R 7.50', unit: '/kg' },
      { item: 'Pumpkin - Crown', price: 'R 5.00', unit: '/kg' },
      { item: 'Red Pepper', price: 'R 30.00', unit: '/kg' },
      { item: 'Spinach - Baby Leaf', price: 'R 18.00', unit: '/200g' },
      { item: 'Spinach - Bunch', price: 'R 12.00', unit: '/bunch' },
      { item: 'Sweet Corn', price: 'R 20.00', unit: '/each' },
      { item: 'Sweet Potato', price: 'R 10.00', unit: '/kg' },
      { item: 'Tomatoes', price: 'R 14.00', unit: '/kg' },
      { item: 'Yellow Pepper', price: 'R 28.00', unit: '/kg' },
      { item: 'Zucchini', price: 'R 16.00', unit: '/kg' }
    ],
    fruits: [
      { item: 'Apples - Golden Delicious', price: 'R 22.00', unit: '/kg' },
      { item: 'Apples - Granny Smith', price: 'R 24.00', unit: '/kg' },
      { item: 'Avocado', price: 'R 35.00', unit: '/each' },
      { item: 'Bananas', price: 'R 18.00', unit: '/kg' },
      { item: 'Grapes - Black Seedless', price: 'R 32.00', unit: '/kg' },
      { item: 'Grapes - Green Seedless', price: 'R 28.00', unit: '/kg' },
      { item: 'Kiwi Fruit', price: 'R 45.00', unit: '/each' },
      { item: 'Lemons', price: 'R 20.00', unit: '/kg' },
      { item: 'Mangoes', price: 'R 25.00', unit: '/each' },
      { item: 'Nectarines', price: 'R 30.00', unit: '/kg' },
      { item: 'Oranges - Navel', price: 'R 15.00', unit: '/kg' },
      { item: 'Pears - Packham', price: 'R 26.00', unit: '/kg' },
      { item: 'Pineapple', price: 'R 28.00', unit: '/each' },
      { item: 'Plums', price: 'R 22.00', unit: '/kg' },
      { item: 'Strawberries', price: 'R 50.00', unit: '/250g' },
      { item: 'Watermelon', price: 'R 8.00', unit: '/kg' }
    ],
    herbs: [
      { item: 'Basil', price: 'R 15.00', unit: '/bunch' },
      { item: 'Coriander', price: 'R 12.00', unit: '/bunch' },
      { item: 'Mint', price: 'R 10.00', unit: '/bunch' },
      { item: 'Parsley', price: 'R 14.00', unit: '/bunch' }
    ]
    // Add more categories if needed (e.g., grains, livestock from real data)
  }

  useEffect(() => {
    loadUserAndData()
  }, [])

  const loadUserAndData = async () => {
    const currentUser = await getCurrentUser()
    setUser(currentUser)
    if (currentUser) {
      await loadData(currentUser.id)
      setupRealtimeSubscriptions(currentUser.id)
    }
  }

  // ... (keep all existing loadData, setupRealtimeSubscriptions, handleLogin, handleSignup, handleLogout, doTopUp, createListing, placeOrder, updatePrice functions from previous version - omitted for brevity)

  const loadData = async (userId) => {
    // Profile for role
    const { data: profileData, error: pErr } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()
    if (pErr) console.error('Profile load error:', pErr)
    setRole(profileData?.role || 'buyer')

    // Wallet
    const { data: walletData, error: wErr } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', userId)
      .single()
    if (wErr && wErr.code !== 'PGRST116') console.error('Wallet load error:', wErr)
    setWallet(walletData || { balance: 0, user_id: userId })

    // Listings (all available)
    const { data: listingsData, error: lErr } = await supabase
      .from('produce')
      .select('*')
      .eq('available', true)
    if (lErr) console.error('Listings error:', lErr)
    setListings(listingsData || [])

    // Compute availability
    const availMap = {}
    listingsData.forEach(listing => {
      if (!availMap[listing.name]) availMap[listing.name] = 0
      availMap[listing.name] += listing.quantity_kg
    })
    setAvailability(availMap)

    // Orders
    const { data: ordersData, error: oErr } = await supabase
      .from('orders')
      .select('*')
      .eq('buyer_id', userId)
      .order('created_at', { ascending: false })
    if (oErr) console.error('Orders error:', oErr)
    setOrders(ordersData || [])

    // Market Prices
    const { data: pricesData, error: prErr } = await supabase
      .from('market_prices')
      .select('*')
      .order('updated_at', { ascending: false })
    if (prErr) console.error('Prices error:', prErr)
    const uniquePrices = pricesData.reduce((acc, price) => {
      if (!acc[price.product]) acc[price.product] = price
      return acc
    }, {})
    setMarketPrices(Object.values(uniquePrices))
  }

  const setupRealtimeSubscriptions = (userId) => {
    supabase
      .channel('listings-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'produce' }, (payload) => {
        loadData(userId)
      })
      .subscribe()

    supabase
      .channel('prices-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'market_prices' }, (payload) => {
        loadData(userId)
      })
      .subscribe()
  }

  const handleLogin = async () => {
    const { error } = await signIn(email, password)
    if (error) return alert('Login failed: ' + error.message)
    setShowLogin(false)
    loadUserAndData()
  }

  const handleSignup = async () => {
    const { data, error } = await signUp(email, password, { full_name: 'Demo User', role: 'buyer' })
    if (error) return alert('Signup failed: ' + error.message)
    await supabase.from('wallets').insert([{ user_id: data.user.id, balance: 0 }])
    setShowSignup(false)
    loadUserAndData()
  }

  const handleLogout = async () => {
    await signOut()
    setUser(null)
    setRole('buyer')
    setListings([])
    setOrders([])
    setWallet({ balance: 0 })
    setMarketPrices([])
    setAvailability({})
  }

  const doTopUp = async () => {
    const amount = parseFloat(topUpAmount)
    if (isNaN(amount) || amount <= 0) return alert('Invalid amount')
    
    const newBalance = wallet.balance + amount
    const { error: wErr } = await supabase
      .from('wallets')
      .upsert({ user_id: user.id, balance: newBalance }, { onConflict: 'user_id' })
    if (wErr) return alert('Top-up failed: ' + wErr.message)

    await supabase.from('transactions').insert([{ wallet_id: wallet.id, type: 'topup', amount, reference: 'Demo top-up' }])

    setWallet({ ...wallet, balance: newBalance })
    setShowTopUp(false)
    setTopUpAmount('')
    alert('Top-up successful! New balance: R' + newBalance)
  }

  const createListing = async () => {
    if (!newListing.name || !newListing.qty || !newListing.price_per_kg) return alert('Fill all fields')

    const payload = {
      farmer_id: user.id,
      name: newListing.name,
      category: 'Vegetables',
      price_per_kg: parseFloat(newListing.price_per_kg),
      quantity_kg: parseFloat(newListing.qty),
      quality_grade: newListing.grade,
      description: '',
      image_url: '',
      available: true
    }

    const { data, error } = await supabase.from('produce').insert([payload]).select()
    if (error) return alert('Create listing failed: ' + error.message)
    setListings(prev => [...prev, ...data])
    setShowNewListing(false)
    setNewListing({ name: '', qty: '', grade: 'A', price_per_kg: '' })
  }

  const placeOrder = async (listing) => {
    const qty = parseFloat(orderQty[listing.id] || 0)
    if (qty <= 0 || qty > listing.quantity_kg) return alert('Invalid quantity')

    const total = qty * listing.price_per_kg
    if (wallet.balance < total) return alert('Insufficient balance')

    const newBalance = wallet.balance - total
    const { error: wErr } = await supabase
      .from('wallets')
      .update({ balance: newBalance })
      .eq('user_id', user.id)
    if (wErr) return alert('Payment failed: ' + wErr.message)

    const orderPayload = {
      buyer_id: user.id,
      farmer_id: listing.farmer_id,
      produce_id: listing.id,
      quantity_kg: qty,
      total_amount: total,
      status: 'confirmed'
    }
    const { data: orderData, error: oErr } = await supabase.from('orders').insert([orderPayload]).select()
    if (oErr) return alert('Order failed: ' + oErr.message)

    const newQty = listing.quantity_kg - qty
    await supabase.from('produce').update({ quantity_kg: newQty, available: newQty > 0 }).eq('id', listing.id)

    await supabase.from('transactions').insert([{ wallet_id: wallet.id, type: 'purchase', amount: -total, reference: `Order ${orderData[0].id}` }])

    setWallet({ ...wallet, balance: newBalance })
    setOrders(prev => [...orderData, ...prev])
    loadData(user.id)
    setOrderQty(prev => ({ ...prev, [listing.id]: '' }))
    alert('Order placed! Total: R' + total)
  }

  const updatePrice = async () => {
    if (!newPrice.product || !newPrice.average_price) return alert('Fill all fields')

    const payload = {
      product: newPrice.product,
      average_price: parseFloat(newPrice.average_price),
      unit: newPrice.unit
    }

    const { error } = await supabase.from('market_prices').insert([payload])
    if (error) return alert('Update price failed: ' + error.message)
    setShowUpdatePrice(false)
    setNewPrice({ product: '', average_price: '', unit: 'kg' })
    loadData(user.id)
  }

  if (!user) {
    return (
      <div className="container">
        <header className="header">
          <div className="logo-section">
            <img src="./src/assets/joburg-logo.png" alt="Joburg Market Logo" className="joburg-logo" /> {/* Replace with actual logo URL */}
            <h1 className="title">Joburg Market</h1>
          </div>
          <div className="nav">
            <button onClick={() => setShowLogin(true)}>Login</button>
            <button onClick={() => setShowSignup(true)}>Signup</button>
          </div>
        </header>
        <main className="main">
          <div className="section">
            <h2>Welcome to Joburg Market PWA</h2>
            <p>Access the modern marketplace for fresh produce. Login or signup to get started.</p>
          </div>
        </main>
        <footer className="footer">
          <p>&copy; 2025 K-Dot Solutions. Powered by K-Dot Solutions for Joburg Market.</p>
          <img src="./src/assets/k-dot-solution.png" alt="K-Dot Solutions Logo" className="kdot-logo" style={{marginTop: '10px', height: '20px'}} /> {/* Replace with actual logo URL */}
        </footer>

        {/* Modals for login/signup - keep existing JSX */}
        {showLogin && (
          <div className="modalMask" onClick={() => setShowLogin(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <h3>Login</h3>
              <div className="formRow"><input className="input" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /></div>
              <div className="formRow"><input className="input" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} /></div>
              <button className="btn" onClick={handleLogin} style={{width: '100%', marginTop: '10px'}}>Login</button>
            </div>
          </div>
        )}
        {showSignup && (
          <div className="modalMask" onClick={() => setShowSignup(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <h3>Signup</h3>
              <div className="formRow"><input className="input" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /></div>
              <div className="formRow"><input className="input" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} /></div>
              <button className="btn" onClick={handleSignup} style={{width: '100%', marginTop: '10px'}}>Signup</button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="container">
      <header className="header">
        <div className="logo-section">
          <img src="./src/assets/joburg-logo.png" alt="Joburg Market Logo" className="joburg-logo" />
          <h1 className="title">Joburg Market</h1>
          <img src="./src/assets/k-dot-solution.png" alt="K-Dot Solutions Logo" className="kdot-logo" />
        </div>
        <div className="nav">
          <span style={{fontWeight: '600'}}>Balance: R{wallet.balance.toFixed(2)}</span>
          <button onClick={() => setShowTopUp(true)}>Top Up</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>
      <main className="main">
        {/* Daily Price List Section - Modern Table */}
        <div className="section">
          <h2>Daily Price List <span style={{color: '#666', fontSize: '16px'}}>(October 14, 2025)</span></h2>
          <p style={{color: '#666', marginBottom: '20px'}}>Fresh produce prices determined by supply, demand, and quality. All transactions via smart card system.</p>
          {Object.entries(dailyPriceList).map(([category, items]) => (
            <div key={category}>
              <h3>{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
              <table className="price-table">
                <thead>
                  <tr className="price-row">
                    <th>Commodity</th>
                    <th>Price</th>
                    <th>Unit</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index} className="price-row">
                      <td className="price-cell">{item.item}</td>
                      <td className="price-value">{item.price}</td>
                      <td className="price-cell">{item.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
          {role === 'admin' && <button className="btn" onClick={() => setShowUpdatePrice(true)} style={{marginTop: '20px'}}>Update Daily Price</button>}
        </div>

        {/* Other Sections - Keep existing with updated styles */}
        <div className="section">
          <h2>Market Prices and Availability</h2>
          {marketPrices.map(price => (
            <div key={price.id} className="listing" style={{marginBottom: '10px'}}>
              <span>{price.product}: <span className="price-value">R{price.average_price}</span> / {price.unit} - Available: <strong>{availability[price.product] || 0} kg</strong></span>
            </div>
          ))}
        </div>

        <div className="section">
          <h2>Available Listings</h2>
          <button className="btn" onClick={() => setShowNewListing(true)}>New Listing</button>
          {listings.map(listing => (
            <div key={listing.id} className="listing">
              <span>{listing.name} ({listing.quality_grade}) - {listing.quantity_kg}kg @ <span className="price-value">R{listing.price_per_kg}</span>/kg</span>
              <div className="formRow">
                <input className="input" style={{width: '80px'}} placeholder="Qty" value={orderQty[listing.id] || ''} onChange={e => setOrderQty(prev => ({ ...prev, [listing.id]: e.target.value }))} />
                <button className="btn" onClick={() => placeOrder(listing)}>Order</button>
              </div>
            </div>
          ))}
        </div>

        <div className="section">
          <h2>Your Orders</h2>
          {orders.map(order => (
            <div key={order.id} className="listing">
              <span>Produce #{order.produce_id}: {order.quantity_kg}kg - <span className="price-value">R{order.total_amount}</span> ({order.status})</span>
            </div>
          ))}
        </div>
      </main>
      <footer className="footer">
        <p>&copy; 2025 K-Dot Solutions. All rights reserved. Developed by <strong>K-Dot Solutions</strong> for Joburg Market.</p>
        <div style={{display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '10px'}}>
          <img src="./src/assets/joburg-logo.png" alt="Joburg Market Logo" style={{height: '30px'}} />
          <img src="./src/assets/k-dot-solution.png" alt="K-Dot Solutions Logo" style={{height: '30px'}} />
        </div>
      </footer>

      {/* Modals - Updated with modern styles */}
      {showTopUp && (
        <div className="modalMask" onClick={() => setShowTopUp(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Top Up Wallet</h3>
            <div className="formRow">
              <input className="input" placeholder="Amount (ZAR)" value={topUpAmount} onChange={e => setTopUpAmount(e.target.value)} style={{flex: 1}} />
              <button className="btn" onClick={doTopUp}>Top Up</button>
            </div>
            <p className="small muted" style={{textAlign: 'center', marginTop: '10px'}}>Demo mode: Adds to Supabase wallet.</p>
          </div>
        </div>
      )}

      {showNewListing && (
        <div className="modalMask" onClick={() => setShowNewListing(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Create Listing</h3>
            <div className="formRow">
              <input className="input" placeholder="Name" value={newListing.name} onChange={e => setNewListing({...newListing, name: e.target.value})} />
              <input className="input" placeholder="Qty (kg)" value={newListing.qty} onChange={e => setNewListing({...newListing, qty: e.target.value})} />
            </div>
            <div className="formRow">
              <select className="input" value={newListing.grade} onChange={e => setNewListing({...newListing, grade: e.target.value})} style={{minWidth: '80px'}}>
                <option>A</option><option>B</option><option>C</option>
              </select>
              <input className="input" placeholder="Price per kg" value={newListing.price_per_kg} onChange={e => setNewListing({...newListing, price_per_kg: e.target.value})} />
            </div>
            <div style={{display: 'flex', gap: 12, justifyContent: 'flex-end'}}>
              <button onClick={() => setShowNewListing(false)} style={{padding: '12px 24px', border: '1px solid #d1d9d9', background: 'white', borderRadius: '8px', cursor: 'pointer'}}>Cancel</button>
              <button className="btn" onClick={createListing}>Create</button>
            </div>
          </div>
        </div>
      )}

      {showUpdatePrice && role === 'admin' && (
        <div className="modalMask" onClick={() => setShowUpdatePrice(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Update Daily Price</h3>
            <div className="formRow">
              <input className="input" placeholder="Product (e.g., Tomatoes)" value={newPrice.product} onChange={e => setNewPrice({...newPrice, product: e.target.value})} style={{flex: 1}} />
            </div>
            <div className="formRow">
              <input className="input" placeholder="Average Price" value={newPrice.average_price} onChange={e => setNewPrice({...newPrice, average_price: e.target.value})} style={{flex: 1}} />
              <input className="input" placeholder="Unit (e.g., kg)" value={newPrice.unit} onChange={e => setNewPrice({...newPrice, unit: e.target.value})} style={{flex: 1}} />
            </div>
            <div style={{display: 'flex', gap: '12px', justifyContent: 'flex-end'}}>
              <button onClick={() => setShowUpdatePrice(false)} style={{padding: '12px 24px', border: '1px solid #d1d9d9', background: 'white', borderRadius: '8px', cursor: 'pointer'}}>Cancel</button>
              <button className="btn" onClick={updatePrice}>Update</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App