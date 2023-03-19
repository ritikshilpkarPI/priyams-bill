import { useState, useEffect } from 'react';
import { API_METHODS } from 'src/utils/constants/apiMethods';
import { API_PATHS } from 'src/utils/constants/apiPaths';
import { genericAxios } from 'src/utils/genericAxiosMethod';
import Cookies from 'js-cookie';
// axios.defaults.withCredentials = true;

const Login = ({ history }) => {
  const [username, setusername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const loginUser = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setErrorMsg("username or password can't be blank");
      return;
    }

    const payload = { username: username.toLowerCase(), password };
    const response = await genericAxios({
      url: API_PATHS.AUTH.POST_LOGIN,
      method: API_METHODS.POST,
      data: { ...payload },
      headers: {
        Cookie: '',
      },
    });

    if(response.error){
      setErrorMsg('Invalid username');
      setErrorMsg("")
      return
    }
    history.push('/billing');
  };


  return (
    <div className="login-card">
      <form onSubmit={loginUser}>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          id="username"
          value={username}
          onChange={(e) => setusername(e.target.value)}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p id="error-msg" style={{ textAlign: 'left' }}>
          {errorMsg}
        </p>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
