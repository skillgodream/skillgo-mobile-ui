import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Play, 
  CheckCircle2, 
  ShoppingBag, 
  Clock, 
  BookOpen, 
  Check, 
  Plus, 
  ShieldCheck, 
  Award, 
  FileText,
  Volume2,
  Maximize2
} from 'lucide-react';
import { Button, Badge } from '../components/ui';
import { LIBRARY_ITEMS } from '../lib/catalog';
import { useRouter } from '../lib/router';
import { useCartState } from '../lib/enrollmentStore';
import { LibraryItem } from '../lib/types';
import { CartModal } from '../components/CartModal';

export function LibraryDetailScreen() {
  const { currentRoute, navigate, goBack } = useRouter();
  const { addToCart, isInCart, isLibraryPurchased } = useCartState();
  const [showCartModal, setShowCartModal] = useState(false);

  const libraryId = currentRoute.params?.libraryId || LIBRARY_ITEMS[0].id;
  const item: LibraryItem = LIBRARY_ITEMS.find(i => i.id === libraryId) || LIBRARY_ITEMS[0];

  const isPurchased = isLibraryPurchased(item.id);
  const inCart = isInCart(item.id);
  const price = item.price || 29;
  const videoDuration = item.videoDuration || '12:45';

  // Video player state simulation
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setVideoProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return prev + 10;
        });
      }, 800);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <button onClick={() => navigate('home')} className="hover:text-slate-900 font-medium cursor-pointer">
          Home
        </button>
        <span>/</span>
        <button onClick={() => navigate('library')} className="hover:text-slate-900 font-medium cursor-pointer">
          Library
        </button>
        <span>/</span>
        <span className="text-slate-900 font-semibold truncate max-w-xs">{item.title}</span>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left/Main Column: Video Player & SOP Content */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Video Player Box */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="relative aspect-video w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
              {!isPlaying && videoProgress === 0 && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/40 backdrop-blur-2xs p-6 text-center">
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-xl transition-transform hover:scale-110 active:scale-95 cursor-pointer mb-3"
                    aria-label="Play module walkthrough video"
                  >
                    <Play className="w-7 h-7 ml-1 fill-white text-white" />
                  </button>
                  <h4 className="text-white font-bold text-base sm:text-lg tracking-tight">
                    {item.title} - Video Walkthrough
                  </h4>
                  <p className="text-slate-300 text-xs mt-1">
                    Interactive Video SOP Demonstration • {videoDuration}
                  </p>
                </div>
              )}

              {/* Video Thumbnail Background */}
              <img
                src={item.image || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80'}
                alt={item.imageAlt || item.title}
                className={`w-full h-full object-cover transition-opacity duration-500 ${isPlaying ? 'opacity-90' : 'opacity-40'}`}
                referrerPolicy="no-referrer"
              />

              {/* Playing state indicator */}
              {isPlaying && (
                <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Playing Walkthrough ({videoProgress}%)</span>
                </div>
              )}

              {/* Video Controls bar */}
              <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 flex flex-col gap-2">
                <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden cursor-pointer">
                  <div 
                    className="bg-blue-500 h-full transition-all duration-300"
                    style={{ width: `${videoProgress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-white text-xs font-medium">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="hover:text-blue-400 transition-colors cursor-pointer"
                    >
                      {isPlaying ? 'Pause' : 'Play'}
                    </button>
                    <Volume2 className="w-4 h-4 cursor-pointer text-slate-300 hover:text-white" />
                  </div>
                  <div className="flex items-center gap-3">
                    <span>{videoDuration}</span>
                    <Maximize2 className="w-4 h-4 cursor-pointer text-slate-300 hover:text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Title & Category Info */}
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <Badge variant="orange">{item.category}</Badge>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500 text-xs font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {item.duration}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500 text-xs font-medium">{item.level}</span>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">Module Price</div>
                  <div className="text-lg font-black text-slate-900">₹{price}</div>
                </div>
              </div>

              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">{item.title}</h1>
                <p className="text-slate-600 text-sm mt-2 leading-relaxed">{item.summary}</p>
              </div>

              {/* Purchase / Cart Actions bar */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-4">
                {isPurchased ? (
                  <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-2xl text-xs font-bold w-full sm:w-auto">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Unlocked & Fully Accessible in Library</span>
                  </div>
                ) : inCart ? (
                  <Button
                    size="md"
                    variant="primary"
                    iconRight={ShoppingBag}
                    onClick={() => setShowCartModal(true)}
                    className="w-full sm:w-auto"
                  >
                    View in Cart & Checkout
                  </Button>
                ) : (
                  <Button
                    size="md"
                    variant="primary"
                    iconRight={Plus}
                    onClick={() => {
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
                    className="w-full sm:w-auto"
                  >
                    Add to Cart & Unlock (₹{price})
                  </Button>
                )}

                <Button
                  size="md"
                  variant="outline"
                  onClick={() => navigate('library')}
                >
                  Back to Library Directory
                </Button>
              </div>
            </div>
          </div>

          {/* Operating Procedure / Instructions Section */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span>Operating Procedure & Standard Checklist</span>
              </h3>
              <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full">
                Step-by-Step SOP
              </span>
            </div>

            {isPurchased ? (
              <div className="space-y-3">
                {item.content.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3.5 p-3.5 bg-slate-50/80 border border-slate-200/80 rounded-2xl">
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <div className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                      {step}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-3">
                <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-900 text-base">Complete SOP Locked</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Unlock this independent library module for ₹{price} to access the complete step-by-step operating instructions, verification checkpoints, and pro tips.
                </p>
                <div className="pt-2">
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => {
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
                  >
                    Unlock Module for ₹{price}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Pro Operational Tips */}
          {item.keyTips && item.keyTips.length > 0 && (
            <div className="bg-amber-50/80 border border-amber-200/80 rounded-3xl p-6 space-y-2">
              <h4 className="font-bold text-amber-900 text-sm flex items-center gap-2">
                <span>💡 Pro Operational Tips</span>
              </h4>
              <p className="text-xs sm:text-sm text-amber-950 leading-relaxed">
                {item.keyTips.join(' ')}
              </p>
            </div>
          )}

        </div>

        {/* Right Sidebar: Module Metadata & Related SOPs */}
        <div className="space-y-6">
          
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Module Information</h3>
            
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Category</span>
                <span className="font-bold text-slate-900">{item.category}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Estimated Duration</span>
                <span className="font-bold text-slate-900">{item.duration}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Difficulty Level</span>
                <span className="font-bold text-slate-900">{item.level}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Reading Time</span>
                <span className="font-bold text-slate-900">{item.readTime}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Access Type</span>
                <span className="font-bold text-blue-600">Standalone SOP</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-[#0B192C] text-white rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5 text-blue-400" />
            </div>
            <h4 className="font-bold text-base">Explore More SOPs</h4>
            <p className="text-slate-300 text-xs leading-relaxed">
              Browse our complete library of operational cheat sheets, dark store guides, and customer service standards.
            </p>
            <Button
              size="sm"
              variant="primary"
              className="w-full"
              onClick={() => navigate('library')}
            >
              Browse All Library Modules
            </Button>
          </div>

        </div>

      </div>

      <CartModal
        isOpen={showCartModal}
        onClose={() => setShowCartModal(false)}
      />
    </div>
  );
}
