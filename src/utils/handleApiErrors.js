export default function handleApiErrors(error, setErrorCode, setErrorMessage, handle422=true) {
  const status = error?.response?.status;

  if (status === 422 && handle422) {
    const msg = error?.response?.data?.detail?.[0]?.msg;
    setErrorMessage(msg || "Validation failed");
  }
  else{
    setErrorCode(status);
  }
}