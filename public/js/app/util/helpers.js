'use strict'

import i18n from '../../../../i18n/index'

const getDateFormat = (date, language) => {
  if (language === 'Svenska' || language === 'Engelska' || language === 1 || language === 'sv') {
    return date
  }
  const splitDate = date.split('-')
  return `${splitDate[2]}/${splitDate[1]}/${splitDate[0]}`
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

const noAccessToRoundsList = (memberOf, rounds, courseCode, semester) => {
  let roundIds = []
  if (memberOf.toString().indexOf(courseCode + '.examiner') > 0) {
    return roundIds
  }
  roundIds = rounds.filter(round => {
    if (memberOf.toString().indexOf(`${courseCode}.${semester}.${round.roundId}.courseresponsible`) < 0) {
      return round.roundId
    }
  })
  return roundIds
}

const getValueFromObjectList = (objectList, value, key, returnKey) => {
  let object
  for (let index = 0; index < objectList.length; index++) {
    object = objectList[index]
    if (object[key] === value) {
      return object[returnKey]
    }
  }
  return null
}

const formatRoundName = (language, shortName, semester, roundId) => {
  const translate = i18n.messages[language].messages
  return shortName
    ? shortName + ' '
    : `${translate.course_short_semester[semester.toString().match(/.{1,4}/g)[1]]}${
        semester.toString().match(/.{1,4}/g)[0]
      }-${roundId}`
}

export {
  noAccessToRoundsList,
  formatDate,
  getTodayDate,
  getDateFormat,
  getValueFromObjectList,
  isValidDate,
  formatRoundName,
}
