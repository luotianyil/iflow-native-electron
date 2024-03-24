import { App } from 'electron'
import { WindowInterface } from '#/Window'
import { WebSocketInterface } from '#/NetChannel/Web.Socket'

import { v4 } from 'uuid'

import { RequestAsyncPoolInterface, ResponseType } from '#/NetChannel/Pool/Request/RequestAsyncPool'

export default class RequestAsyncPool implements RequestAsyncPoolInterface {

  app: App

  window: WindowInterface

  websocket: WebSocketInterface

  private requestHasMap: Record<string, ResponseType | null> = Object.create({})

  constructor(app: App, window: WindowInterface, websocket: WebSocketInterface) {
    this.app = app
    this.window = window
    this.websocket = websocket

    this.gc()
  }

  /**
   * 监听响应数据
   * @param uuid 请求识别号
   * @param data 请求数据
   * @param resolve 成功回调
   * @param reject 失败回调
   * @private
   */
  private proxyResponse (uuid: string, data: any, resolve: (value: any) => void, reject: (err: any) => void) {

    let requestHasBody = {
      status: 'pending',
      data: undefined,
      requestTime: new Date().getTime()
    }
    data.requestHasUuid = uuid

    Object.defineProperty(this.requestHasMap, uuid, {
      enumerable: true,
      configurable: true,
      set: (value) => {
        if (value === null) {
          reject(new Error('request has been rejected'))
          return delete this.requestHasMap[uuid]
        }

        if (value.status === 'fulfilled') {
          delete this.requestHasMap[uuid]
          return resolve(value)
        }
        requestHasBody = value
      },
      get: () => requestHasBody
    })
  }

  request(event: string, data: any): Promise<ResponseType> {
    const requestHasUuid = v4()
    return new Promise(async (resolve, reject) => {
      this.proxyResponse(requestHasUuid, data, resolve, reject)

      await this.websocket.emit(event, data)
    })
  }

  response(has_id: string, data: any): void {
    const requestBody = this.requestHasMap[has_id]
    if (!requestBody) return

    this.requestHasMap[has_id] = {
      status: 'fulfilled',
      requestHasUuid: has_id,
      responseTime: new Date().getTime(),
      requestTime: requestBody.requestTime,
      data: data
    }
  }


  private gc() {
    setInterval(() => {
      for (const requestHasMapKey in this.requestHasMap) {
        let requestBody = this.requestHasMap[requestHasMapKey]
        if (!requestBody) continue
        if (requestBody.status === 'pending' && new Date().getTime() - requestBody.requestTime > 10000) {
          this.requestHasMap[requestHasMapKey] = null
        }
      }
    }, 10000)
  }
}
