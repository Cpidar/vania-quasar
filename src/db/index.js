/* eslint-disable no-unused-vars */
import { LocalDate, ChronoUnit } from 'js-joda'
// import nodejs from 'nodejs-mobile-react-native'
// import fs from 'react-native-fs'
// import schemas from './schemas'
import cycleModule from '../lib/cycle'
import PouchDB from 'pouchdb'
import PouchdbFind from 'pouchdb-find'
import pouchdbUpsert from 'pouchdb-upsert'
// import SQLite from 'react-native-sqlite-2'
// import SQLiteAdapterFactory from 'pouchdb-adapter-react-native-sqlite'

// const SQLiteAdapter = SQLiteAdapterFactory(SQLite)
// PouchDB.plugin(SQLiteAdapter)
PouchDB.plugin(PouchdbFind)
PouchDB.plugin(pouchdbUpsert)

const db = new PouchDB('mydb')

export async function getBleedingDaysSortedByDate() {
  try {
    const doc = await db.find({
      selector: {
        bleeding: { $exists: true }
      },
      sort: [{ date: 'desc' }]
    })
    console.log(doc)
    return doc.docs
  } catch (err) {
    console.log(err)
  }
}
export async function getTemperatureDaysSortedByDate() {
  try {
    const doc = await db.find({
      selector: {
        temperature: { $exists: true }
      },
      sort: [{ date: 'desc' }]
    })
    return doc.docs
  } catch (err) {
    console.log(err)
  }
}
export async function getCycleDaysSortedByDate() {
  try {
    const docs = await db.allDocs({
      include_docs: true,
      startkey: 'cycleday',
      endkey: 'cycleday\uffff'
    })
    return docs.rows.map(doc => doc.doc)
  } catch (err) {
    console.log(err)
  }
}

export async function getCycleStartsSortedByDate() {
  try {
    const doc = await db.find({
      selector: {
        isCycleStart: { $eq: true }
      }
    })
    return doc.docs
  } catch (err) {
    console.log(err)
  }
}

export async function saveSymptom(symptom, date, val) {
  const cycle = await cycleModule()
  const isMensesStart = cycle.isMensesStart
  const getMensesDaysRightAfter = cycle.getMensesDaysRightAfter

  db.upsert(`cycleday-${date}`, function (cycleDay) {
    if (!cycleDay.date) {
      cycleDay.date = date
    }
    if (bleedingValueDeleted(symptom, val)) {
      cycleDay.bleeding = val
      cycleDay.isCycleStart = false
      maybeSetNewCycleStart(cycleDay, val)
    } else if (bleedingValueAddedOrChanged(symptom, val)) {
      cycleDay.bleeding = val
      cycleDay.isCycleStart = isMensesStart(cycleDay)
      maybeClearOldCycleStarts(cycleDay)
    } else {
      cycleDay[symptom] = val
    }
    return cycleDay
  })

  function maybeSetNewCycleStart(dayWithDeletedBleeding) {
    // if a bleeding value is deleted, we need to check if
    // there are any following bleeding days and if the
    // next one of them is now a cycle start
    const mensesDaysAfter = getMensesDaysRightAfter(dayWithDeletedBleeding)
    if (!mensesDaysAfter.length) return
    const nextOne = mensesDaysAfter[mensesDaysAfter.length - 1]
    if (isMensesStart(nextOne)) {
      nextOne.isCycleStart = true
    }
  }

  function maybeClearOldCycleStarts(cycleDay) {
    // if we have a new bleeding day, we need to clear the
    // menses start marker from all following days of this
    // menses that may have been marked as start before
    const mensesDaysAfter = getMensesDaysRightAfter(cycleDay)
    mensesDaysAfter.forEach(day => { day.isCycleStart = false })
  }
}

function bleedingValueDeleted(symptom, val) {
  return symptom === 'bleeding' && !val
}

function bleedingValueAddedOrChanged(symptom, val) {
  return symptom === 'bleeding' && val
}

export async function updateCycleStartsForAllCycleDays() {
  try {
    const days = await getBleedingDaysSortedByDate()
    const cycle = await cycleModule()
    const isMensesStart = cycle.isMensesStart

    return await Promise.all(days.forEach(day => {
      if (isMensesStart(day)) {
        day.isCycleStart = true
      }
      return db.put({
        ...day,
        _id: day._id,
        _rev: day._rev

      })
    })
    )
  } catch (err) {
    console.log(err)
  }
}

