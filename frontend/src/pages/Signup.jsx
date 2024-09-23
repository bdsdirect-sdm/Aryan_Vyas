// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    dob: "",
    gender: "",
    phoneNumber: "",
    terms: false,
  });
  const [error, setError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password != form.confirmPassword){
      error("Please Enter The Same Password");
    return;
    }
    await axios.post("http://localhost:4003/users/signup",form).then((res)=>{
      navigate(`/profile/${res.data.user.id}`);
    }).catch((err)=>{
      console.log(err);
      setError("Error Creating Account");
    })
};

const handleChange = (e) => {
  setForm({ ...form, [e.target.name]: e.target.value });
};
return (
  <form onSubmit={handleSubmit}>
    <input name="firstName" placeholder="Firstname" onChange={handleChange} required/>
    <input name="lastName" placeholder="lastname" onChange={handleChange} required/>
    <input name="email" placeholder="Email" type="email" onChange={handleChange} required/>
    <input name="password" placeholder="Password" type="password" onChange={handleChange} required/>
    <input name="confirmPassword" placeholder="ConfirmPassword" type="password" onChange={handleChange} />
    <input name="phoneNumber" placeholder="PhoneNumber" type="tel" pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}" onChange={handleChange} required/>
    <input name="dob" placeholder="DOB" type="date" onChange={handleChange} required/>
    <div>
        <input type="radio" name="gender" value="male" onChange={handleChange}/>Male
        <input type="radio" name="gender" value="female" onChange={handleChange}/>Female
    </div>
    <div>
        <input type="checkbox" name="terms" onChange={handleChange}/>T&C 
    </div>
    <button type="submit">Submit</button>
    {error && <p>{error}</p>}
  </form>
);
};
export default Signup;
