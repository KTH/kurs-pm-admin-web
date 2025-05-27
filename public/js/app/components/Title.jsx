import React from 'react'
import PropTypes from 'prop-types'
import i18n from '../../../../i18n/index'
import { ADMIN_COURSE_PM_DATA } from '../util/constants'
import Alert from '../components-shared/Alert'
import ProgressBar from '../components-shared/ProgressBar'
import PageHeading from '../components-shared/PageHeading'

const ShowInfoKTHrecommendation = ({ courseCode, langIndex }) => {
  const langAbbr = langIndex === 0 ? 'en' : 'sv'
  const linkLocale = langAbbr === 'en' ? 'en/' : ''
  const {
    accessability_responsibility: accessibilityResponsibility,
    after_create_memo_link: labelAfterCreateMemoLink,
    alert_header: alertHeader,
    before_create_memo_link: labelBeforeCreateMemoLink,
    label_create_memo_link: labelCreateMemoLink,
    label_control_info_link: labelControlInfoLink,
    label_course_memo_guide_link: labelCourseMemoGuideLink,
  } = i18n.messages[langIndex].messages.alert_recommendation

  return (
    <Alert type="info" header={alertHeader}>
      <p>
        {`${accessibilityResponsibility} `}
        <a href={`https://intra.kth.se/${linkLocale}utbildning/systemstod/om-kursen/kurs-pm/riktilinjer-1.1184855`}>
          {labelControlInfoLink}
        </a>
        .
      </p>
      <p>
        {`${labelBeforeCreateMemoLink} `}
        <a href={`${ADMIN_COURSE_PM_DATA}${courseCode}?l=${langAbbr}`}>{labelCreateMemoLink}</a>
        {` ${labelAfterCreateMemoLink} `}
        <a href={`https://intra.kth.se/${linkLocale}utbildning/systemstod/om-kursen/kurs-pm/kurs-pm`}>
          {labelCourseMemoGuideLink}
        </a>
        .
      </p>
    </Alert>
  )
}

const Title = ({ courseCode, header, title, language: langIndex, progress, showProgressBar }) => {
  const { credits: courseCredits, name: courseTitle } = title

  const courseName = `${courseCode} ${courseTitle} ${courseCredits?.formattedWithUnit}`

  const currentStepIndex = progress - 1

  return (
    <div>
      <PageHeading heading={header} subHeading={courseCode && courseName} />
      {progress === 1 && <ShowInfoKTHrecommendation courseCode={courseCode} langIndex={langIndex} />}
      {showProgressBar && (
        <ProgressBar current={currentStepIndex} steps={i18n.messages[langIndex].messages.pagesProgressBar} />
      )}
    </div>
  )
}

Title.propTypes = {
  courseCode: PropTypes.string.isRequired,
  language: PropTypes.oneOf([0, 1]).isRequired,
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({ credits: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), name: PropTypes.string }),
  ]).isRequired,
}

export default Title
