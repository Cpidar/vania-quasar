import jMoment from 'moment-jalaali'
jMoment.locale('fa')
jMoment.loadPersian({ usePersianDigits: false, dialect: 'persian-modern' })

import { putToDB } from '../events/event'

const moment = (str) => jMoment(str, 'jYYYY-jMM-jDD')

const calcuteCycle = (date, start, cycle, period) => {
  const diffDay = date.diff(jMoment(start, 'jYYYY-jMM-jDD'), 'days')
  if (diffDay >= 0) {
    const cycleMode = diffDay % cycle
    const ovulation = cycle - 14
    if (cycleMode < period) {
      if (cycleMode === 0) {
        return 'period-start-pr'
      } else if (cycleMode < period && cycleMode === period - 1) {
        return 'period-end-pr'
      } else {
        return 'period-pr'
      }
    } else if (cycleMode >= ovulation - 5 && cycleMode <= ovulation + 1) {
      return cycleMode === ovulation ? 'ovulation-point' : 'ovulation'
    }
  }
}

export const dayState = (date, cycleInfo) => {
  const jDate = moment(date)
  // console.log(cycleInfo)
  const cycleState = calcuteCycle(jDate, cycleInfo.start, cycleInfo.cycleLength, cycleInfo.periodLength)
  // const periodStart = cycleState === 'period-start'
  // const periodEnd = cycleState === 'period-end'
  // const isPeriod = cycleState === 'period'
  // const isOvulPeriod = cycleState === 'ovulation'
  // const isOvulPoint = cycleState === 'ovulation point'
  if (cycleState) {
    return { [date]: {cycle: cycleState} }
  }
}

export const savePerData = (start, length) => {
  for (let i = 0; i <= length; i++) {
    const id = moment(start).clone().add(i, 'day').format('jYYYY-jMM-jDD')
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
