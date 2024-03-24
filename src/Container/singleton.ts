export default <T>(className: any): T => {
  let __ins: any = null

  return new Proxy(className, {
    construct(target: any, argArray: any[], newTarget: Function): object {
      if (__ins) return __ins

      return __ins = new className(...argArray)
    }
  })
}
