import {  useState } from 'react';
import { API_METHODS } from '../utils/constants/apiMethods';
import { API_PATHS } from '../utils/constants/apiPaths';
import { genericAxios } from '../utils/genericAxiosMethod';
import { Loader } from '@mantine/core';
import { useDispatch } from 'react-redux';
import { fetchBillingLeanItems } from 'src/utils/fetchBillingLeanItems';
import { useNavigate } from 'react-router';
import { setGeolocationPermissionGranted, setStoreData } from 'src/redux/user/userSlice';




const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const dispatch = useDispatch()
  const togglePasswordVisibility = () => {
    
    setPasswordVisible((prev) => !prev);
  };
  const navigate = useNavigate();

 

  const loginUser = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setErrorMsg("Username or password can't be blank");
      return;
    }
  
    setLoading(true);
  
    try {
      const storedPincode = localStorage.getItem('userPincode');
      const storedData = localStorage.getItem('storeData');
      const savedStoreLocation = localStorage.getItem('storeLocation');
      const storeLocation = savedStoreLocation ? JSON.parse(savedStoreLocation) : {};
      const payload = {
        username: username.toLowerCase(),
        password,
        ...(storedPincode
          ? { pincode: storedPincode }
          : storeLocation ),
      };
  
      const response = await genericAxios({
        url: API_PATHS.AUTH.POST_LOGIN,
        method: API_METHODS.POST,
        data: payload,
        headers: { Cookie: '' },
      });
  
  
      if (!storedPincode && response?.data?.pincode) {
        localStorage.setItem('userPincode', response.data.pincode);
      }
  
      if (!storedData && response?.data?.storeData) {
        localStorage.setItem('storeData', JSON.stringify(response.data.storeData));
        dispatch(setStoreData(response.data.storeData));
      }
  
      const errorMessage = response?.error?.response?.data?.error?.message;
      if (response.error) {
        if (errorMessage === "Username doesn't exist") {
          setErrorMsg('Invalid username');
        } else if (errorMessage === "Password doesn't exist") {
          setErrorMsg('Incorrect password');
        } else if (
          response?.error?.response?.data?.error ===
          'Latitude and longitude are required'
        ) {
          setErrorMsg('Enable GeoLocation before login');
          dispatch(setGeolocationPermissionGranted(false));
        } else {
          setErrorMsg('Login failed. Please try again.');
        }
      } else {
        dispatch(fetchBillingLeanItems());
        window.location.href = '/billing';
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
          <img
            src={'/images/hide.svg'}
            alt="Toggle Password"
            onClick={togglePasswordVisibility}
            className="password-toggle"
            style={{
              width: '20px',
              height: '20px',
              cursor: 'pointer',
               visibility: passwordVisible ? "hidden" : "visible"
            }}
            
          />
           <img
            src={'/images/view.svg'}
            alt="Toggle Password"
            onClick={togglePasswordVisibility}
            className="password-toggle"
            style={{
              width: '20px',
              height: '20px',
              cursor: 'pointer',
               visibility: !passwordVisible ? "hidden" : "visible"
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
