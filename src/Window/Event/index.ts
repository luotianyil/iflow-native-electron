import { EventInterface, EventAction } from '#/Window/Event'
import { App, BrowserWindow, globalShortcut } from 'electron'
import { WindowInterface } from '#/Window'
import { WebSocketInterface } from '#/NetChannel/Web.Socket'

import { v4 } from 'uuid'

export default class Event implements EventInterface {

  app: App

  window: WindowInterface

  websocket: WebSocketInterface

  private eventMap: Record<string, EventAction> = {
    'will-quit': () => {
      globalShortcut.unregisterAll()
      this.websocket.emit('close_all')
    },
    'window-all-closed': () => {
      if (process.platform !== 'darwin') this.app.quit()
    },
    'browser-window-created': (event: string, browserWindow: BrowserWindow) => {
      const windowUuid = v4()
      this.window.registerWindow(browserWindow, windowUuid)

      this.websocket.emit('register', { windowUuid, windowId: browserWindow.id })
    }
  }

  constructor(app: App, window: WindowInterface, websocket: WebSocketInterface) {
    this.app = app
    this.window = window
    this.websocket = websocket

    this.initApplicationEvent()
  }

  private initApplicationEvent () {
    for (const event in this.eventMap) {
      this.app.on(event as any, this.eventMap[event])
    }
  }

  register(event: any, method: EventAction): void {
    this.app.on(event, method)
  }

  windowClose(browserWindow: BrowserWindow, uuid: string): void {
    browserWindow.on('close', () => {
      this.websocket.emit('close', { windowUuid: uuid, windowId: browserWindow.id })
    })
  }

}
