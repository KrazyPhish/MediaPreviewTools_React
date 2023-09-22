import React, { useRef } from 'react'
import '../picture/viewer/viewer.css'
import './ViewPicture.css'
import Viewer from './viewer/viewer.esm'
import { px2Int, setEventListener } from '../../common/utils'

type PictureProps = {
  url: string
}

const ViewPicture: React.FC<PictureProps> = (props) => {
  /**
   * 大图DIV容器
   */
  const imgMainRef = useRef<HTMLDivElement>(null)
  /**
   * 大图图片
   */
  const imageRef = useRef<HTMLImageElement>(null)
  /**
   * 鹰眼DIV容器
   */
  const miniMapRef = useRef<HTMLDivElement>(null)
  /**
   * 鹰眼图片DIV容器
   */
  const imgContainerRef = useRef<HTMLDivElement>(null)
  /**
   * 鹰眼图片
   */
  const previewRef = useRef<HTMLImageElement>(null)
  /**
   * 图片在鹰眼DIV容器中移动时的实际容器DOM
   */
  let imageDom: HTMLDivElement
  /**
  * 鹰眼的实际容器DIV的DOM
  */
  let imageContainerDom: HTMLDivElement
  /**
   * 鹰眼放大时的可视边框
   */
  const previewBoxRef = useRef<HTMLDivElement>(null)
  /**
   * viewer.js的容器
   */
  let viewer: Viewer

  /**
   * 全屏状态
   */
  let ifFullScreen: boolean = false, scaleX: number = 1, scaleY: number = 1, rotate: number = 0

  const imgOnload = () => {
    initViewer()
    listenResize()
    dragEventConfig()
  }

  const initViewer = () => {
    if (props.url) previewRef.current!.src = props.url
    if (viewer !== undefined) viewer.destroy()
    viewer = new Viewer(imageRef.current, {
      title: false,
      navbar: false,
      inline: true,
      minZoomRatio: 0.1,
      maxZoomRatio: 10,
      hide: () => {
        viewer.destroy()
      },
      move: (ev: any) => {
        calcPreviewBoxPos(ev)
      },
      zoomed: () => {
        calcMiniMapSize()
      },
      ready: () => {
        miniMapEventConfig()
      }
    })
    viewer.show()
  }

  const calcPreviewBoxPos = (ev: any) => {
    if (!imageDom || !imageContainerDom) return
    const wp: number = previewRef.current!.clientWidth / imageDom.clientWidth
    const hp: number = previewRef.current!.clientHeight / imageDom.clientHeight
    const x: number = - (ev.detail.x * wp)
    const y: number = - (ev.detail.y * hp)
    previewBoxRef.current!.style.left = `${x}px`
    previewBoxRef.current!.style.top = `${y}px`
  }

  const calcMiniMapSize = () => {
    if (!imageDom || !imageContainerDom) {
      imageDom = imgMainRef.current?.getElementsByClassName('viewer-move')[0] as HTMLDivElement
      imageContainerDom = imgMainRef.current?.getElementsByClassName('viewer-container')[0] as HTMLDivElement
    }
    if (imageDom && imageContainerDom) {
      if (imageDom.clientWidth > imageContainerDom.clientWidth || imageDom.clientHeight > imageContainerDom.clientHeight) {
        previewRef.current!.style.display = ''
        previewBoxRef.current!.style.display = ''
        const wp = imageContainerDom.clientWidth / imageDom.clientWidth
        const hp = imageContainerDom.clientHeight / imageDom.clientHeight
        const previewboxWidth = previewRef.current!.clientWidth * wp
        const previewboxHeight = previewRef.current!.clientHeight * hp
        previewBoxRef.current!.style.width = `${previewboxWidth}px`
        previewBoxRef.current!.style.height = `${previewboxHeight}px`
        viewer?.move(0)
      } else {
        hideMiniMap()
      }
    }
  }

  const hideMiniMap = () => {
    previewRef.current!.style.display = 'none'
    previewBoxRef.current!.style.display = 'none'
  }

  const miniMapEventConfig = () => {
    /**
     * 1:1比例按钮
     */
    const toOneBtn: HTMLButtonElement = document.getElementsByClassName('viewer-one-to-one')[0] as HTMLButtonElement
    /**
     * 重置按钮
     */
    const resetBtn: HTMLButtonElement = document.getElementsByClassName('viewer-reset')[0] as HTMLButtonElement
    /**
     * 全屏按钮
     */
    const fullScreenBtn: HTMLButtonElement = document.getElementsByClassName('viewer-button viewer-fullscreen')[0] as HTMLButtonElement
    /**
     * 逆时针旋转按钮
     */
    const rotateLeftBtn: HTMLButtonElement = document.getElementsByClassName('viewer-rotate-left')[0] as HTMLButtonElement
    /**
     * 顺时针旋转按钮
     */
    const rotateRightBtn: HTMLButtonElement = document.getElementsByClassName('viewer-rotate-right')[0] as HTMLButtonElement
    /**
     * 水平翻转按钮
     */
    const flipHorizontalBtn: HTMLButtonElement = document.getElementsByClassName('viewer-flip-horizontal')[0] as HTMLButtonElement
    /**
     * 垂直翻转按钮
     */
    const flipVerticalBtn: HTMLButtonElement = document.getElementsByClassName('viewer-flip-vertical')[0] as HTMLButtonElement
    
    let stopKeyboardEvent: Function

    /**
     * ESC键盘事件
     * @param {KeyboardEvent} event
     * @returns {void} void
     */
    const keyboardEvent = (event: KeyboardEvent) => {
      if (event.code === 'Escape' && ifFullScreen) {
        hideMiniMap()
        ifFullScreen = false
        miniMapRef.current!.style.position = 'absolute'
        miniMapRef.current!.style.maxHeight = '200px'
        miniMapRef.current!.style.maxWidth = '200px'
        stopKeyboardEvent()
      }
    }

    /**
     * 全屏图片
     * @returns {void} void
     */
    const fullScreenImg = () => {
      hideMiniMap()
      if (ifFullScreen) {
        ifFullScreen = false
        miniMapRef.current!.style.position = 'absolute'
        miniMapRef.current!.style.maxHeight = '200px'
        miniMapRef.current!.style.maxWidth = '200px'
        stopKeyboardEvent()
      } else {
        ifFullScreen = true
        miniMapRef.current!.style.position = 'fixed'
        miniMapRef.current!.style.maxHeight = '400px'
        miniMapRef.current!.style.maxWidth = '400px'
      }
      stopKeyboardEvent = setEventListener(document, 'keydown', keyboardEvent)
    }

    /**
     * 重置鹰眼及图片位置
     * @returns {void} void
     */
    const resetImg = () => {
      hideMiniMap()
      rotate = 0
      scaleX = 1
      scaleY = 1
      previewRef.current!.style.transform = `rotate(${rotate}deg)`
    }

    /**
     * 旋转图片
     * @param {string} direction 旋转方向
     * @returns {void} void
     */
    const rotateImg = (direction: 'left' | 'right') => {
      const compare: number = direction === 'left' ? -270 : 270
      const plus: number = direction === 'left' ? -90 : 90
      rotate = (rotate === compare) ? 0 : (rotate + plus)
      previewRef.current!.style.transform = `rotate(${rotate}deg)`
    }

    /**
     * 翻转图片
     * @param {string} direction 翻转方向
     * @returns {void} void
     */
    const flipImg = (direction: 'horizontal' | 'vertical') => {
      if ((((Math.abs(rotate) / 90) % 2 === 1) && direction === 'horizontal') || (((Math.abs(rotate) / 90) % 2 === 0) && direction === 'vertical')) {
        scaleY = -scaleY
      } else if ((((Math.abs(rotate) / 90) % 2 === 0) && direction === 'horizontal') || (((Math.abs(rotate) / 90) % 2 === 1) && direction === 'vertical')) {
        scaleX = -scaleX
      }
      imgContainerRef.current!.style.transform = `scale(${scaleX}, ${scaleY})`
    }

    setEventListener(toOneBtn, 'click', resetImg)
    setEventListener(resetBtn, 'click', resetImg)
    setEventListener(rotateLeftBtn, 'click', () => rotateImg('left'))
    setEventListener(rotateRightBtn, 'click', () => rotateImg('right'))
    setEventListener(flipHorizontalBtn, 'click', () => flipImg('horizontal'))
    setEventListener(flipVerticalBtn, 'click', () => flipImg('vertical'))
    setEventListener(fullScreenBtn, 'click', fullScreenImg)
  }

  /**
   * 单击鹰眼事件
   * @param {MouseEvent} event 
   */
  const onPreviewBoxClick = (event: MouseEvent) => {
    /**
     * 图片是否相对初始位置水平(0°，180°，360°算作水平)
     */
    let posFlag: boolean = true, hp: number, wp: number, left: number, top: number
    const { offsetX, offsetY } = event
    const x: number = (scaleX === -1 || rotate === 180) ? (previewRef.current!.clientWidth - offsetX) : offsetX
    const y: number = (scaleY === -1 || rotate === 180) ? (previewRef.current!.clientHeight - offsetY) : offsetY
    if ([-270, -90, 90, 270].includes(rotate)) posFlag = false
    if (!(imageDom && imageContainerDom && viewer)) return
    if (posFlag) {
      wp = previewRef.current!.clientWidth / imageDom.clientWidth
      hp = previewRef.current!.clientHeight / imageDom.clientHeight
      left = px2Int(previewBoxRef.current!.style.left) - x + previewBoxRef.current!.clientWidth / 2
      top = px2Int(previewBoxRef.current!.style.top) - y + previewBoxRef.current!.clientHeight / 2
    } else {
      wp = previewRef.current!.clientHeight / imageDom.clientHeight
      hp = previewRef.current!.clientWidth / imageDom.clientWidth
      if ([-270, 90].includes(rotate)) {
        left = px2Int(previewBoxRef.current!.style.left) - (previewRef.current!.clientHeight - y) + previewBoxRef.current!.clientHeight / 2
        top = px2Int(previewBoxRef.current!.style.top) - x + previewBoxRef.current!.clientWidth / 2
      } else if ([-90, 270].includes(rotate)) {
        left = px2Int(previewBoxRef.current!.style.left) - y + previewBoxRef.current!.clientHeight / 2
        top = px2Int(previewBoxRef.current!.style.top) - (previewRef.current!.clientWidth - x) + previewBoxRef.current!.clientWidth / 2
      }
    }
    viewer.move(left! / wp, top! / hp)
  }

  /**
   * 鹰眼可视边框单击拖拽
   */
  const dragEventConfig = () => {
    if (!previewBoxRef.current) return
    setEventListener(previewRef.current, 'mousedown', (ev: MouseEvent) => {
      onPreviewBoxClick(ev)
      const moveEvent = (event: MouseEvent) => {
        onPreviewBoxClick(event)
      }
      const stopMouseEvent = setEventListener(previewRef.current, 'mousemove', moveEvent)
      setEventListener(document, 'mouseup', stopMouseEvent, { once: true })
    })
  }

  /**
   * 监听窗口大小变化
   */
  const listenResize = () => {
    setEventListener(window, 'resize', hideMiniMap)
  }

  return (
    <div className='pic-container'>
      <div ref={imgMainRef} className='img-main'>
        <img ref={imageRef} alt='' style={{ display: 'none' }} src={props.url} onLoad={() => imgOnload()} />
      </div>
      <div ref={miniMapRef} className='mini-map'>
        <div ref={imgContainerRef}>
          <img
            ref={previewRef}
            alt=''
            style={{ display: 'none', height: 'auto', maxWidth: '100%', maxHeight: '100%' }}
            draggable={false}
            src={props.url}
            onClick={({ nativeEvent }) => onPreviewBoxClick(nativeEvent)}
          />
        </div>
        <div ref={previewBoxRef} className='preview-box' style={{ display: 'none', pointerEvents: 'none' }}></div>
      </div>
    </div>
  )
}

export default ViewPicture