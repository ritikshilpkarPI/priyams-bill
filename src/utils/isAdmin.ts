
import { parseJwt } from './cookie';
import Cookies from 'js-cookie';
export const isAdmin = ()=>{
    if (parseJwt(Cookies.get('token')).role === 'admin') {
        return true
    }else return false
}