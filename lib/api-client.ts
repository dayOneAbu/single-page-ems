import type { Employee } from "@/lib/employee-types"

export class ApiError extends Error {
  status: number
  details?: Record<string, string[]>

  constructor(message: string, status = 500, details?: Record<string, string[]>) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.details = details
  }
}

export interface EmployeeFilterParams {
  search?: string
  department?: string
}

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
  details?: Record<string, string[]>
}

async function handleResponse<T>(res: Response): Promise<T> {
  let result: ApiResponse<T>
  try {
    result = await res.json()
  } catch {
    throw new ApiError(
      `Unexpected server response (${res.status} ${res.statusText})`,
      res.status
    )
  }

  if (!res.ok || !result.success) {
    const errorMsg = result.error || result.message || "An error occurred"
    throw new ApiError(errorMsg, res.status, result.details)
  }

  return result.data as T
}

export async function fetchEmployees(
  filters?: EmployeeFilterParams
): Promise<Employee[]> {
  const params = new URLSearchParams()
  if (filters?.search?.trim()) {
    params.set("search", filters.search.trim())
  }
  if (filters?.department && filters.department !== "all") {
    params.set("department", filters.department.trim())
  }

  const query = params.toString() ? `?${params.toString()}` : ""
  const res = await fetch(`/api/employees${query}`, {
    method: "GET",
    headers: { credentials: "same-origin" },
  })

  return handleResponse<Employee[]>(res)
}

export async function fetchEmployeeById(id: string): Promise<Employee> {
  const res = await fetch(`/api/employees/${encodeURIComponent(id)}`, {
    method: "GET",
  })

  return handleResponse<Employee>(res)
}

export async function createEmployeeApi(
  data: Partial<Employee>
): Promise<Employee> {
  const res = await fetch("/api/employees", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  return handleResponse<Employee>(res)
}

export async function updateEmployeeApi(
  id: string,
  data: Partial<Employee>
): Promise<Employee> {
  const res = await fetch(`/api/employees/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  return handleResponse<Employee>(res)
}

export async function deleteEmployeeApi(id: string): Promise<void> {
  const res = await fetch(`/api/employees/${encodeURIComponent(id)}`, {
    method: "DELETE",
  })

  await handleResponse<{ message?: string }>(res)
}

export async function checkDatabaseHealth(): Promise<{
  connected: boolean
  database?: string
  error?: string
}> {
  try {
    const res = await fetch("/api/health", { cache: "no-store" })
    const json = await res.json()
    if (res.ok && json.status === "connected") {
      return { connected: true, database: json.database || "employees.db" }
    }
    return {
      connected: false,
      database: "employees.db",
      error: json.error || "Connection failed",
    }
  } catch (error) {
    return {
      connected: false,
      database: "employees.db",
      error: error instanceof Error ? error.message : "Network error",
    }
  }
}
