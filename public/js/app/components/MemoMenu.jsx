import React, { useReducer } from 'react'
// import { observer } from 'mobx-react'
import {
  Alert,
  Form,
  Dropdown,
  FormGroup,
  Label,
  Input,
  Collapse,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
  Button,
  Row,
  Col,
} from 'reactstrap'

// Custom components
import InfoModal from './InfoModal'
import RoundLabel from './RoundLabel'
import FormHeaderAndInfo from './FormHeaderAndInfo'
import i18n from '../../../../i18n/index'
import { SERVICE_URL } from '../util/constants'
import { useWebContext } from '../context/WebContext'

const paramsReducer = (state, action) => ({ ...state, ...action })

function MemoMenu(props) {
  const { store: rawStore } = props
  const store = React.useMemo(() => rawStore, [rawStore])
  const [state, setState] = useReducer(paramsReducer, {
    alert: '',
    firstVisit: props.firstVisit,
    dropdownOpen: false,
    collapseOpen: props.progress === 'back_new',
    modalOpen: {
      delete: false,
      info: false,
      cancel: false,
    },
    semester: props.activeSemester && props.activeSemester.length > 0 ? props.activeSemester : '', //props.semesterList[0],
    rounds: props.tempData ? props.tempData.roundIdList : [],
    usedRounds: store.usedRounds.usedRoundsIdList || [],
    usedRoundsWithWebVer: store.usedRounds.roundsIdWithWebVersion || {},

    temporaryData: props.tempData,
    newSemester: false,
    usedRoundSelected: props.tempData ? props.tempData.usedRoundSelected : 0,
  })

  // function _componentWillMount() {
  //   const { progress } = props
  //   const { lastSelected, semester } = state

  //   if (store.usedRounds.usedRoundsIdList || store.hasChangedStatus) {
  //     getUsedRounds(semester)
  //   } else if (progress === 'new_back') {
  //     setState({
  //       semester,
  //       usedRounds: store.usedRounds.usedRoundsIdList || [],
  //       usedRoundsWithWebVer: store.usedRounds.roundsIdWithWebVersion || {},
  //       lastSelected: lastSelected,
  //       alert: '',
  //     })
  //   }
  // }

  // _componentWillMount()

  // ******************************* SEMESTER DROPDOWN ******************************* */
  // ********************************************************************************** */
  // eslint-disable-next-line react/sort-comp
  function toggleDropdown(event) {
    event.preventDefault()
    const { dropdownOpen } = state
    setState({
      dropdownOpen: !dropdownOpen,
    })
  }

  function handleSelectedSemester(event) {
    event.preventDefault()
    getUsedRounds(event.target.id)
    setState({
      semester: event.target.id,
      collapseOpen: true,
      firstVisit: false,
      rounds: [],
      newSemester: true,
    })
  }

  // ** ********************** CHECKBOXES AND RADIO BUTTONS **************************** */
  // ** ******************************************************************************** */
  function handleRoundCheckbox(event) {
    event.persist()
    let prevState = { ...state }
    const { alert, rounds } = state

    if (alert.length > 0) {
      prevState.alert = ''
    }

    if (event.target.checked) {
      prevState.rounds.push(event.target.id)
      event.target.getAttribute('data-hasfile') === 'true' ? prevState.usedRoundSelected++ : prevState.usedRoundSelected
      setState(prevState)
    } else {
      prevState.rounds.splice(rounds.indexOf(event.target.id), 1)
      event.target.getAttribute('data-hasfile') === 'true' ? prevState.usedRoundSelected-- : prevState.usedRoundSelected
      setState(prevState)
    }
  }

  // ** ********************** SUBMIT BUTTONS **************************** */
  // ** ****************************************************************** */

  function goToEditMode(event) {
    event.preventDefault()
    const { rounds, semester, temporaryData, usedRoundSelected } = state

    if (rounds.length > 0) {
      props.editMode(semester, rounds, temporaryData, usedRoundSelected)
    } else {
      setState({
        alert: i18n.messages[store.language].messages.alert_no_rounds_selected,
      })
    }
  }

  function handleCancel() {
    const { temporaryData } = state
    if (temporaryData !== null && temporaryData.memoFile.length > 0) {
      props.handleRemoveFile(temporaryData.memoFile)
    }
    const { modalOpen: modal } = state
    modal.cancel = false
    setState({ modalOpen: modal })
    window.location = `${SERVICE_URL.admin}${store.courseCode}?serv=pm&event=cancel`
  }

  function toggleModal(event) {
    const { modalOpen } = state
    modalOpen[event.target.id] = !modalOpen[event.target.id]
    setState({
      modalOpen,
    })
  }
  // ** ****************************************************************** */
  // ** **************************** OTHER ******************************* */

  function getUsedRounds(semester) {
    return store.getUsedRounds(store.courseData.courseCode, semester).then(result => {
      setState({
        semester,
        usedRounds: store.usedRounds.usedRoundsIdList || [],
        usedRoundsWithWebVer: store.usedRounds.roundsIdWithWebVersion || {},
        lastSelected: state.lastSelected,
        alert: '',
      })
    })
  }

  const { semesterList, roundList } = props
  const translate = i18n.messages[store.language].messages
  const { select_semester: selectSemester } = translate
  const {
    alert,
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
      {alert.length > 0 && (
        <Row key="smth-wrong" className="w-100 my-0 mx-auto upper-alert">
          <Alert color="danger">{` ${alert}`}</Alert>
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
                  <FormGroup id="rounds">
                    <p>{translate.intro_new}</p>
                    <ul className="no-padding-left">
                      {roundList[semester].map(round => {
                        const { hasAccess, roundId } = round
                        const hasBeenUsed = usedRounds.includes(roundId) || false
                        const hasWebVersion = Object.keys(usedRoundsWithWebVer).includes(roundId) || false
                        const hasPublishedPdf = hasBeenUsed && !hasWebVersion
                        return (
                          <li className="select-list" key={roundId}>
                            <Label key={'Label' + roundId} for={roundId}>
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
                              <RoundLabel
                                key={'round' + roundId}
                                language={store.language}
                                round={round}
                                semester={semester}
                                hasPublishedPdf={hasPublishedPdf}
                                hasWebVersion={hasWebVersion}
                                webVersionInfo={hasWebVersion ? usedRoundsWithWebVer[roundId] : {}}
                                showAccessInfo
                              />
                            </Label>
                            <br />
                          </li>
                        )
                      })}
                    </ul>
                  </FormGroup>
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
          <button className="alert alert-secondary" id="cancel" key="cancel" onClick={toggleModal}>
            {translate.btn_cancel}
          </button>
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
