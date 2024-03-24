import { WindowInterface } from '#/Window'
import { WebSocketInterface } from '#/NetChannel/Web.Socket'
import { EventInterface, EventAction } from '#/NetChannel/Message/Event'

import Container from '@/Container'

import { RequestAsyncPoolInterface } from '#/NetChannel/Pool/Request/RequestAsyncPool'
import RequestAsyncPool from '@/NetChannel/Pool/Request/RequestAsyncPool'

export default class Event implements EventInterface {

  event: Record<string, EventAction> = {
    open: () => {},
    message: () => {},
    // 窗口消息
    windowMessage: (data: any) =>
      this.websocket.message.messageChannel(data.windowUuid || data.windowId, data),
    // 创建窗口
    createWindow: (data: any) => this.window.createWindow(data, this.websocket),
    // 关闭窗口
    closeWindow: (data: any) => this.window.getWindow(data.windowUuid || data.windowId)?.close(),
    // 请求响应数据
    response: (data) =>
      Container.get<RequestAsyncPoolInterface>(RequestAsyncPool)
        .response(data.requestHasUuid, data.data),
    // 接收窗口信息
    windowMessageChannel: (data) =>
      this.websocket.message.triggerDefaultWindowEvent(data.windowUuid || data.windowId, data),
    error: () => {},
    connect: () => {},
    connect_error: () => {},
    disconnect: () => {}
  }

  websocket: WebSocketInterface

  window: WindowInterface

  constructor(websocket: WebSocketInterface, window: WindowInterface) {
    this.window = window
    this.websocket = websocket

    this.on()
  }

  private on () {
    for (const eventKey in this.event) {
      this.websocket.on(eventKey, this.event[eventKey])
    }
  }

  emit(event: string, data: any): void {
    this.websocket.emit(event, data)
  }

}
