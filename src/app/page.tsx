"use client";

import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, Bike, CheckCircle, Trash2, X, ChevronLeft, ArrowLeft, Lock, RefreshCw, Plus, List } from 'lucide-react';

// UWAGA: CELOWO USUNIĘTO LINIJKE IMPORT { createClient } Z URL, KTÓRA POWODOWAŁA BŁĄD KOMPILACJI NA VERCEL.

// --- 1. KONFIGURACJA ZMIENNYCH ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;


// --- 2. KOMPONENTY WIDOKÓW ---

// --- WIDOK ADMINA ---
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
        if (password === 'admin123') { 
            setIsAuthenticated(true);
            fetchData();
        } else {
            alert('Błędne hasło!');
        }
    };

    const fetchData = () => {
        fetchOrders();
        fetchProducts();
    };

    const fetchOrders = async () => {
        if (!supabase) return;
        setLoading(true);
        const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
        if (error) alert('Błąd zamówień: ' + error.message);
        else setOrders(data || []);
        setLoading(false);
    };

    const fetchProducts = async () => {
        if (!supabase) return;
        const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
        if (error) alert('Błąd produktów: ' + error.message);
        else setAdminProducts(data || []);
    };

    const updateStatus = async (id, newStatus) => {
        if (!supabase) return;
        await supabase.from('orders').update({ status: newStatus }).eq('id', id);
        fetchOrders();
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        if (!supabase) return;
        setIsAdding(true);

        const slug = newProduct.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

        const { data: productData, error: productError } = await supabase
            .from('products')
            .insert([{
                name: newProduct.name,
                description: newProduct.description,
                category: newProduct.category,
                image_url: newProduct.image_url,
                slug: slug,
                is_published: true,
                sku: `VMP-${Math.floor(Math.random() * 10000)}`
            }])
            .select()
            .single();

        if (productError) {
            alert("Błąd: " + productError.message);
            setIsAdding(false);
            return;
        }

        const { error: variantError } = await supabase
            .from('product_variants')
            .insert([{
                product_id: productData.id,
                color: 'Standard',
                price: parseFloat(newProduct.price),
                stock: 1
            }]);

        if (variantError) alert("Błąd ceny: " + variantError.message);
        else {
            alert("Produkt dodany!");
            setNewProduct({ name: '', category: 'motocykle', description: '', price: '', image_url: '' });
            fetchProducts();
        }
        setIsAdding(false);
    };

    const handleDeleteProduct = async (id) => {
        if (!confirm("Usunąć produkt?")) return;
        if (!supabase) return;
        await supabase.from('product_variants').delete().eq('product_id', id);
        await supabase.from('products').delete().eq('id', id);
        fetchProducts();
    };

    if (!isAuthenticated) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="bg-black/50 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(163,230,53,0.1)] w-full max-w-md relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-lime-400 to-transparent"></div>
                    <h2 className="text-3xl font-black text-white mb-6 text-center uppercase italic tracking-widest">VMP <span className="text-lime-400">ADMIN</span></h2>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input type="password" placeholder="Podaj hasło" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white placeholder-slate-500 focus:border-lime-400 focus:bg-black/50 outline-none transition-all"/>
                        <button type="submit" className="w-full bg-lime-400 text-black font-black py-4 uppercase tracking-widest hover:bg-lime-300 hover:shadow-[0_0_20px_rgba(163,230,53,0.4)] transition-all rounded-lg">Wejdź</button>
                    </form>
                    <button onClick={onBack} className="w-full text-slate-500 text-xs mt-6 hover:text-white transition-colors uppercase tracking-widest">Wróć do sklepu</button>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 border-b border-white/10 pb-6 gap-4">
                <h1 className="text-3xl md:text-4xl font-black text-white italic tracking-tighter">ZARZĄDZANIE <span className="text-lime-400">VMP</span></h1>
                <div className="flex gap-2 bg-white/5 p-1 rounded-lg backdrop-blur-sm">
                    <button onClick={() => setActiveTab('orders')} className={`px-6 py-2 font-bold rounded-md text-sm transition-all ${activeTab === 'orders' ? 'bg-lime-400 text-black shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>ZAMÓWIENIA</button>
                    <button onClick={() => setActiveTab('products')} className={`px-6 py-2 font-bold rounded-md text-sm transition-all ${activeTab === 'products' ? 'bg-lime-400 text-black shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>PRODUKTY</button>
                </div>
                <button onClick={onBack} className="text-slate-400 hover:text-lime-400 flex items-center gap-2 text-sm font-bold uppercase tracking-widest"><ArrowLeft size={16}/> Wyjdź</button>
            </div>

            {activeTab === 'orders' ? (
                loading ? <div className="text-center text-lime-400 py-20 animate-pulse">Ładowanie danych...</div> : orders.length === 0 ? <div className="text-center text-slate-500 py-20 border border-dashed border-white/10 rounded-xl">Brak nowych zamówień.</div> : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white/5 border border-white/10 p-6 rounded-xl shadow-lg hover:border-lime-400/30 transition-all">
                                <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-4 border-b border-white/5 pb-4">
                                    <div>
                                        <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ${order.status === 'NOWE' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-white/10 text-slate-400'}`}>{order.status}</span>
                                        <h3 className="text-xl font-bold text-white mt-3">{order.full_name}</h3>
                                        <p className="text-slate-400 text-sm font-mono mt-1">{order.address}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-3xl font-black text-lime-400">{order.total_price} <span className="text-sm text-lime-400/50">PLN</span></p>
                                        {order.status === 'NOWE' && <button onClick={() => updateStatus(order.id, 'WYSŁANE')} className="mt-3 bg-lime-400 text-black px-4 py-2 text-xs font-black uppercase tracking-widest rounded hover:bg-lime-300 hover:shadow-[0_0_15px_rgba(163,230,53,0.3)] transition-all">Oznacz Wysłane</button>}
                                    </div>
                                </div>
                                <div className="bg-black/30 p-4 rounded-lg border border-white/5 space-y-2">
                                    {order.items && order.items.map((item, idx) => (
                                        <div key={idx} className="flex justify-between text-sm text-slate-300 border-b border-white/5 last:border-0 pb-2 last:pb-0"><span>{item.name}</span><span className="font-mono text-lime-400/80">{item.price} PLN</span></div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl h-fit shadow-2xl">
                        <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2 border-b border-white/10 pb-4"><Plus size={20} className="text-lime-400"/> DODAJ SPRZĘT</h3>
                        <form onSubmit={handleAddProduct} className="space-y-4">
                            <div><label className="block text-[10px] uppercase tracking-widest text-slate-400 mb-1">Nazwa</label><input required value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-lime-400 outline-none transition-all"/></div>
                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-slate-400 mb-1">Kategoria</label>
                                <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-lime-400 outline-none transition-all">
                                    <option value="motocykle">MOTOCYKLE ELEKTRYCZNE</option>
                                    <option value="podnozki">PODNÓŻKI</option>
                                    <option value="baterie">BATERIE</option>
                                    <option value="kontrolery">KONTROLERY</option>
                                    <option value="akcesoria">AKCESORIA</option>
                                </select>
                            </div>
                            <div><label className="block text-[10px] uppercase tracking-widest text-slate-400 mb-1">Cena (PLN)</label><input required type="number" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-lime-400 outline-none transition-all"/></div>
                            <div><label className="block text-[10px] uppercase tracking-widest text-slate-400 mb-1">Zdjęcie (URL)</label><input required placeholder="https://..." value={newProduct.image_url} onChange={e => setNewProduct({...newProduct, image_url: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-lime-400 outline-none transition-all"/></div>
                            <div><label className="block text-[10px] uppercase tracking-widest text-slate-400 mb-1">Opis</label><textarea required rows={3} value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-lime-400 outline-none transition-all"/></div>
                            <button type="submit" disabled={isAdding} className="w-full bg-lime-400 text-black font-black py-4 uppercase tracking-widest hover:bg-lime-300 hover:shadow-[0_0_20px_rgba(163,230,53,0.4)] transition-all rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">{isAdding ? 'Dodawanie...' : 'Dodaj do bazy'}</button>
                        </form>
                    </div>
                    <div className="lg:col-span-2 space-y-4">
                        <h3 className="text-xl font-black text-white mb-4 flex items-center gap-2"><List size={20} className="text-lime-400"/> OFERTA ({adminProducts.length})</h3>
                        {adminProducts.map(prod => (
                            <div key={prod.id} className="flex gap-4 bg-white/5 p-4 rounded-xl border border-white/5 items-center hover:bg-white/10 transition-colors group">
                                <div className="w-16 h-16 bg-black/50 rounded-lg overflow-hidden flex-shrink-0 border border-white/10">{prod.image_url ? <img src={prod.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/> : <Bike className="m-auto mt-4 text-slate-600"/>}</div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-white text-lg">{prod.name}</h4>
                                    <span className="text-[10px] text-lime-400 font-bold uppercase bg-lime-400/10 px-2 py-0.5 rounded border border-lime-400/20">{prod.category}</span>
                                </div>
                                <button onClick={() => handleDeleteProduct(prod.id)} className="text-slate-500 hover:text-red-500 hover:bg-red-500/10 p-3 rounded-lg transition-all"><Trash2 size={20}/></button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// --- WIDOK SZCZEGÓŁÓW (PDP) ---
const ProductDetailView = ({ product, onBack, onAddToCart }) => {
  const [selectedVariant, setSelectedVariant] = useState(product.product_variants?.[0] || { price: '???' });
  const hasMultipleVariants = product.product_variants && product.product_variants.length > 1;

  return (
    <div className="animate-in slide-in-from-right duration-500">
      <button onClick={onBack} className="flex items-center text-slate-400 hover:text-white mb-8 transition-colors text-sm font-bold uppercase tracking-widest group"><ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform"/> Powrót do Sklepu</button>
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-1 rounded-3xl shadow-2xl">
         <div className="bg-black/40 rounded-[22px] p-6 md:p-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-white/10 bg-black/50 shadow-inner group">
                {product.image_url ? <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"/> : <div className="w-full h-full flex items-center justify-center text-slate-700"><Bike size={80} /></div>}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-50"></div>
            </div>
            <div className="flex flex-col justify-center">
                <div className="inline-block self-start px-3 py-1 mb-4 border border-lime-400/30 rounded-full bg-lime-400/10">
                    <span className="text-lime-400 text-xs font-black uppercase tracking-widest">{product.category}</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-white uppercase mb-4 italic tracking-tighter leading-none">{product.name}</h1>
                <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-emerald-400 mb-8 border-b border-white/10 pb-8">{selectedVariant?.price || '???'} <span className="text-2xl text-slate-500 font-medium">PLN</span></div>
                
                {hasMultipleVariants && (
                    <div className="mb-8">
                         <label className="text-xs uppercase tracking-widest text-slate-500 mb-3 block">Wybierz wariant</label>
                        <div className="flex gap-3">
                            {product.product_variants.map((variant) => (
                                <button key={variant.id} onClick={() => setSelectedVariant(variant)} className={`h-12 w-12 rounded-lg border-2 flex items-center justify-center transition-all ${selectedVariant.id === variant.id ? 'border-lime-400 bg-white/10 shadow-[0_0_15px_rgba(163,230,53,0.2)]' : 'border-white/10 bg-black/40 hover:border-white/30'}`}>
                                    <div className="w-6 h-6 rounded-full border border-white/20" style={{ backgroundColor: variant.color === 'Czarne' ? '#111' : variant.color === 'Neonowa Czerwień' ? '#ef4444' : variant.color === 'Zielone' ? '#65a30d' : '#3b82f6' }}></div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                <p className="text-slate-300 leading-relaxed mb-10 text-base md:text-lg font-light">{product.description}</p>
                <button onClick={() => onAddToCart(product, selectedVariant)} className="mt-auto w-full bg-lime-400 text-black py-5 font-black uppercase tracking-[0.2em] hover:bg-lime-300 transition-all shadow-[0_0_30px_rgba(163,230,53,0.2)] hover:shadow-[0_0_40px_rgba(163,230,53,0.4)] active:scale-95 rounded-xl text-lg">Dodaj do Koszyka</button>
            </div>
         </div>
      </div>
    </div>
  );
};

// --- GŁÓWNA APLIKACJA ---
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
      { id: 'akcesoria', label: 'AKCESORIA' }
  ];

  useEffect(() => {
    const loadSupabase = async () => {
        if (typeof window !== 'undefined') {
            if ((window as any).supabase) { setSupabaseClient((window as any).supabase.createClient(supabaseUrl, supabaseKey)); return; }
            // Używamy tego API, które Vercel akceptuje: https://cdn.jsdelivr.net/npm/@supabase/supabase-js
            const script = document.createElement('script');
            script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"; 
            script.async = true;
            script.onload = () => { 
                // Klient Supabase jest dostępny globalnie jako 'supabase' po załadowaniu skryptu
                if ((window as any).supabase) {
                     setSupabaseClient((window as any).supabase.createClient(supabaseUrl, supabaseKey)); 
                }
            };
            document.body.appendChild(script);
        }
    };
    loadSupabase();
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      if (!supabaseClient) return;
      const { data, error } = await supabaseClient.from('products').select('*, product_variants(*)').order('created_at', { ascending: false });
      if (error) console.error('Błąd:', error.message); else setProducts(data || []);
    }
    fetchProducts();
  }, [supabaseClient, view]);

  const handleProductClick = (product) => { setActiveProduct(product); setView('product'); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const addToCart = (product, variant) => {
    setCart([...cart, { uniqueId: `${product.id}-${variant.id}-${Date.now()}`, productId: product.id, name: product.name, variantId: variant.id, variantColor: variant.color, price: variant.price, image: product.image_url }]);
    setIsCartOpen(true); setCartView('items');
  };
  const removeFromCart = (uniqueId) => setCart(cart.filter(item => item.uniqueId !== uniqueId));
  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!supabaseClient) return;
    setIsSubmitting(true);
    const { error } = await supabaseClient.from('orders').insert([{ full_name: formData.fullName, email: formData.email, phone: formData.phone, address: `${formData.address}, ${formData.zip} ${formData.city}`, total_price: cart.reduce((t, i) => t + Number(i.price), 0), items: cart, status: 'NOWE' }]);
    setIsSubmitting(false);
    if (error) alert("Błąd: " + error.message); else { setCartView('success'); setCart([]); }
  };

  const filteredProducts = products.filter(product => {
      if (activeCategory === 'ALL') return true;
      const searchStr = (product.category || '' + product.name || '').toLowerCase();
      const normalizedSearch = searchStr.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      return normalizedSearch.includes(activeCategory);
  });

  return (
    <div className="min-h-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(163,230,53,0.15),rgba(255,255,255,0))] text-white font-sans selection:bg-lime-400 selection:text-black overflow-x-hidden flex flex-col relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      
      <header className="sticky top-0 z-40 bg-black/60 backdrop-blur-md border-b border-white/10 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div onClick={() => { setView('home'); setActiveCategory('ALL'); }} className="flex items-center gap-3 cursor-pointer group">
             <div className="w-14 h-10 bg-lime-400 text-slate-950 font-black flex items-center justify-center text-sm -skew-x-10 border-2 border-lime-400 group-hover:bg-white group-hover:border-white transition-all shadow-[0_0_20px_rgba(163,230,53,0.5)]">VMP</div>
             <div className="text-xl md:text-3xl font-black text-white tracking-tighter italic skew-x-[-10deg] group-hover:scale-105 transition-transform">VOLT MODS <span className="text-lime-400">POLAND</span></div>
          </div>
          
          <nav className="hidden md:flex space-x-1 text-xs font-bold bg-white/5 p-1 rounded-lg border border-white/5 backdrop-blur-sm">
            {CATEGORIES.map(cat => (
                <button 
                    key={cat.id} 
                    onClick={() => { setActiveCategory(cat.id); setView('home'); }}
                    className={`px-4 py-2 rounded-md transition-all uppercase tracking-wide ${activeCategory === cat.id ? 'bg-lime-400 text-black shadow-[0_0_15px_rgba(163,230,53,0.3)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                >
                    {cat.label}
                </button>
            ))}
          </nav>

          <div className="flex gap-4 items-center">
            <div className="relative cursor-pointer group" onClick={() => setIsCartOpen(true)}>
                <div className="p-2 bg-white/5 rounded-full group-hover:bg-lime-400/20 transition-colors">
                    <ShoppingBag className="text-slate-300 group-hover:text-lime-400 transition-colors"/>
                </div>
                {cart.length > 0 && (<span className="absolute -top-1 -right-1 bg-lime-400 text-black text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce shadow-lg shadow-lime-400/50">{cart.length}</span>)}
            </div>
            <Menu className="md:hidden text-lime-400 cursor-pointer" onClick={() => setIsMenuOpen(!isMenuOpen)}/>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl p-8 flex flex-col gap-6 items-center justify-center">
            <button onClick={() => setIsMenuOpen(false)} className="absolute top-6 right-6 text-lime-400 p-2 border border-lime-400/30 rounded-full"><X size={32}/></button>
            {CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => { setActiveCategory(cat.id); setIsMenuOpen(false); setView('home'); }} className={`text-2xl font-black uppercase tracking-widest ${activeCategory === cat.id ? 'text-lime-400 scale-110' : 'text-white/50'}`}>
                    {cat.label}
                </button>
            ))}
        </div>
      )}

      {/* KOSZYK */}
      <div className={`fixed inset-y-0 right-0 z-[60] w-full sm:w-[450px] bg-black/80 backdrop-blur-xl border-l border-white/10 shadow-2xl transform transition-transform duration-500 cubic-bezier(0.32, 0.72, 0, 1) ${isCartOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
             {cartView === 'checkout' ? <button onClick={() => setCartView('items')} className="text-slate-400 hover:text-white flex items-center gap-1 text-sm font-bold uppercase tracking-widest"><ChevronLeft size={16}/> Wróć</button> : <h2 className="text-2xl font-black italic text-white tracking-tighter">TWÓJ <span className="text-lime-400">KOSZYK</span></h2>}
            <button onClick={() => setIsCartOpen(false)} className="hover:rotate-90 transition-transform duration-300"><X size={24} className="text-slate-400 hover:text-white"/></button>
        </div>
        {cartView === 'items' && (
            <div className="flex-1 flex flex-col p-6 overflow-hidden">
                <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-lime-400/30 scrollbar-track-transparent">
                    {cart.length === 0 ? <div className="text-center text-slate-500 mt-20 flex flex-col items-center"><ShoppingBag size={48} className="mb-4 opacity-20"/>Koszyk jest pusty.</div> : cart.map((item) => (
                    <div key={item.uniqueId} className="flex gap-4 bg-white/5 p-3 rounded-xl border border-white/5 items-center hover:border-lime-400/30 transition-all group">
                        <div className="w-16 h-16 bg-black/50 rounded-lg overflow-hidden flex-shrink-0 border border-white/10">{item.image ? <img src={item.image} className="w-full h-full object-cover"/> : <Bike className="m-auto mt-4 text-slate-600"/>}</div>
                        <div className="flex-1"><h4 className="font-bold text-sm text-white uppercase tracking-wide group-hover:text-lime-400 transition-colors">{item.name}</h4><p className="font-mono text-lime-400/80 text-sm">{item.price} PLN</p></div>
                        <button onClick={() => removeFromCart(item.uniqueId)} className="text-slate-600 hover:text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-all"><Trash2 size={18}/></button>
                    </div>
                ))}</div>
                {cart.length > 0 && <div className="pt-6 border-t border-white/10 mt-auto"><div className="flex justify-between items-end mb-6"><span className="text-slate-400 text-sm font-bold uppercase tracking-widest">SUMA</span><span className="text-3xl font-black text-lime-400">{cart.reduce((t, i) => t + Number(i.price), 0).toFixed(2)} <span className="text-sm text-lime-400/50">PLN</span></span></div><button onClick={() => setCartView('checkout')} className="w-full bg-lime-400 text-black font-black py-4 uppercase tracking-[0.2em] hover:bg-lime-300 transition-all shadow-[0_0_20px_rgba(163,230,53,0.3)] hover:shadow-[0_0_30px_rgba(163,230,53,0.5)] rounded-lg">Płacę</button></div>}
            </div>
        )}
        {cartView === 'checkout' && (
            <form onSubmit={handleSubmitOrder} className="flex-1 flex flex-col p-6 overflow-y-auto space-y-4">
                <input required name="fullName" placeholder="Imię i Nazwisko" onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-sm focus:border-lime-400 focus:bg-black/50 outline-none transition-all placeholder-slate-600"/>
                <input required name="email" placeholder="Email" onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-sm focus:border-lime-400 focus:bg-black/50 outline-none transition-all placeholder-slate-600"/>
                <input required name="phone" placeholder="Telefon" onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-sm focus:border-lime-400 focus:bg-black/50 outline-none transition-all placeholder-slate-600"/>
                <input required name="address" placeholder="Ulica" onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-sm focus:border-lime-400 focus:bg-black/50 outline-none transition-all placeholder-slate-600"/>
                <div className="flex gap-2"><input required name="zip" placeholder="Kod" onChange={handleInputChange} className="w-1/3 bg-white/5 border border-white/10 rounded-lg p-4 text-sm focus:border-lime-400 focus:bg-black/50 outline-none transition-all placeholder-slate-600"/><input required name="city" placeholder="Miasto" onChange={handleInputChange} className="flex-1 bg-white/5 border border-white/10 rounded-lg p-4 text-sm focus:border-lime-400 focus:bg-black/50 outline-none transition-all placeholder-slate-600"/></div>
                <button type="submit" disabled={isSubmitting} className="w-full bg-lime-400 text-black font-black py-4 uppercase tracking-widest hover:bg-lime-300 transition-all rounded-lg mt-auto shadow-[0_0_20px_rgba(163,230,53,0.2)]">{isSubmitting ? 'Przetwarzanie...' : 'Zamawiam'}</button>
            </form>
        )}
        {cartView === 'success' && <div className="flex-1 flex flex-col items-center justify-center p-8 text-center"><div className="w-20 h-20 bg-lime-400/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(163,230,53,0.2)]"><CheckCircle size={40} className="text-lime-400"/></div><h2 className="text-3xl font-black text-white italic mb-2 tracking-tighter">GOTOWE!</h2><p className="text-slate-400 mb-8">Dzięki za zakupy w VMP.</p><button onClick={() => { setIsCartOpen(false); setCartView('items'); }} className="px-8 py-3 border border-lime-400 text-lime-400 font-bold uppercase hover:bg-lime-400 hover:text-black transition-all rounded-lg tracking-widest">Wróć</button></div>}
      </div>
      {isCartOpen && <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>}

      <main className="container mx-auto px-4 py-12 flex-1 relative z-10">
        {view === 'admin' ? <AdminView onBack={() => setView('home')} supabase={supabaseClient}/> : view === 'home' ? (
          <>
            <div className="relative overflow-hidden bg-gradient-to-br from-white/5 to-transparent border border-white/10 p-10 md:p-20 mb-16 rounded-3xl shadow-2xl group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-lime-400/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-lime-400/30 transition-all duration-1000"></div>
                <div className="relative z-10">
                    <h1 className="text-5xl md:text-8xl font-black italic text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-500 mb-4 tracking-tighter drop-shadow-lg">
                        STWÓRZ <span className="text-lime-400">BESTIĘ</span>
                    </h1>
                    <p className="text-slate-400 text-lg md:text-2xl font-light tracking-wide max-w-2xl border-l-4 border-lime-400 pl-6">
                        Premium części i modyfikacje do <strong className="text-white">Sur-Ron</strong> oraz <strong className="text-white">Talaria</strong>. Zbuduj maszynę marzeń.
                    </p>
                </div>
            </div>
            
            <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
                <h2 className="text-3xl font-black flex items-center gap-3 tracking-tighter">
                    <span className="text-lime-400 text-4xl">⚡</span> 
                    {activeCategory === 'ALL' ? 'OSTATNIE DROP-Y' : CATEGORIES.find(c => c.id === activeCategory)?.label}
                </h2>
                {activeCategory !== 'ALL' && <span className="bg-lime-400 text-black text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-[0_0_10px_rgba(163,230,53,0.5)]">Filtr Aktywny</span>}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {!supabaseClient ? <div className="col-span-4 text-center py-32 text-lime-400 flex flex-col items-center animate-pulse"><RefreshCw className="animate-spin mb-4" size={32}/>Łączenie z bazą VMP...</div> : filteredProducts.length === 0 ? <p className="col-span-4 text-slate-500 text-center py-20 border border-dashed border-white/10 rounded-2xl">Brak sprzętu w tej kategorii. Dodaj go w Adminie!</p> : filteredProducts.map((product) => (
                    <div key={product.id} onClick={() => handleProductClick(product)} className="group bg-white/5 border border-white/5 hover:border-lime-400/50 hover:bg-black/60 backdrop-blur-sm transition-all duration-300 p-5 relative overflow-hidden transform hover:-translate-y-2 rounded-2xl cursor-pointer flex flex-col shadow-lg hover:shadow-[0_0_30px_rgba(163,230,53,0.15)]">
                        <div className="relative aspect-square w-full overflow-hidden mb-5 rounded-xl bg-black/40 border border-white/5">
                            {product.image_url ? <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" /> : <div className="w-full h-full flex items-center justify-center text-slate-700"><Bike size={48} /></div>}
                            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-lime-400 border border-lime-400/30 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider">Zobacz</div>
                        </div>
                        <h3 className="text-lg font-black text-white tracking-wide mb-2 uppercase leading-tight group-hover:text-lime-400 transition-colors">{product.name}</h3>
                        <div className="mt-auto flex justify-between items-end border-t border-white/10 pt-4">
                            <span className="font-mono text-xl text-white font-bold">{product.product_variants?.[0]?.price || '???'} <span className="text-xs text-slate-500">PLN</span></span>
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-lime-400 group-hover:text-black transition-colors">
                                <Plus size={16}/>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
          </>
        ) : <ProductDetailView product={activeProduct} onBack={() => setView('home')} onAddToCart={(p, v) => { addToCart(p, v); setView('home'); }} />}
      </main>

      <footer className="border-t border-white/10 py-12 text-center relative z-10 bg-black/40 backdrop-blur-lg mt-12">
        <div className="flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 bg-lime-400 text-slate-950 font-black flex items-center justify-center text-xs -skew-x-10 border-2 border-lime-400 shadow-[0_0_15px_rgba(163,230,53,0.3)]">VMP</div>
            <span className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">Volt Mods Poland © 2025</span>
        </div>
        <button onClick={() => setView('admin')} className="absolute bottom-4 right-4 opacity-10 hover:opacity-100 transition-opacity p-2" title="Panel Administratora"><Lock size={14} className="text-lime-400"/></button>
      </footer>
    </div>
  );
}