import React from "react";
//Helpers
import i18n from "../../../../i18n/index";
import { getDateFormat } from "../util/helpers";

const RoundLabel = ({
  round,
  semester,
  hasPublishedPdf,
  hasWebVersion,
  showAssesInfo,
  language,
}) => {
  const translate = i18n.messages[language].messages;
  const {
    roundId,
    shortName,
    startDate,
    language: roundLang,
    hasAccess,
  } = round;

  let roundName = shortName
    ? shortName + " "
    : `${
        translate.course_short_semester[semester.toString().match(/.{1,4}/g)[1]]
      } 
       ${semester.toString().match(/.{1,4}/g)[0]}-${roundId} `;
  console.log("hasWebVersion", hasWebVersion);
  console.log("hasPublishedPdf", hasPublishedPdf);

  return (
    <div key={"round-" + roundId}>
      {`${roundName}(${translate.label_start_date} ${getDateFormat(
        startDate,
        roundLang
      )}, ${roundLang} )`}
      {(hasWebVersion && (
        <span className="no-access">{translate.has_web_based_memo}</span>
      )) ||
        (!showAssesInfo ? (
          <span className="no-access">
            {hasPublishedPdf ? translate.has_published_memo : ""}
          </span>
        ) : (
          <span className="no-access">
            {!hasAccess
              ? translate.not_authorized_publish_new
              : hasPublishedPdf
              ? translate.has_published_memo
              : ""}
          </span>
        ))}
    </div>
  );
};

export default RoundLabel;
