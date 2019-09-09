
const {
  Aborter,
  BlockBlobURL,
  ContainerURL,
  ServiceURL,
  SharedKeyCredential,
  StorageURL,
  BlobURL
} = require('@azure/storage-blob')

const serverConfig = require('./configuration').server
const log = require('kth-node-log')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

module.exports = {
  runBlobStorage: runBlobStorage,
  updateMetaData: updateMetaData,
  deleteBlob: deleteBlob
}

const STORAGE_ACCOUNT_NAME = serverConfig.fileStorage.kursPMStorage.account
const ACCOUNT_ACCESS_KEY = serverConfig.fileStorage.kursPMStorage.accountKey
const containerName = serverConfig.fileStorage.kursPMStorage.storageContainer

const ONE_MEGABYTE = 1024 * 1024
const FOUR_MEGABYTES = 4 * ONE_MEGABYTE
const ONE_MINUTE = 60 * 1000

const credentials = new SharedKeyCredential(STORAGE_ACCOUNT_NAME, ACCOUNT_ACCESS_KEY)
const pipeline = StorageURL.newPipeline(credentials)
const serviceURL = new ServiceURL(`https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net`, pipeline)

async function runBlobStorage (file, semester, courseCode, rounds, metadata) {
  let blobName = ''
  const content = file.data
  const fileType = file.mimetype
  const containerURL = ContainerURL.fromServiceURL(serviceURL, containerName)
  const aborter = Aborter.timeout(30 * ONE_MINUTE)
  const newId = createID()

  blobName = `memo-${courseCode}${semester}-${newId}.pdf`

  const uploadResponse = await uploadBlob(aborter, containerURL, blobName, content, fileType, metadata)
  log.debug(' Blobstorage - uploaded file response ', uploadResponse)

  return blobName
}

//* *********************************************************************** */

async function uploadBlob (aborter, containerURL, blobName, content, fileType, metadata = {}) {
  const blobURL = BlobURL.fromContainerURL(containerURL, blobName)
  const blockBlobURL = BlockBlobURL.fromBlobURL(blobURL)
  try {
    const uploadBlobResponse = await blockBlobURL.upload(
      aborter.none,
      content,
      content.length
    )
    log.debug(`Blobstorage - Upload blob ${blobName} `)

    await blockBlobURL.setHTTPHeaders(aborter, { blobContentType: fileType })
    metadata['date'] = getTodayDate(false)
    await blockBlobURL.setMetadata(
      aborter,
      metadata
    )
    log.debug(`Blobstorage - Blob has been uplaoded:  ${blobName} `)
    return uploadBlobResponse
  } catch (error) {
    log.error('Error when uploading file in blobStorage: ' + blobName, { error: error })
    return error
  }
}

async function updateMetaData (blobName, metadata) {
  const containerURL = ContainerURL.fromServiceURL(serviceURL, containerName)
  const aborter = Aborter.timeout(30 * ONE_MINUTE)
  const blobURL = BlobURL.fromContainerURL(containerURL, blobName)
  const blockBlobURL = BlockBlobURL.fromBlobURL(blobURL)

  metadata['date'] = getTodayDate(false)

  log.debug(`Update metadata for ${blobName}`)
  try {
    const response = await blockBlobURL.setMetadata(
      aborter,
      metadata
    )
    return response
  } catch (error) {
    log.error('Error in update metadata in blobstorage: ' + blobName, { error: error })
    return (error)
  }
}

async function deleteBlob (fileName) {
  const aborter = Aborter.timeout(30 * ONE_MINUTE)
  log.debug(`Blobstorage - Delete file: ${fileName}`)
  try {
    const containerURL = ContainerURL.fromServiceURL(serviceURL, containerName)
    let response
    let marker
    let blobURL
    let blockBlobURL
    let responseDelete = []

    /* --- looping through blobs in container to get the correct blob to delete -- */
    do {
      response = await containerURL.listBlobFlatSegment(aborter)
      marker = response.marker
      for (let blob of response.segment.blobItems) {
        if (blob.name === fileName) {
          blobURL = await BlobURL.fromContainerURL(containerURL, blob.name)
          blockBlobURL = await BlockBlobURL.fromBlobURL(blobURL)
          responseDelete = await blockBlobURL.delete(aborter)
          break
        }
      }
    } while (marker)
    log.debug(responseDelete.length + ' file(s) deleted from blobstorage with file name: ' + fileName, responseDelete)
    return responseDelete
  } catch (error) {
    log.error('Error in deleting blob ', { error: error })
    return error
  }
}

/* --- creates an unique id for uploaded file */
const createID = () => {
  return 'x4xxxyxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0; var v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

const getTodayDate = (fileDate = true) => {
  let today = new Date()
  let dd = String(today.getDate()).padStart(2, '0')
  let mm = String(today.getMonth() + 1).padStart(2, '0') // January is 0!
  let yyyy = today.getFullYear()
  let hh = today.getHours()
  let min = today.getMinutes()

  return fileDate ? yyyy + mm + dd + '-' + hh + '-' + min : yyyy + mm + dd + '-' + hh + ':' + min
}
