import { useState, useEffect } from "react";
import { Axios } from "../utils/axios";
// axios.defaults.withCredentials = true;

const Login = ({ history }) => {
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const loginUser = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setErrorMsg("username or password can't be blank");
      return;
    }

    const payload = { username: username.toLowerCase(), password };
    try {
      const response = await Axios.request({
        url: "/api/auth/login",
        method: "post",
        data: { ...payload },
        headers: {
          Cookie: "",
        },
      });
      const status = response.data.status;
      const message = response.data.message;

      if (status === false && message === "invalid username") {
        setErrorMsg("Invalid username");
      } else if (status === false && message === "wrong password") {
        setErrorMsg("wrong password");
      } else if (status === true && message === "login successfull") {
        setErrorMsg("login successfull");
        localStorage.setItem(
          "priyam-store",
          JSON.stringify({
            name: response.data.name,
            username: username.toLowerCase(),
            role: response.data.role,
            authtoken: response.data.authtoken,
          })
        );
        history.push("/billing");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("priyam-store")) {
      history.push("/billing");
    }
    // eslint-disable-next-line
  }, []);

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
        <p id="error-msg" style={{ textAlign: "left" }}>
          {errorMsg}
        </p>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
