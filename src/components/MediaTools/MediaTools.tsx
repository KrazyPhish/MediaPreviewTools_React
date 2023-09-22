import React, { ForwardedRef, ReactElement, forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import { Information } from "../../types/base"
import { AudioBtnConfig, AudioRegion } from "../../types/audio"
import { VideoBtnConfig } from '../../types/video'
import { getMediaType } from "./common"
import './MediaTools.css'
import { ViewEmail, ViewOffice, ViewPdf, ViewPicture, ViewAudio, ViewVideo, ViewNonsupport } from "./modules"

type MediaToolProps = {
  ref?: ForwardedRef<{ zoomIn: () => void, zoomOut: () => void }>
  audioBtnConfig: AudioBtnConfig
  videoBtnConfig: VideoBtnConfig
  extension: string
  url: string
  vtt: string
  poster: string
  information: Information[]
  dataSources: AudioRegion[]
  saveCutter: (param: any) => void
}

const MediaTools: React.ForwardRefExoticComponent<MediaToolProps> = forwardRef((props, ref) => {
  const viewEmailRef = useRef<{ zoomIn: () => void, zoomOut: () => void }>(null)
  const viewOfficeRef = useRef<{ zoomIn: () => void, zoomOut: () => void }>(null)

  let format: string = getMediaType(props.extension)

  const zoomIn = () => {
    if (format === 'email') viewEmailRef.current?.zoomIn()
    else viewOfficeRef.current?.zoomIn()
  }

  const zoomOut = () => {
    if (format === 'email') viewEmailRef.current?.zoomOut()
    else viewOfficeRef.current?.zoomOut()
  }

  const saveCutter = (param: any) => {
    props.saveCutter(param)
  }

  useImperativeHandle(ref, () => ({ zoomIn, zoomOut }))

  let element: ReactElement

  switch (format) {
    case 'email': {
      element = <ViewEmail ref={viewEmailRef} url={props.url} />
      break
    }
    case 'office': {
      element = <ViewOffice ref={viewOfficeRef} url={props.url} />
      break
    }
    case 'pdf': {
      element = <ViewPdf url={props.url} />
      break
    }
    case 'picture': {
      element = <ViewPicture url={props.url} />
      break
    }
    case 'audio': {
      element = (
        <ViewAudio 
          url={props.url}
          information={props.information}
          dataSources={props.dataSources}
          audioBtnConfig={props.audioBtnConfig}
        />
      )
      break
    }
    case 'video': {
      element = (
        <ViewVideo
          url={props.url}
          information={props.information}
          vtt={props.vtt}
          poster={props.poster}
          videoBtnConfig={props.videoBtnConfig}
          saveCutter={saveCutter}
        />
      )
      break
    }
    default: {
      element = <ViewNonsupport extension={props.extension} />
      break
    }
  }

  return (
    <div className="preview-container">
      {element}
    </div>
  )
})

export default MediaTools