import React, { Component } from 'react'
import { inject, observer} from 'mobx-react'
import i18n from '../../../../i18n'

@inject(['adminStore']) @observer
class AdminCoursePmPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }

  render () {
    const { courseKoppsData, coursePmApiData } = this.props.adminStore
    // const courseKoppsDataLang = courseKoppsData.lang
    // const courseCode = courseKoppsData.course_code

    return (
      <div key='kursinfo-container' className='kursinfo-main-page col' >
          <h1>Try First App</h1>
          <h2>{courseKoppsData}</h2>
          <h2>{coursePmApiData}</h2>
      </div>
    )
  }
}

export default AdminCoursePmPage
