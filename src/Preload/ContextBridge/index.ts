import { BridgeWindow, GlobalType } from '@/Preload'
import { contextBridge as WindowContextBridge } from 'electron'

import onLoad from '@/Preload/ContextBridge/onLoad'

import Ammo from '@/Preload/ContextBridge/WebGPU/Ammo'

import Three from '@/Preload/ContextBridge/WebGPU/Three'
import MessageChannel from '@/Preload/ContextBridge/MessageChannel'


export default class ContextBridge {

  global: GlobalType

  exposeRecord: Record<string, any> = {
    MessageChannelContext: MessageChannel,
    Ammo: Ammo,
    Three: Three,
    onReadyLoad: onLoad
  }

  constructor(global: GlobalType) {
    this.global = global
  }

  expose (window: BridgeWindow) {
    for (const exposeRecordKey in this.exposeRecord) {
      const result = (new this.exposeRecord[exposeRecordKey](this.global, window)).expose()

      if (result instanceof Promise) {
        result.then(result => WindowContextBridge.exposeInMainWorld(exposeRecordKey, result))
        continue
      }

      WindowContextBridge.exposeInMainWorld(exposeRecordKey, result)
    }

    WindowContextBridge.exposeInMainWorld('nativeConfig', {
      windowUuid: window.windowPage?.windowUuid
    })
  }
}
