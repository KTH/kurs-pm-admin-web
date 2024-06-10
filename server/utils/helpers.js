const roundIsNotOutdated = checkDate => {
  const dateToCheck = new Date(checkDate)
  const dateToCheckYear = dateToCheck.getFullYear()
  const today = new Date()
  const currentYear = today.getFullYear()

  return dateToCheckYear >= currentYear - 1
}

module.exports = { roundIsNotOutdated }
