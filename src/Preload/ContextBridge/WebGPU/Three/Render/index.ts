import { BridgeWindow } from '@/Preload'
import { ModelOnLoadAction, ModelOptions } from '#/WebGPU/Loader'

import Three from '@/Window/WebGPU/Three'
import Ammo from '@/Window/WebGPU/Ammo'

import { LoaderTypeKey } from '@/Window/WebGPU/Three/Render'

export default class Render {

  window: BridgeWindow

  threeLoadMap: Record<string, Three> = {}

  constructor(window: BridgeWindow) {
    this.window = window
  }

  /**
   * 加载模型信息
   * @param three
   * @constructor
   */
  LoadMode (three: Element) {

    const threeLoad = new Three({ antialias: true })

    const renderBox = this.window.document.createElement('div')

    renderBox.className = three.className
    renderBox.setAttribute('style', three.getAttribute('style') || '')
    renderBox.setAttribute('id', three.getAttribute('id') || Math.random().toString(32).split('.')[1])

    three.parentNode?.insertBefore(renderBox, three)

    // @ts-ignore
    const LoaderType: LoaderTypeKey = three.getAttribute('loader') || 'MMDPMXLoader'

    const LoaderModelOptions = this.getLoadModeOptions(
      three,
      renderBox,
      (object: any, three, loader, type) => {
        if (type === 'MOD') {
          loader.addSceneMesh(object.mesh, { animation: object.animation, physics: LoaderModelOptions.physics, object })

          threeLoad.getRender().render()
          threeLoad.refresh(renderBox)
        }
      }
    )

    threeLoad.initialization(renderBox, LoaderModelOptions)
      .loader(LoaderType, LoaderModelOptions)

    // 移除现有节点
    three.remove()
    this.threeLoadMap[renderBox.id] = threeLoad
  }

  /**
   * 获取节点配置
   * @param three
   * @param renderDOM
   * @param onLoad
   */
  getLoadModeOptions (three: Element, renderDOM: HTMLElement, onLoad: ModelOnLoadAction): ModelOptions {
    return {
      path: three.getAttribute('path') || '',
      physics: (three.getAttribute('physics') || 'true') === 'true',
      dom: renderDOM,
      animation: JSON.parse(three.getAttribute('animation') || '[]'),
      audio: JSON.parse(three.getAttribute('audio') || '[]'),
      scene: JSON.parse(three.getAttribute('scene') || '[]'),
      render: JSON.parse(three.getAttribute('render') || '[]'),
      gui: JSON.parse(three.getAttribute('gui') || '[]'),
      sky: JSON.parse(three.getAttribute('sky') || '[]'),
      camera: Object.assign(JSON.parse(three.getAttribute('camera') || '[]'), {
        width: renderDOM.offsetWidth,
        height: renderDOM.offsetHeight
      }),
      onLoad: onLoad
    }
  }

  render () {
    if (this.window.Ammo) return this.readThreeNodeToRender()

    Ammo().then((Ammo: any) => {
      this.window.Ammo = Ammo
      this.readThreeNodeToRender()
    })
    return this
  }

  private readThreeNodeToRender() {
    const threeNodes = this.window.document.getElementsByTagName('three')
    for (let i = 0; i < threeNodes.length; i++) this.LoadMode(threeNodes[i])

    return this
  }

}
