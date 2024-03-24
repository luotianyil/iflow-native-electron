import { App, BrowserWindow, IpcMainEvent } from 'electron'
import { WindowInterface } from '#/Window'
import { WebSocketInterface } from '#/NetChannel/Web.Socket'

import { MessageChannelEventInterface, MessageChannelEventAction } from '#/Window/MessageChannel/MessageChannelEvent'

import Container from '@/Container'

import Notification from '@/Window/Global/Notification'
import { NotificationInterface } from '#/Window/Global/Notification'

import Dialog from '@/Window/Global/Dialog'
import { DialogInterface } from '#/Window/Global/Dialog'

export default class MessageChannelEvent implements MessageChannelEventInterface {

  app: App

  window: WindowInterface

  websocket: WebSocketInterface

  browserWindow: BrowserWindow

  private event: Record<string, MessageChannelEventAction> = {
    socket: (event: string, options) => {
      options.windowId = this.browserWindow.id
      options.windowUuid = options.windowUuid || options.options.windowUuid

      this.websocket.emit('window_event_channel', options)
    },
    // 系统通知
    notification: (event, options: any) =>
      Container.instance<NotificationInterface>(Notification, false).show(options, this.browserWindow, this.window.messageChannel),
    dialog: (event, options: any) =>
      Container.instance<DialogInterface>(Dialog, false).dialog(options, this.browserWindow),
    // @ts-ignore
    app: (event, options) => this.app[options.event]?.(options)
  }

  constructor(app: App, websocket: WebSocketInterface, browserWindow: BrowserWindow, window: WindowInterface) {

    this.app = app
    this.websocket = websocket

    this.browserWindow = browserWindow
    this.window = window

    this.register()
  }

  private register (): void {
    for (const eventKey in this.event) {
      this.window.messageChannel.on(
        eventKey, (event: IpcMainEvent, data: any) => this.event[eventKey](eventKey, data)
      )
    }
  }

}
