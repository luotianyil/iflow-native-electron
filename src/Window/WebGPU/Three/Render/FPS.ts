export default class FPS {

  private currentTime: number = 0

  private FPS: number = 0

  private renderCount: number = 0

  render (renderBox: HTMLElement): void {

    if (this.renderCount % 30 === 0) {
      const refresh = Date.now()
      this.FPS = Math.round(30000 / (refresh - this.currentTime))
      this.currentTime = refresh

      const FPS_ID = `${renderBox.id}-fps`
      let FPSDocument = renderBox.querySelector(`#${FPS_ID}`)

      if (!FPSDocument) {
        FPSDocument = document.createElement('div')
        FPSDocument.id = `${renderBox.id}-fps`
        renderBox.append(FPSDocument)
      }
      FPSDocument.innerHTML = `FPS: ${this.FPS}`

      this.renderCount = 0
    }

    this.renderCount++
  }

  getFPS (): number {
    return this.FPS
  }
}
