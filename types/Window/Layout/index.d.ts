import { App, BrowserWindow } from 'electron'
import { WindowInterface } from '#/Window'
import { WebSocketInterface } from '#/NetChannel/Web.Socket'

export type LayoutEnumType = Record<string, {
  layout: any
  handle: string
}>

export type LayoutOption = Record<string, any>

export interface LayoutInterface {

  app: App

  window: WindowInterface

  websocket: WebSocketInterface

  browserWindow: BrowserWindow

  layout(layoutOptions: LayoutOption): void

}

export interface LayoutAdapterInterface {

  app: App

  browserWindow: BrowserWindow

  window: WindowInterface

  websocket: WebSocketInterface

  setWindow (window: BrowserWindow): LayoutAdapterInterface

}
