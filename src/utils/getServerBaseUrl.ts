import { APP_ENVIRONMENT } from "./constants/appEnvironment";
import { CLIENT_ENVIRONMENT } from "./constants/clientEnvironment";

export const getServerBaseUrl = () => CLIENT_ENVIRONMENT.REACT_APP_ENV === APP_ENVIRONMENT.PRODUCTION ? "/.netlify/functions/server" : "https://priyams-bill.netlify.app";