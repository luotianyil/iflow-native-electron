import { BridgeWindow, GlobalType } from '@/Preload'
import { contextBridge as WindowContextBridge } from 'electron'
import Render from '@/Preload/ContextBridge/WebGPU/Three/Render'

export default class onLoad {

  global: GlobalType

  window: BridgeWindow

  windowUuid: string

  private readonly RenderEnum: Record<string, any> = {
    ThreeRender: Render
  }

  constructor(global: GlobalType, window: BridgeWindow) {
    this.global = global
    this.window = window

    this.windowUuid = window.windowPage?.windowUuid || ''
  }

  expose() {
    return () => {
      for (const renderEnumKey in this.RenderEnum) {
        const result = new this.RenderEnum[renderEnumKey](this.window).render()
        WindowContextBridge.exposeInMainWorld(renderEnumKey, result)
      }
    }
  }
}
