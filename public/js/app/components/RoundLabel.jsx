import React  from 'react'
//Helpers 
import i18n from '../../../../i18n/index'
import { getDateFormat} from '../util/helpers'

const RoundLabel = ({round, semester, usedRounds, showAssesInfo, language}) =>{ 
    const translate = i18n.messages[language].messages

    let roundName =  round.shortName 
    ? round.shortName + ' '
    : `${translate.course_short_semester[semester.toString().match(/.{1,4}/g)[1]]} 
       ${semester.toString().match(/.{1,4}/g)[0]}-${round.roundId} `

    return (
            <div key={'round-'+round.roundId}>
                {`${roundName}(${translate.label_start_date} ${getDateFormat(round.startDate, round.language)}, ${round.language} )`}
                {!showAssesInfo
                    ? <span className='no-access'>   
                        {usedRounds.length > 0 && usedRounds.indexOf(round.roundId) > -1 
                            ? translate.has_published_memo 
                            : '' 
                        }
                    </span>
                    : <span className='no-access'>   
                        {!round.hasAccess 
                            ? translate.not_authorized_publish_new
                            : usedRounds.length > 0 && usedRounds.indexOf(round.roundId) > -1 
                                ? translate.has_published_memo 
                                : '' 
                    }
               </span>
                }
            </div> 
    )
}

export default RoundLabel