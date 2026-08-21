import React, { useState } from 'react';
import { ArrowLeft, Clock, Search, BookOpen, FileText, ArrowRight, Plus, Check, ShoppingBag } from 'lucide-react';
import { Button, Badge } from '../components/ui';
import { LIBRARY_ITEMS } from '../lib/catalog';
import { useRouter } from '../lib/router';
import { LibraryItem } from '../lib/types';
import { useCartState } from '../lib/enrollmentStore';
import { CartModal } from '../components/CartModal';

export function LibraryScreen() {
  const { navigate, goBack } = useRouter();
  const { addToCart, isInCart, isLibraryPurchased } = useCartState();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showCartModal, setShowCartModal] = useState(false);

  const filtered = LIBRARY_ITEMS.filter(item => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="flex items-center gap-2 mb-6 text-sm text-slate-500">
        <button onClick={goBack} className="inline-flex items-center gap-1 hover:text-slate-900 font-medium cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> Home
        </button>
        <span>/</span>
        <span className="text-slate-900 font-semibold">Library</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">SkillGo Library</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Practical SOP modules, cheat sheets, and workplace guides with video walkthroughs for ₹29.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search SOPs or guides..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
        {['All', 'Operations', 'Customer Service', 'Safety', 'Leadership', 'Digital Skills'].map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid — Compact 70% Horizontal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {filtered.map(item => {
          const isPurchased = isLibraryPurchased(item.id);
          const inCart = isInCart(item.id);
          const price = item.price || 29;

          return (
            <div
              key={item.id}
              onClick={() => navigate('library-detail', { libraryId: item.id })}
              className="bg-white rounded-xl border border-slate-200/80 p-2.5 shadow-2xs hover:shadow-xl hover:border-blue-400 hover:-translate-y-1.5 hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 ease-out flex items-center gap-3 cursor-pointer group relative z-0 hover:z-10"
            >
              {/* Left Side: Picture (Compact 70% footprint) */}
              <div className="w-20 sm:w-22 h-20 sm:h-22 rounded-lg overflow-hidden relative bg-slate-100 shrink-0">
                <img
                  src={item.image || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80'}
                  alt={item.imageAlt || item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs text-white text-[9px] font-semibold leading-none">
                  {item.category}
                </span>

                {isPurchased && (
                  <span className="absolute top-1 right-1 p-0.5 rounded-full bg-emerald-600 text-white text-[9px] shadow-2xs">
                    <Check className="w-2.5 h-2.5" />
                  </span>
                )}
              </div>
              
              {/* Right Side: Title, Description, Timing, Price & Add To Cart '+' */}
              <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-0.5">
                <div>
                  <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                    {item.title}
                  </h3>

                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 leading-tight">
                    {item.summary}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1.5 mt-1 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 flex items-center gap-0.5 font-medium">
                      <Clock className="w-2.5 h-2.5" />
                      <span>{item.duration}</span>
                    </span>
                    <span className="text-xs font-bold text-slate-900">₹{price}</span>
                  </div>

                  {isPurchased ? (
                    <span className="text-emerald-600 text-[11px] font-semibold flex items-center gap-0.5">
                      View Module →
                    </span>
                  ) : inCart ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowCartModal(true);
                      }}
                      className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold flex items-center gap-0.5 border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer"
                    >
                      <Check className="w-2.5 h-2.5" /> In Cart
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart({
                          id: `cart-lib-${item.id}`,
                          productId: item.id,
                          productType: 'library',
                          title: item.title,
                          price,
                          image: item.image,
                          category: item.category,
                          duration: item.duration
                        });
                      }}
                      className="w-6 h-6 rounded-md bg-[#0B192C] hover:bg-blue-600 text-white flex items-center justify-center shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
                      title="Add to cart"
                      aria-label={`Add ${item.title} to cart`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cart Modal */}
      <CartModal
        isOpen={showCartModal}
        onClose={() => setShowCartModal(false)}
      />
    </div>
  );
}
