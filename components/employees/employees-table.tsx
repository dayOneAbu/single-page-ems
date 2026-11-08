
"use client"

import { useEffect, useMemo, useState } from "react"

import {
  createColumnHelper,
  useTable,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table"

import {
  columnFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  columnVisibilityFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_includesString,
  sortFn_alphanumeric,
  sortFn_text,
  tableFeatures,
} from "@tanstack/react-table"

import type { Employee, EmployeeDialogMode } from "@/lib/employee-types"
import {
  fetchEmployees,
  createEmployeeApi,
  updateEmployeeApi,
  deleteEmployeeApi,
  ApiError,
} from "@/lib/api-client"
import { EmployeeDialog } from "./employee-dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { toast, ToastAction } from "@/components/ui/toast"
import { cn } from "cn"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  Search,
  Plus,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  Pencil,
  Trash2,
  Users,
  RotateCcw,
  Loader2,
  RefreshCw,
} from "lucide-react"

const features = tableFeatures({
  columnVisibilityFeature,
  columnFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,

  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),

  filterFns: {
    includesString: filterFn_includesString,
  },

  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    text: sortFn_text,
  },
})

type EmployeeTableFeatures = typeof features

const columnHelper = createColumnHelper<
  EmployeeTableFeatures,
  Employee
>()

