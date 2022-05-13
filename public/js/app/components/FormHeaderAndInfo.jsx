import React from 'react'
import InfoButton from './InfoButton'

const FormHeaderAndInfo = ({ translate, header = null, headerId = null, infoId, className, ...props }) => (
  <div className={`inline-flex ${className}`} {...props}>
    <h3>{headerId ? translate[headerId] : header} </h3>
    <InfoButton addClass="padding-top-30" id={infoId} textObj={translate[infoId]} />
  </div>
)
export default FormHeaderAndInfo
