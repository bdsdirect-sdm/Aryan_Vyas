// eslint-disable-next-line no-unused-vars
import React,{useEffect,useState} from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom';

const Profile = () => {
const[profile,setProfile]=useState(null);
const {id}= useParams()
useEffect(()=>{
axios.get(`http://localhost:4003/users/profile/${id}`).then(response=>{
    setProfile(response.data);
});
},[]);
if(!profile)return<p>Loding...</p>
return(
    <div>
        <h1>Profile</h1>
        <p>First Name:{profile.firstName}</p>
        <p>Last Name:{profile.lastName}</p>
        <p>Email:{profile.email}</p>
        <p>DOB:{profile.dob}</p>
        <p>Gender:{profile.gender}</p>
        <p>Phone Number:{profile.phoneNumber}</p>
    </div>
);
}

export default Profile