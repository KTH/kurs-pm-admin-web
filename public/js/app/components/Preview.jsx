import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'

import RoundLabel from '../components/RoundLabel'

//Helpers 
import i18n from '../../../../i18n/index'

@inject(['routerStore']) @observer
class Preview extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    const { routerStore, roundList, memoFile } = this.props
    const translate = i18n.messages[routerStore.language].messages
    console.log(translate)
   return (        <a href={`${routerStore.browserConfig.storageUri}${memoFile}`} target='_blank'>{translate.btn_preview}</a>
        
    
    )
  }
}

export default Preview