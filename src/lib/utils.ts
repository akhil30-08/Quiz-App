import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getRandomInt = (n: number) => {
  return Math.floor(Math.random() * Math.floor(n));
};

export const decodeString = (str: string) => {
  return new DOMParser().parseFromString(str, 'text/html').documentElement.textContent;
};
