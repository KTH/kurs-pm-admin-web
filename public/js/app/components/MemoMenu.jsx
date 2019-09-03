import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Alert, Form, Dropdown, FormGroup, Label, 
        Input, Collapse, DropdownToggle, DropdownItem, 
        DropdownMenu, Button, Row, Col } from 'reactstrap'

//Custom components
import InfoModal from './InfoModal'
import InfoButton from './InfoButton'

import i18n from '../../../../i18n/index'
import { EMPTY, SERVICE_URL } from '../util/constants'
import { getDateFormat, getValueFromObjectList } from '../util/helpers'

@inject(['routerStore']) @observer
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
                cancel: false
            },
            semester: this.props.activeSemester && this.props.activeSemester.length > 0  ? this.props.activeSemester   : '' ,//this.props.semesterList[0],
            rounds: this.props.tempData ? this.props.tempData.roundIdList : [],
            usedRounds: this.props.routerStore.usedRounds.usedRoundsIdList ? this.props.routerStore.usedRounds.usedRoundsIdList  : [],
            temporaryData: this.props.tempData,
            newSemester: false
        }

        this.toggleDropdown = this.toggleDropdown.bind(this)
        this.handleSelectedSemester = this.handleSelectedSemester.bind(this)
        this.goToEditMode = this.goToEditMode.bind(this)
        this.handleRoundCheckbox = this.handleRoundCheckbox.bind(this)
        this.handleCancel = this.handleCancel.bind(this)
        this.toggleModal = this.toggleModal.bind(this)
    }

    
    //******************************* SEMESTER DROPDOWN ******************************* */
    //********************************************************************************** */
    toggleDropdown(event) {
        event.preventDefault()
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        })
    }

    handleSelectedSemester(event) {
        event.preventDefault()
        this.getUsedRounds(event.target.id)
        this.setState({
            semester: event.target.id,
            collapseOpen: true,
            firstVisit: false,
            rounds:[],
            newSemester: true
        })
    }

    
    //************************ CHECKBOXES AND RADIO BUTTONS **************************** */
    //********************************************************************************** */
    handleRoundCheckbox(event) {
        let prevState = this.state
        if ( this.state.alert.length > 0 )
            prevState.alert = ''

        if ( event.target.checked ){
            prevState.rounds.push(event.target.id)
            this.setState(prevState)
        }
        else{
            prevState.rounds.splice(this.state.rounds.indexOf(event.target.id), 1)
            this.setState(prevState)
        }
    }
   
    //************************ SUBMIT BUTTONS **************************** */
    //******************************************************************** */

    goToEditMode(event) {
        event.preventDefault()
        if (this.state.rounds.length > 0 ){
            this.props.editMode(this.state.semester, this.state.rounds,  this.state.temporaryData)
        }
        else{
            this.setState({
                alert: i18n.messages[this.props.routerStore.language].messages.alert_no_rounds_selected
            })
        }
    }

    handleCancel() {
        if(this.state.temporaryData!==null && this.state.temporaryData.memoFile.length > 0){
            this.props.handleRemoveFile(this.state.temporaryData.memoFile)
        }
        let modal = this.state.modalOpen
        modal.cancel = false
        this.setState({ modalOpen: modal })
        window.location=`${SERVICE_URL['admin']}${this.props.routerStore.courseCode}?serv=pm&event=cancel`
    }

    toggleModal(event){
        let modalOpen = this.state.modalOpen
        modalOpen[event.target.id] = !modalOpen[event.target.id]
        this.setState({
          modalOpen: modalOpen
        })
      }
    //******************************************************************** */
    //****************************** OTHER ******************************* */

    getUsedRounds(semester) {
        const thisInstance = this
        const {routerStore } = this.props
        const prevState = this.state
        return this.props.routerStore.getUsedRounds(routerStore.courseData.courseCode, semester)
            .then(result => {
                thisInstance.setState({
                    semester: semester,
                    usedRounds: routerStore.usedRounds.usedRoundsIdList,
                    lastSelected: prevState.lastSelected,
                    alert: ''
                })
            })
    }

    componentWillMount() {
        const {routerStore } = this.props
        const prevState = this.state
       
        if (routerStore.usedRounds.usedRoundsIdList  || routerStore.hasChangedStatus){
            this.getUsedRounds(this.state.semester)
        } else {
            if (this.props.progress === 'new_back'){
                this.setState({
                    semester: this.state.semester,
                    usedRounds: routerStore.usedRounds.usedRoundsIdList,
                    lastSelected: prevState.lastSelected,
                    alert: ''
                })
            }
        }
    }

    render() {
        const { status, semesterList, roundList, routerStore } = this.props
        const translate = i18n.messages[routerStore.language].messages
    
        if (routerStore.browserConfig.env === 'dev'){
            console.log("this.props - MemoMenu" , this.props)
            console.log("this.state - MemoMenu", this.state)
        }
        return (
            <div id="YearAndRounds">
                 <p>{translate.intro_memo_menu}</p>
           
                {/************************************************************************************* */}
                {/*                               SEMESTER DROPDOWN                          */}
                {/************************************************************************************* */}
                <Dropdown
                    isOpen={this.state.dropdownOpen}
                    toggle={this.toggleDropdown}
                    className='select-semester'
                >
                    <div className='inline-flex padding-top-30'>
                        <h3 > {translate.select_semester} </h3> 
                        <InfoButton addClass = 'padding-top-30' id = 'info_select_semester' textObj = {translate.info_select_semester}/>
                    </div>
                    
                    <DropdownToggle >
                        <span>
                            {this.state.semester && this.state.semester > 0 && !this.state.firstVisit
                                ? `${translate.course_short_semester[this.state.semester.toString().match(/.{1,4}/g)[1]]} 
                                    ${this.state.semester.toString().match(/.{1,4}/g)[0]}`
                                : translate.select_semester
                            }
                        </span>
                        <span className='caretholder' id={'_spanCaret'}></span>
                    </DropdownToggle>
                    <DropdownMenu>
                        {semesterList && semesterList.map(semester =>
                            <DropdownItem id={semester} key={semester} onClick={this.handleSelectedSemester}>
                                {`
                                    ${translate.course_short_semester[semester.toString().match(/.{1,4}/g)[1]]} 
                                    ${semester.toString().match(/.{1,4}/g)[0]}
                                `}
                            </DropdownItem>
                        )}
                    </DropdownMenu>
                </Dropdown>
              
                {this.state.alert.length > 0
                    ? <Alert color='danger' className = 'margin-bottom-40'> {this.state.alert}</Alert>
                    : ''
                }
                 {routerStore.usedRounds.usedRoundsIdList && routerStore.usedRounds.usedRoundsIdList.length > 0
                    ? <Alert color='info' className = 'margin-bottom-40'> {translate.alert_have_published_memo}</Alert>
                    : ''
                }
                
                {/************************************************************************************* */}
                {/*                              SELECT BUTTONS FOR  ROUNDS                             */}
                {/************************************************************************************* */}
                <Collapse isOpen={this.state.collapseOpen}>
                    <Row id='memoMenuContainer'>
                        {this.state.semester.length > 0
                            ?<Form> 
                                <div className='inline-flex'>
                                    <h3>{translate.header_memo_menu}</h3>
                                    <InfoButton addClass = 'padding-top-30' id = 'info_choose_course_offering' textObj = {translate.info_choose_course_offering}/>
                                </div>
                
                                     <div className= 'selectBlock'>
                                        
                                
                                    {/************************************************************************************* */}
                                    {/*                           ROUND LIST FOR SELECTED SEMESTER                          */}
                                    {/************************************************************************************* */}
                                        {roundList[this.state.semester].length >0
                                            ? <FormGroup id='rounds'>
                                                <p>{translate.intro_new}</p>
                                                <ul className='no-padding-left'> 
                                                    {roundList[this.state.semester].map(round =>
                                                             <li className = 'select-list' key={round.roundId}>
                                                                <Label key={"Label" + round.roundId}
                                                                    for={round.roundId}
                                                                >
                                                                    <Input type="checkbox"
                                                                        id={round.roundId}
                                                                        key={"checkbox" + round.roundId}
                                                                        onChange={this.handleRoundCheckbox}
                                                                        checked = {this.state.rounds.indexOf(round.roundId) > -1 }
                                                                        name={round.roundId}
                                                                        disabled = {!round.hasAccess}
                                                                    />
                                                                    {round.shortName 
                                                                        ? round.shortName + ' '
                                                                        : `${translate.course_short_semester[this.state.semester.toString().match(/.{1,4}/g)[1]]} 
                                                                        ${this.state.semester.toString().match(/.{1,4}/g)[0]}-${round.roundId} `
                                                                    } 
                                                                    ( {translate.label_start_date} {getDateFormat(round.startDate, round.language)}, {round.language} )
                                                                    <span className='no-access'>   
                                                                        {!round.hasAccess 
                                                                            ? translate.not_authorized_publish_new
                                                                            : this.state.usedRounds.length > 0 && this.state.usedRounds.indexOf(round.roundId) > -1 
                                                                                ? translate.has_published_memo 
                                                                                : '' 
                                                                        }
                                                                   </span>

                                                                </Label>
                                                                <br />
                                                            </li>
                                                    )}
                                                </ul>
                                            </FormGroup>
                                            : ''
                                        }
                                   
                                </div>
                            </Form>
                            :''
                        }
                            
                    </Row>
                </Collapse>
                {/************************************************************************************* */}
                {/*                              BUTTONS FOR MEMO MENU                                  */}
                {/************************************************************************************* */}
                <Row className="button-container text-center">
                    <Col sm="12" lg="4">
                        { /*this.state.selectedRadio.draft.length > 0 && !this.state.canOnlyPreview
                            ? <span>
                                <Button color='danger' id='delete' key='delete' onClick={this.toggleModal} style={{marginRight: '5px'}}>
                                    {translate.btn_delete}
                                </Button>
                                </span>
                            : ''
                        */}
                    </Col>
                    <Col sm="12" lg="4">
                        <Button color='secondary' id='cancel' key='cancel' onClick={this.toggleModal} >
                            {translate.btn_cancel}
                        </Button>
                    </Col>
                    <Col sm="12" lg="4">
                        { !this.state.firstVisit && !this.state.canOnlyPreview
                                ? <Button color='success' id='new' key='new' onClick={this.goToEditMode} disabled ={this.state.firstVisit}>
                                    <div className="iconContainer arrow-forward" id='new' />  
                                    {translate.btn_add_memo}
                            </Button>
                            : ''
                        }
                    </Col>
                </Row>
                {/************************************************************************************* */}
                {/*                               MODALS FOR CANCEL                                     */}
                {/************************************************************************************* */}  
                <InfoModal type = 'cancel' toggle= {this.toggleModal} isOpen = {this.state.modalOpen.cancel} id={'cancel'} handleConfirm={this.handleCancel} infoText={translate.info_cancel}/>
               {/* <InfoModal type = 'delete' toggle= {this.toggleModal} isOpen = {this.state.modalOpen.delete} id={this.state.selectedRadio.draft} handleConfirm={this.handleDelete} infoText={translate.info_delete}/>*/}
            </div>
        )
    }
}

export default MemoMenu

