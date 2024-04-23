import * as THREE from 'three'
import Loader from '@/Window/WebGPU/Three/Loader'
import { LoaderInterface, MeshType, ModelOptions, RenderType } from '#/WebGPU/Loader'

export default class OBJLoader extends Loader {

  loader: THREE.ObjectLoader = new THREE.ObjectLoader()


  render(options: ModelOptions, render: RenderType): LoaderInterface {
    this.loader.load(
      options.path,
      (mesh) => options.onLoad({ mesh: mesh }, this.three, this, 'MOD'),
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
