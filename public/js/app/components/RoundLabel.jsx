import React from 'react'
// Helpers
import i18n from '../../../../i18n/index'
import { getDateFormat, formatRoundName } from '../util/helpers'

const FIRST_VERSION = 1

const WebBasedMemoLabelAndLink = ({ courseCode, translate, memoStatus, memoEndPoint, roundInputLabel, version }) => {
  const hasMemoInfo = memoEndPoint && version && memoStatus && courseCode

  if (!hasMemoInfo) return <small>{` ${translate.has_web_based_memo}`}</small>

  const wasEverPublished = (memoStatus === 'draft' && version > FIRST_VERSION) || memoStatus === 'published'

  const labelLink = wasEverPublished
    ? translate.label_link_web_based_published_memo
    : translate.label_link_web_based_draft_memo

  const linkHref = `/kursinfoadmin/kurs-pm-data/${
    wasEverPublished ? 'published/' : ''
  }${courseCode}?memoEndPoint=${memoEndPoint}`

  return (
    <small>
      {` ${translate.has_web_based_memo} ${translate.label_before_link_web_based_memo} `}

      <a href={linkHref} aria-label={`${translate.link_web_based_memo} ${roundInputLabel}`}>
        {labelLink}
      </a>
      {` ${translate.label_after_link_web_based_memo}`}
    </small>
  )
}

export function roundFullName(langIndex, semester, round) {
  const { label_start_date } = i18n.messages[langIndex].messages

  const { applicationCode, shortName, startDate, language: roundLang } = round

  const roundName = formatRoundName(langIndex, shortName, semester, applicationCode)
  const roundInputLabel = `${roundName} (${label_start_date} ${getDateFormat(startDate, roundLang)}, ${roundLang})`
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
  const { courseCode, applicationCode, userAccessDenied } = round

  const roundInputLabel = roundFullName(language, semester, round)

  if (showAccessInfo && userAccessDenied)
    return (
      <span key={'round-' + applicationCode} className={'text-muted fst-italic fw-light'}>
        {roundInputLabel} <small aria-hidden="true">{translate.not_authorized_publish_new}</small>
      </span>
    )

  if (showAccessInfo && hasPublishedPdf)
    return (
      <span key={'round-' + applicationCode}>
        {roundInputLabel} <small aria-hidden="true">{translate.has_published_memo}</small>{' '}
      </span>
    )

  if (hasWebVersion)
    return (
      <span key={'round-' + applicationCode} className={'text-muted fst-italic fw-light'}>
        {roundInputLabel}
        <WebBasedMemoLabelAndLink
          courseCode={courseCode}
          memoEndPoint={webVersionInfo.memoEndPoint}
          translate={translate}
          roundInputLabel={roundInputLabel}
          memoStatus={webVersionInfo.status}
          version={webVersionInfo.version}
        />
      </span>
    )
  return <span key={'round-' + applicationCode}>{roundInputLabel}</span>
}

export default RoundLabel
