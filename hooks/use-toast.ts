"use client"

import * as React from "react"

const TOAST_LIMIT = 5

export type ToasterToast = {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactElement
  variant?: "default" | "destructive" | "success"
  duration?: number
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

type Action =
  | {
      type: "ADD_TOAST"
      toast: ToasterToast
    }
  | {
      type: "UPDATE_TOAST"
      toast: Partial<ToasterToast>
    }
  | {
      type: "DISMISS_TOAST"
      toastId?: string
    }
  | {
      type: "REMOVE_TOAST"
      toastId?: string
    }

interface State {
  toasts: ToasterToast[]
}

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts.filter((t) => t.id !== action.toast.id)].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }

    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

const listeners: Array<() => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener()
  })
}

function subscribe(listener: () => void) {
  listeners.push(listener)
  return () => {
    const index = listeners.indexOf(listener)
    if (index > -1) {
      listeners.splice(index, 1)
    }
  }
}

function getSnapshot() {
  return memoryState
}

export type Toast = Omit<ToasterToast, "id">

function toast({ duration = 8000, ...props }: Toast) {
  const id = genId()

  const update = (updatedProps: Partial<ToasterToast>) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...updatedProps, id },
    })

  const dismiss = () => {
    dispatch({ type: "DISMISS_TOAST", toastId: id })
    setTimeout(() => {
      dispatch({ type: "REMOVE_TOAST", toastId: id })
    }, 250)
  }

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      duration,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  if (duration > 0) {
    setTimeout(() => {
      dismiss()
    }, duration)
  }

  return {
    id,
    dismiss,
    update,
  }
}

function useToast() {
  const state = React.useSyncExternalStore(subscribe, getSnapshot, getSnapshot)

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => {
      dispatch({ type: "DISMISS_TOAST", toastId })
      setTimeout(() => {
        dispatch({ type: "REMOVE_TOAST", toastId })
      }, 250)
    },
  }
}

export { useToast, toast }
