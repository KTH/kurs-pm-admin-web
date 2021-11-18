import React from 'react'
// Helpers
import i18n from '../../../../i18n/index'
import { getDateFormat, formatRoundName } from '../util/helpers'
const FIRST_VERSION = 1

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
const WebBasedMemoLabelAndLink = ({ courseCode, translate, status, memoEndPoint, roundInputLabel, version }) => {
  const hasMemoInfo = memoEndPoint && version && status && courseCode

  if (!hasMemoInfo) return <span className="no-access">{` ${translate.has_web_based_memo}`}</span>

  const wasEverPublished = (status === 'draft' && version > FIRST_VERSION) || status === 'published'

  const labelLink = wasEverPublished
    ? translate.label_link_web_based_published_memo
    : translate.label_link_web_based_draft_memo

  const linkHref = `/kursinfoadmin/kurs-pm-data/${
    wasEverPublished ? 'published/' : ''
  }${courseCode}?memoEndPoint=${memoEndPoint}`

  return (
    <span className="no-access">
      {` ${translate.has_web_based_memo} ${translate.label_before_link_web_based_memo} `}

      <a href={linkHref} aria-label={`${translate.link_web_based_memo} ${roundInputLabel}`}>
        {labelLink}
      </a>
      {` ${translate.label_after_link_web_based_memo}`}
    </span>
  )
}

export function roundFullName(langIndex, semester, round) {
  const { label_start_date } = i18n.messages[langIndex].messages

  const { courseCode, roundId, shortName, startDate, language: roundLang } = round

  const roundName = formatRoundName(langIndex, shortName, semester, roundId)
  const roundInputLabel = `${roundName} (${label_start_date} ${getDateFormat(startDate, roundLang)}, ${roundLang} )`
  return roundInputLabel
}

const RoundLabel = ({
  round,
  semester,
  hasPublishedPdf, // pdf memo
  hasWebVersion, // web-based memo
  showAccessInfo = false,
  language,
  webVersionInfo, // if web-based memo exist then provide memoEndPoint to display in the link
}) => {
  const translate = i18n.messages[language].messages
  const { courseCode, roundId, hasAccess } = round

  const roundInputLabel = roundFullName(language, semester, round)

  if (showAccessInfo && !hasAccess)
    return (
      <div key={'round-' + roundId}>
        {roundInputLabel}
        <span className="no-access">
          <NotAuthorizedPublishMessage languageIndex={language} />
        </span>{' '}
      </div>
    )

  if (showAccessInfo && hasPublishedPdf)
    return (
      <div key={'round-' + roundId}>
        {roundInputLabel}
        <span className="no-access">{` ${translate.has_published_memo}`}</span>{' '}
      </div>
    )

  if (hasWebVersion)
    return (
      <div key={'round-' + roundId}>
        {roundInputLabel}
        <WebBasedMemoLabelAndLink
          courseCode={courseCode}
          memoEndPoint={webVersionInfo.memoEndPoint}
          translate={translate}
          roundInputLabel={roundInputLabel}
          status={webVersionInfo.status}
          version={webVersionInfo.version}
        />
      </div>
    )
  return <div key={'round-' + roundId}>{roundInputLabel}</div>
}

export default RoundLabel
