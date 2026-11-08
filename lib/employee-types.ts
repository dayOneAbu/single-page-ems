import { z } from "zod"

export const employeeFormSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name must contain at least 2 characters"),
  middleName: z.string(),
  lastName: z
    .string()
    .trim()
    .min(2, "Last name must contain at least 2 characters"),
  gender: z.string().min(1, "Please select gender"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  nationality: z.string().min(2, "Nationality is required"),
  maritalStatus: z.string().min(1, "Please select marital status"),

  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(7, "Enter a valid phone number"),
  alternativePhone: z.string(),
  linkedin: z.string(),

  country: z.string().min(2, "Country is required"),
  region: z.string(),
  city: z.string().min(2, "City is required"),
  subCity: z.string(),
  woreda: z.string(),
  houseNumber: z.string(),
  postalCode: z.string(),

  idType: z.string().min(1, "Please select identification type"),
  idNumber: z.string().min(3, "ID number is required"),
  idIssueDate: z.string(),
  idExpiryDate: z.string(),

  employeeId: z.string().min(1, "Employee ID is required"),
  department: z.string().min(1, "Department is required"),
  jobTitle: z.string().min(2, "Job title is required"),
  employmentType: z.string().min(1, "Employment type is required"),
  workLocation: z.string(),
  employmentDate: z.string().min(1, "Employment date is required"),
  probationPeriod: z.string(),
  supervisor: z.string(),

  emergencyName: z
    .string()
    .min(2, "Emergency contact name is required"),
  emergencyRelationship: z
    .string()
    .min(1, "Relationship is required"),
  emergencyPhone: z
    .string()
    .min(7, "Enter a valid emergency phone"),
  emergencyEmail: z.string(),

  educationLevel: z.string(),
  institution: z.string(),
  fieldOfStudy: z.string(),
  graduationYear: z.string(),

  bankName: z.string(),
  accountHolder: z.string(),
  accountNumber: z.string(),
  branchName: z.string(),

  skills: z.string(),
  languages: z.string(),
  notes: z.string(),
})

export type EmployeeFormValues = z.infer<typeof employeeFormSchema>

export const employeeSchema = employeeFormSchema.extend({
  id: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export type Employee = z.infer<typeof employeeSchema>

export const createEmployeeSchema = z.object({
  id: z.string().optional(),
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: z.string().trim().min(1, "Email is required"),
  employeeId: z.string().trim().min(1, "Employee ID is required"),

  middleName: z.string().optional().default(""),
  gender: z.string().optional().default(""),
  dateOfBirth: z.string().optional().default(""),
  nationality: z.string().optional().default(""),
  maritalStatus: z.string().optional().default(""),

  phone: z.string().optional().default(""),
  alternativePhone: z.string().optional().default(""),
  linkedin: z.string().optional().default(""),

  country: z.string().optional().default("Ethiopia"),
  region: z.string().optional().default(""),
  city: z.string().optional().default(""),
  subCity: z.string().optional().default(""),
  woreda: z.string().optional().default(""),
  houseNumber: z.string().optional().default(""),
  postalCode: z.string().optional().default(""),

  idType: z.string().optional().default(""),
  idNumber: z.string().optional().default(""),
  idIssueDate: z.string().optional().default(""),
  idExpiryDate: z.string().optional().default(""),

  department: z.string().optional().default(""),
  jobTitle: z.string().optional().default(""),
  employmentType: z.string().optional().default("Permanent"),
  workLocation: z.string().optional().default(""),
  employmentDate: z.string().optional().default(""),
  probationPeriod: z.string().optional().default(""),
  supervisor: z.string().optional().default(""),

  emergencyName: z.string().optional().default(""),
  emergencyRelationship: z.string().optional().default(""),
  emergencyPhone: z.string().optional().default(""),
  emergencyEmail: z.string().optional().default(""),

  educationLevel: z.string().optional().default(""),
  institution: z.string().optional().default(""),
  fieldOfStudy: z.string().optional().default(""),
  graduationYear: z.string().optional().default(""),

  bankName: z.string().optional().default(""),
  accountHolder: z.string().optional().default(""),
  accountNumber: z.string().optional().default(""),
  branchName: z.string().optional().default(""),

  skills: z.string().optional().default(""),
  languages: z.string().optional().default(""),
  notes: z.string().optional().default(""),
})

export const updateEmployeeSchema = createEmployeeSchema.partial()

export type EmployeeDialogMode = "view" | "create" | "edit"

export function createEmptyEmployee(id = ""): Employee {
  return {
    id,

    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    dateOfBirth: "",
    nationality: "",
    maritalStatus: "",

    email: "",
    phone: "",
    alternativePhone: "",
    linkedin: "",

    country: "Ethiopia",
    region: "",
    city: "",
    subCity: "",
    woreda: "",
    houseNumber: "",
    postalCode: "",

    idType: "",
    idNumber: "",
    idIssueDate: "",
    idExpiryDate: "",

    employeeId: "",
    department: "",
    jobTitle: "",
    employmentType: "",
    workLocation: "",
    employmentDate: "",
    probationPeriod: "",
    supervisor: "",

    emergencyName: "",
    emergencyRelationship: "",
    emergencyPhone: "",
    emergencyEmail: "",

    educationLevel: "",
    institution: "",
    fieldOfStudy: "",
    graduationYear: "",

    bankName: "",
    accountHolder: "",
    accountNumber: "",
    branchName: "",

    skills: "",
    languages: "",
    notes: "",
  }
}

export function formatZodErrors(error: z.ZodError): {
  message: string
  fieldErrors: Record<string, string[]>
} {
  const fieldErrors: Record<string, string[]> = {}
  const messages: string[] = []

  for (const issue of error.issues) {
    const path = issue.path.join(".") || "root"
    if (!fieldErrors[path]) {
      fieldErrors[path] = []
    }
    fieldErrors[path].push(issue.message)
    messages.push(`${path}: ${issue.message}`)
  }

  return {
    message: messages.join("; ") || "Validation failed",
    fieldErrors,
  }
}
