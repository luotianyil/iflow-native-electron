import * as THREE from 'three'

import WebGPURenderer, { WebGPURendererParameters } from 'three/examples/jsm/renderers/webgpu/WebGPURenderer'

import Camera from '@/Window/WebGPU/Three/Camera'
import _MMDPMXLoader from '@/Window/WebGPU/Three/Loader/MMD/MMDPMXLoader'
import _GLTFLoader from '@/Window/WebGPU/Three/Loader/GLTFLoader'
import _OBJLoader from '@/Window/WebGPU/Three/Loader/OBJLoader'
import { LoaderInterface, ModelOptions } from '#/WebGPU/Loader'
import Three from '@/Window/WebGPU/Three'
import OrbitControls from '@/Window/WebGPU/Three/Scene/Controls/OrbitControls'
import Gui from '@/Window/WebGPU/Gui'
import Sky from '@/Window/WebGPU/Three/Scene/Sky'

export type LoaderTypeKey = 'MMDPMXLoader' | 'GLTFLoader' | 'OBJLoader'

const LoaderEnum: Record<LoaderTypeKey, any> = {
  MMDPMXLoader: _MMDPMXLoader,
  GLTFLoader: _GLTFLoader,
  OBJLoader: _OBJLoader
}

export type LoaderReturnType = {
  loader: any
  camera: Camera
}

export default class Render {

  /**
   * 渲染句柄
   * @private
   */
  private readonly threeRenderHandle: THREE.WebGLRenderer | WebGPURenderer

  private readonly LoaderEnum: Record<string, any> = LoaderEnum

  private readonly three: Three

  private camera: Camera | null = null

  private orbitControls: OrbitControls | null = null

  private _loader: LoaderInterface | null = null

  private GUI: Gui | null = null

  private Sky: Sky | null = null

  constructor(Three: Three, options: THREE.WebGLRendererParameters & WebGPURendererParameters = {}) {
    this.three = Three
    this.threeRenderHandle = WebGPURenderer ? new WebGPURenderer(options) : new THREE.WebGLRenderer(options)
  }

  loader(LoaderType: LoaderTypeKey, ModelOptions: ModelOptions): LoaderReturnType {
    this.camera = new Camera().initialization(ModelOptions.camera)
    this._loader = new this.LoaderEnum[LoaderType](this.three).render(ModelOptions, this.threeRenderHandle)

    // 初始化视图控制器
    this.orbitControls = new OrbitControls().initialization(
      ModelOptions.scene?.orbitControls || {} as any, this.getThree()
    )

    // 初始化GUI
    this.GUI = new Gui(ModelOptions.gui || { enabled: false }, ModelOptions.dom)

    // 初始化天空
    this.Sky = new Sky(this.three).initialization(
      ModelOptions.sky || { enabled: false, name: 'sky-default' }
    )

    return { loader: this._loader, camera: this.camera }
  }

  render(): Render {
    this.threeRenderHandle.render(this.three.getScene(), this.getCamera().getCamera())
    return this
  }

  refresh(time: number) {
    this.getLoader().refresh(time)
  }

  getThreeRender(): THREE.WebGLRenderer | WebGPURenderer {
    return this.threeRenderHandle
  }

  getLoader(): LoaderInterface {
    if (!this._loader) throw new Error('loaderHelper Uninitialized')
    return this._loader
  }

  getCamera(): Camera {
    if (!this.camera) throw new Error('Camera Uninitialized')
    return this.camera
  }

  getThree(): Three {
    return this.three
  }

  getOrbitControls(): OrbitControls {
    if (!this.orbitControls) throw new Error('OrbitControls Uninitialized')
    return this.orbitControls
  }

  getGui(): Gui {
    if (!this.GUI) throw new Error('GUI Uninitialized')
    return this.GUI
  }

}
