import React, { useReducer, useRef, useEffect, useCallback } from 'react'

;
import {InitFn, SignInFn, SignOutFn, EzAuthContextType, EzAuthContext, ForgotPasswordFn} from '../EzAuthContext';
import ezAuthReducer from '../store/reducer';
import { initialize, setUser, reset } from '../store/actions';
import { emitAuthEvent } from '../events/EventHub';
import { EzAuthEventType } from '../events';

interface EzAuthProviderProps {
  init?: InitFn;
  signIn?: SignInFn;
  signOut?: SignOutFn;
  forgotPassword?: ForgotPasswordFn;
}


const initialAuthState: EzAuthContextType['state'] = {
  initialized: false,
  authenticated: true,
  user: null,
};

export const EzAuthProvider: React.FC<EzAuthProviderProps> = (props) => {
  const [state, dispatch] = useReducer(ezAuthReducer, initialAuthState);

  const functionRef = useRef({
    init: props.init || (() => null),
  });

  useEffect(() => {
    const init = async () => {
      const user = await functionRef.current.init();
      dispatch(initialize(user));
      emitAuthEvent({ type: EzAuthEventType.INITIALIZED, user })
    };
    init();
  }, []);

  const signIn = useCallback(
    async (username: string, password: string) => {
      const fn = props.signIn || (() => null);
      const user = await fn(username, password);
      dispatch(setUser(user));
      emitAuthEvent({ type: EzAuthEventType.SIGNED_IN, user })
      return user;
    },
    [props.signIn, dispatch]
  );

  const signOut = useCallback(async () => {
    const fn = props.signOut || (() => null);
    await fn();
    dispatch(reset());
    emitAuthEvent({ type: EzAuthEventType.SIGNED_OUT })
  }, [props.signOut, dispatch]);

  const forgotPassword = useCallback(
      async (username: string) => {
        const fn = props.forgotPassword || (() => null)
        await fn(username)
        emitAuthEvent({ type: EzAuthEventType.PASSWORD_RESET })
      },
      [props.forgotPassword]
  )

  return (
    <EzAuthContext.Provider value={{ state, signIn, signOut, forgotPassword }}>
      {props.children}
    </EzAuthContext.Provider>
  );
};
