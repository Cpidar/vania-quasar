/* eslint-disable no-unused-vars */
import PouchDB from 'pouchdb'
import upsert from 'pouchdb-upsert'
PouchDB.plugin(upsert)
// import persian from './persian';
// import lunar from './lunar';
// import solar from './solar';
import { j2d } from 'jalaali-js'

import { from } from 'rxjs'
import { filter, map, tap, reduce, pluck } from 'rxjs/operators'

import { jdToHijri } from '../state/helper'
import moonInSco from './bad-time.json'

// const _allsolar: Event[] = persian.concat(solar);
// const _lunar2solar: Event[] = lunar;
// const _allevents: Event[] = _lunar2solar.concat(_allsolar);

//    const _self: momentJalaali.Moment;
//    const _allevents: Event[];
const db = new PouchDB('my-data', { revs_limit: 1, auto_compaction: true })
const allevents = moonInSco

var viewPeriod = {
  '_id': '_design/period',
  'views': {
    'period': {
      'map': function (doc) {
        // collect up all the data we are looking for
        // eslint-disable-next-line no-undef
        emit(doc.start, {period: doc.periodLength, cycle: doc.cycleLength})
      }.toString(),
      'reduce': function (keys, values, rereduce) {
        var period = {
          cSum: 0,
          cMax: Number.MIN_VALUE,
          cMin: Number.MAX_VALUE,
          cCount: 0,
          pSum: 0,
          pMax: Number.MIN_VALUE,
          pMin: Number.MAX_VALUE,
          pCount: 0
        }
        // aggregate up the values
        for (var i = values.length - 1; i >= 0; i--) {
          var v = values[i]
          period.cSum += v
          period.cMax = (period.cMax < v) ? v : period.cMax
          period.cMin = (period.cMin < v) ? period.cMin : v
          period.cCount += v.cCount || 1
          period.pSum += v
          period.pMax = (period.pMax < v) ? v : period.pMax
          period.pMin = (period.pMin < v) ? period.pMin : v
          period.pCount += v.pCount || 1
        }
        period.cAvg = period.cSum / period.cCount
        period.pAvg = period.pSum / period.pCount
        return period
      }.toString()
    }
  }
}

// db.put(viewPeriod)

export const calculateCycle = () => db.allDocs({
  startkey: 'PR',
  endkey: 'PR\ufff0'
}).then(function (result) {
  db.query('period', {reduce: true}, function (err, res) {
    console.error(err)
    return res.rows[0]
  })
}).catch(err => err)

export const currentCycle = (id) => db.allDocs({
  endkey: id,
  limit: 1,
  include_docs: true,
  descending: true,
  inclusive_end: false
}).then(res => res.rows[0])

export const getBadTimeEvents = (date) => {
  const j = date.split('-').map(Number)
  const todayHijri = jdToHijri(j2d(j[0], j[1] + 1, j[2]))
  const todayHijriFormatted = `${('0' + todayHijri[1]).slice(-2)}/${('0' + todayHijri[2]).slice(-2)}`

  return from(allevents).pipe(
    filter((item) => item.date === todayHijriFormatted),
    pluck('type'),
    reduce((acc, cur) => {
      acc.push(cur)
      return { [date]: {event: acc} }
    }, [])
  )
  // return await self.isoWeekday() === 2 ? events.concat([{
  //   title: 'شب چهارشنبه',
  //   date: 'WNE',
  //   type: 'WNE',
  //   discription: '',
  //   id: arg1
  // }]) : events
}

// export const checkBadTime = (date, format) => getBadTimeEvents(date, format).then((e) => e.length > 0)

export const getPHNsFromDB = (start, end) => {
  return from(db.allDocs({
    include_docs: true,
    startkey: start,
    endkey: end
  })
    .then((docs) => docs.rows))
}

export const getPHNFromDB = (id) => {
  return db.get(id).catch(err => {
    if (err.name === 'not_found') {
      return {
        bleedState: '',
        sexState: '',
        symptomState: [],
        moodState: [],
        period: ''
      }
    } else { // hm, some other error
      throw err
    }
  })
}

export const putToDB = (id, doc) => {
  return db.upsert(id, doc).then(res => res.ok)
}

export const putIfNotExists = (id, doc) => {
  return db.putIfNotExists(id, doc)
}

export const bulkPut = () => {
  return false
}

export const edit = () => {
  return false
}

export const checkHasPHN = async (id) => db.get(id).then(() => true).catch(() => false)
