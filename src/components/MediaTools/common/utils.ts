/**
 * @description 元素全屏
 * @param {*} element Dom元素
 * @returns {void} void
 */
export const gotoFullScreen = (element: any) => {
  const requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen
  if (requestMethod) requestMethod.call(element)
}

/**
 * @description 退出全屏
 * @returns {void} void
 */
export const exitFullScreen = () => {
  const exitMethod = (document as any).cancelFullScreen || (document as any).webkitCancelFullScreen || (document as any).mozCancelFullScreen || (document as any).exitFullScreen
  if (exitMethod) exitMethod.call(document)
}

/**
 * @description 毫秒转换时分秒ISO时间格式(hh:mm:ss)
 * @param {number} ms 毫秒
 * @returns {string} ISO时间格式(hh:mm:ss)
 */
export const formatTime = (ms: number) => {
  const seconds: number = ms / 1000
  const h: number = Math.floor(seconds / 3600)
  const m: number = Math.floor((seconds / 60) % 60)
  const s: number = Math.ceil(seconds % 60)

  const hours: string = h < 10 ? '0' + h : h.toString()
  const minute: string = m < 10 ? '0' + m : m.toString()
  const second: string = s > 59 ? '59' : s < 10 ? '0' + s : s.toString()
  return `${hours}:${minute}:${second}`
}

/**
 * @description ISO时间格式(hh:mm:ss)的正则表达式
 */
export const regexTime = /^(([0-9]{1,}:)|)[0-5]{0,1}[0-9]:[0-5]{0,1}[0-9]$/

/**
 * @description ISO时间格式(hh:mm:ss)转换为毫秒 
 * @param {string} iso ISO时间
 * @returns {number} 时间毫秒数
 */
export const iso2Time = (iso: string) => {
  let time: number = 0
  if (regexTime.test(iso)) {
    const stamp: string[] = iso.split(':')
    if (stamp.length > 2) {
      const [hour, minute, second] = stamp
      time += parseInt(hour) * 3600
      time += parseInt(minute) * 60
      time += parseInt(second)
    } else {
      const [minute, second] = stamp
      time += parseInt(minute) * 60
      time += parseInt(second)
    }
  }
  return time * 1000
}

/**
 * @description 将像素值px转换为数字值
 * @param {string} px
 * @returns {number} 数字值
 */
export const px2Int = (px: string) => {
  if (!px) return 0
  return parseInt(px.replace('px', ''))
}

/**
 * @description 防抖
 * @param {Function} func 回调方法
 * @param {number} delay 延迟ms
 * @returns 
 */
export const debounce = <T extends (...args: any[]) => void>(func: T, delay: number = 200) => {
  let timer: NodeJS.Timeout
  return (...args: Parameters<T>): void => {
    timer && clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(func, args)
    }, delay)
  }
}

/**
 * 可取消的事件监听器
 * @param {Element} el 
 * @param {String} event 
 * @param {EventListenerOrEventListenerObject} listener 
 * @param {boolean | AddEventListenerOptions} options 
 * @returns {Function} Stop Listen Function
 */
export const setEventListener: Function = (el: Element, event: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): Function => {
  el.addEventListener(event, listener, options)
  return () => el.removeEventListener(event, listener, options)
}