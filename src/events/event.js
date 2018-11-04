import PouchDB from 'pouchdb'

// import persian from './persian';
// import lunar from './lunar';
// import solar from './solar';
import momentJalaali from 'moment-jalaali'
momentJalaali.locale('fa')
momentJalaali.loadPersian()
import { from } from 'rxjs'

import { persianTohijri } from '../state/helper'
import moonInSco from './bad-time.json'

// const _allsolar: Event[] = persian.concat(solar);
// const _lunar2solar: Event[] = lunar;
// const _allevents: Event[] = _lunar2solar.concat(_allsolar);

//    const _self: momentJalaali.Moment;
//    const _allevents: Event[];
const db = new PouchDB('my-data')
const allevents = moonInSco

// tslint:disable-next-line:no-shadowed-variable
//    constructor(_allevents: Event[] = [{id: '165', title: 'Test Event', type: 'solar', holiday: false}]) {
//        this._allevents = _allevents;
//    }

export const getBadTimeEvents = async (arg1, arg2, arg3, arg4) => {
  const self = momentJalaali(arg1, arg2, arg3, arg4)
  const todayHijri = persianTohijri(self)
  const todayHijriFormatted = `${('0' + todayHijri[1]).slice(-2)}/${('0' + todayHijri[2]).slice(-2)}`

  const events = await allevents.filter((item) => {
    return (item.date === todayHijriFormatted)
  })
  return await self.isoWeekday() === 2 ? events.concat([{
    title: 'شب چهارشنبه',
    date: 'WNE',
    type: 'WNE',
    discription: '',
    id: ''
  }]) : events
}

export const checkBadTime = (date, format) => getBadTimeEvents(date, format).then((e) => e.length > 0)

export const getPHNFromDB = (start, end) => {
  return from(db.allDocs({
    include_docs: true,
    startkey: start,
    endkey: end
  }).then((docs) => docs.rows))
}

export const putToDB = (doc) => {
  return from(db.put(doc, { force: true }).then((res) => res.ok))
}

export const bulkPut = () => {
  return false
}

export const edit = () => {
  return false
}

export const checkHasPHN = async (id) => db.get(id).then(() => true).catch(() => false)
