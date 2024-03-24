import { Tray as WindowTray, Menu } from 'electron'
import LayoutAdapterAbstract from '@/Window/Layout/LayoutAdapterAbstract'
import { TrayInterface, TrayMenu, TrayOptionsType } from '#/Window/Layout/Tray'

import Container from '@/Container'

import GlobalEvent from '@/Window/Global/Event'
import { EventInterface as GlobalEventInterface } from '#/Window/Global/Event'

export default class Tray extends LayoutAdapterAbstract implements TrayInterface {

  tray: WindowTray | null = null

  getTray(trayOptions: TrayOptionsType): WindowTray {
    if (this.tray && trayOptions.icon) this.tray.setImage(trayOptions.icon)

    this.tray = this.tray || new WindowTray(trayOptions.icon || '')

    this.tray.setTitle(trayOptions.title)
    this.tray.setToolTip(trayOptions.tipTitle)

    if (trayOptions.pressedIcon)
      this.tray.setPressedImage(trayOptions.pressedIcon)

    return this.tray
  }

  setTray(trayOptions: TrayOptionsType): void {

    if (!trayOptions || !trayOptions.menu) return

    this.getTray(trayOptions).setContextMenu(
      Menu.buildFromTemplate(this.replaceTrayClickHandle(trayOptions.menu))
    )
  }

  private replaceTrayClickHandle (trayMenu: TrayMenu[]): TrayMenu[] {
    return trayMenu.map(menuItem => {
      Container.get<GlobalEventInterface>(GlobalEvent)
        .setWindow(this.browserWindow)
        .on(menuItem, 'click', this.browserWindow, (event, response) => {
          return this.window.messageChannel.emit(this.browserWindow, { event, response })
        })

      return menuItem
    })
  }
}
