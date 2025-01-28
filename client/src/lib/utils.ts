import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatViews = (views: number): string => {
  if (views >= 1000000) {
    return (views / 1000000).toFixed(1) + 'M views';
  } else if (views >= 1000) {
    return (views / 1000).toFixed(1) + 'K views';
  } else {
    return views + ' views';
  }
}
export function convertSecondsToHMS(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60); // Remove fractional part

  let result = '';

  // Include hours only if greater than zero
  if (hours > 0) {
      result += `${hours.toString().padStart(2, '0')}:`;
  }

  // Always include minutes
  result += `${minutes.toString().padStart(2, '0')}:`;

  // Ensure two digits for seconds
  result += remainingSeconds.toString().padStart(2, '0');

  return result;
}