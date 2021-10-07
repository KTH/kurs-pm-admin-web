import React from 'react'
import PropTypes from 'prop-types'
import { ProgressBar } from '@kth/kth-reactstrap/dist/components/utbildningsinfo'
import { PageHeading } from '@kth/kth-reactstrap/dist/components/studinfo'
import { Alert } from 'reactstrap'
import i18n from '../../../../i18n/index'

const ADMIN_COURSE_PM_DATA = '/kursinfoadmin/kurs-pm-data/'

const showInfoKTHrecommendation = (courseCode, langIndex) => {
  const langAbbr = langIndex === 0 ? 'en' : 'sv'
  const {
    after_create_memo_link: labelAfterCreateMemoLink,
    alert_header: alertHeader,
    before_create_memo_link: labelBeforeCreateMemoLink,
    label_create_memo_link: labelCreateMemoLink,
    label_kurs_pm_web_link: labelCourseMemoWebLink,
  } = i18n.messages[langIndex].messages.alert_recommendation

  return (
    <Alert color="info" className="alert-margin">
      <h4>{alertHeader}</h4>
      <p>
        {`${labelBeforeCreateMemoLink} `}
        <a href={`${ADMIN_COURSE_PM_DATA}${courseCode}?l=${langAbbr}`}>{labelCreateMemoLink}</a>
        {` ${labelAfterCreateMemoLink} `}
        <a href="https://intra.kth.se/utbildning/utveckling-och-hogskolepedagogik/stodmaterial/kurs-pm">
          {labelCourseMemoWebLink}
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
