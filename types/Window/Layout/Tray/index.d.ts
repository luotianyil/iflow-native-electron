import { Tray, MenuItemConstructorOptions } from 'electron'
import { LayoutAdapterInterface } from '#/Window/Layout'
import { EventType } from '#/Window/Global/Event'

export type TrayMenu = {} & EventType & MenuItemConstructorOptions

export type TrayOptionsType = {
  icon?: string
  title: string
  tipTitle: string
  pressedIcon?: string
  menu: TrayMenu[]
}

export interface TrayInterface extends LayoutAdapterInterface {

  tray: Tray | null

  getTray (trayOptions: TrayOptionsType): Tray

  setTray (trayOptions: TrayOptionsType): void

}
