import Loader from '@/Window/WebGPU/Three/Loader'
import { GLTFLoader as _GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { LoaderInterface, MeshType, ModelOptions, RenderType } from '#/WebGPU/Loader'

export default class GLTFLoader extends Loader {

  protected readonly loader: _GLTFLoader = new _GLTFLoader()

  refresh(time: number) {
  }

  render(options: ModelOptions, render: RenderType): LoaderInterface {
    this.loader.load(
      options.path,
      (mesh) => options.onLoad({ mesh: mesh.scene }, this.three, this, 'MOD'),
      (event: ProgressEvent) => {
        options.onProgress?.(event, 'MOD')
        console.log((event.loaded / event.total * 100) + '% loaded GLTF-MOD')
      },
      function (event) {
        console.log('GLTFLoader Error: ', event)
        options.onError?.(event as any)
      }
    )

    return this
  }

}
