import { App, BrowserWindow, MessagePortMain, IpcMainEvent } from 'electron'

export type MessageChannelType = Record< 'port1' | 'port2' , MessagePortMain>

export type onListenerAction = (event: IpcMainEvent, ...args: any[]) => any

export interface MessageChannelInterface {

  app: App

  messageChannel: MessageChannelType

  /**
   * 订阅主题信息
   * @param window
   */
  subscribe (window: BrowserWindow): void

  /**
   * 传递信息
   * @param window
   * @param data
   */
  emit (window: BrowserWindow, data: any): void

  on (event: string, callback: any): void

}
