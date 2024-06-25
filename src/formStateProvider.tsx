import React, { createContext, useContext, useReducer, useMemo, Dispatch } from 'react';

type GlobalFormContext = { formCreated: boolean } | undefined;

export const initialState = undefined;

export const initialFormState = { formCreated: false };

export const GlobalFormContext = createContext<GlobalFormContext>(initialFormState);
export const DispatchFormContext = createContext({} as Dispatch<any>);

type Action = { type: 'FORM_MOUNTED' } | { type: 'FORM_UNMOUNTED' };

const formReducer = (state: GlobalFormContext, action: Action) => {
  switch (action.type) {
    case 'FORM_MOUNTED':
      return { ...state, formCreated: true };
    case 'FORM_UNMOUNTED':
      return { ...state, formCreated: false };
    default:
      return state;
  }
};

export const FormStateProvider = ({ children }: any) => {
  const [formState, dispatchFormState] = useReducer(formReducer, initialFormState);

  const memoFormState = useMemo(
    () => (formState),
    [formState]
  );

  return (
    <div>
        <GlobalFormContext.Provider value={memoFormState}>
            <DispatchFormContext.Provider value={dispatchFormState}>
                {children}
            </DispatchFormContext.Provider>
        </GlobalFormContext.Provider>
    </div>
  );
};

export const useVGSCollectFormState = () => [
  useContext(GlobalFormContext)
];
