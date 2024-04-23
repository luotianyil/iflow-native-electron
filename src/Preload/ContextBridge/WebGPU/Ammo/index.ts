import { BridgeWindow, GlobalType } from '@/Preload'
import Ammo from '@/Window/WebGPU/Ammo'

export default class Three {

  global: GlobalType

  window: BridgeWindow

  windowUuid: string

  constructor(global: GlobalType, window: BridgeWindow) {
    this.global = global
    this.window = window

    // @ts-ignore
    this.windowUuid = window.windowPage?.windowUuid
  }

  expose() {
    return new Promise(resolve => Ammo().then((ammo: any) => {
      if (!this.window.Ammo) this.window.Ammo = ammo
      resolve(ammo)
    }))
  }
}
