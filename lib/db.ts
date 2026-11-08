import { DatabaseSync } from "node:sqlite"
import path from "node:path"
import type { Employee } from "@/lib/employee-types"

const ALL_COLUMNS = [
  "id",
  "firstName",
  "middleName",
  "lastName",
  "gender",
  "dateOfBirth",
  "nationality",
  "maritalStatus",
  "email",
  "phone",
  "alternativePhone",
  "linkedin",
  "country",
  "region",
  "city",
  "subCity",
  "woreda",
  "houseNumber",
  "postalCode",
  "idType",
  "idNumber",
  "idIssueDate",
  "idExpiryDate",
  "employeeId",
  "department",
  "jobTitle",
  "employmentType",
  "workLocation",
  "employmentDate",
  "probationPeriod",
  "supervisor",
  "emergencyName",
  "emergencyRelationship",
  "emergencyPhone",
  "emergencyEmail",
  "educationLevel",
  "institution",
  "fieldOfStudy",
  "graduationYear",
  "bankName",
  "accountHolder",
  "accountNumber",
  "branchName",
  "skills",
  "languages",
  "notes",
] as const

const SEED_EMPLOYEES: Omit<Employee, "id">[] = [
  {
    firstName: "Abebe",
    middleName: "Kebede",
    lastName: "Tesfaye",
    gender: "Male",
    dateOfBirth: "1992-05-12",
    nationality: "Ethiopian",
    maritalStatus: "Married",
    email: "abebe.tesfaye@example.com",
    phone: "+251911123456",
    alternativePhone: "+251922123456",
    linkedin: "https://linkedin.com/in/abebe",
    country: "Ethiopia",
    region: "Addis Ababa",
    city: "Addis Ababa",
    subCity: "Bole",
    woreda: "03",
    houseNumber: "B-123",
    postalCode: "",
    idType: "Fayda ID",
    idNumber: "1234567890123456",
    idIssueDate: "2023-01-10",
    idExpiryDate: "2033-01-10",
    employeeId: "EMP-001",
    department: "Information Technology",
    jobTitle: "Software Developer",
    employmentType: "Permanent",
    workLocation: "Head Office",
    employmentDate: "2022-01-15",
    probationPeriod: "3 months",
    supervisor: "John Manager",
    emergencyName: "Sara Abebe",
    emergencyRelationship: "Spouse",
    emergencyPhone: "+251911987654",
    emergencyEmail: "sara@example.com",
    educationLevel: "Bachelor's Degree",
    institution: "Addis Ababa University",
    fieldOfStudy: "Computer Science",
    graduationYear: "2018",
    bankName: "Commercial Bank of Ethiopia",
    accountHolder: "Abebe Kebede Tesfaye",
    accountNumber: "1000123456789",
    branchName: "Bole Branch",
    skills: "React, Next.js, TypeScript, Node.js",
    languages: "Amharic, English",
    notes: "Experienced software developer.",
  },
  {
    firstName: "Hana",
    middleName: "Bekele",
    lastName: "Desta",
    gender: "Female",
    dateOfBirth: "1995-08-21",
    nationality: "Ethiopian",
    maritalStatus: "Single",
    email: "hana.desta@example.com",
    phone: "+251922345678",
    alternativePhone: "",
    linkedin: "",
    country: "Ethiopia",
    region: "Oromia",
    city: "Adama",
    subCity: "Zone 01",
    woreda: "",
    houseNumber: "",
    postalCode: "",
    idType: "National ID",
    idNumber: "NID-2024-002",
    idIssueDate: "",
    idExpiryDate: "",
    employeeId: "EMP-002",
    department: "Human Resources",
    jobTitle: "HR Officer",
    employmentType: "Permanent",
    workLocation: "Adama Branch",
    employmentDate: "2023-03-01",
    probationPeriod: "3 months",
    supervisor: "Mary HR Manager",
    emergencyName: "Bekele Desta",
    emergencyRelationship: "Father",
    emergencyPhone: "+251911222333",
    emergencyEmail: "",
    educationLevel: "Bachelor's Degree",
    institution: "Adama Science and Technology University",
    fieldOfStudy: "Management",
    graduationYear: "2020",
    bankName: "Awash Bank",
    accountHolder: "Hana Bekele Desta",
    accountNumber: "1000234567890",
    branchName: "",
    skills: "Recruitment, Communication, HR Management",
    languages: "Amharic, Afaan Oromo, English",
    notes: "",
  },
  {
    firstName: "Dawit",
    middleName: "Mekonnen",
    lastName: "Worku",
    gender: "Male",
    dateOfBirth: "1989-11-05",
    nationality: "Ethiopian",
    maritalStatus: "Married",
    email: "dawit.worku@example.com",
    phone: "+251933456789",
    alternativePhone: "",
    linkedin: "",
    country: "Ethiopia",
    region: "Addis Ababa",
    city: "Addis Ababa",
    subCity: "Yeka",
    woreda: "",
    houseNumber: "",
    postalCode: "",
    idType: "Passport",
    idNumber: "EP1234567",
    idIssueDate: "",
    idExpiryDate: "",
    employeeId: "EMP-003",
    department: "Finance",
    jobTitle: "Senior Accountant",
    employmentType: "Permanent",
    workLocation: "Head Office",
    employmentDate: "2020-06-15",
    probationPeriod: "",
    supervisor: "Finance Director",
    emergencyName: "Marta Dawit",
    emergencyRelationship: "Spouse",
    emergencyPhone: "+251911555666",
    emergencyEmail: "",
    educationLevel: "Master's Degree",
    institution: "Jimma University",
    fieldOfStudy: "Accounting",
    graduationYear: "2017",
    bankName: "Dashen Bank",
    accountHolder: "Dawit Mekonnen Worku",
    accountNumber: "1000345678901",
    branchName: "",
    skills: "Accounting, Auditing, Financial Reporting",
    languages: "Amharic, English",
    notes: "",
  },
  {
    firstName: "Meron",
    middleName: "Tadesse",
    lastName: "Alemu",
    gender: "Female",
    dateOfBirth: "1998-02-14",
    nationality: "Ethiopian",
    maritalStatus: "Single",
    email: "meron.alemu@example.com",
    phone: "+251944567890",
    alternativePhone: "",
    linkedin: "",
    country: "Ethiopia",
    region: "SNNPR",
    city: "Hawassa",
    subCity: "",
    woreda: "",
    houseNumber: "",
    postalCode: "",
    idType: "National ID",
    idNumber: "NID-2024-004",
    idIssueDate: "",
    idExpiryDate: "",
    employeeId: "EMP-004",
    department: "Marketing",
    jobTitle: "Marketing Specialist",
    employmentType: "Contract",
    workLocation: "Hawassa Branch",
    employmentDate: "2024-02-01",
    probationPeriod: "",
    supervisor: "",
    emergencyName: "Tadesse Alemu",
    emergencyRelationship: "Father",
    emergencyPhone: "+251911777888",
    emergencyEmail: "",
    educationLevel: "Bachelor's Degree",
    institution: "Hawassa University",
    fieldOfStudy: "Marketing",
    graduationYear: "2021",
    bankName: "Bank of Abyssinia",
    accountHolder: "Meron Tadesse Alemu",
    accountNumber: "1000456789012",
    branchName: "",
    skills: "Digital Marketing, SEO, Content Creation",
    languages: "Amharic, English",
    notes: "",
  },
  {
    firstName: "Samuel",
    middleName: "Girma",
    lastName: "Bekele",
    gender: "Male",
    dateOfBirth: "1993-07-19",
    nationality: "Ethiopian",
    maritalStatus: "Single",
    email: "samuel.bekele@example.com",
    phone: "+251955678901",
    alternativePhone: "",
    linkedin: "",
    country: "Ethiopia",
    region: "Amhara",
    city: "Bahir Dar",
    subCity: "",
    woreda: "",
    houseNumber: "",
    postalCode: "",
    idType: "Passport",
    idNumber: "EP7654321",
    idIssueDate: "",
    idExpiryDate: "",
    employeeId: "EMP-005",
    department: "Operations",
    jobTitle: "Operations Officer",
    employmentType: "Permanent",
    workLocation: "Bahir Dar Branch",
    employmentDate: "2021-09-01",
    probationPeriod: "",
    supervisor: "",
    emergencyName: "Girma Bekele",
    emergencyRelationship: "Brother",
    emergencyPhone: "+251911888999",
    emergencyEmail: "",
    educationLevel: "Diploma",
    institution: "Bahir Dar University",
    fieldOfStudy: "Business Administration",
    graduationYear: "2017",
    bankName: "Commercial Bank of Ethiopia",
    accountHolder: "Samuel Girma Bekele",
    accountNumber: "1000567890123",
    branchName: "",
    skills: "Operations, Administration, Planning",
    languages: "Amharic, English",
    notes: "",
  },
]

