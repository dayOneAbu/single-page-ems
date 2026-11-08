declare module "node:sqlite" {
  export interface RunResult {
    changes: number | bigint
    lastInsertRowid: number | bigint
  }

  export interface StatementSync {
    all(...params: unknown[]): unknown[]
    get(...params: unknown[]): unknown
    run(...params: unknown[]): RunResult
  }

  export class DatabaseSync {
    constructor(
      location: string,
      options?: {
        open?: boolean
        readOnly?: boolean
        enableForeignKeyConstraints?: boolean
      }
    )
    exec(sql: string): void
    prepare(sql: string): StatementSync
    close(): void
  }
}
