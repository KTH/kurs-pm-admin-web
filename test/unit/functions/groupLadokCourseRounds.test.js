const { groupLadokCourseRounds } = require('../../../common-context/createCommonContextFunctions')
const { ladokCourseRounds, groupedLadokCourseRounds } = require('../../mocks/mockLadokCourseRounds')

describe('test ladok course rounds grouping logic', () => {
  it('should group Ladok course rounds and create an object with the same structure as the response from Kopps', () => {
    expect(groupLadokCourseRounds(ladokCourseRounds)).toEqual(groupedLadokCourseRounds)
  })
  it('should return an empty array if the input is an empty array', () => {
    expect(groupLadokCourseRounds([])).toEqual([])
  })
})
