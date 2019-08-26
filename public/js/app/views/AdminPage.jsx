import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Row, Col, Button, Form, Label, Input, Alert } from 'reactstrap'

//Components
import Title from '../components/Title'
import MemoMenu from '../components/MemoMenu'
import Preview from '../components/Preview'
import InfoModal from '../components/InfoModal' 
import InfoButton from '../components/InfoButton'
import UpLoad from '../components/UpLoad'

//Helpers 
import { SERVICE_URL } from '../util/constants'
import { getTodayDate, isValidDate } from '../util/helpers'
import i18n from '../../../../i18n/index'


@inject(['routerStore']) @observer
class AdminPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      saved: false, //TO DELETE
      values: this.props.routerStore.newMemoList,
      isPublished: false, //TO DELETE
      progress: this.props.routerStore.status === 'new' ? 'new' : 'edit',
      isPreviewMode: this.props.routerStore.status === 'preview',
      activeSemester: '',
      changedStatus: false,
      modalOpen:{
        publish: false,
        cancel: false
      },
      alert: '',
      alertSuccess: '',
      alertError: '',
      madatoryMessage: '',
      memoFile: '',
      pdfMemoDate: '',
      hasNewUploadedFilePM: false,
      notValid: [],
      fileProgress: {
        pm: 0
      },
      roundIdList:''
    }
    this.handlePreview = this.handlePreview.bind(this)
    this.editMode = this.editMode.bind(this)
    this.handlePublish = this.handlePublish.bind(this)
    this.handleBack = this.handleBack.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.toggleModal = this.toggleModal.bind(this)
    this.getTempData = this.getTempData.bind(this)
    this.getMetadata = this.getMetadata.bind(this)
    //this.divTop = React.createRef() 
    this.hanleUploadFile = this.hanleUploadFile.bind(this)
    this.handleRemoveFile = this.handleRemoveFile.bind(this)
    this.validateData = this.validateData.bind(this)
  }


//*********************************  FILE UPLOAD  ********************************* */
//********************************************************************************** */

  async hanleUploadFile(id, file, e){
    console.log('file', file)
    if(e.target.files[0].type === 'application/pdf'){
     response = await this.sendRequest(id, file, e)
    } else {
      const notValid = ['memoFile']
      this.setState({
        notValid: notValid,
        alertError: i18n.messages[this.props.routerStore.language].messages.alert_not_pdf
      })
    }
  }

  sendRequest(id, file, e) {
    const thisInstance = this
    const fileProgress = this.state.fileProgress
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest()
      req.upload.addEventListener("progress", event => {
        if (event.lengthComputable) {
          fileProgress[id] = (event.loaded / event.total) * 100
         //console.log(fileProgress[id])
          this.setState({ fileProgress: fileProgress })
        }
       })

      req.onreadystatechange = function() {
        let values = thisInstance.state.values
        if (this.readyState == 4 && this.status == 200) {
              fileProgress.pm = 0
              thisInstance.setState({
                memoFile: this.responseText,
                pdfMemoDate: getTodayDate(),  
                alertSuccess: i18n.messages[thisInstance.props.routerStore.language].messages.alert_uploaded_file,
                values: values,
                notValid: [],
                alertError: ''
              })
        }
      }

      let formData = new FormData()
      const data = this.getMetadata(this.state.isPublished ? 'published' :  'draft' )
      formData.append("file", e.target.files[0], e.target.files[0].name)
      formData.append('courseCode', data.courseCode)
      formData.append('analysis', 'TODO')
      formData.append('status', data.status)
      req.open("POST", `${this.props.routerStore.browserConfig.hostUrl}${this.props.routerStore.paths.storage.saveFile.uri.split(':')[0]}${this.state.activeSemester}/${this.props.routerStore.courseCode}/${this.state.rounds}`);
      req.send(formData)
    })
  }

  getMetadata(status){
    return {
      courseCode: this.state.values.courseCode,
      pm: this.state.values._id,
      status
    }
  }

  handleRemoveFile(event){
    event.target.id === 'remove_analysis'
    ? this.setState({analysisFile: '', hasNewUploadedFileAnalysis: true})
    : this.setState({memoFile: '', hasNewUploadedFilePM: true})
  }
  
