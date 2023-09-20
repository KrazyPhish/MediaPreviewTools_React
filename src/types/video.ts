import type { CommonBtnConfig, BaseControls } from "./base"

/**
 * @description 按钮配置项
 */
export interface VideoBtnConfig extends CommonBtnConfig {
  /**
   * @description 是否启用剪辑按钮
   */
  ifCutter: boolean
}

/**
 * @description 播放器控件数据
 */
export interface VideoControls extends BaseControls { }