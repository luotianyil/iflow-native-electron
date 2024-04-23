import { ipcRenderer } from 'electron'
import ContextBridge from '@/Preload/ContextBridge'
import Render from '@/Preload/ContextBridge/Render'
import Three from '@/Preload/ContextBridge/WebGPU/Three'

export type GlobalType = {
  messagePort?: MessagePort
}

export type BridgeWindow = Window & {
  messagePort?: MessagePort
  Three?: Three,
  Ammo?: any,
  windowPage?: {
    windowUuid: string
  }
}

export const global: GlobalType = {}

ipcRenderer.on('messageChannel', async e => {
  global.messagePort = e.ports[0]
  const bridgeWindow: BridgeWindow = window

  bridgeWindow.messagePort = global.messagePort

  bridgeWindow.messagePort.onmessage = (event: MessageEvent) => {
    if (event.data?.data?.type === 'render') {
      return new Render(window, event.data.data.html).render()
    }

    if (event.data?.event === 'register') {
      bridgeWindow.windowPage = event.data.data
      return new ContextBridge(global).expose(bridgeWindow)
    }

    return bridgeWindow.onmessage?.(event)
  }
})
