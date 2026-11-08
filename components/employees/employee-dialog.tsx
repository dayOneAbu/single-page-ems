
"use client"

import { useState } from "react"
import {
  createEmptyEmployee,
  type Employee,
  type EmployeeDialogMode,
} from "@/lib/employee-types"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Loader2 } from "lucide-react"

type EmployeeDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  employee: Employee | null
  initialMode: EmployeeDialogMode
  onSave: (employee: Employee) => Promise<boolean> | void | boolean
}

const sections: {
  title: string
  fields: (keyof Employee)[]
}[] = [
  {
    title: "Personal Information",
    fields: [
      "firstName", "middleName", "lastName", "gender",
      "dateOfBirth", "nationality", "maritalStatus",
    ],
  },
  {
    title: "Contact Information",
    fields: [
      "email", "phone", "alternativePhone", "linkedin",
    ],
  },
  {
    title: "Residential Address",
    fields: [
      "country", "region", "city", "subCity",
      "woreda", "houseNumber", "postalCode",
    ],
  },
  {
    title: "Identification",
    fields: [
      "idType", "idNumber", "idIssueDate", "idExpiryDate",
    ],
  },
  {
    title: "Employment Information",
    fields: [
      "employeeId", "department", "jobTitle", "employmentType",
      "workLocation", "employmentDate", "probationPeriod", "supervisor",
    ],
  },
  {
    title: "Emergency Contact",
    fields: [
      "emergencyName", "emergencyRelationship",
      "emergencyPhone", "emergencyEmail",
    ],
  },
  {
    title: "Education",
    fields: [
      "educationLevel", "institution", "fieldOfStudy", "graduationYear",
    ],
  },
  {
    title: "Banking Information",
    fields: [
      "bankName", "accountHolder", "accountNumber", "branchName",
    ],
  },
  {
    title: "Additional Information",
    fields: ["skills", "languages", "notes"],
  },
]

function getLabel(value: string) {
  return value
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (letter) => letter.toUpperCase())
}

function getInputType(key: keyof Employee) {
  if (
    key === "dateOfBirth" ||
    key === "idIssueDate" ||
    key === "idExpiryDate" ||
    key === "employmentDate"
  ) {
    return "date"
  }

  if (
    key === "email" ||
    key === "emergencyEmail"
  ) {
    return "email"
  }

  if (
    key === "phone" ||
    key === "alternativePhone" ||
    key === "emergencyPhone"
  ) {
    return "tel"
  }

  return "text"
}

export function EmployeeDialog({
  open,
  onOpenChange,
  employee,
  initialMode,
  onSave,
}: EmployeeDialogProps) {  

  const [mode, setMode] = useState<EmployeeDialogMode>(initialMode)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState<Employee>(
    employee ?? createEmptyEmployee()
  )

  function updateField(key: keyof Employee, value: string) {
    setFormData((previous) => ({
      ...previous,
      [key]: value,
    }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.employeeId.trim() ||
      !formData.email.trim()
    ) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all required fields (First Name, Last Name, Employee ID, and Email).",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const result = await onSave({
        ...formData,
        id: formData.id || crypto.randomUUID(),
      })

      if (result !== false) {
        onOpenChange(false)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const title =
    mode === "create"
      ? "Register Employee"
      : mode === "edit"
        ? "Edit Employee"
        : "Employee Details"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {mode === "view"
              ? "Complete employee personal and employment record."
              : "Enter the employee information below. Name, employee ID and email are required."}
          </DialogDescription>
        </DialogHeader>

        {mode === "view" ? (
          <div className="space-y-5">
            <div className="rounded-lg bg-muted/50 p-4">
              <h3 className="text-xl font-semibold">
                {formData.firstName} {formData.middleName} {formData.lastName}
              </h3>
              <p className="text-sm text-muted-foreground">
                {formData.employeeId} · {formData.jobTitle}
              </p>
            </div>

            {sections.map((section) => (
              <Card key={section.title}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">
                    {section.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {section.fields.map((key) => (
                    <div key={key} className="min-w-0 space-y-1">
                      <p className="text-xs text-muted-foreground">
                        {getLabel(key)}
                      </p>
                      {key === "notes" ? (
                        <p className="break-words text-sm">
                          {formData[key] || "—"}
                        </p>
                      ) : (
                        <p className="break-words text-sm font-medium">
                          {formData[key] || "—"}
                        </p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Close
              </Button>
              <Button onClick={() => setMode("edit")}>
                Edit Employee
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {sections.map((section) => (
              <Card key={section.title}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">
                    {section.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="grid gap-4 sm:grid-cols-2">
                  {section.fields.map((key) => (
                    <div
                      key={key}
                      className={
                        key === "notes"
                          ? "sm:col-span-2"
                          : ""
                      }
                    >
                      <label
                        htmlFor={key}
                        className="mb-2 block text-sm font-medium"
                      >
                        {getLabel(key)}
                        {[
                          "firstName",
                          "lastName",
                          "email",
                          "employeeId",
                        ].includes(key) && (
                          <span className="text-destructive"> *</span>
                        )}
                      </label>

                      {key === "notes" ? (
                        <Textarea
                          id={key}
                          value={formData[key]}
                          onChange={(event) =>
                            updateField(key, event.target.value)
                          }
                          placeholder="Additional employee information"
                        />
                      ) : (
                        <Input
                          id={key}
                          type={getInputType(key)}
                          value={formData[key]}
                          onChange={(event) =>
                            updateField(key, event.target.value)
                          }
                          required={[
                            "firstName",
                            "lastName",
                            "email",
                            "employeeId",
                          ].includes(key)}
                        />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}

            <Separator />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (employee) {
                    setFormData(employee)
                    setMode("view")
                  } else {
                    onOpenChange(false)
                  }
                }}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Saving...
                  </>
                ) : mode === "create" ? (
                  "Create Employee"
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
