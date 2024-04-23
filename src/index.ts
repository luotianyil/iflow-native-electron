import Container, { ContainerInterface } from '@/Container'
import { app } from 'electron'

import Window from '@/Window'
import { WindowInterface } from '#/Window'

import WebSocket from '@/NetChannel/web.socket'
import { WebSocketInterface } from '#/NetChannel/Web.Socket'

import Event from '@/Window/Event'
import GlobalEvent from '@/Window/Global/Event'

export const appContainer: ContainerInterface = Container

export const baseServerUrl: string = 'http://127.0.0.1:8090/socket.io'

const RunNativeApplication = (serverUrl: string): void => {

  serverUrl = serverUrl || baseServerUrl

  if (!serverUrl) {
    app.exit()
    throw new Error('serverUrl absent')
  }

  appContainer
    // 注册窗口
    .register(Window, [ app ])
    // 注册Web.Socket 服务
    .register( WebSocket, [ app, serverUrl, appContainer.get<WindowInterface>(Window) ] )
    // 注册窗体事件全局助手类
    .register( GlobalEvent, [ app, appContainer.get<WebSocketInterface>(WebSocket) ] )
    .register(
      Event, [
        app,
        appContainer.get<WindowInterface>(Window),
        appContainer.get<WebSocketInterface>(WebSocket)
      ]
    )
}

const serverUrl = process.argv.filter((arg) => arg.startsWith('net-url='))
  .shift()?.split?.('=')?.pop?.()

RunNativeApplication(serverUrl || '')
