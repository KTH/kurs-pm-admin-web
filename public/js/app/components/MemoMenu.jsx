import React, { useReducer } from 'react'
import { Form, FormGroup, Label, Input } from 'reactstrap'
import { EducationalInstanceStatus } from '@kth/om-kursen-ladok-client'
import i18n from '../../../../i18n/index'
import { SERVICE_URL } from '../util/constants'
import Alert from '../components-shared/Alert'
import Button from '../components-shared/Button'

// Custom components
import { seasonStr } from '../utils-shared/helpers'
import Dropdown from '../components-shared/Dropdown'
import InfoModal from './InfoModal'
import RoundLabel from './RoundLabel'
import FormHeaderAndInfo from './FormHeaderAndInfo'

const paramsReducer = (state, action) => ({ ...state, ...action })

function MemoMenu(props) {
  const {
    context: rawContext,
    firstVisit: initfirstVisit,
    progress: initProgress,
    activeSemester: initSemester,
    tempData: initTempData,
    editMode,
    handleRemoveFile,
  } = props
  const context = React.useMemo(() => rawContext, [rawContext])
  const [state, setState] = useReducer(paramsReducer, {
    alertMsg: '',
    firstVisit: initfirstVisit,
    collapseOpen: initProgress === 'back_new',
    modalOpen: {
      delete: false,
      info: false,
      cancel: false,
    },
    semester: initSemester && initSemester.length > 0 ? initSemester : '',
    rounds: initTempData ? initTempData.applicationCodes : [],
    usedRounds: context.usedRounds.usedRoundsApplicationCodeList || [],
    usedRoundsWithWebVer: context.usedRounds.roundsApplicationCodeWithWebVersion || {},

    temporaryData: initTempData,
    newSemester: false,
    usedRoundSelected: initTempData ? initTempData.usedRoundSelected : 0,
  })

  // ******************************* SEMESTER DROPDOWN ******************************* */
  // ********************************************************************************** */
  // eslint-disable-next-line react/sort-comp

  const handleSelectedSemester = selectedSemester => {
    function getUsedRounds(semester) {
      return context.getUsedRounds(context.courseData.courseCode, semester).then(() => {
        setState({
          semester,
          usedRounds: context.usedRounds.usedRoundsApplicationCodeList || [],
          usedRoundsWithWebVer: context.usedRounds.roundsApplicationCodeWithWebVersion || {},
          lastSelected: state.lastSelected,
          alertMsg: '',
        })
      })
    }
    getUsedRounds(selectedSemester)
    setState({
      semester: selectedSemester,
      collapseOpen: true,
      firstVisit: false,
      rounds: [],
      newSemester: true,
    })
  }

  // ** ********************** CHECKBOXES AND RADIO BUTTONS **************************** */
  // ** ******************************************************************************** */
  function handleRoundCheckbox(ev) {
    ev.persist()
    const prevState = { ...state }
    const { alertMsg, rounds } = state

    if (alertMsg.length > 0) {
      prevState.alertMsg = ''
    }

    if (ev.target.checked) {
      prevState.rounds.push(ev.target.id)
      ev.target.getAttribute('data-hasfile') === 'true' ? prevState.usedRoundSelected++ : prevState.usedRoundSelected
      setState(prevState)
    } else {
      prevState.rounds.splice(rounds.indexOf(ev.target.id), 1)
      ev.target.getAttribute('data-hasfile') === 'true' ? prevState.usedRoundSelected-- : prevState.usedRoundSelected
      setState(prevState)
    }
  }

  // ** ********************** SUBMIT BUTTONS **************************** */
  // ** ****************************************************************** */

  function goToEditMode(ev) {
    ev.preventDefault()
    const { rounds, semester, temporaryData, usedRoundSelected } = state

    if (rounds.length > 0) {
      editMode(semester, rounds, temporaryData, usedRoundSelected)
    } else {
      setState({
        alertMsg: i18n.messages[context.language].messages.alert_no_rounds_selected,
      })
    }
  }

  function handleCancel() {
    const { temporaryData } = state
    if (temporaryData !== null && temporaryData.memoFile.length > 0) {
      handleRemoveFile(temporaryData.memoFile)
    }
    const { modalOpen: modal } = state
    modal.cancel = false
    setState({ modalOpen: modal })
    window.location = `${SERVICE_URL.admin}${context.courseCode}?serv=pm&event=cancel`
  }

  function toggleModal(ev, id) {
    const modalid = id || ev.target.id
    const { modalOpen } = state
    modalOpen[modalid] = !modalOpen[modalid]
    setState({
      modalOpen,
    })
  }
  // ** ****************************************************************** */
  // ** **************************** OTHER ******************************* */

  const { semesterList, roundList } = props
  const semesterDropdownOptions = semesterList.map(({ term }) => ({
    value: term,
    text: seasonStr(context.language, term),
  }))
  const translate = i18n.messages[context.language].messages
  const { select_semester: selectSemester } = translate
  const {
    alertMsg,
    canOnlyPreview,
    collapseOpen,
    firstVisit,
    modalOpen,
    semester,
    rounds,
    usedRounds,
    usedRoundsWithWebVer,
  } = state
  return (
    <div className="memo-menu" id="YearAndRounds">
      {/** *********************************************************************************** */}
      {/*                                  SEMESTER DROPDOWN                                  */}
      {/** *********************************************************************************** */}

      <div>
        <h2>{translate.header_memo_menu}</h2>
        <FormHeaderAndInfo infoId="info_select_semester" header={selectSemester} translate={translate} />
        <form>
          <div className="form-group">
            <Dropdown
              placeholderText={selectSemester}
              onChange={handleSelectedSemester}
              options={semesterDropdownOptions}
              selectedSemester={semester}
            />
          </div>
        </form>
      </div>

      {alertMsg.length > 0 && <Alert type="warning">{` ${alertMsg}`}</Alert>}

      {/** *********************************************************************************** */}
      {/*                              SELECT BUTTONS FOR  ROUNDS                             */}
      {/** *********************************************************************************** */}
      {collapseOpen && (
        <div>
          {semester.length > 0 && (
            <Form>
              <FormHeaderAndInfo
                infoId="info_choose_course_offering"
                headerId="header_memo_menu"
                translate={translate}
              />

              <div>
                {/** *********************************************************************************** */}
                {/*                           ROUND LIST FOR SELECTED SEMESTER                          */}
                {/** *********************************************************************************** */}
                {roundList[semester].length > 0 && (
                  <>
                    <p className="form-intro-paragraph">{translate.intro_new}</p>
                    {roundList[semester].map(round => {
                      const { canBeAccessedByUser, applicationCode } = round
                      const hasBeenUsed = usedRounds.includes(applicationCode) || false
                      const hasWebVersion = Object.keys(usedRoundsWithWebVer).includes(applicationCode) || false
                      const hasPublishedPdf = hasBeenUsed && !hasWebVersion
                      return (
                        (round.status === EducationalInstanceStatus.Started ||
                          round.status === EducationalInstanceStatus.Complete ||
                          round.isFull) && (
                          <FormGroup className="form-check" key={applicationCode}>
                            <Input
                              type="checkbox"
                              id={applicationCode}
                              key={'checkbox' + applicationCode}
                              onChange={handleRoundCheckbox}
                              checked={rounds.includes(applicationCode)}
                              name={applicationCode}
                              disabled={!canBeAccessedByUser || hasWebVersion}
                              data-hasfile={hasPublishedPdf}
                            />
                            <Label key={'Label' + applicationCode} for={applicationCode}>
                              <RoundLabel
                                key={'round' + applicationCode}
                                language={context.language}
                                round={round}
                                semester={semester}
                                hasPublishedPdf={hasPublishedPdf}
                                hasWebVersion={hasWebVersion}
                                webVersionInfo={hasWebVersion ? usedRoundsWithWebVer[applicationCode] : {}}
                                showAccessInfo
                              />
                            </Label>
                          </FormGroup>
                        )
                      )
                    })}
                  </>
                )}
              </div>
            </Form>
          )}
        </div>
      )}
      {/** *********************************************************************************** */}
      {/*                              BUTTONS FOR MEMO MENU                                  */}
      {/** *********************************************************************************** */}
      <div className="control-buttons">
        <div />
        <div>
          <Button variant="secondary" id="cancel" key="cancel" onClick={toggleModal}>
            {translate.btn_cancel}
          </Button>
        </div>
        <div>
          {!firstVisit && !canOnlyPreview && (
            <Button variant="next" id="new" key="new" onClick={goToEditMode} disabled={firstVisit}>
              {translate.btn_add_memo}
            </Button>
          )}
        </div>
      </div>
      {/** *********************************************************************************** */}
      {/*                               MODALS FOR CANCEL                                     */}
      {/** *********************************************************************************** */}
      <InfoModal
        type="cancel"
        toggle={toggleModal}
        isOpen={modalOpen.cancel}
        id="cancel"
        handleConfirm={handleCancel}
        infoText={translate.info_cancel}
      />
    </div>
  )
}

export default MemoMenu
