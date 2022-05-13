import React, { useReducer } from 'react'
import {
  Alert,
  Form,
  Dropdown,
  FormGroup,
  Label,
  Input,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
  Button,
  Row,
  Col,
} from 'reactstrap'
import i18n from '../../../../i18n/index'
import { SERVICE_URL } from '../util/constants'
// Custom components
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
    dropdownOpen: false,
    collapseOpen: initProgress === 'back_new',
    modalOpen: {
      delete: false,
      info: false,
      cancel: false,
    },
    semester: initSemester && initSemester.length > 0 ? initSemester : '',
    rounds: initTempData ? initTempData.roundIdList : [],
    usedRounds: context.usedRounds.usedRoundsIdList || [],
    usedRoundsWithWebVer: context.usedRounds.roundsIdWithWebVersion || {},

    temporaryData: initTempData,
    newSemester: false,
    usedRoundSelected: initTempData ? initTempData.usedRoundSelected : 0,
  })

  // ******************************* SEMESTER DROPDOWN ******************************* */
  // ********************************************************************************** */
  // eslint-disable-next-line react/sort-comp
  function toggleDropdown(ev) {
    ev.preventDefault()
    const { dropdownOpen } = state
    setState({
      dropdownOpen: !dropdownOpen,
    })
  }

  function getUsedRounds(semester) {
    return context.getUsedRounds(context.courseData.courseCode, semester).then(result => {
      setState({
        semester,
        usedRounds: context.usedRounds.usedRoundsIdList || [],
        usedRoundsWithWebVer: context.usedRounds.roundsIdWithWebVersion || {},
        lastSelected: state.lastSelected,
        alertMsg: '',
      })
    })
  }

  function handleSelectedSemester(ev) {
    ev.preventDefault()
    getUsedRounds(ev.target.id)
    setState({
      semester: ev.target.id,
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

  function toggleModal(ev) {
    const { modalOpen } = state
    modalOpen[ev.target.id] = !modalOpen[ev.target.id]
    setState({
      modalOpen,
    })
  }
  // ** ****************************************************************** */
  // ** **************************** OTHER ******************************* */

  const { semesterList, roundList } = props
  const translate = i18n.messages[context.language].messages
  const { select_semester: selectSemester } = translate
  const {
    alertMsg,
    canOnlyPreview,
    collapseOpen,
    dropdownOpen,
    firstVisit,
    modalOpen,
    semester,
    rounds,
    usedRounds,
    usedRoundsWithWebVer,
  } = state
  return (
    <div className="First--Step--Choose--Parameters container" id="YearAndRounds">
      {/** *********************************************************************************** */}
      {/*                                  SEMESTER DROPDOWN                                  */}
      {/** *********************************************************************************** */}
      <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown} className="select-semester">
        <h2 className="section-50">{translate.header_memo_menu}</h2>

        <FormHeaderAndInfo infoId="info_select_semester" header={selectSemester} translate={translate} />

        <DropdownToggle>
          <span>
            {semester && semester > 0 && !firstVisit
              ? `${translate.course_short_semester[semester.toString().match(/.{1,4}/g)[1]]} 
                                    ${semester.toString().match(/.{1,4}/g)[0]}`
              : selectSemester}
          </span>
          <span className="caretholder" id="_spanCaret" />
        </DropdownToggle>
        <DropdownMenu>
          {semesterList &&
            semesterList.map(sem => (
              <DropdownItem id={sem} key={sem} onClick={handleSelectedSemester}>
                {`
                  ${translate.course_short_semester[sem.toString().match(/.{1,4}/g)[1]]} 
                  ${sem.toString().match(/.{1,4}/g)[0]}
                `}
              </DropdownItem>
            ))}
        </DropdownMenu>
      </Dropdown>
      {alertMsg.length > 0 && (
        <Row key="smth-wrong" className="w-100 my-0 mx-auto upper-alert">
          <Alert color="danger">{` ${alertMsg}`}</Alert>
        </Row>
      )}

      {/** *********************************************************************************** */}
      {/*                              SELECT BUTTONS FOR  ROUNDS                             */}
      {/** *********************************************************************************** */}
      {collapseOpen && (
        <Row className="w-100 my-0 mx-auto">
          {semester.length > 0 && (
            <Form>
              <FormHeaderAndInfo
                infoId="info_choose_course_offering"
                headerId="header_memo_menu"
                translate={translate}
              />

              <div className="selectBlock">
                {/** *********************************************************************************** */}
                {/*                           ROUND LIST FOR SELECTED SEMESTER                          */}
                {/** *********************************************************************************** */}
                {roundList[semester].length > 0 && (
                  <>
                    <p>{translate.intro_new}</p>
                    {roundList[semester].map(round => {
                      const { hasAccess, roundId } = round
                      const hasBeenUsed = usedRounds.includes(roundId) || false
                      const hasWebVersion = Object.keys(usedRoundsWithWebVer).includes(roundId) || false
                      const hasPublishedPdf = hasBeenUsed && !hasWebVersion
                      return (
                        <FormGroup className="form-check" id="rounds" key={roundId}>
                          <Input
                            type="checkbox"
                            id={roundId}
                            key={'checkbox' + roundId}
                            onChange={handleRoundCheckbox}
                            checked={rounds.includes(roundId)}
                            name={roundId}
                            disabled={!hasAccess || hasWebVersion}
                            data-hasfile={hasPublishedPdf}
                          />
                          <Label key={'Label' + roundId} for={roundId}>
                            <RoundLabel
                              key={'round' + roundId}
                              language={context.language}
                              round={round}
                              semester={semester}
                              hasPublishedPdf={hasPublishedPdf}
                              hasWebVersion={hasWebVersion}
                              webVersionInfo={hasWebVersion ? usedRoundsWithWebVer[roundId] : {}}
                              showAccessInfo
                            />
                          </Label>
                        </FormGroup>
                      )
                    })}
                  </>
                )}
              </div>
            </Form>
          )}
        </Row>
      )}
      {/** *********************************************************************************** */}
      {/*                              BUTTONS FOR MEMO MENU                                  */}
      {/** *********************************************************************************** */}
      <Row className="button-container text-center">
        <Col sm="12" lg="4" />
        <Col sm="12" lg="4">
          <Button className="alert alert-secondary" id="cancel" key="cancel" onClick={toggleModal}>
            {translate.btn_cancel}
          </Button>
        </Col>
        <Col sm="12" lg="4">
          {!firstVisit && !canOnlyPreview && (
            <Button className="next" color="success" id="new" key="new" onClick={goToEditMode} disabled={firstVisit}>
              {translate.btn_add_memo}
            </Button>
          )}
        </Col>
      </Row>
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
