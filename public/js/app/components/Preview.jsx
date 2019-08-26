import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Alert, Collapse, Table} from 'reactstrap'

//Helpers 
import i18n from '../../../../i18n/index'
import { getDateFormat} from '../util/helpers'

@inject(['routerStore']) @observer
class Preview extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    const { routerStore, roundList, memoFile } = this.props
    const translate = i18n.messages[routerStore.language].messages
   return (
      <div>
        <h4>translate.header_publish_memo_for_rounds</h4>
        <a href={`${routerStore.browserConfig.storageUri}${memoFile}`} target='_blank'>{translate.btn_preview}</a>
        { 
          routerStore.roundData[routerStore.activeSemester].map( round =>{
            let roundName =  round.shortName 
                ? round.shortName + ' '
                : `${translate.course_short_semester[routerStore.activeSemester].toString().match(/.{1,4}/g)[1]} 
                   ${routerStore.activeSemester.toString().match(/.{1,4}/g)[0]}-${round.roundId} `

          return roundList.toString().indexOf(round.roundId) > -1 
            ? <div key={'round-'+round.roundId}>
              {`${roundName}(${translate.label_start_date} ${getDateFormat(round.startDate, round.language)}, ${round.language} )`}
            </div>
            : ''
        })
      }
     </div>   
    )
  }
}

export default Preview