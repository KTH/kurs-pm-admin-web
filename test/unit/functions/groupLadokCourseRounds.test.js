const { groupLadokCourseRounds } = require('../../../common-context/createCommonContextFunctions')
const { ladokCourseRounds, groupedLadokCourseRounds } = require('../../mocks/mockLadokCourseRounds')

describe('roundIsNotOutdated', () => {
  it('should group Ladok course rounds and create an object with the same structure as the response from Kopps', () => {
    expect(groupLadokCourseRounds(ladokCourseRounds)).toEqual(groupedLadokCourseRounds)
  })
})
