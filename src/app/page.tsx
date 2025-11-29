"use client";

import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, Bike, CheckCircle, Trash2, X, ChevronLeft, ArrowLeft, Lock, RefreshCw, Plus, List, CreditCard, Copy, Star, Zap, Battery, Cpu, ShieldCheck, Truck, Mail, User } from 'lucide-react';

// KONFIGURACJA ZMIENNYCH
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// DANE SOCIAL PROOF
const TESTIMONIALS = [
    { id: 1, name: "Marek 'SurRon' K.", text: "Sterownik robi robotę! Mój Sur-Ron w końcu lata na koło jak wściekły.", rating: 5 },
    { id: 2, name: "Patryk W.", text: "Bateria 72V zmieniła ten rower w potwora. Zasięg x2, moc x3. Polecam!", rating: 5 },
    { id: 3, name: "Kacper S.", text: "Najlepszy sklep z częściami w PL. Ceny uczciwe, jakość premium.", rating: 5 },
];

const FEATURES = [
    { icon: <ShieldCheck size={32} />, title: "JAKOŚĆ PREMIUM", desc: "Tylko sprawdzone części. Aluminium lotnicze 7075 i markowe ogniwa." },
    { icon: <Zap size={32} />, title: "CZYSTA MOC", desc: "Podzespoły testowane pod obciążeniem. Gwarancja przyrostu osiągów." },
    { icon: <Truck size={32} />, title: "WYSYŁKA 24H", desc: "Wiemy, że chcesz już jeździć. Zamówienia wysyłamy błyskawicznie." },
];

