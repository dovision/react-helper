import {User} from ".";

export interface EzAuthState {
  initialized: boolean;
  authenticated: boolean;
  user: User | null;
}
