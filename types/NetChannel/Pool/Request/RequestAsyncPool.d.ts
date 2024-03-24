import { App } from 'electron'
import { WindowInterface } from '#/Window'
import { WebSocketInterface } from '#/NetChannel/Web.Socket'

export type ResponseType = {
  status: 'pending' | 'fulfilled'
  requestHasUuid: string
  requestTime: number
  responseTime: number
  data: any
}

export interface RequestAsyncPoolInterface {

  app: App

  window: WindowInterface

  websocket: WebSocketInterface

  /**
   * 发送请求
   * @param event
   * @param data
   */
  request (event: string, data: any): Promise<ResponseType>

  /**
   * 设置响应数据
   * @param has_id
   * @param data
   */
  response (has_id: string, data: any): void

}
