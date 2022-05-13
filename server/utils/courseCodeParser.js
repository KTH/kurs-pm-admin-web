const courseCodeMaxLength = 7

function parseCourseCode(courseCodeOrMemoId) {
  if (courseCodeOrMemoId.length <= courseCodeMaxLength) return courseCodeOrMemoId

  // SK2560VT2016_1
  const [courseCodeAndSemester] = courseCodeOrMemoId.split('_')
  const semesterStrLength = -6
  const courseCode = courseCodeAndSemester.slice(0, semesterStrLength)
  return courseCode
}

function parseCourseCodeAndRounds(courseCodeOrMemoId) {
  if (courseCodeOrMemoId.length <= courseCodeMaxLength)
    return { courseCode: courseCodeOrMemoId.toUpperCase(), rounds: [] }

  const courseCode = parseCourseCode(courseCodeOrMemoId)
  const [, rounds] = courseCodeOrMemoId.split('_')

  return { courseCode, rounds }
}

module.exports = { parseCourseCode, parseCourseCodeAndRounds }
