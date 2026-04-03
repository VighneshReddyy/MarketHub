"use client";

import { createListing } from "@/app/actions/market";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function SellForm({ categories }: { categories: any[] }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const handleAction = async () => {
    if (!formRef.current) return;
    setIsLoading(true);
    const formData = new FormData(formRef.current);
    const result = await createListing(formData);
    
    if (result.error) {
      alert(result.error);
      setIsLoading(false);
    } else {
      router.push("/dashboard/buy");
    }
  };

  return (
    <motion.form 
      ref={formRef} 
      action={handleAction} 
      className="space-y-10"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={itemVariants} className="relative pt-6 group">
        <input 
          type="text" 
          name="title" 
          id="title" 
          required 
          placeholder=" "
          className="peer w-full bg-transparent border-b border-green-500/20 text-green-400 font-jetbrains text-lg focus:outline-none placeholder-transparent py-2"
        />
        <label htmlFor="title" className="absolute left-0 top-8 text-slate-500 font-syne text-xl transition-all duration-300 peer-focus:-translate-y-8 peer-focus:text-xs peer-focus:text-green-500 peer-focus:tracking-widest uppercase peer-[:not(:placeholder-shown)]:-translate-y-8 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-green-500 peer-[:not(:placeholder-shown)]:tracking-widest">
          Asset Designation
        </label>
        <div className="absolute bottom-0 left-0 h-[2px] w-full bg-green-400 scale-x-0 origin-left transition-transform duration-500 peer-focus:scale-x-100" />
      </motion.div>

      <motion.div variants={itemVariants} className="relative pt-6 group flex items-center">
        <span className="absolute left-0 top-8 text-3xl font-jetbrains text-green-500/30">₹</span>
        <input 
          type="number" 
          name="price" 
          id="price" 
          required 
          min="1" 
          placeholder=" "
          className="peer w-full bg-transparent border-b border-green-500/20 text-green-400 font-jetbrains text-xl focus:outline-none placeholder-transparent py-2 pl-8"
        />
        <label htmlFor="price" className="absolute left-8 top-8 text-slate-500 font-syne text-xl transition-all duration-300 peer-focus:-translate-y-8 peer-focus:text-xs peer-focus:text-green-500 peer-focus:tracking-widest peer-focus:left-0 uppercase peer-[:not(:placeholder-shown)]:-translate-y-8 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-green-500 peer-[:not(:placeholder-shown)]:tracking-widest peer-[:not(:placeholder-shown)]:left-0">
          Valuation
        </label>
        <div className="absolute bottom-0 left-0 h-[2px] w-full bg-green-400 scale-x-0 origin-left transition-transform duration-500 peer-focus:scale-x-100" />
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-8">
        <div className="relative pt-6 group">
          <select name="category_id" id="category_id" required className="peer w-full bg-transparent border-b border-green-500/20 text-green-400 font-jetbrains text-lg focus:outline-none py-2 appearance-none cursor-pointer">
            <option value="" disabled className="bg-black text-slate-500">Select Classification</option>
            {categories.map((c) => (
              <option key={c.category_id} value={c.category_id} className="bg-[#050605] text-green-500">
                {c.name}
              </option>
            ))}
          </select>
          <div className="absolute bottom-0 left-0 h-[2px] w-full bg-green-400 scale-x-0 origin-left transition-transform duration-500 peer-focus:scale-x-100" />
        </div>

        <div className="relative pt-6 group">
          <select name="condition" id="condition" required className="peer w-full bg-transparent border-b border-green-500/20 text-amber-500 font-jetbrains text-lg focus:outline-none py-2 appearance-none cursor-pointer">
            <option value="" disabled className="bg-black text-slate-500">Status</option>
            <option value="new" className="bg-[#050605] text-amber-500">Brand New</option>
            <option value="used" className="bg-[#050605] text-amber-500">Used / Restored</option>
          </select>
          <div className="absolute bottom-0 left-0 h-[2px] w-full bg-green-400 scale-x-0 origin-left transition-transform duration-500 peer-focus:scale-x-100" />
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="relative pt-6 group">
        <textarea 
          name="description" 
          id="description" 
          required 
          placeholder=" "
          rows={3}
          className="peer w-full bg-transparent border-b border-green-500/20 text-green-400 font-jetbrains text-sm focus:outline-none placeholder-transparent py-2 resize-none"
        />
        <label htmlFor="description" className="absolute left-0 top-8 text-slate-500 font-syne text-xl transition-all duration-300 peer-focus:-translate-y-8 peer-focus:text-xs peer-focus:text-green-500 peer-focus:tracking-widest uppercase peer-[:not(:placeholder-shown)]:-translate-y-8 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-green-500 peer-[:not(:placeholder-shown)]:tracking-widest">
          Encrypted Description
        </label>
        <div className="absolute bottom-0 left-0 h-[2px] w-full bg-green-400 scale-x-0 origin-left transition-transform duration-500 peer-focus:scale-x-100" />
      </motion.div>

      <motion.div variants={itemVariants} className="pt-6">
        <button 
          type="submit" 
          disabled={isLoading}
          className="relative w-full overflow-hidden bg-green-500 text-black font-syne font-bold text-xl uppercase py-4 transition-all hover:bg-green-400 group disabled:opacity-50"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Transmit to Grid"}
          </span>
          <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[size:100%_4px] opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </motion.div>
    </motion.form>
  );
}
