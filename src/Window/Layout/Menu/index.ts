import { MenuInterface, MenuItemType, MenuOptionsType } from '#/Window/Layout/Menu'
import LayoutAdapterAbstract from '@/Window/Layout/LayoutAdapterAbstract'

import Container from '@/Container'
import { Menu as WindowMenu } from 'electron'
import GlobalEvent from '@/Window/Global/Event'
import { EventInterface as GlobalEventInterface } from '#/Window/Global/Event'

export default class Menu extends LayoutAdapterAbstract implements MenuInterface {

  setMenu(menuOptions: MenuOptionsType): void {
    const menu = Array.isArray(menuOptions) ? menuOptions : Object.values(menuOptions)

    if (menu.length && this.window && this.browserWindow.menuBarVisible)
      this.browserWindow.setMenu(WindowMenu.buildFromTemplate(this.replaceMenuClickHandle(menu)))
  }

  private replaceMenuClickHandle (menu: MenuItemType[]): MenuItemType[] {

    if (!menu.length) return []

    for (const menuKey in menu) {
      Container.get<GlobalEventInterface>(GlobalEvent)
        .setWindow(this.browserWindow)
        .on(menu[menuKey], 'click', this.browserWindow, (event, response) => {
          return this.window.messageChannel.emit(this.browserWindow, { event, response })
        })

      if (menu[menuKey].submenu && Array.isArray(menu[menuKey].submenu)) {
        menu[menuKey].submenu = this.replaceMenuClickHandle(menu[menuKey].submenu)
      }
    }

    return menu
  }

}
