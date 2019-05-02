import cycleModule from 'src/lib/cycle'

describe('getCycleDayNumber', () => {
  it('works for a simple example', async () => {
    const cycleStarts = [{
      date: '2018-05-09',
      isCycleStart: true,
      bleeding: {
        value: 2
      }
    }, {
      date: '2018-05-03',
      isCycleStart: true,
      bleeding: { value: 2 }
    }]
    const cycleMod = await cycleModule({
      cycleStartsSortedByDate: cycleStarts
    })
    const getCycleDayNumber = cycleMod.getCycleDayNumber
    const targetDate = '2018-05-17'
    const result = getCycleDayNumber(targetDate)
    expect(result).toBe(9)
  })

  it(
    'gets the correct number if the target day is not in the current cycle',
    async () => {
      const cycleStarts = [{
        date: '2018-05-13',
        isCycleStart: true,
        bleeding: {
          value: 2
        }
      }, {
        date: '2018-04-10',
        isCycleStart: true,
        bleeding: { value: 2 }
      }]
      const cycleMod = await cycleModule({
        cycleStartsSortedByDate: cycleStarts
      })
      const targetDate = '2018-04-27'
      const getCycleDayNumber = cycleMod.getCycleDayNumber
      const result = getCycleDayNumber(targetDate)
      expect(result).toBe(18)
    }
  )

  test(
    'gets the correct number if the target day is the only bleeding day',
    async () => {
      const cycleStarts = [{
        date: '2018-05-13',
        isCycleStart: true,
        bleeding: { value: 2 }
      }]
      const cycleMod = await cycleModule({
        cycleStartsSortedByDate: cycleStarts
      })
      const targetDate = '2018-05-13'
      const getCycleDayNumber = cycleMod.getCycleDayNumber
      const result = getCycleDayNumber(targetDate)
      expect(result).toBe(1)
    }
  )

  test('returns null if there are no bleeding days', async () => {
    const cycleStarts = []
    const targetDate = '2018-05-17'
    const cycleMod = await cycleModule({
      cycleStartsSortedByDate: cycleStarts
    })
    const getCycleDayNumber = cycleMod.getCycleDayNumber
    const result = getCycleDayNumber(targetDate)
    expect(result).toBeNull()
  })

  test('returns null if the cycle is longer than the max', async () => {
    const cycleStarts = [{
      date: '2018-05-09',
      isCycleStart: true,
      bleeding: {
        value: 2
      }
    }, {
      date: '2018-05-03',
      isCycleStart: true,
      bleeding: { value: 2 }
    }]
    const cycleMod = await cycleModule({
      cycleStartsSortedByDate: cycleStarts
    })
    // we use the default 99 days max length
    const getCycleDayNumber = cycleMod.getCycleDayNumber
    const targetDate = '2018-08-16'
    const result = getCycleDayNumber(targetDate)
    expect(result).toBeNull()
  })
})

