import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { z } from "zod"; // 🟢 Import Zod

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; 
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
};

export const calculateDeliveryFee = (distanceKm: number): number => {
  const BASE_DISTANCE = 2; // First 2km
  const BASE_FEE = 350;
  const PER_KM_RATE = 150;

  if (distanceKm <= BASE_DISTANCE) {
    return BASE_FEE;
  }

  const extraKm = distanceKm - BASE_DISTANCE;
  const extraFee = extraKm * PER_KM_RATE;
  
  return Math.ceil(BASE_FEE + extraFee);
};


//ZOD VALIDATIOIN
// 🟢 1. Simple, readable Zod validation (No Regex)
export const phoneSchema = z.string()
  .min(10, { message: "Phone number is too short (minimum 10 digits)" })
  .max(15, { message: "Phone number is too long (maximum 15 digits)" })
  .refine((val: any) => {
    // 1. Remove any normal spaces the user might type (e.g., "080 1234 5678")
    const cleaned = val.split(" ").join("");
    
    // 2. Ignore the "+" sign if they used country code (+234)
    const stringToCheck = cleaned.startsWith("+") ? cleaned.slice(1) : cleaned;
    
    // 3. Ensure whatever is left is an actual number (not letters like "080abc")
    return !isNaN(Number(stringToCheck));
  }, { message: "Phone number can only contain numbers" });