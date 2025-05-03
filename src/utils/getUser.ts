import Cookies from "js-cookie";
import { parseJwt } from "./cookie";

export const getUser =  ()=> {
    const user =
        parseJwt(Cookies.get('token')) || {};

    return user;
}