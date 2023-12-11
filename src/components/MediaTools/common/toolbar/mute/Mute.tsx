import React from "react"
import './Mute.css'
import { Switch } from "antd"

type MuteProps = {
  skip: boolean
  show: boolean
  onSkip: (value: boolean) => void
  onShow: (value: boolean) => void
}

const Mute: React.FC<MuteProps> = (props) => {
  return (
    <React.Fragment>
      <div className='switch-container'>
        跳过静音区
        <Switch checked={props.skip} onChange={props.onSkip}/>
      </div>
      <div className='switch-container'>
        显示静音区
        <Switch checked={props.show} onChange={props.onShow}/>
      </div>
    </React.Fragment>
  )
}

export default Mute