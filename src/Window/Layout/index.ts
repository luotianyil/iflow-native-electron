import { App, BrowserWindow } from 'electron'
import { WindowInterface } from '#/Window'
import { WebSocketInterface } from '#/NetChannel/Web.Socket'

import { LayoutInterface, LayoutEnumType, LayoutOption, LayoutAdapterInterface } from '#/Window/Layout'

import Container from '@/Container'

import Menu from '@/Window/Layout/Menu'
import Tray from '@/Window/Layout/Tray'

import Shortcut from '@/Window/Global/Shortcut'

export default class Layout implements LayoutInterface {

  app: App

  window: WindowInterface

  websocket: WebSocketInterface

  browserWindow: BrowserWindow

  private layoutEnum: LayoutEnumType = {
    menu: {
      layout: Menu,
      handle: 'setMenu'
    },
    tray: {
      layout: Tray,
      handle: 'setTray'
    },
    shortcut: {
      layout: Shortcut,
      handle: 'setShortcut'
    }
  }

  constructor(app: App, browserWindow: BrowserWindow, websocket: WebSocketInterface, window: WindowInterface) {

    this.app = app
    this.browserWindow = browserWindow

    this.websocket = websocket
    this.window = window
  }

  layout(layoutOptions: LayoutOption): void {
    for (const layout in layoutOptions) {
      if (!this.layoutEnum[layout]) continue

      Container.register(this.layoutEnum[layout].layout, [
        this.app, this.browserWindow, this.websocket, this.window
      ], false)
        .get(this.layoutEnum[layout].layout)
        .setWindow(this.browserWindow)[this.layoutEnum[layout].handle](layoutOptions[layout])
    }
  }

}
