const { BlobServiceClient } = require('@azure/storage-blob')

const serverConfig = require('./configuration').server
const log = require('@kth/log')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const STORAGE_CONTAINER_NAME = serverConfig.fileStorage.kursPMStorage.containerName

const BLOB_SERVICE_SAS_URL = serverConfig.fileStorage.kursPMStorage.blobServiceSasUrl

const blobServiceClient = new BlobServiceClient(BLOB_SERVICE_SAS_URL)

/* --- creates an unique id for uploaded file */
const createID = () => {
  return 'x4xxxyxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

const getTodayDate = (fileDate = true) => {
  const today = new Date()
  const dd = String(today.getDate()).padStart(2, '0')
  const mm = String(today.getMonth() + 1).padStart(2, '0') // January is 0!
  const yyyy = today.getFullYear()
  const hh = today.getHours()
  const min = today.getMinutes()

  return fileDate ? yyyy + mm + dd + '-' + hh + '-' + min : yyyy + mm + dd + '-' + hh + ':' + min
}
//* ****************************Upload data to blob storage******************************************* */

async function uploadBlob(blobName, content, fileType, metadata = {}) {
  try {
    const containerClient = blobServiceClient.getContainerClient(STORAGE_CONTAINER_NAME)
    const blockBlobClient = containerClient.getBlockBlobClient(blobName)
    const uploadBlobResponse = await blockBlobClient.upload(content, content.length)
    log.debug(`Blobstorage - Upload blob ${blobName} `)

    await blockBlobClient.setHTTPHeaders({ blobContentType: fileType })
    metadata.date = getTodayDate(false)
    await blockBlobClient.setMetadata(metadata)
    log.debug(`Blobstorage - Blob has been uplaoded:  ${blobName} `)
    return uploadBlobResponse
  } catch (error) {
    log.error('Error when uploading file in blobStorage: ' + blobName, { error })
    return error
  }
}

async function runBlobStorage(file, semester, courseCode, rounds, metadata) {
  const content = file.data
  const fileType = file.mimetype
  const newId = createID()
  const blobName = `memo-${courseCode}${semester}-${newId}.pdf`
  log.info(' Blobstorage - uploaded file ', file)
  const uploadResponse = await uploadBlob(blobName, content, fileType, metadata)
  log.info(' Blobstorage - uploaded file response ', uploadResponse)
  // TODO: ADD ERROR IF NO UPLOADRESPONSE
  return blobName
}

async function updateMetaData(blobName, metadata) {
  const containerClient = blobServiceClient.getContainerClient(STORAGE_CONTAINER_NAME)
  const blockBlobClient = containerClient.getBlockBlobClient(blobName)

  metadata.date = getTodayDate(false)

  log.info(`Update metadata for ${blobName}`)
  try {
    const response = await blockBlobClient.setMetadata(metadata)
    return response
  } catch (error) {
    log.error('Error in update metadata in blobstorage: ' + blobName, { error })
    return error
  }
}

async function deleteBlob(fileName) {
  log.debug(`Blobstorage - Delete file: ${fileName}`)
  try {
    const containerClient = blobServiceClient.getContainerClient(STORAGE_CONTAINER_NAME)
    const blockBlobClient = containerClient.getBlockBlobClient(fileName)
    const responseDelete = await blockBlobClient.delete()

    log.debug(responseDelete.length + ' file(s) deleted from blobstorage with file name: ' + fileName, responseDelete)
    return responseDelete
  } catch (error) {
    log.error('Error in deleting blob ', { error })
    return error
  }
}

module.exports = {
  runBlobStorage,
  updateMetaData,
  deleteBlob,
}
