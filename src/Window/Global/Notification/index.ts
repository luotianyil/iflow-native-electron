import { BrowserWindow, Notification as WindowNotification } from 'electron'
import { NotificationInterface, NotificationMessage, NotificationOptions } from '#/Window/Global/Notification'

export default class Notification implements NotificationInterface {

  options: NotificationOptions

  private events = [ 'show', 'click', 'reply', 'close', 'action', 'failed' ]

  constructor(options: NotificationOptions = {}) {
    this.options = options
  }

  show(options: NotificationOptions, window: BrowserWindow, message: NotificationMessage) {
    options = Object.assign({}, options, this.options)
    const notification = new WindowNotification(options)

    this.notificationHandler(notification, options, window, message).show()
  }

  private notificationHandler (
    notification: WindowNotification, options: NotificationOptions, window:BrowserWindow, message: NotificationMessage
  ): WindowNotification {

    this.events.map((event: any) => {
      if (!options?.events?.[event]) return

      notification.on(event, (_event, _options) => {
        message.emit(options?.events?.[event], {
          options, _options: _options || {}, windowId: window.id
        })
      })
    })
    return notification
  }

}
