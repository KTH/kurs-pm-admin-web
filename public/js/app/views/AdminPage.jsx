/* eslint-disable consistent-return */
import React, { useEffect, useReducer } from 'react'
import { Form, Label } from 'reactstrap'
import { useWebContext } from '../context/WebContext'
import Button from '../components-shared/Button'
import Alert from '../components-shared/Alert'

// Components
import Title from '../components/Title'
import MemoMenu from '../components/MemoMenu'
import InfoModal from '../components/InfoModal'
import UpLoad from '../components/UpLoad'
import RoundLabel, { roundFullName } from '../components/RoundLabel'

// Helpers
import { SERVICE_URL, ACCESSABILITY_INTRANET_LINK, ADMIN_COURSE_PM_DATA } from '../util/constants'
import { getTodayDate } from '../util/helpers'
import i18n from '../../../../i18n/index'
import FormHeaderAndInfo from '../components/FormHeaderAndInfo'
import { HTTP_CODE_400, getResponseMessage } from '../../../../common/ErrorUtils'

const paramsReducer = (state, action) => ({ ...state, ...action })

function AdminPage() {
  const [webContext] = useWebContext()

  const [state, setState] = useReducer(paramsReducer, {
    saved: false, // TO DELETE
    progress: webContext.status === 'new' ? 'new' : 'edit',
    isPreviewMode: webContext.status === 'preview',
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
    applicationCodes: [],
    usedRoundSelected: 0,
  })

  const { progress, isPreviewMode } = state
  const { alertSuccess, fileProgress, applicationCodes } = state

  const { activeSemester, browserConfig = {}, courseCode, language: langIndex, roundData } = webContext
  const { hostUrl, proxyPrefixPath, storageUri } = browserConfig

  const translate = i18n.messages[langIndex].messages

  // *********************************  Helpers  ********************************* */
  // ********************************************************************************** */
  function _filterChosenRoundsList() {
    const filteredChosenRoundsList = activeSemester
      ? roundData[activeSemester].filter(({ applicationCode }) => applicationCodes.indexOf(applicationCode) > -1)
      : []
    return filteredChosenRoundsList
  }

  function _getCourseOfferingsNames(list) {
    if (!list) return ''

    const courseOfferingsNames = list.map(round => roundFullName(langIndex, activeSemester, round)).join(', ')
    return courseOfferingsNames
  }

  const chosenRoundsList = _filterChosenRoundsList()
  const courseOfferings = _getCourseOfferingsNames(chosenRoundsList)

  const semesterName = activeSemester
    ? `${translate.course_short_semester[activeSemester.toString().match(/.{1,4}/g)[1]]} ${
        activeSemester.toString().match(/.{1,4}/g)[0]
      }`
    : ''

  useEffect(() => {
    let isMounted = true
    if (isMounted) {
      if (alertSuccess.length > 0) {
        setTimeout(() => {
          setState({ alertSuccess: '' })
        }, 5000)
      }

      const siteNameElement = document.querySelector('.block.siteName a')
      if (siteNameElement) {
        const languageParameter = langIndex === '0' ? '?l=en' : ''

        siteNameElement.href = `${SERVICE_URL.admin}${courseCode}${languageParameter}`
      }
    }
    return () => (isMounted = false)
  }, [alertSuccess])

  // *********************************  FILE UPLOAD  ********************************* */
  // ********************************************************************************** */

  function getMetadata(docStatus) {
    return {
      courseCode,
      pm: state.memoFile,
      status: docStatus,
      applicationCodes: state.applicationCodes.toString(),
    }
  }

  function sendRequest(id, file, e) {
    return new Promise(() => {
      const req = new XMLHttpRequest()
      req.upload.addEventListener('progress', fileEvent => {
        if (fileEvent.lengthComputable) {
          fileProgress[id] = (fileEvent.loaded / fileEvent.total) * 100
          setState({ fileProgress })
        }
      })

      req.onreadystatechange = function onReadyStateChange() {
        if (this.readyState == 4 && this.status == 200) {
          fileProgress.pm = 0
          setState({
            memoFile: this.responseText,
            pdfMemoDate: getTodayDate(),
            alertSuccess: i18n.messages[webContext.language].messages.alert_uploaded_file,
            notValid: [],
            alertError: '',
          })
        }
      }

      const formData = new FormData()
      const data = getMetadata('published')
      formData.append('file', e.target.files[0], e.target.files[0].name)
      formData.append('courseCode', data.courseCode)
      formData.append('memo', data.pm)
      formData.append('status', data.status)
      formData.append('applicationCodes', data.applicationCodes)
      req.open(
        'POST',
        `${hostUrl}${webContext.paths.storage.saveFile.uri.split(':')[0]}${activeSemester}/${courseCode}/${
          state.rounds
        }`
      )
      req.send(formData)
    })
  }

  async function handleUploadFile(id, file, e) {
    if (e.target.files[0].type === 'application/pdf') {
      try {
        await sendRequest(id, file, e)
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

  function handleRemoveFile(fileName = '') {
    if (fileName.length > 0 || state.memoFile.length > 0) {
      webContext.deleteFileInStorage(state.memoFile).then(() => {
        setState({ memoFile: '', hasNewUploadedFilePM: false })
      })
    }
  }

  // ***************************** BUTTON CLICK HANDLERS ****************************** */
  // ********************************************************************************** */

  function validateData() {
    const invalidList = []
    if (state.memoFile.length === 0) {
      invalidList.push('memoFile')
    }
    return invalidList
  }

  function handlePreview(event) {
    event.preventDefault()
    const invalidList = validateData()
    if (invalidList.length > 0) {
      setState({
        notValid: invalidList,
        alertError: i18n.messages[webContext.language].messages.alert_empty_fields,
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

  function handleBack(ev) {
    ev.preventDefault()
    if (progress === 'edit') {
      setState({
        isPreviewMode: false,
        progress: 'back_new',
        alert: '',
      })
    }
    if (isPreviewMode) {
      setState({
        isPreviewMode: false,
        progress: 'edit',
        alert: '',
      })
    }
  }

  function handleCancel() {
    const { memoFile } = state
    if (memoFile.length > 0) {
      handleRemoveFile()
    }

    const { modalOpen: modal } = state
    modal.cancel = false
    setState({ modalOpen: modal })
    window.location = `${SERVICE_URL.admin}${courseCode}?serv=pm&event=cancel`
  }

  function handlePublish(ev, fromModal = false) {
    if (!fromModal) {
      ev.preventDefault()
    }
    const { memoFile, pdfMemoDate } = state
    const { modalOpen: modal } = state
    const metadata = getMetadata('published')
    webContext.updateFileInStorage(memoFile, metadata)

    return webContext
      .postMemoData(webContext.newMemoList, memoFile, pdfMemoDate)
      .then(response => {
        modal.publish = false
        if (
          response.status >= HTTP_CODE_400 ||
          response.statusCode >= HTTP_CODE_400 ||
          response.message ||
          response.statusMessage
        ) {
          const alertMessage = getResponseMessage(response)
          setState({
            alert: alertMessage,
            modalOpen: modal,
          })
          return 'ERROR-' + response.status
        }
        // if no error go to admin start page
        setState({
          saved: true,
          modalOpen: modal,
        })
        const { roundsApplicationCodeWithPdfVersion = {} } = webContext.usedRounds
        let publishType = 'pub'
        const filteredChosenRoundsById = _filterChosenRoundsList()
        const courseOfferingsNames = _getCourseOfferingsNames(filteredChosenRoundsById)
        const versions = filteredChosenRoundsById
          .map(({ applicationCode }) => {
            const prevFile = roundsApplicationCodeWithPdfVersion[applicationCode]
            const { version: prevVersion = 0 } = prevFile ? prevFile : {}
            const newVersion = Number(prevVersion) + 1
            if (newVersion && newVersion > 1) publishType = 'pub_changed'
            return `Ver ${newVersion}`
          })
          .join(', ')
        window.location = encodeURI(
          `${hostUrl}${SERVICE_URL.admin}${courseCode}?serv=pm&name=${courseOfferingsNames}&term=${activeSemester}&event=${publishType}&ver=${versions}`
        )
      })
      .catch(err => {
        if (err.response) {
          throw new Error(err.message)
        }
        throw err
      })
  }

  //* *********************** OTHER **************************** */
  //* ********************************************************** */

  function editMode(semester, rounds, tempData, usedRoundSelected) {
    webContext.createMemoData(semester, rounds)

    setState({
      progress: 'edit',
      isPreviewMode: false,
      memoFile: tempData !== null ? tempData.memoFile : '',
      pdfMemoDate: tempData !== null ? tempData.pdfMemoDate : '',
      alert: '',
      applicationCodes: rounds,
      usedRoundSelected,
    })
  }

  function toggleModal(ev) {
    const { modalOpen } = state
    modalOpen[ev.target.id] = !modalOpen[ev.target.id]
    setState({
      modalOpen,
    })
  }

  function getTempData() {
    if (progress === 'back_new') {
      const { memoFile, pdfMemoDate, usedRoundSelected } = state
      return { applicationCodes, memoFile, pdfMemoDate, usedRoundSelected }
    }
    return null
  }

  if (webContext.newMemoList.length === 0 || progress === 'back_new')
    return (
      <div className="kip-container">
        {webContext.errorMessage.length === 0 ? (
          <>
            <Title
              title={webContext.courseTitle}
              language={langIndex}
              courseCode={courseCode}
              progress={1}
              header={translate.header_main}
              showProgressBar={true}
            />

            {/* ************************************************************************************ */}
            {/*                               PAGE1: MEMO MENU                             */}
            {/* ************************************************************************************ */}
            {webContext.semesters.length === 0 ? (
              <Alert type="info"> {translate.alert_no_rounds_selected} </Alert>
            ) : (
              <MemoMenu
                editMode={editMode}
                semesterList={webContext.semesters}
                roundList={webContext.roundData}
                progress={progress}
                activeSemester={activeSemester}
                firstVisit={webContext.newMemoList.length === 0}
                status={webContext.status}
                tempData={getTempData()}
                saved={false}
                handleRemoveFile={handleRemoveFile}
                context={webContext}
              />
            )}
          </>
        ) : (
          <Alert type="info"> {webContext.errorMessage}</Alert>
        )}
      </div>
    )
  else
    return (
      <div className="kip-container" id="kurs-pm-form-container">
        {/* ************************************************************************************ */}
        {/*                     PAGE 2: EDIT  AND  PAGE 3: PREVIEW                               */}
        {/* ************************************************************************************ */}
        {(webContext.errorMessage.length > 0 && <Alert type="info">{webContext.errorMessage}</Alert>) || (
          <div>
            <Title
              title={webContext.courseTitle}
              language={langIndex}
              courseCode={courseCode}
              progress={progress === 'edit' ? 2 : 3}
              header={translate.header_main}
              showProgressBar={webContext.status !== 'preview'}
            />
            <div className="page-header-wrapper">
              {/* ---- Selected semester---- */}
              <div className="page-header-container">
                <h4>{translate.header_semester}</h4>
                <p className="no-wrap">{semesterName}</p>
              </div>
              {/* ---- Name of selected memo(s) ---- */}
              <div className="page-header-container">
                <h4>{translate.header_course_offering}</h4>
                <p>
                  {chosenRoundsList.map(round => (
                    <RoundLabel
                      key={'round' + round.applicationCode}
                      language={langIndex}
                      round={round}
                      semester={activeSemester}
                      usedRounds={webContext.usedRounds.usedRoundsApplicationCodeList}
                      showAccessInfo={false}
                    />
                  ))}
                </p>
              </div>
            </div>

            {/* Existing PDF memo alert */}
            {state.usedRoundSelected > 0 && <Alert type="info"> {translate.alert_have_published_memo}</Alert>}

            {/* Accessability alert */}
            {progress === 'edit' && (
              <Alert type="info">
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
            )}
            {/* ----- ALERTS ----- */}

            {state.alert.length > 0 && <Alert type="info">{state.alert} </Alert>}
            {alertSuccess.length > 0 && <Alert type="success">{alertSuccess} </Alert>}
            {state.alertError.length > 0 && <Alert type="warning">{state.alertError} </Alert>}

            {/* ************************************************************************************ */}
            {/*                                   PREVIEW                                           */}
            {/* ************************************************************************************ */}
            {webContext.newMemoList.length > 0 && isPreviewMode && (
              <div className="preview-form">
                <h2>{translate.header_preview}</h2>
                <h3>{translate.subheader_preview}</h3>

                <a className="pdf-link" href={`${storageUri}${state.memoFile}`} target="_blank" rel="noreferrer">
                  {`${translate.link_pm} ${courseCode} ${semesterName}-${applicationCodes.sort().join('-')}`}
                </a>
              </div>
            )}

            {/* ----- FORM ----- */}

            <div id="form-container">
              {/* ************************************************************************************ */}
              {/*                                 EDIT FORM                                               */}
              {/* ************************************************************************************ */}

              {webContext.newMemoList.length > 0 && !isPreviewMode && (
                <Form className="admin-form">
                  {/* FORM - FIRST COLUMN */}
                  <div className="form-group">
                    <h2>{translate.header_upload_memo}</h2>
                    <FormHeaderAndInfo
                      translate={translate}
                      headerId={'header_upload'}
                      infoId={'info_upload_course_memo'}
                    />
                    <Label>{translate.header_upload_file_pm}</Label>
                    <UpLoad
                      id="pm"
                      key="pm"
                      handleUpload={handleUploadFile}
                      progress={fileProgress.pm}
                      path={proxyPrefixPath.uri}
                      file={state.memoFile}
                      notValid={state.notValid}
                      handleRemoveFile={handleRemoveFile}
                      type="memoFile"
                    />
                  </div>
                </Form>
              )}
              {/* ************************************************************************************ */}
              {/*                                BUTTONS FOR PAG 2 AND 3                              */}
              {/* In case user can edit, othervise only preview is avalilable without control button  */}
              {/* ************************************************************************************ */}
              {webContext.status !== 'preview' && (
                <div className="control-buttons">
                  <div>
                    <Button variant="previous" id="back" key="back" onClick={handleBack}>
                      {isPreviewMode ? translate.btn_back_edit : translate.btn_back}
                    </Button>
                  </div>
                  <div>
                    <Button variant="secondary" id="cancel" key="cancel" onClick={toggleModal}>
                      {translate.btn_cancel}
                    </Button>
                  </div>
                  <div>
                    <span>
                      {(isPreviewMode && (
                        <Button variant="success" id="publish" key="publish" onClick={toggleModal}>
                          {translate.btn_publish}
                        </Button>
                      )) || (
                        <Button variant="next" id="preview" key="preview" onClick={handlePreview}>
                          {translate.btn_preview}
                        </Button>
                      )}
                    </span>
                  </div>
                </div>
              )}
            </div>
            {/* ************************************************************************************ */}
            {/*                               MODALS FOR PUBLISH AND CANCEL                         */}
            {/* ************************************************************************************ */}
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
