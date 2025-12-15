import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency (IQD)
export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('ar-IQ', {
    style: 'currency',
    currency: 'IQD',
    maximumFractionDigits: 0,
  }).format(amount);
}

// Generate a random Iraqi license plate
export function generateLicensePlate() {
  const letters = ['أ', 'ب', 'ج', 'د', 'هـ', 'و', 'ز', 'ط', 'ي', 'م', 'ن'];
  const cities = ['بغداد', 'البصرة', 'أربيل', 'النجف', 'كربلاء', 'نينوى'];

  const letter = letters[Math.floor(Math.random() * letters.length)];
  const number = Math.floor(10000 + Math.random() * 90000); // 5 digits
  const city = cities[Math.floor(Math.random() * cities.length)];

  // Format: "Baghdad | A | 12345"
  return {
    city,
    code: `${city} | ${letter} | ${number}`
  };
}
