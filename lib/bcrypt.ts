// Lightweight local wrapper to avoid direct TypeScript resolution of the external
// 'bcryptjs' module inside server code while still performing the runtime
// hashing/compare operations.
// This file uses require() so TypeScript will not attempt to resolve types for
// 'bcryptjs'. If your environment doesn't have bcryptjs installed, add it to
// package.json dependencies and install.

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
