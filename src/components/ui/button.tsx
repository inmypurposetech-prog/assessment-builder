import Link from "next/link";
import {
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  forwardRef,
} from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary",
  secondary:
    "border-2 border-primary text-primary bg-white hover:bg-primary/5 focus-visible:ring-primary",
  ghost: "text-foreground hover:bg-muted focus-visible:ring-primary",
};

const baseClasses =
  "inline-flex min-h-12 cursor-pointer items-center justify-center rounded-lg px-6 text-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

export function buttonClassName(
  variant: ButtonVariant = "primary",
  className = "",
): string {
  return `${baseClasses} ${variantClasses[variant]} ${className}`.trim();
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { className = "", variant = "primary", type = "button", ...props },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        className={buttonClassName(variant, className)}
        {...props}
      />
    );
  },
);

export interface ButtonLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
  variant?: ButtonVariant;
}

/** Use for navigation CTAs — full control surface is the link (not a button nested in an anchor). */
export function ButtonLink({
  href,
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonLinkProps) {
  const ghostLink =
    variant === "ghost" ? "underline underline-offset-4" : "";
  return (
    <Link
      href={href}
      className={buttonClassName(variant, `${ghostLink} ${className}`)}
      {...props}
    >
      {children}
    </Link>
  );
}
