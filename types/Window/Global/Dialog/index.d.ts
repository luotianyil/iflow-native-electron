import { BrowserWindow } from 'electron'

export type DialogOptions = {
  dialogMethod?: string
}

export interface DialogInterface {

  options: DialogOptions

  dialog(options: DialogOptions, window: BrowserWindow): void

}
