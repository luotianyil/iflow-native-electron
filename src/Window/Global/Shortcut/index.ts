import { globalShortcut } from 'electron'

import { ShortcutInterface, ShortcutOptions } from '#/Window/Global/Shortcut'
import LayoutAdapterAbstract from '@/Window/Layout/LayoutAdapterAbstract'

export default class Shortcut extends LayoutAdapterAbstract implements ShortcutInterface {

  setShortcut(shortcut: ShortcutOptions[]): void {
    if (shortcut.length === 0) return

    for (const shortcutKey in shortcut) {
      const _shortcut = shortcut[shortcutKey]
      if (globalShortcut.isRegistered(_shortcut.shortcut)) globalShortcut.unregister(_shortcut.shortcut)

      globalShortcut.register(
        _shortcut.shortcut, () => this.runShortcutCallback(_shortcut, _shortcut.event)
      )
    }
  }

  /**
   * 注册快捷键回调事件
   * @param shortcut
   * @param event
   * @private
   */
  private runShortcutCallback (shortcut: ShortcutOptions, event: string) {
    shortcut.windowId = this.browserWindow?.id || 0
    this.websocket.emitAsync(event, shortcut).then(response => {
      return this.window.messageChannel.emit(this.browserWindow, { shortcut, response })
    })
  }

}
