'use strict'

const api = require('../api')

async function _getMemoData(id) {
  const { memoApi } = api
  const { paths, client } = memoApi
  const uri = client.resolve(paths.getCourseRoundMemoDataById.uri, { id })
  return client.getAsync({ uri })
}

async function _setMemoData(id, sendObject) {
  const { memoApi } = api
  const { paths, client } = memoApi
  const uri = client.resolve(paths.postCourseMemoData.uri, { id })
  return client.postAsync({ uri, body: sendObject })
}

async function _deleteMemoData(id) {
  const { memoApi } = api
  const { paths, client } = memoApi
  const uri = client.resolve(paths.deleteCourseRoundMemoDataById.uri, { id })
  return client.delAsync({ uri })
}

async function _getUsedRounds(courseCode, semester) {
  try {
    const { memoApi } = api
    const { paths, client } = memoApi
    const uri = client.resolve(paths.getUsedRounds.uri, { courseCode, semester })
    return await client.getAsync({ uri })
  } catch (error) {
    return error
  }
}

module.exports = {
  getMemoData: _getMemoData,
  setMemoData: _setMemoData,
  deleteMemoData: _deleteMemoData,
  getUsedRounds: _getUsedRounds,
}
