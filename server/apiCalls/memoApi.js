'use strict'

const api = require('../api')

module.exports = {
  getMemoData: _getMemoData,
  setMemoData: _setMemoData,
  updateMemoData: _putMemoData,
  getUsedRounds: _getUsedRounds
}

async function _getMemoData(id) {
  const paths = api.memoApi.paths
  // console.log('_getRoundData', paths)
  const client = api.memoApi.client
  const uri = client.resolve(paths.getCourseRoundMemoDataById.uri, { id: id })
  return client.getAsync({ uri: uri })
}

async function _setMemoData(id, sendObject) {
  const paths = api.memoApi.paths
  // console.log('_setRoundData', sendObject)
  const client = api.memoApi.client
  const uri = client.resolve(paths.postCourseMemoData.uri, { id: id })
  return client.postAsync({ uri: uri, body: sendObject })
}

async function _putMemoData(id, sendObject) {
  const paths = api.memoApi.paths
  // console.log('_putRoundData', paths)
  const client = api.memoApi.client
  const uri = client.resolve(paths.putCourseRoundMemoDataById.uri, { id: id })
  return client.putAsync({ uri: uri, body: sendObject })
}

async function _getUsedRounds(courseCode, semester) {
  try {
    const paths = api.memoApi.paths
    const client = api.memoApi.client
    const uri = client.resolve(paths.getUsedRounds.uri, {
      courseCode: courseCode,
      semester: semester
    })
    return await client.getAsync({ uri: uri })
  } catch (error) {
    return error
  }
}
