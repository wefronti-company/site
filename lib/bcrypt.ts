// Lightweight local wrapper to avoid direct TypeScript resolution of the external
// 'bcryptjs' module inside server code while still performing the runtime
// hashing/compare operations.
// This file uses require() so TypeScript will not attempt to resolve types for
// 'bcryptjs'. If your environment doesn't have bcryptjs installed, add it to
// package.json dependencies and install.

// Synchronous helpers kept for scripts and backward compatibility but
// prefer async versions in server handlers to avoid blocking the event loop.
// Use the exported `hash` and `compare` functions in request handlers.
export function hashSync (s: string, rounds = 12): string {
  // require at runtime to avoid type resolution problems
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const bcrypt = require('bcryptjs')
  return bcrypt.hashSync(s, rounds)
}

export function compareSync (s: string, hash: string): boolean {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const bcrypt = require('bcryptjs')
  return bcrypt.compareSync(s, hash)
}

// Async wrappers (preferred for server request handlers)
export async function hash (s: string, rounds = 12): Promise<string> {
  // require at runtime to avoid type resolution problems
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const bcrypt = require('bcryptjs')
  return new Promise((resolve, reject) => {
    bcrypt.hash(s, rounds, (err: Error | null, result: string) => {
      if (err) return reject(err)
      resolve(result)
    })
  })
}

export async function compare (s: string, hash: string): Promise<boolean> {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const bcrypt = require('bcryptjs')
  return new Promise((resolve, reject) => {
    bcrypt.compare(s, hash, (err: Error | null, result: boolean) => {
      if (err) return reject(err)
      resolve(result)
    })
  })
}
