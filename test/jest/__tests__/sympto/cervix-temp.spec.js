import getSensiplanStatus from 'src/lib/sympto'
import getType from 'jest-get-type'
import { AssertionError } from 'assert'
import {
  cervixShiftAndFhmOnSameDay,
  cycleWithFhmNoCervixShift,
  cycleWithoutFhmNoCervixShift,
  longCycleWithoutAnyShifts,
  longAndComplicatedCycle,
  tempShift3DaysAfterCervixShift,
  cervixShift3DaysAfterTempShift,
  cervixShift4DaysAfterTempShift,
  noOvulationDetected,
  fiveDayCycle,
  fhmOnDay12,
  fhmOnDay15,
  cycleWithEarlyCervix,
  cycleWithCervixOnFirstDay,
  fertileCervixOnlyAfterEndOfTempEval
} from './cervix-temp-fixtures'

describe('sympto', () => {
  describe('combining temperature and cervix tracking', () => {
    describe('with no previous higher temp measurement', () => {
      test('with no temp or cervix shifts detects only peri-ovulatory', () => {
        const status = getSensiplanStatus({
          cycle: longCycleWithoutAnyShifts,
          previousCycle: cycleWithoutFhmNoCervixShift,
          secondarySymptom: 'cervix'
        })
        expect(Object.keys(status.phases)).toHaveLength(1)
        expect(status).toEqual({
          phases: {
            periOvulatory: {
              start: { date: '2018-07-01' },
              cycleDays: longCycleWithoutAnyShifts
            }
          }
        })
      })
      test('with temp but no cervix shift detects only peri-ovulatory', () => {
        const status = getSensiplanStatus({
          cycle: cycleWithFhmNoCervixShift,
          previousCycle: cycleWithoutFhmNoCervixShift,
          secondarySymptom: 'cervix'
        })
        expect(Object.keys(status.phases)).toHaveLength(1)
        expect(status).toEqual({
          phases: {
            periOvulatory: {
              start: { date: '2018-08-01' },
              cycleDays: cycleWithFhmNoCervixShift
            }
          }
        })
      })
      test(
        'with temp and cervix shifts at the same day an no previous cycle detects only peri- and post-ovulatory phases',
        () => {
          const status = getSensiplanStatus({
            cycle: cervixShiftAndFhmOnSameDay,
            secondarySymptom: 'cervix'
          })
          expect(Object.keys(status.phases)).toHaveLength(2)
          expect(status.temperatureShift.evaluationCompleteDay.date).toEqual('2018-08-15')
          expect(status.cervixShift.evaluationCompleteDay.date).toEqual('2018-08-15')
          expect(status.temperatureShift.rule).toEqual(0)
          expect(status.phases.periOvulatory).toEqual({
            start: { date: '2018-08-01' },
            end: { date: '2018-08-15', time: '18:00' },
            cycleDays: cervixShiftAndFhmOnSameDay
              .filter(({date}) => date <= '2018-08-15')
          })
          expect(status.phases.postOvulatory).toEqual({
            start: { date: '2018-08-15', time: '18:00' },
            cycleDays: cervixShiftAndFhmOnSameDay
              .filter(({date}) => date >= '2018-08-15')
          })
        }
      )
    })
    describe('with previous higher temp measurement', () => {
      test(
        'with no shifts in 5-day long cycle detects only peri-ovulatory according to 5-day rule',
        () => {
          const status = getSensiplanStatus({
            cycle: fiveDayCycle,
            previousCycle: cervixShiftAndFhmOnSameDay,
            secondarySymptom: 'cervix'
          })
          expect(Object.keys(status.phases)).toHaveLength(1)
          expect(status.phases.preOvulatory).toEqual({
            cycleDays: fiveDayCycle,
            start: { date: '2018-08-01' },
            end: { date: '2018-08-05' }
          })
        }
      )
      test(
        'with no shifts in long cycle detects pre- and peri-ovulatory phase according to 5-day-rule',
        () => {
          const status = getSensiplanStatus({
            cycle: longCycleWithoutAnyShifts,
            previousCycle: cervixShiftAndFhmOnSameDay,
            secondarySymptom: 'cervix'
          })

          expect(Object.keys(status.phases)).toHaveLength(2)
          expect(status.phases.preOvulatory).toEqual({
            cycleDays: longCycleWithoutAnyShifts
              .filter(({date}) => date <= '2018-07-05'),
            start: { date: '2018-07-01' },
            end: { date: '2018-07-05' }
          })
          expect(status.phases.periOvulatory).toEqual({
            cycleDays: longCycleWithoutAnyShifts
              .filter(({date}) => date >= '2018-07-06'),
            start: { date: '2018-07-06' }
          })
        }
      )
      test(
        'with temperature and cervix evaluation end on same day detects all 3 phases',
        () => {
          const status = getSensiplanStatus({
            cycle: cervixShiftAndFhmOnSameDay,
            previousCycle: cervixShiftAndFhmOnSameDay,
            secondarySymptom: 'cervix'
          })
          expect(Object.keys(status.phases)).toHaveLength(3)
          expect(status.temperatureShift.evaluationCompleteDay.date).toEqual('2018-08-15')
          expect(status.cervixShift.evaluationCompleteDay.date).toEqual('2018-08-15')

          expect(status.phases.preOvulatory).toEqual({
            start: { date: '2018-08-01' },
            end: { date: '2018-08-05' },
            cycleDays: cervixShiftAndFhmOnSameDay
              .filter(({date}) => date <= '2018-08-05')
          })
          expect(status.phases.periOvulatory).toEqual({
            start: { date: '2018-08-06' },
            end: { date: '2018-08-15', time: '18:00' },
            cycleDays: cervixShiftAndFhmOnSameDay
              .filter(({date}) => {
                return date > '2018-08-05' && date <= '2018-08-15'
              })
          })
          expect(status.phases.postOvulatory).toEqual({
            start: { date: '2018-08-15', time: '18:00' },
            cycleDays: cervixShiftAndFhmOnSameDay
              .filter(({date}) => date >= '2018-08-15')
          })
        }
      )
      test(
        'with temperature shift 3 days after cervix shift detects all 3 phases',
        () => {
          const status = getSensiplanStatus({
            cycle: tempShift3DaysAfterCervixShift,
            previousCycle: cervixShiftAndFhmOnSameDay,
            secondarySymptom: 'cervix'
          })
          expect(Object.keys(status.phases)).toHaveLength(3)
          expect(getType(status.cervixShift)).toBe('object')
          expect(getType(status.temperatureShift)).toBe('object')
          expect(status.cervixShift.evaluationCompleteDay.date).toEqual('2018-05-18')
          expect(status.temperatureShift.evaluationCompleteDay.date).toEqual('2018-05-21')

          expect(status.phases.preOvulatory).toEqual({
            start: { date: '2018-05-08' },
            end: { date: '2018-05-12' },
            cycleDays: tempShift3DaysAfterCervixShift
              .filter(({date}) => date <= '2018-05-12')
          })
          expect(status.phases.periOvulatory).toEqual({
            start: { date: '2018-05-13' },
            end: { date: '2018-05-21', time: '18:00' },
            cycleDays: tempShift3DaysAfterCervixShift
              .filter(({date}) => {
                return date >= '2018-05-13' && date <= '2018-05-21'
              })
          })
          expect(status.phases.postOvulatory).toEqual({
            start: { date: '2018-05-21', time: '18:00' },
            cycleDays: tempShift3DaysAfterCervixShift
              .filter(({date}) => date >= '2018-05-21')
          })
        }
      )
      test(
        'with cervix shift 3 days after temperature shift detects all 3 phases',
        () => {
          const status = getSensiplanStatus({
            cycle: cervixShift3DaysAfterTempShift,
            previousCycle: cervixShiftAndFhmOnSameDay,
            secondarySymptom: 'cervix'
          })
          expect(Object.keys(status.phases)).toHaveLength(3)
          expect(status.temperatureShift.rule).toEqual(0)
          expect(status.temperatureShift.evaluationCompleteDay.date).toEqual('2018-04-17')
          expect(status.cervixShift.evaluationCompleteDay.date).toEqual('2018-04-20')

          expect(status.phases.preOvulatory).toEqual({
            cycleDays: cervixShift3DaysAfterTempShift
              .filter(({date}) => date <= '2018-04-09'),
            start: { date: '2018-04-05' },
            end: { date: '2018-04-09' }
          })
          expect(status.phases.periOvulatory).toEqual({
            cycleDays: cervixShift3DaysAfterTempShift
              .filter(({date}) => {
                return date >= '2018-04-10' && date <= '2018-04-20'
              }),
            start: { date: '2018-04-10' },
            end: { date: '2018-04-20', time: '18:00' }
          })
          expect(status.phases.postOvulatory).toEqual({
            cycleDays: cervixShift3DaysAfterTempShift
              .filter(({date}) => date >= '2018-04-20'),
            start: { date: '2018-04-20', time: '18:00' }
          })
        }
      )
      test(
        'with cervix shift 4 days after temperature shift detects no post-ovulatory phase',
        () => {
          const status = getSensiplanStatus({
            cycle: cervixShift4DaysAfterTempShift,
            previousCycle: cervixShiftAndFhmOnSameDay,
            secondarySymptom: 'cervix'
          })
          expect(Object.keys(status.phases)).toHaveLength(2)

          expect(status.phases.preOvulatory).toEqual({
            cycleDays: cervixShift4DaysAfterTempShift
              .filter(({date}) => date <= '2018-04-09'),
            start: { date: '2018-04-05' },
            end: { date: '2018-04-09' }
          })
          expect(status.phases.periOvulatory).toEqual({
            cycleDays: cervixShift4DaysAfterTempShift
              .filter(({date}) => {
                return date >= '2018-04-10'
              }),
            start: { date: '2018-04-10' }
          })
        }
      )
      test(
        'with fertile cervix only occurring after end of temperature evaluation ignores it',
        () => {
          const status = getSensiplanStatus({
            cycle: fertileCervixOnlyAfterEndOfTempEval,
            previousCycle: cervixShiftAndFhmOnSameDay,
            secondarySymptom: 'cervix'
          })

          expect(status.temperatureShift).toBeUndefined()
          expect(status.cervixShift).toBeUndefined()

          expect(Object.keys(status.phases)).toHaveLength(2)
          expect(status.phases.preOvulatory).toEqual({
            start: { date: '2018-06-01' },
            end: { date: '2018-06-05' },
            cycleDays: fertileCervixOnlyAfterEndOfTempEval
              .filter(({date}) => date <= '2018-06-05')
          })
          expect(status.phases.periOvulatory).toEqual({
            start: { date: '2018-06-06' },
            cycleDays: fertileCervixOnlyAfterEndOfTempEval
              .filter(({date}) => {
                return date > '2018-06-05'
              })
          })
        }
      )
      test(
        'with no shifts no ovulation is found detects only pre and peri-ovulatory phase',
        () => {
          const status = getSensiplanStatus({
            cycle: noOvulationDetected,
            previousCycle: cervixShiftAndFhmOnSameDay,
            secondarySymptom: 'cervix'
          })
          expect(Object.keys(status.phases)).toHaveLength(2)
          expect(status.phases.preOvulatory).toEqual({
            cycleDays: noOvulationDetected
              .filter(({date}) => date <= '2018-03-12'),
            start: { date: '2018-03-08' },
            end: { date: '2018-03-12' }
          })
          expect(status.phases.periOvulatory).toEqual({
            cycleDays: noOvulationDetected
              .filter(({date}) => date > '2018-03-12'),
            start: { date: '2018-03-13' }
          })
        }
      )
    })

    describe('applying the minus-8 rule', () => {
      test('shortens the pre-ovu phase if there is a previous < 13 fhm', () => {
        const status = getSensiplanStatus({
          cycle: longAndComplicatedCycle,
          previousCycle: fhmOnDay15,
          earlierCycles: [fhmOnDay12, ...Array(10).fill(fhmOnDay15)],
          secondarySymptom: 'cervix'
        })
        expect(getType(status.temperatureShift)).toBe('object')
        expect(getType(status.cervixShift)).toBe('object')

        expect(Object.keys(status.phases)).toHaveLength(3)
        expect(status.phases.preOvulatory).toEqual({
          start: { date: '2018-06-01' },
          end: { date: '2018-06-04' },
          cycleDays: longAndComplicatedCycle
            .filter(({date}) => date <= '2018-06-04')
        })
        expect(status.phases.periOvulatory).toEqual({
          start: { date: '2018-06-05' },
          end: { date: '2018-06-26', time: '18:00' },
          cycleDays: longAndComplicatedCycle
            .filter(({date}) => {
              return date > '2018-06-04' && date <= '2018-06-26'
            })
        })
        expect(status.phases.postOvulatory).toEqual({
          start: {
            date: '2018-06-26',
            time: '18:00'
          },
          cycleDays: longAndComplicatedCycle
            .filter(({date}) => date >= '2018-06-26')
        })
      })
      test('shortens pre-ovu phase with prev < 13 fhm even with < 12 cycles', () => {
        const status = getSensiplanStatus({
          cycle: longAndComplicatedCycle,
          previousCycle: fhmOnDay12,
          earlierCycles: Array(10).fill(fhmOnDay12),
          secondarySymptom: 'cervix'
        })

        expect(getType(status.temperatureShift)).toBe('object')
        expect(getType(status.cervixShift)).toBe('object')

        expect(Object.keys(status.phases)).toHaveLength(3)
        expect(status.phases.preOvulatory).toEqual({
          start: { date: '2018-06-01' },
          end: { date: '2018-06-04' },
          cycleDays: longAndComplicatedCycle
            .filter(({date}) => date <= '2018-06-04')
        })
        expect(status.phases.periOvulatory).toEqual({
          start: { date: '2018-06-05' },
          end: { date: '2018-06-26', time: '18:00' },
          cycleDays: longAndComplicatedCycle
            .filter(({date}) => {
              return date > '2018-06-04' && date <= '2018-06-26'
            })
        })
        expect(status.phases.postOvulatory).toEqual({
          start: {
            date: '2018-06-26',
            time: '18:00'
          },
          cycleDays: longAndComplicatedCycle
            .filter(({date}) => date >= '2018-06-26')
        })
      })
      test('shortens the pre-ovu phase if early fertile cervix occurs', () => {
        const status = getSensiplanStatus({
          cycle: cycleWithEarlyCervix,
          previousCycle: fhmOnDay12,
          earlierCycles: Array(10).fill(fhmOnDay12),
          secondarySymptom: 'cervix'
        })

        expect(getType(status.temperatureShift)).toBe('object')
        expect(getType(status.cervixShift)).toBe('object')

        expect(Object.keys(status.phases)).toHaveLength(3)
        expect(status.phases.preOvulatory).toEqual({
          start: { date: '2018-06-01' },
          end: { date: '2018-06-01' },
          cycleDays: cycleWithEarlyCervix
            .filter(({date}) => date <= '2018-06-01')
        })
        expect(status.phases.periOvulatory).toEqual({
          start: { date: '2018-06-02' },
          end: { date: '2018-06-20', time: '18:00' },
          cycleDays: cycleWithEarlyCervix
            .filter(({date}) => {
              return date > '2018-06-01' && date <= '2018-06-20'
            })
        })
        expect(status.phases.postOvulatory).toEqual({
          start: { date: '2018-06-20', time: '18:00' },
          cycleDays: cycleWithEarlyCervix
            .filter(({date}) => date >= '2018-06-20')
        })
      })
      test(
        'shortens the pre-ovu phase if cervix occurs even on the first day',
        () => {
          const status = getSensiplanStatus({
            cycle: cycleWithCervixOnFirstDay,
            previousCycle: fhmOnDay12,
            earlierCycles: Array(10).fill(fhmOnDay12),
            secondarySymptom: 'cervix'
          })

          expect(Object.keys(status.phases)).toHaveLength(2)
          expect(getType(status.temperatureShift)).toBe('object')
          expect(getType(status.cervixShift)).toBe('object')

          expect(status.phases.periOvulatory).toEqual({
            start: { date: '2018-06-01' },
            end: { date: '2018-06-20', time: '18:00' },
            cycleDays: cycleWithCervixOnFirstDay
              .filter(({date}) => {
                return date >= '2018-06-01' && date <= '2018-06-20'
              })
          })
          expect(status.phases.postOvulatory).toEqual({
            start: { date: '2018-06-20', time: '18:00' },
            cycleDays: cycleWithCervixOnFirstDay
              .filter(({date}) => date >= '2018-06-20')
          })
        }
      )
      test('lengthens the pre-ovu phase if >= 12 cycles with fhm > 13', () => {
        const status = getSensiplanStatus({
          cycle: longAndComplicatedCycle,
          previousCycle: fhmOnDay15,
          earlierCycles: Array(11).fill(fhmOnDay15),
          secondarySymptom: 'cervix'
        })
        expect(getType(status.temperatureShift)).toBe('object')
        expect(getType(status.cervixShift)).toBe('object')

        expect(Object.keys(status.phases)).toHaveLength(3)
        expect(status.phases.preOvulatory).toEqual({
          start: { date: '2018-06-01' },
          end: { date: '2018-06-07' },
          cycleDays: longAndComplicatedCycle
            .filter(({date}) => date <= '2018-06-07')
        })
        expect(status.phases.periOvulatory).toEqual({
          start: { date: '2018-06-08' },
          end: { date: '2018-06-26', time: '18:00' },
          cycleDays: longAndComplicatedCycle
            .filter(({date}) => {
              return date >= '2018-06-08' && date <= '2018-06-26'
            })
        })
        expect(status.phases.postOvulatory).toEqual({
          start: { date: '2018-06-26', time: '18:00' },
          cycleDays: longAndComplicatedCycle
            .filter(({date}) => date >= '2018-06-26')
        })
      })
      test('does not lengthen the pre-ovu phase if < 12 cycles', () => {
        const status = getSensiplanStatus({
          cycle: longAndComplicatedCycle,
          previousCycle: fhmOnDay15,
          earlierCycles: Array(10).fill(fhmOnDay15),
          secondarySymptom: 'cervix'
        })
        expect(Object.keys(status.phases)).toHaveLength(3)
        expect(status.phases.preOvulatory).toEqual({
          start: { date: '2018-06-01' },
          end: { date: '2018-06-05' },
          cycleDays: longAndComplicatedCycle
            .filter(({date}) => date <= '2018-06-05')
        })
        expect(status.phases.periOvulatory).toEqual({
          start: { date: '2018-06-06' },
          end: { date: '2018-06-26', time: '18:00' },
          cycleDays: longAndComplicatedCycle
            .filter(({date}) => {
              return date > '2018-06-05' && date <= '2018-06-26'
            })
        })
        expect(status.phases.postOvulatory).toEqual({
          start: {
            date: '2018-06-26',
            time: '18:00'
          },
          cycleDays: longAndComplicatedCycle
            .filter(({date}) => date >= '2018-06-26')
        })
      })
      test('does not detect any pre-ovu phase if prev cycle had no fhm', () => {
        const status = getSensiplanStatus({
          cycle: longAndComplicatedCycle,
          previousCycle: cycleWithoutFhmNoCervixShift,
          earlierCycles: [...Array(12).fill(fhmOnDay15)],
          secondarySymptom: 'cervix'
        })

        expect(Object.keys(status.phases)).toHaveLength(2)
        expect(status.phases.periOvulatory).toEqual({
          start: { date: '2018-06-01' },
          end: { date: '2018-06-26', time: '18:00' },
          cycleDays: longAndComplicatedCycle
            .filter(({date}) => {
              return date >= '2018-06-01' && date <= '2018-06-26'
            })
        })
        expect(status.phases.postOvulatory).toEqual({
          start: {
            date: '2018-06-26',
            time: '18:00'
          },
          cycleDays: longAndComplicatedCycle
            .filter(({date}) => date >= '2018-06-26')
        })
      })
    })
    describe('when args are wrong', () => {
      test('throws when arg object is not in right format', () => {
        const wrongObject = { ada: 'lovelace' }
        expect(() => getSensiplanStatus(wrongObject)).toThrow(AssertionError)
      })
      test('throws if cycle array is empty', () => {
        expect(() => getSensiplanStatus({cycle: []})).toThrow(AssertionError)
      })
      test('throws if cycle days are not in right format', () => {
        expect(() => getSensiplanStatus({
          cycle: [{
            Ilike: 'you'
          }]
        })).toThrow(AssertionError)
        expect(() => getSensiplanStatus({
          cycle: [{
            date: '01.09.2018',
            bleeding: { value: 0 },
            cervix: {opening: 0, firmness: 0}
          }]
        })).toThrow(AssertionError)
        expect(() => getSensiplanStatus({
          cycle: [{
            date: '2018-01-01',
            bleeding: { value: 'medium' },
            temperature: { value: 36.6 }
          }]
        })).toThrow(AssertionError)
        expect(() => getSensiplanStatus({
          cycle: [{
            date: '2018-09-01',
            bleeding: { value: 0 },
            temperature: { value: '36.6' }
          }]
        })).toThrow(AssertionError)
        expect(() => getSensiplanStatus({
          cycle: [{
            date: '2018-09-01',
            bleeding: { value: 0 },
            temperature: { value: 36.6 },
            cervix: {opening: 4, firmness: 18}
          }]
        })).toThrow(AssertionError)
        expect(() => getSensiplanStatus({
          cycle: [{
            date: '2018-09-01',
            bleeding: { value: 0 },
            temperature: 37.9
          }]
        })).toThrow(AssertionError)
      })
      test('throws if first cycle day does not have valid bleeding value', () => {
        expect(() => getSensiplanStatus({
          cycle: [{
            date: '2018-09-01',
            bleeding: { value: 0 }
          }],
          earlierCycles: [[{
            date: '2017-09-23',
            bleeding: { value: '1' }
          }]]
        })).toThrow(AssertionError)
      })
    })
  })
})
