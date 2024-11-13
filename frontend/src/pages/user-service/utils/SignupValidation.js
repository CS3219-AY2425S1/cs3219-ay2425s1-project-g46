// Author(s): Andrew
function Validation(values) {

  let error = {}
  const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  // const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/
  const password_pattern = /^.{3,}$/

  if (values.name === "") {
    error.name = "Name should not be empty"
  } else {
    error.name = ""
  }

  if (values.email === "") {
    error.email = "Email should not be empty"
  } else if (!email_pattern.test(values.email)) {
    error.email = "Email didn't match"
  } else {
    error.email = ""
  }

  if (values.password === "") {
    error.password = "Password should not be empty"
  } else if (!password_pattern.test(values.password)) {
    error.password = "Password must be at least 3 characters."
  } else {
    error.password = ""
  }


  if (values.confirmPassword === "") {
    error.confirmPassword = "Password should not be empty"
  } else if (!password_pattern.test(values.confirmPassword)) {
    error.confirmPassword = "Password doesn't match"
  } else if (values.password !== values.confirmPassword) {
    error.confirmPassword = "Password doesn't match"
  } else {
    error.confirmPassword = ""
  }

  return error;

}

export default Validation;