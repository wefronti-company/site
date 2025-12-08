#!/usr/bin/env node
// Seed the console token into the DB using CONSOLE_AUTH_TOKEN env var.
require('dotenv').config()

const DB = process.env.DATABASE_URL
// token can be provided either by env CONSOLE_AUTH_TOKEN or via CLI arg (first non-flag arg)
const argv = process.argv.slice(2)

function parseFlags (args) {
  const flags = {}
  let i = 0
  while (i < args.length) {
    const a = args[i]
    if (a.startsWith('--')) {
      const k = a.slice(2)
      const v = args[i + 1]
      if (!v || v.startsWith('--')) {
        flags[k] = true
        i += 1
      } else {
        flags[k] = v
        i += 2
      }
    } else {
      // positional arg: treat as token if not provided by env
      if (!flags._) flags._ = []
      flags._.push(a)
      i += 1
    }
  }
  return flags
}

const flags = parseFlags(argv)
const token = (process.env.CONSOLE_AUTH_TOKEN || (flags._ && flags._[0]) || '').toString().trim()
const description = process.env.CONSOLE_AUTH_DESCRIPTION || flags.description || 'seeded from .env or deploy script'
const activeFlag = (process.env.CONSOLE_AUTH_ACTIVE ?? flags.active ?? 'true').toString().toLowerCase()
const active = activeFlag === 'true' || activeFlag === '1' || activeFlag === 'yes'

if (!token) {
  console.error('CONSOLE_AUTH_TOKEN is not set in the environment nor provided as an argument. Please set it and retry.')
  console.error('Usage examples:')
  console.error('  CONSOLE_AUTH_TOKEN=abc123... npm run seed-console-token')
  console.error('  npm run seed-console-token -- abc123...')
  process.exit(1)
}

if (!DB) {
  console.error('DATABASE_URL not set. Seeding requires a database connection.')
  process.exit(1)
}

const { neon } = require('@neondatabase/serverless')
const bcrypt = require('bcryptjs')

async function run () {
  const sql = neon(DB)
  try {
    // validate token format (12 alphanumeric characters) to avoid accidental bad values
    const ok = /^[A-Za-z0-9]{12}$/.test(token)
    if (!ok) {
      console.error('Refusing to seed: CONSOLE_AUTH_TOKEN must be exactly 12 alphanumeric characters')
      process.exit(2)
    }

    // hash token with bcrypt (12 rounds) before storing
    const saltRounds = parseInt(process.env.CONSOLE_AUTH_BCRYPT_ROUNDS || '12', 10)
    const hash = bcrypt.hashSync(token, saltRounds)

    // Ensure the console_tokens table exists (safe to run multiple times)
      // NOTE: migrations should create tables in production. Do NOT create DDL here in production.
      // The migration file `migrations/0001_create_console_tables.sql` contains required DDL.
      // Insert or update the token hash (upsert by token_hash)

    // Note: migrations should create console_sessions; seed will not create DDL in production

    // First, check if token already exists by comparing against stored hashes
    const existing = await sql`SELECT id, token_hash, active, created_at FROM console_tokens`
    let foundId = null
    for (const r of existing) {
      if (!r?.token_hash) continue
      try {
        if (bcrypt.compareSync(token, r.token_hash)) {
          foundId = r.id
          break
        }
      } catch (err) {
        // ignore compare errors and continue
      }
    }

    if (foundId) {
      // update existing matching row
      const rows = await sql`UPDATE console_tokens SET description = ${description}, active = ${active} WHERE id = ${foundId} RETURNING id, token_hash, active, created_at`
      console.log('✅ Updated existing console token entry (matched by hash).')
      console.log({ id: rows[0].id, active: rows[0].active, created_at: rows[0].created_at })
    } else {
      // insert new hash row
      const rows = await sql`INSERT INTO console_tokens (token_hash, description, active) VALUES (${hash}, ${description}, ${active}) RETURNING id, token_hash, active, created_at`
      if (rows && rows.length > 0) {
        console.log('✅ Inserted new console token (stored hashed).')
        console.log({ id: rows[0].id, active: rows[0].active, created_at: rows[0].created_at })
      } else {
        console.log('No rows returned from insert operation (unexpected)')
      }
    }
    process.exit(0)
  } catch (err) {
    console.error('Failed to seed console token:', err?.message || err)
    process.exit(1)
  }
}

run()
