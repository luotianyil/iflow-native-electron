import { contextBridge as WindowContextBridge } from 'electron'

import MessageChannel from '@/Preload/ContextBridge/MessageChannel'
import { GlobalType } from '@/Preload'

export default class ContextBridge {

  global: GlobalType

  exposeRecord: Record<string, any> = {
    MessageChannelContext: MessageChannel
  }

  constructor(global: GlobalType) {
    this.global = global
  }

  expose (window: Window) {
    for (const exposeRecordKey in this.exposeRecord) {
      WindowContextBridge.exposeInMainWorld(
        exposeRecordKey, (new this.exposeRecord[exposeRecordKey](this.global, window)).expose()
      )
    }

    WindowContextBridge.exposeInMainWorld('nativeConfig', {
      // @ts-ignore
      windowUuid: window.windowPage.windowUuid
    })
  }
}
