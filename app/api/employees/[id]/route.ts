import { NextResponse } from "next/server"
import {
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} from "@/lib/db"
import {
  updateEmployeeSchema,
  formatZodErrors,
} from "@/lib/employee-types"

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(
  _request: Request,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const employee = getEmployeeById(id)

    if (!employee) {
      return NextResponse.json(
        {
          success: false,
          error: "Employee not found",
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: employee,
    })
  } catch (error) {
    console.error("GET /api/employees/[id] error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch employee",
      },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const existing = getEmployeeById(id)

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          error: "Employee not found",
        },
        { status: 404 }
      )
    }

    const json = await request.json()
    const parseResult = updateEmployeeSchema.safeParse(json)

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

    const updated = updateEmployee(id, parseResult.data)

    return NextResponse.json({
      success: true,
      data: updated,
    })
  } catch (error: unknown) {
    console.error("PUT /api/employees/[id] error:", error)
    if (error instanceof Error && error.message.includes("UNIQUE constraint failed")) {
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
        error: "Failed to update employee",
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: Request,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const deleted = deleteEmployee(id)

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          error: "Employee not found or already deleted",
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Employee deleted successfully",
    })
  } catch (error) {
    console.error("DELETE /api/employees/[id] error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete employee",
      },
      { status: 500 }
    )
  }
}
