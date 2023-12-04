/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-globals */
import React, { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import './CommonToolbar.css'
import { CommonBtnConfig, Information } from "../../../../types/base"
import { Icon } from '@iconify/react'
import { formatTime, setEventListener } from "../utils"
import CommonPopover from "../popover/CommonPopover"
import { Slider } from "antd"

type ToolbarProps = {
  ref?: ForwardedRef<{ init: () => void }>
  time: number
  totalTime: number
  options?: CommonBtnConfig
  information?: Array<Information>
  rates?: Array<number>
  controls?: React.ReactNode
  children?: React.ReactNode
  play: () => void
  pause: () => void
  stop: () => void
  skip: (time: number) => void
  onFullScreen: () => void
  offFullScreen: () => void
  changeVolume: (volume: number) => void
  changeRate: (rate: number) => void
}

const CommonToolbar: React.ForwardRefExoticComponent<ToolbarProps> = forwardRef((props, ref) => {
  /**
   * 拖动进度条的状态
   */
  const [isSync, setIsSync] = useState(false)

  const [time, setTime] = useState(0)
  const [rate, setRate] = useState(1)
  const [volume, setVolume] = useState(1)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false) 

  const ratePopperRef = useRef<{ show: () => void, hide: () => void, toggle: () => void }>(null)

  const onTimeChange = (time: number) => {
    if (time === props.totalTime) {
      setIsPlaying(false)
      setTime(0)
    } else setTime(time)
  }

  const onVolumeChange = (volume: number) => {
    setVolume(volume)
    props.changeVolume(volume)
  }

  const onRateChange = (rate: number) => {
    ratePopperRef.current?.hide()
    props.changeRate(rate)
  }

  const listenResize = () => {
    setIsFullScreen(window.innerHeight === screen.height)
  }

  const play = () => {
    setIsPlaying(true)
    props.play()
  }

  const pause = () => {
    setIsPlaying(false)
    props.pause()
  }

  const stop = () => {
    setIsPlaying(false)
    props.stop()
  }

  const formatVolume = (volume: number | undefined) => {
    return (volume! * 100).toFixed(0)
  }

  const changeSync = (value: boolean) => {
    setIsSync(value)
  }

  const init = () => {
    setIsPlaying(false)
    setTime(0)
    setRate(1)
  }

  useImperativeHandle(ref, () => ({ init }))

  useEffect(() => {
    setEventListener(window, 'resize', listenResize)
  }, [])

  useEffect(() => {
    !isSync && props.skip(time)
  }, [time])

  useEffect(() => {
    isSync && setTime(props.time)
  }, [props.time])

  const volumeRefEl = (): JSX.Element => {
    if (volume === 0) {
      return <Icon icon="lucide:volume-x" color="lightblue" width={28} height={28}/>
    } else if (volume < 0.5) {
      return <Icon icon="lucide:volume-1" color="lightblue" width={28} height={28}/>
    } else {
      return <Icon icon="lucide:volume-2" color="lightblue" width={28} height={28}/>
    }
  }

  return (
    <div className="toolbar-container">
      <div className="controls">
        <div className="left">
          <div className="play-btns">
            <Icon icon="carbon:stop-filled" color="lightblue" width={28} height={28} onClick={stop}/>
            { 
              !isPlaying
              ? <Icon icon="carbon:play-filled" color="lightblue" width={28} height={28} onClick={play}/>
              : <Icon icon="zondicons:pause-solid" color="lightblue" width={28} height={28} onClick={pause}/>
            } 
            {props.controls}
          </div>
          <div className="play-time">{`${formatTime(time)} / ${formatTime(props.totalTime)}`}</div>
        </div>
        <div className="right">
          {props.children}
          { 
            (props.options?.isRate !== false) && 
            <CommonPopover
              ref={ratePopperRef}
              popperClass="toolbar-popper"
              reference={ <div className="play-rate"><span>{rate}X</span></div> }
            >
              {
                (props.rates === undefined || props.rates.length === 0)
                ? [0.5, 1, 1.5, 2].map((value: number, index: number) => (
                    <div className="selection-items" key={index} onClick={() => onRateChange(value)}>{value}X</div>
                  ))
                : props.rates.map((value: number, index: number) => (
                  <div className="selection-items" key={index} onClick={() => onRateChange(value)}>{value}X</div>
                  ))
              }
            </CommonPopover>
          }
          {
            (props.options?.ifVolume !== false) &&
            <CommonPopover popperClass="toolbar-popper" reference={volumeRefEl()}>
              <div style={{ height: '120px' }}>
                <Slider
                  value={volume}
                  min={0}
                  max={1}
                  step={0.01}
                  tooltip={{ formatter: formatVolume }}
                  onChange={onVolumeChange}
                  vertical
                />
              </div>
            </CommonPopover>
          }
          {
            (props.options?.ifFullScreen !== false) && 
            (
              isFullScreen
              ? <Icon icon="material-symbols:fullscreen-exit" color="lightblue" width={28} height={28} onClick={props.offFullScreen}/>
              : <Icon icon="material-symbols:fullscreen" color="lightblue" width={28} height={28} onClick={props.onFullScreen}/>
            )
          }
          {
            (props.options?.ifInfo !== false) &&
            <CommonPopover 
              popperClass="toolbar-popper"
              placement="top-end"
              reference={ <Icon icon="clarity:help-info-solid" color="lightblue" width={28} height={28}/> }
            >
              {
                (props.information === undefined || props.information.length === 0)
                ? <div>暂无信息</div>
                : props.information.map((item: Information, index: number) => {
                    return (
                      <div className="play-information" key={index}>
                        <span>{item.label}: </span>
                        <span>{item.value}</span>
                      </div>
                    )
                  })
              }
            </CommonPopover>
          }
        </div>
      </div>
      <input
        type="range"
        value={time}
        min={0}
        max={props.totalTime}
        onChange={(e) => onTimeChange(parseInt(e.target.value))}
        onMouseDown={() => changeSync(false)}
        onMouseUp={() => changeSync(true)}
      />
    </div>
  )
})

export default CommonToolbar