export async function getPreviousTemperature(date) {
  const targetDate = LocalDate.parse(date)
  const days = await getTemperatureDaysSortedByDate()
  const winner = days.find(candidate => {
    return LocalDate.parse(candidate.date).isBefore(targetDate)
  })
  if (!winner) return null
  return winner.temperature.value
}

// async function tryToCreateCycleDayFromImport(days) {
//   try {
//     // we cannot know this yet, gets detected afterwards
//     const newDays = days.map(day => {
//       day._id = `cycleday-${day.date}`
//       day.isCycleStart = false
//       return day
//     })
//     let resp = await db.bulkDocs(newDays)
//   } catch (err) {
//     // const msg = `Line ${i + 1}(${day.date}): ${err.message}`
//     throw new Error(msg)
//   }
// }

export async function getAmountOfCycleDays() {
  const cycleDaysSortedByDate = await getCycleDaysSortedByDate()
  const amountOfCycleDays = cycleDaysSortedByDate.length
  if (!amountOfCycleDays) return 0
  const earliest = cycleDaysSortedByDate[amountOfCycleDays - 1]
  const today = LocalDate.now()
  const earliestAsLocalDate = LocalDate.parse(earliest.date)
  return earliestAsLocalDate.until(today, ChronoUnit.DAYS)
}

// export function getSchema() {
//   return db.schema.reduce((acc, curr) => {
//     acc[curr.name] = curr.properties
//     return acc
//   }, {})
// }

export async function tryToImportWithDelete(cycleDays) {
  let i = 0
  try {
    var docs = await getCycleDaysSortedByDate()
    let resp = await Promise.all(docs.rows.forEach((doc, index) => {
      i = index
      db.remove(doc)
    })
    )
    return await db.bulkDocs({
      ...cycleDays,
      // _id: `cycleday-${.date}`,
      isCycleStart: false
    })
  } catch (err) {
    // const msg = `Line ${i + 1}(${docs.date}): ${err.message}`
    // throw new Error(msg)
  }
}

export async function tryToImportWithoutDelete(cycleDays) {
  let i = 0
  try {
    let resp = await Promise.all(cycleDays.forEach((day, i) => {
      // index = i
      db.upsert({
        ...day,
        _id: `cycleday-${day.date}`,
        isCycleStart: false
      })
    })
    )
  } catch (err) {
    // const msg = `Line ${i + 1}(${day.date}): ${err.message}`
    // throw new Error(msg)
  }
}

// export function requestHash(type, pw) {
//   nodejs.channel.post('request-SHA512', JSON.stringify({
//     type: type,
//     message: pw
//   }))
// }

// export async function changeEncryptionAndRestartApp(hash) {
//   let key
//   if (hash) key = hashToInt8Array(hash)
//   const defaultPath = db.path
//   const dir = db.path.split('/')
//   dir.pop()
//   dir.push('copied.realm')
//   const copyPath = dir.join('/')
//   const exists = await fs.exists(copyPath)
//   if (exists) await fs.unlink(copyPath)
//   // for some reason, realm complains if we give it a key with value undefined
//   if (key) {
//     db.writeCopyTo(copyPath, key)
//   } else {
//     db.writeCopyTo(copyPath)
//   }
//   db.close()
//   await fs.unlink(defaultPath)
//   await fs.moveFile(copyPath, defaultPath)
//   restart.Restart()
// }

// export async function isDbEmpty() {
//   const resp = await db.info()
//   return resp.doc_count === 0
// }

// export async function deleteDbAndOpenNew() {
//   const exists = await fs.exists(Realm.defaultPath)
//   if (exists) await fs.unlink(Realm.defaultPath)
//   await openDb()
// }

// export async function clearDb() {
//   await db.destroy()
// }

// function hashToInt8Array(hash) {
//   const key = new Uint8Array(64)
//   for (let i = 0; i < key.length; i++) {
//     const twoDigitHex = hash.slice(i * 2, i * 2 + 2)
//     key[i] = parseInt(twoDigitHex, 16)
//   }
//   return key
// }
