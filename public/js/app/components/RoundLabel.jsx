import React  from 'react'
//Helpers 
import i18n from '../../../../i18n/index'
import { getDateFormat} from '../util/helpers'

const RoundLabel = ({round, semester, language}) =>{ 
    const translate = i18n.messages[language].messages
    let roundName =  round.shortName 
    ? round.shortName + ' '
    : `${translate.course_short_semester[semester.toString().match(/.{1,4}/g)[1]]} 
       ${semester.toString().match(/.{1,4}/g)[0]}-${round.roundId} `

    return (
            <div key={'round-'+round.roundId}>
                {`${roundName}(${translate.label_start_date} ${getDateFormat(round.startDate, round.language)}, ${round.language} )`}
            </div> 
    )
}

export default RoundLabel