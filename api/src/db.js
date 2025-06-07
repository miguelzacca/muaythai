import fs from 'node:fs'
import path from 'node:path'

const DB_FILE = path.resolve('db.json')

function loadDB() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({}), 'utf-8')
  }
  const raw = fs.readFileSync(DB_FILE, 'utf-8')
  return JSON.parse(raw)
}

function saveDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data), 'utf-8')
}

export const db = {
  set(key, value) {
    const data = loadDB()
    data[key] = value
    saveDB(data)
  },
  get(key) {
    const data = loadDB()
    return data[key]
  },
  delete(key) {
    const data = loadDB()
    delete data[key]
    saveDB(data)
  },
  all() {
    return loadDB()
  },
  clear() {
    saveDB({})
  },
}
