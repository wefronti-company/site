declare module 'bcryptjs' {
  export function hashSync(s: string, rounds?: number): string
  export function compareSync(s: string, hash: string): boolean
  export function genSaltSync(rounds?: number): string
}

export {}
