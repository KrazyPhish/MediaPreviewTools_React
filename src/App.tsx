import React, { useRef, useState } from 'react'
import './App.css'
import { Row, Col, Form, Select, Button, Input, Space } from 'antd'
import { VideoBtnConfig } from './types/video'
import { AudioBtnConfig, AudioRegion } from './types/audio'
import { CutterInfo, Information } from './types/base'
import  MediaTools from './components/MediaTools/MediaTools'

const App: React.FC = () => {
  const videoBtnConfig: VideoBtnConfig = {
    isRate: true,
    ifCutter: true,
    ifVolume: true,
    ifInfo: true,
    ifFullScreen: true
  }

  const audioBtnConfig: AudioBtnConfig = {
    ifDisplay: true,
    ifMute: true,
    ifRepeat: true,
    isRate: true,
    ifVolume: true,
    ifInfo: true,
    ifFullScreen: true
  }

  /**
   * @description 文件扩展名
   */
  const [extension, setExtension] = useState<string>('')

  /**
   * @description 媒体文件地址Url
   */
  const [url, setUrl] = useState<string>('')
  
  /**
   * @description 媒体对应的字幕文件地址Url
   */
  const vtt: string = ''
  
  /**
   * @description 视频封面地址Url
   */
  const poster: string = ''
  
  /**
   * @description 音视频详细信息数据
   */
  const information: Information[] = [
    { label: '通道数', value: '2' },
    { label: '采样率', value: '240000' },
    { label: '帧数', value: '60' }
  ]

  const [formState, setFormState] = useState({ extension: '.mp3', url: '/demo.wav' })

  const extensionOption: Information[] = [
    {
      label: '音频',
      value: '.mp3'
    },
    {
      label: '邮件',
      value: '.eml'
    },
    {
      label: 'Office',
      value: '.docx'
    },
    {
      label: 'PDF',
      value: '.pdf'
    },
    {
      label: '图片',
      value: '.jpg'
    },
    {
      label: '视频',
      value: '.mp4'
    }
  ] 

  const formOption: Information[] = [
    {
      value: '/demo.wav',
      label: 'demo.wav'
    },
    {
      value: '/456.mp4',
      label: '456.mp4'
    },
    {
      value: '/demo.pdf',
      label: '/demo.pdf'
    },
    {
      value: '/tibet-1.jpg',
      label: '图片1.jpg'
    },
    {
      value: '/ppt.html',
      label: 'ppt文档'
    },
    {
      value: 'email_test.html',
      label: 'email_test'
    }
  ]

  const dataSources: AudioRegion[] = [
    { id: '1', name: 'test1', start: 6.666, end: 8.888, drag: false, resize: false, mute: false },
    { id: '2', name: 'test2', start: 1.111, end: 3.888, drag: false, resize: false, mute: false },
    { id: '5', name: 'test3', start: 5.000, end: 9.000, drag: false, resize: false, mute: false },
    { id: '10', name: 'test4', start: 9.000, end: 9.000, drag: false, resize: false, mute: false },
    { id: '11', name: 'mute2', start: 14.000, end: 18.000, drag: false, resize: false, mute: true, color: 'rgba(230, 200, 60, 0.2)' },
    { id: '12', name: 'mute3', start: 1.000, end: 3.000, drag: false, resize: false, mute: true, color: 'rgba(230, 200, 60, 0.2)' },
  ]

  const onTypeChange = (value: string) => {
    setFormState(prevState => ({
      ...prevState,
      extension: value
    }))
  }

  const onAddressChange = (value: string) => {
    setFormState(prevState => ({
      ...prevState,
      url: value
    }))
  }

  const mediaToolsRef = useRef<{ zoomIn: () => void, zoomOut: () => void }>(null)

  const saveCutter = (param: CutterInfo) => {
    console.log('save cutter operation', param)
  }

  const zoomIn = () => {
    mediaToolsRef.current?.zoomIn()
  }

  const zoomOut = () => {
    mediaToolsRef.current?.zoomOut()
  }

  const onSubmit = () => {
    setExtension(formState.extension)
    setUrl(formState.url)
  }

  return (
    <React.Fragment>
      <Row className='my-row' gutter={10}>
        <Col span={6}>
          <div className='container left'>
            <Form layout='horizontal' size='small'>
              <Form.Item label='文件类型'>
                <Select
                  value={formState.extension}
                  options={extensionOption}
                  onChange={onTypeChange}
                />
              </Form.Item>
              <Form.Item label='文件名称'>
                <Select 
                  value={formState.url}
                  options={formOption}
                  onChange={onAddressChange}
                />
              </Form.Item>
              <Form.Item label='文件地址'>
                <Input value={formState.url} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onAddressChange(e.target.value)}/>
              </Form.Item>
              <Form.Item>
                <Space>
                  <Button type='primary' onClick={onSubmit}>加载</Button>
                  <Button type='primary' onClick={zoomIn}>+</Button>
                  <Button type='primary' onClick={zoomOut}>-</Button>
                </Space>
              </Form.Item>
            </Form>
          </div>
        </Col>
        <Col span={18}>
          <div className='container'>
            <MediaTools
              ref={mediaToolsRef}
              extension={extension}
              url={url}
              vtt={vtt}
              poster={poster}
              information={information}
              dataSources={dataSources}
              videoBtnConfig={videoBtnConfig}
              audioBtnConfig={audioBtnConfig}
              saveCutter={saveCutter}
            />
          </div>
        </Col>
      </Row>
    </React.Fragment>
  )
}

export default App