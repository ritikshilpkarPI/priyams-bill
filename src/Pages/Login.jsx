import { useEffect, useState } from 'react';
import { API_METHODS } from '../utils/constants/apiMethods';
import { API_PATHS } from '../utils/constants/apiPaths';
import { genericAxios } from '../utils/genericAxiosMethod';
import { Loader } from '@mantine/core';
import { useNavigate } from 'react-router';
import { convertImageToBase64 } from 'src/utils/convertImageToBase64';


const getImageFromLocalStorage = (key, fallback) => {
  return localStorage.getItem(key) || fallback;
};

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [toggleIcon, setToggleIcon] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const viewIconUrl = '/images/view.svg';
    const hideIconUrl = '/images/hide.svg';

    if (!localStorage.getItem('viewIcon')) {
      convertImageToBase64(viewIconUrl, 'viewIcon');
    }
    if (!localStorage.getItem('hideIcon')) {
      convertImageToBase64(hideIconUrl, 'hideIcon');
    }

    setToggleIcon(getImageFromLocalStorage('hideIcon', hideIconUrl));
  }, []);

  const togglePasswordVisibility = () => {
    const newIcon = passwordVisible
      ? getImageFromLocalStorage('hideIcon', '/images/hide.svg')
      : getImageFromLocalStorage('viewIcon', '/images/view.svg');

    setToggleIcon(newIcon);
    setPasswordVisible(!passwordVisible);
  };

  const loginUser = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setErrorMsg("username or password can't be blank");
      return;
    }

    setLoading(true);

    try {
      const payload = { username: username.toLowerCase(), password };
      const response = await genericAxios({
        url: API_PATHS.AUTH.POST_LOGIN,
        method: API_METHODS.POST,
        data: payload,
        headers: { Cookie: '' },
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
            height="20px"
            src="/images/user.svg"
            alt="User Icon"
            className="username-icon"
          />
        </div>

        <label htmlFor="password">Password</label>
        <div className="password-container">
          <input
            type={passwordVisible ? 'text' : 'password'}
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            onClick={togglePasswordVisibility}
            className="password-toggle"
            style={{
              backgroundImage: `url(${toggleIcon})`,
              backgroundSize: 'contain',
              width: '20px',
              height: '20px',
              display: 'inline-block',
              cursor: 'pointer',
            }}
          />
        </div>

        <p id="error-msg" style={{ textAlign: 'left' }}>{errorMsg}</p>

        <button type="submit" disabled={loading}>
          {loading ? <Loader size="sm" color="white" /> : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
