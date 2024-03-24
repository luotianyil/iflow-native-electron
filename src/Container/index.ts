import singleton from './singleton'

export interface ContainerInterface {
  get: <T = any>(className: object) => T
  has: (className: object) => boolean
  register: (className: any, args?: any[], isNewCreated?: boolean) => ContainerInterface
  instance: <T>(_class: object, _new: boolean, ...args: any[]) => T
  remove: (className: object) => void
}

class container implements ContainerInterface {

  #containers = new WeakMap()

  register (className: any, args: any[] = [], isNewCreated: boolean = false): ContainerInterface {
    if (isNewCreated) this.remove(className)
    this.#containers.set(className, new className(...args))
    return this
  }

  instance<T>(_class: object, _new: boolean = false, ...args: any[]): T {
    if (_new && this.has(_class)) return this.get(_class)
    return this.register(_class, args, _new).get<T>(_class)
  }

  has (className: object): boolean {
    return this.#containers.has(className)
  }

  get <T = any>(className: object): T {
    return this.#containers.get(className)
  }

  remove (className: object): void {
    this.has(className) && this.#containers.delete(className)
  }
}

export const containerSingleton: ContainerInterface = new (singleton<ContainerInterface>(container) as any)

export { containerSingleton as default }
