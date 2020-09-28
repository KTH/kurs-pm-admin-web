import React from "react";
import ProgressBar from "../components/ProgressBar";
import i18n from "../../../../i18n/index";

const ADMIN_COURSE_PM_DATA = "/kursinfoadmin/kurs-pm-data/";
const PUBLIC_COURSE_PM_DATA = "/kurs-pm/";

const showInfoKTHrecommendation = (courseCode, langIndex) => {
  const langAbbr = langIndex === 0 ? "en" : "sv";
  const {
    after_create_memo_link,
    alert_header,
    before_create_memo_link,
    label_create_memo_link,
    label_kurs_pm_web_link,
  } = i18n.messages[langIndex].messages.alert_recommendation;

  return (
    <div class="alert alert-info" role="alert">
      <h4>{alert_header}</h4>
      <p>
        {`${before_create_memo_link} `}
        <a href={`${ADMIN_COURSE_PM_DATA}${courseCode}?l=${langAbbr}`}>
          {label_create_memo_link}
        </a>
        {` ${after_create_memo_link} `}
        <a href="https://intra.kth.se/utbildning/utveckling-och-hogskolepedagogik/stodmaterial/kurs-pm">
          {label_kurs_pm_web_link}
        </a>
        {"."}
      </p>
    </div>
  );
};

const Title = ({
  courseCode,
  header,
  title,
  language: langIndex,
  progress,
  showProgressBar,
}) => {
  const { credits: courseCredits, name: courseTitle } = title;
  const credits =
    courseCredits && !courseCredits.toString().includes(".")
      ? courseCredits + ".0"
      : courseCredits || "";
  const creditUnit =
    langIndex === 0
      ? `${credits} credits`
      : `${credits.toString().replace(".", ",")} hp` || "";

  const courseName = `${courseCode} ${courseTitle} ${creditUnit}`;

  return (
    <header id="course-title" className="pageTitle">
      {title && (
        <span id="page-course-title" role="heading" aria-level="1">
          <span className="t1">{header}</span>
          <span className="t4">{courseCode && courseName}</span>
        </span>
      )}
      {progress === 1 && showInfoKTHrecommendation(courseCode, langIndex)}
      {showProgressBar && (
        <ProgressBar language={langIndex} active={progress} />
      )}
    </header>
  );
};

export default Title;
