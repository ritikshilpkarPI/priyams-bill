import { useState } from "react";
import axios from "axios";
axios.defaults.withCredentials = true;

const Login = ({ history }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const loginUser = async (e) => {
    e.preventDefault();

    const payload = { email, password };

    const response = await axios.post("/api/auth/login", payload);
    const status = response.data.status;
    const message = response.data.message;
    console.log(response, status, message);

    if (status === false && message === "invalid email") {
      setErrorMsg("Invalid email");
    } else if (status === false && message === "wrong password") {
      setErrorMsg("wrong password");
    } else if (status === true && message === "login successfull") {
      setErrorMsg("login successfull");
      localStorage.setItem("priyam-store", email);
      history.push("/billing");
    }
  };

  // useEffect(() => {
  //     if (localStorage.getItem('priyam-store')) {
  //         history.push('/billing');
  //     };
  //     // eslint-disable-next-line
  // }, []);

  return (
    <div className="login-card">
      <form onSubmit={loginUser}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
