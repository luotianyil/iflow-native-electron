import { App } from 'electron'
import { Socket } from 'socket.io-client'
import { MessageInterface } from '#/NetChannel/Message'
import { EventInterface, EventAction } from '#/NetChannel/Message/Event'
import { WindowInterface } from '#/Window'
import { RequestAsyncPoolInterface } from '#/NetChannel/Pool/Request/RequestAsyncPool'

export interface WebSocketInterface {

  socket: Socket

  window: WindowInterface

  message: MessageInterface

  event: EventInterface

  app: App

  requestWaitPool: RequestAsyncPoolInterface

  /**
   * 注册响应事件
   * @param emit
   * @param callback
   */
  on (emit: string, callback: EventAction): void

  /**
   * 请求数据
   * @param event
   * @param data
   */
  emit (event: string, data?: any): Promise<any>

  /**
   * 请求数据并等待响应
   * @param event
   * @param data
   */
  emitAsync (event: string, data: any): Promise<any>
}
