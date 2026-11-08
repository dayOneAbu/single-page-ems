
"use client"

import { useState } from "react"
import {
  Controller,
  useForm,
  type Control,
  type FieldPath,
} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  employeeFormSchema,
  type EmployeeFormValues,
} from "@/lib/employee-types"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
  FieldGroup,
} from "@/components/ui/field"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/toast"
import { createEmployeeApi, ApiError } from "@/lib/api-client"
import type { Employee } from "@/lib/employee-types"
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react"

 
const FormSchema = employeeFormSchema

type FormValues = EmployeeFormValues
 
const defaultValues: FormValues = {
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
 

type TextFieldProps = {
  control: Control<FormValues>
  name: FieldPath<FormValues>
  label: string
  placeholder?: string
  type?: string
  required?: boolean
  description?: string
}

function TextField({
  control,
  name,
  label,
  placeholder,
  type = "text",
  required = false,
  description,
}: TextFieldProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>
            {label}
            {required && (
              <span className="text-destructive"> *</span>
            )}
          </FieldLabel>

          {description && (
            <FieldDescription>{description}</FieldDescription>
          )}

          <Input
            {...field}
            id={field.name}
            type={type}
            placeholder={placeholder}
            aria-invalid={fieldState.invalid}
          />

          {fieldState.invalid && (
            <FieldError errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />
  )
}


type SelectFieldProps = {
  control: Control<FormValues>
  name: FieldPath<FormValues>
  label: string
  options: string[]
  placeholder?: string
  required?: boolean
}

function SelectField({
  control,
  name,
  label,
  options,
  placeholder = "Select an option",
  required = false,
}: SelectFieldProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>
            {label}
            {required && (
              <span className="text-destructive"> *</span>
            )}
          </FieldLabel>

          <Select
            value={field.value}
            onValueChange={field.onChange}
          >
            <SelectTrigger
              id={field.name}
              aria-invalid={fieldState.invalid}
              className="w-full"
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>

            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {fieldState.invalid && (
            <FieldError errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />
  )
}


function TextAreaField({
  control,
  name,
  label,
  placeholder,
}: {
  control: Control<FormValues>
  name: FieldPath<FormValues>
  label: string
  placeholder?: string
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>
            {label}
          </FieldLabel>

          <Textarea
            {...field}
            id={field.name}
            placeholder={placeholder}
            className="min-h-28"
            aria-invalid={fieldState.invalid}
          />

          {fieldState.invalid && (
            <FieldError errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />
  )
}



export default function RegestrationForm({
  onSuccess,
}: {
  onSuccess?: (employee: Employee) => void
}) {
  const [submittedEmployee, setSubmittedEmployee] = useState<Employee | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues,
    mode: "onBlur",
  })

  const { control } = form

  async function onSubmit(data: FormValues) {
    setErrorMessage(null)
    try {
      const created = await createEmployeeApi(data)
      setSubmittedEmployee(created)
      toast({
        variant: "success",
        title: "Employee Registered Successfully",
        description: `${created.firstName} ${created.lastName} (${created.employeeId}) has been added to SQLite database.`,
      })
      form.reset(defaultValues)
      onSuccess?.(created)
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "An unexpected error occurred while saving to database"
      setErrorMessage(message)
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: message,
      })
    }
  }

  function onInvalid(errors: Record<string, unknown>) {
    const count = Object.keys(errors).length
    toast({
      variant: "destructive",
      title: "Validation Error",
      description: `Please resolve ${count} missing or invalid field${count === 1 ? "" : "s"} before submitting.`,
    })
  }

  function handleReset() {
    form.reset(defaultValues)
    setSubmittedEmployee(null)
    setErrorMessage(null)
    toast({
      variant: "default",
      title: "Form Reset",
      description: "Employee registration form has been reset to defaults.",
    })
  }

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-8 md:px-8">

      <div className="mx-auto max-w-6xl space-y-8">

    
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            HUMAN RESOURCE MANAGEMENT
          </p>

          <h1 className="text-3xl font-bold tracking-tight">
            Employee Registration
          </h1>

          <p className="text-muted-foreground">
            Register a new employee and maintain their complete
            personal and employment information in SQLite database.
          </p>

          <p className="text-sm text-muted-foreground">
            Fields marked with <span className="text-destructive">*</span> are required.
          </p>
        </div>

        {errorMessage && (
          <div
            role="alert"
            className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive"
          >
            <AlertCircle className="size-5 shrink-0" />
            <div>
              <p className="font-medium">Failed to save employee</p>
              <p>{errorMessage}</p>
            </div>
          </div>
        )}

        {submittedEmployee && (
          <div
            role="status"
            className="flex items-center gap-3 rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-700 dark:text-green-400"
          >
            <CheckCircle2 className="size-5 shrink-0" />
            <div>
              <p className="font-medium">Employee registered successfully!</p>
              <p>
                {submittedEmployee.firstName} {submittedEmployee.lastName} (ID:{" "}
                {submittedEmployee.employeeId}) has been permanently saved to the SQLite database.
              </p>
            </div>
          </div>
        )}

        <form
          onSubmit={form.handleSubmit(onSubmit, onInvalid)}
          className="space-y-6"
          noValidate
        >
 
          <Card>
            <CardHeader>
              <CardTitle>01. Personal Information</CardTitle>
              <CardDescription>
                Employee identity and personal details.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <FieldGroup className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

                <TextField
                  control={control}
                  name="firstName"
                  label="First Name"
                  placeholder="Enter first name"
                  required
                />

                <TextField
                  control={control}
                  name="middleName"
                  label="Middle Name"
                  placeholder="Enter middle name"
                />

                <TextField
                  control={control}
                  name="lastName"
                  label="Last Name"
                  placeholder="Enter last name"
                  required
                />

                <SelectField
                  control={control}
                  name="gender"
                  label="Gender"
                  options={[
                    "Male",
                    "Female",
                    "Other",
                    "Prefer not to say",
                  ]}
                  required
                />

                <TextField
                  control={control}
                  name="dateOfBirth"
                  label="Date of Birth"
                  type="date"
                  required
                />

                <TextField
                  control={control}
                  name="nationality"
                  label="Nationality"
                  placeholder="e.g. Ethiopian"
                  required
                />

                <SelectField
                  control={control}
                  name="maritalStatus"
                  label="Marital Status"
                  options={[
                    "Single",
                    "Married",
                    "Divorced",
                    "Widowed",
                  ]}
                  required
                />

              </FieldGroup>
            </CardContent>
          </Card>
 
          <Card>
            <CardHeader>
              <CardTitle>02. Contact Information</CardTitle>
              <CardDescription>
                Employee communication details.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <FieldGroup className="grid gap-5 md:grid-cols-2">

                <TextField
                  control={control}
                  name="email"
                  label="Email Address"
                  type="email"
                  placeholder="employee@example.com"
                  required
                />

                <TextField
                  control={control}
                  name="phone"
                  label="Primary Phone Number"
                  type="tel"
                  placeholder="+251..."
                  required
                />

                <TextField
                  control={control}
                  name="alternativePhone"
                  label="Alternative Phone Number"
                  type="tel"
                />

                <TextField
                  control={control}
                  name="linkedin"
                  label="LinkedIn Profile"
                  placeholder="https://linkedin.com/in/..."
                />

              </FieldGroup>
            </CardContent>
          </Card>

          
          <Card>
            <CardHeader>
              <CardTitle>03. Residential Address</CardTitle>
              <CardDescription>
                Current residential location and address.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <FieldGroup className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

                <TextField
                  control={control}
                  name="country"
                  label="Country"
                  required
                />

                <TextField
                  control={control}
                  name="region"
                  label="Region / State"
                />

                <TextField
                  control={control}
                  name="city"
                  label="City"
                  required
                />

                <TextField
                  control={control}
                  name="subCity"
                  label="Sub-city / Zone"
                />

                <TextField
                  control={control}
                  name="woreda"
                  label="Woreda / District"
                />

                <TextField
                  control={control}
                  name="houseNumber"
                  label="House Number"
                />

                <TextField
                  control={control}
                  name="postalCode"
                  label="Postal Code"
                />

              </FieldGroup>
            </CardContent>
          </Card>

          
          <Card>
            <CardHeader>
              <CardTitle>04. Identification Information</CardTitle>
              <CardDescription>
                Official identity document details.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <FieldGroup className="grid gap-5 md:grid-cols-2">

                <SelectField
                  control={control}
                  name="idType"
                  label="Identification Type"
                  options={[
                    "National ID",
                    "Fayda ID",
                    "Passport",
                    "Driving License",
                    "Other",
                  ]}
                  required
                />

                <TextField
                  control={control}
                  name="idNumber"
                  label="Identification Number"
                  required
                />

                <TextField
                  control={control}
                  name="idIssueDate"
                  label="Issue Date"
                  type="date"
                />

                <TextField
                  control={control}
                  name="idExpiryDate"
                  label="Expiry Date"
                  type="date"
                />

              </FieldGroup>
            </CardContent>
          </Card>

        
          <Card>
            <CardHeader>
              <CardTitle>05. Employment Information</CardTitle>
              <CardDescription>
                Organizational role and employment details.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <FieldGroup className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

                <TextField
                  control={control}
                  name="employeeId"
                  label="Employee ID"
                  placeholder="EMP-001"
                  required
                />

                <TextField
                  control={control}
                  name="department"
                  label="Department"
                  placeholder="e.g. Human Resources"
                  required
                />

                <TextField
                  control={control}
                  name="jobTitle"
                  label="Job Title / Position"
                  required
                />

                <SelectField
                  control={control}
                  name="employmentType"
                  label="Employment Type"
                  options={[
                    "Permanent",
                    "Contract",
                    "Temporary",
                    "Internship",
                    "Part-time",
                    "Consultant",
                  ]}
                  required
                />

                <TextField
                  control={control}
                  name="workLocation"
                  label="Work Location"
                />

                <TextField
                  control={control}
                  name="employmentDate"
                  label="Employment Start Date"
                  type="date"
                  required
                />

                <TextField
                  control={control}
                  name="probationPeriod"
                  label="Probation Period"
                  placeholder="e.g. 3 months"
                />

                <TextField
                  control={control}
                  name="supervisor"
                  label="Direct Supervisor"
                />

              </FieldGroup>
            </CardContent>
          </Card>
 
          <Card>
            <CardHeader>
              <CardTitle>06. Emergency Contact</CardTitle>
              <CardDescription>
                Person to contact in case of an emergency.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <FieldGroup className="grid gap-5 md:grid-cols-2">

                <TextField
                  control={control}
                  name="emergencyName"
                  label="Contact Full Name"
                  required
                />

                <TextField
                  control={control}
                  name="emergencyRelationship"
                  label="Relationship"
                  placeholder="e.g. Parent, Spouse"
                  required
                />

                <TextField
                  control={control}
                  name="emergencyPhone"
                  label="Emergency Phone Number"
                  type="tel"
                  required
                />

                <TextField
                  control={control}
                  name="emergencyEmail"
                  label="Emergency Email"
                  type="email"
                />

              </FieldGroup>
            </CardContent>
          </Card>

         
          <Card>
            <CardHeader>
              <CardTitle>07. Educational Background</CardTitle>
              <CardDescription>
                Academic history and qualifications.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <FieldGroup className="grid gap-5 md:grid-cols-2">

                <SelectField
                  control={control}
                  name="educationLevel"
                  label="Highest Education Level"
                  options={[
                    "High School",
                    "Certificate",
                    "Diploma",
                    "Bachelor's Degree",
                    "Master's Degree",
                    "PhD",
                    "Other",
                  ]}
                />

                <TextField
                  control={control}
                  name="institution"
                  label="Institution / University"
                />

                <TextField
                  control={control}
                  name="fieldOfStudy"
                  label="Field of Study"
                />

                <TextField
                  control={control}
                  name="graduationYear"
                  label="Graduation Year"
                  placeholder="e.g. 2024"
                />

              </FieldGroup>
            </CardContent>
          </Card>

          
          <Card>
            <CardHeader>
              <CardTitle>08. Banking Information</CardTitle>
              <CardDescription>
                Optional payroll details. Only authorized HR and
                payroll staff should access this information.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <FieldGroup className="grid gap-5 md:grid-cols-2">

                <TextField
                  control={control}
                  name="bankName"
                  label="Bank Name"
                  placeholder="e.g. Commercial Bank of Ethiopia"
                />

                <TextField
                  control={control}
                  name="accountHolder"
                  label="Account Holder Name"
                />

                <TextField
                  control={control}
                  name="accountNumber"
                  label="Bank Account Number"
                />

                <TextField
                  control={control}
                  name="branchName"
                  label="Bank Branch"
                />

              </FieldGroup>
            </CardContent>
          </Card>
 
          <Card>
            <CardHeader>
              <CardTitle>09. Additional Information</CardTitle>
              <CardDescription>
                Professional skills, languages and other relevant details.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <FieldGroup className="space-y-5">

                <TextField
                  control={control}
                  name="skills"
                  label="Professional Skills"
                  placeholder="e.g. Communication, Management, Programming"
                />

                <TextField
                  control={control}
                  name="languages"
                  label="Languages Spoken"
                  placeholder="e.g. Amharic, English, Afaan Oromo"
                />

                <TextAreaField
                  control={control}
                  name="notes"
                  label="Additional Notes"
                  placeholder="Enter any additional employee information..."
                />

              </FieldGroup>
            </CardContent>
          </Card>

         

          <Separator />

          <div className="flex flex-col-reverse gap-3 pb-8 sm:flex-row sm:justify-end">

            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
            >
              Reset Form
            </Button>

            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Saving to SQLite...
                </>
              ) : (
                "Register Employee"
              )}
            </Button>

          </div>

        </form>
      </div>
    </main>
  )
}