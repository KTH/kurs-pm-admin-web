import React from 'react'
// Helpers
import i18n from '../../../../i18n/index'
import { getDateFormat } from '../util/helpers'

const NotAuthorizedPublishMessage = ({ languageIndex }) => {
  const translate = i18n.messages[languageIndex].messages
  const url =
    languageIndex === 0
      ? 'https://intra.kth.se/en/utbildning/utbildningsadministr/om-kursen/kurs-pm/kurs-pm-1.1079198'
      : 'https://intra.kth.se/utbildning/utbildningsadministr/om-kursen/kurs-pm/kurs-pm-1.1079198'
  return (
    <>
      {` ${translate.not_authorized_publish_new} `}
      <a href={url} target="_blank" className="external-link" rel="noreferrer">
        {translate.not_authorized_publish_new_link_label}
      </a>
    </>
  )
}

const RoundLabel = ({ round, semester, hasPublishedPdf, hasWebVersion, showAccessInfo = false, language }) => {
  const translate = i18n.messages[language].messages
  const { roundId, shortName, startDate, language: roundLang, hasAccess } = round

  const roundName = shortName
    ? shortName + ' '
    : `${translate.course_short_semester[semester.toString().match(/.{1,4}/g)[1]]} 
       ${semester.toString().match(/.{1,4}/g)[0]}-${roundId} `

  const hasPublishedPdfMessage = hasPublishedPdf ? translate.has_published_memo : ''

  return (
    <div key={'round-' + roundId}>
      {`${roundName}(${translate.label_start_date} ${getDateFormat(startDate, roundLang)}, ${roundLang} )`}
      {(hasWebVersion && <span className="no-access">{translate.has_web_based_memo}</span>) ||
        (!showAccessInfo ? (
          <span className="no-access">{hasPublishedPdfMessage}</span>
        ) : (
          <span className="no-access">
            {!hasAccess ? <NotAuthorizedPublishMessage languageIndex={language} /> : hasPublishedPdfMessage}
          </span>
        ))}
    </div>
  )
}

export default RoundLabel
