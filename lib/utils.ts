import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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