import 'dotenv/config'
import fs from 'node:fs'
import { randomBytes } from 'node:crypto'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const email = process.argv[2]
if (!email) throw new Error('Uso: node --import tsx scripts/create-designer.ts email')
const payload = await getPayload({ config })
try {
  const existing = (await payload.find({ collection: 'users', where: { email: { equals: email } }, limit: 1 })).docs[0]
  if (existing) {
    await payload.update({ collection: 'users', id: existing.id, data: { role: 'designer' } })
    console.log('Cuenta existente configurada como diseñadora. Se conservó su contraseña.')
  } else {
    const password = randomBytes(24).toString('base64url')
    const created = await payload.create({ collection: 'users', data: { email, password, role: 'designer' } })
    fs.mkdirSync('.local', { recursive: true })
    const credentialsPath = `.local/designer-access-${created.id}.txt`
    fs.writeFileSync(credentialsPath, `Acceso: http://localhost:3000/admin\nEmail: ${email}\nContraseña inicial: ${password}\n`, { flag: 'wx' })
    console.log(`Cuenta de diseñadora creada. Credenciales guardadas en ${credentialsPath} (ignorado por Git).`)
  }
} finally { await payload.destroy() }
process.exit(0)
