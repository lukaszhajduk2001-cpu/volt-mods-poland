"use client";

import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, Bike, CheckCircle, Trash2, X, ChevronLeft, ArrowLeft, Lock, RefreshCw, Plus, List, CreditCard, Copy, Star, Zap, Battery, Cpu, ShieldCheck, Truck, Award, Mail } from 'lucide-react';

// UWAGA: IMPORT Z URL ZOSTAŁ USUNIĘTY - KOD ZGODNY Z VERCEL.

// --- 1. KONFIGURACJA ZMIENNYCH ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// --- DANE (SOCIAL PROOF) ---
const TESTIMONIALS = [
    { id: 1, name: "Marek 'SurRon' K.", text: "Sterownik robi robotę! Mój Sur-Ron w końcu lata na koło jak wściekły. Paczka w 24h.", rating: 5 },
    { id: 2, name: "Patryk W.", text: "Bateria 72V zmieniła ten rower w potwora. Zasięg x2, moc x3. Polecam!", rating: 5 },
    { id: 3, name: "Kacper S.", text: "Najlepszy sklep z częściami w PL. Ceny uczciwe, jakość premium.", rating: 5 },
];

const FEATURES = [
    { icon: <ShieldCheck size={32} />, title: "JAKOŚĆ PREMIUM", desc: "Tylko sprawdzone części. Aluminium lotnicze 7075 i markowe ogniwa." },
    { icon: <Zap size={32} />, title: "CZYSTA MOC", desc: "Podzespoły testowane pod obciążeniem. Gwarancja przyrostu osiągów." },
    { icon: <Truck size={32} />, title: "WYSYŁKA 24H", desc: "Wiemy, że chcesz już jeździć. Zamówienia wysyłamy błyskawicznie." },
];

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

        // --- FIX CENY ---
        const priceValue = parseFloat(newProduct.price.toString().replace(',', '.')); 
        if (isNaN(priceValue)) {
            alert("Wpisz poprawną cenę (użyj kropki lub przecinka jako separatora).");
            setIsAdding(false);
            return;
        }

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
                price: priceValue,
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
                                        <p className="text-slate-500 text-xs mt-1">{order.email} | {order.phone}</p>
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
                                    <option value="silniki">SILNIKI</option>
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
  const [newsletterEmail, setNewsletterEmail] = useState('');
  
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

  // --- LOADER SUPABASE ---
  useEffect(() => {
    const initSupabase = () => {
         if ((window as any).supabase) {
             setSupabaseClient((window as any).supabase.createClient(supabaseUrl, supabaseKey));
         }
    };

    if ((window as any).supabase) {
        initSupabase();
    } else {
        const script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"; 
        script.async = true;
        script.onload = initSupabase;
        document.body.appendChild(script);
    }
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
    if (error) alert("Błąd: " + error.message); else { 
        setCartView('success'); 
        setCart([]); // Wyczyść koszyk
    }
  };

  const handleNewsletterSubmit = (e) => {
      e.preventDefault();
      alert(`Dziękujemy! Adres ${newsletterEmail} został dodany do listy VIP.`);
      setNewsletterEmail('');
  };

  // --- POPRAWIONE FILTROWANIE ---
  const filteredProducts = products.filter(product => {
      if (activeCategory === 'ALL') return true;
      const prodCat = (product.category || '').toLowerCase();
      const prodName = (product.name || '').toLowerCase();
      const target = activeCategory.toLowerCase();

      // 1. Sprawdź czy kategoria w bazie pasuje do wybranej
      if (prodCat === target) return true;
      if (prodCat.includes(target)) return true; 

      // 2. Jeśli produkt nie ma kategorii, sprawdź czy nazwa zawiera słowo kluczowe
      if (!product.category && prodName.includes(target)) return true;

      return false;
  });

  return (
    <div className="min-h-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(163,230,53,0.15),rgba(255,255,255,0))] text-white font-sans selection:bg-lime-400 selection:text-black overflow-x-hidden flex flex-col relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      
      <header className="sticky top-0 z-40 bg-black/60 backdrop-blur-md border-b border-white/10 shadow-lg transition-all duration-300">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div onClick={() => { setView('home'); setActiveCategory('ALL'); }} className="flex items-center gap-3 cursor-pointer group">
             <div className="w-14 h-10 bg-lime-400 text-slate-950 font-black flex items-center justify-center text-sm -skew-x-10 border-2 border-lime-400 group-hover:bg-white group-hover:border-white transition-all shadow-[0_0_20px_rgba(163,230,53,0.5)]">VMP</div>
             <div className="text-xl md:text-3xl font-black text-white tracking-tighter italic skew-x-[-10deg] group-hover:scale-105 transition-transform">VOLT MODS <span className="text-lime-400">POLAND</span></div>
          </div>
          
          <nav className="hidden xl:flex space-x-1 text-xs font-bold bg-white/5 p-1 rounded-lg border border-white/5 backdrop-blur-sm">
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
            <Menu className="xl:hidden text-lime-400 cursor-pointer" onClick={() => setIsMenuOpen(!isMenuOpen)}/>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl p-8 flex flex-col gap-6 items-center justify-center animate-in fade-in zoom-in duration-300">
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
                    <div key={item.uniqueId} className="flex gap-4 bg-white/5 p-3 rounded-xl border border-white/5 items-center hover:border-lime-400/30 transition-all group animate-in slide-in-from-right-10 duration-300">
                        <div className="w-16 h-16 bg-black/50 rounded-lg overflow-hidden flex-shrink-0 border border-white/10">{item.image ? <img src={item.image} className="w-full h-full object-cover"/> : <Bike className="m-auto mt-4 text-slate-600"/>}</div>
                        <div className="flex-1"><h4 className="font-bold text-sm text-white uppercase tracking-wide group-hover:text-lime-400 transition-colors">{item.name}</h4><p className="font-mono text-lime-400/80 text-sm">{item.price} PLN</p></div>
                        <button onClick={() => removeFromCart(item.uniqueId)} className="text-slate-600 hover:text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-all"><Trash2 size={18}/></button>
                    </div>
                ))}</div>
                {cart.length > 0 && <div className="pt-6 border-t border-white/10 mt-auto"><div className="flex justify-between items-end mb-6"><span className="text-slate-400 text-sm font-bold uppercase tracking-widest">SUMA</span><span className="text-3xl font-black text-lime-400">{cart.reduce((t, i) => t + Number(i.price), 0).toFixed(2)} <span className="text-sm text-lime-400/50">PLN</span></span></div><button onClick={() => setCartView('checkout')} className="w-full bg-lime-400 text-black font-black py-4 uppercase tracking-[0.2em] hover:bg-lime-300 transition-all shadow-[0_0_20px_rgba(163,230,53,0.3)] hover:shadow-[0_0_30px_rgba(163,230,53,0.5)] rounded-lg">Płacę</button></div>}
            </div>
        )}
        {cartView === 'checkout' && (
            <form onSubmit={handleSubmitOrder} className="flex-1 flex flex-col p-6 overflow-y-auto space-y-4 animate-in fade-in duration-300">
                <input required name="fullName" placeholder="Imię i Nazwisko" onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-sm focus:border-lime-400 focus:bg-black/50 outline-none transition-all placeholder-slate-600"/>
                <input required name="email" placeholder="Email" onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-sm focus:border-lime-400 focus:bg-black/50 outline-none transition-all placeholder-slate-600"/>
                <input required name="phone" placeholder="Telefon" onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-sm focus:border-lime-400 focus:bg-black/50 outline-none transition-all placeholder-slate-600"/>
                <input required name="address" placeholder="Ulica" onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-sm focus:border-lime-400 focus:bg-black/50 outline-none transition-all placeholder-slate-600"/>
                <div className="flex gap-2"><input required name="zip" placeholder="Kod" onChange={handleInputChange} className="w-1/3 bg-white/5 border border-white/10 rounded-lg p-4 text-sm focus:border-lime-400 focus:bg-black/50 outline-none transition-all placeholder-slate-600"/><input required name="city" placeholder="Miasto" onChange={handleInputChange} className="flex-1 bg-white/5 border border-white/10 rounded-lg p-4 text-sm focus:border-lime-400 focus:bg-black/50 outline-none transition-all placeholder-slate-600"/></div>
                <button type="submit" disabled={isSubmitting} className="w-full bg-lime-400 text-black font-black py-4 uppercase tracking-widest hover:bg-lime-300 transition-all rounded-lg mt-auto shadow-[0_0_20px_rgba(163,230,53,0.2)]">{isSubmitting ? 'Przetwarzanie...' : 'Zamawiam z Obowiązkiem Zapłaty'}</button>
            </form>
        )}
        {cartView === 'success' && (
            <div className="flex-1 flex flex-col items-center p-8 text-center overflow-y-auto animate-in zoom-in duration-300">
                <div className="w-20 h-20 bg-lime-400/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(163,230,53,0.2)]">
                    <CheckCircle size={40} className="text-lime-400"/>
                </div>
                <h2 className="text-3xl font-black text-white italic mb-2 tracking-tighter">ZAMÓWIENIE PRZYJĘTE!</h2>
                <p className="text-slate-400 mb-6 text-sm">Twoje części zostały zarezerwowane. Opłać zamówienie, abyśmy mogli wysłać paczkę.</p>
                
                {/* DANE DO PRZELEWU */}
                <div className="w-full bg-white/5 border border-lime-400/30 rounded-xl p-6 mb-6 text-left relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-10"><CreditCard size={100} /></div>
                    <h3 className="text-lime-400 font-bold uppercase tracking-widest mb-4 border-b border-white/10 pb-2">Dane do przelewu</h3>
                    
                    <div className="space-y-3 font-mono text-sm">
                        <div>
                            <span className="text-slate-500 block text-xs uppercase">Odbiorca:</span>
                            <span className="text-white font-bold text-lg">Volt Mods Poland</span>
                        </div>
                        <div>
                            <span className="text-slate-500 block text-xs uppercase">Numer konta:</span>
                            <div className="flex items-center gap-2">
                                <span className="text-lime-400 font-bold text-xl tracking-wider">PL 12 3456 7890 0000 0000 0000 0000</span>
                                <button onClick={() => navigator.clipboard.writeText("12345678900000000000000000")} className="p-1 hover:text-white text-slate-500"><Copy size={14}/></button>
                            </div>
                        </div>
                        <div>
                            <span className="text-slate-500 block text-xs uppercase">Bank:</span>
                            <span className="text-white">mBank S.A.</span>
                        </div>
                        <div>
                            <span className="text-slate-500 block text-xs uppercase">Tytuł przelewu:</span>
                            <span className="text-white">Zamówienie VMP (Twoje Imię i Nazwisko)</span>
                        </div>
                    </div>
                </div>

                <p className="text-xs text-slate-500 mb-8">Po zaksięgowaniu wpłaty wyślemy do Ciebie potwierdzenie oraz numer śledzenia paczki.</p>

                <button onClick={() => { setIsCartOpen(false); setCartView('items'); }} className="w-full px-8 py-4 border border-lime-400 text-lime-400 font-bold uppercase hover:bg-lime-400 hover:text-black transition-all rounded-lg tracking-widest shadow-[0_0_20px_rgba(163,230,53,0.1)]">
                    Wróć do sklepu
                </button>
            </div>
        )}
      </div>
      {isCartOpen && <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsCartOpen(false)}></div>}

      <main className="container mx-auto px-4 py-12 flex-1 relative z-10">
        {view === 'admin' ? <AdminView onBack={() => setView('home')} supabase={supabaseClient}/> : view === 'home' ? (
          <>
            {/* HERO SECTION PREMIUM */}
            <div className="relative overflow-hidden bg-neutral-900 border border-white/5 p-10 md:p-24 mb-16 rounded-[40px] shadow-2xl group animate-in slide-in-from-bottom-10 fade-in duration-700">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-lime-400/10 rounded-full blur-[120px] -translate-y-1/3 translate-x-1/3 group-hover:bg-lime-400/20 transition-all duration-1000"></div>
                <div className="relative z-10">
                    <div className="inline-block px-4 py-1 mb-6 border border-lime-400/30 rounded-full bg-lime-400/10 backdrop-blur-sm">
                        <span className="text-lime-400 text-xs font-black uppercase tracking-[0.2em]">High Voltage Engineering</span>
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-500 mb-6 tracking-tighter drop-shadow-xl leading-[0.9]">
                        ZBUDUJ <br/><span className="text-lime-400">LEGENDĘ.</span>
                    </h1>
                    <p className="text-slate-400 text-lg md:text-2xl font-light tracking-wide max-w-2xl border-l-4 border-lime-400 pl-8 leading-relaxed">
                        Nie szukaj kompromisów. VMP dostarcza <strong className="text-white">części premium</strong> do Sur-Ron i Talaria, które zmieniają zasady gry.
                    </p>
                </div>
            </div>

            {/* SEKCJA VMP ENGINEERING (DLACZEGO MY) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
                {FEATURES.map((feature, i) => (
                    <div key={i} className="bg-white/5 border border-white/5 p-8 rounded-3xl hover:bg-white/10 transition-colors group">
                        <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center text-lime-400 mb-6 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(163,230,53,0.1)] border border-white/10">
                            {feature.icon}
                        </div>
                        <h3 className="text-xl font-black text-white uppercase tracking-wider mb-2">{feature.title}</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
                    </div>
                ))}
            </div>

            {/* SEKCJA PERFORMANCE CORE (MOC) */}
            <div className="mb-24 relative overflow-hidden rounded-[40px] bg-black border border-white/10 animate-in slide-in-from-bottom-10 fade-in duration-1000 delay-200">
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-transparent z-10"></div>
                <div className="absolute right-0 top-0 h-full w-1/2 bg-lime-900/20 blur-3xl"></div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 p-10 md:p-20 relative z-20 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 text-lime-400 font-bold uppercase tracking-widest text-xs mb-4">
                            <Zap size={14} fill="currentColor"/> Performance Core
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black italic text-white mb-6 leading-none">CZYSTA <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-emerald-500">MOC.</span></h2>
                        <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                            Fabryczna moc to dopiero początek. Odkryj sterowniki wektorowe i baterie 72V na ogniwach Molicel, które wyrywają z butów.
                        </p>
                        <div className="flex gap-4">
                            <button onClick={() => setActiveCategory('baterie')} className="bg-lime-400 text-black px-8 py-4 font-black uppercase tracking-widest hover:bg-white transition-all rounded-xl shadow-[0_0_20px_rgba(163,230,53,0.3)]">
                                Baterie
                            </button>
                            <button onClick={() => setActiveCategory('kontrolery')} className="bg-transparent border border-white/20 text-white px-8 py-4 font-black uppercase tracking-widest hover:bg-white/10 transition-all rounded-xl">
                                Sterowniki
                            </button>
                        </div>
                    </div>
                    <div className="relative h-64 md:h-80 flex items-center justify-center">
                         <div className="w-full max-w-sm bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                            <div className="flex justify-between items-start mb-8">
                                <Cpu size={48} className="text-lime-400"/>
                                <span className="text-xs font-mono text-slate-500">VMP-CTRL-X9000</span>
                            </div>
                            <div className="space-y-4">
                                <div className="h-2 bg-white/10 rounded-full w-3/4"></div>
                                <div className="h-2 bg-white/10 rounded-full w-1/2"></div>
                                <div className="h-2 bg-white/10 rounded-full w-full"></div>
                            </div>
                            <div className="mt-8 pt-8 border-t border-white/10 flex justify-between items-center">
                                <span className="text-white font-bold">TORP / KO</span>
                                <span className="text-lime-400 font-mono text-xl">+400% POWER</span>
                            </div>
                         </div>
                    </div>
                </div>
            </div>
            
            {/* KATEGORIE I PRODUKTY */}
            <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
                <h2 className="text-3xl font-black flex items-center gap-3 tracking-tighter">
                    <span className="text-lime-400 text-4xl">⚡</span> 
                    {activeCategory === 'ALL' ? 'OSTATNIE DROP-Y' : CATEGORIES.find(c => c.id === activeCategory)?.label}
                </h2>
                {activeCategory !== 'ALL' && <span className="bg-lime-400 text-black text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-[0_0_10px_rgba(163,230,53,0.5)]">Filtr Aktywny</span>}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
                {!supabaseClient ? <div className="col-span-4 text-center py-32 text-lime-400 flex flex-col items-center animate-pulse"><RefreshCw className="animate-spin mb-4" size={32}/>Łączenie z bazą VMP...</div> : filteredProducts.length === 0 ? <p className="col-span-4 text-slate-500 text-center py-20 border border-dashed border-white/10 rounded-2xl">Brak sprzętu w tej kategorii. Dodaj go w Adminie!</p> : filteredProducts.map((product) => (
                    <div key={product.id} onClick={() => handleProductClick(product)} className="group bg-neutral-900 border border-white/5 hover:border-lime-400/50 hover:bg-black transition-all duration-300 p-5 relative overflow-hidden transform hover:-translate-y-2 rounded-3xl cursor-pointer flex flex-col shadow-lg hover:shadow-[0_0_30px_rgba(163,230,53,0.15)] animate-in fade-in zoom-in duration-500">
                        <div className="relative aspect-square w-full overflow-hidden mb-5 rounded-2xl bg-black/40 border border-white/5">
                            {product.image_url ? <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" /> : <div className="w-full h-full flex items-center justify-center text-slate-700"><Bike size={48} /></div>}
                            <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-lime-400 border border-lime-400/30 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider">Zobacz</div>
                        </div>
                        <h3 className="text-lg font-black text-white tracking-wide mb-2 uppercase leading-tight group-hover:text-lime-400 transition-colors">{product.name}</h3>
                        <div className="mt-auto flex justify-between items-end border-t border-white/5 pt-4">
                            <span className="font-mono text-xl text-white font-bold">{product.product_variants?.[0]?.price || '???'} <span className="text-xs text-slate-500">PLN</span></span>
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-lime-400 group-hover:text-black transition-colors border border-white/5 group-hover:border-lime-400">
                                <Plus size={18}/>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* SEKCJA GARAŻ VMP (OPINIE) */}
            <div className="border-t border-white/10 pt-24 mb-24">
                 <div className="text-center mb-16">
                     <span className="text-lime-400 text-xs font-black uppercase tracking-[0.2em] mb-4 block">Trusted by Riders</span>
                     <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter text-white">GARAŻ <span className="text-lime-400">VMP</span></h2>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {TESTIMONIALS.map((review, i) => (
                        <div key={review.id} className="bg-neutral-900 p-10 rounded-[32px] border border-white/5 hover:border-lime-400/30 transition-all hover:-translate-y-2 relative group shadow-2xl">
                             <div className="text-lime-400 flex gap-1 mb-6">
                                {[...Array(review.rating)].map((_, i) => <Star key={i} size={18} fill="currentColor"/>)}
                             </div>
                             <p className="text-slate-300 text-lg leading-relaxed mb-8">"{review.text}"</p>
                             <div className="flex items-center gap-4 border-t border-white/5 pt-6">
                                <div className="w-12 h-12 bg-gradient-to-br from-neutral-800 to-black rounded-full flex items-center justify-center font-black text-lime-400 border border-white/10 shadow-inner">{review.name.charAt(0)}</div>
                                <div>
                                    <span className="font-bold text-white uppercase tracking-wide block">{review.name}</span>
                                    <span className="text-xs text-slate-500 uppercase tracking-widest">Zweryfikowany Klient</span>
                                </div>
                             </div>
                        </div>
                    ))}
                 </div>
            </div>

            {/* NEWSLETTER */}
            <div className="bg-lime-400 rounded-[40px] p-10 md:p-20 text-center relative overflow-hidden mb-12 shadow-[0_0_100px_rgba(163,230,53,0.15)]">
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-multiply"></div>
                 <div className="relative z-10 max-w-2xl mx-auto">
                    <Mail size={48} className="mx-auto mb-6 text-black"/>
                    <h2 className="text-4xl md:text-5xl font-black text-black italic tracking-tighter mb-4">DOŁĄCZ DO ELITY.</h2>
                    <p className="text-black/70 text-lg font-medium mb-8">Bądź pierwszy przy dropach limitowanych części i kodach rabatowych. Zero spamu, sama esencja.</p>
                    <form onSubmit={handleNewsletterSubmit} className="flex flex-col md:flex-row gap-4">
                        <input type="email" required placeholder="Twój email" value={newsletterEmail} onChange={(e) => setNewsletterEmail(e.target.value)} className="flex-1 bg-white border-0 rounded-xl p-5 text-black placeholder-black/40 font-bold outline-none ring-4 ring-transparent focus:ring-black/20 transition-all"/>
                        <button type="submit" className="bg-black text-white px-10 py-5 rounded-xl font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-xl">Zapisz Mnie</button>
                    </form>
                 </div>
            </div>
          </>
        ) : <ProductDetailView product={activeProduct} onBack={() => setView('home')} onAddToCart={(p, v) => { addToCart(p, v); setView('home'); }} />}
      </main>

      <footer className="border-t border-white/10 py-16 text-center relative z-10 bg-black mt-12">
        <div className="flex flex-col items-center justify-center gap-6">
            <div className="w-16 h-16 bg-lime-400 text-slate-950 font-black flex items-center justify-center text-sm -skew-x-10 border-4 border-lime-400 shadow-[0_0_30px_rgba(163,230,53,0.4)] transform hover:rotate-12 transition-transform duration-500">VMP</div>
            <div className="text-white font-black italic text-2xl tracking-tighter">VOLT MODS <span className="text-lime-400">POLAND</span></div>
            <div className="flex gap-8 text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mt-4">
                <a href="#" className="hover:text-lime-400 transition-colors">Regulamin</a>
                <a href="#" className="hover:text-lime-400 transition-colors">Dostawa</a>
                <a href="#" className="hover:text-lime-400 transition-colors">Kontakt</a>
            </div>
            <span className="text-slate-600 text-xs mt-8">© 2025 VMP Engineering. All rights reserved.</span>
        </div>
        <button onClick={() => setView('admin')} className="absolute bottom-4 right-4 opacity-5 hover:opacity-100 transition-opacity p-2" title="Panel Administratora"><Lock size={14} className="text-lime-400"/></button>
      </footer>
    </div>
  );
}