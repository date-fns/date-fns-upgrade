import assert from 'assert'
import legacyParse from '.'

describe('parse', () => {
  describe('date argument', () => {
    it('returns a clone of the given date', () => {
      const date = new Date(2016, 0, 1)
      const dateClone = legacyParse(date)
      dateClone.setFullYear(2015)
      assert.deepEqual(date, new Date(2016, 0, 1))
    })
  })

  describe('timestamp argument', () => {
    it('creates a date from the timestamp', () => {
      const timestamp = new Date(2016, 0, 1, 23, 30, 45, 123).getTime()
      const result = legacyParse(timestamp)
      assert.deepEqual(result, new Date(2016, 0, 1, 23, 30, 45, 123))
    })
  })

  describe('string argument', () => {
    describe('centuries', () => {
      it('parses YY', () => {
        const result = legacyParse('20')
        assert.deepEqual(result, new Date(2000, 0 /* Jan */, 1))
      })
    })

    describe('years', () => {
      it('parses YYYY', () => {
        const result = legacyParse('2014')
        assert.deepEqual(result, new Date(2014, 0 /* Jan */, 1))
      })
    })

    describe('months', () => {
      it('parses YYYY-MM', () => {
        const result = legacyParse('2014-02')
        assert.deepEqual(result, new Date(2014, 1 /* Feb */, 1))
      })
    })

    describe('weeks', () => {
      it('parses YYYY-Www', () => {
        const result = legacyParse('2014-W02')
        assert.deepEqual(result, new Date(2014, 0 /* Jan */, 6))
      })

      it('parses YYYYWww', () => {
        const result = legacyParse('2014W02')
        assert.deepEqual(result, new Date(2014, 0 /* Jan */, 6))
      })
    })

    describe('calendar dates', () => {
      it('parses YYYY-MM-DD', () => {
        const result = legacyParse('2014-02-11')
        assert.deepEqual(result, new Date(2014, 1, /* Feb */ 11))
      })

      it('parses YYYYMMDD', () => {
        const result = legacyParse('20140211')
        assert.deepEqual(result, new Date(2014, 1 /* Feb */, 11))
      })
    })

    describe('week dates', () => {
      it('parses YYYY-Www-D', () => {
        const result = legacyParse('2014-W02-7')
        assert.deepEqual(result, new Date(2014, 0 /* Jan */, 12))
      })

      it('parses YYYYWwwD', () => {
        const result = legacyParse('2014W027')
        assert.deepEqual(result, new Date(2014, 0 /* Jan */, 12))
      })

      it('correctly handles years in which 4 January is Sunday', () => {
        const result = legacyParse('2009-W01-1')
        assert.deepEqual(result, new Date(2008, 11 /* Dec */, 29))
      })
    })

    describe('ordinal dates', () => {
      it('parses YYYY-DDD', () => {
        const result = legacyParse('2014-026')
        assert.deepEqual(result, new Date(2014, 0 /* Jan */, 26))
      })

      it('parses YYYYDDD', () => {
        const result = legacyParse('2014026')
        assert.deepEqual(result, new Date(2014, 0 /* Jan */, 26))
      })
    })

    describe('date and time combined', () => {
      it('parses YYYY-MM-DDThh:mm', () => {
        const result = legacyParse('2014-02-11T11:30')
        assert.deepEqual(result, new Date(2014, 1 /* Feb */, 11, 11, 30))
      })

      it('parses YYYY-MM-DDThhmm', () => {
        const result = legacyParse('2014-02-11T1130')
        assert.deepEqual(result, new Date(2014, 1 /* Feb */, 11, 11, 30))
      })

      it('parses 24:00 as midnight', () => {
        const result = legacyParse('2014-02-11T2400')
        assert.deepEqual(result, new Date(2014, 1 /* Feb */, 11, 0, 0))
      })
    })

    describe('extended century representation', () => {
      it('parses century 101 BC - 2 BC', () => {
        const result = legacyParse('-0001')
        const date = new Date(-100, 0 /* Jan */, 1)
        date.setFullYear(-100)
        assert.deepEqual(result, date)
      })

      it('parses century 1 BC - 99 AD', () => {
        const result = legacyParse('00')
        const date = new Date(0, 0 /* Jan */, 1)
        date.setFullYear(0)
        assert.deepEqual(result, date)
      })

      it('parses centruries after 9999 AD', () => {
        const result = legacyParse('+0123')
        assert.deepEqual(result, new Date(12300, 0 /* Jan */, 1))
      })

      it('allows to specify the number of additional digits', () => {
        const result = legacyParse('-20', { additionalDigits: 0 })
        const date = new Date(-2000, 0 /* Jan */, 1)
        date.setFullYear(-2000)
        assert.deepEqual(result, date)
      })
    })

    describe('extended year representation', () => {
      it('correctly parses years from 1 AD to 99 AD', () => {
        const result = legacyParse('0095-07-02')
        const date = new Date(0, 6 /* Jul */, 2)
        date.setFullYear(95)
        assert.deepEqual(result, date)
      })

      it('parses years after 9999 AD', () => {
        const result = legacyParse('+012345-07-02')
        assert.deepEqual(result, new Date(12345, 6 /* Jul */, 2))
      })

      it('allows to specify the number of additional digits', () => {
        const result = legacyParse('+12340702', { additionalDigits: 0 })
        assert.deepEqual(result, new Date(1234, 6 /* Jul */, 2))
      })

      it('parses year 1 BC', () => {
        const result = legacyParse('0000-07-02')
        const date = new Date(0, 6 /* Jul */, 2)
        date.setFullYear(0)
        assert.deepEqual(result, date)
      })

      it('parses years less than 1 BC', () => {
        const result = legacyParse('-000001-07-02')
        const date = new Date(0, 6 /* Jul */, 2)
        date.setFullYear(-1)
        assert.deepEqual(result, date)
      })
    })

    describe('float time', () => {
      it('parses float hours', () => {
        const result = legacyParse('2014-02-11T11.5')
        assert.deepEqual(result, new Date(2014, 1 /* Feb */, 11, 11, 30))
      })

      it('parses float minutes', () => {
        const result = legacyParse('2014-02-11T11:30.5')
        assert.deepEqual(result, new Date(2014, 1 /* Feb */, 11, 11, 30, 30))
      })

      it('parses float seconds', () => {
        const result = legacyParse('2014-02-11T11:30:30.768')
        assert.deepEqual(
          result,
          new Date(2014, 1 /* Feb */, 11, 11, 30, 30, 768)
        )
      })

      it('parses , as decimal mark', () => {
        const result = legacyParse('2014-02-11T11,5')
        assert.deepEqual(result, new Date(2014, 1 /* Feb */, 11, 11, 30))
      })
    })

    describe('timezones', () => {
      describe('when the date and the time are specified', () => {
        it('parses Z', () => {
          const result = legacyParse('2014-10-25T06:46:20Z')
          assert.deepEqual(result, new Date('2014-10-25T13:46:20+07:00'))
        })

        it('parses ±hh:mm', () => {
          const result = legacyParse('2014-10-25T13:46:20+07:00')
          assert.deepEqual(result, new Date('2014-10-25T13:46:20+07:00'))
        })

        it('parses ±hhmm', () => {
          const result = legacyParse('2014-10-25T03:46:20-0300')
          assert.deepEqual(result, new Date('2014-10-25T13:46:20+07:00'))
        })

        it('parses ±hh', () => {
          const result = legacyParse('2014-10-25T13:46:20+07')
          assert.deepEqual(result, new Date('2014-10-25T13:46:20+07:00'))
        })
      })
    })
  })

  it('implicitly converts options', () => {
    // $ExpectedMistake
    const result = legacyParse('+12340702', { additionalDigits: '0' })
    assert.deepEqual(result, new Date(1234, 6 /* Jul */, 2))
  })

  describe('failure', () => {
    it('the fallback to `new Date` if the string is not an ISO formatted date', () => {
      const result = legacyParse(new Date(2014, 8 /* Sep */, 1, 11).toString())
      assert.deepEqual(result, new Date(2014, 8 /* Sep */, 1, 11))
    })
  })

  describe('invalid argument', () => {
    it('returns Invalid Date if argument is non-date string', () => {
      const result = legacyParse('abc')
      assert(result instanceof Date)
      assert(isNaN(result.getTime()))
    })

    it('returns Invalid Date if argument is NaN', () => {
      const result = legacyParse(NaN)
      assert(result instanceof Date)
      assert(isNaN(result.getTime()))
    })

    it('returns Invalid Date if argument is Invalid Date', () => {
      const result = legacyParse(new Date(NaN))
      assert(result instanceof Date)
      assert(isNaN(result.getTime()))
    })
  })
})
