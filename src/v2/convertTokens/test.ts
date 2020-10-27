import assert from 'assert'
import { format } from 'date-fns'
import { convertTokens } from '.'

describe('format', () => {
  describe('v1 format tests', () => {
    let defaultDate: Date
    let timezone: string
    let timezoneShort: string
    let timestamp: string
    let secondsTimestamp: string

    beforeEach(() => {
      defaultDate = new Date(1986, 3 /* Apr */, 4, 10, 32, 0, 900)

      const offset = defaultDate.getTimezoneOffset()
      const absoluteOffset = Math.abs(offset)
      const hours = Math.floor(absoluteOffset / 60)
      const hoursLeadingZero = hours < 10 ? '0' : ''
      const minutes = absoluteOffset % 60
      const minutesLeadingZero = minutes < 10 ? '0' : ''
      const sign = offset > 0 ? '-' : '+'
      timezone =
        sign + hoursLeadingZero + hours + ':' + minutesLeadingZero + minutes
      timezoneShort = timezone.replace(':', '')

      timestamp = defaultDate.getTime().toString()
      secondsTimestamp = Math.floor(defaultDate.getTime() / 1000).toString()
    })

    it('escapes characters between the square brackets', () => {
      const result = format(
        defaultDate,
        convertTokens('[YYYY-]MM-DD[THH:mm:ss.SSSZ] YYYY-[MM-DD]')
      )
      assert(result === 'YYYY-04-04THH:mm:ss.SSSZ 1986-MM-DD')
    })

    describe('ordinal numbers', () => {
      it('an ordinal day of an ordinal month', () => {
        const result = format(
          defaultDate,
          convertTokens('Do of t[h][e] Mo in YYYY')
        )
        assert(result === '4th of the 4th in 1986')
      })

      it('should return a correct ordinal number', () => {
        const result = []
        for (let i = 1; i <= 28; i++) {
          result.push(format(new Date(2015, 1, i), convertTokens('Do')))
        }
        const expected = [
          '1st',
          '2nd',
          '3rd',
          '4th',
          '5th',
          '6th',
          '7th',
          '8th',
          '9th',
          '10th',
          '11th',
          '12th',
          '13th',
          '14th',
          '15th',
          '16th',
          '17th',
          '18th',
          '19th',
          '20th',
          '21st',
          '22nd',
          '23rd',
          '24th',
          '25th',
          '26th',
          '27th',
          '28th'
        ]
        assert.deepEqual(result, expected)
      })
    })

    describe('months', () => {
      it('a cardinal number', () => {
        assert(format(defaultDate, convertTokens('M')) === '4')
      })

      it('a cardinal number with a leading zero', () => {
        assert(format(defaultDate, convertTokens('MM')) === '04')
      })

      it('an ordinal number', () => {
        assert(format(defaultDate, convertTokens('Mo')) === '4th')
      })

      it('a short name', () => {
        assert(format(defaultDate, convertTokens('MMM')) === 'Apr')
      })

      it('a full name', () => {
        assert(format(defaultDate, convertTokens('MMMM')) === 'April')
      })

      it('all variants', () => {
        const date = format(defaultDate, convertTokens('M Mo MM MMM MMMM'))
        assert(date === '4 4th 04 Apr April')
      })
    })

    describe('quarters', () => {
      it('returns a correct quarter', () => {
        const result = []
        for (let i = 0; i <= 11; i++) {
          result.push(format(new Date(1986, i, 1), convertTokens('Q')))
        }
        const expected = [
          '1',
          '1',
          '1',
          '2',
          '2',
          '2',
          '3',
          '3',
          '3',
          '4',
          '4',
          '4'
        ]
        assert.deepEqual(result, expected)
      })

      it('all variants', () => {
        assert(format(defaultDate, convertTokens('Q Qo')) === '2 2nd')
      })
    })

    describe('days of a month', () => {
      it('all variants', () => {
        assert(format(defaultDate, convertTokens('D Do DD')) === '4 4th 04')
      })
    })

    describe('days of a year', () => {
      describe('for the first day of a year', () => {
        it('returns a correct day number', () => {
          const result = format(
            new Date(1992, 0 /* Jan */, 1),
            convertTokens('DDD'),
            { useAdditionalDayOfYearTokens: true }
          )
          assert(result === '1')
        })
      })

      describe('for the last day of a common year', () => {
        it('returns a correct day number', () => {
          const result = format(
            new Date(1986, 11 /* Dec */, 31, 23, 59, 59, 999),
            convertTokens('DDD'),
            { useAdditionalDayOfYearTokens: true }
          )
          assert(result === '365')
        })
      })

      describe('for the last day of a leap year', () => {
        it('returns a correct day number', () => {
          const result = format(
            new Date(1992, 11 /* Dec */, 31, 23, 59, 59, 999),
            convertTokens('DDD'),
            { useAdditionalDayOfYearTokens: true }
          )
          assert(result === '366')
        })
      })

      it('an ordinal number', () => {
        const result = format(
          new Date(1992, 0 /* Jan */, 1),
          convertTokens('DDDo'),
          { useAdditionalDayOfYearTokens: true }
        )
        assert(result === '1st')
      })

      it('a cardinal number with leading zeros', () => {
        const result = format(
          new Date(1992, 0 /* Jan */, 1),
          convertTokens('DDDD'),
          { useAdditionalDayOfYearTokens: true }
        )
        assert(result === '001')
      })
    })

    describe('days of a week', () => {
      it('all variants', () => {
        const result = format(defaultDate, convertTokens('d do dd ddd dddd'))
        assert(result === '5 5th Fr Fri Friday')
      })
    })

    describe('days of an ISO week', () => {
      it('returns a correct day of an ISO week', () => {
        const result = []
        for (let i = 1; i <= 7; i++) {
          result.push(
            format(new Date(1986, 8 /* Sep */, i), convertTokens('E'))
          )
        }
        const expected = ['1', '2', '3', '4', '5', '6', '7']
        assert.deepEqual(result, expected)
      })
    })

    describe('ISO weeks', () => {
      it('a cardinal number with a leading zero', () => {
        const result = format(
          new Date(1992, 0 /* Jan */, 5),
          convertTokens('WW')
        )
        assert(result === '01')
      })

      it('all variants', () => {
        const result = format(defaultDate, convertTokens('W Wo WW'))
        assert(result === '14 14th 14')
      })
    })

    describe('years', () => {
      it('all variants', () => {
        const result = format(defaultDate, convertTokens('YY YYYY'))
        assert(result === '86 1986')
      })

      it('years less than 100', () => {
        const date = new Date(1, 1, 1)
        date.setFullYear(1)
        const result = format(date, convertTokens('YY YYYY'))
        assert(result === '01 0001')
      })
    })

    describe('ISO week-numbering years', () => {
      it('the first week of the next year', () => {
        const result = format(
          new Date(2013, 11 /* Dec */, 30),
          convertTokens('GGGG')
        )
        assert(result === '2014')
      })

      it('the last week of the previous year', () => {
        const result = format(
          new Date(2016, 0 /* Jan */, 1),
          convertTokens('GGGG')
        )
        assert(result === '2015')
      })
    })

    describe('hours and am/pm', () => {
      it('12 am', () => {
        const date = new Date(1986, 3 /* Apr */, 6, 0, 0, 0, 900)
        assert(format(date, convertTokens('h:mm a')) === '12:00 am')
      })

      it('12 a.m.', () => {
        const date = new Date(1986, 3 /* Apr */, 6, 0, 0, 0, 900)
        assert(format(date, convertTokens('h:mm aa')) === '12:00 a.m.')
      })

      it('12 p.m.', () => {
        const date = new Date(1986, 3 /* Apr */, 4, 12, 0, 0, 900)
        assert(format(date, convertTokens('hh:mm aa')) === '12:00 p.m.')
      })

      it('12PM', () => {
        const date = new Date(1986, 3 /* Apr */, 4, 12, 0, 0, 900)
        assert(format(date, convertTokens('hh:mmA')) === '12:00PM')
      })

      it('cardinal numbers with leading zeros', () => {
        const date = new Date(1986, 3 /* Apr */, 4, 5, 0, 0, 900)
        assert(format(date, convertTokens('HH hh')) === '05 05')
      })

      it('all hour variants', () => {
        assert(
          format(defaultDate, convertTokens('H HH h hh')) === '10 10 10 10'
        )
      })
    })

    describe('minutes', () => {
      it('a cardinal number with a leading zero', () => {
        const date = new Date(1986, 3 /* Apr */, 4, 12, 0, 0, 900)
        assert(format(date, convertTokens('mm')) === '00')
      })

      it('all variants', () => {
        assert(format(defaultDate, convertTokens('m mm')) === '32 32')
      })
    })

    describe('seconds', () => {
      it('all variants', () => {
        assert(format(defaultDate, convertTokens('s ss')) === '0 00')
      })
    })

    describe('fractions of a second', () => {
      it('1/10 of a second', () => {
        let date = new Date(1986, 3 /* Apr */, 4, 12, 0, 0, 859)
        assert(format(date, convertTokens('S')) === '8')
        date = new Date(1986, 3 /* Apr */, 4, 12, 0, 0, 0)
        assert(format(date, convertTokens('S')) === '0')
        date = new Date(1986, 3 /* Apr */, 4, 12, 0, 0, 1)
        assert(format(date, convertTokens('S')) === '0')
        date = new Date(1986, 3 /* Apr */, 4, 12, 0, 0, 10)
        assert(format(date, convertTokens('S')) === '0')
        date = new Date(1986, 3 /* Apr */, 4, 12, 0, 0, 100)
        assert(format(date, convertTokens('S')) === '1')
      })

      it('1/100 of a second', () => {
        let date = new Date(1986, 3 /* Apr */, 4, 12, 0, 0, 859)
        assert(format(date, convertTokens('SS')) === '85')
        date = new Date(1986, 3 /* Apr */, 4, 12, 0, 0, 0)
        assert(format(date, convertTokens('SS')) === '00')
        date = new Date(1986, 3 /* Apr */, 4, 12, 0, 0, 1)
        assert(format(date, convertTokens('SS')) === '00')
        date = new Date(1986, 3 /* Apr */, 4, 12, 0, 0, 10)
        assert(format(date, convertTokens('SS')) === '01')
        date = new Date(1986, 3 /* Apr */, 4, 12, 0, 0, 42)
        assert(format(date, convertTokens('SS')) === '04')
      })

      it('a millisecond', () => {
        let date = new Date(1986, 3 /* Apr */, 4, 12, 0, 0, 859)
        assert(format(date, convertTokens('SSS')) === '859')
        date = new Date(1986, 3 /* Apr */, 4, 12, 0, 0, 0)
        assert(format(date, convertTokens('SSS')) === '000')
        date = new Date(1986, 3 /* Apr */, 4, 12, 0, 0, 1)
        assert(format(date, convertTokens('SSS')) === '001')
        date = new Date(1986, 3 /* Apr */, 4, 12, 0, 0, 10)
        assert(format(date, convertTokens('SSS')) === '010')
        date = new Date(1986, 3 /* Apr */, 4, 12, 0, 0, 42)
        assert(format(date, convertTokens('SSS')) === '042')
      })
    })

    describe('timezones', () => {
      it('all variants', () => {
        const result = format(defaultDate, convertTokens('Z ZZ'))
        assert(result === timezone + ' ' + timezoneShort)
      })
    })

    describe('timestamps', () => {
      it('a unix seconds timestamp', () => {
        assert(format(defaultDate, convertTokens('X')) === secondsTimestamp)
      })

      it('a unix milliseconds timestamp', () => {
        assert(format(defaultDate, convertTokens('x')) === timestamp)
      })
    })
  })
})