describe('getPreviousCycle', () => {
  test('gets previous cycle', async () => {
    const cycleDaysSortedByDate = [
      {
        date: '2018-07-05',
        bleeding: { value: 2 }
      },
      {
        date: '2018-06-05',
        bleeding: { value: 2 }
      },
      {
        date: '2018-05-05',
        mucus: { value: 2 }
      },
      {
        date: '2018-05-04',
        bleeding: { value: 2 }
      },
      {
        date: '2018-05-03',
        bleeding: { value: 2 }
      },
      {
        date: '2018-04-05',
        mucus: { value: 2 }
      },
      {
        date: '2018-04-04',
        mucus: { value: 2 }
      },
      {
        date: '2018-04-03',
        mucus: { value: 2 }
      },
      {
        date: '2018-04-02',
        bleeding: { value: 2 }
      }
    ]

    const cycleStarts = [
      '2018-07-05',
      '2018-06-05',
      '2018-05-03',
      '2018-04-02'
    ]
    const cycleMod = await cycleModule({
      cycleDaysSortedByDate,
      cycleStartsSortedByDate: cycleDaysSortedByDate.filter(d => {
        return cycleStarts.includes(d.date)
      })
    })
    const { getPreviousCycle } = cycleMod
    const result = getPreviousCycle('2018-06-08')
    expect(result).toEqual([
      {
        date: '2018-05-05',
        mucus: { value: 2 }
      },
      {
        date: '2018-05-04',
        bleeding: { value: 2 }
      },
      {
        date: '2018-05-03',
        bleeding: { value: 2 }
      }
    ])
  })

  test('returns null when target day is not in a cyle', async () => {
    const cycleDaysSortedByDate = [
      {
        date: '2018-07-05'
      },
      {
        date: '2018-06-05'
      },
      {
        date: '2018-05-05'
      },
      {
        date: '2018-05-04'
      },
      {
        date: '2018-05-03'
      },
      {
        date: '2018-04-05'
      },
      {
        date: '2018-04-04',
        mucus: { value: 2 }
      },
      {
        date: '2018-04-03'
      },
      {
        date: '2018-04-02'
      }
    ]

    const cycleStarts = []
    const cycleMod = await cycleModule({
      cycleDaysSortedByDate,
      cycleStartsSortedByDate: cycleDaysSortedByDate.filter(d => {
        return cycleStarts.includes(d.date)
      })
    })
    const { getPreviousCycle } = cycleMod
    const result = getPreviousCycle('2018-06-08')
    expect(result).toBeNull()
  })

  test('returns null when there is no previous cycle', async () => {
    const cycleDaysSortedByDate = [
      {
        date: '2018-07-05',
        bleeding: { value: 2 }
      },
      {
        date: '2018-06-05',
        bleeding: { value: 2 }
      },
      {
        date: '2018-05-05',
        mucus: { value: 2 }
      },
      {
        date: '2018-05-04',
        bleeding: { value: 2 }
      },
      {
        date: '2018-05-03',
        bleeding: { value: 2 }
      },
      {
        date: '2018-04-05',
        mucus: { value: 2 }
      },
      {
        date: '2018-04-04',
        mucus: { value: 2 }
      },
      {
        date: '2018-04-03',
        mucus: { value: 2 }
      },
      {
        date: '2018-04-02',
        bleeding: { value: 2 }
      }
    ]

    const cycleStarts = [
      '2018-07-05',
      '2018-06-05',
      '2018-05-03',
      '2018-04-02'
    ]
    const cycleMod = await cycleModule({
      cycleDaysSortedByDate,
      cycleStartsSortedByDate: cycleDaysSortedByDate.filter(d => {
        return cycleStarts.includes(d.date)
      })
    })
    const { getPreviousCycle } = cycleMod
    const result = getPreviousCycle('2018-04-18')
    expect(result).toBeNull()
  })

  test('returns null when the previous cycle > maxcyclelength', async () => {
    const cycleDaysSortedByDate = [
      {
        date: '2018-07-05',
        bleeding: { value: 2 }
      },
      {
        date: '2018-06-05',
        bleeding: { value: 2 }
      },
      {
        date: '2018-05-05',
        mucus: { value: 2 }
      },
      {
        date: '2018-05-04',
        bleeding: { value: 2 }
      },
      {
        date: '2018-05-03',
        bleeding: { value: 2 }
      },
      {
        date: '2018-04-05',
        mucus: { value: 2 }
      },
      {
        date: '2018-04-04',
        mucus: { value: 2 }
      },
      {
        date: '2018-04-03',
        mucus: { value: 2 }
      },
      {
        date: '2018-04-02',
        bleeding: { value: 2 }
      }
    ]

    const cycleStarts = [
      '2018-07-05',
      '2018-06-05',
      '2018-05-03',
      '2018-04-02'
    ]
    const cycleMod = await cycleModule({
      cycleDaysSortedByDate,
      cycleStartsSortedByDate: cycleDaysSortedByDate.filter(d => {
        return cycleStarts.includes(d.date)
      }),
      maxCycleLength: 2
    })
    const { getPreviousCycle } = cycleMod
    const result = getPreviousCycle('2018-06-08')
    expect(result).toBeNull()
  })
})

