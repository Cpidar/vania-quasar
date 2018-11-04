import jMoment from 'moment-jalaali'
jMoment.locale('fa')
jMoment.loadPersian({ usePersianDigits: false, dialect: 'persian-modern' })
import { Subject, range } from 'rxjs'
import { map, shareReplay, switchMap, tap, mergeMap, share, filter } from 'rxjs/operators'
import { getBadTimeEvents, checkHasPHN, checkBadTime } from '../events/event'

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

      // case 'getEvent':
      //     return { ...model, PHN: data.PHN, events: data.events, period: data.period };

      // case 'addEvent':
      //     model.events.push(data);
      //     return model;

    default:
      return initialModel
  }
}

const calcuteCycle = (date, start, cycle, period) => {
  const diffDay = date.diff(jMoment(start, 'jYYYY-jMM-jDD'), 'days')
  const cycleMode = diffDay % cycle
  const ovulation = cycle - 14

  if (cycleMode < period) {
    return 'period'
  } else if (cycleMode >= ovulation - 5 && cycleMode <= ovulation + 1) {
    return cycleMode === ovulation ? 'ovulation point' : 'ovulation'
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
  const isPeriod = cycleState === 'period'
  const isOvulPeriod = cycleState === 'ovulation'
  const isOvulPoint = cycleState === 'ovulation point'

  return {
    jDate: jDate.format('jYYYY-jMM-jDD'),
    day,
    isToday,
    currentMonthCond,
    isPeriod,
    isOvulPeriod,
    isOvulPoint
  }
}

// Wiring

export const action$ = new Subject()

export const model$ = action$.pipe(
  switchMap(present),
  tap(() => console.log('new model')),
  share()
)

const dayInMonth = (m) => range(0, 42)
  .pipe(
    // observeOn(asyncScheduler),
    map((k) => k - moment(m.month).clone().weekday()),
    map((day) => dayState(day, m))
  )

export const getDaysInMonth = model$.pipe(
  filter(m => m.status !== 'SELECTED_DAY'),
  tap(() => console.log('new days')),
  switchMap((m) => dayInMonth(m)),
  share()
)

export const getPHNState = getDaysInMonth.pipe(mergeMap((day) => checkHasPHN(`PHN${day.jDate}`)))

export const getBadTimeState = getDaysInMonth.pipe(mergeMap((day) => checkBadTime(day.jDate, 'jYYYY-jMM-jDD')))

export const selectDone = model$.pipe(
  // distinctUntilKeyChanged('selectedDay'),
  tap(() => console.log('new select')),
  map((m) => moment(m.selectedDay).format('jYYYY-jMM-jDD')),
  shareReplay()
)

export const getSelectedDay = model$.pipe(
  // distinctUntilKeyChanged('selectedDay'),
  map((m) => {
    return {
      day: moment(m.selectedDay).format('jDD'),
      month: moment(m.selectedDay).format('jMMMM'),
      year: moment(m.selectedDay).format('jYYYY')
    }
  }),
  tap(() => console.log('get selected date')),
  share()
)

export const getSelectedEvent = model$.pipe(
  map((m) => m.selectedDay),
  switchMap((date) => getBadTimeEvents(date, 'jYYYY-jMM-jDD'))
)

export const dispatch = (type, payload) => {
  model$.subscribe()
  action$.next({ type, payload })
}
