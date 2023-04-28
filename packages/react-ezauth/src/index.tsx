
export * from './hooks'
export * from './components'
export * from './events'
export * from './EzAuthContext'
export * from './types'

export interface DefaultUser {
  id: string;
  roles?: string[];
}
export type User = DefaultUser
