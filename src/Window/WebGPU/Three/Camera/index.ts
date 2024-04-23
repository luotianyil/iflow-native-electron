import * as THREE from 'three'

export type Vector3Type = {
  x: number
  y: number
  z: number
}

export type CameraOptionsType = {
  width: number
  height: number
  path?: string
  fov?: number
  aspect?: number
  near?: number
  far?: number
  position?: Vector3Type
  lookAt?: Vector3Type
}

export default class Camera {

  private camera: THREE.PerspectiveCamera | null = null

  constructor() {}

  initialization(options: CameraOptionsType): Camera {
    this.camera = new THREE.PerspectiveCamera(
      options.fov || 90,
      options.aspect || ( options.width / options.height ),
      options.near,
      options.far
    )

    if (options.lookAt) {
      this.camera.lookAt(options.lookAt.x, options.lookAt.y, options.lookAt.z)
    }

    if (options.position) {
      this.camera.position.x = options.position.x
      this.camera.position.y = options.position.y
      this.camera.position.z = options.position.z
    }

    return this
  }

  getCamera(): THREE.PerspectiveCamera {
    if (!this.camera) throw new Error('camera Uninitialized')
    return this.camera
  }

}
