/* eslint-disable no-unused-vars */
import jMoment from 'moment-jalaali'
jMoment.locale('fa')
jMoment.loadPersian({ usePersianDigits: false, dialect: 'persian-modern' })
import { Subject, range, asyncScheduler } from 'rxjs'
import { map, shareReplay, switchMap, tap, mergeMap, share, filter, observeOn, bufferCount, pluck, take, toArray } from 'rxjs/operators'
import { getBadTimeEvents, checkHasPHN, checkBadTime, getPHNFromDB, putToDB } from '../events/event'

const moment = (str) => jMoment(str, 'jYYYY-jMM-jDD')

export const initialModel = {
  status: 'init',
  month: jMoment().startOf('jMonth').format('jYYYY-jMM-jDD'),
  selectedDay: jMoment().startOf('day').format('jYYYY-jMM-jDD'),
  events: [],
  PHN: [],
  period: { start: '', cycleLength: 0, periodLength: 0 }
}

// const actions = (type: string, data?: any) => {
//     if (type === 'init') {
//         return ({
//             events: JSON.parse(data.events),
//             rEvents: JSON.parse(data.rEvents),
//             period: JSON.parse(data.period)
//         });
//     }
//     if (type === 'selectDay') { return ({ selectDay: data }); }
//     if (type === 'goToNextMonth') { return data; }
//     if (type === 'goToPrevMonth') { return data; }
//     if (type === 'getEvent') { return events.getFromDB(data.start, data.end); }
//     if (type === 'addEvent') { return events.putToDB(data); }
//     if (type === 'resetPeriod') { return data; }
// };

export const present = async (data) => {
  switch (data.type) {
    case 'init':
      initialModel.period = data.payload
      return initialModel

    case 'selectDay':
      initialModel.status = 'SELECTED_DAY'
      initialModel.selectedDay = data.payload
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

    case 'gotPeriod':
      initialModel.status = 'PERIOD_CHANGE'
      initialModel.period.start = initialModel.selectedDay
      return initialModel

    case 'changePeriod':
      initialModel.status = 'PERIOD_CHANGE'
      initialModel.period = data.payload
      return initialModel

    default:
      return initialModel
  }
}

const calcuteCycle = (date, start, cycle, period) => {
  const diffDay = date.diff(jMoment(start, 'jYYYY-jMM-jDD'), 'days')
  if (diffDay >= 0) {
    const cycleMode = diffDay % cycle
    const ovulation = cycle - 14

    if (cycleMode < period) {
      if (cycleMode === 0) {
        return 'period-start'
      } else if (cycleMode < period && cycleMode === period - 1) {
        return 'period-end'
      } else {
        return 'period'
      }
    } else if (cycleMode >= ovulation - 5 && cycleMode <= ovulation + 1) {
      return cycleMode === ovulation ? 'ovulation point' : 'ovulation'
    }
  }
}

export const savePerData = (start, length) => {
  for (let i = 0; i <= length; i++) {
    const id = 'PR-' + moment(start).clone().add(i, 'day').format('jYYYY-jMM-jDD')
    if (i === 0) {
      putToDB(id, (doc) => {
        doc.period = 'period-start'
        return doc
      })
    } else if (i === length) {
      putToDB(id, (doc) => {
        doc.period = 'period-end'
        return doc
      })
    } else {
      putToDB(id, (doc) => {
        doc.period = 'period'
        return doc
      })
    }
  }
}

export const dayState = (counter, m) => {
  const cycleInfo = m.period
  const jDate = moment(m.month).clone().add(counter, 'day')
  const day = jDate.jDate()
  // const hDate = add(d, persianTohijri(newMonth))
  //     .map(h => { return { day: h[0], month: h[1], year: h[2] } })[0];
  const isToday = jDate.isSame(new Date(), 'day')
  const currentMonthCond = jDate.jMonth() - moment(m.month).jMonth()

  const cycleState = calcuteCycle(jDate, cycleInfo.start, cycleInfo.cycleLength, cycleInfo.periodLength)
  const periodStart = cycleState === 'period-start'
  const periodEnd = cycleState === 'period-end'
  const isPeriod = cycleState === 'period'
  const isOvulPeriod = cycleState === 'ovulation'
  const isOvulPoint = cycleState === 'ovulation point'

  return {
    jDate: jDate.format('jYYYY-jMM-jDD'),
    day,
    isToday,
    currentMonthCond,
    isPeriod,
    periodStart,
    periodEnd,
    isOvulPeriod,
    isOvulPoint
  }
}

// Wiring

export const action$ = new Subject()

export const model$ = action$.pipe(
  switchMap(present),
  shareReplay()
)

const dayInMonth = (m) => range(0, 42)
  .pipe(
    map((k) => k - moment(m.month).clone().weekday()),
    map((day) => dayState(day, m))
  )

// const dayInMonth = (m) => {
//   Array.from({length: 42}, (v, i) => i - moment(m.month).clone().weekday())
//     .map(d => dayState(d, m))
// }

export const getDaysInMonth = model$.pipe(
  filter(m => m.status !== 'SELECTED_DAY'),
  // observeOn(asyncScheduler),
  switchMap((m) => dayInMonth(m)),
  share()
)

export const getMonthList = model$.pipe(
  take(1),
  map(m => {
    const ar = Array.from({length: 41}, (v, i) => i - 20)
    console.log(ar)
    return ar.map(v => moment(m.month).clone().add(v, 'jMonth').format('jYYYY-jMM-jDD'))
  })
)

export const getPeriodDays = getDaysInMonth.pipe(
  filter(day => day.periodStart || day.periodEnd)
)

export const getMonth = getDaysInMonth.pipe(
  bufferCount(7),
  bufferCount(6),
  shareReplay()
)

export const getPHNState = getDaysInMonth.pipe(mergeMap((day) => checkHasPHN(`PHN${day.jDate}`)))

export const getBadTimeState = getDaysInMonth.pipe(mergeMap((day) => checkBadTime(day.jDate, 'jYYYY-jMM-jDD')))

export const getSelectedDay = model$.pipe(
  // distinctUntilKeyChanged('selectedDay'),
  map((m) => moment(m.selectedDay).format('jYYYY-jMM-jDD')),
  shareReplay()
)

export const getSelectedDayObj = model$.pipe(
  // distinctUntilKeyChanged('selectedDay'),
  map((m) => {
    return {
      day: moment(m.selectedDay).format('jDD'),
      month: moment(m.selectedDay).format('jMMMM'),
      year: moment(m.selectedDay).format('jYYYY')
    }
  }),
  share()
)

export const getSelectedEvent = model$.pipe(
  map((m) => m.selectedDay),
  switchMap((date) => getBadTimeEvents(date, 'jYYYY-jMM-jDD'))
)

export const getSelectedPHN = model$.pipe(
  map((m) => m.selectedDay),
  switchMap((date) => getPHNFromDB('PHN-' + date)),
  share()
)

export const getPHNValues = getSelectedPHN.pipe(
  map(phn => [phn.bleedState, phn.sexState, phn.moodState, phn.symptomState].flat().filter(x => x !== ''))
)

export const dispatch = (type, payload) => {
  model$.subscribe()
  action$.next({ type, payload })
}
