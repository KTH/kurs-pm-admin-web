const i18n = require('../../../../i18n')

const convertLangToIndex = langShortName => (langShortName === 'en' ? 0 : 1)

const seasonStr = (language, semesterRaw) => {
  if (!semesterRaw) return ''
  const isLangANumber = typeof language === 'number'
  const langIndex = isLangANumber ? language : convertLangToIndex(language)
  const { course_short_semester } = i18n.messages[langIndex].messages
  const termStringAsSeason = `${course_short_semester[semesterRaw.toString()[4]]}${semesterRaw.toString().slice(0, 4)}`

  return termStringAsSeason
}

export { convertLangToIndex, seasonStr }
