/* eslint-disable no-unused-vars */
import jMoment from 'moment-jalaali'
jMoment.locale('fa')
jMoment.loadPersian({ usePersianDigits: false, dialect: 'persian-modern' })

import { Subject, range, asyncScheduler, merge, asapScheduler, from } from 'rxjs'
import { map, shareReplay, switchMap, switchMapTo, tap, mergeMap, share, filter, observeOn, bufferCount, pluck, take, toArray, concatMap, flatMap, startWith, distinctUntilKeyChanged, first, mapTo, combineLatest } from 'rxjs/operators'
import { getBadTimeEvents, checkHasPHN, getPHNFromDB, putToDB, getPHNsFromDB } from '../events/event'
import { dayState } from './cycle'
const moment = (str) => jMoment(str, 'jYYYY-jMM-jDD')

export const initialModel = {
  status: 'INIT',
  month: jMoment().startOf('jMonth').format('jYYYY-jMM-jDD'),
  selectedDay: jMoment().startOf('day').format('jYYYY-jMM-jDD'),
  today: jMoment().startOf('day').format('jYYYY-jMM-jDD'),
  events: [],
  PHN: [],
  currentCycle: { start: '', cycleLength: 0, periodLength: 0 },
  calculatedCycle: { start: '', cycleLength: 0, periodLength: 0 }
}

export const present = async (data) => {
  switch (data.type) {
    case 'init':
      initialModel.status = 'INIT'
      initialModel.currentCycle = data.payload
      return initialModel

    case 'selectDay':
      initialModel.status = 'SELECTED_DAY'
      initialModel.selectedDay = data.payload.selectedDay
      initialModel.events = data.payload.events
      return initialModel

    case 'goToNextMonth':
      const nextMonth = moment(initialModel.month).add(+1, 'jMonth').format('jYYYY-jMM-jDD')
      const s = moment(initialModel.selectedDay).add(+1, 'jMonth').format('jYYYY-jMM-jDD')
      initialModel.status = 'NEXT_MONTH'
      initialModel.month = nextMonth
      initialModel.selectedDay = s
      return initialModel

    case 'goToPrevMonth':
      const prevMonth = moment(initialModel.month).subtract(+1, 'jMonth').format('jYYYY-jMM-jDD')
      const p = moment(initialModel.selectedDay).subtract(+1, 'jMonth').format('jYYYY-jMM-jDD')
      initialModel.status = 'NEXT_MONTH'
      initialModel.month = prevMonth
      initialModel.selectedDay = p
      return initialModel

    case 'goToMonth':
      const month = moment(data.payload).format('jYYYY-jMM-jDD')
      initialModel.status = 'CHANGE_MONTH'
      initialModel.month = month
      initialModel.selectedDay = month
      return initialModel

    case 'gotPeriod':
      initialModel.status = 'PERIOD_STARTS'
      initialModel.currentCycle.start = initialModel.selectedDay
      return initialModel

    case 'endPeriod':
      const newPerLength = moment(data.payload).diff(moment(initialModel.currentCycle.start), 'days')

      initialModel.status = 'PERIOD-ENDS'
      initialModel.currentCycle.periodLength = newPerLength
      return initialModel

    case 'changePeriod':
      initialModel.status = 'PERIOD_CHANGE'
      initialModel.currentCycle.periodLength = data.payload.periodLength
      initialModel.currentCycle.cycleLength = data.payload.cycleLength
      return initialModel

    case 'addEvent':
      initialModel.status = 'EVENT_ADD'
      initialModel.events.push(data.payload)
      return initialModel

    default:
      return initialModel
  }
}

export const computeDaysInMonth = (counter, m) => {
  const jDate = moment(m).clone().add(counter, 'day')
  const day = jDate.jDate()
  // const hDate = add(d, persianTohijri(newMonth))
  //     .map(h => { return { day: h[0], month: h[1], year: h[2] } })[0];
  const isToday = jDate.isSame(new Date(), 'day')
  const currentMonthCond = jDate.jMonth() - moment(m).jMonth()

  return {
    jDate: jDate.format('jYYYY-jMM-jDD'),
    day,
    isToday,
    currentMonthCond
  }
}

