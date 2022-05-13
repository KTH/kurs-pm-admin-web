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
    <div className={notValid.indexOf(type) > -1 ? 'not-valid' : ''}>
      {file && file.length > 0 ? (
        <span>
          <br />
          <div className="inline-flex">
            <p className="upload-text"> {file} </p>
            <div
              role="button"
              tabIndex={0}
              className="iconContainer icon-trash-can"
              id={'remove_' + id}
              onClick={removeFile}
              onKeyPress={removeFile}
            ></div>
          </div>
        </span>
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