describe('getCyclesBefore', () => {
  test('gets previous cycles', async () => {
    const cycleDaysSortedByDate = [
      {
        date: '2018-07-05',
        bleeding: { value: 2 }
      },
      {
        date: '2018-06-05',
        bleeding: { value: 2 }
      },
      {
        date: '2018-05-05',
        mucus: { value: 2 }
      },
      {
        date: '2018-05-04',
        bleeding: { value: 2 }
      },
      {
        date: '2018-05-03',
        bleeding: { value: 2 }
      },
      {
        date: '2018-04-05',
        mucus: { value: 2 }
      },
      {
        date: '2018-04-04',
        mucus: { value: 2 }
      },
      {
        date: '2018-04-03',
        mucus: { value: 2 }
      },
      {
        date: '2018-04-02',
        bleeding: { value: 2 }
      }
    ]

    const cycleStarts = [
      '2018-07-05',
      '2018-06-05',
      '2018-05-03',
      '2018-04-02'
    ]
    const cycleMod = await cycleModule({
      cycleDaysSortedByDate,
      cycleStartsSortedByDate: cycleDaysSortedByDate.filter(d => {
        return cycleStarts.includes(d.date)
      })
    })
    const { getCyclesBefore } = cycleMod
    const result = getCyclesBefore(cycleDaysSortedByDate[0])
    expect(result).toHaveLength(3)
    expect(result).toEqual([
      [
        {
          date: '2018-06-05',
          bleeding: { value: 2 }
        }
      ], [
        {
          date: '2018-05-05',
          mucus: { value: 2 }
        },
        {
          date: '2018-05-04',
          bleeding: { value: 2 }
        },
        {
          date: '2018-05-03',
          bleeding: { value: 2 }
        }
      ], [
        {
          date: '2018-04-05',
          mucus: { value: 2 }
        },
        {
          date: '2018-04-04',
          mucus: { value: 2 }
        },
        {
          date: '2018-04-03',
          mucus: { value: 2 }
        },
        {
          date: '2018-04-02',
          bleeding: { value: 2 }
        }
      ]
    ])
  })

  test('skips cycles that are longer than max', async () => {
    const cycleDaysSortedByDate = [
      {
        date: '2018-07-05',
        bleeding: { value: 2 }
      },
      {
        date: '2018-06-05',
        bleeding: { value: 2 }
      },
      {
        date: '2018-05-05',
        mucus: { value: 2 }
      },
      {
        date: '2018-05-04',
        bleeding: { value: 2 }
      },
      {
        date: '2018-05-03',
        bleeding: { value: 2 }
      },
      {
        date: '2018-04-05',
        mucus: { value: 2 }
      },
      {
        date: '2018-04-04',
        mucus: { value: 2 }
      },
      {
        date: '2018-04-03',
        mucus: { value: 2 }
      },
      {
        date: '2018-04-02',
        bleeding: { value: 2 }
      }
    ]

    const cycleStarts = [
      '2018-07-05',
      '2018-06-05',
      '2018-05-03',
      '2018-04-02'
    ]
    const cycleMod = await cycleModule({
      cycleDaysSortedByDate,
      cycleStartsSortedByDate: cycleDaysSortedByDate.filter(d => {
        return cycleStarts.includes(d.date)
      }),
      maxCycleLength: 30
    })
    const { getCyclesBefore } = cycleMod
    const result = getCyclesBefore(cycleDaysSortedByDate[0])
    expect(result).toHaveLength(1)
    expect(result).toEqual([[{
      bleeding: { value: 2 },
      date: '2018-06-05'
    }]])
  })
})

describe('getCycleForDay', () => {
  const cycleDaysSortedByDate = [
    {
      date: '2018-07-05',
      bleeding: { value: 2 }
    },
    {
      date: '2018-06-05',
      bleeding: { value: 2 }
    },
    {
      date: '2018-05-05',
      mucus: { value: 2 }
    },
    {
      date: '2018-05-04',
      bleeding: { value: 2 }
    },
    {
      date: '2018-05-03',
      bleeding: { value: 2 }
    },
    {
      date: '2018-04-05',
      mucus: { value: 2 }
    },
    {
      date: '2018-04-04',
      mucus: { value: 2 }
    },
    {
      date: '2018-04-03',
      mucus: { value: 2 }
    },
    {
      date: '2018-04-02',
      bleeding: { value: 2 }
    }
  ]
  const cycleStarts = [
    '2018-07-05',
    '2018-06-05',
    '2018-05-03',
    '2018-04-02'
  ]

  test('gets cycle that has only one day', async () => {
    const cycleMod = await cycleModule({
      cycleDaysSortedByDate,
      cycleStartsSortedByDate: cycleDaysSortedByDate.filter(d => {
        return cycleStarts.includes(d.date)
      })
    })
    const { getCycleForDay } = cycleMod
    const result = getCycleForDay('2018-07-05', '2018-08-01')
    expect(result).toHaveLength(1)
    expect(result).toEqual([
      {
        date: '2018-07-05',
        bleeding: { value: 2 }
      }
    ])
    const result2 = getCycleForDay('2018-06-05')
    expect(result2).toHaveLength(1)
    expect(result2).toEqual([
      {
        date: '2018-06-05',
        bleeding: { value: 2 }
      }
    ])
  })

  test('for later date gets cycle that has only one day', async () => {
    const cycleMod = await cycleModule({
      cycleDaysSortedByDate,
      cycleStartsSortedByDate: cycleDaysSortedByDate.filter(d => {
        return cycleStarts.includes(d.date)
      })
    })
    const { getCycleForDay } = cycleMod
    const result = getCycleForDay('2018-06-20')
    expect(result).toHaveLength(1)
    expect(result).toEqual([
      {
        date: '2018-06-05',
        bleeding: { value: 2 }
      }
    ])
  })

  test('returns null if there is no cycle start for that date', async () => {
    const cycleMod = await cycleModule({
      cycleDaysSortedByDate,
      cycleStartsSortedByDate: cycleDaysSortedByDate.filter(d => {
        return cycleStarts.includes(d.date)
      })
    })
    const { getCycleForDay } = cycleMod
    const result = getCycleForDay('2018-04-01')
    expect(result).toBeNull()
  })

  test('returns null if the cycle is longer than the max', async () => {
    const cycleMod = await cycleModule({
      cycleDaysSortedByDate,
      cycleStartsSortedByDate: cycleDaysSortedByDate.filter(d => {
        return cycleStarts.includes(d.date)
      }),
      maxCycleLength: 3
    })
    const { getCycleForDay } = cycleMod
    const result = getCycleForDay('2018-04-04')
    expect(result).toBeNull()
  })

  test('gets cycle for day', async () => {
    const cycleMod = await cycleModule({
      cycleDaysSortedByDate,
      cycleStartsSortedByDate: cycleDaysSortedByDate.filter(d => {
        return cycleStarts.includes(d.date)
      })
    })
    const { getCycleForDay } = cycleMod
    const result = getCycleForDay('2018-04-04')
    expect(result).toHaveLength(4)
    expect(result).toEqual([
      {
        date: '2018-04-05',
        mucus: { value: 2 }
      },
      {
        date: '2018-04-04',
        mucus: { value: 2 }
      },
      {
        date: '2018-04-03',
        mucus: { value: 2 }
      },
      {
        date: '2018-04-02',
        bleeding: { value: 2 }
      }
    ])
  })
})

