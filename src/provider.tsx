import React, { createContext, useContext, useReducer, useMemo, Dispatch } from 'react';
import { HttpStatusCode } from 'types/HttpStatusCode';
import { VGSCollectFormState } from './types/Form';

type GlobalStateContext = VGSCollectFormState | undefined;
type GlobalSubmitContext = { status: HttpStatusCode, data: any } | undefined;
type GlobalFormContext = { formCreated: boolean} | undefined;

export const initialState = undefined;

export const initialFormState = { formCreated: false };

export const GlobalSubmitContext = createContext<GlobalSubmitContext>(initialState);
export const DispatchSubmitContext = createContext({} as Dispatch<any>);
export const GlobalStateContext = createContext<GlobalStateContext>(initialState);
export const DispatchStateContext = createContext({} as Dispatch<any>);

// Add typings for the context
export const GlobalFormContext = createContext<GlobalFormContext>(initialFormState);
//export const DispatchFormContext = createContext({} as Dispatch<any>);

export type Action = { type: 'FORM_MOUNTED' } | { type: 'FORM_UNMOUNTED' };

const reducer = (state: GlobalFormContext, action: Action) => {
  switch (action.type) {
    case 'FORM_MOUNTED':
      return { ...state, formCreated: true };
    case 'FORM_UNMOUNTED':
      return { ...state, formCreated: false };
    default:
      return state;
  }
};

type DispatchContextProps = {
  formState: GlobalFormContext;
  dispatchFormState: Dispatch<Action>;
}

export const DispatchFormContext = createContext<DispatchContextProps | undefined>(undefined);

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
  const [formState, dispatchFormState] = useReducer(reducer, initialFormState);

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
                <DispatchFormContext.Provider value={{ formState, dispatchFormState }}>
                  {children}
                </DispatchFormContext.Provider>
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

export const useVGSCollectFormState = () => [
  useContext(GlobalFormContext)
];

// export const VGSFormProvider = ({ children }: any) => {
  
// }

export const VGSCollectProvider = ({ children }: any) => {
  return <GlobalStateProvider>{children}</GlobalStateProvider>;
};
