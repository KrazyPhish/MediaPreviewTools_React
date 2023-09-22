import React from "react"
import './ViewVideo.css'
import { Information } from "../../../../types/base"
import { VideoBtnConfig } from "../../../../types/video"

type VideoProps = {
  url: string
  information: Information[]
  vtt: string
  poster: string
  videoBtnConfig: VideoBtnConfig
  saveCutter: (param: any) => void
}

const ViewVideo: React.FC<VideoProps> = () => {
  return <></>
}

export default ViewVideo