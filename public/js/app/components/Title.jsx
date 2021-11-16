import React from 'react'
import PropTypes from 'prop-types'
import { ProgressBar } from '@kth/kth-reactstrap/dist/components/utbildningsinfo'
import { PageHeading } from '@kth/kth-reactstrap/dist/components/studinfo'
import { Alert } from 'reactstrap'
import i18n from '../../../../i18n/index'
import { ADMIN_COURSE_PM_DATA } from '../util/constants'

const showInfoKTHrecommendation = (courseCode, langIndex) => {
  const langAbbr = langIndex === 0 ? 'en' : 'sv'
  const linkLocale = langAbbr === 'en' ? 'en/' : ''
  const {
    accessability_responsibility: accessibilityResponsibility,
    after_create_memo_link: labelAfterCreateMemoLink,
    alert_header: alertHeader,
    before_create_memo_link: labelBeforeCreateMemoLink,
    label_create_memo_link: labelCreateMemoLink,
    label_control_info_link: labelControlInfoLink,
    label_kurs_pm_web_link: labelCourseMemoWebLink,
    label_course_memo_guide_link: labelCourseMemoGuideLink,
  } = i18n.messages[langIndex].messages.alert_recommendation

  return (
    <Alert color="info" className="alert-margin">
      <h4>{alertHeader}</h4>
      <p>
        {`${accessibilityResponsibility} `}
        <a href={`https://intra.kth.se/${linkLocale}styrning/styrdokument/regler/utbildning-overgripande`}>
          {labelControlInfoLink}
        </a>
        .
      </p>
      <p>
        {`${labelBeforeCreateMemoLink} `}
        <a href={`${ADMIN_COURSE_PM_DATA}${courseCode}?l=${langAbbr}`}>{labelCreateMemoLink}</a>
        {` ${labelAfterCreateMemoLink} `}
        <a href={`https://intra.kth.se/${linkLocale}utbildning/utveckling-och-hogskolepedagogik/stodmaterial/kurs-pm`}>
          {labelCourseMemoGuideLink}
        </a>
        .
      </p>
    </Alert>
  )
}

const Title = ({ courseCode, header, title, language: langIndex, progress, showProgressBar }) => {
  const { credits: courseCredits, name: courseTitle } = title
  const credits = courseCredits && !courseCredits.toString().includes('.') ? courseCredits + '.0' : courseCredits || ''
  const creditUnit = langIndex === 0 ? `${credits} credits` : `${credits.toString().replace('.', ',')} hp` || ''

  const courseName = `${courseCode} ${courseTitle} ${creditUnit}`

  return (
    <div>
      <PageHeading subHeading={courseCode && courseName}>{header}</PageHeading>
      {progress === 1 && showInfoKTHrecommendation(courseCode, langIndex)}
      {showProgressBar && <ProgressBar active={progress} pages={i18n.messages[langIndex].messages.pagesProgressBar} />}
    </div>
  )
}

Title.propTypes = {
  courseCode: PropTypes.string.isRequired,
  language: PropTypes.oneOf([0, 1]).isRequired,
  title: PropTypes.oneOf([
    '',
    PropTypes.string,
    PropTypes.shape({ credits: PropTypes.oneOf([PropTypes.string, PropTypes.number]), name: PropTypes.string }),
  ]).isRequired,
}

export default Title
