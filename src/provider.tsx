import React, { createContext, useContext, useReducer, useMemo } from 'react';

export const initialState = undefined;

export const GlobalSubmitContext = createContext(initialState);
export const DispatchSubmitContext = createContext(undefined);
export const GlobalStateContext = createContext(initialState);
export const DispatchStateContext = createContext(undefined);

export const GlobalStateProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(
    (state: any, newValue: any) => ({ ...state, ...newValue }),
    initialState
  );
  const [response, dispatchSubmit] = useReducer(
    (state: any, newValue: any) => ({ ...state, ...newValue }),
    initialState
  );

  const memoState = useMemo(
    () => ({
      state,
      dispatch
    }),
    [state]
  );

  const memoResponse = useMemo(
    () => ({
      response,
      dispatchSubmit
    }),
    [state]
  );

  // @ts-ignore
  return (
    // @ts-ignore
    <GlobalStateContext.Provider value={memoState}>
      {/* // @ts-ignore */}
      <DispatchStateContext.Provider value={dispatch}>
        <GlobalSubmitContext.Provider value={memoResponse}>
          {/* // @ts-ignore */}
          <DispatchSubmitContext.Provider value={dispatchSubmit}>
            {children}
          </DispatchSubmitContext.Provider>
        </GlobalSubmitContext.Provider>
      </DispatchStateContext.Provider>
    </GlobalStateContext.Provider>
  );
};

export const useVGSState = () => [
  useContext(GlobalStateContext),
  useContext(DispatchStateContext)
];
export const useSubmit = () => [
  useContext(GlobalSubmitContext),
  useContext(DispatchSubmitContext)
];

export const VGS = ({ children }: any) => {
  return <GlobalStateProvider>{children}</GlobalStateProvider>;
};
