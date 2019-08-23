'use strict'

const api = require('../api')

module.exports = {
  getRoundAnalysisData: _getAnalysisData,
  setRoundAnalysisData: _setAnalysisData,
  updateRoundAnalysisData: _putAnalysisData,
  deleteRoundAnalysisData: _deleteAnalysisData,
  getUsedRounds: _getUsedRounds
}

async function _getAnalysisData (id) {
  const paths = api.kursPmApi.paths
  // console.log('_getRoundData', paths)
  const client = api.kursPmApi.client
  const uri = client.resolve(paths.getCourseRoundAnalysisDataById.uri, { id: id })
  return client.getAsync({ uri: uri })
}

async function _setAnalysisData (id, sendObject) {
  const paths = api.kursPmApi.paths
  // console.log('_setRoundData', sendObject)
  const client = api.kursPmApi.client
  const uri = client.resolve(paths.postCourseRoundAnalysisDataById.uri, { id: id })
  return client.postAsync({ uri: uri, body: sendObject })
}

async function _putAnalysisData (id, sendObject) {
  const paths = api.kursPmApi.paths
  // console.log('_putRoundData', paths)
  const client = api.kursPmApi.client
  const uri = client.resolve(paths.putCourseRoundAnalysisDataById.uri, { id: id })
  return client.putAsync({ uri: uri, body: sendObject })
}

async function _deleteAnalysisData (id) {
  const paths = api.kursPmApi.paths
  const client = api.kursPmApi.client
  const uri = client.resolve(paths.deleteCourseRoundAnalysisDataById.uri, { id: id })
  return client.delAsync({ uri: uri })
}

async function _getUsedRounds (courseCode, semester) {
  try {
    const paths = api.kursPmApi.paths
    const client = api.kursPmApi.client
    const uri = client.resolve(paths.getUsedRounds.uri, { courseCode: courseCode, semester: semester })
    return await client.getAsync({ uri: uri })
  } catch (error) {
    return error
  }
}
