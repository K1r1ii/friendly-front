import React, { createContext, useContext, useState } from "react";

const ErrorContext = createContext({
  errorCode: null,
  setErrorCode: () => {},
  errorMessage: "",
  setErrorMessage: () => {},
});

export const useError = () => useContext(ErrorContext);

export const ErrorProvider = ({ children }) => {
  const [errorCode, setErrorCode] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  return (
    <ErrorContext.Provider value={{ errorCode, setErrorCode, errorMessage, setErrorMessage }}>
      {children}
    </ErrorContext.Provider>
  );
};
