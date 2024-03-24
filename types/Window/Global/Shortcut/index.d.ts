export type ShortcutOptions = {
  windowId: number
  shortcut: string
  event: string
}

export interface ShortcutInterface {

  setShortcut(shortcut: ShortcutOptions[]): void

}
