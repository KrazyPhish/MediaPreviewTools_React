import React from "react"
import './Display.css'
import { DeepRequired } from '../../../../../types/base'
import { DisplayConfig, DisplaySettings } from "../../../../../types/audio"
import { debounce } from "../../utils"
import { Form, Slider, Switch } from "antd"

type DisplayProps = {
  options?: DisplayConfig
  onZoom: (mode: 'horizontal' | 'vertical', zoom: number) => void
  onSpect: (mode: 'spectrum' | 'spectrogram', spect: boolean) => void
}

const Display: React.FC<DisplayProps> = (props) => {
  const options: DeepRequired<DisplayConfig> = {
    spect: {
      spectrum: props.options?.spect?.spectrum || true,
      spectrogram: props.options?.spect?.spectrogram || false
    },
    zoomOptions: {
      verticalZoom: {
        init: props.options?.zoomOptions?.verticalZoom?.init ? props.options?.zoomOptions.verticalZoom.init : 1,
        max: props.options?.zoomOptions?.verticalZoom?.max ? props.options?.zoomOptions.verticalZoom.max : 2,
        min: props.options?.zoomOptions?.verticalZoom?.min ? props.options?.zoomOptions.verticalZoom.min : 1,
        step: props.options?.zoomOptions?.verticalZoom?.step ? props.options?.zoomOptions.verticalZoom.step : 3
      },
      horizontalZoom: {
        init: props.options?.zoomOptions?.horizontalZoom?.init ? props.options?.zoomOptions.horizontalZoom.init : 1,
        max: props.options?.zoomOptions?.horizontalZoom?.max ? props.options?.zoomOptions.horizontalZoom.max : 2,
        min: props.options?.zoomOptions?.horizontalZoom?.min ? props.options?.zoomOptions.horizontalZoom.min : 1,
        step: props.options?.zoomOptions?.horizontalZoom?.step ? props.options?.zoomOptions.horizontalZoom.step : 0.01
      }
    }
  }

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
        <Form.Item label='频谱图'>
          <Switch
            checked={options.spect.spectrum}
            disabled={!options.spect.spectrogram}
            onChange={(value) => onStateChange('spectrum', value)}
          />
        </Form.Item>
        <Form.Item label='语谱图'>
          <Switch
            checked={options.spect.spectrogram}
            disabled={!options.spect.spectrum}
            onChange={(value) => onStateChange('spectrogram', value)}
          />
        </Form.Item>
        <Form.Item label='水平缩放'>
          <Slider
            value={options.zoomOptions.horizontalZoom.init}
            min={options.zoomOptions.horizontalZoom.min}
            max={options.zoomOptions.horizontalZoom.max}
            step={options.zoomOptions.horizontalZoom.step}
            tooltip={{ open: false }}
            onChange={(value) => onStateChange('horizontalZoom', value)}
          />
        </Form.Item>
        <Form.Item label='垂直缩放'>
          <Slider
            value={options.zoomOptions.verticalZoom.init}
            min={options.zoomOptions.verticalZoom.min}
            max={options.zoomOptions.verticalZoom.max}
            step={options.zoomOptions.verticalZoom.step}
            tooltip={{ open: false }}
            onChange={(value) => onStateChange('verticalZoom', value)}
          />
        </Form.Item>
      </Form>
    </div>
  )
}

export default Display