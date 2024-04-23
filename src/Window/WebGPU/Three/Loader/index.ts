import Three from '@/Window/WebGPU/Three'
import {
  LoaderInterface,
  MeshType,
  ModelLoadType,
  ModelOptions,
  RenderType
} from '#/WebGPU/Loader'

export default class Loader implements LoaderInterface {

  protected readonly loader: any = {}

  protected readonly three: Three

  constructor(three: Three) {
    this.three = three
  }

  addSceneMesh(mesh: MeshType, params: object): LoaderInterface {
    this.three.getScene().add(mesh)
    return this
  }

  getLoader() {
    return this.loader
  }

  refresh(time: number) {}

  render(options: ModelOptions, render: RenderType): LoaderInterface {
    return this
  }

  onProgress(event: ProgressEvent, type: ModelLoadType, onProgress?: Function) {
    if (onProgress) onProgress(event, type)
    console.log((event.loaded / event.total * 100) + '% loaded ' + type)
  }
}
