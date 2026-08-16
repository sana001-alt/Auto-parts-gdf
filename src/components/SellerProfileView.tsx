import React, { useState, useEffect } from "react";
import { 
  Star, X, MessageSquare, ShieldCheck, Calendar, 
  MapPin, ChevronRight, Award, Package, Image as ImageIcon, ArrowLeft
} from "lucide-react";
import { User, SparePart, SellerReview } from "../types";
import { fetchSellerReviews, fetchUserProfile } from "../lib/firebase";
import SellerReviewsView from "./SellerReviewsView";
import UserAvatar from "./UserAvatar";

interface SellerProfileViewProps {
  key?: string;
  sellerId: string;
  sellerName: string;
  currentUser: User | null;
  onClose: () => void;
  onStartChat?: (part: SparePart) => void;
  allParts: SparePart[];
  onSelectPart?: (part: SparePart) => void;
  onOpenUserProfile?: (userId: string, userName: string) => void;
}

export default function SellerProfileView({
  sellerId,
  sellerName,
  currentUser,
  onClose,
  onStartChat,
  allParts,
  onSelectPart,
  onOpenUserProfile
}: SellerProfileViewProps) {
  const [reviews, setReviews] = useState<SellerReview[]>([]);
  const [sellerProfile, setSellerProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReviewsOverlay, setShowReviewsOverlay] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadProfileData = async () => {
      setLoading(true);
      try {
        const [reviewsData, profileData] = await Promise.all([
          fetchSellerReviews(sellerId),
          fetchUserProfile(sellerId)
        ]);
        if (isMounted) {
          setReviews(reviewsData || []);
          setSellerProfile(profileData || null);
        }
      } catch (err) {
        console.error("Failed to load user profile data:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProfileData();

    const handleReviewsUpdated = async () => {
      try {
        const reviewsData = await fetchSellerReviews(sellerId);
        if (isMounted) setReviews(reviewsData || []);
      } catch (err) {
        console.warn("Failed to reload reviews:", err);
      }
    };

    window.addEventListener("autoparts_reviews_updated", handleReviewsUpdated);
    return () => {
      isMounted = false;
      window.removeEventListener("autoparts_reviews_updated", handleReviewsUpdated);
    };
  }, [sellerId]);

  // Statistics & Filtering
  const sellerParts = allParts.filter(p => p.sellerId === sellerId);
  const activeAds = sellerParts.filter(p => !p.sold);

  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 
    ? parseFloat((reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1))
    : 0;

  const displayName = sellerProfile?.name || sellerProfile?.displayName || sellerName || "Seller";
  const displayPhoto = sellerProfile?.photoURL || sellerProfile?.profilePhoto || "";

  const getJoinedDate = () => {
    const ts = sellerProfile?.createdAt || (sellerParts.length > 0 ? sellerParts[sellerParts.length - 1].createdAt : null);
    if (ts) {
      try {
        const date = new Date(ts);
        return date.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
      } catch (e) {
        return "2026";
      }
    }
    return "2026";
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name.trim().split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase();
  };

  const getAvatarGradient = (id: string) => {
    const colors = [
      "from-blue-600 via-indigo-600 to-indigo-800",
      "from-indigo-600 via-purple-600 to-purple-800",
      "from-teal-600 via-emerald-600 to-emerald-800",
      "from-slate-700 via-slate-800 to-slate-950",
      "from-blue-700 via-sky-600 to-cyan-700"
    ];
    const index = (id || "1").split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  const refPart = activeAds[0] || sellerParts[0];

  const handlePartClick = (part: SparePart) => {
    if (onSelectPart) {
      onSelectPart(part);
      onClose();
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="fixed inset-0 bg-slate-50 flex flex-col z-45 animate-fade-in" id="public-user-profile-view-root">
      {/* Top App Bar */}
      <div className="bg-[#0B1220] text-white py-3 px-4 flex items-center justify-between shadow-md sticky top-0 z-20 border-b border-[#18233C]">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onClose}
            className="p-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors cursor-pointer"
            id="close-public-profile-btn"
            title="Back"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <span className="text-[9px] font-black tracking-widest text-blue-400 uppercase block">Public Profile</span>
            <h2 className="text-xs font-extrabold text-white truncate max-w-[200px]">{displayName}</h2>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-full transition-colors cursor-pointer"
          title="Close"
        >
          <X size={15} />
        </button>
      </div>

      <div className="flex-1 pb-24 overflow-y-auto max-w-xl mx-auto w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-3">
            <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Loading Profile...</span>
          </div>
        ) : (
          <div className="space-y-3.5 p-3.5 sm:p-4">
            
            {/* User Profile Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col items-center text-center relative overflow-hidden">
              <div className="mb-3 shrink-0">
                <UserAvatar
                  userId={sellerId}
                  name={displayName}
                  photoURL={displayPhoto}
                  size="2xl"
                  showVerifiedBadge={false}
                />
              </div>
              
              {/* User Name & Verified Status */}
              <div className="flex items-center gap-1.5 justify-center">
                <h3 className="text-base font-black text-slate-900 tracking-tight">{displayName}</h3>
                <span title="Verified User" className="inline-flex">
                  <ShieldCheck size={16} className="text-blue-600" />
                </span>
              </div>

              {/* Verified Badge */}
              <div className="mt-1.5 flex items-center gap-1 bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-blue-100">
                <Award size={12} className="text-blue-600 shrink-0" />
                <span>Verified Member</span>
              </div>

              {/* Member Since / Region Summary (No Private Info) */}
              <div className="mt-3 flex items-center gap-3.5 text-xs text-slate-500 font-medium justify-center flex-wrap">
                <div className="flex items-center gap-1">
                  <Calendar size={12} className="text-slate-400" />
                  <span className="text-[11px] text-slate-500">Joined {getJoinedDate()}</span>
                </div>
                {(sellerProfile?.district || sellerProfile?.state || refPart?.district || refPart?.state) && (
                  <div className="flex items-center gap-1">
                    <MapPin size={12} className="text-slate-400" />
                    <span className="text-[11px] text-slate-500 truncate max-w-[160px]">
                      {sellerProfile?.district || refPart?.district || ""}{sellerProfile?.state || refPart?.state ? `, ${sellerProfile?.state || refPart?.state}` : ""}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* Rating & Reviews Block */}
              <button
                onClick={() => setShowReviewsOverlay(true)}
                className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col items-center text-center hover:bg-slate-50 transition-all cursor-pointer"
                id="public-profile-rating-card"
              >
                <div className="flex items-center gap-1 text-amber-500">
                  <Star size={15} className="fill-amber-400 text-amber-400" />
                  <span className="text-base font-black text-slate-900">{averageRating > 0 ? averageRating : "New"}</span>
                </div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1 flex items-center gap-0.5">
                  {totalReviews > 0 ? `${totalReviews} Reviews` : "No Reviews Yet"}
                  <ChevronRight size={10} className="text-slate-400" />
                </span>
              </button>

              {/* Active Listings Count */}
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col items-center text-center">
                <div className="flex items-center gap-1 text-blue-600">
                  <Package size={15} className="text-blue-600" />
                  <span className="text-base font-black text-slate-900">{activeAds.length}</span>
                </div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">
                  Active Listings
                </span>
              </div>
            </div>

            {/* Quick in-app chat action (Safe & Private) */}
            {onStartChat && refPart && currentUser?.id !== sellerId && (
              <button
                onClick={() => {
                  onStartChat(refPart);
                  onClose();
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-extrabold py-3 px-4 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                id="public-profile-chat-btn"
              >
                <MessageSquare size={15} className="text-white" />
                <span>Chat with {displayName}</span>
              </button>
            )}

            {/* Active Listings Grid */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between px-1">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Package size={13} className="text-blue-600" />
                  Active Listings ({activeAds.length})
                </h4>
              </div>

              {activeAds.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl border border-slate-200/80 text-center flex flex-col items-center justify-center space-y-2 shadow-xs">
                  <Package size={28} className="text-slate-300" />
                  <p className="text-xs text-slate-500 font-bold">No active spare parts listed right now.</p>
                  <p className="text-[10px] text-slate-400">Check back later for newly added parts.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2.5">
                  {activeAds.map((part) => (
                    <div
                      key={part.id}
                      onClick={() => handlePartClick(part)}
                      className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs flex flex-col relative cursor-pointer hover:border-blue-400 transition-all group"
                      id={`public-part-card-${part.id}`}
                    >
                      {/* Image Box - 1:1 Aspect Ratio (Square) */}
                      <div className="w-full aspect-square bg-slate-900 relative overflow-hidden rounded-t-2xl">
                        {/* Shimmer skeleton before loaded */}
                        <div className="absolute inset-0 bg-slate-800 animate-pulse pointer-events-none z-0" />

                        {part.imageUrl ? (
                          <img
                            src={part.imageUrl}
                            alt={part.title}
                            loading="lazy"
                            decoding="async"
                            referrerPolicy="no-referrer"
                            onLoad={(e) => {
                              const skeleton = (e.target as HTMLImageElement).parentElement?.querySelector('.animate-pulse');
                              if (skeleton) skeleton.classList.add('hidden');
                            }}
                            onError={(e) => {
                              const skeleton = (e.target as HTMLImageElement).parentElement?.querySelector('.animate-pulse');
                              if (skeleton) skeleton.classList.add('hidden');
                            }}
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-200 relative z-1"
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-blue-400 p-2 relative z-1">
                            <ImageIcon size={18} className="text-blue-400" />
                            <span className="text-[8px] font-bold uppercase text-center text-blue-300 block truncate w-full mt-1">
                              {part.partName || part.category}
                            </span>
                          </div>
                        )}
                        {part.condition && (
                          <span className="absolute top-1.5 left-1.5 bg-slate-900/80 backdrop-blur-xs text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase z-10">
                            {part.condition}
                          </span>
                        )}
                      </div>

                      <div className="p-2.5 flex-1 flex flex-col justify-between space-y-1.5 bg-white">
                        <div>
                          <h5 className="text-[11px] font-extrabold text-slate-900 line-clamp-2 leading-snug">
                            {part.title}
                          </h5>
                          <span className="text-[9px] text-slate-500 mt-0.5 font-semibold block truncate">
                            {part.carBrand} • {part.carModel}
                          </span>
                        </div>
                        <div className="flex items-center justify-between pt-1.5 border-t border-slate-100">
                          <span className="text-xs font-black text-blue-700">
                            {formatPrice(part.price)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}
      </div>

      {/* Ratings & Reviews Overlay */}
      {showReviewsOverlay && (
        <SellerReviewsView
          sellerId={sellerId}
          sellerName={displayName}
          currentUser={currentUser}
          onClose={() => setShowReviewsOverlay(false)}
          currentPart={refPart}
          onOpenUserProfile={onOpenUserProfile}
        />
      )}
    </div>
  );
}
