import React, { useReducer } from 'react'
import { Modal, ModalBody, ModalHeader, ModalFooter, Button } from 'reactstrap'
import i18n from '../../../../i18n/index'

const paramsReducer = (state, action) => ({ ...state, ...action })

// Custom components

function InfoModal(props) {
  const [state, setState] = useReducer(paramsReducer, { modal: props.isOpen })

  function handleConfirm(event) {
    event.preventDefault()
    props.handleConfirm(props.id, true)
  }

  const {
    fade,
    isOpen,
    toggle,
    className,
    type,
    infoText,
    id,
    courseCode,
    semester,
    courseOfferings,
    langIndex = 0,
  } = props
  const fadeModal = fade || true

  const { header_course, header_semester, header_course_offering } = i18n.messages[langIndex].messages

  return (
    <div>
      {type === 'info' && (
        <Button id={type} type="button" onClick={toggle} className="btn-info-modal btn btn-secondary" />
      )}
      <Modal isOpen={isOpen} toggle={toggle} className={className} fade={fadeModal} id={id}>
        <ModalHeader toggle={toggle}>{infoText.header}</ModalHeader>
        <ModalBody>
          {courseCode && <p>{`${header_course}: ${courseCode}`}</p>}
          {semester && <p>{`${header_semester}: ${semester}`}</p>}
          {courseOfferings && <p>{`${header_course_offering}: ${courseOfferings}`}</p>}
          <p dangerouslySetInnerHTML={{ __html: infoText.body }} />
        </ModalBody>
        <ModalFooter>
          <Button id={type} color="secondary" onClick={toggle}>
            {infoText.btnCancel}
          </Button>
          {infoText.btnConfirm && (
            <Button color="secondary" onClick={handleConfirm}>
              {infoText.btnConfirm}
            </Button>
          )}
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default InfoModal
