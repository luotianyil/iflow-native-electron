import { BrowserWindow, dialog } from 'electron'
import { DialogInterface, DialogOptions } from '#/Window/Global/Dialog'

export default class Dialog implements DialogInterface {

  options: DialogOptions

  constructor(options: DialogOptions = {}) {
    this.options = options
  }

  dialog(options: DialogOptions, window: BrowserWindow): void {
    if (!options.dialogMethod) return

    // @ts-ignore
    dialog[options.dialogMethod]?.(window, options)
  }

}