// Wiring

export const action$ = new Subject()

export const model$ = action$.pipe(
  tap(console.log),
  switchMap(present),
  tap(console.log),
  shareReplay()
)
// no: number of month after or before of current month
export const getMonthList = (no) => model$.pipe(
  filter(m => (m.status === 'INIT')),
  take(1),
  map(m => {
    const ar = Array.from({ length: 2 * no + 1 }, (v, i) => i - no)
    return ar.map(v => moment(m.month).clone().add(v, 'jMonth').format('jYYYY-jMM-jDD'))
  })
)

export const daysInMonth = (month) => range(-moment(month).clone().weekday(), 42).pipe(
  // observeOn(asyncScheduler),
  map((m) => computeDaysInMonth(m, month)),
  // tap(console.log),
  observeOn(asapScheduler),
  share()
)

export const shortSelectedDay = model$.pipe(
  filter(m => (m.status === 'SELECTED_DAY')),
  // distinctUntilKeyChanged('selectedDay'),
  map((m) => moment(m.selectedDay).format('jYYYY-jMM-jDD')),
  share()
)

export const longSelectedDayObj = model$.pipe(
  // distinctUntilKeyChanged('selectedDay'),
  filter(m => (m.status === 'INIT' || 'SELECTED_DAY')),
  map((m) => {
    return {
      date: m.selectedDay,
      day: moment(m.selectedDay).format('jDD'),
      monthName: moment(m.selectedDay).format('jMMMM'),
      fullYear: moment(m.selectedDay).format('jYYYY'),
      events: m.events
    }
  }),
  share()
)

export const futurePeriodDays = (month) => daysInMonth(month).pipe(
  pluck('jDate'),
  combineLatest(model$.pipe(pluck('currentCycle')), (d, c) => dayState(d, c)),
  filter(x => x)
)
export const badTimeEvents = (month) => daysInMonth(month).pipe(
  mergeMap((day) => getBadTimeEvents(day.jDate))
)
export const getDaysHavePHN = (month) => {
  const endKey = moment(month).clone().add(1, 'jMonth').format('jYYYY-jMM-jDD')
  return from(getPHNsFromDB(month, endKey)).pipe(
    mergeMap(d => from(d)),
    map(doc => ({[doc.id]: doc.doc}))
  )
  // map(phn => [phn.bleedState, phn.sexState, phn.moodState, phn.symptomState].flat().filter(x => x !== ''))
}

export const getDaysHaveEvents = (month) => merge(
  futurePeriodDays(month),
  getDaysHavePHN(month),
  badTimeEvents(month)
)

export const getSelectedPHN = model$.pipe(
  filter(m => (m.status === 'SELECTED_DAY')),
  map((m) => m.selectedDay),
  switchMap((date) => getPHNFromDB(date)),
  share()
)

export const getPHNValuesArray = getSelectedPHN.pipe(
  map(phn => [phn.bleedState, phn.sexState, phn.moodState, phn.symptomState].flat().filter(x => x !== ''))
)

export const calendarReloadHook = model$.pipe(
  filter(m => m.status === 'PERIOD_CHANGE'),
  map(() => parseInt(Math.random() * 100000))
)

// بعد اینو اضاف کن که اگر قبل از آخرین پریودی واقعی چیزی وارد کرد روی پریودی پیش بینی تاثیر نذار
//  برای این کار براساس مقدار diff حالتهای مختلف تعریف کن
export const possibleClosePeriod = model$.pipe(
  filter(m => (m.status === 'SELECTED_DAY')),
  map(m => {
    const diff = moment(m.selectedDay).diff(moment(m.currentCycle.start), 'days')
    console.log(diff)
    if (diff > 8 || diff < -m.currentCycle.periodLength) {
      return ({ canPeriod: true, diff })
    } else {
      return ({ canPeriod: false, diff })
    }
  })
)

export const dispatch = (type, payload) => {
  model$.subscribe()
  action$.next({ type, payload })
}
