import { LayoutAdapterInterface } from '#/Window/Layout'
import { App, BrowserWindow } from 'electron'
import { WindowInterface } from '#/Window'
import { WebSocketInterface } from '#/NetChannel/Web.Socket'

export default class LayoutAdapterAbstract implements LayoutAdapterInterface {

  app: App

  browserWindow: BrowserWindow

  window: WindowInterface

  websocket: WebSocketInterface

  constructor(app: App, browserWindow: BrowserWindow, websocket: WebSocketInterface, window: WindowInterface) {

    this.app = app
    this.browserWindow = browserWindow

    this.websocket = websocket
    this.window = window
  }


  setWindow (window: BrowserWindow): LayoutAdapterInterface {
    this.browserWindow = window
    return this
  }

}
