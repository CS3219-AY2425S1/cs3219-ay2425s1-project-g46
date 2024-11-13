// Author(s): Andrew
function Validation(values) {

  let error = {}
  // const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/
  const password_pattern = /^.{3,}$/

  if (values.oldPassword === "") {
    error.oldPassword = "Old Password should not be empty"
  } else {
    error.oldPassword = ""
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