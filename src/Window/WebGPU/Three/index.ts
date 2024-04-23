import * as THREE from 'three'
import Render from '@/Window/WebGPU/Three/Render'
import { WebGPURendererParameters } from 'three/examples/jsm/renderers/webgpu/WebGPURenderer'
import { ModelOptions } from '#/WebGPU/Loader'
import FPS from '@/Window/WebGPU/Three/Render/FPS'

export default class Three {

  three = THREE

  private readonly scene: THREE.Scene

  private readonly render: Render

  private clock: THREE.Clock = new THREE.Clock()

  private frameId: number = 0

  private readonly FPS: FPS = new FPS()

  width: number = 0

  height: number = 0

  constructor(options: THREE.WebGLRendererParameters & WebGPURendererParameters = {}) {
    this.render = new Render(this, options)
    this.scene = new THREE.Scene()
  }

  initialization (container: HTMLElement, LoaderModelOptions: ModelOptions): Render {
    const { clientHeight, clientWidth } = container
    const render = this.getRender().getThreeRender()

    this.reSize(clientWidth, clientHeight)
    render.setPixelRatio(LoaderModelOptions.render?.setPixelRatio || window.devicePixelRatio)

    this.width = clientWidth
    this.height = clientHeight

    if (LoaderModelOptions.render?.color) {
      render.setClearColor(new THREE.Color(LoaderModelOptions.render.color))
    }

    this.scene.background = new THREE.Color(LoaderModelOptions.scene?.backgroundColor || 0xffffff)
    render.shadowMap.enabled = LoaderModelOptions.render?.shadowMap?.enabled || false

    container.appendChild(this.getRender().getThreeRender().domElement)
    return this.initializationLight(LoaderModelOptions.scene?.ambientLight).getRender()
  }

  /**
   * 设置光照
   * @param ambientLightColor
   */
  initializationLight(ambientLightColor?: number): Three {
    let ambientLight = this.getScene().getObjectByName('ambientLight')
    if (ambientLight) this.getScene().remove(ambientLight)

    ambientLight = new THREE.AmbientLight(ambientLightColor || 0xffffff)
    ambientLight.name = 'ambientLight'

    this.getScene().add(ambientLight)
    return this
  }

  refresh(renderBox: HTMLElement) {
    this.frameId = requestAnimationFrame(() => {
      const time = this.clock.getDelta()
      const camera = this.getRender().getCamera().getCamera()

      this.getRender().refresh(time)
      this.getRender().getThreeRender().render(this.getScene(), camera)
      this.refresh(renderBox)

      this.FPS.render(renderBox)
    })
  }

  reSize(width: number, height: number, updateStyle?: boolean): Three {
    this.getRender().getThreeRender().setSize(width, height)
    return this
  }

  getScene(): THREE.Scene {
    return this.scene
  }

  getClock():THREE.Clock {
    return this.clock
  }

  getRender(): Render {
    return this.render
  }

  getFps(): FPS {
    return this.FPS
  }

}
