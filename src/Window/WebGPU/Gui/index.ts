import { GUI } from '@/Window/WebGPU/DatGUI'
import { GUIParams } from 'dat.gui'

export type GUIOptions = {
  enabled: boolean
} & GUIParams

export default class Gui {

  private gui: any

  constructor(GUIOptions: GUIOptions, dom: HTMLElement) {
    this.gui = null
    if (GUIOptions.enabled) this.reloadGUI(GUIOptions, dom)
  }

  reloadGUI(GUIOptions: GUIOptions, dom: HTMLElement) {
    if (this.gui) this.gui.destroy()

    this.gui = new GUI(GUIOptions)

    dom.parentElement?.insertBefore(this.gui.domElement, dom.parentElement?.firstChild)
  }

  getGUI() {
    if (!this.gui) throw new Error('GUI Uninitialized')
    return this.gui
  }

}
