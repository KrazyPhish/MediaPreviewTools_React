import React, { useMemo } from "react"
import './Display.css'
import { DeepRequired } from '../../../../../types/base'
import { DisplayConfig, DisplaySettings } from "../../../../../types/audio"
import { debounce } from "../../utils"
import { Form, Slider, Switch } from "antd"

type DisplayProps = {
  options?: DisplayConfig
  spectrum: boolean
  spectrogram: boolean
  horizontalZoom: number
  verticalZoom: number
  onZoom: (mode: 'horizontal' | 'vertical', zoom: number) => void
  onSpect: (mode: 'spectrum' | 'spectrogram', spect: boolean) => void
}

const Display: React.FC<DisplayProps> = (props) => {
  const options: DeepRequired<Pick<DisplayConfig, 'zoomOptions'>> = useMemo(() => {
    return {
      zoomOptions: {
        verticalZoom: {
          max: props.options?.zoomOptions?.verticalZoom?.max ? props.options?.zoomOptions.verticalZoom.max : 2,
          min: props.options?.zoomOptions?.verticalZoom?.min ? props.options?.zoomOptions.verticalZoom.min : 1,
          step: props.options?.zoomOptions?.verticalZoom?.step ? props.options?.zoomOptions.verticalZoom.step : 0.01
        },
        horizontalZoom: {
          max: props.options?.zoomOptions?.horizontalZoom?.max ? props.options?.zoomOptions.horizontalZoom.max : 150,
          min: props.options?.zoomOptions?.horizontalZoom?.min ? props.options?.zoomOptions.horizontalZoom.min : 1,
          step: props.options?.zoomOptions?.horizontalZoom?.step ? props.options?.zoomOptions.horizontalZoom.step : 1.5
        }
      }
    }
  }, [props.options])

  const spectHandler = debounce((mode: 'spectrogram' | 'spectrum', value: boolean) => props.onSpect(mode, value))
  const zoomHandler = debounce((mode: 'horizontal' | 'vertical', zoom: number) => props.onZoom(mode, zoom))

  const onStateChange = <K extends keyof DisplaySettings, T extends DisplaySettings>(key: K, value: T[K]) => {
    switch (key) {
      case 'spectrum': {
        spectHandler(key, value as boolean)
        break
      }
      case 'spectrogram': {
        spectHandler(key, value as boolean)
        break
      }
      case 'horizontalZoom': {
        zoomHandler('horizontal', value as number)
        break
      }
      case 'verticalZoom': {
        zoomHandler('vertical', value as number)
        break
      }
      default: {
        const n: never = key
        console.log(n)
      }
    }
  }

  return (
    <div className="media-display">
      <Form layout="horizontal" size="small">
        <Form.Item label='频谱图'>
          <Switch
            checked={props.spectrum}
            disabled={!props.spectrogram}
            onChange={(value) => onStateChange('spectrum', value)}
          />
        </Form.Item>
        <Form.Item label='语谱图'>
          <Switch
            checked={props.spectrogram}
            disabled={!props.spectrum}
            onChange={(value) => onStateChange('spectrogram', value)}
          />
        </Form.Item>
        <Form.Item label='水平缩放'>
          <Slider
            value={props.horizontalZoom}
            min={options.zoomOptions.horizontalZoom.min}
            max={options.zoomOptions.horizontalZoom.max}
            step={options.zoomOptions.horizontalZoom.step}
            tooltip={{ open: false }}
            onChange={(value) => onStateChange('horizontalZoom', value)}
          />
        </Form.Item>
        <Form.Item label='垂直缩放'>
          <Slider
            value={props.verticalZoom}
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