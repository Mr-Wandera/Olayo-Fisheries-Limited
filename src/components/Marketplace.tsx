import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, CartItem, Order, UserProfile } from '../types';
import { Search, ShoppingCart, Heart, Plus, Minus, X, Shield, CircleCheck as CheckCircle2, ChevronRight, Download, Package, TrendingUp, TrendingDown, Sparkles, BrainCircuit, MapPin, Clock, Gauge, Fish, ChefHat, DollarSign, ArrowRight, Activity, Zap, Eye, Star, ListFilter as Filter, SlidersHorizontal, Leaf, Snowflake, Truck, Navigation, Thermometer, Droplets, Anchor, Award, Utensils } from 'lucide-react';

interface MarketplaceProps {
  products: Product[];
  currentUser: UserProfile;
  onOrderCompleted: (order: Order) => void;
  onProductsUpdated: () => void;
  onAskOI?: (prompt: string) => void;
}

export default function Marketplace({ products, currentUser, onOrderCompleted, onProductsUpdated, onAskOI }: MarketplaceProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'sustainability' | 'price' | 'freshness' | 'demand'>('demand');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'none' | 'shipping' | 'confirmation'>('none');
  const [shippingName, setShippingName] = useState(currentUser.name);
  const [shippingAddress, setShippingAddress] = useState('Kampala Road, Kampala, Uganda');
  const [shippingPhone, setShippingPhone] = useState(currentUser.phone || '+256 700 000 000');
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [showDemandForecast, setShowDemandForecast] = useState(true);
  const [exchangeView, setExchangeView] = useState<'grid' | 'list'>('grid');

  const filteredProducts = useMemo(() => {
    let list = [...products];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) || p.scientificName.toLowerCase().includes(q) ||
        p.origin.toLowerCase().includes(q) || p.method.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }
    if (selectedCategory !== 'all') list = list.filter(p => p.category === selectedCategory);
    if (sortBy === 'sustainability') list.sort((a, b) => b.sustainabilityScore - a.sustainabilityScore);
    else if (sortBy === 'price') list.sort((a, b) => a.price - b.price);
    else if (sortBy === 'freshness') {
      const score = (s: string) => s === 'prime' ? 3 : s === 'excellent' ? 2 : 1;
      list.sort((a, b) => score(b.freshnessStatus) - score(a.freshnessStatus));
    } else if (sortBy === 'demand') {
      const demand = (p: Product) => (p.sustainabilityScore * 0.3 + (p.availability === 'in-stock' ? 50 : 20) + (100 - p.price * 2));
      list.sort((a, b) => demand(b) - demand(a));
    }
    return list;
  }, [products, searchQuery, selectedCategory, sortBy]);

  const addToCart = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { product, quantity: 1 }];
    });
    setRecentlyViewed(prev => { const f = prev.filter(id => id !== product.id); return [product.id, ...f].slice(0, 4); });
  };

  const updateQuantity = (productId: string, amount: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const n = item.quantity + amount;
        return n > 0 ? { ...item, quantity: n } : null;
      }
      return item;
    }).filter((i): i is CartItem => i !== null));
  };

  const cartTotal = useMemo(() => cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0), [cart]);

  const toggleFavorite = (productId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavorites(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
  };

  const openDetails = (product: Product) => {
    setDetailProduct(product);
    setRecentlyViewed(prev => { const f = prev.filter(id => id !== product.id); return [product.id, ...f].slice(0, 4); });
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutStep('confirmation');
    const orderPayload = { userId: currentUser.id, userName: shippingName, items: cart, total: cartTotal };
    try {
      const res = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(orderPayload) });
      const data = await res.json();
      if (data.success) {
        setPlacedOrder(data.order);
        onOrderCompleted(data.order);
        onProductsUpdated();
        setCart([]);
      }
    } catch (err) { console.error('Checkout error:', err); }
  };

  const recentProducts = products.filter(p => recentlyViewed.includes(p.id));

  return (
    <div className="space-y-6 relative">
      {/* AI Demand forecast banner */}
      <AnimatePresence>
        {showDemandForecast && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="glass-luminous rounded-3xl p-5 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl animate-breathe" />
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-400/30"
                >
                  <BrainCircuit className="w-5 h-5 text-amber-300" />
                </motion.div>
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-amber-400/70 mb-1">OI Market Intelligence</div>
                  <p className="text-sm text-white font-semibold">Tilapia demand up 3.2% in Kampala this week</p>
                  <p className="text-xs text-slate-400 mt-0.5">Recommended action: hold inventory for 48h to capture premium pricing</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onAskOI?.('Review marketplace pricing and suggest adjustments based on demand.')}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-semibold hover:bg-amber-500/25 transition-all"
                >
                  Review pricing
                </button>
                <button onClick={() => setShowDemandForecast(false)} className="p-1.5 rounded-lg text-slate-500 hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search & Filter Bar */}
      <div className="glass rounded-2xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-cyan-400" />
            <input
              type="text"
              placeholder="Search aquaculture products by species, category, or origin..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-cyan-500/10 focus:border-cyan-400 rounded-xl py-2 pl-10 pr-4 text-xs text-white placeholder-slate-500 outline-none transition-all"
            />
          </div>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="bg-slate-950 border border-cyan-500/10 rounded-xl px-3 py-2 text-xs text-cyan-200 outline-none focus:border-cyan-400">
            <option value="all">All Categories</option>
            <option value="Aquaculture">Fresh Fish (Tilapia, Perch)</option>
            <option value="Value-Added">Value-Added (Smoked, Processed)</option>
            <option value="Fingerlings">Fingerlings</option>
            <option value="Organic">Feed & Fertilizer</option>
          </select>
          <div className="flex gap-2">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="flex-1 bg-slate-950 border border-cyan-500/10 rounded-xl px-3 py-2 text-xs text-cyan-200 outline-none focus:border-cyan-400">
              <option value="demand">OI Demand Forecast</option>
              <option value="sustainability">Sustainability Index</option>
              <option value="price">Price (Lowest)</option>
              <option value="freshness">Freshness Status</option>
            </select>
            <button
              onClick={() => setExchangeView(v => v === 'grid' ? 'list' : 'grid')}
              className="p-2 rounded-xl bg-slate-950 border border-cyan-500/10 text-cyan-400 hover:bg-cyan-500/10 transition-all"
            >
              {exchangeView === 'grid' ? <Filter className="w-4 h-4" /> : <SlidersHorizontal className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-display font-semibold text-white text-base flex items-center gap-2">
              <Fish className="w-4 h-4 text-cyan-400" /> Aquaculture Exchange
              <span className="text-[10px] font-mono text-slate-500">· {filteredProducts.length} species</span>
            </h3>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 transition-all flex items-center gap-1.5 text-xs font-semibold"
            >
              <ShoppingCart className="w-4 h-4" /> Cart
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-orange-500 border border-slate-950 rounded-full text-[10px] font-mono text-white flex items-center justify-center font-bold">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>

          <div className={exchangeView === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4" : "space-y-3"}>
            {filteredProducts.map((p, i) => {
              const isFav = favorites.includes(p.id);
              const demandScore = Math.min(100, Math.round(p.sustainabilityScore * 0.3 + (p.availability === 'in-stock' ? 50 : 20)));
              return (
                <ProductCard
                  key={p.id}
                  product={p}
                  index={i}
                  isFav={isFav}
                  demandScore={demandScore}
                  view={exchangeView}
                  onToggleFav={toggleFavorite}
                  onOpen={openDetails}
                  onAdd={addToCart}
                />
              );
            })}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <RecentlyViewedPanel products={recentProducts} onOpen={openDetails} />
          <ColdChainStamp />
          <AIBuyingAssistant onAskOI={onAskOI} />
        </div>
      </div>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={() => { setIsCartOpen(false); setCheckoutStep('none'); }} />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="relative w-full max-w-md glass-strong border-l border-cyan-500/20 h-screen shadow-2xl flex flex-col justify-between"
            >
              <div className="p-5 border-b border-cyan-500/20 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-display text-white font-bold text-base">Biological Cargo Manifest</h3>
                </div>
                <button onClick={() => { setIsCartOpen(false); setCheckoutStep('none'); }} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5">
                {checkoutStep === 'none' ? (
                  cart.length > 0 ? (
                    <div className="space-y-3">
                      {cart.map(item => (
                        <div key={item.product.id} className="flex justify-between items-center bg-slate-950/40 border border-cyan-500/10 p-3 rounded-xl gap-3">
                          <img src={item.product.image} alt={item.product.name} className="w-12 h-12 object-cover rounded-lg" />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold text-white truncate">{item.product.name}</div>
                            <div className="text-[10px] text-cyan-400 font-mono">${item.product.price.toFixed(2)}/{item.product.unit}</div>
                          </div>
                          <div className="flex items-center gap-2 bg-slate-900 px-2 py-1 rounded-lg border border-cyan-500/10">
                            <button onClick={() => updateQuantity(item.product.id, -1)} className="text-cyan-300 hover:text-white"><Minus className="w-3 h-3" /></button>
                            <span className="font-mono text-xs text-white px-1">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.product.id, 1)} className="text-cyan-300 hover:text-white"><Plus className="w-3 h-3" /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 text-slate-400 text-xs font-sans">
                      Your cargo manifest is empty. Add items from the exchange.
                    </div>
                  )
                ) : checkoutStep === 'shipping' ? (
                  <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                    <h4 className="font-display text-sm font-semibold text-white">Logistics Destination</h4>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-cyan-400/60 uppercase">Consignee Name</label>
                      <input type="text" required value={shippingName} onChange={(e) => setShippingName(e.target.value)} className="w-full bg-slate-950 border border-cyan-500/10 focus:border-cyan-400 rounded-xl py-2 px-3 text-xs text-white outline-none" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-cyan-400/60 uppercase">Delivery Address</label>
                      <input type="text" required value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} className="w-full bg-slate-950 border border-cyan-500/10 focus:border-cyan-400 rounded-xl py-2 px-3 text-xs text-white outline-none" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-cyan-400/60 uppercase">Phone</label>
                      <input type="text" required value={shippingPhone} onChange={(e) => setShippingPhone(e.target.value)} className="w-full bg-slate-950 border border-cyan-500/10 focus:border-cyan-400 rounded-xl py-2 px-3 text-xs text-white outline-none" />
                    </div>
                    <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-[10px] font-mono text-cyan-300 leading-normal flex items-start gap-2">
                      <Shield className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      Cold chain certified transport. NFC-tagged traceability from cage to doorstep.
                    </div>
                    <button type="submit" className="w-full py-2.5 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold hover:bg-cyan-400 flex items-center justify-center gap-1">
                      Authenticate Dispatch <ChevronRight className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  placedOrder && (
                    <div className="space-y-6 text-center py-6">
                      <motion.div
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto"
                      >
                        <CheckCircle2 className="w-8 h-8" />
                      </motion.div>
                      <div>
                        <h4 className="font-display font-bold text-white text-base">Cargo Dispatched & Verified!</h4>
                        <p className="text-xs text-slate-400 mt-1">Invoice ID: <span className="font-mono text-cyan-400 font-bold">{placedOrder.id}</span></p>
                      </div>
                      {/* Animated packaging line */}
                      <div className="bg-slate-950/60 border border-emerald-500/20 rounded-xl p-4 text-left space-y-2">
                        <div className="flex items-center gap-2 mb-2">
                          <Package className="w-4 h-4 text-cyan-400" />
                          <div className="text-[10px] font-mono text-cyan-300 uppercase">Packaging Line Log</div>
                        </div>
                        <div className="space-y-1 text-[11px] font-mono text-slate-300">
                          {['Box Assembly', 'Vacuum Seal', 'NFC Tag Linkage', 'Cold Chain Verification'].map((step, si) => (
                            <motion.div
                              key={step}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: si * 0.2 }}
                              className="flex justify-between items-center"
                            >
                              <span>{step}</span>
                              <span className="text-emerald-400 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                {si === 1 ? 'SEALED [-24°C]' : 'COMPLETE'}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <a href={placedOrder.invoiceUrl} target="_blank" rel="noreferrer" className="w-full py-2.5 rounded-xl border border-cyan-500/30 bg-slate-950 text-cyan-300 hover:bg-slate-900 transition-all text-xs font-semibold flex justify-center items-center gap-1.5">
                          <Download className="w-4 h-4" /> Download Invoice
                        </a>
                        <button onClick={() => { setIsCartOpen(false); setCheckoutStep('none'); setPlacedOrder(null); }} className="w-full py-2 rounded-xl text-slate-400 hover:text-white text-xs font-semibold">
                          Keep Browsing
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>

              {checkoutStep === 'none' && cart.length > 0 && (
                <div className="p-5 border-t border-cyan-500/20 bg-slate-950/60 space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Subtotal:</span>
                    <span className="font-mono text-cyan-400 font-bold text-base">${cartTotal.toFixed(2)} USD</span>
                  </div>
                  <button onClick={() => setCheckoutStep('shipping')} className="w-full py-2.5 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold hover:bg-cyan-400 flex items-center justify-center gap-1">
                    Proceed to Dispatch <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {detailProduct && (
          <ProductDetailModal product={detailProduct} onClose={() => setDetailProduct(null)} onAddToCart={(p) => { addToCart(p); setDetailProduct(null); setIsCartOpen(true); }} onAskOI={onAskOI} />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ============ PRODUCT CARD — premium exchange card ============ */
function ProductCard({ product, index, isFav, demandScore, view, onToggleFav, onOpen, onAdd }: {
  product: Product; index: number; isFav: boolean; demandScore: number; view: string;
  onToggleFav: (id: string, e?: React.MouseEvent) => void;
  onOpen: (p: Product) => void;
  onAdd: (p: Product, e?: React.MouseEvent) => void;
}) {
  if (view === 'list') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.03, type: 'spring', stiffness: 200, damping: 25 }}
        whileHover={{ y: -2 }}
        onClick={() => onOpen(product)}
        className="glass rounded-2xl overflow-hidden cursor-pointer group flex items-center gap-4 p-3"
      >
        <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-950 shrink-0">
          <img src={product.image} alt={product.name} referrerPolicy="no-referrer" className="w-full h-full object-cover brightness-90 group-hover:scale-105 transition-transform duration-500" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-display font-bold text-white text-sm line-clamp-1 group-hover:text-cyan-300 transition-colors">{product.name}</h4>
              <p className="text-[10px] font-mono text-slate-400 italic">{product.scientificName}</p>
            </div>
            <div className="text-right shrink-0">
              <span className="font-mono text-cyan-400 font-bold text-sm">${product.price.toFixed(2)}</span>
              <span className="text-[10px] text-slate-400">/{product.unit}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-2 text-[10px] font-mono">
            <span className="flex items-center gap-1 text-emerald-400"><Leaf className="w-3 h-3" /> {product.sustainabilityScore}</span>
            <span className="flex items-center gap-1 text-cyan-400"><Snowflake className="w-3 h-3" /> {product.currentTemp.toFixed(1)}°C</span>
            <span className="flex items-center gap-1 text-amber-400"><TrendingUp className="w-3 h-3" /> {demandScore}</span>
            <span className="flex items-center gap-1 text-slate-400"><MapPin className="w-3 h-3" /> {product.origin}</span>
          </div>
        </div>
        <button
          onClick={(e) => onAdd(product, e)}
          className="px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 text-[11px] font-bold hover:bg-cyan-400 flex items-center gap-1 shrink-0"
        >
          <Plus className="w-3 h-3" /> Add
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.04, type: 'spring', stiffness: 200, damping: 25 }}
      whileHover={{ y: -4 }}
      onClick={() => onOpen(product)}
      className="glass rounded-2xl overflow-hidden cursor-pointer group relative"
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-slate-950">
        <img src={product.image} alt={product.name} referrerPolicy="no-referrer" className="w-full h-full object-cover brightness-90 group-hover:scale-105 transition-transform duration-500" />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          <span className="text-[9px] font-mono font-bold bg-slate-950/85 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded-full backdrop-blur flex items-center gap-1">
            <Leaf className="w-2.5 h-2.5" /> {product.sustainabilityScore}/100
          </span>
          <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full backdrop-blur uppercase flex items-center gap-1 ${product.freshnessStatus === 'prime' ? 'bg-amber-500/25 border border-amber-400/30 text-amber-300' : 'bg-cyan-500/25 border border-cyan-400/30 text-cyan-300'}`}>
            <Award className="w-2.5 h-2.5" /> {product.freshnessStatus}
          </span>
        </div>
        <button
          onClick={(e) => onToggleFav(product.id, e)}
          className={`absolute top-2.5 right-2.5 p-1.5 rounded-full bg-slate-950/60 border border-white/10 text-white hover:text-red-400 transition-colors ${isFav ? 'text-red-500 bg-slate-950 border-red-500/20' : ''}`}
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
        </button>
        {/* Demand indicator */}
        <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-950/85 border border-cyan-400/30 backdrop-blur">
          <TrendingUp className="w-2.5 h-2.5 text-emerald-400" />
          <span className="text-[9px] font-mono text-emerald-400 font-bold">{demandScore}</span>
        </div>
        {/* Cold chain temp */}
        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-950/85 border border-blue-400/30 backdrop-blur">
          <Snowflake className="w-2.5 h-2.5 text-blue-400" />
          <span className="text-[9px] font-mono text-blue-400 font-bold">{product.currentTemp.toFixed(1)}°C</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex justify-between items-start">
            <h4 className="font-display font-bold text-white text-sm line-clamp-1 group-hover:text-cyan-300 transition-colors">{product.name}</h4>
            <div className="text-right shrink-0">
              <span className="font-mono text-cyan-400 font-bold text-sm">${product.price.toFixed(2)}</span>
              <span className="text-[10px] text-slate-400">/{product.unit}</span>
            </div>
          </div>
          <p className="text-[11px] font-mono text-slate-400 italic mt-0.5">{product.scientificName}</p>
          <p className="text-xs text-slate-300 font-sans line-clamp-2 mt-2 leading-normal">{product.description}</p>
        </div>
        {/* Traceability strip */}
        <div className="flex items-center gap-2 text-[9px] font-mono text-slate-500">
          <Anchor className="w-3 h-3 text-cyan-400" />
          <span className="truncate">{product.method}</span>
          <span className="text-slate-600">·</span>
          <MapPin className="w-3 h-3 text-cyan-400" />
          <span className="truncate">{product.origin}</span>
        </div>
        <div className="border-t border-cyan-500/10 pt-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => onToggleFav(product.id, e)}
              className={`p-1.5 rounded-lg border transition-all ${isFav ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' : 'bg-slate-950/40 border-cyan-500/10 text-slate-400 hover:text-orange-400'}`}
            >
              <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
            </button>
            <span className={`text-[9px] font-mono px-2 py-1 rounded-full ${product.availability === 'in-stock' ? 'bg-emerald-950 text-emerald-400' : product.availability === 'low-stock' ? 'bg-amber-950 text-amber-400' : 'bg-red-950 text-red-400'}`}>
              {product.availability}
            </span>
          </div>
          <button
            onClick={(e) => onAdd(product, e)}
            className="px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 text-[11px] font-bold hover:bg-cyan-400 flex items-center gap-1 shadow-md shadow-cyan-500/10"
          >
            <Plus className="w-3 h-3" /> Add
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ============ RECENTLY VIEWED ============ */
function RecentlyViewedPanel({ products, onOpen }: { products: Product[]; onOpen: (p: Product) => void }) {
  return (
    <div className="glass rounded-2xl p-4">
      <h4 className="font-display font-semibold text-white text-xs border-b border-cyan-500/15 pb-2 mb-3">Recently Viewed</h4>
      {products.length > 0 ? (
        <div className="space-y-2">
          {products.map(rp => (
            <div key={rp.id} onClick={() => onOpen(rp)} className="flex items-center gap-3 bg-slate-950/40 border border-cyan-500/5 hover:border-cyan-500/20 p-2 rounded-xl cursor-pointer transition-all">
              <img src={rp.image} alt={rp.name} className="w-10 h-10 object-cover rounded-lg" />
              <div className="min-w-0">
                <div className="text-[11px] text-white font-semibold line-clamp-1">{rp.name}</div>
                <div className="text-[10px] text-cyan-400 font-mono">${rp.price.toFixed(2)}/{rp.unit}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-[10px] text-slate-400 text-center py-4">No recent viewings recorded.</div>
      )}
    </div>
  );
}

/* ============ COLD CHAIN STAMP ============ */
function ColdChainStamp() {
  return (
    <div className="glass-luminous rounded-2xl p-4 space-y-2">
      <div className="flex items-center gap-2">
        <Snowflake className="w-5 h-5 text-blue-400" />
        <h4 className="font-display font-semibold text-white text-xs">Cold Chain Certified</h4>
      </div>
      <p className="text-[11px] text-cyan-100/60 leading-relaxed font-sans">
        All products carry temperature logs from Busia Processing Hub. NFC-tagged for full traceability from cage to customer.
      </p>
      <div className="flex items-center gap-2 text-[9px] font-mono text-slate-500">
        <Truck className="w-3 h-3 text-cyan-400" /> Busia → Kampala
        <span className="text-slate-600">·</span>
        <Thermometer className="w-3 h-3 text-blue-400" /> -24°C maintained
      </div>
    </div>
  );
}

/* ============ AI BUYING ASSISTANT ============ */
function AIBuyingAssistant({ onAskOI }: { onAskOI?: (p: string) => void }) {
  const suggestions = [
    { label: 'Best for grilling?', icon: ChefHat, prompt: 'Which aquaculture product is best for grilling?' },
    { label: 'High omega-3?', icon: Activity, prompt: 'Which product has the highest omega-3 content?' },
    { label: 'Bulk order advice', icon: ShoppingCart, prompt: 'Recommend products for a wholesale bulk order.' },
    { label: 'Restaurant recommendation', icon: Utensils, prompt: 'Recommend products for a restaurant menu.' },
  ];
  return (
    <div className="glass rounded-2xl p-4 space-y-3">
      <div className="flex items-center gap-2">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="p-1.5 rounded-lg bg-cyan-500/15 border border-cyan-400/30"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
        </motion.div>
        <h4 className="font-display font-semibold text-white text-xs">OI Buying Assistant</h4>
      </div>
      <div className="space-y-2">
        {suggestions.map(s => (
          <button
            key={s.label}
            onClick={() => onAskOI?.(s.prompt)}
            className="w-full flex items-center gap-2 p-2 rounded-xl bg-slate-950/40 border border-cyan-500/10 hover:border-cyan-400/30 hover:bg-cyan-500/5 transition-all text-left"
          >
            <s.icon className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="text-[11px] text-slate-300">{s.label}</span>
            <ArrowRight className="w-3 h-3 text-slate-600 ml-auto" />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ============ PRODUCT DETAIL MODAL — premium with traceability ============ */
function ProductDetailModal({ product, onClose, onAddToCart, onAskOI }: { product: Product; onClose: () => void; onAddToCart: (p: Product) => void; onAskOI?: (p: string) => void }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'traceability' | 'nutrition'>('overview');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', stiffness: 280, damping: 28 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 400 }}
        dragElastic={{ top: 0.1, bottom: 0.6 }}
        onDragEnd={(_e, info) => { if (info.offset.y > 100) onClose(); }}
        className="relative glass-strong rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
      >
        <button onClick={onClose} className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-slate-950/60 border border-white/10 text-white hover:text-cyan-400">
          <X className="w-4 h-4" />
        </button>

        <div className="md:w-1/2 bg-slate-950 h-56 md:h-auto relative">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover brightness-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent p-5 flex items-end">
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">{product.category}</span>
              <h3 className="font-display text-white font-bold text-lg leading-tight">{product.name}</h3>
              <p className="text-xs text-cyan-200/50 font-mono italic mt-0.5">{product.scientificName}</p>
            </div>
          </div>
        </div>

        <div className="md:w-1/2 p-6 overflow-y-auto space-y-4">
          {/* Tabs */}
          <div className="flex gap-1 bg-slate-950/60 border border-cyan-500/10 p-1 rounded-xl">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'traceability', label: 'Traceability' },
              { id: 'nutrition', label: 'Nutrition' },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`flex-1 px-3 py-1.5 rounded-lg text-[10px] font-mono font-semibold transition-all ${activeTab === t.id ? 'text-cyan-300 bg-cyan-500/10' : 'text-slate-500 hover:text-slate-300'}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-3">
                <p className="text-xs text-slate-300 leading-relaxed font-sans">{product.description}</p>
                <div className="bg-slate-950/50 p-3 rounded-xl border border-cyan-500/10 space-y-2">
                  <div className="text-[9px] font-mono text-cyan-400/60 uppercase">Telemetry & Cold Chain</div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Active Temp:</span>
                    <span className="font-mono text-cyan-300 font-semibold">{product.currentTemp.toFixed(1)}°C</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Freshness:</span>
                    <span className="font-mono text-emerald-400 font-semibold uppercase">{product.freshnessStatus}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Method:</span>
                    <span className="font-mono text-slate-300">{product.method}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Availability:</span>
                    <span className={`font-mono font-semibold ${product.availability === 'in-stock' ? 'text-emerald-400' : product.availability === 'low-stock' ? 'text-amber-400' : 'text-red-400'}`}>{product.availability}</span>
                  </div>
                </div>
              </motion.div>
            )}
            {activeTab === 'traceability' && (
              <motion.div key="traceability" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-3">
                <div className="text-[9px] font-mono text-cyan-400/60 uppercase">Supply Chain Journey</div>
                {[
                  { icon: Anchor, label: 'Harvest Source', value: product.origin, temp: 'Lake Victoria · Busiime Grid' },
                  { icon: Fish, label: 'Processing', value: 'Busia Processing Hub', temp: 'Gutted & scaled within 2h' },
                  { icon: Snowflake, label: 'Cold Storage', value: 'Flash frozen -24°C', temp: `${product.currentTemp.toFixed(1)}°C maintained` },
                  { icon: Truck, label: 'Transport', value: 'Refrigerated truck', temp: 'NFC-tagged container' },
                  { icon: Package, label: 'Delivery', value: 'Doorstep', temp: 'Cold chain verified' },
                ].map((step, i) => (
                  <motion.div
                    key={step.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3 bg-slate-950/40 p-2.5 rounded-xl border border-cyan-500/10"
                  >
                    <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                      <step.icon className="w-3.5 h-3.5 text-cyan-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-[10px] font-mono text-slate-500 uppercase">{step.label}</div>
                      <div className="text-xs text-white font-semibold">{step.value}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{step.temp}</div>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </motion.div>
                ))}
              </motion.div>
            )}
            {activeTab === 'nutrition' && (
              <motion.div key="nutrition" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-3">
                <div className="text-[9px] font-mono text-cyan-400/60 uppercase">Nutritional Density (per 100g)</div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="bg-slate-950/30 p-2.5 rounded border border-cyan-500/5 flex justify-between"><span className="text-slate-400">Protein:</span><span className="text-white font-bold">{product.nutrients.protein}</span></div>
                  <div className="bg-slate-950/30 p-2.5 rounded border border-cyan-500/5 flex justify-between"><span className="text-slate-400">Omega-3:</span><span className="text-emerald-400 font-bold">{product.nutrients.omega3}</span></div>
                  <div className="bg-slate-950/30 p-2.5 rounded border border-cyan-500/5 flex justify-between"><span className="text-slate-400">Fat:</span><span className="text-white font-bold">{product.nutrients.fat}</span></div>
                  <div className="bg-slate-950/30 p-2.5 rounded border border-cyan-500/5 flex justify-between"><span className="text-slate-400">Calories:</span><span className="text-cyan-400 font-bold">{product.nutrients.calories} kcal</span></div>
                </div>
                <div className="bg-slate-950/40 p-3 rounded-xl border border-cyan-500/10">
                  <div className="text-[9px] font-mono text-cyan-400/60 uppercase mb-1">Quality Score</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${product.sustainabilityScore}%` }}
                        transition={{ duration: 0.8 }}
                        className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                      />
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-400">{product.sustainabilityScore}/100</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="pt-2 flex justify-between items-center">
            <div className="text-xs">
              <span className="text-slate-400">Price:</span>
              <div className="font-display font-bold text-cyan-400 text-lg">${product.price.toFixed(2)}<span className="text-xs text-slate-500">/{product.unit}</span></div>
            </div>
            <button onClick={() => onAddToCart(product)} className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" /> Add to Cart
            </button>
          </div>

          <button
            onClick={() => onAskOI?.(`Provide market analysis and pricing recommendation for ${product.name} (${product.scientificName}), currently $${product.price}/${product.unit}. Origin: ${product.origin}.`)}
            className="w-full py-2 rounded-xl bg-slate-950/60 border border-cyan-500/15 text-cyan-300 text-xs font-semibold hover:bg-cyan-500/10 flex items-center justify-center gap-1.5"
          >
            <BrainCircuit className="w-3.5 h-3.5" /> Ask OI for market analysis
          </button>
        </div>
      </motion.div>
    </div>
  );
}
