import * as THREE from 'three'
import WebGPURenderer from 'three/examples/jsm/renderers/webgpu/WebGPURenderer'
import {CameraOptionsType } from '@/Window/WebGPU/Three/Camera'
import { MMDLoaderAnimationObject } from 'three/examples/jsm/loaders/MMDLoader'
import Three from '@/Window/WebGPU/Three'
import { OrbitControlsOptionsType } from '@/Window/WebGPU/Three/Scene/Controls/OrbitControls'
import { GUIOptions } from '@/Window/WebGPU/Gui'
import { SkySunOptions } from '@/Window/WebGPU/Three/Scene/Sky'

export type ModelLoadType = 'MOD' | 'CAMERA' | 'ANIMATION' | 'AUDIO'

export type MeshType = THREE.SkinnedMesh | THREE.Camera | THREE.Audio

export type RenderType = THREE.WebGLRenderer | WebGPURenderer

export type ModelOnLoadAction =
  (object: MMDLoaderAnimationObject | object, three: Three, loader: LoaderInterface, loaderType: ModelLoadType) => void

export type ModelOptions = {
  path: string
  physics?: boolean
  dom: HTMLElement
  animation?: string | string[]
  audio?: {
    url: string
    options?: {
      delayTime: number
    }
  }
  camera: CameraOptionsType
  scene?: {
    backgroundColor?: number
    ambientLight?: number
    orbitControls?: OrbitControlsOptionsType
  }
  render?: {
    setPixelRatio?: number
    color: number
    shadowMap?: {
      enabled: boolean
    }
  }
  gui?: GUIOptions
  sky?: SkySunOptions
  onLoad: ModelOnLoadAction,
  onRefresh?: (time: number) => void,
  onProgress?: (event: ProgressEvent, type: ModelLoadType) => void,
  onError?: (event: ErrorEvent) => void
}

export interface LoaderInterface {

  render (options: ModelOptions, render: RenderType): LoaderInterface

  getLoader ()

  addSceneMesh (mesh: MeshType, params: object): LoaderInterface

  refresh (time: number)

}
