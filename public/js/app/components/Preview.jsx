import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Alert, Collapse, Table} from 'reactstrap'

// Custom components
import TableWithCourseData from './preview/TableWithCourseData'
import CollapseExtraInfo from './preview/CollapseExtraInfo'
import SyllabusPmAnalysLinks from './preview/SyllabusPmAnalysLinks'


//Helpers 
import i18n from '../../../../i18n/index'


@inject(['routerStore']) @observer
class Preview extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isPublished: this.props.routerStore.roundAnalysis === 'published',
      isNew: this.props.routerStore.roundAnalysis === 'new',
      values: this.props.values,
      collapse: true
    }
  }

  componentWillMount(){
    this.setState({
      values: this.props.values
    })
  }

  render () {
    const { routerStore, analysisFile, pmFile } = this.props
    const translate = i18n.messages[routerStore.language].messages
    const courseRoundObj = this.state.values
    
    
    if(routerStore.analysisData === undefined)
      return (<div>A message here of some kind...</div>)
    else
      return (
        <div key='kursutveckling-andmin-preview' className='' id='preview-container' >
           <h2>{translate.header_preview_content}</h2>
           <p>{routerStore.status === 'preview' ? '' : translate.intro_preview}</p>
          {routerStore.analysisData.examinationRounds && routerStore.analysisData.examinationRounds.length === 0 
            ? <Alert className='margin-bottom-40'>Something got wrong</Alert>
            : <div className='card collapsible blue course-data-for-round'>
              <span className='course-data-title card-header' role='tab' tabIndex='0' onClick={this.toggleRound}>
                <a id={courseRoundObj._id} aria-expanded={this.state.collapse} load='false'>
                {translate.header_course_round}: {courseRoundObj.analysisName}
                </a>
              </span>
          {/*  */}
          <Collapse className='bordered-table' isOpen={this.state.collapse} toggler={'#' + courseRoundObj._id}>
            <SyllabusPmAnalysLinks translate={translate} 
              courseRoundObj={courseRoundObj} 
              storageUri={this.props.routerStore.browserConfig.storageUri} 
              analysisFile = { analysisFile }
              pmFile = { pmFile }
              language = {routerStore.language}
            />
            
            <TableWithCourseData 
              translate={translate.table_headers_with_popup} 
              courseRoundObj={courseRoundObj}
              language = {routerStore.language}
            />
   
            <CollapseExtraInfo translate={translate}
              courseRoundObj={courseRoundObj}
              label={courseRoundObj._id}
          />
          </Collapse>
        </div>
        }
      
     </div>   
    )
  }
}

export default Preview

const GrayTextBlock = ({header, text}) => {
  return (
    <span>
      <h4>{header}</h4>
      <Table responsive>
        <tbody>
          <tr>
            <td colSpan="6" dangerouslySetInnerHTML={{__html: text}}>                    
            </td>
          </tr>
        </tbody>
      </Table>  
    </span>
  )
}

class ProgramCollapse extends Component {
  constructor(props) {
    super(props)
    this.toggleHeader = this.toggleHeader.bind(this)
    this.state = {collapseProgram: false}
  }
  toggleHeader() {
    this.setState(state => ({collapseProgram: !state.collapseProgram}))
  }
  render () {
    const label = this.props.label
    return (
        <div className='card collapsible whiteBg' >
          <span className='card-header whiteBg' role='tab'  tabIndex='0' onClick={this.toggleHeader}>
              <a className='collapse-header whiteBg' id={'programHeading' + label} data-toggle='collapse' href={'#collapsePrograms' + label} aria-controls={'collapsePrograms' + label}> 
              {this.state.collapseProgram ? '- ' : '+ '}
              {this.props.header}
              </a>
          </span>
          <Collapse color='whiteBg' isOpen={this.state.collapseProgram} toggler={'#programHeading' + label}>
            <div className='card-body  col'>
              <span className='textBlock' dangerouslySetInnerHTML={{__html: this.props.text}}/>
            </div>
          </Collapse>
        </div>
    )
  }
}


class TableForCourse extends Component {
  constructor(props) {
    super(props)
  }

  render () {    
    const values = this.props.analysisObject
    const { translate, routerStore, togglerId, linksFileNames } = this.props

    return(
      <div className='card collapsible blue'>
        <span className='table-title card-header'  role="tab" tabIndex='0' >
            <a id={togglerId}  aria-expanded={true}>{values.analysisName}</a> 
        </span>
        {/*  */}
        <Collapse isOpen={true} >
          <ProgramCollapse header={translate.header_programs} text={values.programmeCodes} label={togglerId}/>
          <span className="right-links" >
           <a>{translate.link_syllabus}</a>
            <a key='pmLink' id='pmLink' href={routerStore.browserConfig.storageUri + linksFileNames.analysis} target='_blank' > 
              {translate.link_pm}: {values.pdfPMDate.length > 0 ? ': '+ getDateFormat(values.pdfPMDate, routerStore.language) : '' }
            </a> 
            <a key='analysisLink'  id='analysisLink' href={routerStore.browserConfig.storageUri + linksFileNames.pm} target='_blank' >  
                {translate.link_analysis} {values.pdfAnalysisDate.length > 0 ? ': '+ getDateFormat(values.pdfAnalysisDate, routerStore.language) : '' }
            </a>
          </span>
          <Table responsive>
            <thead>
                <tr>
                    <th>{translate.header_employees}</th>
                    <th>{translate.header_registrated}</th>
                    <th>{translate.header_examination}</th>
                     <th>{translate.header_examination_comment}</th>
                    <th alt='; i % av aktiva (totalt) vid första ex-tillfället'>{translate.header_examination_grade}</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td> 
                        <p><b>{translate.header_examiners}: </b></p>                  
                        <p>{values.examiners}</p>
                        <p><b>{translate.header_responsibles}: </b></p>                  
                        <p>{values.responsibles}</p>
                    </td>
                    <td>{values.registeredStudents}</td>
                    <td>
                        <p> {
                          values.examinationRounds.map( exam => {
                            let string = exam.split(';')
                            return (`${string[0]} - ${string[1]}, ${string[2]} ${string[3]}, ${string[4]}: ${string[5]} `)  
                          })
                        }</p>
                      
                    </td>
                    <td> 
                        <p dangerouslySetInnerHTML={{__html: values.commentExam }}/>
                    </td>
                    <td>
                        <p>{values.examinationGrade} %</p>
                    </td>
                </tr>
            </tbody>
          </Table> 
          <GrayTextBlock header={translate.header_course_changes_comment} text={values.alterationText}/>
          <GrayTextBlock header={translate.header_analysis_edit_comment}  text={values.commentChange}/>
          <p className="underlined">{translate.last_change_date} {values.changedDate.length > 0 ? formatDate(values.changedDate, routerStore.language ) : ''}</p>
        </Collapse>

        
      </div>          
    )}
}