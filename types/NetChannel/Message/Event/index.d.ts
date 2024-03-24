import { WebSocketInterface } from '#/NetChannel/Web.Socket'
import { WindowInterface } from '#/Window'

export type EventAction = (data: any) => any

export interface EventInterface {

  event: Record<string, EventAction>

  websocket: WebSocketInterface

  window: WindowInterface

  emit (event: string, data: any): void


}
