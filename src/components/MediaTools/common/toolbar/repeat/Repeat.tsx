import React from "react"
import './Repeat.css'
import { Form, Input, Switch, message } from "antd"
import { RepeatSettings } from "../../../../../types/audio"
import { iso2Time } from "../../utils"

type RepeatProps = {
  totalTime: number
  toggleRepeat: (value: RepeatSettings) => void
}

const Repeat: React.FC<RepeatProps> = (props) => {
  const [form] = Form.useForm<RepeatSettings>()

  const toggleRepeat = () => {
    const { start, end, repeat } = form.getFieldsValue()
    if (!repeat) {
      props.toggleRepeat({ start: 0, end: 0, repeat })
      return
    }
    if (!start || !end) {
      message.warning({ content: '起止时间有误，请检查你的参数' })
      return
    } 
    const s: number = iso2Time(start as string)
    const e: number = iso2Time(end as string)
    if (s >= e || s >= props.totalTime || e <= 0) {
      message.warning({ content: '起止时间有误，请检查你的参数' })
      form.setFieldValue('repeat', false)
      return
    }
    props.toggleRepeat({ start: s, end: e, repeat })
  }

  return (
    <React.Fragment>
      <Form layout='horizontal' form={form}>
        <Form.Item name='start'>
          <Input addonBefore='开始时间' placeholder='00:00:00'/>
        </Form.Item>
        <Form.Item name='end'>
          <Input addonBefore='结束时间' placeholder='00:00:00'/>
        </Form.Item>
        <Form.Item label='复播' name='repeat' valuePropName='checked'>
          <Switch defaultChecked={false} checkedChildren="开启" unCheckedChildren="关闭" onChange={() => toggleRepeat()}/>
        </Form.Item>
      </Form>
    </React.Fragment>
  )
}

export default Repeat