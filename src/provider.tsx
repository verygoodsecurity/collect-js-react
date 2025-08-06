import React, { createContext, useContext, useReducer, useMemo, Dispatch } from 'react';
import { HttpStatusCode } from 'types/HttpStatusCode';
import { VGSCollectFormState } from './types/Form';

type GlobalStateContext = VGSCollectFormState | undefined;
type GlobalSubmitContext = { status: HttpStatusCode; data: any } | undefined;
type GlobalFormInstanceContext = any;

export const initialState = undefined;

export const GlobalSubmitContext = createContext<GlobalSubmitContext>(initialState);
export const DispatchSubmitContext = createContext({} as Dispatch<any>);
export const GlobalStateContext = createContext<GlobalStateContext>(initialState);
export const DispatchStateContext = createContext({} as Dispatch<any>);
export const GlobalFormInstanceContext = createContext<GlobalFormInstanceContext>(false);
export const DispatchFormInstanceContext = createContext({} as Dispatch<any>);

export const GlobalStateProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer((_state: GlobalStateContext, newValue: any) => {
    return newValue ? { ...newValue } : initialState;
  }, initialState);
  const [response, dispatchSubmit] = useReducer((_state: GlobalSubmitContext, newValue: any) => {
    return newValue ? { ...newValue } : initialState;
  }, initialState);

  const [formInstance, dispatchFormInstance] = useReducer((_form: any, formInstance: any) => {
    return formInstance ? formInstance : null;
  }, null);

  const memoState = useMemo(() => state, [state]);

  const memoResponse = useMemo(() => response, [response]);

  const memoFormInstance = useMemo(() => formInstance, [formInstance]);

  return (
    <div>
      <GlobalStateContext.Provider value={memoState}>
        <DispatchStateContext.Provider value={dispatch}>
          <GlobalSubmitContext.Provider value={memoResponse}>
            <DispatchSubmitContext.Provider value={dispatchSubmit}>
              <GlobalFormInstanceContext.Provider value={memoFormInstance}>
                <DispatchFormInstanceContext.Provider value={dispatchFormInstance}>
                  {children}
                </DispatchFormInstanceContext.Provider>
              </GlobalFormInstanceContext.Provider>
            </DispatchSubmitContext.Provider>
          </GlobalSubmitContext.Provider>
        </DispatchStateContext.Provider>
      </GlobalStateContext.Provider>
    </div>
  );
};

export const useVGSCollectState = () => [useContext(GlobalStateContext)];

export const useVGSCollectResponse = () => [useContext(GlobalSubmitContext)];

export const useVGSCollectFormInstance = () => [useContext(GlobalFormInstanceContext)];

export const VGSCollectProvider = ({ children }: any) => {
  return <GlobalStateProvider>{children}</GlobalStateProvider>;
};
