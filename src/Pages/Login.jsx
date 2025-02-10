import { useEffect, useState } from 'react';
import { API_METHODS } from '../utils/constants/apiMethods';
import { API_PATHS } from '../utils/constants/apiPaths';
import { genericAxios } from '../utils/genericAxiosMethod';
import { Loader } from '@mantine/core';

const storeImageLocally = async (imageUrl, key) => {
  if (localStorage.getItem(key)) return; 
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const reader = new FileReader();

    reader.onloadend = () => {
      localStorage.setItem(key, reader.result);
    };

    reader.readAsDataURL(blob);
  } catch (error) {
    console.error('Failed to store image locally:', error);
  }
};

const getImageFromLocalStorage = (key, fallbackUrl) => {
  return localStorage.getItem(key) || fallbackUrl;
};

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [viewIcon, setViewIcon] = useState('');
  const [hideIcon, setHideIcon] = useState('');

  useEffect(() => {
    const images = [
      { url: '/images/view.svg', key: 'viewIcon' },
      { url: '/images/hide.svg', key: 'hideIcon' },
    ];

    Promise.all(images.map(({ url, key }) => storeImageLocally(url, key))).then(() => {
      setViewIcon(getImageFromLocalStorage('viewIcon', '/images/view.svg'));
      setHideIcon(getImageFromLocalStorage('hideIcon', '/images/hide.svg'));
    });
  }, []);

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
        navigate('/billing');
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
            height={'20px'}
            src="images/user.svg"
            alt="user icon"
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
          {viewIcon && hideIcon && (
            <span
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="password-toggle"
              style={{
                backgroundImage: `url(${passwordVisible ? viewIcon : hideIcon})`,
                backgroundSize: 'contain',
                width: '20px',
                height: '20px',
                display: 'inline-block',
                cursor: 'pointer',
              }}
            />
          )}
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
