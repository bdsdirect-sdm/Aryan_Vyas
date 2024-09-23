/* eslint-disable no-unused-vars */
/* eslint-disable-next-line no-unused-vars */
import React,{useState,useEffect} from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
const UpdateProfile = () => {
const [form,setForm]=useState({
    firstName:"",
    lastName:"",
    email:"",
    dob:"",
    phoneNumber:"",
    gender:"",
});
const {id}= useParams()
useEffect(()=>{
    axios.get(`http://localhost:4003/users/profile/${id}`).then(response=>{
        setForm(response.data);
    });
},[]);
const handleSubmit=async(e)=>{
    e.preventDefault();
    try {
        await axios.put(`http://localhost:4003/users/update/${form.id}`,form);
    alert("Profile Updated Successfully");
}catch(error){
    console.error("Error Updating Profile");
}
};
const handleChange=(e)=>{
    setForm({...form,[e.target.name]:e.target.value});
};
return(
<form onSubmit={handleSubmit}>
<input name="firstName"  value={form.firstName} onChange={handleChange} placeholder='First Name' required/>
<input name="lastName" value={form.lastName} onChange={handleChange} placeholder='Last Name' required/>
<input name="email" type='email' value={form.email} onChange={handleChange} placeholder="Email" required/>
<input name="dob" type="date" value={form.dob} onChange={handleChange} placeholder='DOB' required/>
<input name="phoneNumber" type="number" value={form.phoneNumber} onChange={handleChange} placeholder='Phone Number' required/>
<div>
<input  name="gender" type="radio" value="male"  onChange={handleChange} />Male
<input  name="gender" type="radio" value="female"  onChange={handleChange}/>Female
</div>
<button type='submit'>Update your profile</button>
</form>
);
}

export default UpdateProfile