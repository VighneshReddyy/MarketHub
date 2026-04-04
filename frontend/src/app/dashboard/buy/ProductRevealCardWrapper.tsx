"use client";

import { useState } from "react";
import { ProductRevealCard } from "@/components/ui/product-reveal-card";
import { purchaseItem, reportItem } from "@/app/actions/market";
import { useRouter } from "next/navigation";
import { X, ShoppingCart, Flag, User, Clock, Tag, CheckCircle } from "lucide-react";

export function ProductRevealCardWrapper({ item }: { item: any }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportLoading, setReportLoading] = useState(false);
  const [purchased, setPurchased] = useState(false);
  const [reportDone, setReportDone] = useState(false);

  const categoryImages: any = {
    "Electronics": "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&h=600&fit=crop",
    "Computers": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop",
    "Furniture": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop",
    "Clothing": "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&h=600&fit=crop",
    "Books": "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&h=600&fit=crop",
    "Sports": "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop",
    "Vehicles": "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&h=600&fit=crop",
    "Default": "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&h=600&fit=crop"
  };

  const imageUrl = item.image_url || categoryImages[item.category_name] || categoryImages["Default"];

  const handleConfirmPurchase = async () => {
    if (isLoading) return;
    setIsLoading(true);
    const result = await purchaseItem(item.item_id, parseFloat(item.price));
    if (result.error) {
      alert(result.error);
      setIsLoading(false);
    } else {
      setPurchased(true);
      setIsLoading(false);
      setTimeout(() => {
        setShowModal(false);
        setPurchased(false);
        router.refresh();
      }, 2000);
    }
  };

  const handleReport = async () => {
    if (!reportReason.trim()) return;
    setReportLoading(true);
    await reportItem(item.item_id, reportReason);
    setReportLoading(false);
    setReportDone(true);
    setTimeout(() => {
      setShowReportModal(false);
      setReportDone(false);
      setReportReason("");
    }, 2000);
  };

  return (
    <>
      <div className={isLoading ? "opacity-50 pointer-events-none" : ""}>
        <ProductRevealCard
          name={item.title}
          image={imageUrl}
          price={`₹${parseFloat(item.price).toLocaleString()}`}
          description={item.description}
          rating={parseFloat(item.seller_rating)}
          reviewCount={parseInt(item.seller_review_count)}
          condition={item.condition_type}
          sellerName={item.seller_name}
          onAdd={() => setShowModal(true)}
        />
      </div>

      {/* Item Detail Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={() => !purchased && setShowModal(false)}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-lg bg-[#0f1120] border border-white/10 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image */}
            <div className="relative h-52 overflow-hidden">
              <img src={imageUrl} alt={item.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f1120] via-transparent to-transparent" />
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors border border-white/10"
              >
                <X className="w-4 h-4" />
              </button>
              <span className={`absolute top-4 left-4 text-xs font-bold uppercase px-3 py-1 rounded-full border ${item.condition_type === 'new' ? 'bg-green-500/80 border-green-400 text-white' : 'bg-amber-500/80 border-amber-400 text-white'}`}>
                {item.condition_type}
              </span>
            </div>

            <div className="p-6 space-y-4">
              {purchased ? (
                <div className="flex flex-col items-center justify-center py-6 gap-3">
                  <CheckCircle className="w-12 h-12 text-emerald-400" />
                  <p className="text-white font-semibold text-lg">Purchase request sent!</p>
                  <p className="text-slate-400 text-sm text-center">The seller has been notified and will contact you soon.</p>
                </div>
              ) : (
                <>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">{item.title}</h2>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {item.seller_name}</span>
                      <span className="flex items-center gap-1.5"><Tag className="w-3.5 h-3.5" /> {item.category_name}</span>
                      {item.usage_months && <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {item.usage_months} months used</span>}
                    </div>
                  </div>

                  {item.description && (
                    <p className="text-slate-300 text-sm leading-relaxed border-l-2 border-white/10 pl-3">
                      {item.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <span className="text-3xl font-bold text-emerald-400">₹{parseFloat(item.price).toLocaleString()}</span>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleConfirmPurchase}
                      disabled={isLoading}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-semibold transition-all disabled:opacity-50 shadow-lg shadow-emerald-500/20"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {isLoading ? "Sending..." : "Confirm Purchase"}
                    </button>
                    <button
                      onClick={() => { setShowModal(false); setShowReportModal(true); }}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 transition-colors text-sm font-medium"
                    >
                      <Flag className="w-4 h-4" />
                      Report
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={() => setShowReportModal(false)}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-md bg-[#0f1120] border border-rose-500/20 rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setShowReportModal(false)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/5 text-slate-400 transition-colors">
              <X className="w-4 h-4" />
            </button>

            {reportDone ? (
              <div className="flex flex-col items-center py-6 gap-3">
                <CheckCircle className="w-12 h-12 text-emerald-400" />
                <p className="text-white font-semibold">Report submitted</p>
                <p className="text-slate-400 text-sm">Our team will review it shortly.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2 bg-rose-500/10 rounded-lg border border-rose-500/20">
                    <Flag className="w-5 h-5 text-rose-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Report Listing</h3>
                    <p className="text-xs text-slate-500">{item.title}</p>
                  </div>
                </div>

                <textarea
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  placeholder="Describe the issue (e.g. misleading description, fake item, wrong price...)"
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-rose-500/50 resize-none mb-4"
                />

                <button
                  onClick={handleReport}
                  disabled={reportLoading || !reportReason.trim()}
                  className="w-full py-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 font-semibold border border-rose-500/30 transition-colors disabled:opacity-50"
                >
                  {reportLoading ? "Submitting..." : "Submit Report"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
