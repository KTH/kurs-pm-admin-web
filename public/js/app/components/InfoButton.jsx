import React from 'react'
import { Button, UncontrolledPopover, PopoverHeader, PopoverBody } from 'reactstrap'

const InfoButton = ({ id, textObj, addClass }) => (
  <div className={addClass || ''}>
    <Button id={id} type="button" className="btn-info-modal btn btn-secondary" />
    <UncontrolledPopover trigger="legacy" placement="auto" target={id}>
      <PopoverHeader>{textObj.header}</PopoverHeader>
      <PopoverBody>
        <p>{textObj.body}</p>
      </PopoverBody>
    </UncontrolledPopover>
  </div>
)

export default InfoButton
