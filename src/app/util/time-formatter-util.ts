export const getMinutes = (time: number): string => `${Math.floor((time) / 60)}`.padStart(2, '0');

export const getSeconds = (time: number): string => `${(time) % 60}`.padStart(2, '0');
