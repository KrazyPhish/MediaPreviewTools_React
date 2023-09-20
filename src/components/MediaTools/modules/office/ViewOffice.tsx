import React, { ForwardedRef, forwardRef, useImperativeHandle, useRef } from "react"
import './ViewOffice.css'
import { CommonIframe } from "../../common"

type OfficeProps = {
  ref?: ForwardedRef<{ zoomIn: () => void, zoomOut: () => void }>
  url: string
}

const ViewOffice: React.ForwardRefExoticComponent<OfficeProps> = forwardRef((props, ref) => {
  const commonIframeRef = useRef<{ zoomIn: () => void, zoomOut: () => void }>(null)

  const zoomIn = () => {
    commonIframeRef.current?.zoomIn()
  }

  const zoomOut = () => {
    commonIframeRef.current?.zoomOut()
  }

  useImperativeHandle(ref, () => ({ zoomIn, zoomOut }))

  return (
    <div className="container">
      <CommonIframe ref={commonIframeRef} url={props.url} />
    </div>
  )
})

export default ViewOffice