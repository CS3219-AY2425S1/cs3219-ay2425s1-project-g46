// Author(s): Andrew
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Validation from "./utils/SignupValidation"
import axios from "axios";
import "./styles/Signup.css";
import NavBar from "../../components/NavBar";

function Signup() {
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({})

  const handleInput = (event) => {
    setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));

  };

  const naviagte = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = Validation(values);
    setErrors(validationErrors);

    if (values.name !== "" &&
      values.email !== "" &&
      values.password !== "" &&
      values.confirmPassword !== "" &&
      validationErrors.name === "" &&
      validationErrors.email === "" &&
      validationErrors.password === "" &&
      validationErrors.confirmPassword === "") {
      axios.post("http://localhost:5001/user/signup", values)
        .then(res => {
          naviagte('/user/login');
          setValues({
            name: '',
            email: '',
            password: ''
          });
        })
        .catch(err => {
          if (err.response && err.response.data.message) {
            setErrors(preErrors => ({ ...preErrors, email: err.response.data.message }));
          } else {
            console.log(err);
          }
        });
    }
  };


  return (
    <div >
      <NavBar />
      <div id="signupFormContainer">
        <h1>Sign-up</h1>
        <form action='' onSubmit={handleSubmit}>
          <div className='formGroup'>
            <label htmlFor='name' className='inputLabel'><strong>Name</strong></label>
            <input type='text' placeholder='Your username' name='name' value={values.name} onChange={handleInput} className='inputBox' />
            {errors.name && <span className='errorLabel'> {errors.name}</span>}
          </div>
          <div className='formGroup'>
            <label htmlFor='email' className='inputLabel'><strong>Email</strong></label>
            <input type='email' placeholder='example@example.com' name='email' value={values.email} onChange={handleInput} className='inputBox' />
            {errors.email && <span className='errorLabel'> {errors.email}</span>}
          </div>
          <div className='formGroup'>
            <label htmlFor='password' className='inputLabel'><strong>Password</strong></label>
            <input type='password' placeholder='Password' name='password' value={values.password} onChange={handleInput} className='inputBox' />
            {errors.password && <span className='errorLabel'> {errors.password}</span>}
          </div>
          <div className='formGroup'>
            <label htmlFor='confirmPassword' className='inputLabel'><strong>Confirm Password</strong></label>
            <input type='password' placeholder='Confirm Password' name='confirmPassword' value={values.confirmPassword} onChange={handleInput} className='inputBox' />
            {errors.confirmPassword && <span className='errorLabel'> {errors.confirmPassword}</span>}
          </div>
          <div class="registerButton">
            <button class="register-button">Register</button>
          </div>

        </form>
      </div>

    </div>
  )
}

export default Signup