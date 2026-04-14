import { type ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost";
type Size = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
};

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-yellow-400 text-zinc-950 enabled:hover:bg-yellow-300",
  secondary:
    "border border-zinc-600 text-zinc-200 enabled:hover:border-zinc-400",
  danger:
    "border border-rose-500/50 text-rose-200 enabled:hover:border-rose-400",
  ghost:
    "text-zinc-400 enabled:hover:text-zinc-100",
};

const sizeClasses: Record<Size, string> = {
  sm: "rounded-full px-3 py-1 text-xs",
  md: "rounded-full px-5 py-2 text-sm",
  lg: "rounded-full px-6 py-2.5 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className = "",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...rest}
    >
      {loading ? (
        <>
          <span className="mr-2 inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
          {children}
        </>
      ) : (
        children
      )}
    </button>
  );
}
