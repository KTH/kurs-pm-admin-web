import React from 'react'
import InfoButton from './InfoButton'

const FormHeaderAndInfo = ({ translate, header = null, headerId = null, infoId }) => (
  <h3>
    {headerId ? translate[headerId] : header}
    <InfoButton id={infoId} textObj={translate[infoId]} />
  </h3>
)
export default FormHeaderAndInfo
