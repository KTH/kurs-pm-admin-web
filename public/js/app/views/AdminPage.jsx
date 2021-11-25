import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Row, Col, Button, Form, Label, Alert } from 'reactstrap'

// Components
import Title from '../components/Title'
import MemoMenu from '../components/MemoMenu'
import InfoModal from '../components/InfoModal'
import InfoButton from '../components/InfoButton'
import UpLoad from '../components/UpLoad'
import RoundLabel, { roundFullName } from '../components/RoundLabel'
import { ActionModalButton } from '@kth/kth-reactstrap/dist/components/utbildningsinfo'

// Helpers
import { SERVICE_URL, ACCESSABILITY_INTRANET_LINK, ADMIN_COURSE_PM_DATA } from '../util/constants'
import { getTodayDate } from '../util/helpers'
import i18n from '../../../../i18n/index'

@inject(['routerStore'])
@observer
class AdminPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      saved: false, //TO DELETE
      progress: this.props.routerStore.status === 'new' ? 'new' : 'edit',
      isPreviewMode: this.props.routerStore.status === 'preview',
      modalOpen: {
        publish: false,
        cancel: false,
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
        pm: 0,
      },
      roundIdList: [],
      usedRoundSelected: 0,
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
    this.handleUploadFile = this.handleUploadFile.bind(this)
    this.handleRemoveFile = this.handleRemoveFile.bind(this)
    this.validateData = this.validateData.bind(this)
    this.filterChosenRoundsList = this.filterChosenRoundsList.bind(this)
    this.getCourseOfferingsNames = this.getCourseOfferingsNames.bind(this)
  }

  componentDidUpdate() {
    const thisInstance = this
    if (thisInstance.state.alertSuccess.length > 0) {
      setTimeout(() => {
        thisInstance.setState({ alertSuccess: '' })
      }, 5000)
    }
  }
  // *********************************  Helpers  ********************************* */
  // ********************************************************************************** */
  filterChosenRoundsList() {
    const { activeSemester, language: langIndex, roundData } = this.props.routerStore
    const { roundIdList } = this.state

    const chosenRoundsList = activeSemester
      ? roundData[activeSemester].filter(({ roundId }) => roundIdList.indexOf(roundId) > -1)
      : []
    return chosenRoundsList
  }

  getCourseOfferingsNames(chosenRoundsList) {
    if (!chosenRoundsList) return ''

    const { activeSemester, language: langIndex } = this.props.routerStore

    const courseOfferings = chosenRoundsList.map(round => roundFullName(langIndex, activeSemester, round)).join(', ')
    return courseOfferings
  }

  // *********************************  FILE UPLOAD  ********************************* */
  // ********************************************************************************** */

  async handleUploadFile(id, file, e) {
    const { language: langIndex } = this.props.routerStore
    if (e.target.files[0].type === 'application/pdf') {
      try {
        const response = await this.sendRequest(id, file, e)
      } catch (err) {
        this.setState({
          notValid: ['savingToStorage'],
          alertError: i18n.messages[langIndex].messages.alert_storage_error,
        })
      }
    } else {
      const notValid = ['memoFile']
      this.setState({
        notValid,
        alertError: i18n.messages[langIndex].messages.alert_not_pdf,
      })
    }
  }

  sendRequest(id, file, e) {
    const thisInstance = this
    const { fileProgress } = this.state
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest()
      req.upload.addEventListener('progress', event => {
        if (event.lengthComputable) {
          fileProgress[id] = (event.loaded / event.total) * 100
          //console.log(fileProgress[id])
          this.setState({ fileProgress: fileProgress })
        }
      })

      req.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          fileProgress.pm = 0
          thisInstance.setState({
            memoFile: this.responseText,
            pdfMemoDate: getTodayDate(),
            alertSuccess: i18n.messages[thisInstance.props.routerStore.language].messages.alert_uploaded_file,
            notValid: [],
            alertError: '',
          })
        }
      }

      let formData = new FormData()
      const data = this.getMetadata('published')
      formData.append('file', e.target.files[0], e.target.files[0].name)
      formData.append('courseCode', data.courseCode)
      formData.append('memo', data.pm)
      formData.append('status', data.status)
      formData.append('koppsRoundIds', data.koppsRoundIds)
      req.open(
        'POST',
        `${this.props.routerStore.browserConfig.hostUrl}${
          this.props.routerStore.paths.storage.saveFile.uri.split(':')[0]
        }${this.props.routerStore.activeSemester}/${this.props.routerStore.courseCode}/${this.state.rounds}`
      )
      req.send(formData)
    })
  }

  getMetadata(status) {
    return {
      courseCode: this.props.routerStore.courseCode,
      pm: this.state.memoFile,
      status,
      koppsRoundIds: this.state.roundIdList.toString(),
    }
  }

  handleRemoveFile(fileName = '') {
    if (fileName.length > 0 || this.state.memoFile.length > 0) {
      this.props.routerStore.deleteFileInStorage(this.state.memoFile).then(result => {
        this.setState({ memoFile: '', hasNewUploadedFilePM: false })
      })
    }
  }

  //***************************** BUTTON CLICK HANDLERS ****************************** */
  //********************************************************************************** */

  handlePreview(event) {
    event.preventDefault()
    let invalidList = this.validateData()
    if (invalidList.length > 0) {
      this.setState({
        notValid: invalidList,
        alertError: i18n.messages[this.props.routerStore.language].messages.alert_empty_fields,
      })
    } else {
      this.setState({
        isPreviewMode: true,
        progress: 'preview',
        alertError: '',
        notValid: invalidList,
      })
      window.scrollTo(0, 300)
    }
  }

  handleBack(event) {
    event.preventDefault()
    const thisAdminPage = this
    const { routerStore } = this.props
    if (this.state.progress === 'edit') {
      this.props.history.push(routerStore.browserConfig.proxyPrefixPath.uri + '/' + routerStore.courseCode)
      if (routerStore.semesters.length === 0) {
        return routerStore
          .getCourseInformation(routerStore.courseCode, routerStore.user, routerStore.language)
          .then(courseData => {
            thisAdminPage.setState({
              isPreviewMode: false,
              progress: 'back_new',
              alert: '',
            })
          })
      }
      this.setState({
        isPreviewMode: false,
        progress: 'back_new',
        alert: '',
      })
    }
    if (this.state.isPreviewMode) {
      this.setState({
        isPreviewMode: false,
        progress: 'edit',
        alert: '',
      })
    }
  }

  handleCancel(event) {
    const { memoFile } = this.state
    if (memoFile.length > 0) {
      this.handleRemoveFile()
    }

    const { modalOpen: modal } = this.state
    modal.cancel = false
    this.setState({ modalOpen: modal })
    window.location = `${SERVICE_URL.admin}${this.props.routerStore.courseCode}?serv=pm&event=cancel`
  }

  handlePublish(event, fromModal = false) {
    if (!fromModal) {
      event.preventDefault()
    }
    const { routerStore } = this.props
    const thisInstance = this
    const { memoFile, pdfMemoDate } = this.state
    const { modalOpen: modal } = this.state
    const metadata = this.getMetadata('published')
    routerStore.updateFileInStorage(memoFile, metadata)

    return this.props.routerStore
      .postMemoData(routerStore.newMemoList, memoFile, pdfMemoDate)
      .then(response => {
        modal.publish = false
        if (response.status >= 400 || response === undefined || response.message) {
          this.setState({
            alert: response.message ? response.message : 'No connection with data base',
            modalOpen: modal,
          })
          return 'ERROR-' + response.status
        }
        // if no error go to admin start page
        thisInstance.setState({
          saved: true,
          modalOpen: modal,
        })
        const { hostUrl } = routerStore.browserConfig
        const { roundsIdWithPdfVersion = {} } = routerStore.usedRounds
        const { activeSemester, courseCode, language: langIndex } = routerStore
        let publishType = 'pub'
        const chosenRoundsList = this.filterChosenRoundsList()
        const courseOfferings = this.getCourseOfferingsNames(chosenRoundsList)
        const versions = chosenRoundsList
          .map(({ roundId }) => {
            const prevFile = roundsIdWithPdfVersion[roundId]
            const { version: prevVersion = 0 } = prevFile ? prevFile : {}
            const newVersion = Number(prevVersion) + 1
            if (newVersion && newVersion > 1) publishType = 'pub_changed'
            return `Ver ${newVersion}`
          })
          .join(', ')
        window.location = encodeURI(
          `${hostUrl}${SERVICE_URL.admin}${courseCode}?serv=pm&name=${courseOfferings}&term=${activeSemester}&event=${publishType}&ver=${versions}`
        )
      })
      .catch(err => {
        console.log('err', err)
        // this.setAlarm("danger", "errWhileSaving");
        if (err.response) {
          throw new Error(err.message)
        }
        throw err
      })
  }

  //* *********************** OTHER **************************** */
  //* ********************************************************** */

  editMode(semester, rounds, tempData, usedRoundSelected) {
    const thisAdminPage = this
    const newMemoList = this.props.routerStore.createMemoData(semester, rounds)
    thisAdminPage.setState({
      progress: 'edit',
      isPreviewMode: false,
      memoFile: tempData !== null ? tempData.memoFile : '',
      pdfMemoDate: tempData !== null ? tempData.pdfMemoDate : '',
      alert: '',
      roundIdList: rounds,
      usedRoundSelected,
    })
  }

  toggleModal(event) {
    const { modalOpen } = this.state
    modalOpen[event.target.id] = !modalOpen[event.target.id]
    this.setState({
      modalOpen,
    })
  }

  handleInputChange(event) {
    this.setState({
      pdfMemoDate: event.target.value,
      notValid: [],
      alertError: '',
    })
  }

  validateData() {
    const invalidList = []
    if (this.state.memoFile.length === 0) {
      invalidList.push('memoFile')
    }
    return invalidList
  }

  getTempData() {
    if (this.state.progress === 'back_new') {
      const { memoFile, roundIdList, pdfMemoDate, usedRoundSelected } = this.state
      return { roundIdList, memoFile, pdfMemoDate, usedRoundSelected }
    }
    return null
  }

  // eslint-disable-next-line class-methods-use-this
  handleTemporaryData(tempData) {
    const returnObject = {
      files: {
        memoFile: '',
      },
    }
    if (tempData) {
      returnObject.files.memoFile = tempData.memoFile
    }
    return returnObject
  }

  render() {
    const { routerStore } = this.props
    const { fileProgress, roundIdList } = this.state
    const { activeSemester, courseCode, language: langIndex, roundData } = routerStore

    const translate = i18n.messages[langIndex].messages

    const chosenRoundsList = this.filterChosenRoundsList()
    const courseOfferings = this.getCourseOfferingsNames(chosenRoundsList)

    const semesterName = activeSemester
      ? `${translate.course_short_semester[activeSemester.toString().match(/.{1,4}/g)[1]]} ${
          activeSemester.toString().match(/.{1,4}/g)[0]
        }`
      : ''
    if (routerStore.newMemoList.length === 0 || this.state.progress === 'back_new')
      return (
        <div ref={this.divTop}>
          {routerStore.errorMessage.length === 0 ? (
            <div>
              <Title
                title={routerStore.courseTitle}
                language={langIndex}
                courseCode={courseCode}
                progress={1}
                header={translate.header_main}
                showProgressBar={true}
              />

              {/* ************************************************************************************ */}
              {/*                               PAGE1: MEMO MENU                             */}
              {/* ************************************************************************************ */}
              {routerStore.semesters.length === 0 ? (
                <Alert color="info" className="alert-margin">
                  {' '}
                  {translate.alert_no_rounds}{' '}
                </Alert>
              ) : (
                <MemoMenu
                  editMode={this.editMode}
                  semesterList={routerStore.semesters}
                  roundList={routerStore.roundData}
                  progress={this.state.progress}
                  activeSemester={activeSemester}
                  firstVisit={routerStore.newMemoList.length === 0}
                  status={routerStore.status}
                  tempData={/*this.state.saved ? {} : */ this.getTempData()}
                  saved={false}
                  handleRemoveFile={this.handleRemoveFile}
                />
              )}
            </div>
          ) : (
            <Alert className="alert-margin" color="info">
              {' '}
              {routerStore.errorMessage}
            </Alert>
          )}
        </div>
      )
    else
      return (
        <div
          key="kurs-pm-form-container"
          className="container"
          id="kurs-pm-form-container"
          ref={ref => (this._div = ref)}
        >
          {/************************************************************************************* */}
          {/*                     PAGE 2: EDIT  AND  PAGE 3: PREVIEW                               */}
          {/************************************************************************************* */}
          {(routerStore.errorMessage.length > 0 && (
            <Alert color="info" className="alert-margin">
              {routerStore.errorMessage}
            </Alert>
          )) || (
            <div>
              <Title
                title={routerStore.courseTitle}
                language={langIndex}
                courseCode={courseCode}
                progress={this.state.progress === 'edit' ? 2 : 3}
                header={translate.header_main}
                showProgressBar={routerStore.status !== 'preview'}
              />
              <div className="page-header-wrapper">
                {/* ---- Selected semester---- */}
                <div className="page-header-container section-50">
                  <h4>{translate.header_semester}</h4>
                  <p className="no-wrap">{semesterName}</p>
                </div>
                {/* ---- Name of selected memo(s) ---- */}
                <div className="page-header-container section-50">
                  <h4>{translate.header_course_offering}</h4>
                  <p>
                    {chosenRoundsList.map(round => (
                      <RoundLabel
                        key={'round' + round.roundId}
                        language={langIndex}
                        round={round}
                        semester={routerStore.activeSemester}
                        usedRounds={routerStore.usedRounds.usedRoundsIdList}
                        showAccessInfo={false}
                      />
                    ))}
                  </p>
                </div>
              </div>

              {/* Existing PDF memo alert */}
              {this.state.usedRoundSelected > 0 && (
                <Alert color="info" className="alert-margin">
                  {' '}
                  {translate.alert_have_published_memo}
                </Alert>
              )}
              {/* Accessability alert */}
              {this.state.progress === 'edit' && (
                <Alert color="info" className="alert-margin">
                  {`${translate.alert_accessability_link_before} `}
                  <a href={ACCESSABILITY_INTRANET_LINK[langIndex]}>{translate.alert_label_accessability_link}</a>
                  {` ${translate.alert_accessability_link_after} `}
                  <a href={`${ADMIN_COURSE_PM_DATA}${courseCode}?l=${langIndex === 0 ? 'en' : 'sv'}`}>
                    {translate.label_link_web_based_draft_memo}
                  </a>
                  {`.`}
                </Alert>
              )}
              {/************************************************************************************* */}
              {/*                                   PREVIEW                                           */}
              {/************************************************************************************* */}
              {routerStore.newMemoList.length > 0 && this.state.isPreviewMode && (
                <div>
                  {<h4>{translate.header_preview}</h4>}
                  <a
                    className="pdf-link"
                    href={`${routerStore.browserConfig.storageUri}${this.state.memoFile}`}
                    target="_blank"
                  >
                    {`${translate.link_pm} ${courseCode} ${semesterName}-${roundIdList.sort().join('-')}`}
                  </a>
                </div>
              )}
              <Row key="form" id="form-container">
                <Col sm="12" lg="12">
                  {/************************************************************************************* */}
                  {/*                                 EDIT FORM                                               */}
                  {/************************************************************************************* */}

                  {routerStore.newMemoList.length > 0 && !this.state.isPreviewMode && (
                    <Form className="admin-form">
                      {/* ----- ALERTS ----- */}

                      {this.state.alert.length > 0 && (
                        <Row>
                          <Alert color="info" className="alert-margin">
                            {this.state.alert}{' '}
                          </Alert>
                        </Row>
                      )}
                      {this.state.alertSuccess.length > 0 && (
                        <Row>
                          <Alert color="success">{this.state.alertSuccess} </Alert>
                        </Row>
                      )}
                      {this.state.alertError.length > 0 && (
                        <Row>
                          <Alert color="danger">{this.state.alertError} </Alert>
                        </Row>
                      )}

                      {/* FORM - FIRST COLUMN */}
                      <Row className="form-group">
                        <Col sm="6" className="col-form">
                          <h4>{translate.header_upload}</h4>

                          {/** ------- PM-FILE UPLOAD --------- */}
                          <FormLabel
                            translate={translate}
                            header={'header_upload_file_pm'}
                            id={'info_upload_course_memo'}
                          />
                          <UpLoad
                            id="pm"
                            key="pm"
                            handleUpload={this.handleUploadFile}
                            progress={fileProgress.pm}
                            path={routerStore.browserConfig.proxyPrefixPath.uri}
                            file={this.state.memoFile}
                            notValid={this.state.notValid}
                            handleRemoveFile={this.handleRemoveFile}
                            type="memoFile"
                          />
                          <br />
                          <br />
                        </Col>

                        <Col sm="4" className="col-form"></Col>
                      </Row>
                    </Form>
                  )}
                  {/************************************************************************************* */}
                  {/*                                BUTTONS FOR PAG 2 AND 3                              */}
                  {/************************************************************************************* */}

                  <Row className="button-container text-center">
                    <Col sm="4" className="align-left-sm-center">
                      {routerStore.status === 'preview' ? (
                        ''
                      ) : (
                        <Button className="back" color="secondary" id="back" key="back" onClick={this.handleBack}>
                          {this.state.isPreviewMode ? translate.btn_back_edit : translate.btn_back}
                        </Button>
                      )}
                    </Col>
                    <Col sm="3" className="align-right-sm-center">
                      {routerStore.status !== 'preview' && (
                        <Button color="secondary" id="cancel" key="cancel" onClick={this.toggleModal}>
                          {translate.btn_cancel}
                        </Button>
                      )}
                    </Col>
                    <Col sm="3"></Col>
                    <Col sm="2">
                      {routerStore.status !== 'preview' && (
                        <span>
                          {(this.state.isPreviewMode && (
                            <Button color="success" id="publish" key="publish" onClick={this.toggleModal}>
                              {translate.btn_publish}
                            </Button>
                          )) || (
                            <Button
                              className="next"
                              color="success"
                              id="preview"
                              key="preview"
                              onClick={this.handlePreview}
                            >
                              {translate.btn_preview}
                            </Button>
                          )}
                        </span>
                      )}
                    </Col>
                  </Row>
                </Col>
              </Row>
              {/************************************************************************************* */}
              {/*                               MODALS FOR PUBLISH AND CANCEL                         */}
              {/************************************************************************************* */}
              <InfoModal
                type="publish"
                toggle={this.toggleModal}
                isOpen={this.state.modalOpen.publish}
                id={'publish'}
                handleConfirm={this.handlePublish}
                infoText={
                  this.state.usedRoundSelected > 0
                    ? translate.info_publish_new_version
                    : translate.info_publish_first_time
                }
                langIndex={langIndex}
                courseCode={courseCode}
                semester={semesterName}
                courseOfferings={courseOfferings}
              />
              <InfoModal
                type="cancel"
                toggle={this.toggleModal}
                isOpen={this.state.modalOpen.cancel}
                id={'cancel'}
                handleConfirm={this.handleCancel}
                infoText={translate.info_cancel}
              />
            </div>
          )}
        </div>
      )
  }
}

const FormLabel = ({ translate, header, id }) => {
  return (
    <span className="inline-flex">
      <Label>{translate[header]} </Label>
      <InfoButton id={id} textObj={translate[id]} />
    </span>
  )
}

export default AdminPage
