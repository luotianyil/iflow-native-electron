export default class Render {

  window: Window

  html: string

  constructor(window: Window, html: string) {
    this.window = window
    this.html = html
  }

  executeScript(script: any): void {
    if (!script || script.innerText) return
    new Function(script.innerText)
  }

  render (): void {
    this.window.document.getElementsByTagName('html')[0].remove()
    const document = new DOMParser().parseFromString(this.html, 'text/html')
    this.executeScript(document.querySelector('script'))
  }
}
