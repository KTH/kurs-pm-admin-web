import React, { useEffect, useReducer } from 'react'
import { Row, Col, Button, Form, Label, Alert } from 'reactstrap'
import { useWebContext } from '../context/WebContext'
import { useNavigate } from 'react-router-dom'

// Components
import Title from '../components/Title'
import MemoMenu from '../components/MemoMenu'
import InfoModal from '../components/InfoModal'
import UpLoad from '../components/UpLoad'
import RoundLabel, { roundFullName } from '../components/RoundLabel'
import { ActionModalButton } from '@kth/kth-reactstrap/dist/components/utbildningsinfo'

// Helpers
import { SERVICE_URL, ACCESSABILITY_INTRANET_LINK, ADMIN_COURSE_PM_DATA } from '../util/constants'
import { getTodayDate } from '../util/helpers'
import i18n from '../../../../i18n/index'
import FormHeaderAndInfo from '../components/FormHeaderAndInfo'

const paramsReducer = (state, action) => ({ ...state, ...action })

function AdminPage(props) {
  const [store] = useWebContext()

  const [state, setState] = useReducer(paramsReducer, {
    saved: false, //TO DELETE
    progress: store.status === 'new' ? 'new' : 'edit',
    isPreviewMode: store.status === 'preview',
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
  })

  const { progress, isPreviewMode } = state
  const { alertSuccess, fileProgress, roundIdList } = state

  const { activeSemester, courseCode, language: langIndex, roundData } = store

  const translate = i18n.messages[langIndex].messages

  const chosenRoundsList = filterChosenRoundsList()
  const courseOfferings = getCourseOfferingsNames(chosenRoundsList)

  const semesterName = activeSemester
    ? `${translate.course_short_semester[activeSemester.toString().match(/.{1,4}/g)[1]]} ${
        activeSemester.toString().match(/.{1,4}/g)[0]
      }`
    : ''

  useEffect(() => {
    let isMounted = true
    if (isMounted && alertSuccess.length > 0) {
      setTimeout(() => {
        setState({ alertSuccess: '' })
      }, 5000)
    }
    return () => (isMounted = false)
  }, [alertSuccess])

  // *********************************  Helpers  ********************************* */
  // ********************************************************************************** */
  function filterChosenRoundsList() {
    const { activeSemester, language: langIndex, roundData } = store
    const { roundIdList } = state

    const chosenRoundsList = activeSemester
      ? roundData[activeSemester].filter(({ roundId }) => roundIdList.indexOf(roundId) > -1)
      : []
    return chosenRoundsList
  }

  function getCourseOfferingsNames(chosenRoundsList) {
    if (!chosenRoundsList) return ''

    const { activeSemester, language: langIndex } = store

    const courseOfferings = chosenRoundsList.map(round => roundFullName(langIndex, activeSemester, round)).join(', ')
    return courseOfferings
  }

  // *********************************  FILE UPLOAD  ********************************* */
  // ********************************************************************************** */

  async function handleUploadFile(id, file, e) {
    const { language: langIndex } = store
    if (e.target.files[0].type === 'application/pdf') {
      try {
        const response = await sendRequest(id, file, e)
      } catch (err) {
        setState({
          notValid: ['savingToStorage'],
          alertError: i18n.messages[langIndex].messages.alert_storage_error,
        })
      }
    } else {
      const notValid = ['memoFile']
      setState({
        notValid,
        alertError: i18n.messages[langIndex].messages.alert_not_pdf,
      })
    }
  }

  function sendRequest(id, file, e) {
    const { fileProgress } = state
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest()
      req.upload.addEventListener('progress', event => {
        if (event.lengthComputable) {
          fileProgress[id] = (event.loaded / event.total) * 100
          setState({ fileProgress: fileProgress })
        }
      })

      req.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          fileProgress.pm = 0
          setState({
            memoFile: this.responseText,
            pdfMemoDate: getTodayDate(),
            alertSuccess: i18n.messages[store.language].messages.alert_uploaded_file,
            notValid: [],
            alertError: '',
          })
        }
      }

      let formData = new FormData()
      const data = getMetadata('published')
      formData.append('file', e.target.files[0], e.target.files[0].name)
      formData.append('courseCode', data.courseCode)
      formData.append('memo', data.pm)
      formData.append('status', data.status)
      formData.append('koppsRoundIds', data.koppsRoundIds)
      req.open(
        'POST',
        `${store.browserConfig.hostUrl}${store.paths.storage.saveFile.uri.split(':')[0]}${store.activeSemester}/${
          store.courseCode
        }/${state.rounds}`
      )
      req.send(formData)
    })
  }

  function getMetadata(status) {
    return {
      courseCode: store.courseCode,
      pm: state.memoFile,
      status,
      koppsRoundIds: state.roundIdList.toString(),
    }
  }

  function handleRemoveFile(fileName = '') {
    if (fileName.length > 0 || state.memoFile.length > 0) {
      store.deleteFileInStorage(state.memoFile).then(result => {
        setState({ memoFile: '', hasNewUploadedFilePM: false })
      })
    }
  }

  //***************************** BUTTON CLICK HANDLERS ****************************** */
  //********************************************************************************** */

  function handlePreview(event) {
    event.preventDefault()
    let invalidList = validateData()
    if (invalidList.length > 0) {
      setState({
        notValid: invalidList,
        alertError: i18n.messages[store.language].messages.alert_empty_fields,
      })
    } else {
      setState({
        isPreviewMode: true,
        progress: 'preview',
        alertError: '',
        notValid: invalidList,
      })
      window.scrollTo(0, 300)
    }
  }

  function handleBack(event) {
    event.preventDefault()
    if (progress === 'edit') {
      if (store.semesters.length === 0) {
        return store.getCourseInformation(store.courseCode, store.user, store.language).then(courseData =>
          setState({
            isPreviewMode: false,
            progress: 'back_new',
            alert: '',
          })
        )
      }
      setState({
        isPreviewMode: false,
        progress: 'back_new',
        alert: '',
      })
    }
    if (state.isPreviewMode) {
      setState({
        isPreviewMode: false,
        progress: 'edit',
        alert: '',
      })
    }
  }

  function handleCancel(event) {
    const { memoFile } = state
    if (memoFile.length > 0) {
      handleRemoveFile()
    }

    const { modalOpen: modal } = state
    modal.cancel = false
    setState({ modalOpen: modal })
    window.location = `${SERVICE_URL.admin}${store.courseCode}?serv=pm&event=cancel`
  }

  function handlePublish(event, fromModal = false) {
    if (!fromModal) {
      event.preventDefault()
    }
    const { memoFile, pdfMemoDate } = state
    const { modalOpen: modal } = state
    const metadata = getMetadata('published')
    store.updateFileInStorage(memoFile, metadata)

    return store
      .postMemoData(store.newMemoList, memoFile, pdfMemoDate)
      .then(response => {
        modal.publish = false
        if (response.status >= 400 || response === undefined || response.message) {
          setState({
            alert: response.message ? response.message : 'No connection with data base',
            modalOpen: modal,
          })
          return 'ERROR-' + response.status
        }
        // if no error go to admin start page
        setState({
          saved: true,
          modalOpen: modal,
        })
        const { hostUrl } = store.browserConfig
        const { roundsIdWithPdfVersion = {} } = store.usedRounds
        const { activeSemester, courseCode, language: langIndex } = store
        let publishType = 'pub'
        const chosenRoundsList = filterChosenRoundsList()
        const courseOfferings = getCourseOfferingsNames(chosenRoundsList)
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
        // this.setAlarm("danger", "errWhileSaving");
        if (err.response) {
          throw new Error(err.message)
        }
        throw err
      })
  }

  //* *********************** OTHER **************************** */
  //* ********************************************************** */

  function editMode(semester, rounds, tempData, usedRoundSelected) {
    const newMemoList = store.createMemoData(semester, rounds)

    setState({
      progress: 'edit',
      isPreviewMode: false,
      memoFile: tempData !== null ? tempData.memoFile : '',
      pdfMemoDate: tempData !== null ? tempData.pdfMemoDate : '',
      alert: '',
      roundIdList: rounds,
      usedRoundSelected,
    })
  }

  function toggleModal(event) {
    const { modalOpen } = state
    modalOpen[event.target.id] = !modalOpen[event.target.id]
    setState({
      modalOpen,
    })
  }

  function handleInputChange(event) {
    setState({
      pdfMemoDate: event.target.value,
      notValid: [],
      alertError: '',
    })
  }

  function validateData() {
    const invalidList = []
    if (state.memoFile.length === 0) {
      invalidList.push('memoFile')
    }
    return invalidList
  }

  function getTempData() {
    if (progress === 'back_new') {
      const { memoFile, roundIdList, pdfMemoDate, usedRoundSelected } = state
      return { roundIdList, memoFile, pdfMemoDate, usedRoundSelected }
    }
    return null
  }

  // eslint-disable-next-line class-methods-use-this
  function handleTemporaryData(tempData) {
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

  if (store.newMemoList.length === 0 || progress === 'back_new')
    return (
      <div className="kip-container">
        {store.errorMessage.length === 0 ? (
          <>
            <Title
              title={store.courseTitle}
              language={langIndex}
              courseCode={courseCode}
              progress={1}
              header={translate.header_main}
              showProgressBar={true}
            />

            {/* ************************************************************************************ */}
            {/*                               PAGE1: MEMO MENU                             */}
            {/* ************************************************************************************ */}
            {store.semesters.length === 0 ? (
              <Row key="no-rounds" className="w-100 my-0 mx-auto upper-alert">
                <Alert color="info"> {translate.alert_no_rounds_selected} </Alert>
              </Row>
            ) : (
              <MemoMenu
                editMode={editMode}
                semesterList={store.semesters}
                roundList={store.roundData}
                progress={progress}
                activeSemester={activeSemester}
                firstVisit={store.newMemoList.length === 0}
                status={store.status}
                tempData={/*state.saved ? {} : */ getTempData()}
                saved={false}
                handleRemoveFile={handleRemoveFile}
                store={store}
              />
            )}
          </>
        ) : (
          <Row key="error-message" className="w-100 my-0 mx-auto upper-alert">
            <Alert color="info"> {store.errorMessage}</Alert>
          </Row>
        )}
      </div>
    )
  else
    return (
      <div key="kurs-pm-form-container" className="kip-container" id="kurs-pm-form-container">
        {/************************************************************************************* */}
        {/*                     PAGE 2: EDIT  AND  PAGE 3: PREVIEW                               */}
        {/************************************************************************************* */}
        {(store.errorMessage.length > 0 && (
          <Row key="error-message-alert" className="w-100 my-0 mx-auto upper-alert">
            <Alert color="info">{store.errorMessage}</Alert>
          </Row>
        )) || (
          <div>
            <Title
              title={store.courseTitle}
              language={langIndex}
              courseCode={courseCode}
              progress={progress === 'edit' ? 2 : 3}
              header={translate.header_main}
              showProgressBar={store.status !== 'preview'}
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
                      semester={store.activeSemester}
                      usedRounds={store.usedRounds.usedRoundsIdList}
                      showAccessInfo={false}
                    />
                  ))}
                </p>
              </div>
            </div>

            {/* Existing PDF memo alert */}
            {state.usedRoundSelected > 0 && (
              <Row key="have-published-memo-message-alert" className="w-100 my-0 mx-auto upper-alert">
                <Alert color="info"> {translate.alert_have_published_memo}</Alert>
              </Row>
            )}
            {/* Accessability alert */}
            {progress === 'edit' && (
              <Row key="think-about-accessability-message-alert" className="w-100 my-0 mx-auto upper-alert">
                <Alert color="info">
                  {`${translate.alert_accessability_link_before} `}
                  <a href={ACCESSABILITY_INTRANET_LINK[langIndex]} rel="noreferrer" target="_blank">
                    {translate.alert_label_accessability_link}
                  </a>
                  {` ${translate.alert_accessability_link_after} `}
                  {state.usedRoundSelected < 1 && (
                    <>
                      {` ${translate.alert_web_memo_support} `}
                      <a href={`${ADMIN_COURSE_PM_DATA}${courseCode}?l=${langIndex === 0 ? 'en' : 'sv'}`}>
                        {translate.label_link_web_based_draft_memo}
                      </a>
                      {`.`}
                    </>
                  )}
                </Alert>
              </Row>
            )}
            {/* ----- ALERTS ----- */}

            {state.alert.length > 0 && (
              <Row key="dynamic-alert-message" className="w-100 my-0 mx-auto upper-alert">
                <Alert color="info">{state.alert} </Alert>
              </Row>
            )}
            {alertSuccess.length > 0 && (
              <Row key="success-alert" className="w-100 my-0 mx-auto upper-alert">
                <Alert color="success">{alertSuccess} </Alert>
              </Row>
            )}
            {state.alertError.length > 0 && (
              <Row key="error-alert" className="w-100 my-0 mx-auto upper-alert">
                <Alert color="danger">{state.alertError} </Alert>
              </Row>
            )}
            {/************************************************************************************* */}
            {/*                                   PREVIEW                                           */}
            {/************************************************************************************* */}
            {store.newMemoList.length > 0 && state.isPreviewMode && (
              <Row className="preview-form">
                <Col>
                  <h2 className="section-50">{translate.header_preview}</h2>
                  <h3>{translate.subheader_preview}</h3>

                  <a className="pdf-link" href={`${store.browserConfig.storageUri}${state.memoFile}`} target="_blank">
                    {`${translate.link_pm} ${courseCode} ${semesterName}-${roundIdList.sort().join('-')}`}
                  </a>
                </Col>
              </Row>
            )}

            {/* ----- FORM ----- */}

            <Row key="form" id="form-container">
              <Col sm="12" lg="12">
                {/************************************************************************************* */}
                {/*                                 EDIT FORM                                               */}
                {/************************************************************************************* */}

                {store.newMemoList.length > 0 && !state.isPreviewMode && (
                  <Form className="admin-form">
                    {/* FORM - FIRST COLUMN */}
                    <Row className="form-group">
                      <Col sm="6">
                        <h2 className="section-50">{translate.header_upload_memo}</h2>
                        <FormHeaderAndInfo
                          translate={translate}
                          headerId={'header_upload'}
                          infoId={'info_upload_course_memo'}
                        />
                        <p>
                          <Label>{translate.header_upload_file_pm}</Label>
                        </p>
                        {/** ------- PM-FILE UPLOAD --------- */}

                        <UpLoad
                          id="pm"
                          key="pm"
                          handleUpload={handleUploadFile}
                          progress={fileProgress.pm}
                          path={store.browserConfig.proxyPrefixPath.uri}
                          file={state.memoFile}
                          notValid={state.notValid}
                          handleRemoveFile={handleRemoveFile}
                          type="memoFile"
                        />
                        <br />
                        <br />
                      </Col>

                      <Col sm="4"></Col>
                    </Row>
                  </Form>
                )}
                {/************************************************************************************* */}
                {/*                                BUTTONS FOR PAG 2 AND 3                              */}
                {/* In case user can edit, othervise only preview is avalilable without control button  */}
                {/************************************************************************************* */}
                {store.status !== 'preview' && (
                  <Row className="button-container text-center">
                    <Col sm="4" className="align-left-sm-center">
                      <Button className="back" color="secondary" id="back" key="back" onClick={handleBack}>
                        {state.isPreviewMode ? translate.btn_back_edit : translate.btn_back}
                      </Button>
                    </Col>
                    <Col sm="3" className="align-right-sm-center">
                      <Button color="secondary" id="cancel" key="cancel" onClick={toggleModal}>
                        {translate.btn_cancel}
                      </Button>
                    </Col>
                    <Col sm="3"></Col>
                    <Col sm="2">
                      <span>
                        {(state.isPreviewMode && (
                          <Button color="success" id="publish" key="publish" onClick={toggleModal}>
                            {translate.btn_publish}
                          </Button>
                        )) || (
                          <Button className="next" color="success" id="preview" key="preview" onClick={handlePreview}>
                            {translate.btn_preview}
                          </Button>
                        )}
                      </span>
                    </Col>
                  </Row>
                )}
              </Col>
            </Row>
            {/************************************************************************************* */}
            {/*                               MODALS FOR PUBLISH AND CANCEL                         */}
            {/************************************************************************************* */}
            <InfoModal
              type="publish"
              toggle={toggleModal}
              isOpen={state.modalOpen.publish}
              id={'publish'}
              handleConfirm={handlePublish}
              infoText={
                state.usedRoundSelected > 0 ? translate.info_publish_new_version : translate.info_publish_first_time
              }
              langIndex={langIndex}
              courseCode={courseCode}
              semester={semesterName}
              courseOfferings={courseOfferings}
            />
            <InfoModal
              type="cancel"
              toggle={toggleModal}
              isOpen={state.modalOpen.cancel}
              id={'cancel'}
              handleConfirm={handleCancel}
              infoText={translate.info_cancel}
            />
          </div>
        )}
      </div>
    )
}

export default AdminPage
