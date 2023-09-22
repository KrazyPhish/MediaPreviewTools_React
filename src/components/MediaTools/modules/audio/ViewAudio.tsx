import React from "react"
import './ViewAudio.css'
import { Information } from "../../../../types/base"
import { AudioBtnConfig, AudioRegion } from "../../../../types/audio"

type AudioProps = {
  url: string
  information: Information[]
  dataSources: AudioRegion[]
  audioBtnConfig: AudioBtnConfig
}

const ViewAudio: React.FC<AudioProps> = () => {
  return <></>
}

export default ViewAudio