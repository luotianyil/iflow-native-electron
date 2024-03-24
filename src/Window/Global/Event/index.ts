import { App, BrowserWindow } from 'electron'
import { EventInterface, EventType, EventCallbackAction } from '#/Window/Global/Event'
import { WebSocketInterface } from '#/NetChannel/Web.Socket'

export default class Event implements EventInterface {

  app: App

  window?: BrowserWindow

  websocket: WebSocketInterface

  constructor(app: App, websocket: WebSocketInterface, window?: BrowserWindow) {
    this.app = app
    this.websocket = websocket

    if (window) this.window = window
  }

  setWindow(window: BrowserWindow): EventInterface {
    this.window = window
    return this
  }

  on(event: EventType, eventType: string, window?: BrowserWindow, callback?: EventCallbackAction) {
    const id: number = window?.id || this.window?.id || 0

    event[eventType] = async (event: EventType) => {
      this.websocket[event.emitAsync ? 'emitAsync' : 'emit'](event.event, {
        event: event.event,
        label: event.label,
        options: event.options || [],
        id: event.id,
        windowId: id
      }).then((response: any) => {
        callback?.(event, response)
      })
    }

  }

}
