"use client"

import { motion, useReducedMotion } from "framer-motion"
import { buttonVariants } from "@/components/ui/button"
import { ShoppingCart, Star, Heart } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface ProductRevealCardProps {
  name?: string
  price?: string
  originalPrice?: string
  image?: string
  description?: string
  rating?: number
  reviewCount?: number
  sellerName?: string
  onAdd?: () => void
  onFavorite?: () => void
  enableAnimations?: boolean
  className?: string
  condition?: "new" | "used" | "any"
}

export function ProductRevealCard({
  name = "Premium Wireless Headphones",
  price = "$199",
  originalPrice,
  image = "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&h=600&fit=crop",
  description = "Experience studio-quality sound with advanced noise cancellation and 30-hour battery life.",
  rating = 4.8,
  reviewCount = 124,
  sellerName,
  onAdd,
  onFavorite,
  enableAnimations = true,
  className,
  condition = "new"
}: ProductRevealCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const shouldReduceMotion = useReducedMotion()
  const shouldAnimate = enableAnimations && !shouldReduceMotion

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setIsFavorite(!isFavorite)
    onFavorite?.()
  }

  const containerVariants: any = {
    rest: {
      scale: 1,
      y: 0,
      filter: "blur(0px)",
    },
    hover: shouldAnimate ? {
      scale: 1.03,
      y: -8,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 0.8,
      }
    } : {},
  }

  const imageVariants: any = {
    rest: { scale: 1 },
    hover: { scale: 1.1 },
  }

  const overlayVariants: any = {
    rest: {
      y: "100%",
      opacity: 0,
      filter: "blur(4px)",
    },
    hover: {
      y: "0%",
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 28,
        mass: 0.6,
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const contentVariants: any = {
    rest: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    hover: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
        mass: 0.5,
      },
    },
  }

  const buttonVariants_motion: any = {
    rest: { scale: 1, y: 0 },
    hover: shouldAnimate ? {
      scale: 1.05,
      y: -2,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    } : {},
    tap: shouldAnimate ? { scale: 0.95 } : {},
  }

  const favoriteVariants: any = {
    rest: { scale: 1, rotate: 0 },
    favorite: {
      scale: [1, 1.3, 1],
      rotate: [0, 10, -10, 0],
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      }
    },
  }

  return (
    <motion.div
      data-slot="product-reveal-card"
      initial="rest"
      whileHover="hover"
      variants={containerVariants}
      className={cn(
        "relative rounded-2xl border border-border/50 bg-card text-card-foreground overflow-hidden",
        "shadow-lg shadow-black/5 cursor-pointer group",
        className
      )}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden w-full bg-[#0a0a0a]" style={{ height: '224px' }}>
        <motion.img
          src={image}
          alt={name}
          className="w-full h-full object-contain p-2"
          variants={imageVariants}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&h=600&fit=crop";
            e.currentTarget.className = "w-full h-full object-cover";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212]/60 via-transparent to-transparent pointer-events-none" />

        {/* Favorite Button */}
        <motion.button
          onClick={handleFavorite}
          variants={favoriteVariants}
          animate={isFavorite ? "favorite" : "rest"}
          className={cn(
            "absolute top-4 right-4 p-2 rounded-full backdrop-blur-sm border border-white/20 z-20",
            isFavorite
              ? "bg-red-500 text-white"
              : "bg-black/40 text-white hover:bg-black/60"
          )}
        >
          <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
        </motion.button>

        {/* Discount / Condition Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className={cn(
            "absolute top-4 left-4 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md z-20 border",
            condition === "new" ? "bg-green-500/80 border-green-400" :
              condition === "used" ? "bg-red-500/80 border-red-400" :
                "bg-blue-500/80 border-blue-400"
          )}
        >
          {condition === "any" ? "REFURBISHED" : condition}
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-3 bg-[#181818] relative z-10">
        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-4 h-4",
                  i < Math.floor(rating)
                    ? "text-yellow-400 fill-current"
                    : "text-muted-foreground opacity-30"
                )}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground font-medium text-slate-400">
            {rating.toFixed(1)} <span className="opacity-50">({reviewCount} reviews)</span>
          </span>
        </div>

        {/* Product Info */}
        <div className="space-y-1">
          <motion.h3
            className="text-xl font-bold leading-tight tracking-tight text-white line-clamp-1"
            initial={{ opacity: 0.9 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {name}
          </motion.h3>
          {sellerName && (
            <p className="text-xs text-slate-500">by {sellerName}</p>
          )}

          <div className="flex items-center gap-2 mt-2">
            <span className="text-2xl font-bold text-emerald-400">{price}</span>
            {originalPrice && (
              <span className="text-sm text-slate-500 line-through">
                {originalPrice}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Reveal Overlay */}
      <motion.div
        variants={overlayVariants}
        className="absolute inset-0 bg-[#0a0a0a]/95 backdrop-blur-xl flex flex-col justify-end z-[100]"
      >
        <div className="p-6 space-y-6">
          {/* Product Description */}
          <motion.div variants={contentVariants}>
            <h4 className="font-semibold mb-2 text-white/80">Product Details</h4>
            <p className="text-sm text-slate-400 leading-relaxed line-clamp-4">
              {description}
            </p>
          </motion.div>

          {/* Features */}
          <motion.div variants={contentVariants}>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white/5 border border-white/10 rounded-lg p-2 text-center">
                <div className="font-semibold text-white/90">Verified</div>
                <div className="text-slate-500">Seller</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-2 text-center">
                <div className="font-semibold text-white/90">Secure</div>
                <div className="text-slate-500">Transaction</div>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div variants={contentVariants} className="space-y-3 pt-2">
            <motion.div
              variants={buttonVariants_motion}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              className="w-full"
            >
              {onAdd && (
                <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); onAdd(); }}>
                  {/* The click handler is intercepted to process purchase before routing */}
                  <div className={cn(
                    buttonVariants({ variant: "default" }),
                    "w-full h-12 font-medium cursor-pointer relative overflow-hidden",
                    "bg-gradient-to-r from-emerald-500 to-teal-500",
                    "hover:from-emerald-400 hover:to-teal-400",
                    "shadow-lg shadow-emerald-500/25 border-none text-white"
                  )}>
                    <ShoppingCart className="w-5 h-5 mr-3 drop-shadow-md" />
                    <span className="text-base drop-shadow-md">Purchase Item</span>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}