describe('getPredictedMenses', () => {
  describe('cannot predict next menses', () => {
    test('if no bleeding is documented', async () => {
      const cycleDaysSortedByDate = [ {} ]
      const cycleStarts = []
      const cycleMod = await cycleModule({
        cycleDaysSortedByDate,
        bleedingDaysSortedByDate: cycleDaysSortedByDate.filter(d => d.bleeding),
        cycleStartsSortedByDate: cycleDaysSortedByDate.filter(d => {
          return cycleStarts.includes(d.date)
        }),
        maxCycleLength: 99,
        minCyclesForPrediction: 1
      })
      const { getPredictedMenses } = cycleMod
      const result = getPredictedMenses()
      expect(result).toEqual([])
    })

    test('if one bleeding is documented (no completed cycle)', async () => {
      const cycleDaysSortedByDate = [
        {
          date: '2018-06-02',
          bleeding: { value: 2 }
        }
      ]
      const cycleStarts = ['2018-06-02']
      const cycleMod = await cycleModule({
        cycleDaysSortedByDate,
        bleedingDaysSortedByDate: cycleDaysSortedByDate.filter(d => d.bleeding),
        cycleStartsSortedByDate: cycleDaysSortedByDate.filter(d => {
          return cycleStarts.includes(d.date)
        }),
        maxCycleLength: 99,
        minCyclesForPrediction: 1
      })
      const { getPredictedMenses } = cycleMod
      const result = getPredictedMenses()
      expect(result).toEqual([])
    })

    test('if number of cycles is below minCyclesForPrediction', async () => {
      const cycleDaysSortedByDate = [
        {
          date: '2018-06-02',
          bleeding: { value: 2 }
        },
        {
          date: '2018-06-01',
          bleeding: { value: 2 }
        },
        {
          date: '2018-05-01',
          bleeding: { value: 2 }
        }
      ]
      const cycleStarts = ['2018-06-01', '2018-05-01']
      const cycleMod = await cycleModule({
        cycleDaysSortedByDate,
        bleedingDaysSortedByDate: cycleDaysSortedByDate.filter(d => d.bleeding),
        cycleStartsSortedByDate: cycleDaysSortedByDate.filter(d => {
          return cycleStarts.includes(d.date)
        })
      })
      const { getPredictedMenses } = cycleMod
      const result = getPredictedMenses()
      expect(result).toEqual([])
    })

    test(
      'if number of cycles is below minCyclesForPrediction because one of them is too long',
      async () => {
        const cycleDaysSortedByDate = [
          {
            date: '2018-06-02',
            bleeding: { value: 2 }
          },
          {
            date: '2018-06-01',
            bleeding: { value: 2 }
          },
          {
            date: '2018-05-01',
            bleeding: { value: 2 }
          },
          {
            date: '2018-04-03',
            bleeding: { value: 2 }
          },
          {
            date: '2018-04-02',
            bleeding: { value: 2 }
          },
          {
            date: '2018-04-01',
            bleeding: { value: 2 }
          }
        ]
        const cycleStarts = ['2018-06-01', '2018-05-01', '2018-04-01']
        const cycleMod = await cycleModule({
          cycleDaysSortedByDate,
          bleedingDaysSortedByDate: cycleDaysSortedByDate.filter(d => d.bleeding),
          cycleStartsSortedByDate: cycleDaysSortedByDate.filter(d => {
            return cycleStarts.includes(d.date)
          }),
          maxCycleLength: 2
        })
        const { getPredictedMenses } = cycleMod
        const result = getPredictedMenses()
        expect(result).toEqual([])
      }
    )
  })
  describe('works', () => {
    test('for one completed cycle with minCyclesForPrediction = 1', async () => {
      const cycleDaysSortedByDate = [
        {
          date: '2018-07-15',
          bleeding: { value: 2 }
        },
        {
          date: '2018-07-01',
          bleeding: { value: 2 }
        }
      ]
      const cycleStarts = ['2018-07-15', '2018-07-01']
      const cycleMod = await cycleModule({
        cycleDaysSortedByDate,
        cycleStartsSortedByDate: cycleDaysSortedByDate.filter(d => {
          return cycleStarts.includes(d.date)
        }),
        minCyclesForPrediction: 1
      })
      const { getPredictedMenses } = cycleMod
      const result = getPredictedMenses()
      const expectedResult = [
        [
          '2018-07-27',
          '2018-07-28',
          '2018-07-29',
          '2018-07-30',
          '2018-07-31'
        ],
        [
          '2018-08-10',
          '2018-08-11',
          '2018-08-12',
          '2018-08-13',
          '2018-08-14'
        ],
        [
          '2018-08-24',
          '2018-08-25',
          '2018-08-26',
          '2018-08-27',
          '2018-08-28'
        ]
      ]
      expect(result).toEqual(expectedResult)
    })

    test('if number of cycles is above minCyclesForPrediction', async () => {
      const cycleDaysSortedByDate = [
        {
          date: '2018-08-02',
          bleeding: { value: 2 }
        },
        {
          date: '2018-07-02',
          bleeding: { value: 2 }
        },
        {
          date: '2018-06-01',
          bleeding: { value: 2 }
        },
        {
          date: '2018-05-01',
          bleeding: { value: 2 }
        }
      ]
      const cycleMod = await cycleModule({
        cycleDaysSortedByDate,
        cycleStartsSortedByDate: cycleDaysSortedByDate,
        minCyclesForPrediction: 1
      })
      const { getPredictedMenses } = cycleMod
      const result = getPredictedMenses()
      const expectedResult = [
        [
          '2018-09-01',
          '2018-09-02',
          '2018-09-03'
        ],
        [
          '2018-10-02',
          '2018-10-03',
          '2018-10-04'
        ],
        [
          '2018-11-02',
          '2018-11-03',
          '2018-11-04'
        ]
      ]
      expect(result).toEqual(expectedResult)
    })

    test('3 cycles with little standard deviation', async () => {
      const cycleDaysSortedByDate = [
        {
          date: '2018-08-01',
          bleeding: { value: 2 }
        },
        {
          date: '2018-07-18',
          bleeding: { value: 2 }
        },
        {
          date: '2018-07-05',
          bleeding: { value: 2 }
        },
        {
          date: '2018-06-20',
          bleeding: { value: 2 }
        }
      ]
      const cycleMod = await cycleModule({
        cycleDaysSortedByDate,
        cycleStartsSortedByDate: cycleDaysSortedByDate
      })
      const { getPredictedMenses } = cycleMod
      const result = getPredictedMenses()
      const expectedResult = [
        [
          '2018-08-14',
          '2018-08-15',
          '2018-08-16'
        ],
        [
          '2018-08-28',
          '2018-08-29',
          '2018-08-30'
        ],
        [
          '2018-09-11',
          '2018-09-12',
          '2018-09-13'
        ]
      ]
      expect(result).toEqual(expectedResult)
    })

    test('3 cycles with bigger standard deviation', async () => {
      const cycleDaysSortedByDate = [
        {
          date: '2018-08-01',
          bleeding: { value: 2 }
        },
        {
          date: '2018-07-14',
          bleeding: { value: 2 }
        },
        {
          date: '2018-07-04',
          bleeding: { value: 2 }
        },
        {
          date: '2018-06-20',
          bleeding: { value: 2 }
        }
      ]
      const cycleMod = await cycleModule({
        cycleDaysSortedByDate,
        cycleStartsSortedByDate: cycleDaysSortedByDate
      })
      const { getPredictedMenses } = cycleMod
      const result = getPredictedMenses()
      const expectedResult = [
        [
          '2018-08-13',
          '2018-08-14',
          '2018-08-15',
          '2018-08-16',
          '2018-08-17'
        ],
        [
          '2018-08-27',
          '2018-08-28',
          '2018-08-29',
          '2018-08-30',
          '2018-08-31'
        ],
        [
          '2018-09-10',
          '2018-09-11',
          '2018-09-12',
          '2018-09-13',
          '2018-09-14'
        ]
      ]
      expect(result).toEqual(expectedResult)
    })

    test('does not count cycles longer than max', async () => {
      const cycleDaysSortedByDate = [
        {
          date: '2018-08-01',
          bleeding: { value: 2 }
        },
        {
          date: '2018-07-14',
          bleeding: { value: 2 }
        },
        {
          date: '2018-07-04',
          bleeding: { value: 2 }
        },
        {
          date: '2018-06-20',
          bleeding: { value: 2 }
        },
        {
          date: '2018-04-20',
          bleeding: { value: 2 }
        }
      ]
      const cycleMod = await cycleModule({
        cycleDaysSortedByDate,
        cycleStartsSortedByDate: cycleDaysSortedByDate,
        maxCycleLength: 50
      })
      const { getPredictedMenses } = cycleMod
      const result = getPredictedMenses()
      const expectedResult = [
        [
          '2018-08-13',
          '2018-08-14',
          '2018-08-15',
          '2018-08-16',
          '2018-08-17'
        ],
        [
          '2018-08-27',
          '2018-08-28',
          '2018-08-29',
          '2018-08-30',
          '2018-08-31'
        ],
        [
          '2018-09-10',
          '2018-09-11',
          '2018-09-12',
          '2018-09-13',
          '2018-09-14'
        ]
      ]
      expect(result).toEqual(expectedResult)
    })
  })
})

