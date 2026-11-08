"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { AlertCircle, CheckCircle2, X } from "lucide-react"
import { cn } from "cn"

export { useToast, toast } from "@/hooks/use-toast"

const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

const ToastViewport = React.forwardRef<
  HTMLOListElement,
  React.OlHTMLAttributes<HTMLOListElement>
>(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    className={cn(
      "fixed bottom-4 right-4 z-[9999] flex max-h-screen w-full max-w-[420px] flex-col gap-2 p-0 pointer-events-none sm:bottom-6 sm:right-6",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = "ToastViewport"

const toastVariants = cva(
  "pointer-events-auto relative flex w-full items-start justify-between gap-3 overflow-hidden rounded-xl border bg-card p-4 text-card-foreground shadow-2xl transition-all duration-200",
  {
    variants: {
      variant: {
        default: "border-border bg-card text-card-foreground",
        destructive:
          "border-destructive/40 bg-card text-card-foreground ring-1 ring-destructive/30",
        success:
          "border-emerald-500/40 bg-card text-card-foreground ring-1 ring-emerald-500/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface ToastProps
  extends React.HTMLAttributes<HTMLLIElement>,
    VariantProps<typeof toastVariants> {
  onOpenChange?: (open: boolean) => void
}

const Toast = React.forwardRef<HTMLLIElement, ToastProps>(
  ({ className, variant, children, ...props }, ref) => {
    return (
      <li
        ref={ref}
        className={cn(toastVariants({ variant }), className)}
        {...props}
      >
        <div className="flex items-start gap-3 w-full min-w-0">
          {variant === "destructive" && (
            <AlertCircle className="size-5 shrink-0 text-destructive mt-0.5" />
          )}
          {variant === "success" && (
            <CheckCircle2 className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
          )}
          <div className="flex flex-1 flex-col gap-1 min-w-0">{children}</div>
        </div>
      </li>
    )
  }
)
Toast.displayName = "Toast"

interface ToastActionProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  altText?: string
}

const ToastAction = React.forwardRef<HTMLButtonElement, ToastActionProps>(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn(
        "inline-flex h-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-transparent bg-destructive px-3 text-xs font-semibold text-destructive-foreground transition-colors hover:bg-destructive/90 active:scale-95 focus:outline-none focus:ring-2 focus:ring-destructive/50 disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
)
ToastAction.displayName = "ToastAction"

const ToastClose = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    className={cn(
      "shrink-0 cursor-pointer rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="size-4" />
  </button>
))
ToastClose.displayName = "ToastClose"

const ToastTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("text-sm font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
ToastTitle.displayName = "ToastTitle"

const ToastDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-xs text-muted-foreground leading-relaxed", className)}
    {...props}
  />
))
ToastDescription.displayName = "ToastDescription"

export {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  type ToastProps,
  type ToastActionProps,
}
