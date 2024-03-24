import { ipcRenderer } from 'electron'
import ContextBridge from '@/Preload/ContextBridge'
import Render from '@/Preload/ContextBridge/Render'

export type GlobalType = {
  messagePort?: MessagePort
}

export const global: GlobalType = {}

ipcRenderer.on('messageChannel', async e => {
  global.messagePort = e.ports[0]

  // @ts-ignore
  window.messagePort = global.messagePort

  // @ts-ignore
  window.messagePort.onmessage = (event: MessageEvent) => {

    console.log(event)

    if (event.data?.data?.type === 'render') {
      new Render(window, event.data.data.html).render()
    }

    if (event.data?.event === 'register') {
      // @ts-ignore
      window.windowPage = event.data.data
      new ContextBridge(global).expose(window)
    }
  }
})
