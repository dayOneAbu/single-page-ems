import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"

export async function GET() {
  try {
    const db = getDb()
    const result = db.prepare("SELECT 1 as healthy").get() as
      | { healthy: number | bigint }
      | undefined

    if (result && Number(result.healthy) === 1) {
      return NextResponse.json({
        success: true,
        status: "connected",
        database: "employees.db",
      })
    }

    return NextResponse.json(
      {
        success: false,
        status: "disconnected",
        error: "Database check failed",
      },
      { status: 500 }
    )
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Database connection failed"
    return NextResponse.json(
      {
        success: false,
        status: "disconnected",
        error: message,
      },
      { status: 500 }
    )
  }
}
