import React, { ForwardedRef, forwardRef, useImperativeHandle, useRef } from "react"
import './VideoToolbar.css'
import { VideoBtnConfig } from "../../../../../types/video"
import { CutterInfo, Information } from "../../../../../types/base"
import CommonToolbar from "../../../common/toolbar/CommonToolbar"
import CommonPopover from "../../../common/popover/CommonPopover"
import { Icon } from "@iconify/react"
import Cutter from "../../../common/toolbar/cutter/Cutter"

type VideoToolbarProps = {
  ref?: ForwardedRef<{ init: () => void }>
  options?: VideoBtnConfig
  time: number
  totalTime: number
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
  saveCutter: (param: CutterInfo) => void
  toggleCutState: () => void
}

const VideoToolbar: React.ForwardRefExoticComponent<VideoToolbarProps> = forwardRef((props, ref) => {
  const toolbarRef = useRef<{ init: () => void }>(null)

  const init = () => {
    toolbarRef.current?.init()
  }

  useImperativeHandle(ref, () => ({ init }))

  return (
    <React.Fragment>
      <CommonToolbar
        ref={toolbarRef}
        options={props.options}
        time={props.time}
        totalTime={props.totalTime}
        rates={props.rates}
        play={props.play}
        pause={props.pause}
        stop={props.stop}
        skip={props.skip}
        onFullScreen={props.onFullScreen}
        offFullScreen={props.offFullScreen}
        changeRate={props.changeRate}
        changeVolume={props.changeVolume}
      >
        {
          (props.options === undefined || props.options.ifCutter !== false) &&
          <CommonPopover
            placement="top"
            width="100%"
            reference={
              <Icon icon="fluent:screen-cut-20-filled" color="lightblue" width={28} height={28} onClick={props.toggleCutState}/>
            }
          >
            <Cutter totalTime={props.totalTime} skip={props.skip} saveCutter={props.saveCutter}/>
          </CommonPopover>
        }
      </CommonToolbar>
    </React.Fragment>
  )
})

export default VideoToolbar