//***************************** BUTTON CLICK HANDLERS ****************************** */
//********************************************************************************** */

  handlePreview(event) { 
    event.preventDefault()
    let invalidList = this.validateData(this.state.values)
    if(invalidList.length > 0){
      this.setState({
        notValid: invalidList,
        alertError: i18n.messages[this.props.routerStore.language].messages.alert_empty_fields
      })
    }else{
      this.setState({
        isPreviewMode: true,
        progress: 'preview',
        alertError: '',
        notValid: invalidList
      })
      window.scrollTo(0, 300)
    }
  }

  handleBack(event) {
    event.preventDefault()
    const thisAdminPage = this
    const routerStore = this.props.routerStore
    if (this.state.progress === 'edit') {
      this.props.history.push(routerStore.browserConfig.proxyPrefixPath.uri + '/' + routerStore.courseCode)
      if (routerStore.semesters.length === 0){
        return routerStore.getCourseInformation(routerStore.courseCode, routerStore.user, routerStore.language)
          .then(courseData => {
            thisAdminPage.setState({
              isPreviewMode: false,
              progress: 'back_new',
              activeSemester: routerStore.activeSemester,
              analysisFile:'',
              alert: ''
            })
          })
      }
      this.setState({
        isPreviewMode: false,
        progress: 'back_new',
        activeSemester: routerStore.activeSemester,
        alert: ''
      })
    }
    if (this.state.isPreviewMode) { 
      this.setState({
        isPreviewMode: false,
        progress: 'edit',
        alert: ''
      })
    }
  }

  handleCancel(event) {
    //window.location=`${SERVICE_URL[this.props.routerStore.service]}${this.props.routerStore.analysisData.courseCode}?serv=kutv&event=cancel`
  }
  
 
  handlePublish(event, fromModal = false) {
    if(!fromModal){    
      event.preventDefault()
    }
    const { routerStore } = this.props
    const thisInstance= this
    let modal = this.state.modalOpen
    routerStore.updateFileInStorage(this.state.memoFile, this.getMetadata('published'))
    
    return this.props.routerStore.postMemoData(routerStore.newMemoList, this.state.memoFile, this.state.pdfMemoDate )
      .then((response) => {
        //console.log('handlePublish!!!!!', response)
        modal.publish = false
        if(response === undefined || response.message){
          this.setState({
            alert: response.message ? response.message : 'No connection with data base',
            modalOpen: modal
          })
        }else{
          thisInstance.setState({
            saved: true,
            isPublished: true,
            modalOpen: modal,
            values: response
          })
          //window.location= encodeURI(`${routerStore.browserConfig.hostUrl}${SERVICE_URL[routerStore.service]}${routerStore.analysisData.courseCode}?serv=kutv&event=pub&id=${routerStore.analysisId}&term=${routerStore.analysisData.semester}&name=${routerStore.analysisData.analysisName}`)
        }
      })  
  }


  //************************ OTHER **************************** */
  //*************************************************************/

  editMode(semester, rounds,  status, tempData) { 
    const thisAdminPage = this
    const newMemoList = this.props.routerStore.createMemoData(semester, rounds)
        //const valuesObject = this.handleTemporaryData(thisAdminPage.props.routerStore.analysisData, tempData)
        thisAdminPage.setState({
          progress: "edit",
          isPreviewMode: false,
          isPublished: false,
          values: newMemoList,
          activeSemester: semester,
          memoFile:  '',
          alert: '',
          roundIdList: rounds
        })
  }

  toggleModal(event){
    let modalOpen = this.state.modalOpen
    modalOpen[event.target.id] = !modalOpen[event.target.id]
    this.setState({
      modalOpen: modalOpen
    })
  }

  handleInputChange(event) {
    this.setState({
      pdfMemoDate: event.target.value,
      //saved: false,
      notValid: [],
      alertError:''
    })
  }
  

  validateData(values){
    let invalidList = []
    if(this.state.memoFile.length === 0){
      invalidList.push('memoFile')
    } else {
      if(!isValidDate(this.state.pdfMemoDate)){
        invalidList.push('pdfMemoDate')
      }
    }
    return invalidList
  }

  getTempData(){
    if( this.state.progress === 'back_new' ){
      const { alterationText, examinationGrade, registeredStudents} = this.state.values
      const { memoFile, analysisFile, roundIdList} = this.state
      return { alterationText, examinationGrade, registeredStudents, roundIdList,  memoFile, analysisFile }
    }
    return null
  }

  handleTemporaryData(valueObject, tempData){
    let returnObject = {
      values: valueObject,
      files: {
        memoFile: '',
        analysisFile: ''
      }
    }
    if(tempData){
      returnObject.files.memoFile = tempData.memoFile
    }else{
      if(valueObject){
        returnObject.files.memoFile = this.state.memoFile 
      }
    }
    return returnObject
  }

  componentDidUpdate() {
    const thisInstance = this
    if(thisInstance.state.alertSuccess.length > 0){
      setTimeout(() => {
        thisInstance.setState({ alertSuccess: '' })
      }, 5000)
    }
  }

  render() {
    const { routerStore } = this.props
    const { isPublished, fileProgress } = this.state
    const translate = i18n.messages[routerStore.language].messages
 
    if (routerStore.browserConfig.env === 'dev'){
      console.log("routerStore - AdminPage", routerStore)
      console.log("this.state - AdminPage", this.state)
    }
    if (routerStore.newMemoList.length === 0 || this.state.progress === 'back_new')
      return (
        <div ref={this.divTop}>
          { routerStore.errorMessage.length === 0
            ? <div>
              <Title 
                title={routerStore.courseTitle} 
                language={routerStore.language} 
                courseCode={routerStore.courseCode} 
                progress = {1}
                header = {translate.header_main[routerStore.status]}
                showProgressBar = {true}
                />
         
              {/************************************************************************************* */}
              {/*                               PAGE1: ANALYSIS MENU                             */}
              {/************************************************************************************* */}
              {routerStore.semesters.length === 0
                ?<Alert color='info' className='margin-bottom-40'> {translate.alert_no_rounds} </Alert>
                : <MemoMenu
                  editMode= { this.editMode }
                  semesterList= { routerStore.semesters }
                  roundList= { routerStore.roundData }
                  progress= { this.state.progress }
                  activeSemester= { this.state.activeSemester } 
                  firstVisit = { routerStore.newMemoList.length === 0 }
                  status = { routerStore.status }
                  tempData = {/*this.state.saved ? {} : */ this.getTempData()}
                  saved = {false}
                  analysisId = {this.state.saved && this.state.values ? this.state.values._id : ''}
                />
              }
            </div>
            :<Alert className='margin-bottom-40' color='info'> { routerStore.errorMessage }</Alert>
          }
        </div>
      )
    else
      return (
        <div key='kursutveckling-form-container' className='container' id='kursutveckling-form-container' ref={(ref) => this._div = ref} >
        {/************************************************************************************* */}
        {/*                     PAGE 2: EDIT  AND  PAGE 3: PREVIEW                               */}
        {/************************************************************************************* */}
         {
           routerStore.errorMessage.length > 0
            ?<Alert color='info' className='margin-bottom-40'>{routerStore.errorMessage}</Alert>
            :<div>

            <Title 
              title={routerStore.courseTitle} 
              language={routerStore.language} 
              courseCode={routerStore.courseCode} 
              progress = {this.state.progress === 'edit' ? 2 : 3}
              header = {translate.header_main[routerStore.status]}
              showProgressBar = {routerStore.status !== 'preview'}
            />
         
          {/************************************************************************************* */}
          {/*                                   PREVIEW                                           */}
          {/************************************************************************************* */}
          {this.state.values && this.state.isPreviewMode
          
            ? <Preview 
              roundList={ this.state.roundIdList } 
              memoFile = { this.state.memoFile }
            />
            : ""
          }
          <Row key='form' id='form-container' >
          <Col sm="12" lg="12">
            {/************************************************************************************* */}
            {/*                                 EDIT FORM                                               */}
            {/************************************************************************************* */}
              
            {this.state.values && !this.state.isPreviewMode
              ? <Form className='admin-form'>
                 {/* ----- Intro text for Edit ------- */}
                  <div>
                    <p>{translate.intro_edit}</p>
                  </div>

                {/* ---- Semester and name of analysis ---- */}
                <h2>{translate.header_edit_content}</h2>
                <p> <b>{translate.header_semester} </b>{
                  `${translate.course_short_semester[this.state.activeSemester.toString().match(/.{1,4}/g)[1]]} 
                                    ${this.state.activeSemester.toString().match(/.{1,4}/g)[0]}`
                  }
                 <b> {translate.header_course_offering}</b> {this.state.values.analysisName}</p>

                <p>{translate.header_mandatory_fields}</p>
              
                {/* ----- ALERTS ----- */}
                {this.state.alert.length > 0 
                  ? <Row>
                    <Alert color= 'info' className='margin-bottom-40'>{this.state.alert} </Alert>
                  </Row>
                  : ''
                }  
                {this.state.alertSuccess.length > 0 
                  ? <Row>
                    <Alert color= 'success' >{this.state.alertSuccess} </Alert>
                  </Row>
                  : ''
                }  
                {this.state.alertError.length > 0 
                  ? <Row>
                    <Alert color= 'danger'>{this.state.alertError} </Alert>
                  </Row>
                  : ''
                }  

               {/* FORM - FIRST COLUMN */}
                <Row className='form-group'>
                  <Col sm='6' className='col-form'>
                    <h4>{translate.header_upload}</h4>
                   
                    {/** ------- PM-FILE UPLOAD --------- */}
                    <FormLabel translate = {translate} header = {'header_upload_file_pm'} id = {'info_upload_course_memo'} />
                    <UpLoad id="pm" key="pm" 
                      handleUpload = {this.hanleUploadFile} 
                      progress={fileProgress.pm} 
                      path={routerStore.browserConfig.proxyPrefixPath.uri}
                      file = {this.state.memoFile}
                      notValid = {this.state.notValid}
                      handleRemoveFile ={this.handleRemoveFile}
                      type = 'memoFile'
                      />
                       { this.state.memoFile.length > 0 
                        ? <span>
                         <FormLabel translate = {translate} header = {'header_upload_file_pm_date'} id = {'info_upload_course_memo_date'} />
                         <Input id='pdfMemoDate' key='pdfMemoDate' type='date' 
                           value={this.state.pdfMemoDate} 
                           onChange={this.handleInputChange} 
                           className = {this.state.notValid.indexOf('pdfMemoDate') > -1 ? 'not-valid' : ''}
                           style = {{ maxWidth: '180px'}}
                           />
                           </span>
                        : ''
                      }
                      <br/>
                      <br/>
                  </Col>

                  {/* ------ FORM - THIRD COLUMN -------- */}
                  <Col sm='4' className='col-form'>
  
                 </Col>
                  </Row> 
              </Form>
              : ''
            }
            {/************************************************************************************* */}
            {/*                                BUTTONS FOR PAG 2 AND 3                              */}
            {/************************************************************************************* */}
             
            <Row className="button-container text-center" >  
              <Col sm="4" className ='align-left-sm-center'>
                { routerStore.status === 'preview'
                  ? ''
                  : <Button color='secondary' id='back' key='back' onClick={this.handleBack} >
                      <div className="iconContainer arrow-back"/> 
                        { this.state.isPreviewMode ? translate.btn_back_edit : translate.btn_back }
                  </Button>
                }
              </Col>
              <Col sm="3" className='align-right-sm-center' >
                { routerStore.status !== 'preview'
                  ? <Button color='secondary' id='cancel' key='cancel' onClick={this.toggleModal} >
                      {translate.btn_cancel}
                  </Button>
                  : ''
                }
              </Col>
                  <Col sm="3">
                 
                </Col>
                  <Col sm="2">
                  {routerStore.status === 'preview'
                    ? ''
                    : <span>
                     { this.state.isPreviewMode
                      ? <Button color='success' id='publish' key='publish' onClick={this.toggleModal} >
                        {translate.btn_publish}
                      </Button>
                      :<Button color='success' id='preview' key='preview' onClick={this.handlePreview} >
                        <div className="iconContainer arrow-forward"/>  {translate.btn_preview}
                      </Button>
                     }
                      </span>
                    }
                  </Col>
                </Row>
            </Col>
          </Row>
          {/************************************************************************************* */}
          {/*                               MODALS FOR PUBLISH AND CANCEL                         */}
          {/************************************************************************************* */}  
          <InfoModal type = 'publish' toggle= {this.toggleModal} isOpen = {this.state.modalOpen.publish} id={this.props.routerStore.analysisId} handleConfirm={this.handlePublish} infoText={translate.info_publish}/>
          <InfoModal type = 'cancel' toggle= {this.toggleModal} isOpen = {this.state.modalOpen.cancel} id={this.props.routerStore.analysisId} handleConfirm={this.handleCancel} infoText={translate.info_cancel}/>
          </div>
         }
        </div>
      )
  }
}

const FormLabel = ({ translate, header, id }) => {
  return(
    <span className='inline-flex'>
      <Label>{translate[header]} </Label>
      <InfoButton id = {id} textObj = {translate[id]}/>
    </span>
  )
}



export default AdminPage
