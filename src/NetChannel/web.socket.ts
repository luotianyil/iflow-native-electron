import { App } from 'electron'
import { io, Socket } from 'socket.io-client'
import { MessageInterface } from '#/NetChannel/Message'
import { EventInterface, EventAction } from '#/NetChannel/Message/Event'
import { WebSocketInterface } from '#/NetChannel/Web.Socket'
import { WindowInterface } from '#/Window'
import Message from '@/NetChannel/Message'
import Event from '@/NetChannel/Message/Event'
import { RequestAsyncPoolInterface } from '#/NetChannel/Pool/Request/RequestAsyncPool'

import Container from '@/Container'
import RequestAsyncPool from '@/NetChannel/Pool/Request/RequestAsyncPool'

export default class WebSocket implements WebSocketInterface {

  socket: Socket

  window: WindowInterface

  message: MessageInterface

  event: EventInterface

  app: App

  requestWaitPool: RequestAsyncPoolInterface

  constructor(app: App, serverUrl: string, window: WindowInterface) {

    this.app = app
    this.window = window
    this.socket = io(serverUrl, { transports: [ 'websocket' ] })

    this.message = new Message(this, this.window)
    this.event = new Event(this, this.window)

    this.socket.emit('initialization')

    this.requestWaitPool =
      Container.register(RequestAsyncPool, [ this.app, this.window, this ])
        .get<RequestAsyncPoolInterface>(RequestAsyncPool)
  }

  on(emit: string, callback: EventAction): void {
    this.socket.on(emit, callback)
  }

  emit(event: string, data?: any): Promise<any> {
    return new Promise<any>(resolve => {
      this.socket.emit(event, data, (response: any) => resolve(response))
    })
  }

  emitAsync(event: string, data: any): Promise<any> {
    return this.requestWaitPool.request(event, data)
  }

}
