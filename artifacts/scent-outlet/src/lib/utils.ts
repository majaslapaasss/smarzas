import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useState } from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function useCartId() {
  const [cartId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      let id = localStorage.getItem('scent_outlet_cart_id');
      if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem('scent_outlet_cart_id', id);
      }
      return id;
    }
    return '';
  });

  return cartId;
}

export function formatPrice(cents: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
}
