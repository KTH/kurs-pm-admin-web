const HTTP_CODE_400 = 400

function getResponseMessage(response) {
  if (response.friendly) return response.friendly
  if (response.message) return response.message
  if (response.statusMessage) return response.statusMessage
  return 'No connection with data base'
}

module.exports = { getResponseMessage, HTTP_CODE_400 }
