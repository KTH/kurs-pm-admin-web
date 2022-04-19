'use strict'

const api = require('../api')

module.exports = {
  getMemoData: _getMemoData,
  setMemoData: _setMemoData,
  deleteMemoData: _deleteMemoData,
  getUsedRounds: _getUsedRounds,
}

async function _getMemoData(id) {
  const paths = api.memoApi.paths
  // console.log('_getRoundData', paths)
  const client = api.memoApi.client
  const uri = client.resolve(paths.getCourseRoundMemoDataById.uri, { id })
  return client.getAsync({ uri })
}

async function _setMemoData(id, sendObject) {
  const paths = api.memoApi.paths
  // console.log('_setRoundData', sendObject)
  const client = api.memoApi.client
  const uri = client.resolve(paths.postCourseMemoData.uri, { id })
  return client.postAsync({ uri, body: sendObject })
}

async function _deleteMemoData(id) {
  const paths = api.memoApi.paths
  const client = api.memoApi.client
  const uri = client.resolve(paths.deleteCourseRoundMemoDataById.uri, { id })
  return client.delAsync({ uri })
}

async function _getUsedRounds(courseCode, semester) {
  try {
    const paths = api.memoApi.paths
    const client = api.memoApi.client
    const uri = client.resolve(paths.getUsedRounds.uri, { courseCode, semester })
    return await client.getAsync({ uri })
  } catch (error) {
    return error
  }
}
