import { NextResponse } from "next/server"
import {
  getAllEmployees,
  createEmployee,
  getEmployeeById,
} from "@/lib/db"
import {
  createEmployeeSchema,
  formatZodErrors,
  type Employee,
} from "@/lib/employee-types"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || undefined
    const department = searchParams.get("department") || undefined

    const employees = getAllEmployees({ search, department })

    return NextResponse.json({
      success: true,
      data: employees,
    })
  } catch (error) {
    console.error("GET /api/employees error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch employees from database",
      },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json()

    const parseResult = createEmployeeSchema.safeParse(json)
    if (!parseResult.success) {
      const formatted = formatZodErrors(parseResult.error)
      return NextResponse.json(
        {
          success: false,
          error: formatted.message,
          details: formatted.fieldErrors,
        },
        { status: 400 }
      )
    }

    const data = parseResult.data
    const id = data.id?.trim() || crypto.randomUUID()

    const existing = getEmployeeById(id)
    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: `Employee with ID ${id} already exists`,
        },
        { status: 409 }
      )
    }

    const newEmployee: Employee = {
      ...data,
      id,
    }

    const saved = createEmployee(newEmployee)

    return NextResponse.json(
      {
        success: true,
        data: saved,
      },
      { status: 201 }
    )
  } catch (error: unknown) {
    console.error("POST /api/employees error:", error)

    if (error instanceof Error && error.message.includes("UNIQUE constraint failed")) {
      if (error.message.includes("employeeId")) {
        return NextResponse.json(
          {
            success: false,
            error: "An employee with this Employee ID already exists",
          },
          { status: 409 }
        )
      }
      return NextResponse.json(
        {
          success: false,
          error: "A unique constraint violation occurred",
        },
        { status: 409 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create employee",
      },
      { status: 500 }
    )
  }
}
