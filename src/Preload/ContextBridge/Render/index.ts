import { BridgeWindow } from '@/Preload'
import TRender from '@/Preload/ContextBridge/WebGPU/Three/Render'

export default class Render {

  window: BridgeWindow

  html: string

  /**
   * 渲染实现类
   * @private
   */
  private readonly renderHandle: Record<string, any> = {
    ThreeNodeRender: TRender
  }

  constructor(window: BridgeWindow, html: string) {
    this.window = window
    this.html = html
  }

  executeScript(script: any): void {
    if (!script || script.innerText) return
    new Function(script.innerText)
  }

  render (): void {
    this.window.document.getElementsByTagName('html')[0].remove()
    const document = new DOMParser().parseFromString(this.html, 'text/html')

    this.window.document.append(document.documentElement)
    this.executeRenderHandle()
    this.executeScript(document.querySelector('script'))
  }

  private executeRenderHandle () {
    for (const renderHandleKey in this.renderHandle) {
      new this.renderHandle[renderHandleKey](this.window).render()
    }
  }
}
