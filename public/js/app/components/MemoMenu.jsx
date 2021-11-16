import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
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
import InfoButton from './InfoButton'
import RoundLabel from './RoundLabel'

import i18n from '../../../../i18n/index'
import { SERVICE_URL } from '../util/constants'

@inject(['routerStore'])
@observer
class MemoMenu extends Component {
  constructor(props) {
    super(props)
    this.state = {
      alert: '',
      firstVisit: this.props.firstVisit,
      dropdownOpen: false,
      collapseOpen: this.props.progress === 'back_new',
      modalOpen: {
        delete: false,
        info: false,
        cancel: false,
      },
      semester: this.props.activeSemester && this.props.activeSemester.length > 0 ? this.props.activeSemester : '', //this.props.semesterList[0],
      rounds: this.props.tempData ? this.props.tempData.roundIdList : [],
      usedRounds: this.props.routerStore.usedRounds.usedRoundsIdList || [],
      usedRoundsWithWebVer: this.props.routerStore.usedRounds.roundsIdWithWebVersion || {},

      temporaryData: this.props.tempData,
      newSemester: false,
      usedRoundSelected: this.props.tempData ? this.props.tempData.usedRoundSelected : 0,
    }

    this.toggleDropdown = this.toggleDropdown.bind(this)
    this.handleSelectedSemester = this.handleSelectedSemester.bind(this)
    this.goToEditMode = this.goToEditMode.bind(this)
    this.handleRoundCheckbox = this.handleRoundCheckbox.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.toggleModal = this.toggleModal.bind(this)
  }

  // ******************************* SEMESTER DROPDOWN ******************************* */
  // ********************************************************************************** */
  // eslint-disable-next-line react/sort-comp
  toggleDropdown(event) {
    event.preventDefault()
    const { dropdownOpen } = this.state
    this.setState({
      dropdownOpen: !dropdownOpen,
    })
  }

  handleSelectedSemester(event) {
    event.preventDefault()
    this.getUsedRounds(event.target.id)
    this.setState({
      semester: event.target.id,
      collapseOpen: true,
      firstVisit: false,
      rounds: [],
      newSemester: true,
    })
  }

  // ** ********************** CHECKBOXES AND RADIO BUTTONS **************************** */
  // ** ******************************************************************************** */
  handleRoundCheckbox(event) {
    event.persist()
    let prevState = this.state
    const { alert, rounds } = this.state

    if (alert.length > 0) {
      prevState.alert = ''
    }

    if (event.target.checked) {
      prevState.rounds.push(event.target.id)
      event.target.getAttribute('data-hasfile') === 'true' ? prevState.usedRoundSelected++ : prevState.usedRoundSelected
      this.setState(prevState)
    } else {
      prevState.rounds.splice(rounds.indexOf(event.target.id), 1)
      event.target.getAttribute('data-hasfile') === 'true' ? prevState.usedRoundSelected-- : prevState.usedRoundSelected
      this.setState(prevState)
    }
  }

  // ** ********************** SUBMIT BUTTONS **************************** */
  // ** ****************************************************************** */

  goToEditMode(event) {
    event.preventDefault()
    const { rounds, semester, temporaryData, usedRoundSelected } = this.state
    const { routerStore } = this.props

    if (rounds.length > 0) {
      this.props.editMode(semester, rounds, temporaryData, usedRoundSelected)
    } else {
      this.setState({
        alert: i18n.messages[routerStore.language].messages.alert_no_rounds_selected,
      })
    }
  }

  handleCancel() {
    const { temporaryData } = this.state
    const { routerStore } = this.props
    if (temporaryData !== null && temporaryData.memoFile.length > 0) {
      this.props.handleRemoveFile(temporaryData.memoFile)
    }
    const { modalOpen: modal } = this.state
    modal.cancel = false
    this.setState({ modalOpen: modal })
    window.location = `${SERVICE_URL.admin}${routerStore.courseCode}?serv=pm&event=cancel`
  }

  toggleModal(event) {
    const { modalOpen } = this.state
    modalOpen[event.target.id] = !modalOpen[event.target.id]
    this.setState({
      modalOpen,
    })
  }
  // ** ****************************************************************** */
  // ** **************************** OTHER ******************************* */

