import { App, BrowserWindow } from 'electron'
import { WebSocketInterface } from '#/NetChannel/Web.Socket'

export type EventType = {
  emitAsync?: boolean
  event: string
  label: string
  options: any
  id: number
  [key: string]: any
}

export type EventCallbackAction = (event: EventType, response: any) => void

export interface EventInterface {

  app: App

  window?: BrowserWindow

  websocket: WebSocketInterface

  setWindow (window: BrowserWindow): EventInterface

  on (event: EventType, eventType: string, window?: BrowserWindow, callback?: EventCallbackAction): void

}