describe('isMensesStart', () => {
  test('works for simple menses start', async () => {
    const cycleDaysSortedByDate = [
      {
        date: '2018-05-04'
      },
      {
        date: '2018-05-03',
        bleeding: { value: 1 }
      },
      {
        date: '2018-05-02',
        bleeding: { value: 1 }
      },
      {
        date: '2018-05-01',
        bleeding: { value: 1 }
      },
      {
        date: '2018-04-30'
      }
    ]
    const cycleMod = await cycleModule({
      cycleDaysSortedByDate,
      bleedingDaysSortedByDate: cycleDaysSortedByDate.filter(d => d.bleeding)
    })
    const { isMensesStart } = cycleMod
    const start = isMensesStart(cycleDaysSortedByDate[3])
    expect(start).toBeTruthy()
    expect(isMensesStart(cycleDaysSortedByDate[0])).toBeFalsy()
    expect(isMensesStart(cycleDaysSortedByDate[1])).toBeFalsy()
    expect(isMensesStart(cycleDaysSortedByDate[2])).toBeFalsy()
    expect(isMensesStart(cycleDaysSortedByDate[4])).toBeFalsy()
  })

  test('works with previous excluded value', async () => {
    const cycleDaysSortedByDate = [
      {
        date: '2018-06-01',
        bleeding: { value: 2 }
      },
      {
        date: '2018-05-01',
        bleeding: { value: 2 }
      },
      {
        date: '2018-04-30',
        bleeding: { value: 2, exclude: true }
      }
    ]
    const cycleMod = await cycleModule({
      cycleDaysSortedByDate,
      bleedingDaysSortedByDate: cycleDaysSortedByDate.filter(d => d.bleeding)
    })
    const { isMensesStart } = cycleMod
    const start = isMensesStart(cycleDaysSortedByDate[1])
    expect(start).toBeTruthy()
    const notStart = isMensesStart(cycleDaysSortedByDate[2])
    expect(notStart).toBeFalsy()
  })

  test('returns false when day has no bleeding', async () => {
    const cycleDaysSortedByDate = [
      {
        date: '2018-06-01'
      },
      {
        date: '2018-05-01'
      },
      {
        date: '2018-04-30',
        bleeding: { value: 2, exclude: true }
      }
    ]
    const cycleMod = await cycleModule({
      cycleDaysSortedByDate,
      bleedingDaysSortedByDate: cycleDaysSortedByDate.filter(d => d.bleeding)
    })
    const { isMensesStart } = cycleMod
    const start = isMensesStart(cycleDaysSortedByDate[0])
    expect(start).toBeFalsy()
  })

  test(
    'returns false when there is a previous bleeding day within the threshold',
    async () => {
      const cycleDaysSortedByDate = [
        {
          date: '2018-06-01'
        },
        {
          date: '2018-05-01'
        },
        {
          date: '2018-04-30',
          bleeding: { value: 2 }
        },
        {
          date: '2018-04-29'
        },
        {
          date: '2018-04-28',
          bleeding: { value: 2 }
        }
      ]
      const cycleMod = await cycleModule({
        cycleDaysSortedByDate,
        bleedingDaysSortedByDate: cycleDaysSortedByDate.filter(d => d.bleeding)
      })
      const { isMensesStart } = cycleMod
      const start = isMensesStart(cycleDaysSortedByDate[2])
      expect(start).toBeFalsy()
    }
  )

  test(
    'returns true when there is a previous excluded bleeding day within the threshold',
    async () => {
      const cycleDaysSortedByDate = [
        {
          date: '2018-06-01'
        },
        {
          date: '2018-05-01'
        },
        {
          date: '2018-04-30',
          bleeding: { value: 2 }
        },
        {
          date: '2018-04-29'
        },
        {
          date: '2018-04-28',
          bleeding: { value: 2, exclude: true }
        }
      ]
      const cycleMod = await cycleModule({
        cycleDaysSortedByDate,
        bleedingDaysSortedByDate: cycleDaysSortedByDate.filter(d => d.bleeding)
      })
      const { isMensesStart } = cycleMod
      const start = isMensesStart(cycleDaysSortedByDate[2])
      expect(start).toBeTruthy()
    }
  )
  describe('with cycle thresholds', () => {
    const maxBreakInBleeding = 3

    test(
      'disregards bleeding breaks equal to maxAllowedBleedingBreak in a bleeding period',
      async () => {
        const bleedingDays = [{
          date: '2018-05-14',
          bleeding: {
            value: 2
          }
        }, {
          date: '2018-05-10',
          bleeding: {
            value: 2
          }
        }]
        const cycleMod = await cycleModule({
          bleedingDaysSortedByDate: bleedingDays,
          maxBreakInBleeding
        })
        const { isMensesStart } = cycleMod
        const result = isMensesStart(bleedingDays[0])
        expect(result).toBeFalsy()
      }
    )

    test(
      'counts bleeding breaks longer than maxAllowedBleedingBreak in a bleeding period',
      async () => {
        const bleedingDays = [{
          date: '2018-05-14',
          bleeding: {
            value: 2
          }
        }, {
          date: '2018-05-09',
          bleeding: {
            value: 2
          }
        }]
        const cycleMod = await cycleModule({
          bleedingDaysSortedByDate: bleedingDays,
          maxBreakInBleeding
        })
        const { isMensesStart } = cycleMod
        const result = isMensesStart(bleedingDays[0])
        expect(result).toBeTruthy()
      }
    )
  })
})