// --- WIDOK ADMINA (ROZBUDOWANY) ---
const AdminView = ({ onBack, supabase }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');
    
    const [orders, setOrders] = useState<any[]>([]);
    const [adminProducts, setAdminProducts] = useState<any[]>([]);
    
    const [newProduct, setNewProduct] = useState({ name: '', category: 'motocykle', description: '', price: '', image_url: '' });
    const [isAdding, setIsAdding] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        if (password === 'admin123') { setIsAuthenticated(true); fetchData(); } else { alert('Błędne hasło!'); }
    };

    const fetchData = () => { fetchOrders(); fetchProducts(); };

    const fetchOrders = async () => {
        if (!supabase) return;
        setLoading(true);
        const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
        if (error) alert('Błąd zamówień: ' + error.message); else setOrders(data || []);
        setLoading(false);
    };

    const fetchProducts = async () => {
        if (!supabase) return;
        const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
        if (error) alert('Błąd produktów: ' + error.message); else setAdminProducts(data || []);
    };

    const updateStatus = async (id, currentStatus) => {
        if (!supabase) return;
        const nextStatus = currentStatus === 'NOWE' ? 'W REALIZACJI' : currentStatus === 'W REALIZACJI' ? 'WYSŁANE' : 'ZAKOŃCZONE';
        await supabase.from('orders').update({ status: nextStatus }).eq('id', id);
        fetchOrders();
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        if (!supabase) return;
        setIsAdding(true);
        const slug = newProduct.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        const priceValue = parseFloat(newProduct.price.toString().replace(',', '.')); 
        if (isNaN(priceValue)) { alert("Wpisz poprawną cenę."); setIsAdding(false); return; }

        const { data: productData, error: productError } = await supabase.from('products').insert([{ name: newProduct.name, description: newProduct.description, category: newProduct.category, image_url: newProduct.image_url, slug: slug, is_published: true, sku: `VMP-${Math.floor(Math.random() * 10000)}` }]).select().single();
        if (productError) { alert("Błąd: " + productError.message); setIsAdding(false); return; }

        await supabase.from('product_variants').insert([{ product_id: productData.id, color: 'Standard', price: priceValue, stock: 1 }]);
        alert("Produkt dodany!");
        setNewProduct({ name: '', category: 'motocykle', description: '', price: '', image_url: '' });
        fetchProducts();
        setIsAdding(false);
    };

    const handleDeleteProduct = async (id) => {
        if (!confirm("Usunąć produkt trwale?")) return;
        if (!supabase) return;
        await supabase.from('product_variants').delete().eq('product_id', id);
        await supabase.from('products').delete().eq('id', id);
        fetchProducts();
    };

    if (!isAuthenticated) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="bg-black/50 backdrop-blur-xl p-8 rounded-2xl border border-white/10 w-full max-w-md">
                <h2 className="text-3xl font-black text-white mb-6 text-center italic">VMP <span className="text-lime-400">ADMIN</span></h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <input type="password" placeholder="Hasło" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white outline-none focus:border-lime-400"/>
                    <button type="submit" className="w-full bg-lime-400 text-black font-black py-4 rounded-lg hover:bg-lime-300 transition-all">ZALOGUJ</button>
                </form>
                <button onClick={onBack} className="w-full text-slate-500 text-xs mt-6 uppercase hover:text-white">Wróć</button>
            </div>
        </div>
    );

    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-10 border-b border-white/10 pb-6">
                <h1 className="text-3xl font-black italic">PANEL <span className="text-lime-400">ADMINA</span></h1>
                <div className="flex gap-2">
                    <button onClick={() => setActiveTab('orders')} className={`px-4 py-2 font-bold rounded ${activeTab === 'orders' ? 'bg-lime-400 text-black' : 'bg-white/5 text-slate-400'}`}>ZAMÓWIENIA</button>
                    <button onClick={() => setActiveTab('products')} className={`px-4 py-2 font-bold rounded ${activeTab === 'products' ? 'bg-lime-400 text-black' : 'bg-white/5 text-slate-400'}`}>PRODUKTY</button>
                    <button onClick={onBack} className="px-4 py-2 bg-red-500/10 text-red-400 rounded font-bold hover:bg-red-500 hover:text-white transition-all ml-4">WYJDŹ</button>
                </div>
            </div>

            {activeTab === 'orders' ? (
                loading ? <div className="text-center text-lime-400 py-20">Ładowanie...</div> : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white/5 border border-white/10 p-6 rounded-xl hover:border-lime-400/30 transition-all flex flex-col md:flex-row justify-between gap-6">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-full ${
                                            order.status === 'NOWE' ? 'bg-blue-500 text-white' : 
                                            order.status === 'W REALIZACJI' ? 'bg-yellow-500 text-black' : 
                                            order.status === 'WYSŁANE' ? 'bg-green-500 text-white' : 'bg-slate-700'
                                        }`}>{order.status}</span>
                                        <span className="text-slate-500 text-xs font-mono">{new Date(order.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2"><User size={18}/> {order.full_name}</h3>
                                    <p className="text-slate-400 text-sm mt-1">{order.address}</p>
                                    <p className="text-slate-500 text-xs mt-1">{order.email} | {order.phone}</p>
                                    
                                    <div className="mt-4 bg-black/40 p-3 rounded-lg border border-white/5">
                                        {order.items && order.items.map((item, idx) => (
                                            <div key={idx} className="flex justify-between text-sm text-slate-300 py-1 border-b border-white/5 last:border-0">
                                                <span>{item.name} <span className="text-slate-500 text-xs">({item.variantColor})</span></span>
                                                <span className="text-lime-400 font-mono">{item.price} PLN</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex flex-col items-end justify-between min-w-[200px]">
                                    <div className="text-right">
                                        <span className="text-slate-500 text-xs uppercase block">Suma</span>
                                        <span className="text-3xl font-black text-lime-400">{order.total_price} PLN</span>
                                    </div>
                                    <button onClick={() => updateStatus(order.id, order.status)} className="mt-4 w-full bg-white/10 hover:bg-lime-400 hover:text-black border border-white/20 text-white px-4 py-3 rounded-lg font-bold uppercase text-xs transition-all flex items-center justify-center gap-2">
                                        <RefreshCw size={14}/> Zmień Status
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="bg-white/5 p-6 rounded-2xl h-fit border border-white/10">
                        <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2"><Plus size={20} className="text-lime-400"/> DODAJ PRODUKT</h3>
                        <form onSubmit={handleAddProduct} className="space-y-4">
                            <input required placeholder="Nazwa" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-lime-400 outline-none"/>
                            <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-lime-400 outline-none">
                                <option value="motocykle">MOTOCYKLE</option>
                                <option value="podnozki">PODNÓŻKI</option>
                                <option value="baterie">BATERIE</option>
                                <option value="kontrolery">KONTROLERY</option>
                                <option value="silniki">SILNIKI</option>
                                <option value="akcesoria">AKCESORIA</option>
                            </select>
                            <input required type="number" placeholder="Cena (PLN)" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-lime-400 outline-none"/>
                            <input required placeholder="URL Zdjęcia" value={newProduct.image_url} onChange={e => setNewProduct({...newProduct, image_url: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-lime-400 outline-none"/>
                            <textarea required rows={3} placeholder="Opis" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-lime-400 outline-none"/>
                            <button type="submit" disabled={isAdding} className="w-full bg-lime-400 text-black font-black py-4 rounded-lg hover:bg-lime-300 transition-all uppercase">{isAdding ? 'Wysyłanie...' : 'Dodaj'}</button>
                        </form>
                    </div>
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {adminProducts.map(prod => (
                            <div key={prod.id} className="bg-white/5 p-4 rounded-xl border border-white/5 flex gap-4 items-center group hover:bg-white/10">
                                <img src={prod.image_url} className="w-16 h-16 rounded object-cover bg-black"/>
                                <div className="flex-1 overflow-hidden">
                                    <h4 className="font-bold text-white truncate">{prod.name}</h4>
                                    <span className="text-[10px] text-lime-400 uppercase bg-lime-400/10 px-2 py-0.5 rounded">{prod.category}</span>
                                </div>
                                <button onClick={() => handleDeleteProduct(prod.id)} className="text-slate-500 hover:text-red-500 p-2"><Trash2 size={18}/></button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// --- GŁÓWNA STRONA ---
export default function VoltModsApp() {
  const [view, setView] = useState<'home' | 'product' | 'admin'>('home');
  const [activeProduct, setActiveProduct] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartView, setCartView] = useState('items');
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', address: '', city: '', zip: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [supabaseClient, setSupabaseClient] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState('ALL');

  const CATEGORIES = [
      { id: 'ALL', label: 'WSZYSTKIE' },
      { id: 'motocykle', label: 'MOTOCYKLE' },
      { id: 'podnozki', label: 'PODNÓŻKI' },
      { id: 'baterie', label: 'BATERIE' },
      { id: 'kontrolery', label: 'KONTROLERY' },
      { id: 'silniki', label: 'SILNIKI' },
      { id: 'akcesoria', label: 'AKCESORIA' }
  ];

  useEffect(() => {
    const initSupabase = () => { if ((window as any).supabase) setSupabaseClient((window as any).supabase.createClient(supabaseUrl, supabaseKey)); };
    if ((window as any).supabase) initSupabase(); else { const script = document.createElement('script'); script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"; script.async = true; script.onload = initSupabase; document.body.appendChild(script); }
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      if (!supabaseClient) return;
      const { data, error } = await supabaseClient.from('products').select('*, product_variants(*)').order('created_at', { ascending: false });
      if (!error) setProducts(data || []);
    }
    fetchProducts();
  }, [supabaseClient, view]);

  const addToCart = (product, variant) => {
    setCart([...cart, { uniqueId: `${product.id}-${Date.now()}`, productId: product.id, name: product.name, variantColor: variant.color, price: variant.price, image: product.image_url }]);
    setIsCartOpen(true); setCartView('items');
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!supabaseClient) return;
    setIsSubmitting(true);
    await supabaseClient.from('orders').insert([{ full_name: formData.fullName, email: formData.email, phone: formData.phone, address: `${formData.address}, ${formData.zip} ${formData.city}`, total_price: cart.reduce((t, i) => t + Number(i.price), 0), items: cart, status: 'NOWE' }]);
    setIsSubmitting(false); setCartView('success'); setCart([]);
  };

  const filteredProducts = products.filter(product => {
      if (activeCategory === 'ALL') return true;
      const cat = (product.category || '').toLowerCase();
      const target = activeCategory.toLowerCase();
      return cat === target || cat.includes(target) || (!product.category && (product.name || '').toLowerCase().includes(target));
  });

  return (
    <div className="min-h-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(163,230,53,0.15),rgba(255,255,255,0))] text-white font-sans selection:bg-lime-400 selection:text-black overflow-x-hidden flex flex-col relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-black/60 backdrop-blur-md border-b border-white/10 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div onClick={() => { setView('home'); setActiveCategory('ALL'); }} className="flex items-center gap-3 cursor-pointer group">
             <div className="w-14 h-10 bg-lime-400 text-slate-950 font-black flex items-center justify-center text-sm -skew-x-10 border-2 border-lime-400 group-hover:bg-white transition-all">VMP</div>
             <div className="text-xl md:text-3xl font-black text-white italic skew-x-[-10deg]">VOLT MODS <span className="text-lime-400">PL</span></div>
          </div>
          <nav className="hidden xl:flex space-x-1 bg-white/5 p-1 rounded-lg border border-white/5">{CATEGORIES.map(cat => (<button key={cat.id} onClick={() => { setActiveCategory(cat.id); setView('home'); }} className={`px-4 py-2 rounded-md text-xs font-bold uppercase transition-all ${activeCategory === cat.id ? 'bg-lime-400 text-black' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>{cat.label}</button>))}</nav>
          <div className="flex gap-4 items-center">
            <div className="relative cursor-pointer group" onClick={() => setIsCartOpen(true)}><div className="p-2 bg-white/5 rounded-full group-hover:bg-lime-400/20"><ShoppingBag className="text-slate-300 group-hover:text-lime-400"/></div>{cart.length > 0 && (<span className="absolute -top-1 -right-1 bg-lime-400 text-black text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce">{cart.length}</span>)}</div>
            <Menu className="xl:hidden text-lime-400 cursor-pointer" onClick={() => setIsMenuOpen(!isMenuOpen)}/>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      {isMenuOpen && (<div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl p-8 flex flex-col gap-6 items-center justify-center animate-in fade-in"><button onClick={() => setIsMenuOpen(false)} className="absolute top-6 right-6 text-lime-400 p-2"><X size={32}/></button>{CATEGORIES.map(cat => (<button key={cat.id} onClick={() => { setActiveCategory(cat.id); setIsMenuOpen(false); setView('home'); }} className={`text-2xl font-black uppercase ${activeCategory === cat.id ? 'text-lime-400' : 'text-white/50'}`}>{cat.label}</button>))}</div>)}

      {/* KOSZYK */}
      <div className={`fixed inset-y-0 right-0 z-[60] w-full sm:w-[450px] bg-black/95 border-l border-white/10 shadow-2xl transform transition-transform duration-500 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
        <div className="p-6 border-b border-white/10 flex justify-between items-center">{cartView === 'checkout' ? <button onClick={() => setCartView('items')} className="text-slate-400 hover:text-white flex items-center gap-1 uppercase font-bold text-xs"><ChevronLeft size={14}/> Wróć</button> : <h2 className="text-2xl font-black italic">KOSZYK</h2>}<button onClick={() => setIsCartOpen(false)}><X size={24} className="text-slate-400 hover:text-white"/></button></div>
        {cartView === 'items' && <div className="flex-1 flex flex-col p-6 overflow-y-auto">{cart.length === 0 ? <div className="text-center text-slate-500 mt-10">Pusto...</div> : cart.map(item => (<div key={item.uniqueId} className="flex gap-4 bg-white/5 p-3 rounded-xl mb-3 items-center"><img src={item.image} className="w-12 h-12 rounded object-cover"/><div className="flex-1"><h4 className="font-bold text-sm">{item.name}</h4><p className="text-lime-400 text-xs">{item.price} PLN</p></div><button onClick={() => setCart(cart.filter(c => c.uniqueId !== item.uniqueId))} className="text-slate-500 hover:text-red-500"><Trash2 size={16}/></button></div>))}{cart.length > 0 && <div className="mt-auto pt-6 border-t border-white/10"><div className="flex justify-between items-end mb-4"><span className="text-slate-400 uppercase text-xs font-bold">Suma</span><span className="text-3xl font-black text-lime-400">{cart.reduce((t, i) => t + Number(i.price), 0)} PLN</span></div><button onClick={() => setCartView('checkout')} className="w-full bg-lime-400 text-black py-4 font-black uppercase rounded-lg hover:bg-lime-300">Przejdź do płatności</button></div>}</div>}
        {cartView === 'checkout' && <form onSubmit={handleSubmitOrder} className="flex-1 p-6 space-y-4 flex flex-col"><input required name="fullName" placeholder="Imię i Nazwisko" onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white outline-none focus:border-lime-400"/><input required name="email" placeholder="Email" onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white outline-none focus:border-lime-400"/><input required name="phone" placeholder="Telefon" onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white outline-none focus:border-lime-400"/><input required name="address" placeholder="Ulica i numer" onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white outline-none focus:border-lime-400"/><div className="flex gap-2"><input required name="zip" placeholder="Kod" onChange={e => setFormData({...formData, zip: e.target.value})} className="w-1/3 bg-white/5 border border-white/10 rounded-lg p-4 text-white outline-none focus:border-lime-400"/><input required name="city" placeholder="Miasto" onChange={e => setFormData({...formData, city: e.target.value})} className="flex-1 bg-white/5 border border-white/10 rounded-lg p-4 text-white outline-none focus:border-lime-400"/></div><button type="submit" disabled={isSubmitting} className="w-full bg-lime-400 text-black font-black py-4 uppercase rounded-lg mt-auto hover:bg-lime-300">{isSubmitting ? 'Przetwarzanie...' : 'Zamawiam z zapłatą'}</button></form>}
        {cartView === 'success' && <div className="flex-1 p-8 text-center flex flex-col items-center"><CheckCircle size={64} className="text-lime-400 mb-6"/><h2 className="text-3xl font-black italic mb-4">ZAMÓWIENIE PRZYJĘTE!</h2><div className="w-full bg-white/5 border border-lime-400/30 rounded-xl p-6 mb-6 text-left"><h3 className="text-lime-400 font-bold uppercase mb-4 border-b border-white/10 pb-2">Dane do przelewu</h3><div className="space-y-2 font-mono text-sm"><p><span className="text-slate-500 block text-xs">Odbiorca:</span> Volt Mods Poland</p><p><span className="text-slate-500 block text-xs">Nr konta:</span> <span className="text-lime-400 font-bold">PL 12 3456 7890 0000 0000 0000 0000</span></p><p><span className="text-slate-500 block text-xs">Tytuł:</span> Zamówienie VMP (Twoje Nazwisko)</p></div></div><button onClick={() => { setIsCartOpen(false); setCartView('items'); }} className="w-full border border-lime-400 text-lime-400 font-bold py-4 rounded-lg uppercase hover:bg-lime-400 hover:text-black transition-all">Wróć do sklepu</button></div>}
      </div>
      {isCartOpen && <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>}

      {/* GŁÓWNA ZAWARTOŚĆ */}
      <main className="container mx-auto px-4 py-12 flex-1 relative z-10">
        {view === 'admin' ? <AdminView onBack={() => setView('home')} supabase={supabaseClient}/> : view === 'home' ? (
          <>
            {/* HERO */}
            <div className="relative bg-neutral-900 border border-white/5 p-10 md:p-24 mb-16 rounded-[40px] shadow-2xl overflow-hidden group">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-lime-400/10 rounded-full blur-[100px] group-hover:bg-lime-400/20 transition-all duration-1000"></div>
                <div className="relative z-10">
                    <span className="inline-block px-3 py-1 mb-6 border border-lime-400/30 rounded-full bg-lime-400/10 text-lime-400 text-xs font-black uppercase tracking-widest">High Voltage Engineering</span>
                    <h1 className="text-5xl md:text-8xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-500 mb-6 leading-[0.9]">ZBUDUJ <br/><span className="text-lime-400">LEGENDĘ.</span></h1>
                    <p className="text-slate-400 text-lg md:text-xl font-light max-w-2xl border-l-4 border-lime-400 pl-6">Części premium do Sur-Ron i Talaria. Zwiększ moc, zasięg i kontrolę.</p>
                </div>
            </div>

            {/* FEATURES */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
                {FEATURES.map((f, i) => (<div key={i} className="bg-white/5 border border-white/5 p-8 rounded-3xl hover:bg-white/10 transition-colors"><div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center text-lime-400 mb-4 border border-white/10">{f.icon}</div><h3 className="text-lg font-black uppercase mb-2">{f.title}</h3><p className="text-slate-400 text-sm">{f.desc}</p></div>))}
            </div>

            {/* PRODUCTS */}
            <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4"><h2 className="text-3xl font-black flex items-center gap-3"><span className="text-lime-400">⚡</span> {activeCategory === 'ALL' ? 'OSTATNIE DROP-Y' : CATEGORIES.find(c => c.id === activeCategory)?.label}</h2></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
                {!supabaseClient ? <div className="col-span-4 text-center py-20 text-lime-400 animate-pulse">Łączenie z bazą...</div> : filteredProducts.length === 0 ? <p className="col-span-4 text-center py-20 text-slate-500 border border-dashed border-white/10 rounded-2xl">Brak produktów.</p> : filteredProducts.map(p => (
                    <div key={p.id} onClick={() => { setActiveProduct(p); setView('product'); window.scrollTo(0,0); }} className="group bg-neutral-900 border border-white/5 p-4 rounded-3xl cursor-pointer hover:-translate-y-2 transition-transform hover:border-lime-400/50 hover:bg-black">
                        <div className="relative aspect-square w-full rounded-2xl bg-black/40 mb-4 overflow-hidden">{p.image_url ? <img src={p.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/> : <Bike className="m-auto text-slate-700 w-1/2 h-1/2"/>}</div>
                        <h3 className="font-black text-white text-lg uppercase leading-tight mb-2 group-hover:text-lime-400 transition-colors">{p.name}</h3>
                        <div className="flex justify-between items-end border-t border-white/5 pt-3"><span className="font-mono font-bold text-white">{p.product_variants?.[0]?.price} PLN</span><div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-lime-400 group-hover:text-black"><Plus size={16}/></div></div>
                    </div>
                ))}
            </div>

            {/* HALL OF FAME (NOWOŚĆ - GALERIA) */}
            <div className="mb-24">
                <div className="text-center mb-12"><span className="text-lime-400 text-xs font-black uppercase tracking-[0.2em]">Community</span><h2 className="text-4xl md:text-5xl font-black italic text-white">HALL OF <span className="text-lime-400">FAME</span></h2></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-96">
                    <div className="relative rounded-3xl overflow-hidden border border-white/10 group md:col-span-2"><img src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=1000" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/><div className="absolute bottom-0 left-0 p-6 bg-gradient-to-t from-black via-black/50 to-transparent w-full"><span className="text-lime-400 font-black uppercase">Project: BLACKOUT</span></div></div>
                    <div className="grid grid-rows-2 gap-4">
                         <div className="relative rounded-3xl overflow-hidden border border-white/10 group"><img src="https://images.unsplash.com/photo-1517518296538-4b726194b5cb?q=80&w=800" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/><div className="absolute bottom-0 left-0 p-4"><span className="text-white text-xs font-bold uppercase">Rider: Alex</span></div></div>
                         <div className="relative rounded-3xl overflow-hidden border border-white/10 group"><img src="https://images.unsplash.com/photo-1621644781307-a36c69784132?q=80&w=800" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/><div className="absolute bottom-0 left-0 p-4"><span className="text-white text-xs font-bold uppercase">Rider: Mike</span></div></div>
                    </div>
                </div>
            </div>

            {/* REVIEWS & NEWSLETTER */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-white/10 pt-16">
                 <div>
                     <h3 className="text-2xl font-black italic mb-6">OPINIE</h3>
                     <div className="space-y-4">{TESTIMONIALS.map(t => (<div key={t.id} className="bg-white/5 p-6 rounded-2xl border border-white/5"><div className="flex text-lime-400 mb-2">{[...Array(t.rating)].map((_,i)=><Star key={i} size={14} fill="currentColor"/>)}</div><p className="text-slate-300 italic text-sm mb-3">"{t.text}"</p><span className="text-xs font-bold uppercase text-white">{t.name}</span></div>))}</div>
                 </div>
                 <div className="bg-lime-400 rounded-3xl p-10 text-center flex flex-col justify-center relative overflow-hidden">
                     <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-multiply"></div>
                     <div className="relative z-10">
                        <Mail size={40} className="mx-auto mb-4 text-black"/>
                        <h3 className="text-3xl font-black text-black italic mb-2">NEWSLETTER</h3>
                        <p className="text-black/70 font-medium mb-6 text-sm">Zapisz się na dropy limitowanych części.</p>
                        <div className="flex gap-2"><input placeholder="Twój email" className="flex-1 bg-white border-0 rounded-lg p-3 text-black font-bold outline-none"/><button className="bg-black text-white px-6 py-3 rounded-lg font-black uppercase hover:scale-105 transition-transform">Zapisz</button></div>
                     </div>
                 </div>
            </div>
          </>
        ) : (
            <div className="animate-in slide-in-from-right">
                <button onClick={() => setView('home')} className="flex items-center text-slate-400 hover:text-white mb-8 text-xs font-bold uppercase"><ArrowLeft size={16} className="mr-2"/> Powrót</button>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white/5 border border-white/10 p-8 rounded-[40px]">
                    <div className="aspect-square bg-black/40 rounded-3xl overflow-hidden">{activeProduct?.image_url ? <img src={activeProduct.image_url} className="w-full h-full object-cover"/> : <Bike className="m-auto text-slate-700 w-1/2 h-1/2"/>}</div>
                    <div className="flex flex-col justify-center">
                        <span className="text-lime-400 text-xs font-black uppercase tracking-widest mb-4 border border-lime-400/30 px-3 py-1 rounded-full w-fit bg-lime-400/10">{activeProduct?.category}</span>
                        <h1 className="text-5xl font-black text-white italic mb-4 uppercase leading-none">{activeProduct?.name}</h1>
                        <div className="text-4xl font-black text-lime-400 mb-8">{activeProduct?.product_variants?.[0]?.price} PLN</div>
                        <p className="text-slate-400 mb-10 text-lg leading-relaxed">{activeProduct?.description}</p>
                        <button onClick={() => { addToCart(activeProduct, activeProduct.product_variants[0]); setView('home'); }} className="w-full bg-lime-400 text-black py-5 font-black uppercase rounded-xl hover:bg-lime-300 shadow-[0_0_30px_rgba(163,230,53,0.3)] transition-all">Dodaj do koszyka</button>
                    </div>
                </div>
            </div>
        )}
      </main>

      <footer className="border-t border-white/10 py-12 text-center bg-black mt-12 relative z-10">
        <div className="w-12 h-12 bg-lime-400 text-black font-black flex items-center justify-center text-xs -skew-x-10 mx-auto mb-4">VMP</div>
        <p className="text-slate-600 text-xs mb-6">Volt Mods Poland © 2025</p>
        <div className="flex justify-center gap-6 text-xs font-bold uppercase text-slate-500">
            {/* Używamy standardowego tagu <a> dla pewności działania w każdym środowisku */}
            <a href="/regulamin" className="hover:text-lime-400 transition-colors">Regulamin</a>
            <span className="cursor-pointer hover:text-lime-400 transition-colors">Dostawa</span>
            <span className="cursor-pointer hover:text-lime-400 transition-colors">Kontakt</span>
        </div>
        <button onClick={() => setView('admin')} className="absolute bottom-4 right-4 opacity-10 hover:opacity-100 p-2"><Lock size={14}/></button>
      </footer>
    </div>
  );
}