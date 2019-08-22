import assert from 'assert'
import legacyParseMap from '.'

describe('legacyParseMap', () => {
  it('parses all strings in the array with legacyParse', () => {
    const result = legacyParseMap(['2014-01-01', '2015-01-01', '2016-01-01'])
    assert.deepEqual(result, [
      new Date(2014, 0, 1),
      new Date(2015, 0, 1),
      new Date(2016, 0, 1)
    ])
  })
})
