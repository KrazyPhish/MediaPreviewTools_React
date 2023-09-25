import React from "react"
import './Display.css'
import { DeepRequired } from '../../../../../types/base'
import { DisplayConfig, DisplaySettings } from "../../../../../types/audio"
import { debounce } from "../../utils"
import { Form, Slider, Switch } from "antd"

type DisplayProps = DeepRequired<DisplayConfig> & {
  onZoom: (mode: 'horizontal' | 'vertical', zoom: number) => void
  onSpect: (mode: 'spectrum' | 'spectrogram', spect: boolean) => void
}

const Display: React.FC<DisplayProps> = (props) => {
  const spectHandler = debounce((mode: 'spectrogram' | 'spectrum', value: boolean) => props.onSpect(mode, value))
  const zoomHandler = debounce((mode: 'horizontal' | 'vertical', zoom: number) => props.onZoom(mode, zoom))

  const onStateChange = (key: keyof DisplaySettings, value: DisplaySettings[keyof DisplaySettings]) => {
    if (key === 'spectrogram' || key === 'spectrum') {
      spectHandler(key, value as boolean)
    } else if (key === 'horizontalZoom') {
      zoomHandler('horizontal', value as number)
    } else if (key === 'verticalZoom') {
      zoomHandler('vertical', value as number)
    }
  }

  return (
    <div className="media-display">
      <Form layout="horizontal" size="small">
        <Form.Item label="频谱图">
          <Switch checked={props.spect.spectrum} disabled={!props.spect.spectrogram} onChange={(value) => onStateChange('spectrum', value)}/>
        </Form.Item>
        <Form.Item label="语谱图">
          <Switch checked={props.spect.spectrogram} disabled={!props.spect.spectrum} onChange={(value) => onStateChange('spectrogram', value)}/>
        </Form.Item>
        <Form.Item label="水平缩放">
          <Slider
            value={props.zoomOptions.horizontalZoom.init}
            min={props.zoomOptions.horizontalZoom.min}
            max={props.zoomOptions.horizontalZoom.max}
            step={props.zoomOptions.horizontalZoom.step}
            tooltip={{ open: false }}
            onChange={(value) => onStateChange('horizontalZoom', value)}
          />
        </Form.Item>
        <Form.Item label="垂直缩放">
          <Slider
            value={props.zoomOptions.verticalZoom.init}
            min={props.zoomOptions.verticalZoom.min}
            max={props.zoomOptions.verticalZoom.max}
            step={props.zoomOptions.verticalZoom.step}
            tooltip={{ open: false }}
            onChange={(value) => onStateChange('verticalZoom', value)}
          />
        </Form.Item>
      </Form>
    </div>
  )
}

export default Display