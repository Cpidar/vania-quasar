import * as R from 'ramda'
import jMoment from 'moment-jalaali'
jMoment.locale('fa')
jMoment.loadPersian({ usePersianDigits: false, dialect: 'persian-modern' })

const moment = (str) => jMoment(str, 'jYYYY-jMM-jDD')
export const toPersianDigit = (a) => {
  if (typeof a === 'number') {
    a = a.toString()
  }
  // tslint:disable-next-line:only-arrow-functions
  return a.replace(/\d+/g, function (digit) {
    const enDigitArr = []

    const peDigitArr = []

    for (let i = 0; i < digit.length; i++) {
      enDigitArr.push(digit.charCodeAt(i))
    }

    // tslint:disable-next-line:prefer-for-of
    for (let j = 0; j < enDigitArr.length; j++) {
      peDigitArr.push(
        String.fromCharCode(enDigitArr[j] + (!!a && a === true ? 1584 : 1728))
      )
    }
    return peDigitArr.join('')
  })
}

const jdStart = 2453766
const startYear = 1427

const hijriMonth = [
  [1427, 30, 29, 29, 30, 29, 30, 30, 30, 30, 29, 29, 30],
  [1428, 29, 30, 29, 29, 29, 30, 30, 29, 30, 30, 30, 29],
  [1429, 30, 29, 30, 29, 29, 29, 30, 30, 29, 30, 30, 29],
  [1430, 30, 30, 29, 29, 30, 29, 30, 29, 29, 30, 30, 29],
  [1431, 30, 30, 29, 30, 29, 30, 29, 30, 29, 29, 30, 29],
  [1432, 30, 30, 29, 30, 30, 30, 29, 29, 30, 29, 30, 29],
  [1433, 29, 30, 29, 30, 30, 30, 29, 30, 29, 30, 29, 30],
  [1434, 29, 29, 30, 29, 30, 30, 29, 30, 30, 29, 30, 29],
  [1435, 29, 30, 29, 30, 29, 30, 29, 30, 30, 30, 29, 30],
  [1436, 29, 30, 29, 29, 30, 29, 30, 29, 30, 29, 30, 30],
  [1437, 29, 30, 30, 29, 30, 29, 29, 30, 29, 29, 30, 30],
  [1438, 29, 30, 30, 30, 29, 30, 29, 29, 30, 29, 29, 30],
  [1439, 29, 30, 30, 30, 30, 29, 30, 29, 29, 30, 29, 29],
  [1440, 30, 29, 30, 30, 30, 29, 29]
]

const g2d = (gy, gm, gd) => (div((gy + div(gm - 8, 6) + 100100) * 1461, 4) +
    div(153 * mod(gm + 9, 12) + 2, 5) +
    gd - 34840408 -
    div(div(gy + 100100 + div(gm - 8, 6), 100) * 3, 4) +
    752)

// tslint:disable-next-line:no-bitwise
const div = (a, b) => ~~(a / b)
// tslint:disable-next-line:no-bitwise
const mod = (a, b) => a - ~~(a / b) * b

const getJdHijri = (months, start) => {
  const [h, ...t] = months
  const jdHead = R.scan(R.add, start, R.tail(h))

  return t.length === 0 ? [jdHead] : R.prepend(jdHead, getJdHijri(t, R.last(jdHead)))
}
const jdHijriMonth = R.memoize(getJdHijri)(hijriMonth, jdStart)

const jdToHijri = (jd) => {
  const jdHijriTable = jdHijriMonth
  const start = startYear
  const yearIndex = jdHijriTable.map((x) => x[0]).filter((x) => x < jd).length - 1
  const year = start + yearIndex
  const month = R.findIndex((x) => x >= jd, jdHijriTable[yearIndex])
  const day = jd - jdHijriTable[yearIndex][month - 1]
  return [year, month, day]
}

export const add = (day, start) => jdToHijri(g2d(start[0], start[1], start[2]) + day)

// tslint:disable-next-line:max-line-length
export const persianTohijri = (date) => R.compose(jdToHijri, g2d)(date.year(), date.month() + 1, date.date())

// const persionToJd = (y, m, d) => {
//     const PERSIAN_EPOCH = 1948321;

//     let epBase = y >= 0 ? y - 474 : y - 473;
//     let epYear = 474 + (epBase % 2820);

//     let mDays = m <= 7 ? (m - 1) * 31 : (m - 1) * 30 + 6;

//     return d + mDays + ((epYear * 682) - 110) / 2816 + (epYear - 1) * 365
//     + (epBase / 2820) * 1029983 + (PERSIAN_EPOCH - 1);
// }

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

export const dayInMonth = (month) => {
  return Array.from({length: 42}, (v, i) => i - moment(month).clone().weekday())
    .map(d => computeDaysInMonth(d, month))
}
