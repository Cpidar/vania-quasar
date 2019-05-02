import getTemperatureStatus from 'src/lib/sympto/temperature'

function turnIntoCycleDayObject(value, fakeDate) {
  return {
    temperature: { value },
    date: fakeDate
  }
}

describe('sympto', () => {
  describe('detect temperature shift', () => {
    describe('regular rule', () => {
      test('reports lower temperature status before shift', () => {
        const lowerTemps = [36.7, 36.57, 36.47, 36.49, 36.57]
          .map(turnIntoCycleDayObject)
        const status = getTemperatureStatus(lowerTemps)
        expect(status).toEqual({ detected: false })
      })

      test('detects temperature shift correctly', () => {
        const tempShift =
        [36.7, 36.57, 36.47, 36.49, 36.57, 36.62, 36.55, 36.8, 36.86, 36.8]
          .map(turnIntoCycleDayObject)
        const status = getTemperatureStatus(tempShift)
        expect(status).toEqual({
          detected: true,
          ltl: 36.6,
          firstHighMeasurementDay: {
            date: 7,
            temperature: { value: 36.8 }
          },
          evaluationCompleteDay: {
            date: 9,
            temperature: { value: 36.8 }
          },
          rule: 0
        })
      })

      test(
        'detects temperature shift correctly with drop after third high temp',
        () => {
          const tempShift =
          [36.7, 36.57, 36.47, 36.49, 36.57, 36.62, 36.55, 36.8, 36.86, 36.8, 36.4]
            .map(turnIntoCycleDayObject)
          const status = getTemperatureStatus(tempShift)
          expect(status).toEqual({
            detected: true,
            ltl: 36.6,
            firstHighMeasurementDay: {
              date: 7,
              temperature: { value: 36.8 }
            },
            evaluationCompleteDay: {
              date: 9,
              temperature: { value: 36.8 }
            },
            rule: 0
          })
        }
      )

      test('detects no temperature shift when there are no 6 low temps', () => {
        const tempShift = [36.47, 36.49, 36.57, 36.62, 36.55, 36.8, 36.86, 36.8]
          .map(turnIntoCycleDayObject)
        const status = getTemperatureStatus(tempShift)
        expect(status).toEqual({ detected: false })
      })

      test('detects no temperature shift if the shift is not high enough', () => {
        const tempShift =
        [36.57, 36.7, 36.47, 36.49, 36.57, 36.62, 36.55, 36.8, 36.86, 36.8]
          .map(turnIntoCycleDayObject)
        const status = getTemperatureStatus(tempShift)
        expect(status).toEqual({ detected: false })
      })

      test('detects missing temperature shift correctly', () => {
        const noTempShift =
        [36.7, 36.57, 36.47, 36.49, 36.57, 36.62, 36.55, 36.8, 36.86, 36.77]
          .map(turnIntoCycleDayObject)
        const status = getTemperatureStatus(noTempShift)
        expect(status).toEqual({ detected: false })
      })

      test('detects shift after an earlier one was invalid', () => {
        const temps =
        [36.4, 36.4, 36.4, 36.4, 36.4, 36.4, 36.6, 36.6, 36.4, 36.4,
          36.7, 36.8, 36.9]
          .map(turnIntoCycleDayObject)

        const status = getTemperatureStatus(temps)
        expect(status).toEqual({
          ltl: 36.6,
          firstHighMeasurementDay: {
            date: 10,
            temperature: { value: 36.7 }
          },
          evaluationCompleteDay: {
            date: 12,
            temperature: { value: 36.9 }
          },
          detected: true,
          rule: 0
        })
      })

      test('detects 2 consecutive invalid shifts', () => {
        const temps =
        [36.4, 36.4, 36.4, 36.4, 36.4, 36.4, 36.6, 36.6, 36.4, 36.4,
          36.6, 36.6, 36.7]
          .map(turnIntoCycleDayObject)

        const status = getTemperatureStatus(temps)
        expect(status).toEqual({ detected: false })
      })
    })

    describe('1st exception rule', () => {
      test('detects temperature shift', () => {
        const firstException =
        [36.7, 36.57, 36.47, 36.49, 36.57, 36.62, 36.55,
          36.8, 36.86, 36.77, 36.63]
          .map(turnIntoCycleDayObject)
        const status = getTemperatureStatus(firstException)
        expect(status).toEqual({
          ltl: 36.6,
          firstHighMeasurementDay: {
            date: 7,
            temperature: { value: 36.8 }
          },

          evaluationCompleteDay: {
            date: 10,
            temperature: { value: 36.63 }
          },
          detected: true,
          rule: 1
        })
      })

      test('detects missing temperature shift correctly', () => {
        const firstExceptionNoShift =
        [36.7, 36.57, 36.47, 36.49, 36.57, 36.62, 36.55,
          36.8, 36.86, 36.77, 36.57]
          .map(turnIntoCycleDayObject)
        const status = getTemperatureStatus(firstExceptionNoShift)
        expect(status).toEqual({ detected: false })
      })

      test('detects missing temperature shift with not enough high temps', () => {
        const temps =
        [36.7, 36.57, 36.47, 36.49, 36.57, 36.62, 36.55, 36.8, 36.86, 36.77]
          .map(turnIntoCycleDayObject)
        const status = getTemperatureStatus(temps)
        expect(status).toEqual({ detected: false })
      })

      test('detects shift after an earlier one was invalid', () => {
        const temps =
        [36.4, 36.4, 36.4, 36.4, 36.4, 36.4, 36.6, 36.6, 36.4, 36.4,
          36.7, 36.7, 36.7, 36.7]
          .map(turnIntoCycleDayObject)

        const status = getTemperatureStatus(temps)
        expect(status).toEqual({
          ltl: 36.6,
          firstHighMeasurementDay: {
            date: 10,
            temperature: { value: 36.7 }
          },

          evaluationCompleteDay: {
            date: 13,
            temperature: { value: 36.7 }
          },
          detected: true,
          rule: 1
        })
      })
    })

    describe('2nd exception rule', () => {
      test('detects temperature shift with exception temp eql ltl', () => {
        const secondException =
        [36.7, 36.57, 36.47, 36.49, 36.57, 36.62, 36.55,
          36.8, 36.86, 36.6, 36.8]
          .map(turnIntoCycleDayObject)
        const status = getTemperatureStatus(secondException)
        expect(status).toEqual({
          ltl: 36.6,
          firstHighMeasurementDay: {
            date: 7,
            temperature: { value: 36.8 }
          },

          evaluationCompleteDay: {
            date: 10,
            temperature: { value: 36.8 }
          },
          detected: true,
          rule: 2
        })
      })

      test('detects temperature shift with exception temp lower than ltl', () => {
        const secondException =
        [36.7, 36.57, 36.47, 36.49, 36.57, 36.62, 36.55,
          36.8, 36.86, 36.4, 36.8]
          .map(turnIntoCycleDayObject)
        const status = getTemperatureStatus(secondException)
        expect(status).toEqual({
          ltl: 36.6,
          firstHighMeasurementDay: {
            date: 7,
            temperature: { value: 36.8 }
          },

          evaluationCompleteDay: {
            date: 10,
            temperature: { value: 36.8 }
          },
          detected: true,
          rule: 2
        })
      })

      test('detects missing temperature shift correctly', () => {
        const temps =
        [36.7, 36.57, 36.47, 36.49, 36.57, 36.62, 36.55,
          36.8, 36.86, 36.4, 36.77, 36.77]
          .map(turnIntoCycleDayObject)
        const status = getTemperatureStatus(temps)
        expect(status).toEqual({ detected: false })
      })

      test('detects missing temperature shift when not enough high temps', () => {
        const temps =
        [36.7, 36.57, 36.47, 36.49, 36.57, 36.62, 36.55, 36.8, 36.86, 36.4]
          .map(turnIntoCycleDayObject)
        const status = getTemperatureStatus(temps)
        expect(status).toEqual({ detected: false })
      })

      test('detects shift after an earlier one was invalid', () => {
        const temps =
        [36.7, 36.57, 36.47, 36.49, 36.57, 36.62, 36.55, 36.8, 36.86, 36.4,
          36.77, 36.9, 36.9, 36.86, 37.04]
          .map(turnIntoCycleDayObject)
        const status = getTemperatureStatus(temps)
        expect(status).toEqual({
          ltl: 36.85,
          firstHighMeasurementDay: {
            date: 11,
            temperature: { value: 36.9 }
          },

          evaluationCompleteDay: {
            date: 14,
            temperature: { value: 37.04 }
          },
          detected: true,
          rule: 2
        })
      })
    })
  })
})
