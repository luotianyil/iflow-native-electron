import { Vector3Type } from '@/Window/WebGPU/Three/Camera'
import { OrbitControls as _OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Three from '@/Window/WebGPU/Three'
import * as THREE from 'three'

export type OrbitControlsOptionsType = {
  enabled?: boolean
  target?: Vector3Type
  cursor?: Vector3Type
}

export default class OrbitControls {

  private orbitControls: _OrbitControls | null = null

  initialization(options: OrbitControlsOptionsType, three: Three): OrbitControls {
    this.orbitControls = new _OrbitControls(
      three.getRender().getCamera().getCamera(),
      three.getRender().getThreeRender().domElement
    )

    this.enabled(typeof options.enabled === 'undefined' ? true : options.enabled)

    // ts-ignore
    this.setTarget(options.target || { x: 0, y: 10, z: 0 })
    if (options.cursor) this.setCursor(options.cursor)
    return this
  }

  setTarget(target: Vector3Type): OrbitControls {
    this.getOrbitControls().target = new THREE.Vector3(target.x, target.y, target.z)
    return this
  }

  setCursor(cursor: Vector3Type): OrbitControls {
    this.getOrbitControls().cursor = new THREE.Vector3(cursor.x, cursor.y, cursor.z)
    return this
  }

  enabled(enabled: boolean): OrbitControls {
    this.getOrbitControls().enabled = enabled
    return this
  }

  getOrbitControls(): _OrbitControls {
    if (!this.orbitControls) throw new Error('OrbitControls UnInitialization')
    return this.orbitControls
  }

}
