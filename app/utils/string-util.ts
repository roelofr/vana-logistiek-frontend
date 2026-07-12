export function toLucideIcon(icon: string): string {
  if (icon.startsWith("i-")) return icon;
  return `i-lucide-${icon}`;
}
