import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, CartItem, Order, UserProfile } from '../types';
import { Search, ShoppingCart, Heart, Plus, Minus, Info, X, Shield, MapPin, CircleCheck as CheckCircle2, ChevronRight, Download, Package } from 'lucide-react';
import { FloatingCard, SwipeContainer, SlideToConfirm } from './InteractionEngine';

interface MarketplaceProps {
  products: Product[];
  currentUser: UserProfile;
  onOrderCompleted: (order: Order) => void;
  onProductsUpdated: () => void;
}

export default function Marketplace({ products, currentUser, onOrderCompleted, onProductsUpdated }: MarketplaceProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'sustainability' | 'price' | 'freshness'>('sustainability');
  
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  
  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Checkout flow state
  const [checkoutStep, setCheckoutStep] = useState<'none' | 'shipping' | 'confirmation'>('none');
  const [shippingName, setShippingName] = useState(currentUser.name);
  const [shippingAddress, setShippingAddress] = useState('Kampala Road, Kampala, Uganda');
  const [shippingPhone, setShippingPhone] = useState(currentUser.phone || '+256 700 000 000');
  
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  // Selected Product for detailed modal
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.scientificName.toLowerCase().includes(q) ||
        p.origin.toLowerCase().includes(q) ||
        p.method.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      list = list.filter(p => p.category === selectedCategory);
    }

    // Sort matching
    if (sortBy === 'sustainability') {
      list.sort((a, b) => b.sustainabilityScore - a.sustainabilityScore);
    } else if (sortBy === 'price') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'freshness') {
      // prime > excellent > standard
      const score = (status: string) => status === 'prime' ? 3 : status === 'excellent' ? 2 : 1;
      list.sort((a, b) => score(b.freshnessStatus) - score(a.freshnessStatus));
    }

    return list;
  }, [products, searchQuery, selectedCategory, sortBy]);

  // Cart actions
  const addToCart = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
    
    // Add to recently viewed if not already there
    setRecentlyViewed(prev => {
      const filtered = prev.filter(id => id !== product.id);
      return [product.id, ...filtered].slice(0, 4);
    });
  };

  const updateQuantity = (productId: string, amount: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.product.id === productId) {
          const newQty = item.quantity + amount;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter((item): item is CartItem => item !== null);
    });
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  }, [cart]);

  const toggleFavorite = (productId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavorites(prev => 
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const openDetails = (product: Product) => {
    setDetailProduct(product);
    // Add to recently viewed
    setRecentlyViewed(prev => {
      const filtered = prev.filter(id => id !== product.id);
      return [product.id, ...filtered].slice(0, 4);
    });
  };

  // Checkout submission
  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutStep('confirmation');
    
    const orderPayload = {
      userId: currentUser.id,
      userName: shippingName,
      items: cart,
      total: cartTotal
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      const data = await res.json();
      if (data.success) {
        setPlacedOrder(data.order);
        onOrderCompleted(data.order);
        onProductsUpdated();
        setCart([]); // Clear cart
      }
    } catch (err) {
      console.error('Checkout error:', err);
    }
  };

  const recentProducts = products.filter(p => recentlyViewed.includes(p.id));

  return (
    <div className="space-y-6 relative">
      {/* Search & Filtering Control Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-900/80 border border-cyan-500/20 p-4 rounded-2xl backdrop-blur-md">
        {/* Search */}
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-cyan-400" />
          <input
            type="text"
            placeholder="Search aquaculture products by species, category, or origin..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-cyan-500/10 focus:border-cyan-400 rounded-xl py-2 pl-10 pr-4 text-xs text-white placeholder-cyan-100/30 outline-none transition-all"
          />
        </div>

        {/* Categories */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-slate-950 border border-cyan-500/10 rounded-xl px-3 py-2 text-xs text-cyan-200 outline-none focus:border-cyan-400"
        >
          <option value="all">All Categories</option>
          <option value="Pelagic">Fresh Fish (Tilapia, Perch)</option>
          <option value="Demersal">Catfish & Bottom Species</option>
          <option value="Value-Added">Value-Added (Smoked, Processed)</option>
          <option value="Fingerlings">Fingerlings</option>
          <option value="Aquaculture">Feed & Supplies</option>
          <option value="Organic">Organic Fertilizer</option>
        </select>

        {/* Sorting */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="bg-slate-950 border border-cyan-500/10 rounded-xl px-3 py-2 text-xs text-cyan-200 outline-none focus:border-cyan-400"
        >
          <option value="sustainability">Sort by: Sustainability Index</option>
          <option value="price">Sort by: Price (Lowest First)</option>
          <option value="freshness">Sort by: Freshness Status</option>
        </select>
      </div>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Side Catalog (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-display font-semibold text-white text-base">Aquaculture Products</h3>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 transition-all duration-300 flex items-center gap-1.5 text-xs font-semibold"
            >
              <ShoppingCart className="w-4 h-4" />
              Cart ({cart.length})
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-orange-500 border border-slate-950 rounded-full text-[10px] font-mono text-white flex items-center justify-center font-bold">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredProducts.map((p) => {
              const isFav = favorites.includes(p.id);
              const isLowStock = p.availability === 'low-stock';
              const isOutStock = p.availability === 'out-of-stock';

              return (
                <FloatingCard key={p.id} onClick={() => openDetails(p)} className="h-full">
                  <SwipeContainer
                    onSwipeLeft={() => toggleFavorite(p.id)}
                    onSwipeRight={() => addToCart(p)}
                    leftIcon={<Heart className={`w-5 h-5 ${isFav ? 'text-red-500 fill-red-500' : 'text-slate-400'}`} />}
                    leftText={isFav ? "Saved" : "Save Favorite"}
                    rightIcon={<ShoppingCart className="w-5 h-5 text-cyan-400" />}
                    rightText="Add to Cart"
                    className="h-full"
                  >
                    <div className="bg-slate-900/60 border border-cyan-500/10 rounded-2xl overflow-hidden hover:border-cyan-400/40 cursor-pointer shadow-xl relative flex flex-col justify-between group transition-all h-full">
                      {/* Floating animation subtle effect */}
                      <div className="relative h-44 overflow-hidden bg-slate-950">
                        <img
                          src={p.image}
                          alt={p.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover brightness-90 group-hover:scale-105 transition-transform duration-500"
                        />
                        
                        {/* Top corner badges */}
                        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
                          <span className="text-[9px] font-mono font-bold bg-slate-950/85 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded-full backdrop-blur">
                            🌿 {p.sustainabilityScore}/100 Eco
                          </span>
                          <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full backdrop-blur uppercase ${p.freshnessStatus === 'prime' ? 'bg-orange-500/25 border border-orange-400/30 text-orange-400' : 'bg-cyan-500/25 border border-cyan-400/30 text-cyan-400'}`}>
                            ⚓ {p.freshnessStatus}
                          </span>
                        </div>

                        <button
                          onClick={(e) => toggleFavorite(p.id, e)}
                          className={`absolute top-2.5 right-2.5 p-1.5 rounded-full bg-slate-950/60 border border-white/10 text-white hover:text-red-400 transition-colors ${isFav ? 'text-red-500 bg-slate-950 border-red-500/20' : ''}`}
                        >
                          <Heart className="w-4 h-4 fill-current" />
                        </button>
                      </div>

                      {/* Info block */}
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="font-display font-bold text-white text-sm line-clamp-1 group-hover:text-cyan-300 transition-colors">{p.name}</h4>
                            <div className="text-right">
                              <span className="font-mono text-cyan-400 font-bold text-sm">${p.price.toFixed(2)}</span>
                              <span className="text-[10px] text-slate-400">/{p.unit}</span>
                            </div>
                          </div>
                          <p className="text-[11px] font-mono text-slate-400 italic mt-0.5">{p.scientificName}</p>
                          <p className="text-xs text-slate-300 font-sans line-clamp-2 mt-2 leading-normal">{p.description}</p>
                        </div>

                        {/* Bottom Specs */}
                        <div className="border-t border-cyan-500/10 pt-3 flex justify-between items-center">
                          <div className="text-[10px] text-cyan-300/60 font-mono">
                            Zone: <span className="text-white">{p.origin}</span>
                          </div>
                          {isOutStock ? (
                            <span className="text-[10px] font-mono text-red-400 bg-red-950/40 px-2 py-0.5 rounded border border-red-500/10 font-semibold uppercase">Out Of Stock</span>
                          ) : (
                            <button
                              onClick={(e) => addToCart(p, e)}
                              className="px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 text-[11px] font-bold hover:bg-cyan-400 flex items-center gap-1 shadow-md shadow-cyan-500/10"
                            >
                              <Plus className="w-3 h-3" /> Add to Cart
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </SwipeContainer>
                </FloatingCard>
              );
            })}
          </div>
        </div>

        {/* Right Side Widgets (Favorites / Recently Viewed) */}
        <div className="space-y-6">
          {/* Recently Viewed Panel */}
          <div className="bg-slate-900/80 border border-cyan-500/20 p-4 rounded-2xl backdrop-blur-md">
            <h4 className="font-display font-semibold text-white text-xs border-b border-cyan-500/15 pb-2 mb-3">Recently Viewed</h4>
            {recentProducts.length > 0 ? (
              <div className="space-y-2">
                {recentProducts.map(rp => (
                  <div
                    key={rp.id}
                    onClick={() => openDetails(rp)}
                    className="flex items-center gap-3 bg-slate-950/40 border border-cyan-500/5 hover:border-cyan-500/20 p-2 rounded-xl cursor-pointer transition-all"
                  >
                    <img src={rp.image} alt={rp.name} className="w-10 h-10 object-cover rounded-lg" />
                    <div>
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

          {/* Environmental Assurance Stamp */}
          <div className="bg-gradient-to-b from-cyan-950/40 to-slate-900/60 border border-cyan-500/30 p-4 rounded-2xl backdrop-blur-md space-y-3">
            <Shield className="w-6 h-6 text-cyan-400" />
            <h4 className="font-display font-semibold text-white text-xs">Olayo Cold Chain Certified</h4>
            <p className="text-[11px] text-cyan-100/60 leading-relaxed font-sans">
              All aquaculture products carry cold chain temperature logs from Busia Processing Hub. NFC-tagged for full traceability from cage to customer.
            </p>
          </div>
        </div>
      </div>

      {/* Cart & Checkout Slide-out Panel */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="relative w-full max-w-md bg-slate-900 border-l border-cyan-500/30 h-screen shadow-2xl flex flex-col justify-between"
            >
              {/* Header */}
              <div className="p-5 border-b border-cyan-500/20 flex justify-between items-center bg-slate-950/40">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-display text-white font-bold text-base">Biological Cargo Manifest</h3>
                </div>
                <button onClick={() => { setIsCartOpen(false); setCheckoutStep('none'); }} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-5">
                {checkoutStep === 'none' ? (
                  cart.length > 0 ? (
                    <div className="space-y-4">
                      {cart.map(item => (
                        <div key={item.product.id} className="flex justify-between items-center bg-slate-950/40 border border-cyan-500/10 p-3 rounded-xl gap-4">
                          <img src={item.product.image} alt={item.product.name} className="w-12 h-12 object-cover rounded-lg" />
                          <div className="flex-1">
                            <div className="text-xs font-semibold text-white">{item.product.name}</div>
                            <div className="text-[10px] text-cyan-400 font-mono">${item.product.price.toFixed(2)}/{item.product.unit}</div>
                          </div>
                          <div className="flex items-center gap-2 bg-slate-900 px-2 py-1 rounded-lg border border-cyan-500/10">
                            <button onClick={() => updateQuantity(item.product.id, -1)} className="text-cyan-300 hover:text-white p-0.5"><Minus className="w-3 h-3" /></button>
                            <span className="font-mono text-xs text-white px-1.5">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.product.id, 1)} className="text-cyan-300 hover:text-white p-0.5"><Plus className="w-3 h-3" /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 text-slate-400 text-xs font-sans">
                      Your cargo manifest is empty. Scan stock and add items.
                    </div>
                  )
                ) : checkoutStep === 'shipping' ? (
                  <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                    <h4 className="font-display text-sm font-semibold text-white">Logistics Destination Details</h4>
                    
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-cyan-400/60 uppercase">Consignee Name</label>
                      <input
                        type="text"
                        required
                        value={shippingName}
                        onChange={(e) => setShippingName(e.target.value)}
                        className="w-full bg-slate-950 border border-cyan-500/10 focus:border-cyan-400 rounded-xl py-2 px-3 text-xs text-white outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-cyan-400/60 uppercase">Delivery Destination Address</label>
                      <input
                        type="text"
                        required
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        className="w-full bg-slate-950 border border-cyan-500/10 focus:border-cyan-400 rounded-xl py-2 px-3 text-xs text-white outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-cyan-400/60 uppercase">Phone Telemetry Code</label>
                      <input
                        type="text"
                        required
                        value={shippingPhone}
                        onChange={(e) => setShippingPhone(e.target.value)}
                        className="w-full bg-slate-950 border border-cyan-500/10 focus:border-cyan-400 rounded-xl py-2 px-3 text-xs text-white outline-none"
                      />
                    </div>

                    <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-[10px] font-mono text-cyan-300 leading-normal">
                      🛡️ Secure Payment Protocol: Standard shipping leverages cold-temperature vehicles backed by full blockchain ledger audits.
                    </div>

                    <SlideToConfirm
                      onConfirm={() => {
                        const dummyEvent = { preventDefault: () => {} } as React.FormEvent;
                        handleCheckoutSubmit(dummyEvent);
                      }}
                      label="Slide to Authenticate Dispatch"
                      successLabel="Dispatch Authorized! 🌊"
                      className="mt-4"
                    />
                  </form>
                ) : (
                  placedOrder && (
                    <div className="space-y-6 text-center py-6">
                      <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      
                      <div>
                        <h4 className="font-display font-bold text-white text-base">Cargo Dispatched & Verified!</h4>
                        <p className="text-xs text-slate-400 font-sans mt-1">Invoice ID: <span className="font-mono text-cyan-400 font-bold">{placedOrder.id}</span></p>
                      </div>

                      {/* Custom confirmation visual: seafood being packaged and shipped as requested! */}
                      <div className="bg-slate-950 border border-emerald-500/20 rounded-xl p-4 text-left space-y-3 relative overflow-hidden">
                        {/* Background loading bars simulating assembly lines */}
                        <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 animate-pulse" />
                        
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-cyan-400" />
                          <div className="text-[10px] font-mono text-cyan-300 uppercase">Interactive Packaging Line Log</div>
                        </div>

                        <div className="space-y-2 text-[11px] font-mono text-slate-300">
                          <div className="flex justify-between">
                            <span>📦 Box Assembly</span>
                            <span className="text-emerald-400">COMPLETE [OK]</span>
                          </div>
                          <div className="flex justify-between">
                            <span>❄️ Vacuum Seal & Dry Ice</span>
                            <span className="text-emerald-400">SEALED [-24°C]</span>
                          </div>
                          <div className="flex justify-between">
                            <span>🛰️ NFC Cold Tag Linkage</span>
                            <span className="text-emerald-400">ACTIVE [CHIP_LINKED]</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <a
                          href={placedOrder.invoiceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full py-2.5 rounded-xl border border-cyan-500/30 bg-slate-950 text-cyan-300 hover:bg-slate-900 transition-all text-xs font-semibold flex justify-center items-center gap-1.5"
                        >
                          <Download className="w-4 h-4" /> Download Commercial Invoice
                        </a>
                        
                        <button
                          onClick={() => {
                            setIsCartOpen(false);
                            setCheckoutStep('none');
                            setPlacedOrder(null);
                          }}
                          className="w-full py-2 rounded-xl text-slate-400 hover:text-white transition-all text-xs font-semibold"
                        >
                          Keep Browsing Stock
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* Footer */}
              {checkoutStep === 'none' && cart.length > 0 && (
                <div className="p-5 border-t border-cyan-500/20 bg-slate-950/60 space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400 font-sans">Subtotal:</span>
                    <span className="font-mono text-cyan-400 font-bold text-base">${cartTotal.toFixed(2)} USD</span>
                  </div>
                  <button
                    onClick={() => setCheckoutStep('shipping')}
                    className="w-full py-2.5 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold hover:bg-cyan-400 transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={() => setDetailProduct(null)} />
            
            <motion.div
              drag="y"
              dragConstraints={{ top: 0, bottom: 400 }}
              dragElastic={{ top: 0.1, bottom: 0.6 }}
              onDragEnd={(_e, info) => {
                if (info.offset.y > 100) {
                  setDetailProduct(null);
                }
              }}
              initial={{ scale: 0.95, opacity: 0, y: 0 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-cyan-500/30 max-w-2xl w-full rounded-2xl overflow-hidden relative shadow-2xl flex flex-col md:flex-row max-h-[90vh] touch-pan-y"
            >
              {/* Swipe down indicator visual */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-slate-700/60 rounded-full z-20 pointer-events-none md:hidden" />
              <button
                onClick={() => setDetailProduct(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-950/60 border border-white/10 text-white hover:text-cyan-400 z-10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Left Column Image */}
              <div className="md:w-1/2 bg-slate-950 h-56 md:h-auto relative">
                <img src={detailProduct.image} alt={detailProduct.name} className="w-full h-full object-cover brightness-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent p-5 flex items-end">
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">{detailProduct.category} Class</span>
                    <h3 className="font-display text-white font-bold text-lg leading-tight">{detailProduct.name}</h3>
                    <p className="text-xs text-cyan-200/50 font-mono italic mt-0.5">{detailProduct.scientificName}</p>
                  </div>
                </div>
              </div>

              {/* Right Column Details */}
              <div className="md:w-1/2 p-6 overflow-y-auto space-y-4">
                <p className="text-xs text-slate-300 leading-relaxed font-sans">{detailProduct.description}</p>
                
                {/* Cold chain logs */}
                <div className="bg-slate-950/50 p-3 rounded-xl border border-cyan-500/10 space-y-2">
                  <div className="text-[9px] font-mono text-cyan-400/60 uppercase">Telemetry & Cold Chain Status</div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-sans">Active Temp Target:</span>
                    <span className="font-mono text-cyan-300 font-semibold">{detailProduct.currentTemp.toFixed(1)}°C</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-sans">Freshness Certification:</span>
                    <span className="font-mono text-emerald-400 font-semibold uppercase">{detailProduct.freshnessStatus}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-sans">Capture Tech:</span>
                    <span className="font-mono text-slate-300">{detailProduct.method}</span>
                  </div>
                </div>

                {/* Nutritional Values */}
                <div>
                  <div className="text-[9px] font-mono text-cyan-400/60 uppercase mb-2">Nutritional Density (per 100g)</div>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="bg-slate-950/30 p-2 rounded border border-cyan-500/5 flex justify-between">
                      <span className="text-slate-400">Protein:</span>
                      <span className="text-white font-bold">{detailProduct.nutrients.protein}</span>
                    </div>
                    <div className="bg-slate-950/30 p-2 rounded border border-cyan-500/5 flex justify-between">
                      <span className="text-slate-400">Omega-3:</span>
                      <span className="text-emerald-400 font-bold">{detailProduct.nutrients.omega3}</span>
                    </div>
                    <div className="bg-slate-950/30 p-2 rounded border border-cyan-500/5 flex justify-between">
                      <span className="text-slate-400">Fat:</span>
                      <span className="text-white font-bold">{detailProduct.nutrients.fat}</span>
                    </div>
                    <div className="bg-slate-950/30 p-2 rounded border border-cyan-500/5 flex justify-between">
                      <span className="text-slate-400">Calories:</span>
                      <span className="text-cyan-400 font-bold">{detailProduct.nutrients.calories} kcal</span>
                    </div>
                  </div>
                </div>

                {/* Add block */}
                <div className="pt-2 flex justify-between items-center">
                  <div className="text-xs">
                    <span className="text-slate-400">Sourcing Zone:</span>
                    <div className="font-semibold text-white font-sans">{detailProduct.origin}</div>
                  </div>
                  <button
                    onClick={() => {
                      addToCart(detailProduct);
                      setDetailProduct(null);
                      setIsCartOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all flex items-center gap-1 shadow-md shadow-cyan-500/15"
                  >
                    Add and Open Cart
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
