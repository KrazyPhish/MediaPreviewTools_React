/* eslint-disable jsx-a11y/iframe-has-title */
import React, { ForwardedRef, forwardRef, useImperativeHandle, useRef } from "react"
import './CommonIframe.css'

type IframeProps = {
  ref?: ForwardedRef<{ zoomIn: () => void, zoomOut: () => void }>
  url: string
}

const CommonIframe: React.ForwardRefExoticComponent<IframeProps> = forwardRef((props, ref) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  /**
   * @description 放大方法通过postMessage解决一些时候的跨域问题，具体缩放逻辑需在源HTML文件中自行书写
   * @returns {void} void
   */
  const zoomIn = () => {
    iframeRef.current?.contentWindow?.postMessage('zoomIn', '*')
  }

  /**
   * @description 缩小方法通过postMessage解决一些时候的跨域问题，具体缩放逻辑需在源HTML文件中自行书写
   * @returns {void} void
   */
  const zoomOut = () => {
    iframeRef.current?.contentWindow?.postMessage('zoomOut', '*')
  }

  useImperativeHandle(ref, () => ({ zoomIn, zoomOut }))

  return <iframe ref={iframeRef} src={props.url} />
})

export default CommonIframe