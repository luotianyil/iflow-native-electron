import { WindowInterface, BrowserWindowOptions, WindowMapValue } from '#/Window'
import { WebSocketInterface } from '#/NetChannel/Web.Socket'
import { App, BrowserWindow } from 'electron'

import Layout from '@/Window/Layout'
import MessageChannel from '@/Window/MessageChannel'
import MessageChannelEvent from '@/Window/MessageChannel/MessageChannelEvent'

import { MessageChannelInterface } from '#/Window/MessageChannel'

import * as path from 'path'

export default class Window implements WindowInterface {

  app: App

  messageChannel: MessageChannelInterface

  private windowMap: Record<string, WindowMapValue> = Object.create({})

  constructor(app: App) {
    this.app = app
    this.messageChannel = new MessageChannel(this.app)
  }

  async createWindow(options: BrowserWindowOptions, websocket: WebSocketInterface): Promise<BrowserWindow | null> {
    try {
      await this.app.whenReady()

      options = options || { width: 800, height: 600 }
      options.webPreferences = options.webPreferences || {}

      options.webPreferences.preload = options.preload || path.join(__dirname, 'preload.js')
      options.webPreferences.nodeIntegration = options.webPreferences.nodeIntegration || false

      const browserWindow: BrowserWindow = new BrowserWindow(options)

      const url: string = options.url || 'http://localhost:8000'

      // 窗口显示后回调
      browserWindow.once('ready-to-show', () => {
        this.messageChannel.subscribe(browserWindow)
        new MessageChannelEvent(this.app, websocket, browserWindow, this)
      })

      await browserWindow[url.startsWith('http') ? 'loadURL' : 'loadFile'](url)

      // 是否显示 窗口菜单
      browserWindow.menuBarVisible = options.menuBarVisible || false

      // 是否打开控制台
      if (options.openDevTools) browserWindow.webContents.openDevTools()

      // 是否隐藏窗口
      if (options.hidden) browserWindow.hide()

      // 注册基础布局组件
      new Layout(this.app, browserWindow, websocket, this).layout({
        menu: options.menu || [],
        tray: options.tray || [],
        shortcut: options.shortcut || [],
      })

      return browserWindow
    } catch (err) {
      console.log(err)
      return null
    }
  }

  getApp(): App {
    return this.app
  }

  registerWindow(browserWindow: BrowserWindow, windowUuid: string): WindowMapValue {
    this.windowMap[windowUuid] = { browserWindow, windowId: browserWindow.id, windowUuid }

    this.messageChannel.emit(browserWindow, {
      event: 'register',
      data: { windowUuid, windowId: browserWindow.id }
    })
    return this.windowMap[windowUuid]
  }

  getWindow(windowSign: string | number): BrowserWindow | null {
    if (typeof windowSign === 'string')
      return this.windowMap[windowSign]?.browserWindow || null

    for (const windowMapKey in this.windowMap) {
      if (this.windowMap[windowMapKey].browserWindow.id === windowSign)
        return this.windowMap[windowMapKey].browserWindow
    }

    return null
  }

  closeWindow(windowUuid: string) {
    if (!this.windowMap[windowUuid]) return
    this.windowMap[windowUuid].browserWindow.close()
    delete this.windowMap[windowUuid]
  }

}
