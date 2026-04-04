"use client";

import { useState } from "react";
import { Loader2, Trash2, Pencil, X, Check } from "lucide-react";
import { deleteListing, updateListing } from "@/app/actions/market";
import { useRouter } from "next/navigation";

export function ManageActions({ item }: { item: any }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [price, setPrice] = useState(String(parseFloat(item.price)));
  const [description, setDescription] = useState(item.description || "");
  const [imageUrl, setImageUrl] = useState(item.image_url || "");

  const handleDelete = async () => {
    if (!confirm("Remove this listing?")) return;
    setIsDeleting(true);
    await deleteListing(item.item_id);
    setIsDeleting(false);
    router.refresh();
  };

  const handleSave = async () => {
    setIsSaving(true);
    const result = await updateListing(item.item_id, {
      price,
      description,
      image_url: imageUrl,
    });
    setIsSaving(false);
    if (result.error) {
      alert(result.error);
    } else {
      setShowEdit(false);
      router.refresh();
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowEdit(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-white hover:bg-white/10 border border-white/10 rounded-lg transition-colors"
        >
          <Pencil className="w-3.5 h-3.5" /> Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 rounded-lg transition-colors disabled:opacity-50"
        >
          {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
          {isDeleting ? "Removing..." : "Remove"}
        </button>
      </div>

      {/* Edit Modal */}
      {showEdit && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={() => setShowEdit(false)}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-md bg-[#0f1120] border border-white/10 rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-white">Edit Listing</h3>
                <p className="text-xs text-slate-500 mt-0.5 truncate max-w-[280px]">{item.title}</p>
              </div>
              <button onClick={() => setShowEdit(false)} className="p-2 rounded-full hover:bg-white/5 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-wide mb-1.5 block">Price (₹)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min="1"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-teal-500/50 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs text-slate-500 uppercase tracking-wide mb-1.5 block">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-teal-500/50 transition-colors resize-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-500 uppercase tracking-wide mb-1.5 block">Image URL</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-teal-500/50 transition-colors placeholder:text-slate-600"
                />
                {imageUrl && (
                  <img src={imageUrl} alt="Preview" className="mt-2 w-full h-28 object-cover rounded-lg border border-white/10" onError={(e) => (e.currentTarget.style.display = 'none')} />
                )}
              </div>

              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-400 font-semibold border border-teal-500/25 transition-colors disabled:opacity-50 mt-2"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