export function EmployeesTable() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [search, setSearch] = useState("")

  const [sorting, setSorting] = useState<SortingState>([])

  const [columnFilters, setColumnFilters] =
    useState<ColumnFiltersState>([])

  const [dialogOpen, setDialogOpen] = useState(false)

  const [selectedEmployee, setSelectedEmployee] =
    useState<Employee | null>(null)

  const [dialogMode, setDialogMode] =
    useState<EmployeeDialogMode>("view")

  useEffect(() => {
    let ignore = false

    async function loadEmployees() {
      try {
        const data = await fetchEmployees()
        if (!ignore) {
          setEmployees(data)
        }
      } catch (error) {
        if (!ignore) {
          const message =
            error instanceof ApiError
              ? error.message
              : "Could not retrieve employees from SQLite."
          toast({
            variant: "destructive",
            title: "Failed to load employees",
            description: message,
          })
        }
      } finally {
        if (!ignore) {
          setIsLoading(false)
        }
      }
    }

    loadEmployees()

    return () => {
      ignore = true
    }
  }, [])

  async function refreshEmployees() {
    setIsLoading(true)
    try {
      const data = await fetchEmployees()
      setEmployees(data)
      toast({
        variant: "success",
        title: "Database Synced",
        description: `Successfully loaded ${data.length} employee record${data.length === 1 ? "" : "s"} from SQLite.`,
      })
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Could not retrieve employees from SQLite."
      toast({
        variant: "destructive",
        title: "Sync Failed",
        description: message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredEmployees = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) return employees

    return employees.filter((employee) => {
      const searchableValues = [
        employee.employeeId,
        employee.firstName,
        employee.middleName,
        employee.lastName,
        employee.email,
        employee.phone,
        employee.department,
        employee.jobTitle,
        employee.employmentType,
        employee.city,
        employee.nationality,
      ]

      return searchableValues.some((value) =>
        value.toLowerCase().includes(query)
      )
    })
  }, [employees, search])

  function openCreateDialog() {
    setSelectedEmployee(null)
    setDialogMode("create")
    setDialogOpen(true)
  }

  function openViewDialog(employee: Employee) {
    setSelectedEmployee(employee)
    setDialogMode("view")
    setDialogOpen(true)
  }

  function openEditDialog(employee: Employee) {
    setSelectedEmployee(employee)
    setDialogMode("edit")
    setDialogOpen(true)
  }

  async function handleSave(employee: Employee): Promise<boolean> {
    const isUpdate = employees.some((item) => item.id === employee.id)

    try {
      const savedEmployee = isUpdate
        ? await updateEmployeeApi(employee.id, employee)
        : await createEmployeeApi(employee)

      setEmployees((previous) => {
        const exists = previous.some((item) => item.id === savedEmployee.id)
        if (exists) {
          return previous.map((item) =>
            item.id === savedEmployee.id ? savedEmployee : item
          )
        }
        return [savedEmployee, ...previous]
      })

      setSelectedEmployee(null)

      toast({
        variant: "success",
        title: isUpdate ? "Employee Updated Successfully" : "Employee Registered Successfully",
        description: `${savedEmployee.firstName} ${savedEmployee.lastName} (${savedEmployee.employeeId}) was saved to SQLite database.`,
      })
      return true
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "An error occurred while saving to SQLite."
      toast({
        variant: "destructive",
        title: isUpdate ? "Failed to Update Employee" : "Failed to Register Employee",
        description: message,
      })
      return false
    }
  }

  function handleDelete(employee: Employee) {
    const fullName = `${employee.firstName} ${employee.lastName}`.trim()

    toast({
      variant: "destructive",
      title: "Delete Employee",
      description: `Are you sure you want to delete ${fullName} (${employee.employeeId})? This action cannot be undone.`,
      duration: 12000,
      action: (
        <ToastAction
          altText="Confirm Delete"
          onClick={async () => {
            try {
              await deleteEmployeeApi(employee.id)

              setEmployees((previous) =>
                previous.filter((item) => item.id !== employee.id)
              )

              toast({
                variant: "success",
                title: "Employee Deleted Successfully",
                description: `${fullName} has been removed from database.`,
              })
            } catch (error) {
              const message =
                error instanceof ApiError
                  ? error.message
                  : "Failed to delete employee via API."
              toast({
                variant: "destructive",
                title: "Failed to Delete Employee",
                description: message,
              })
            }
          }}
        >
          Confirm Delete
        </ToastAction>
      ),
    })
  }

  const columns = useMemo(
    () =>
      columnHelper.columns([
        columnHelper.accessor("employeeId", {
          header: ({ column }) => (
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                column.toggleSorting(
                  column.getIsSorted() === "asc"
                )
              }
            >
              Employee ID
              <ArrowUpDown className="ml-2 size-4" />
            </Button>
          ),
          sortFn: "alphanumeric",
        }),

        columnHelper.accessor(
          (row) =>
            `${row.firstName} ${row.middleName} ${row.lastName}`.trim(),
          {
            id: "fullName",
            header: ({ column }) => (
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  column.toggleSorting(
                    column.getIsSorted() === "asc"
                  )
                }
              >
                Employee Name
                {column.getIsSorted() === "asc" ? (
                  <ArrowUp className="ml-2 size-4" />
                ) : column.getIsSorted() === "desc" ? (
                  <ArrowDown className="ml-2 size-4" />
                ) : (
                  <ArrowUpDown className="ml-2 size-4" />
                )}
              </Button>
            ),
            sortFn: "text",
            cell: ({ row }) => (
              <div className="flex flex-col">
                <span className="font-medium">
                  {row.getValue("fullName")}
                </span>
                <span className="text-xs text-muted-foreground">
                  {row.original.email}
                </span>
              </div>
            ),
          }
        ),

        columnHelper.accessor("department", {
          header: ({ column }) => (
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                column.toggleSorting(
                  column.getIsSorted() === "asc"
                )
              }
            >
              Department
              <ArrowUpDown className="ml-2 size-4" />
            </Button>
          ),
          filterFn: "includesString",
          sortFn: "text",
        }),

        columnHelper.accessor("jobTitle", {
          header: "Position",
          sortFn: "text",
        }),

        columnHelper.accessor("phone", {
          header: "Phone",
          enableSorting: false,
        }),

        columnHelper.accessor("employmentType", {
          header: "Employment Type",
          cell: ({ row }) => (
            <Badge variant="secondary">
              {row.original.employmentType}
            </Badge>
          ),
        }),

        columnHelper.display({
          id: "actions",
          header: "Actions",
          cell: ({ row }) => {
            const employee = row.original

            return (
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  title="View employee"
                  onClick={(event) => {
                    event.stopPropagation()
                    openViewDialog(employee)
                  }}
                >
                  <Eye className="size-4" />
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  title="Edit employee"
                  onClick={(event) => {
                    event.stopPropagation()
                    openEditDialog(employee)
                  }}
                >
                  <Pencil className="size-4" />
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  title="Delete employee"
                  className="text-destructive hover:text-destructive"
                  onClick={(event) => {
                    event.stopPropagation()
                    handleDelete(employee)
                  }}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            )
          },
        }),
      ]),
    []
  )

  const table = useTable({
    features,
    data: filteredEmployees,
    columns,

    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,

    state: {
      sorting,
      columnFilters,
    },
  })

  const departments = useMemo(
    () =>
      Array.from(
        new Set(employees.map((employee) => employee.department))
      ).filter(Boolean),
    [employees]
  )

  const departmentFilter =
    (table.getColumn("department")?.getFilterValue() as string) ?? ""

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Employees
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage employee records, personal information and employment details.
          </p>
        </div>

        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 size-4" />
          Add Employee
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="rounded-lg bg-primary/10 p-3">
              <Users className="size-5 text-primary" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Total Employees
              </p>
              <p className="text-2xl font-bold">
                {employees.length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              Departments
            </p>
            <p className="text-2xl font-bold">
              {departments.length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              Permanent Employees
            </p>
            <p className="text-2xl font-bold">
              {employees.filter(
                (employee) =>
                  employee.employmentType === "Permanent"
              ).length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              Showing Results
            </p>
            <p className="text-2xl font-bold">
              {table.getFilteredRowModel().rows.length}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center">

        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            placeholder="Search employee ID, name, email, phone..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value)
              table.setPageIndex(0)
            }}
            className="pl-9"
          />
        </div>

        <Select
          value={departmentFilter || "all"}
          onValueChange={(value) => {
            table
              .getColumn("department")
              ?.setFilterValue(value === "all" ? undefined : value)

            table.setPageIndex(0)
          }}
        >
          <SelectTrigger className="w-full md:w-[220px]">
            <SelectValue placeholder="Filter by department" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">
              All Departments
            </SelectItem>

            {departments.map((department) => (
              <SelectItem key={department} value={department}>
                {department}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          onClick={() => {
            setSearch("")
            table.resetColumnFilters()
            table.resetSorting()
            table.setPageIndex(0)
          }}
        >
          <RotateCcw className="mr-2 size-4" />
          Reset
        </Button>

        <Button
          variant="outline"
          onClick={() => refreshEmployees()}
          disabled={isLoading}
          title="Refresh employees from SQLite database"
        >
          <RefreshCw className={cn("mr-2 size-4", isLoading && "animate-spin")} />
          Sync
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border bg-card">

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : (
                          <table.FlexRender header={header} />
                        )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-32 text-center"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="size-8 animate-spin text-muted-foreground" />
                      <p className="font-medium">Loading from SQLite database...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="cursor-pointer"
                    onClick={() => openViewDialog(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        <table.FlexRender cell={cell} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-32 text-center"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Users className="size-8 text-muted-foreground" />

                      <p className="font-medium">
                        No employees found
                      </p>

                      <p className="text-sm text-muted-foreground">
                        Try changing your search or department filter.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col gap-3 border-t p-4 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-sm text-muted-foreground">
            Showing{" "}
            {table.getRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} employees
          </p>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Page {table.state.pagination.pageIndex + 1} of{" "}
              {Math.max(table.getPageCount(), 1)}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

    <EmployeeDialog
  key={`${dialogOpen}-${dialogMode}-${selectedEmployee?.id ?? "new"}`}
  open={dialogOpen}
  onOpenChange={setDialogOpen}
  employee={selectedEmployee}
  initialMode={dialogMode}
  onSave={handleSave}
/>
    </div>
  )
}
