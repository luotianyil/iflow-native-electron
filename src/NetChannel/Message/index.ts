import { MessageInterface, DefaultWindowEventAction } from '#/NetChannel/Message'
import { WindowInterface } from '#/Window'
import { WebSocketInterface } from '#/NetChannel/Web.Socket'

import Container from '@/Container'

import Menu from '@/Window/Layout/Menu'
import Tray from '@/Window/Layout/Tray'
import Notification from '@/Window/Global/Notification'
import { NotificationInterface } from '#/Window/Global/Notification'

import Dialog from '@/Window/Global/Dialog'
import { DialogInterface } from '#/Window/Global/Dialog'


export default class Message implements MessageInterface {

  websocket: WebSocketInterface

  window: WindowInterface

  private defaultWindowEvent: Record<string, DefaultWindowEventAction> = {
    // 底部弹窗通知
    notification: (event, options: any, window) =>
      Container.instance<NotificationInterface>(Notification, false).show(options, window, this.websocket),
    // 窗口菜单
    menu: (event, options, window) => {
      window.menuBarVisible = options.menuBarVisible === undefined ? true : options.menuBarVisible
      Container.get(Menu).setWindow(window).setMenu(options.menu)
    },
    // 托盘菜单
    tray: (event, options, window) =>
      Container.get(Tray).setWindow(window).setTray(options.tray, options),
    // 消息弹窗
    dialog: (event, options: any, window) =>
      Container.instance<DialogInterface>(Dialog, false).dialog(options, window),
    // @ts-ignore
    app: (event, options, window) => this.websocket.app[options.event]?.(options),
    // @ts-ignore
    window: (event, options, window) => window[options.event]?.(options)
  }

  constructor(websocket: WebSocketInterface, window: WindowInterface) {
    this.websocket = websocket
    this.window = window
  }

  messageChannel(windowSign: string | number, data: any): void {
    const window = this.window.getWindow(windowSign)
    if (!window) return

    this.window.messageChannel.emit(window, data)
  }

  triggerDefaultWindowEvent(windowSign: string | number, data: any): void {

    const window = this.window.getWindow(windowSign)
    if (!window) return

    if (this.defaultWindowEvent[data.event])
      return this.defaultWindowEvent[data.event](data.event, data.options, window)

    return this.window.messageChannel.emit(window, data)
  }

}
