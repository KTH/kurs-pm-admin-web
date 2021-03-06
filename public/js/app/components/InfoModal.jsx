import React, { Component } from 'react'
import { Modal, ModalBody, ModalHeader, ModalFooter, Button } from 'reactstrap'

//Custom components

class InfoModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modal: this.props.isOpen,
    }
    this.handleConfirm = this.handleConfirm.bind(this)
  }

  handleConfirm(event) {
    event.preventDefault()
    this.props.handleConfirm(this.props.id, true)
  }

  render() {
    const { fade, isOpen, toggle, className, type, infoText, id, url, copyHeader } = this.props
    const fadeModal = fade || true

    return (
      <div>
        {type === 'info' && (
          <Button id={type} type="button" onClick={toggle} className="btn-info-modal btn btn-secondary" />
        )}
        <Modal isOpen={isOpen} toggle={toggle} className={className} fade={fadeModal} id={id}>
          <ModalHeader toggle={toggle}>{infoText.header}</ModalHeader>
          <ModalBody>
            <p dangerouslySetInnerHTML={{ __html: infoText.body }} />
          </ModalBody>
          <ModalFooter>
            <Button id={type} color="secondary" onClick={toggle}>
              {infoText.btnCancel}
            </Button>
            {infoText.btnConfirm && (
              <Button color="secondary" onClick={this.handleConfirm}>
                {infoText.btnConfirm}
              </Button>
            )}
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}

export default InfoModal
