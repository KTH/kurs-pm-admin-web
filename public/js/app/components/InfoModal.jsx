import React from 'react'
import { Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap'
import i18n from '../../../../i18n/index'
import Button from '../components-shared/Button'

// Custom components

function InfoModal(props) {
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
    handleConfirm,
  } = props
  const fadeModal = fade || true

  const { header_course, header_semester, header_course_offering } = i18n.messages[langIndex].messages
  function _handleConfirmToParent(ev) {
    ev.preventDefault()
    handleConfirm(id, true)
  }

  return (
    <div>
      <Modal isOpen={isOpen} toggle={toggle} className={className} fade={fadeModal} id={id}>
        <ModalHeader toggle={toggle}>{infoText.header}</ModalHeader>
        <ModalBody>
          {courseCode && <p>{`${header_course}: ${courseCode}`}</p>}
          {semester && <p>{`${header_semester}: ${semester}`}</p>}
          {courseOfferings && <p>{`${header_course_offering}: ${courseOfferings}`}</p>}
          <p dangerouslySetInnerHTML={{ __html: infoText.body }} />
        </ModalBody>
        <ModalFooter>
          <Button id={type} variant="secondary" onClick={toggle}>
            {infoText.btnCancel}
          </Button>
          {infoText.btnConfirm && (
            <Button variant="secondary" onClick={_handleConfirmToParent}>
              {infoText.btnConfirm}
            </Button>
          )}
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default InfoModal
