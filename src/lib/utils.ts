
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const valueRangeFormatter = (value: number) => {
  if (value < 10000) {
    return "Below ₹10,000";
  } else if (value < 25000) {
    return "₹10,000 - ₹25,000";
  } else if (value < 50000) {
    return "₹25,000 - ₹50,000";
  } else if (value < 75000) {
    return "₹50,000 - ₹75,000";
  } else if (value < 100000) {
    return "₹75,000 - ₹1,00,000";
  } else {
    return "Above ₹1,00,000";
  }
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  }).format(date);
};

export const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const conditionColor = (condition: string) => {
  switch (condition) {
    case 'New':
      return 'bg-green-100 text-green-700';
    case 'Good':
      return 'bg-blue-100 text-blue-700';
    case 'Used':
      return 'bg-yellow-100 text-yellow-700';
    case 'Needs Repair':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

