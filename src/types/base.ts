/**
 * @description 将泛型的所有属性深度转换为必选
 */
export type DeepRequired<T> = { [K in keyof T]-?: DeepRequired<T[K]> }

/**
 * @description 将泛型的所有属性深度转换为可选
 */
export type DeepPartial<T> = { [K in keyof T]?: DeepPartial<T[K]> }

/**
 * @description 按钮配置项
 */
export interface CommonBtnConfig {
  /**
   * @description 是否启用播放倍率按钮
   */
  isRate?: boolean,
  /**
   * @description 是否启用音量按钮
   */
  ifVolume?: boolean,
  /**
   * @description 是否启用详细信息按钮
   */
  ifInfo?: boolean,
  /**
   * @description 是否启用全屏按钮
   */
  ifFullScreen?: boolean
}

/**
 * @description 音视频详细信息
 */
export interface Information {
  label: string,
  value: string
}

/**
 * @description 音视频剪辑表单
 */
export interface CutterForm {
  range: [number, number],
  start: string,
  end: string
}

/**
 * @description 音视频剪辑数据格式
 */
export interface CutterInfo {
  start: number,
  end: number,
  duration: number
}

/**
 * @description 音视频控件表单数据格式
 */
export interface ControlInfo {
  rate: number,
  time: number,
  volume: number
}

/**
 * @description 播放器控件数据
 */
export interface BaseControls {
  time: number,
  totalTime: number,
  volume: number
}