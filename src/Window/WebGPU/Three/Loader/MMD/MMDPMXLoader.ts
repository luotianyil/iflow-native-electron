import * as THREE from 'three'

import Three from '@/Window/WebGPU/Three'
import Loader from '@/Window/WebGPU/Three/Loader'

import { MMDLoader } from 'three/examples/jsm/loaders/MMDLoader'
import { MMDAnimationHelper } from 'three/examples/jsm/animation/MMDAnimationHelper'

import { LoaderInterface, MeshType, ModelOptions, RenderType } from '#/WebGPU/Loader'

export default class MMDPMXLoader extends Loader {

  protected readonly loader: MMDLoader = new MMDLoader()

  private readonly helper: MMDAnimationHelper = new MMDAnimationHelper()

  private audio: THREE.Audio | null = null

  private audioListener: THREE.AudioListener | null = null

  private onRefresh?: (time: number) => void = () => {}

  render(options: ModelOptions, render: RenderType): LoaderInterface {
    this.onRefresh = options.onRefresh

    const animation = options.animation || []

    this[!animation.length ? 'PMXLoader' : 'LoadWithAnimation'](options)

    return this
  }

  /**
   * 仅加载PMX模型
   * @param options
   * @constructor
   */
  PMXLoader(options: ModelOptions): LoaderInterface {
    this.loader.load(
      options.path,
      (mesh) => options.onLoad({ mesh: mesh }, this.three, this, 'MOD'),
      (event: ProgressEvent) => this.onProgress(event, 'MOD', options.onProgress),
      function (event) {
        console.log('MMDPMXLoader Error: ', event)
        options.onError?.(event as any)
      }
    )
    return this
  }

  /**
   * 加载PMX模型资源及动画资源
   * @param options
   */
  LoadWithAnimation(options: ModelOptions): LoaderInterface {
    this.loader.loadWithAnimation(
      options.path, options.animation || [],
      (object) => {
        this.LoadWithAnimationCamera(options)
        options.onLoad(object, this.three, this, 'MOD')
      },
      (event: ProgressEvent) => this.onProgress(event, 'MOD', options.onProgress),
      options.onError || function (event: ErrorEvent) {
        console.log('MMDPMXLoader Error: ', event)
      }
    )

    return this
  }

  /**
   * 加载动画捕捉摄像头
   * @param options
   */
  LoadWithAnimationCamera(options: ModelOptions): LoaderInterface {
    const camera = this.three.getRender().getCamera().getCamera()
    if (options.camera.path) {
      this.loader.loadAnimation(
        options.camera.path,
        camera,
        (cameraAnimation) => {
          this.LoadWithAudio(options)
          this.helper.add(camera, { animation: cameraAnimation as THREE.AnimationClip })
          options.onLoad(cameraAnimation, this.three, this, 'CAMERA')
        },
        (event: ProgressEvent) => this.onProgress(event, 'ANIMATION', options.onProgress),
      )
    }

    return this
  }

  /**
   * 加载音频资源
   * @param options
   * @constructor
   */
  LoadWithAudio(options: ModelOptions): LoaderInterface {
    if (options.audio?.url) {
      if (this.audio) this.three.getScene().remove(this.audio)
      if (this.audioListener) this.three.getScene().remove(this.audioListener)

      new THREE.AudioLoader().load(options.audio.url, buffer => {
        this.audioListener = new THREE.AudioListener()
        this.audio = new THREE.Audio(this.audioListener).setBuffer(buffer)
        this.audioListener.position.z = 1
        this.helper.add(this.audio, options.audio?.options || { delayTime: 0 })
        this.three.getScene().add(this.audio)
        this.three.getScene().add(this.audio)
      }, (event: ProgressEvent) => this.onProgress(event, 'AUDIO', options.onProgress))
    }

    return this
  }

  refresh(time: number) {
    this.helper.update(time)
    this.onRefresh?.(time)
  }

  getLoader(): MMDLoader {
    return this.loader
  }

  getHelper(): MMDAnimationHelper {
    return this.helper
  }

  /**
   * 将 MESH 资源加入场景中
   * @param mesh
   * @param params
   */
  addSceneMesh(mesh: MeshType, params: object): LoaderInterface {
    this.getHelper().add(mesh, params)
    return super.addSceneMesh(mesh, params)
  }

}
