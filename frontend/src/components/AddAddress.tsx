import {Formik, Form, Field, ErrorMessage} from 'formik'
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Local } from '../environment/env';
import { toast } from 'react-toastify';
import api from '../api/axiosInstance';
import * as Yup from 'yup';
import React, { useEffect } from 'react';
const token = localStorage.getItem('token');

const AddAddress = ({ close } : { close: () => void }) => {
  const navigate = useNavigate();

  useEffect(()=>{
    if(!token){
      navigate('/login')
    }
  },[])
  
  const addAddress = async(data:any) =>{
    try{
      const response = await api.post(`${Local.ADD_ADDRESS}`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    }
    catch(err:any){
      toast.error(`${err.response.message}`)
    }
  }

  const addressMutation = useMutation({
    mutationFn: addAddress,
    onSuccess: ()=>{
      toast.success("Address Saved");
      close()
    }
  })

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    street: Yup.string().required("Street is required"),
    district: Yup.string().required("District is required"),
    state: Yup.string().required("State is required"),
    city: Yup.string().required("City is required"),
    phone: Yup.string() .required('Phone Number is required')
    .matches(/^\d+$/, 'Phone Number must be a numeric value') 
    .length(10, 'Phone Number must be exactly 10 digits long') ,
    pincode: Yup.string() .required('Pincode is required')
    .matches(/^\d+$/, 'Phone Number must be a numeric value')
    .length(6, 'Phone Number must be exactly 6 digits long') ,
  })

  const addressHandler = async (values: any) => {
    try {
      await addressMutation.mutateAsync(values);  
      console.log("Address Saved------->", addressMutation.data);

      window.location.reload();
    } catch (err) {
      console.error("Error saving address:", err);
      toast.error("Error saving address.");
    }
  };
  
  return (
    <Formik
    initialValues={{
      title:"",
      street: "",
      district: "",
      state: "",
      city: "",
      phone: "",
      pincode: "",
      }}
      validationSchema={validationSchema}
      onSubmit={addressHandler}
    >
      {()=>(
        <>
              <Form>
              <div className="form-group1"> 
                  <label>Title<span className='star'>*</span></label>
                  <Field type="title" name="title" className="form-control1" placeholder="Enter Address Title"/>
                  <ErrorMessage name="title" component="div" className="text-danger1"/>
                </div>

                <div className="form-group1"> 
                  <label>Street<span className='star'>*</span></label>
                  <Field type="text" name="street" className="form-control1" placeholder="Enter Your Street"/>
                  <ErrorMessage name="street" component="div" className="text-danger1"/>
                </div>

                <div className="form-group1">
                  <label>City<span className='star'>*</span></label>
                  <Field type="text" name="city" className="form-control1" placeholder="Enter Your City"/>
                  <ErrorMessage name="city" component="div" className="text-danger1"/>
                </div>
            

                <div className="form-group1">
                  <label>District<span className='star'>*</span></label>
                  <Field type="text" name="district" className="form-control1" placeholder="Enter Your District"/>
                  <ErrorMessage name="district" component="div" className="text-danger1"/>
                </div>
             
                
                <div className="form-group1">
                  <label>State<span className='star'>*</span></label>
                  <Field type="text" name="state" className="form-control1" placeholder="Enter Your State"/>
                  <ErrorMessage name="state" component="div" className="text-danger1"/>
                </div>
                                  
                <div className="form-group1">
                  <label>Phone Number<span className='star'>*</span></label>
                  <Field type="text" name="phone" maxLength={10} className="form-control1" placeholder="Enter Your Phone Number"/>
                  <ErrorMessage name="phone" component="div" className="text-danger1"/>
                </div>
           
                
                <div className="form-group1">
                  <label>Pincode<span className='star'>*</span></label>
                  <Field type="text" name="pincode" maxLength={6} className="form-control1" placeholder="Enter Your Pincode"/>
                  <ErrorMessage name="pincode" component="div" className="text-danger1"/>
                </div>
                
                <button type="submit" className='btn btn-outline-dark'>Submit</button>
              </Form>
        </>
      )}
    </Formik>
  )
}

export default AddAddress;