export function sanitizeUsername(username: string): string {
  if (!username) return '';
  return username.trim().replace(/[^\w.-]/g, '').slice(0, 32);
}

export function formatNumber(num: number): string {
  return num.toLocaleString();
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatKD(kd: number): string {
  return kd.toFixed(2);
}