describe('getMensesDaysRightAfter', () => {
  test('works for simple menses start', async () => {
    const cycleDaysSortedByDate = [
      {
        date: '2018-05-04'
      },
      {
        date: '2018-05-03',
        bleeding: { value: 1 }
      },
      {
        date: '2018-05-02',
        bleeding: { value: 1 }
      },
      {
        date: '2018-05-01',
        bleeding: { value: 1 }
      },
      {
        date: '2018-04-30'
      }
    ]
    const cycleMod = await cycleModule({
      cycleDaysSortedByDate,
      bleedingDaysSortedByDate: cycleDaysSortedByDate.filter(d => d.bleeding)
    })
    const { getMensesDaysRightAfter } = cycleMod
    const days = getMensesDaysRightAfter(cycleDaysSortedByDate[3])
    expect(days).toEqual([
      {
        date: '2018-05-03',
        bleeding: { value: 1 }
      },
      {
        date: '2018-05-02',
        bleeding: { value: 1 }
      }
    ])
  })

  test('works when the day is not a bleeding day', async () => {
    const cycleDaysSortedByDate = [
      {
        date: '2018-05-04'
      },
      {
        date: '2018-05-03',
        bleeding: { value: 1 }
      },
      {
        date: '2018-05-02',
        bleeding: { value: 1 }
      },
      {
        date: '2018-05-01',
        bleeding: { value: 1 }
      },
      {
        date: '2018-04-30',
        bleeding: null
      }
    ]
    const cycleMod = await cycleModule({
      cycleDaysSortedByDate,
      bleedingDaysSortedByDate: cycleDaysSortedByDate.filter(d => d.bleeding)
    })
    const { getMensesDaysRightAfter } = cycleMod
    const days = getMensesDaysRightAfter(cycleDaysSortedByDate[4])
    expect(days).toEqual([
      {
        date: '2018-05-03',
        bleeding: { value: 1 }
      },
      {
        date: '2018-05-02',
        bleeding: { value: 1 }
      },
      {
        date: '2018-05-01',
        bleeding: { value: 1 }
      }
    ])
  })

  test('ignores excluded values', async () => {
    const cycleDaysSortedByDate = [
      {
        date: '2018-05-04'
      },
      {
        date: '2018-05-03',
        bleeding: { value: 1 }
      },
      {
        date: '2018-05-02',
        bleeding: { value: 1, exclude: true }
      },
      {
        date: '2018-05-01',
        bleeding: { value: 1 }
      },
      {
        date: '2018-04-30'
      }
    ]
    const cycleMod = await cycleModule({
      cycleDaysSortedByDate,
      bleedingDaysSortedByDate: cycleDaysSortedByDate.filter(d => d.bleeding)
    })
    const { getMensesDaysRightAfter } = cycleMod
    const days = getMensesDaysRightAfter(cycleDaysSortedByDate[3])
    expect(days).toEqual([
      {
        date: '2018-05-03',
        bleeding: { value: 1 }
      }
    ])
  })

  test('returns empty when there are no bleeding days after', async () => {
    const cycleDaysSortedByDate = [
      {
        date: '2018-05-04'
      },
      {
        date: '2018-05-03'
      },
      {
        date: '2018-05-02'
      },
      {
        date: '2018-05-01',
        bleeding: { value: 1 }
      },
      {
        date: '2018-04-30'
      }
    ]
    const cycleMod = await cycleModule({
      cycleDaysSortedByDate,
      bleedingDaysSortedByDate: cycleDaysSortedByDate.filter(d => d.bleeding)
    })
    const { getMensesDaysRightAfter } = cycleMod
    const days = getMensesDaysRightAfter(cycleDaysSortedByDate[3])
    expect(days).toEqual([])
  })

  test('returns empty when there are no bleeding days within threshold', async () => {
    const cycleDaysSortedByDate = [
      {
        date: '2018-05-04',
        bleeding: { value: 1 }
      },
      {
        date: '2018-05-03'
      },
      {
        date: '2018-05-02'
      },
      {
        date: '2018-05-01',
        bleeding: { value: 1 }
      },
      {
        date: '2018-04-30'
      }
    ]
    const cycleMod = await cycleModule({
      cycleDaysSortedByDate,
      bleedingDaysSortedByDate: cycleDaysSortedByDate.filter(d => d.bleeding)
    })
    const { getMensesDaysRightAfter } = cycleMod
    const days = getMensesDaysRightAfter(cycleDaysSortedByDate[3])
    expect(days).toEqual([])
  })

  test('includes days within the treshold', async () => {
    const cycleDaysSortedByDate = [
      {
        date: '2018-05-04'
      },
      {
        date: '2018-05-05',
        bleeding: { value: 1 }
      },
      {
        date: '2018-05-03',
        bleeding: { value: 1 }
      },
      {
        date: '2018-05-01',
        bleeding: { value: 1 }
      },
      {
        date: '2018-04-30'
      }
    ]
    const cycleMod = await cycleModule({
      cycleDaysSortedByDate,
      bleedingDaysSortedByDate: cycleDaysSortedByDate.filter(d => d.bleeding)
    })
    const { getMensesDaysRightAfter } = cycleMod
    const days = getMensesDaysRightAfter(cycleDaysSortedByDate[3])
    expect(days).toEqual([
      {
        date: '2018-05-05',
        bleeding: { value: 1 }
      },
      {
        date: '2018-05-03',
        bleeding: { value: 1 }
      }
    ])
  })
  describe('with cycle thresholds', () => {
    const maxBreakInBleeding = 3

    test(
      'disregards bleeding breaks shorter than maxAllowedBleedingBreak in a bleeding period',
      async () => {
        const bleedingDays = [{
          date: '2018-05-14',
          bleeding: {
            value: 2
          }
        }, {
          date: '2018-05-10',
          bleeding: {
            value: 2
          }
        }]
        const cycleMod = await cycleModule({
          bleedingDaysSortedByDate: bleedingDays,
          maxBreakInBleeding
        })
        const getMensesDaysRightAfter = cycleMod.getMensesDaysRightAfter
        const result = getMensesDaysRightAfter(bleedingDays[1])
        expect(result).toEqual([bleedingDays[0]])
      }
    )

    test(
      'counts bleeding breaks longer than maxAllowedBleedingBreak in a bleeding period',
      async () => {
        const bleedingDays = [{
          date: '2018-05-14',
          bleeding: {
            value: 2
          }
        }, {
          date: '2018-05-09',
          bleeding: {
            value: 2
          }
        }]
        const cycleMod = await cycleModule({
          bleedingDaysSortedByDate: bleedingDays,
          maxBreakInBleeding
        })
        const getMensesDaysRightAfter = cycleMod.getMensesDaysRightAfter
        const result = getMensesDaysRightAfter(bleedingDays[1])
        expect(result).toEqual([])
      }
    )
  })
})
