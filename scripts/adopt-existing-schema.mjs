import 'dotenv/config'
import fs from 'node:fs'
import pg from 'pg'

// One-time adoption of the POC schema previously created by Payload's dev push.
// Does not run the baseline's CREATE TABLE statements on an existing database.
const client = new pg.Client({ connectionString: process.env.DATABASE_URL })
const baseline = '20260914_121053_baseline'
try {
  await client.connect()
  await client.query('BEGIN')
  await client.query("SET LOCAL lock_timeout = '10s'")
  await client.query('LOCK TABLE pages, _pages_v, payload_migrations IN SHARE ROW EXCLUSIVE MODE')
  const applied = await client.query('SELECT id FROM payload_migrations WHERE name = $1', [baseline])
  if (!applied.rowCount) {
    const snapshot = JSON.parse(fs.readFileSync(`src/migrations/${baseline}.json`, 'utf8'))
    const actual = await client.query("SELECT table_name, column_name, udt_name FROM information_schema.columns WHERE table_schema = 'public'")
    const types = { serial: 'int4', integer: 'int4', varchar: 'varchar', numeric: 'numeric', jsonb: 'jsonb', boolean: 'bool', 'timestamp(3) with time zone': 'timestamptz' }
    for (const table of Object.values(snapshot.tables)) {
      for (const column of Object.values(table.columns)) {
        const found = actual.rows.find(row => row.table_name === table.name && row.column_name === column.name)
        const expected = types[column.type] || column.type
        if (!found || found.udt_name !== expected) throw new Error(`Baseline mismatch: ${table.name}.${column.name} (${column.type})`)
      }
    }
    const backup = {
      createdAt: new Date().toISOString(),
      pages: (await client.query('SELECT * FROM pages')).rows,
      versions: (await client.query('SELECT * FROM _pages_v')).rows,
      migrations: (await client.query('SELECT * FROM payload_migrations')).rows,
    }
    fs.mkdirSync('.local/backups', { recursive: true })
    const filename = `.local/backups/before-editable-landing-${Date.now()}.json`
    fs.writeFileSync(filename, JSON.stringify(backup, null, 2), { flag: 'wx' })
    await client.query("UPDATE payload_migrations SET name = 'legacy_dev_schema', batch = 0 WHERE batch = -1 AND name = 'dev'")
    await client.query('INSERT INTO payload_migrations(name,batch) VALUES($1,0)', [baseline])
    console.log(`Existing baseline verified and recorded. Content backup: ${filename}`)
  } else console.log('Baseline already recorded; no changes.')
  await client.query('COMMIT')
} catch (error) {
  await client.query('ROLLBACK')
  throw error
} finally { await client.end() }
