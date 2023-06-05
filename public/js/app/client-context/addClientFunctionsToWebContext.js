/* eslint no-use-before-define: ["error", "nofunc"] */

// @ts-check

// eslint-disable-next-line no-unused-vars
import axios from 'axios'
import { createCommonContextFunctions } from '../../../../common-context/createCommonContextFunctions'
import { HTTP_CODE_400, getResponseMessage } from '../../../../common/ErrorUtils'

/** ***************************************************************************************************************************************** */
/*                                                       FILE STORAGE ACTIONS                                                      */
/** ***************************************************************************************************************************************** */
function updateFileInStorage(fileName, metadata) {
  return axios
    .post(this.buildApiUrl(this.paths.storage.updateFile.uri, { fileName }), { params: { metadata } })
    .then(({ status, statusText, data }) => {
      if (status >= HTTP_CODE_400) {
        return 'ERROR-' + statusText
      }
      return data
    })
    .catch(err => {
      if (err.response) {
        throw new Error(err.message)
      }
      throw err
    })
}

function deleteFileInStorage(fileName) {
  return axios
    .delete(this.buildApiUrl(this.paths.storage.deleteFile.uri, { fileName }))
    .then(({ status, statusText, data }) => {
      if (status >= HTTP_CODE_400) {
        return 'ERROR-' + statusText
      }
      return data
    })
}

/** ***************************************************************************************************************************************** */
/*                                               MEMO ACTIONS (PM - API)                                                      */
/** ***************************************************************************************************************************************** */

function postMemoData(postObject, fileName, uploadDate) {
  for (let index = 0; index < postObject.length; index++) {
    postObject[index].courseMemoFileName = fileName
    postObject[index].pdfMemoUploadDate = uploadDate
  }
  return axios
    .post(this.buildApiUrl(this.paths.api.memoPost.uri, { id: 'default' }), { params: JSON.stringify(postObject) })
    .then(({ data }) => data)
    .catch(err => {
      if (err.response) {
        if (err.response.data) {
          this.errorMessage = getResponseMessage(err.response.data)
          return err.response.data
        }
        this.errorMessage = err.message
      }
      throw err
    })
}

function getUsedRounds(courseCode, semester) {
  this.courseCode = courseCode
  return axios
    .get(this.buildApiUrl(this.paths.api.memoGetUsedRounds.uri, { courseCode, semester }))
    .then(({ status, data }) => {
      if (status >= HTTP_CODE_400) {
        return 'ERROR-' + status
      }
      return (this.usedRounds = data)
    })
    .catch(err => {
      if (err.response) {
        throw new Error(err.message)
      }
      throw err
    })
}
/** ***************************************************************************************************************************************** */
/*                                             GET COURSE INFORMATION ACTION (KOPPS - API)                                                    */
/** ***************************************************************************************************************************************** */
function getCourseInformation(courseCode, userName, lang = 'sv') {
  this.courseCode = courseCode
  return axios
    .get(this.buildApiUrl(this.paths.api.koppsCourseData.uri, { courseCode, language: lang }))
    .then(({ status, statusText, data }) => {
      if (status >= HTTP_CODE_400) {
        this.errorMessage = statusText
        return 'ERROR-' + status
      }
      this.handleCourseData(data, courseCode, userName, lang)
      return data
    })
    .catch(err => {
      if (err.response) {
        throw new Error(err.message)
      }
      throw err
    })
}

function createMemoData(semester, rounds) {
  // Creates a list with memo object with information from selected rounds
  this.status = 'new'
  this.newMemoList = []
  this.activeSemester = semester

  for (let round = 0; round < rounds.length; round++) {
    const id = `${this.courseData.courseCode}_${semester}_${rounds[round]}`
    const newMemo = {
      _id: id,
      courseMemoFileName: '',
      changedBy: this.username,
      courseCode: this.courseData.courseCode,
      pdfMemoUploadDate: '',
      semester,
      applicationCode: rounds[round],
    }
    this.newMemoList.push(newMemo)
  }
  return this.newMemoList
}

function addClientFunctionsToWebContext() {
  const functions = {
    createMemoData,
    deleteFileInStorage,
    getCourseInformation,
    getUsedRounds,
    postMemoData,
    updateFileInStorage,
    ...createCommonContextFunctions(),
  }
  return functions
}

export { addClientFunctionsToWebContext }
