import { GlobalType } from '@/Preload'
import { ipcRenderer } from 'electron'

export default class MessageChannel {

  global: GlobalType

  window: Window

  windowUuid: string

  private channelActions: Record<string, any> = {
    system: {
      notification: (options: any) => this.sender('notification', options),
      dialog: (options: any) => this.sender('dialog', options),
      register: (event: string) => this.register(event, 'system')
    },
    network: {
      request: (data: any) => this.request(data),
      notification: (options: any) => this.request({ event: 'notification', options }),
      dialog: (options: any) => this.request({ event: 'dialog', options }),
      register: (event: string) => this.register(event, 'network')
    }
  }

  constructor(global: GlobalType, window: Window) {
    this.global = global
    this.window = window

    // @ts-ignore
    this.windowUuid = window.windowPage.windowUuid
  }

  request (data: any) {
    return this.sender('socket', data)
  }

  async sender (event: string, options: any) {
    options.windowUuid = this.windowUuid
    return await ipcRenderer.invoke(event, options)
  }

  register (event: string, type: string) {
    // @ts-ignore
    this.channelActions[type][event] = (options) => this.sender(event, options)
    return this.channelActions
  }

  expose() {
    return this.channelActions
  }
}
