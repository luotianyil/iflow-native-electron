import { App, BrowserWindow } from 'electron'
import { WindowInterface } from '#/Window'
import { WebSocketInterface } from '#/NetChannel/Web.Socket'

export type EventAction = (event: string, browserWindow: BrowserWindow) => any|never

export interface EventInterface {

  app: App

  window: WindowInterface

  websocket: WebSocketInterface

  register (event: any, method: EventAction): void

  windowClose (browserWindow: BrowserWindow, uuid: string): void


}
