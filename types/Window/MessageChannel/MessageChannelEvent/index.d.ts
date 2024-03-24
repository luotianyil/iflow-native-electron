import { App, BrowserWindow } from 'electron'
import { WindowInterface } from '#/Window'
import { WebSocketInterface } from '#/NetChannel/Web.Socket'

export type MessageChannelEventAction = (event: string, options: {
  event: string
  windowId: number
  windowUuid: string
  options?: any
} | Record<string, any>) => any | never

export interface MessageChannelEventInterface {

  app: App

  window: WindowInterface

  websocket: WebSocketInterface

  browserWindow: BrowserWindow

}
