/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react"
import './ViewAudio.css'
import { Information } from "../../../../types/base"
import { AudioBtnConfig, AudioRegion, RepeatSettings, SpectOption } from "../../../../types/audio"
import AudioToolbar from "./toolbar/AudioToolbar"
import WaveSurfer from "./wavesurfer/wavesurfer"
import RegionsPlugin, { Region } from "./wavesurfer/plugins/regions"
import HoverPlugin from "./wavesurfer/plugins/hover"
import SpectrogramPlugin from "./wavesurfer/plugins/spectrogram"
import { colorMap, exitFullScreen, gotoFullScreen, setEventListener } from "../../common"
import { GenericPlugin } from "./wavesurfer/base-plugin"
import { Spin } from "antd"

type AudioProps = {
  url: string
  information: Information[]
  dataSources: AudioRegion[]
  audioBtnConfig: AudioBtnConfig
}

const ViewAudio: React.FC<AudioProps> = (props) => {
  const audioContainerRef = useRef<HTMLDivElement>(null)
  const wavesurferContainerRef = useRef<HTMLDivElement>(null)
  const waveSpectrumRef = useRef<HTMLDivElement>(null)
  const waveSpectrogramRef = useRef<HTMLDivElement>(null)

  const [time, setTime] = useState(0)
  const [totalTime, setTotalTime] = useState(0)
  const [volume, setVolume] = useState(1)
  const [spectrum, setSpectrum] = useState(true)
  const [spectrogram, setSpectrogram] = useState(false)
  const [verticalZoom, setVerticalZoom] = useState(1)
  const [horizontalZoom, setHorizontalZoom] = useState(1)

  const [muteAreas, setMuteAreas] = useState<AudioRegion[]>(props.dataSources.filter((d: AudioRegion) => d.mute))

  const [resized, setResized] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [spinText, setSpinText] = useState('')

  const [wavesurfer, setWavesurfer] = useState<WaveSurfer>()
  const [region] = useState<RegionsPlugin>(RegionsPlugin.create())

  const [skipTimer, setSkipTimer] = useState<NodeJS.Timeout>()
  const [repeatRegion, setRepeatRegion] = useState<Region>()
  const [repeatTimer, setRepeatTimer] = useState<NodeJS.Timeout>()

  useEffect(() => {
    load()
  }, [horizontalZoom, verticalZoom, resized, spectrogram, spectrum])

  useEffect(() => {
    setMuteAreas(props.dataSources.filter((d: AudioRegion) => d.mute))
  }, [props.dataSources])

  const load = () => {
    if (!spectrogram && !spectrum) return
    let pluginCount: number = 0
    spectrogram && pluginCount++
    spectrum && pluginCount++

    const height: number = wavesurferContainerRef.current!.clientHeight / pluginCount

    const plugins: GenericPlugin[] = []

    const hover: HoverPlugin = HoverPlugin.create()

    plugins.push(hover)
    plugins.push(region)
    waveSpectrogramRef.current?.replaceChildren()
    spectrogram && plugins.push(SpectrogramPlugin.create({
      container: waveSpectrogramRef.current as HTMLElement,
      labels: true,
      height: height * verticalZoom,
      splitChannels: false,
      colorMap
    }))

    wavesurfer !== undefined && wavesurfer.destroy()
    waveSpectrumRef.current?.replaceChildren()
    const nextWave: WaveSurfer = WaveSurfer.create({
      container: waveSpectrumRef.current as HTMLElement,
      barWidth: 4,
      waveColor: '#90ee90',
      progressColor: '#409EFF',
      height: spectrum ? height * verticalZoom : 0,
      mediaControls: false,
      autoCenter: true,
      minPxPerSec: horizontalZoom,
      plugins
    })
    setWavesurfer(nextWave)
    bindEvent(nextWave)
    nextWave.setVolume(volume)
    listenResize()
    nextWave.load(props.url)
  }

  const listenResize = () => {
    setEventListener(audioContainerRef.current, 'resize', () => {
      setResized(prev => prev + 1)
    })
  }

  const bindEvent = (wavesurfer: WaveSurfer) => {
    wavesurfer.on('ready', (duration: number) => {
      setTotalTime(duration * 1000)
      wavesurfer.seekTo(0)
      region.clearRegions()
      props.dataSources.forEach((r: AudioRegion) => !r.mute && region.addRegion(r as Region))
    })
    wavesurfer.on('audioprocess', (time: number) => {
      setTime(time * 1000)
    })
    wavesurfer.on('seeking', (time: number) => {
      setTime(time * 1000)
    })
    wavesurfer.on('loading', (percentage: number) => {
      if (percentage === 100) {
        setSpinning(false)
      } else {
        setSpinning(true)
        setSpinText(`加载中...${percentage}%`)
      }
    })  
  }

  const play = () => {
    wavesurfer?.play()
  }

  const pause = () => {
    wavesurfer?.pause()
  }

  const stop = () => {
    wavesurfer?.stop()
  }

  const skip = (time: number) => {
    wavesurfer?.seekTo(totalTime ? (time / totalTime) : 0)
  }

  const onFullScreen = () => {
    gotoFullScreen(audioContainerRef.current)
  }

  const offFullScreen = () => {
    exitFullScreen()
  }

  const changeVolume = (volume: number) => {
    setVolume(volume)
    wavesurfer?.setVolume(volume)
  }

  const changeRate = (rate: number) => {
    wavesurfer?.setPlaybackRate(rate)
  }

  const skipMute = (value: boolean) => {
    if (!wavesurfer) return
    if (value) {
      setSkipTimer(setInterval(() => {
        const now: number = wavesurfer!.getCurrentTime()
        const mute: AudioRegion | undefined = muteAreas.find((m: AudioRegion) => {
          return (now >= m.start!) && (now <= m.end!)
        })
        mute && wavesurfer!.seekTo(mute.end! * 1000 / totalTime)
      }, 500))
    } else skipTimer && clearInterval(skipTimer)
  }

  const showMute = (value: boolean) => {
    if (!wavesurfer) return  
    region.clearRegions()
    props.dataSources.forEach((d: AudioRegion) => {
      if (value) region.addRegion(d as Region)
      else if (!d.mute) region.addRegion(d as Region)
    })
  }

  const toggleRepeat = (value: RepeatSettings) => {
    if (!value.repeat && repeatRegion) {
      repeatTimer && clearInterval(repeatTimer)
      repeatRegion.remove()
    } else {
      region.addRegion({
        id: '__RepeatArea__',
        start: value.start as number / 1000,
        end: value.end as number /1000,
        drag: false,
        resize: false,
        color: 'rgba(0, 0, 0, 0.3)',
      })
      const repeatR = region.getRegions().find((r: Region) => r.id === '__RepeatArea__')
      setRepeatRegion(repeatR)
      setRepeatTimer(setInterval(() => {
        const now = wavesurfer!.getCurrentTime()
        if (now >= repeatR!.end) repeatR?.play()
      }, 500))
      repeatR?.play()
    }
  }

  const onZoom = (mode: 'horizontal' | 'vertical', zoom: number) => {
    switch(mode) {
      case 'horizontal':
        setHorizontalZoom(zoom)
        load()
        break
      case 'vertical':
        setVerticalZoom(zoom)
        load()
        break
    }
  }

  const onSpect = <K extends keyof SpectOption, T extends SpectOption>(mode: K, spect: T[K]) => {
    switch(mode) {
      case 'spectrum':
        setSpectrum(spect)
        load()
        break
      case 'spectrogram':
        setSpectrogram(spect)
        load()
        break
      default:
        const key: never = mode
        console.log(key)
    }
  }

  return (
    <div className="audio-container" ref={audioContainerRef}>
      <div className="audio-content">
        <Spin tip={spinText} spinning={spinning} delay={300}/>
        <div className="wavesurfer-container" ref={wavesurferContainerRef}>
          <div className="wave-spectrum" ref={waveSpectrumRef}></div>
          <div className="wave-spectrogram" ref={waveSpectrogramRef}></div>
        </div>
      </div>
      <AudioToolbar
        time={time}
        totalTime={totalTime}
        spectrogram={spectrogram}
        spectrum={spectrum}
        horizontalZoom={horizontalZoom}
        verticalZoom={verticalZoom}
        btnOptions={props.audioBtnConfig}
        information={props.information}
        play={play}
        pause={pause}
        skip={skip}
        stop={stop}
        onFullScreen={onFullScreen}
        offFullScreen={offFullScreen}
        changeRate={changeRate}
        changeVolume={changeVolume}
        skipMute={skipMute}
        showMute={showMute}
        toggleRepeat={toggleRepeat}
        onSpect={onSpect}
        onZoom={onZoom}
      />
    </div>
  )
}

export default ViewAudio