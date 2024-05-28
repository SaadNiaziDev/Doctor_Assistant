import React from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { CopyToClipboard } from 'react-copy-to-clipboard';


export const QrCode = ( { url, statement } ) => {
    return (
        <div className='qr-box h-100'>
            <div className="fs-14 fw-400 text-grey mb-3">
                {statement}
            </div>
            <div className="d-flex align-items-center justify-content-between mb-3">
                <CopyToClipboard text={url} onCopy={() => alert( 'Copy to clipboard!' )}
                >
                    <a href="javascript:void(0)" className='fs-14 fw-500 text-gradient text-decoration-underline'>
                        Copy Link
                    </a>
                </CopyToClipboard>

                <a href={url} target='_blank' className='fs-14 fw-500 text-gradient text-decoration-underline'>Enter</a>
            </div>
            <div className="qr-img">
                <QRCodeSVG width={200} height={200} className='w-100' value={url} />
            </div>
        </div>
    )
}