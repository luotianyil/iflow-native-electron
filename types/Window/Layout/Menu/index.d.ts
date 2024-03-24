import { MenuItemConstructorOptions } from 'electron'
import { LayoutAdapterInterface } from '#/Window/Layout'
import { EventType } from '#/Window/Global/Event'

export type MenuItemType ={
  submenu: MenuItemType[]
} & EventType & MenuItemConstructorOptions

export type MenuOptionsType = Record<string | number, MenuItemType> | MenuItemType[]

export interface MenuInterface extends LayoutAdapterInterface {

  setMenu(menuOptions: MenuOptionsType): void

}
