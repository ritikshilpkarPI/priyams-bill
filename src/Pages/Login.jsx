import { useState } from 'react';
import { API_METHODS } from '../utils/constants/apiMethods';
import { API_PATHS } from '../utils/constants/apiPaths';
import { genericAxios } from '../utils/genericAxiosMethod';
import { Loader } from '@mantine/core';

const Login = ({ history }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const loginUser = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setErrorMsg("Username or password can't be blank");
      return;
    }

    setLoading(true);

    try {
      const payload = { username: username.toLowerCase(), password };
      const response = await genericAxios({
        url: API_PATHS.AUTH.POST_LOGIN,
        method: API_METHODS.POST,
        data: { ...payload },
        headers: {
          Cookie: '',
        },
      });
      const errorMessage = response?.error?.response?.data?.error?.message;

      if (response.error) {
        if (errorMessage === "Username doesn't exist") {
          setErrorMsg('Invalid username');
        } else if (errorMessage === "Password doesn't exist") {
          setErrorMsg('Incorrect password');
        } else {
          setErrorMsg('Login failed. Please try again.');
        }
      } else {
        history.push('/billing');
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="login-card">
      <form onSubmit={loginUser}>
        <label htmlFor="username">Username</label>
        <div className="username-container">
          <input
            type="text"
            name="username"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <img
            height={'20px'}
            src="images/user.svg"
            alt="user icon"
            className="username-icon"
          />
        </div>
        <label htmlFor="password">Password</label>
        <div className="password-container">
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span onClick={togglePasswordVisibility} className="password-toggle">
            {passwordVisible ? (
              <img height={'20px'} src="images/view.svg" alt="view icon" />
            ) : (
              <img height={'20px'} src="images/hide.svg" alt="hide icon" />
            )}
          </span>
        </div>
        <p id="error-msg" style={{ textAlign: 'left' }}>
          {errorMsg}
        </p>
        <button type="submit" disabled={loading}>
          {loading && (
            <div className="loader-container">
              <Loader size="sm" color="white" />
            </div>
          )}
          {!loading && 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
