"use client"

import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <ToastProvider>
      <ToastViewport>
        {toasts.map(function ({ id, title, description, action, open = true, ...props }) {
          if (!open) return null

          return (
            <Toast key={id} {...props}>
              <div className="flex items-start justify-between gap-2 w-full">
                <div className="flex flex-col gap-1 min-w-0 pr-1">
                  {title && <ToastTitle>{title}</ToastTitle>}
                  {description && (
                    <ToastDescription>{description}</ToastDescription>
                  )}
                </div>
                <ToastClose onClick={() => dismiss(id)} />
              </div>
              {action && <div className="mt-2 flex items-center gap-2">{action}</div>}
            </Toast>
          )
        })}
      </ToastViewport>
    </ToastProvider>
  )
}
