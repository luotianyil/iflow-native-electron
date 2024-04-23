import { BridgeWindow, GlobalType } from '@/Preload'
import WebGPURenderer from 'three/examples/jsm/renderers/webgpu/WebGPURenderer'
import THREE from '@/Window/WebGPU/Three'

export default class Three {

  global: GlobalType

  window: BridgeWindow

  windowUuid: string

  three: THREE

  WebGPURenderer = WebGPURenderer

  constructor(global: GlobalType, window: BridgeWindow) {
    this.global = global
    this.window = window

    // @ts-ignore
    this.windowUuid = window.windowPage?.windowUuid
    this.three = new THREE()
  }

  expose() {
    return { three: this.three }
  }
}
