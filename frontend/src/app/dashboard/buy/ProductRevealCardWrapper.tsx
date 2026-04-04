"use client";

import { useState } from "react";
import { ProductRevealCard } from "@/components/ui/product-reveal-card";
import { purchaseItem } from "@/app/actions/market";
import { useRouter } from "next/navigation";

export function ProductRevealCardWrapper({ item }: { item: any }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handlePurchase = async () => {
    if (isLoading) return;
    setIsLoading(true);
    
    // Attempt purchase
    const result = await purchaseItem(item.item_id, parseFloat(item.price));
    if (result.error) {
      alert(result.error);
      setIsLoading(false);
    } else {
      alert("Successfully notified the seller that you're interested in " + item.title + "!");
      router.refresh();
    }
  };

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

  // Use the seller's uploaded image if available, otherwise fall back to category placeholder
  const imageUrl = item.image_url || categoryImages[item.category_name] || categoryImages["Default"];

  return (
    <div className={isLoading ? "opacity-50 pointer-events-none" : ""}>
      <ProductRevealCard 
        name={item.title}
        image={imageUrl}
        price={`₹${parseFloat(item.price).toLocaleString()}`}
        description={item.description}
        rating={parseFloat(item.seller_rating)}
        reviewCount={parseInt(item.seller_review_count)}
        condition={item.condition_type}
        onAdd={handlePurchase}
      />
    </div>
  );
}
