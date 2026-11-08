"use client"

import { useCallback, useEffect, useState } from "react"
import { EmployeesTable } from "@/components/employees/employees-table"
import RegestrationForm from "@/components/employe-form"
import { Button } from "@/components/ui/button"
import { checkDatabaseHealth } from "@/lib/api-client"
import { Users, UserPlus } from "lucide-react"

export default function EmployeesPage() {
  const [activeTab, setActiveTab] = useState<"directory" | "register">("directory")
  const [connectionStatus, setConnectionStatus] = useState<
    "checking" | "connected" | "disconnected"
  >("checking")

  const verifyConnection = useCallback(async () => {
    setConnectionStatus("checking")
    try {
      const health = await checkDatabaseHealth()
      setConnectionStatus(health.connected ? "connected" : "disconnected")
    } catch {
      setConnectionStatus("disconnected")
    }
  }, [])

  useEffect(() => {
    let ignore = false

    async function check() {
      try {
        const health = await checkDatabaseHealth()
        if (!ignore) {
          setConnectionStatus(health.connected ? "connected" : "disconnected")
        }
      } catch {
        if (!ignore) {
          setConnectionStatus("disconnected")
        }
      }
    }

    void check()
    const interval = setInterval(() => {
      void check()
    }, 30000)

    return () => {
      ignore = true
      clearInterval(interval)
    }
  }, [])

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b pb-4">
        <div className="flex items-center gap-2">
          <Button
            variant={activeTab === "directory" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("directory")}
            className="font-medium"
          >
            <Users className="mr-2 size-4" />
            Employee Directory
          </Button>

          <Button
            variant={activeTab === "register" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("register")}
            className="font-medium"
          >
            <UserPlus className="mr-2 size-4" />
            Employee Registration Form
          </Button>
        </div>

        <button
          type="button"
          onClick={() => {
            setConnectionStatus("checking")
            verifyConnection()
          }}
          title="Click to re-check SQLite database connection status"
          className="inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium transition-all duration-200 hover:opacity-85 focus:outline-none focus:ring-2 focus:ring-ring"
          style={{
            borderColor:
              connectionStatus === "connected"
                ? "rgba(16, 185, 129, 0.35)"
                : connectionStatus === "disconnected"
                  ? "rgba(239, 68, 68, 0.35)"
                  : "rgba(156, 163, 175, 0.35)",
            backgroundColor:
              connectionStatus === "connected"
                ? "rgba(16, 185, 129, 0.1)"
                : connectionStatus === "disconnected"
                  ? "rgba(239, 68, 68, 0.1)"
                  : "rgba(156, 163, 175, 0.1)",
          }}
        >
          {connectionStatus === "connected" ? (
            <>
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-emerald-700 dark:text-emerald-400">
                Connected to SQLite database (<span className="font-mono font-semibold">employees.db</span>)
              </span>
            </>
          ) : connectionStatus === "disconnected" ? (
            <>
              <span className="relative flex size-2">
                <span className="relative inline-flex size-2 rounded-full bg-red-500" />
              </span>
              <span className="text-red-600 dark:text-red-400">
                Disconnected from SQLite database (<span className="font-mono font-semibold">employees.db</span>)
              </span>
            </>
          ) : (
            <>
              <span className="inline-block size-2 animate-pulse rounded-full bg-amber-500" />
              <span className="text-amber-700 dark:text-amber-400">
                Connecting to SQLite database (<span className="font-mono">employees.db</span>)...
              </span>
            </>
          )}
        </button>
      </div>

      {activeTab === "directory" ? (
        <EmployeesTable />
      ) : (
        <RegestrationForm
          onSuccess={() => {
            setActiveTab("directory")
          }}
        />
      )}
    </main>
  )
}
