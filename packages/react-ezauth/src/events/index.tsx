import {User} from "..";

export enum EzAuthEventType {
  SIGNED_IN = 'SIGNED_IN',
  SIGNED_OUT = 'SIGNED_OUT',
  INITIALIZED = 'INITIALIZED',
  PASSWORD_RESET = 'PASSWORD_RESET'
}

interface SignedInEvent {
  type: EzAuthEventType.SIGNED_IN
  user: User
}

interface InitializedEvent {
  type: EzAuthEventType.INITIALIZED
  user?: User
}

interface SignedOutEvent {
  type: EzAuthEventType.SIGNED_OUT
}

interface PasswordResetEvent {
  type: EzAuthEventType.PASSWORD_RESET
}

export type EzAuthEvent =
  | SignedInEvent
  | SignedOutEvent
  | InitializedEvent
  | PasswordResetEvent


export { ezAuthEventHub } from './EventHub'
