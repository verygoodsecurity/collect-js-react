import React, { createContext, useContext, useReducer } from "react";


export const initialState = undefined

export const GlobalStateContext = createContext(initialState);
export const DispatchStateContext = createContext(undefined);

export const GlobalStateProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(
    (state: any, newValue: any) => ({ ...state, ...newValue }),
    initialState
  )

  // @ts-ignore
  return (
    <GlobalStateContext.Provider value={state}>
      {/*// @ts-ignore*/}
      <DispatchStateContext.Provider value={dispatch}>
        {children}
      </DispatchStateContext.Provider>
    </GlobalStateContext.Provider>
  )
}

export const useVGSState = () => [
  useContext(GlobalStateContext),
  useContext(DispatchStateContext)
];

export const VGS = ({ children }: any) => {
  return <GlobalStateProvider>{children}</GlobalStateProvider>
}
