import React, { useEffect, useRef, useState } from 'react'
import './Cutter.css'
import { CutterInfo } from '../../../../../types/base'
import { formatTime, iso2Time, regexTime } from '../../utils'
import { Button, Form, Input, InputRef, Slider, message } from 'antd'

type CutterProps = {
  totalTime: number
  skip: (time: number) => void
  saveCutter: (cutterInfo: CutterInfo) => void
}

const Cutter: React.FC<CutterProps> = (props) => {
  const { totalTime, skip, saveCutter } = props

  const startInputRef = useRef<InputRef>(null)
  const endInputRef = useRef<InputRef>(null)

  const [range, setRange] = useState([0, 0])
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')

  /**
   * @description 剪辑时当前编辑的位置
   */
  let currentInput: 'start' | 'end' | null = null

  useEffect(() => {
    setRange([0, 0])
    setStart('00:00:00')
    setEnd('00:00:00')
  }, [props.totalTime])

  useEffect(() => {
    const [s, e] = range
    const startString: string = formatTime(s)
    const endString: string = formatTime(e)
    if (currentInput === 'start') skip(s)
    else if (currentInput === 'end') skip(e)
    else {
      if (startString !== start) skip(s)
      else if (endString !== end) skip(e)
      setStart(startString)
      setEnd(endString)
    }
  }, [start, end, range, currentInput, skip])

  const formatTooltip = (time: number | undefined) => {
    return formatTime(time!)
  }

  const onStartChange = (value: string) => {
    let [start, end] = range
    if (!(currentInput && regexTime.test(value))) return
    if (iso2Time(value) <= end) start = iso2Time(value)
    else {
      message.warning({ content: '开始时间不能大于结束时间！' })
      start = end
      setStart(formatTime(start))
    }
    setRange([start, end])
  }

  const onEndChange = (value: string) => {
    let [start, end] = range
    if (!(currentInput && regexTime.test(value))) return
    if (iso2Time(value) >= start) end = iso2Time(value)
    else {
      message.warning({ content: '结束时间不能小于开始时间！' })
      end = start
      setEnd(formatTime(end))
    }
    setRange([start, end])
  }

  const onRangeChange = (value: [number, number]) => {
    const s = formatTime(value[0])
    const e = formatTime(value[1])
    if (currentInput === 'start') {
      setStart(s)
      startInputRef.current?.blur()
    } else if (currentInput === 'end') {
      setEnd(e)
      endInputRef.current?.blur()
    } else return
  }

  const onFocus = (key: 'start' | 'end') => {
    currentInput = key
  }

  const onBlur = (key: 'start' | 'end') => {
    const [s, e] = range
    if (key === 'start' && !regexTime.test(start)) {
      setStart(formatTime(s))
    } else if (key === 'end' && !regexTime.test(end)) {
      setEnd(formatTime(e))
    }
  }

  const onSubmit = () => {
    const [s, e] = range
    s !== e && saveCutter({ start: s, end: e, duration: e - s })
  }

  return (
    <div className='media-editor'>
      <Slider max={totalTime} tooltip={{ formatter: formatTooltip }} onChange={onRangeChange} range={true} />
      <Form layout='vertical'>
        <Form.Item>
          <Input
            ref={startInputRef}
            value={start}
            addonBefore="开始时间"
            onFocus={() => onFocus('start')}
            onBlur={() => onBlur('start')}
            onChange={(e) => onStartChange(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Input
            ref={endInputRef}
            value={end}
            addonBefore="结束时间"
            onFocus={() => onFocus('end')}
            onBlur={() => onBlur('end')}
            onChange={(e) => onEndChange(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Button type='primary' onClick={onSubmit} />
        </Form.Item>
      </Form>
    </div>
  )
}

export default Cutter