import React, { useState } from 'react'

export const UploadModal = ( { openUpload, setOpenUpload, fileType } ) => {
  const [ filename, setFilename ] = useState( '' )

  const handleFileUpload = ( e ) => {
    const file = e.target.files[ 0 ];
    setFilename( file.name );
  }

  return (
    <>
      {openUpload && <div className="overlay" onClick={() => setOpenUpload( false )}></div>}
      <div className={`upload-drop ${openUpload ? "show" : ""}`} >
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div className="fs-16 fw-500 text-grey">
            Upload Document
          </div>
          <button type='button' className='border-0 bg-transparent fs-20 text-grey' onClick={() => setOpenUpload( false )}>
            <span className="iconify" data-icon="akar-icons:cross"></span>
          </button>
        </div>
        <div className="fs-14 fw-400 text-grey mb-4">
          Upload files of patient's medical history
        </div>
        <div className="fs-14 fw-500 text-grey mb-1">
          Attach Document
        </div>
        <div className="attachment-box mb-2">
          <div className="fs-32 text-voilet mb-3">
            <span className="iconify" data-icon="basil:file-upload-solid"></span>
          </div>
          <div className="fs-14 fw-500 text-voilet mb-3">
            Drag and drop or <span className="text-gradient">
              browse file
            </span>
          </div>
          <div className="fs-12 fw-400 text-voilet">200MB maximum</div>
          <input type="file" accept={fileType} onChange={handleFileUpload} />
        </div>
        <div className="fs-12 fw-400 text-voilet">
          Accepted Formats : PDF, DOCX, TXT
        </div>
        {filename && <div className='d-flex justify-content-between align-items-center'>
          <div className="fs-12 fw-400 text-primary">
            Filename : {filename}
          </div>
          <span className="text-danger pointer" onClick={() => setFilename( '' )}>
            X
          </span>
        </div>}

        <button disabled={!filename} type='button' className='btn-gradient mt-4 w-100'>
          Upload Now
        </button>

      </div>
    </>

  )
}