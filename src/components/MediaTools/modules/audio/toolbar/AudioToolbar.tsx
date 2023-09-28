import React, { useState } from "react"
import './AudioToolbar.css'
import { AudioBtnConfig, DisplayConfig, RepeatSettings } from "../../../../../types/audio"
import { CommonBtnConfig, Information } from "../../../../../types/base"
import CommonToolbar from "../../../common/toolbar/CommonToolbar"
import CommonPopover from "../../../common/popover/CommonPopover"
import { Icon } from '@iconify/react'
import Repeat from "../../../common/toolbar/repeat/Repeat"
import Mute from "../../../common/toolbar/mute/Mute"
import Display from "../../../common/toolbar/display/Display"

type AudioToolbarProps = {
  time: number
  totalTime: number
  btnOptions?: AudioBtnConfig
  displayOptions?: DisplayConfig
  information?: Array<Information>
  rates?: Array<number>
  play: () => void
  pause: () => void
  stop: () => void
  skip: (time: number) => void
  onFullScreen: () => void
  offFullScreen: () => void
  changeVolume: (volume: number) => void
  changeRate: (rate: number) => void
  skipMute: (value: boolean) => void
  showMute: (value: boolean) => void
  toggleRepeat: (value: RepeatSettings) => void
  onZoom: (mode: 'horizontal' | 'vertical', zoom: number) => void
  onSpect: (mode: 'spectrum' | 'spectrogram', spect: boolean) => void
}

const AudioToolbar: React.FC<AudioToolbarProps> = (props) => {
  const commonOptions: CommonBtnConfig = {
    isRate: props.btnOptions?.isRate,
    ifVolume: props.btnOptions?.ifVolume,
    ifInfo: props.btnOptions?.ifInfo,
    ifFullScreen: props.btnOptions?.ifFullScreen
  }

  const [skip, setSkip] = useState(false)
  const [show, setShow] = useState(false)

  return (
    <React.Fragment>
      <CommonToolbar
        time={props.time}
        totalTime={props.totalTime}
        information={props.information}
        options={commonOptions}
        rates={props.rates}
        play={props.play}
        pause={props.pause}
        stop={props.stop}
        skip={props.skip}
        changeRate={props.changeRate}
        changeVolume={props.changeVolume}
        onFullScreen={props.onFullScreen}
        offFullScreen={props.offFullScreen}
      >
        {
          (props.btnOptions?.ifRepeat !== false) &&
          <CommonPopover reference={<Icon icon="ic:round-repeat-on" color="lightblue" width={28} height={28}/>}>
            <Repeat totalTime={props.totalTime} toggleRepeat={props.toggleRepeat}/>
          </CommonPopover>
        }
        {
          (props.btnOptions?.ifMute !== false) &&
          <CommonPopover reference={<Icon icon="material-symbols:tab-close" color="lightblue" width={28} height={28}/>}>
            <Mute show={show} skip={skip} onShow={setShow} onSkip={setSkip}/>
          </CommonPopover>
        }
        {
          (props.btnOptions?.ifDisplay !== false) &&
          <CommonPopover width={180} reference={<Icon icon="material-symbols:display-settings" color="lightblue" width={28} height={28}/>}>
            <Display options={props.displayOptions} onSpect={props.onSpect} onZoom={props.onZoom}/>
          </CommonPopover>
        }
      </CommonToolbar>
    </React.Fragment>
  )
}

export default AudioToolbar