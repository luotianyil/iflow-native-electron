import { Sky as ThreeSky } from 'three/examples/jsm/objects/Sky'

import * as THREE from 'three'
import Three from '@/Window/WebGPU/Three'
import { MeshBasicMaterialParameters } from 'three/src/materials/MeshBasicMaterial'
import { Vector3Type } from '@/Window/WebGPU/Three/Camera'

export type SkyEffectControllerType = {
  turbidity: number
  rayleigh: number
  mieCoefficient: number
  mieDirectionalG: number
  luminance: number
  inclination: number
  azimuth: number
  side: THREE.Side
  [key: string]: any
}

export type SkySunOptions = {
  name: string
  SphereGeometry: {
    radius?: number
    widthSegments?: number
    heightSegments?: number
    phiStart?: number
    phiLength?: number
    thetaStart?: number
    thetaLength?: number
  }
  MeshBasicMaterialParameters?: MeshBasicMaterialParameters
  position?: Vector3Type
  visible?: boolean
}

export type SkyGeometry = {
  width?: number
  height?: number
  depth?: number
  widthSegments?: number
  heightSegments?: number
  depthSegments?: number
  vertexShader?: string
  fragmentShader?: string
}

export type SkyOptions = {
  name: string
  width?: number
  height?: number
  geometry?: SkyGeometry
  material?: THREE.ShaderMaterialParameters
  enabled?: boolean
  scalar?: number
  sun?: SkySunOptions
  effectControllerSky?: SkyEffectControllerType
}

export default class Sky {

  private readonly sky: ThreeSky = new ThreeSky()

  private readonly three: Three

  private effectControllerSky: SkyEffectControllerType = {
    turbidity: 1,
    rayleigh: 1.5,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.8,
    luminance: 1,
    inclination: 0.0, // elevation / inclination
    azimuth: 0.25, // Facing front
    side: THREE.BackSide
  }

  private distanceSky: number = 400000

  private sunSphere: THREE.Mesh = new THREE.Mesh()

  constructor(three: Three) {
    this.three = three
  }

  /**
   * 初始化
   * @param options
   */
  initialization(options: SkyOptions): Sky {
    if (!options.enabled) return this

    this.sky.name = options.name
    this.sky.scale.setScalar(options.scalar || 10000)

    this.effectControllerSky = Object.assign(this.effectControllerSky, options.effectControllerSky || {})

    this.setSkyGeometry(options.geometry || {})
      .setShaderMaterial(options.material || {})

    this.three.getScene().add(
      this.setSunSphere(Object.assign({
        name: 'sun-default',
        SphereGeometry: {
          radius: 20000,
          widthSegments: 16,
          heightSegments: 8
        },
        MeshBasicMaterialParameters: { color: 0xffffff }
      }, options.sun || {})).getSky()
    )

    this.render()
    this.skyChanged()
    return this
  }


  setSkyGeometry (geometry: SkyGeometry): Sky {
    geometry = Object.assign({
      width: this.three.width,
      height: this.three.height
    }, geometry)

    this.getSky().geometry = new THREE.BoxGeometry(
      geometry.width,
      geometry.height,
      geometry.depth,
      geometry.widthSegments,
      geometry.heightSegments,
      geometry.depthSegments
    )
    return this
  }

  /**
   * 天空纹理
   * @param material
   */
  setShaderMaterial (material: THREE.ShaderMaterialParameters): Sky {

    const uniforms: { [ key: string ]: { value: any } } = {}

    for (const effectControllerSkyKey in this.effectControllerSky) {
      uniforms[effectControllerSkyKey] = { value: this.effectControllerSky[effectControllerSkyKey] }
    }

    this.sky.material.uniforms = uniforms

    this.sky.material.vertexShader = material.vertexShader || ''
    this.sky.material.fragmentShader = material.fragmentShader || ''
    this.sky.material.side = this.effectControllerSky.side

    return this
  }

  /**
   * 设置阳光
   * @param options
   */
  setSunSphere(options?: SkySunOptions): Sky {
    if (!options) return this

    this.removeSunSphere().sunSphere = new THREE.Mesh(
      new THREE.SphereGeometry(
        options.SphereGeometry.radius,
        options.SphereGeometry.widthSegments,
        options.SphereGeometry.heightSegments,
        options.SphereGeometry.phiStart,
        options.SphereGeometry.phiLength,
        options.SphereGeometry.thetaStart,
        options.SphereGeometry.thetaLength
      ),
      new THREE.MeshBasicMaterial(options.MeshBasicMaterialParameters)
    )

    if (options.position) {
      this.sunSphere.position.x = options.position.x
      this.sunSphere.position.y = options.position.y
      this.sunSphere.position.z = options.position.z
    }
    this.sunSphere.visible = options.visible || false
    this.sunSphere.name = options.name

    this.three.getScene().add(this.sunSphere)

    return this
  }

  /**
   * 设置天空
   * @protected
   */
  protected skyChanged (): Sky {
    const theta = Math.PI * (this.effectControllerSky.inclination - 0.5)
    const phi = 2 * Math.PI * (this.effectControllerSky.azimuth - 0.5)
    this.sunSphere.position.x = this.distanceSky * Math.cos(phi)
    this.sunSphere.position.y = this.distanceSky * Math.sin(phi) * Math.sin(theta)
    this.sunSphere.position.z = this.distanceSky * Math.sin(phi) * Math.cos(theta)
    return this.render()
  }

  /**
   * 渲染天空
   * @protected
   */
  protected render (): Sky {
    this.three.getRender().render()
    return this
  }

  removeSunSphere(): Sky {
    if (this.three.getScene().getObjectByName(this.sunSphere.name))
      this.three.getScene().remove(this.sunSphere)

    return this
  }

  getSky(): ThreeSky {
    return this.sky
  }

  getSunSphere(): THREE.Mesh {
    return this.sunSphere
  }

}
