import React, { useMemo, useState } from "react"
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
  const options: DeepRequired<DisplayConfig> = useMemo(() => {
    return {
      spect: {
        spectrum: props.options?.spect?.spectrum || true,
        spectrogram: props.options?.spect?.spectrogram || true
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
  }, [props.options])

  const [verticalZoomValue, setVerticalZoomValue] = useState(options.zoomOptions.verticalZoom.init)
  const [horizontalZoomValue, setHorizontalZoomValue] = useState(options.zoomOptions.horizontalZoom.init)
  const [spectrumShow, setSpectrumShow] = useState(options.spect.spectrum)
  const [spectrogramShow, setSpectrogramShow] = useState(options.spect.spectrogram)

  const spectHandler = debounce((mode: 'spectrogram' | 'spectrum', value: boolean) => props.onSpect(mode, value))
  const zoomHandler = debounce((mode: 'horizontal' | 'vertical', zoom: number) => props.onZoom(mode, zoom))

  const onStateChange = <K extends keyof DisplaySettings, T extends DisplaySettings>(key: K, value: T[K]) => {
    switch (key) {
      case 'spectrum': {
        spectHandler(key, value as boolean)
        setSpectrumShow(value as boolean)
        break
      }
      case 'spectrogram': {
        spectHandler(key, value as boolean)
        setSpectrogramShow(value as boolean)
        break
      }
      case 'horizontalZoom': {
        zoomHandler('horizontal', value as number)
        setHorizontalZoomValue(value as number)
        break
      }
      case 'verticalZoom': {
        zoomHandler('vertical', value as number)
        setVerticalZoomValue(value as number)
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
            checked={spectrumShow}
            disabled={!spectrogramShow}
            onChange={(value) => onStateChange('spectrum', value)}
          />
        </Form.Item>
        <Form.Item label='语谱图'>
          <Switch
            checked={spectrogramShow}
            disabled={!spectrumShow}
            onChange={(value) => onStateChange('spectrogram', value)}
          />
        </Form.Item>
        <Form.Item label='水平缩放'>
          <Slider
            value={horizontalZoomValue}
            min={options.zoomOptions.horizontalZoom.min}
            max={options.zoomOptions.horizontalZoom.max}
            step={options.zoomOptions.horizontalZoom.step}
            tooltip={{ open: false }}
            onChange={(value) => onStateChange('horizontalZoom', value)}
          />
        </Form.Item>
        <Form.Item label='垂直缩放'>
          <Slider
            value={verticalZoomValue}
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