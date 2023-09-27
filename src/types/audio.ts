import type { BaseControls, CommonBtnConfig, DeepPartial } from "./base"
import type { Region } from "../components/MediaTools/modules/audio/wavesurfer/plugins/regions"

/**
 * 音频区域对象
 */
export interface AudioRegion extends DeepPartial<Region> {
  /**
   * @description 名称
   */
  name?: string,
  /**
   * @description 备注
   */
  marker?: string,
  /**
   * @description 是否静音区
   */
  mute?: boolean
}

/**
 * @description 按钮配置项
 */
export interface AudioBtnConfig extends CommonBtnConfig {
  /**
 * @description 是否启用显示设置
 */
  ifDisplay?: boolean,
  /**
   * @description 是否启用静音区域设置
   */
  ifMute?: boolean,
  /**
   * @description 是否启用复播区域设置
   */
  ifRepeat?: boolean
}

interface ZoomBase {
  init: number,
  max: number,
  min: number,
  step: number
}

interface ZoomMode<T> {
  verticalZoom: T,
  horizontalZoom: T
}

/**
 * @description 缩放信息
 */
export type ZoomOption = ZoomMode<ZoomBase>

/**
 * @description 是否显示频谱图、语谱图
 */
export interface SpectOption {
  /**
   * @description 频谱
   */
  spectrum: boolean,
  /**
   * @description 语谱
   */
  spectrogram: boolean,
}

/**
 * @description 显示设置
 */
export interface DisplaySettings extends SpectOption {
  /**
   * @description 水平缩放
   */
  horizontalZoom: number,
  /**
   * @description 垂直缩放
   */
  verticalZoom: number
}

/**
 * @description 显示设置组件配置列表
 */
export interface DisplayConfig {
  spect?: Partial<SpectOption>
  zoomOptions?: Partial<ZoomMode<Partial<ZoomBase>>>
}

/**
 * @description 复播设置参数
 */
export interface RepeatSettings {
  start: string | number | undefined,
  end: string | number | undefined,
  repeat: boolean
}

/**
 * @description 播放器控件数据
 */
export interface AudioControls extends BaseControls, SpectOption, ZoomMode<number> { }