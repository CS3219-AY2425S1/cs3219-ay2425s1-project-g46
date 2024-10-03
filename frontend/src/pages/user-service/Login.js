// Author(s): Xinyi
import React, { useState } from "react";
import "./styles/Login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";

// reference from https://clerk.com/blog/building-a-react-login-page-template
function Login() {

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [emailError, setEmailError] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const [loginError, setLoginError] = useState("");

	const navigate = useNavigate();

	const login = (event) => {
		// prevent page reload
		event.preventDefault();

		// set initial error values to empty
		setEmailError("");
		setPasswordError("");
		setLoginError("");

		// simple validation, check if user has entered both fields
		// to be modified/changed
		if ("" === email) {
			setEmailError("Email is empty");
			return;
		}

		if ("" === password) {
			setPasswordError("Password is empty");
			return;
		}

		const reqBody = {
			email: email,
			password: password
		}

		axios.post(`http://localhost:5000/user/login`, reqBody).then((response) => {
			// store token, email and username into session storage upon successful login
			const token = response.data.token;
			const email = response.data.email;
			const username = response.data.username;

			sessionStorage.setItem("token", token);
			sessionStorage.setItem("email", email);
			sessionStorage.setItem("username", username);

			// route user to homepage after login (to be modified/changed)
			navigate("/");
		}).catch((error) => {
			console.log(error);
			// if login error, display error message
			setLoginError(error.response.data.message);
			return
		});
	}

	return (
		<div id="loginPageContainer">
			<NavBar />
			{/* div containing login form */}
			<div id="loginFormContainer">
				{/* title of form */}
				<h1>Login</h1>
				<label className="errorLabel">{loginError}</label>
				{/* login form */}
				<form id="loginForm" onSubmit={login}>
					<div className="formGroup">
						<label for="email" className="inputLabel">Email</label>
						<input
							id="email"
							value={email}
							placeholder="Enter your email here"
							onChange={(email) => setEmail(email.target.value)}
							className="inputBox"
						/>
						<label className="errorLabel">{emailError}</label>
					</div>
					<div className="formGroup">
						<label for="password" className="inputLabel">Password</label>
						<input
							id="password"
							type="password"
							value={password}
							placeholder="Enter your password here"
							onChange={(password) => setPassword(password.target.value)}
							className="inputBox"
						/>
						<label className="errorLabel">{passwordError}</label>
					</div>
					{/* login button */}
					<div id="buttonContainer">
						<button type="submit">Login</button>
					</div>
				</form>
			</div>
		</div>
	);

}

export default Login;