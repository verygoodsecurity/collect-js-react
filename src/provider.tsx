import React, { createContext, useContext, useReducer, useMemo, Dispatch } from 'react';
import { HttpStatusCode } from 'types/HttpStatusCode';
import { VGSCollectFormState } from './types/Form';

type GlobalStateContext = VGSCollectFormState | undefined;
type GlobalSubmitContext = { status: HttpStatusCode, data: any } | undefined;

export const initialState = undefined;

export const GlobalSubmitContext = createContext<GlobalSubmitContext>(initialState);
export const DispatchSubmitContext = createContext({} as Dispatch<any>);
export const GlobalStateContext = createContext<GlobalStateContext>(initialState);
export const DispatchStateContext = createContext({} as Dispatch<any>);

export const GlobalStateProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(
    (_state: GlobalStateContext, newValue: any) => {
      return newValue ? { ...newValue } : initialState;
    },
    initialState
  );
  const [response, dispatchSubmit] = useReducer(
    (_state: GlobalSubmitContext, newValue: any) => {
      return newValue ? { ...newValue } : initialState;
    },
    initialState
  );

  const memoState = useMemo(
    () => (state),
    [state]
  );

  const memoResponse = useMemo(
    () => (response),
    [response]
  );

  return (
    <div>
      <GlobalStateContext.Provider value={memoState}>
        <DispatchStateContext.Provider value={dispatch}>
          <GlobalSubmitContext.Provider value={memoResponse}>
            <DispatchSubmitContext.Provider value={dispatchSubmit}>
                  {children}
            </DispatchSubmitContext.Provider>
          </GlobalSubmitContext.Provider>
        </DispatchStateContext.Provider>
      </GlobalStateContext.Provider>
    </div>
  );
};

export const useVGSCollectState = () => [
  useContext(GlobalStateContext),
];

export const useVGSCollectResponse = () => [
  useContext(GlobalSubmitContext)
];

export const VGSCollectProvider = ({ children }: any) => {
  return <GlobalStateProvider>{children}</GlobalStateProvider>;
};
