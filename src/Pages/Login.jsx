import { useEffect, useState } from 'react';
import { API_METHODS } from '../utils/constants/apiMethods';
import { API_PATHS } from '../utils/constants/apiPaths';
import { genericAxios } from '../utils/genericAxiosMethod';
import { Loader } from '@mantine/core';
import { useNavigate } from 'react-router';
import { fetchImageAPI } from 'src/utils/apiUtils';



const getImageFromLocalStorage = (key, fallbackUrl) => {
  return localStorage.getItem(key) || fallbackUrl;
};

const setImageInLocalStorage = (key, imageUrl) => {
  localStorage.setItem(key, imageUrl);
};

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [viewIcon, setViewIcon] = useState('');
  const [hideIcon, setHideIcon] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    const fetchIcons = async () => {
      const storedViewIcon = getImageFromLocalStorage('viewIcon', '');
      const storedHideIcon = getImageFromLocalStorage('hideIcon', '');

      if (storedViewIcon && storedHideIcon) {
        setViewIcon(storedViewIcon);
        setHideIcon(storedHideIcon);
        return; 
      }

      try {
        const viewIconRes = await fetchImageAPI('/images/view.svg');
        const hideIconRes = await fetchImageAPI('/images/hide.svg');

        if (!viewIconRes.isError) {
          setViewIcon(viewIconRes);
          setImageInLocalStorage('viewIcon', viewIconRes);
        }

        if (!hideIconRes.isError) {
          setHideIcon(hideIconRes);
          setImageInLocalStorage('hideIcon', hideIconRes);
        }
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchIcons();
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
