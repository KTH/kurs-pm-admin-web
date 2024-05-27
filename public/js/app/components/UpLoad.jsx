import React from 'react'
import { Spinner } from 'reactstrap'

function UpLoad(props) {
  const { id, handleUpload, handleRemoveFile, progress, file, notValid, type } = props

  function onChange(ev) {
    handleUpload(ev.target.id, ev.target.files, ev)
  }

  function removeFile(ev) {
    handleRemoveFile(ev)
  }

  //* --- Shows uploded file if file exists otherwise upload button --- */
  return (
    <div className={notValid.indexOf(type) > -1 ? 'not-valid' : undefined}>
      {file && file.length > 0 ? (
        <div className="inline-flex">
          <p className="upload-text"> {file} </p>
          <button className="kth-icon-button icon-trash-can" type="button" id={`remove_${id}`} onClick={removeFile} />
        </div>
      ) : (
        <label className="custom-file-upload">
          <input type="file" id={id} onChange={onChange} />
          {progress > 0 && (
            <>
              <Spinner size="sm" color="primary" />
              <div className="file-progress-bar">
                <div className="file-progress" style={{ width: progress + '%' }}></div>
              </div>
            </>
          )}
        </label>
      )}
    </div>
  )
}

export default UpLoad
