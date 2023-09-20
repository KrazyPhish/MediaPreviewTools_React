import React, { ForwardedRef, forwardRef, useImperativeHandle, useRef } from "react"
import './ViewEmail.css'
import { CommonIframe } from "../../common"

type EmailProps = {
  ref?: ForwardedRef<{ zoomIn: () => void, zoomOut: () => void }>
  url: string
}

const ViewEmail: React.ForwardRefExoticComponent<EmailProps> = forwardRef((props, ref) => {
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

export default ViewEmail