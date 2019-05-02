import getMucusStatus from 'src/lib/sympto/mucus'

function turnIntoCycleDayObject(value, fakeDate) {
  return {
    mucus: { value },
    date: fakeDate
  }
}

describe('sympto', () => {
  describe('detect mucus shift', () => {
    describe('regular rule', () => {
      test('detects mucus shift correctly', () => {
        const values = [0, 0, 0, 1, 1, 2, 2, 2, 3, 3, 3, 2, 2, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0]
          .map(turnIntoCycleDayObject)
        const status = getMucusStatus(values, 12)
        expect(status).toEqual({
          detected: true,
          mucusPeak: {
            date: 10,
            mucus: { value: 3 }
          },
          evaluationCompleteDay: {
            date: 13,
            mucus: { value: 0 }
          }
        })
      })

      test(
        'detects no mucus shift when there are less than 3 days of lower quality',
        () => {
          const values = [0, 1, 1, 2, 0, 0, 1, 2, 3, 2, 3, 3, 3, 2, 2]
            .map(turnIntoCycleDayObject)
          const status = getMucusStatus(values, 30)
          expect(status).toEqual({ detected: false })
        }
      )

      test('detects no mucus shift when there are no mucus values', () => {
        const status = getMucusStatus(Array(10).fill({
          date: 1,
          temperature: { value: 35 }
        }))
        expect(status).toEqual({ detected: false })
      })

      test(
        'detects no mucus shift when the mucus values are all the same',
        () => {
          const values = [2, 2, 2, 2, 2, 2, 2, 2]
            .map(turnIntoCycleDayObject)
          const status = getMucusStatus(values, 30)
          expect(status).toEqual({ detected: false })
        }
      )

      test(
        'detects no mucus shift when mucus only changes from dry to nothing',
        () => {
          const values = [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0]
            .map(turnIntoCycleDayObject)
          const status = getMucusStatus(values, 30)
          expect(status).toEqual({ detected: false })
        }
      )

      test('ignores an early seeming shift from 0 to 1', () => {
        const values = [0, 0, 0, 1, 0, 0, 0, 2, 3, 3, 3, 2, 2, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0]
          .map(turnIntoCycleDayObject)
        const status = getMucusStatus(values, 12)
        expect(status).toEqual({
          detected: true,
          mucusPeak: {
            date: 10,
            mucus: { value: 3 }
          },
          evaluationCompleteDay: {
            date: 13,
            mucus: { value: 0 }
          }
        })
      })
    })
  })
})
