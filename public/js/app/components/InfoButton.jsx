import React from 'react'
import { UncontrolledPopover, PopoverHeader, PopoverBody } from 'reactstrap'

const InfoButton = ({ id, textObj }) => (
  <>
    <button id={id} type="button" className="btn-info-modal" />
    <UncontrolledPopover trigger="legacy" placement="auto" target={id}>
      <PopoverHeader>{textObj.header}</PopoverHeader>
      <PopoverBody>
        <p>{textObj.body}</p>
      </PopoverBody>
    </UncontrolledPopover>
  </>
)

export default InfoButton
