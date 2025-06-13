import { useNavigate } from 'react-router-dom';
import { useError } from "../context/ErrorContext";
import BadRequest from "../pages/Errors/BadRequest";
import Forbidden from "../pages/Errors/Forbidden";
import Unprocessable from "../pages/Errors/Unprocessable";
import NotFound from "../pages/Errors/NotFound";

const ErrorHandler = () => {
  const { errorCode, errorMessage } = useError();
  const navigate = useNavigate();

  if (errorCode === 400) return <BadRequest />;
  if (errorCode === 403) return <Forbidden />;
  if (errorCode === 422) return <Unprocessable msg={errorMessage}/>;
  if (errorCode === 404) return <NotFound />;

  return null;
};

export default ErrorHandler;
