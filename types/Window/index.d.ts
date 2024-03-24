import { App, BrowserWindow, BrowserWindowConstructorOptions } from 'electron'
import { WebSocketInterface } from '#/NetChannel/Web.Socket'
import { MessageChannelInterface } from '#/Window/MessageChannel'

export type BrowserWindowOptions = {
  url?: string
  openDevTools?: boolean
  hidden?: boolean
  menuBarVisible?: boolean
  menu?: any[]
  tray?: any[]
  shortcut?: any[]
  preload?: string
} & BrowserWindowConstructorOptions

export type WindowMapValue = {
  browserWindow: BrowserWindow
  windowId: number
  windowUuid: string
}

export interface WindowInterface {

  app: App

  messageChannel: MessageChannelInterface

  /**
   * 创建窗口
   * @param options
   * @param websocket
   */
  createWindow (options: BrowserWindowOptions, websocket: WebSocketInterface): Promise<BrowserWindow | null>

  getApp(): App

  /**
   * 获取已存在的窗口信息
   * @param windowSign
   */
  getWindow(windowSign: string | number): BrowserWindow | null

  /**
   * 注册窗口
   * @param browserWindow
   * @param windowUuid
   */
  registerWindow (browserWindow: BrowserWindow, windowUuid: string): WindowMapValue

  /**
   * 关闭指定窗口
   * @param windowUuid
   */
  closeWindow (windowUuid: string): void

}
