import { BrowserWindow, NotificationConstructorOptions } from 'electron'
import { WebSocketInterface } from '#/NetChannel/Web.Socket'
import { MessageChannelInterface } from '#/Window/MessageChannel'

export type NotificationMessage = WebSocketInterface | MessageChannelInterface

export type NotificationOptions = {
  events?: {
    click: string
    show: string
    [key: string]: any
  }
} & NotificationConstructorOptions

export interface NotificationInterface {

  options: NotificationOptions

  show (options: NotificationOptions, window: BrowserWindow, message: NotificationMessage): void

}