  getUsedRounds(semester) {
    const thisInstance = this
    const { routerStore } = this.props
    const prevState = this.state
    return this.props.routerStore.getUsedRounds(routerStore.courseData.courseCode, semester).then(result => {
      thisInstance.setState({
        semester,
        usedRounds: routerStore.usedRounds.usedRoundsIdList || [],
        usedRoundsWithWebVer: routerStore.usedRounds.roundsIdWithWebVersion || {},
        lastSelected: prevState.lastSelected,
        alert: '',
      })
    })
  }

  componentWillMount() {
    const { routerStore, progress } = this.props
    const { semester } = this.state
    const prevState = this.state

    if (routerStore.usedRounds.usedRoundsIdList || routerStore.hasChangedStatus) {
      this.getUsedRounds(semester)
    } else if (progress === 'new_back') {
      this.setState({
        semester,
        usedRounds: routerStore.usedRounds.usedRoundsIdList || [],
        usedRoundsWithWebVer: routerStore.usedRounds.roundsIdWithWebVersion || {},
        lastSelected: prevState.lastSelected,
        alert: '',
      })
    }
  }

  render() {
    const { semesterList, roundList, routerStore } = this.props
    const translate = i18n.messages[routerStore.language].messages
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
    } = this.state
    return (
      <div id="YearAndRounds">
        {/** *********************************************************************************** */}
        {/*                                  SEMESTER DROPDOWN                                  */}
        {/** *********************************************************************************** */}
        <Dropdown isOpen={dropdownOpen} toggle={this.toggleDropdown} className="select-semester">
          <div className="inline-flex padding-top-30">
            <h3> {selectSemester} </h3>
            <InfoButton addClass="padding-top-30" id="info_select_semester" textObj={translate.info_select_semester} />
          </div>

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
                <DropdownItem id={sem} key={sem} onClick={this.handleSelectedSemester}>
                  {`
                    ${translate.course_short_semester[sem.toString().match(/.{1,4}/g)[1]]} 
                    ${sem.toString().match(/.{1,4}/g)[0]}
                  `}
                </DropdownItem>
              ))}
          </DropdownMenu>
        </Dropdown>

        {alert.length > 0 && (
          <Alert color="danger" className="alert-margin">
            {` ${alert}`}
          </Alert>
        )}

        {/** *********************************************************************************** */}
        {/*                              SELECT BUTTONS FOR  ROUNDS                             */}
        {/** *********************************************************************************** */}
        <Collapse isOpen={collapseOpen}>
          <Row id="memoMenuContainer">
            {semester.length > 0 && (
              <Form>
                <div className="inline-flex">
                  <h3>{translate.header_memo_menu}</h3>
                  <InfoButton
                    addClass="padding-top-30"
                    id="info_choose_course_offering"
                    textObj={translate.info_choose_course_offering}
                  />
                </div>

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
                                  onChange={this.handleRoundCheckbox}
                                  checked={rounds.includes(roundId)}
                                  name={roundId}
                                  disabled={!hasAccess || hasWebVersion}
                                  data-hasfile={hasPublishedPdf}
                                />
                                <RoundLabel
                                  key={'round' + roundId}
                                  language={routerStore.language}
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
        </Collapse>
        {/** *********************************************************************************** */}
        {/*                              BUTTONS FOR MEMO MENU                                  */}
        {/** *********************************************************************************** */}
        <Row className="button-container text-center">
          <Col sm="12" lg="4" />
          <Col sm="12" lg="4">
            <Button color="secondary" id="cancel" key="cancel" onClick={this.toggleModal}>
              {translate.btn_cancel}
            </Button>
          </Col>
          <Col sm="12" lg="4">
            {!firstVisit && !canOnlyPreview && (
              <Button
                className="next"
                color="success"
                id="new"
                key="new"
                onClick={this.goToEditMode}
                disabled={firstVisit}
              >
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
          toggle={this.toggleModal}
          isOpen={modalOpen.cancel}
          id="cancel"
          handleConfirm={this.handleCancel}
          infoText={translate.info_cancel}
        />
      </div>
    )
  }
}

export default MemoMenu
