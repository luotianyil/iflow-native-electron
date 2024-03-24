import { BrowserWindow } from 'electron'
import { WindowInterface } from '#/Window'
import { WebSocketInterface } from '#/NetChannel/Web.Socket'

export type DefaultWindowEventAction = (
  event: string, options: {
    event: string
    menuBarVisible?: boolean
    tray?: any[]
    [key: string]: any
  }, window: BrowserWindow
) => void

export interface MessageInterface {

  websocket: WebSocketInterface

  window: WindowInterface

  /**
   * 处理服务端向客户端窗口消息传递
   * @param windowSign
   * @param data
   */
  messageChannel (windowSign: string | number, data: any): void

  /**
   * 处理服务端向客户端窗口触发指定事件
   * @param windowSign
   * @param data
   */
  triggerDefaultWindowEvent (windowSign: string | number, data: any): void

}
