/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react"
import './ViewVideo.css'
import { CutterInfo, Information } from "../../../../types/base"
import { VideoBtnConfig } from "../../../../types/video"
import { exitFullScreen, gotoFullScreen, setEventListener } from "../../common"
import VideoToolbar from "./toolrbar/VideoToolbar"

type VideoProps = {
  url: string
  information?: Information[]
  vtt?: string
  poster?: string
  videoBtnConfig?: VideoBtnConfig
  saveCutter: (param: CutterInfo) => void
}

const ViewVideo: React.FC<VideoProps> = (props) => {
  const videoContainerRef = useRef<HTMLDivElement>(null)
  const videoPlayerRef = useRef<HTMLVideoElement>(null)
  const videoToolbarRef = useRef<{ init: () => void }>(null)

  /**
   * 是否正在剪辑操作
   */
  let isCut: boolean = false

  const [time, setTime] = useState(0)
  const [totalTime, setTotalTime] = useState(0)

  const listeners: {
    stopLoad: Function | null
    stopTime: Function | null
  } = {
    stopLoad: null,
    stopTime: null
  }

  useEffect(() => {
    initPlayer()
  }, [])

  const initPlayer = () => {
    isCut = false
    listeners.stopLoad?.()
    listeners.stopTime?.()
    videoToolbarRef.current?.init()
    listeners.stopLoad = setEventListener(videoPlayerRef.current, 'loadedmetadata', (ev: any) => {
      setTotalTime(ev.target.duration * 1000)
    })
    listeners.stopTime = setEventListener(videoPlayerRef.current, 'timeupdate', (ev: any) => {
      setTime(ev.target.currentTime * 1000)
    })
  }

  const play = () => {
    videoPlayerRef.current?.play()
  }

  const pause = () => {
    videoPlayerRef.current?.pause()
  }

  const skip = (time: number) => {
    if (isCut) return
    setTime(time)
    videoPlayerRef.current!.currentTime = time / 1000
  }

  const stop = () => {
    videoPlayerRef.current?.pause()
    videoPlayerRef.current!.currentTime = 0
  }

  const changeRate = (rate: number) => {
    videoPlayerRef.current!.playbackRate = rate
  }

  const changeVolume = (volume: number) => {
    videoPlayerRef.current!.volume = volume
  }

  const onFullScreen = () => {
    gotoFullScreen(videoContainerRef.current)
  }

  const offFullScreen = () => {
    exitFullScreen()
  }

  const toggleCutState = () => {
    isCut = !isCut
  }

  return (
    <div className="video-container" ref={videoContainerRef}>
      <div className="player">
        <video ref={videoPlayerRef} src={props.url} poster={props.poster}>
          您的浏览器不支持 video 标签。
          <track src={props.vtt} kind="subtitles" srcLang="zh-CN" default/>
        </video>
      </div>
      <div className="toolbar">
        <VideoToolbar
          ref={videoToolbarRef}
          time={time}
          options={props.videoBtnConfig}
          totalTime={totalTime}
          information={props.information}
          play={play}
          pause={pause}
          skip={skip}
          stop={stop}
          changeVolume={changeVolume}
          changeRate={changeRate}
          onFullScreen={onFullScreen}
          offFullScreen={offFullScreen}
          toggleCutState={toggleCutState}
          saveCutter={props.saveCutter}
        />
      </div>
    </div>
  )
}

export default ViewVideo