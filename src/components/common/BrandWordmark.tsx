"use client";

type BrandVariant = "header" | "sidebar-expanded" | "sidebar-collapsed";

type BrandWordmarkProps = {
  variant: BrandVariant;
  className?: string;
};

export function BrandWordmark({ variant, className = "" }: BrandWordmarkProps) {
  if (variant === "sidebar-collapsed") {
    return (
      <span
        className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 text-xl font-bold text-white shadow-md shadow-brand-500/25 ring-1 ring-white/15 dark:shadow-brand-900/50 dark:ring-white/10 font-brand-wordmark ${className}`}
      >
        견
      </span>
    );
  }

  const sizeClass =
    variant === "header"
      ? "text-[1.5rem] min-[400px]:text-[1.8125rem]"
      : "text-[1.75rem] leading-snug";

  return (
    <span
      className={`font-brand-wordmark inline-flex items-baseline gap-x-1 whitespace-nowrap font-bold ${sizeClass} tracking-tight ${className}`}
    >
      <span className="text-brand-600 dark:text-brand-400">견</span>
      <span className="text-[0.72em] font-semibold text-brand-500/85 dark:text-brand-300/90">
        (犬)
      </span>
      <span className="text-gray-900 dark:text-white">적서</span>
    </span>
  );
}