const globalForDb = globalThis as unknown as {
  sqliteDb: DatabaseSync | undefined
}

function initDb(db: DatabaseSync) {
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA busy_timeout = 5000;

    CREATE TABLE IF NOT EXISTS employees (
      id TEXT PRIMARY KEY,
      firstName TEXT NOT NULL,
      middleName TEXT DEFAULT '',
      lastName TEXT NOT NULL,
      gender TEXT DEFAULT '',
      dateOfBirth TEXT DEFAULT '',
      nationality TEXT DEFAULT '',
      maritalStatus TEXT DEFAULT '',
      email TEXT NOT NULL,
      phone TEXT DEFAULT '',
      alternativePhone TEXT DEFAULT '',
      linkedin TEXT DEFAULT '',
      country TEXT DEFAULT '',
      region TEXT DEFAULT '',
      city TEXT DEFAULT '',
      subCity TEXT DEFAULT '',
      woreda TEXT DEFAULT '',
      houseNumber TEXT DEFAULT '',
      postalCode TEXT DEFAULT '',
      idType TEXT DEFAULT '',
      idNumber TEXT DEFAULT '',
      idIssueDate TEXT DEFAULT '',
      idExpiryDate TEXT DEFAULT '',
      employeeId TEXT NOT NULL UNIQUE,
      department TEXT DEFAULT '',
      jobTitle TEXT DEFAULT '',
      employmentType TEXT DEFAULT '',
      workLocation TEXT DEFAULT '',
      employmentDate TEXT DEFAULT '',
      probationPeriod TEXT DEFAULT '',
      supervisor TEXT DEFAULT '',
      emergencyName TEXT DEFAULT '',
      emergencyRelationship TEXT DEFAULT '',
      emergencyPhone TEXT DEFAULT '',
      emergencyEmail TEXT DEFAULT '',
      educationLevel TEXT DEFAULT '',
      institution TEXT DEFAULT '',
      fieldOfStudy TEXT DEFAULT '',
      graduationYear TEXT DEFAULT '',
      bankName TEXT DEFAULT '',
      accountHolder TEXT DEFAULT '',
      accountNumber TEXT DEFAULT '',
      branchName TEXT DEFAULT '',
      skills TEXT DEFAULT '',
      languages TEXT DEFAULT '',
      notes TEXT DEFAULT '',
      createdAt TEXT DEFAULT (datetime('now')),
      updatedAt TEXT DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_employees_employee_id ON employees (employeeId);
    CREATE INDEX IF NOT EXISTS idx_employees_department ON employees (department);
    CREATE INDEX IF NOT EXISTS idx_employees_email ON employees (email);
  `)

  const countRow = db.prepare("SELECT COUNT(*) as count FROM employees").get() as
    | { count: number | bigint }
    | undefined

  const count = Number(countRow?.count ?? 0)

  if (count === 0 && SEED_EMPLOYEES.length > 0) {
    const placeholders = ALL_COLUMNS.map(() => "?").join(", ")
    const insertStmt = db.prepare(
      `INSERT INTO employees (${ALL_COLUMNS.join(", ")}) VALUES (${placeholders})`
    )

    for (const emp of SEED_EMPLOYEES) {
      const id = crypto.randomUUID()
      const values = ALL_COLUMNS.map((col) =>
        col === "id" ? id : (emp as Record<string, string>)[col] ?? ""
      )
      try {
        insertStmt.run(...values)
      } catch (err) {
        console.error("Failed to seed employee:", emp.employeeId, err)
      }
    }
  }
}

export function getDb(): DatabaseSync {
  if (!globalForDb.sqliteDb) {
    const dbPath = path.join(process.cwd(), "employees.db")
    const db = new DatabaseSync(dbPath)
    initDb(db)
    globalForDb.sqliteDb = db
  }
  return globalForDb.sqliteDb
}

function sanitizeEmployee(row: Record<string, unknown>): Employee {
  const emp: Record<string, string> = {}
  for (const col of ALL_COLUMNS) {
    emp[col] = String(row[col] ?? "")
  }
  if (row.createdAt) {
    emp.createdAt = String(row.createdAt)
  }
  if (row.updatedAt) {
    emp.updatedAt = String(row.updatedAt)
  }
  return emp as unknown as Employee
}

export interface EmployeeQueryFilters {
  search?: string
  department?: string
}

export function getAllEmployees(filters?: EmployeeQueryFilters): Employee[] {
  const db = getDb()

  const conditions: string[] = []
  const params: unknown[] = []

  const department = filters?.department?.trim()
  if (department && department !== "all") {
    conditions.push("department = ?")
    params.push(department)
  }

  const search = filters?.search?.trim()
  if (search) {
    const searchPattern = `%${search}%`
    const searchCols = [
      "employeeId",
      "firstName",
      "middleName",
      "lastName",
      "email",
      "phone",
      "department",
      "jobTitle",
      "employmentType",
      "city",
      "nationality",
    ]
    conditions.push(
      `(${searchCols.map((col) => `${col} LIKE ?`).join(" OR ")})`
    )
    for (let i = 0; i < searchCols.length; i++) {
      params.push(searchPattern)
    }
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : ""
  const query = `SELECT * FROM employees ${whereClause} ORDER BY rowid DESC`

  const rows = db.prepare(query).all(...params) as Record<string, unknown>[]
  return rows.map(sanitizeEmployee)
}

export function getEmployeeById(id: string): Employee | null {
  const db = getDb()
  const row = db.prepare("SELECT * FROM employees WHERE id = ?").get(id) as Record<string, unknown> | undefined
  if (!row) return null
  return sanitizeEmployee(row)
}

export function createEmployee(data: Employee): Employee {
  const db = getDb()
  const placeholders = ALL_COLUMNS.map(() => "?").join(", ")
  const stmt = db.prepare(
    `INSERT INTO employees (${ALL_COLUMNS.join(", ")}) VALUES (${placeholders})`
  )
  const values = ALL_COLUMNS.map((col) => data[col] ?? "")
  stmt.run(...values)
  return getEmployeeById(data.id) ?? data
}

export function updateEmployee(id: string, data: Partial<Employee>): Employee | null {
  const db = getDb()
  const existing = getEmployeeById(id)
  if (!existing) return null

  const allowedCols = ALL_COLUMNS.filter((col) => col !== "id")
  const updateCols = allowedCols.filter(
    (col) => data[col as keyof Employee] !== undefined
  )

  if (updateCols.length === 0) {
    return existing
  }

  const setClauses = updateCols.map((col) => `${col} = ?`).join(", ")
  const values = updateCols.map((col) => String(data[col as keyof Employee] ?? ""))

  const stmt = db.prepare(
    `UPDATE employees SET ${setClauses}, updatedAt = datetime('now') WHERE id = ?`
  )
  stmt.run(...values, id)

  return getEmployeeById(id)
}

export function deleteEmployee(id: string): boolean {
  const db = getDb()
  const stmt = db.prepare("DELETE FROM employees WHERE id = ?")
  const result = stmt.run(id)
  return Number(result.changes) > 0
}
