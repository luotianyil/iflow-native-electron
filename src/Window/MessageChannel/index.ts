import { App, BrowserWindow, MessageChannelMain, ipcMain } from 'electron'
import { MessageChannelInterface, MessageChannelType, onListenerAction } from '#/Window/MessageChannel'

export default class MessageChannel implements MessageChannelInterface {

  app: App

  messageChannel: MessageChannelType

  constructor(app: App) {
    this.app = app

    const { port1, port2 } = new MessageChannelMain()
    this.messageChannel = { port1, port2 }
  }

  subscribe(window: BrowserWindow): void {
    window.webContents.postMessage('messageChannel', null, [ this.messageChannel.port1 ])
  }

  emit(window: BrowserWindow, data: any): void {
    this.messageChannel.port2.postMessage(data)
  }

  on(event: string, callback: any): void {
    ipcMain.handle(event, callback)
  }

}
