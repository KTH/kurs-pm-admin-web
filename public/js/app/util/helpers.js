'use strict'

import i18n from '../../../../i18n/index'

const formatToLocaleDate = date => {
  if (date === '') return null
  const timestamp = Date.parse(date)
  const parsedDate = new Date(timestamp)
  const options = { day: 'numeric', month: 'short', year: 'numeric' }
  const languageTag = 'en-GB'

  return parsedDate.toLocaleDateString(languageTag, options)
}

const getDateFormat = (date, language) => {
  if (language === 'Svenska' || language === 'Engelska' || language === 1 || language === 'sv') {
    return date
  }
  return formatToLocaleDate(date)
}

const getTodayDate = (date = '') => {
  const today = date.length > 0 ? new Date(date) : new Date()
  const dd = String(today.getDate()).padStart(2, '0')
  const mm = String(today.getMonth() + 1).padStart(2, '0') // January is 0!
  const yyyy = today.getFullYear()

  return yyyy + '-' + mm + '-' + dd
}

const formatDate = (date, lang) => {
  const thisDate = getTodayDate(date)
  return getDateFormat(thisDate, lang)
}

const isValidDate = date => {
  const dateFormat = /^\d{4}-\d{2}-\d{2}$/
  const regex = new RegExp(dateFormat)
  return regex.test(date)
}

const formatRoundName = (language, shortName, semester, roundId) => {
  const translate = i18n.messages[language].messages
  return shortName
    ? shortName + ' '
    : `${translate.course_short_semester[semester.toString().match(/.{1,4}/g)[1]]}${
        semester.toString().match(/.{1,4}/g)[0]
      }-${roundId}`
}

export { formatDate, getTodayDate, getDateFormat, isValidDate, formatRoundName }
