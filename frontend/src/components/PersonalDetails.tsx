 
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import axios from "axios";
import { Local } from "../environment/env";
import "../css/Profile.css"
interface PersonalDetailsProps {
  id?: string;
}

const PersonalDetails: React.FC<PersonalDetailsProps> = ({
  id,
}: PersonalDetailsProps) => {
  const [initialValues, setInitialValues] = useState({
    dob: "",
    gender: "",
    marital_status: "Unmarried",
    ssn: "",
    social: "",
    kids: "",
  });

  useEffect(() => {
    getPersonalDetails();
  }, []);

  const getPersonalDetails = async () => {
    try {
      const response = await axios.get(`${Local.BASE_URL}${Local.GET_PERSONAL_DETAILS}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Personal Details",response.data.data);
      if (response.data.status === 200) {
      
        const data = response.data.data;
        setInitialValues({
          dob: data.dob || "",
          gender: data.gender || "",
          marital_status: data.marital_status || "Unmarried",
          ssn: data.ssn || "",
          social: data.social || "",
          kids: data.kids !== null && data.kids !== undefined ? String(data.kids) : "",
        });

        
      }
    } catch (error: any) {
      console.error("Error Fetching Basic Details", error);
      toast.error("Error Fetching Basic Details", {
        position: "top-right",
        autoClose: 1000,
      });
    }
  };

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: Yup.object({
      dob: Yup.date().required('Date of birth is required').max(new Date(), 'Date of birth cannot be a future date'),
      gender: Yup.string().required("Gender Is Compulsory"),
      marital_status: Yup.string().required("Marital Status Is Compulsory"),
      ssn: Yup.string()
        .matches(/^\d+$/, "Social Security Number must be numbers only")
        .min(5, "Social Security Number must be at least 5 digits")
        .max(9, "Social Security Number cannot exceed 9 digits")
        .required("Social Security Number Is Compulsory"),
      social: Yup.string().required("Social Is Compulsory"),
      kids: Yup.number()
        .typeError("Kids must be a number")
        .min(0, "Kids cannot be negative"),
    }),
    onSubmit: (values) => { 
      updatePersonalDetails(values);
    },
  });

  const updatePersonalDetails = async (values: any) => {
    try {
      const response = await axios.put(`${Local.BASE_URL}${Local.UPDATE_PERSONAL_DETAILS}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.status) {
        toast.success(response.data.message, {
          position: "top-center",
          autoClose: 1000,
        });
      }
    } catch (error: any) {
      console.error(error);
      toast.error("One or more fields are empty", {
        position: "top-center",
        autoClose: 1000,
      });
    }
  };

  return (
    <>
      <div id="basic-details-container">
        <form id="details-form" onSubmit={formik.handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dob">Date of Birth<span style={{color:"red"}}>*</span></label>
              <input
                type="date"
                id="dob"
                name="dob"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.dob}
                onFocus={(e: any) => e.target.showPicker()} style={{color:"#495057"}}
              />
              {formik.touched.dob && formik.errors.dob && (
                <div className="error">{formik.errors.dob}</div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="gender">Gender<span style={{color:"red"}}>*</span></label>
              <select
                id="gender"
                name="gender"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.gender}
              >
                <option value="" disabled>
                  Select Gender
                </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              {formik.touched.gender && formik.errors.gender && (
                <div className="error">{formik.errors.gender}</div>
              )}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="marital_status">Marital Status<span style={{color:"red"}}>*</span></label>
              <select
                id="marital_status"
                name="marital_status"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.marital_status}
              >
                <option value="Unmarried">Unmarried</option>
                <option value="Married">Married</option>
              </select>
              {formik.touched.marital_status &&
                formik.errors.marital_status && (
                  <div className="error">{formik.errors.marital_status}</div>
                )}
            </div>
            <div className="form-group">
              <label htmlFor="ssn">Social Security Number<span style={{color:"red"}}>*</span></label>
              <input
                type="text"
                id="ssn"
                name="ssn"
                placeholder="SSN (Numbers Only)"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.ssn}
              />
              {formik.touched.ssn && formik.errors.ssn && (
                <div className="error">{formik.errors.ssn}</div>
              )}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="social">Social<span style={{color:"red"}}>*</span></label>
              <input
                type="text"
                id="social"
                name="social"
                placeholder="Social"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.social}
              />
              {formik.touched.social && formik.errors.social && (
                <div className="error">{formik.errors.social}</div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="kids">Kids (If Any)</label>
              <input
                type="text"
                id="kids"
                name="kids"
                placeholder="Number of Kids"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.kids}
              />
              {formik.touched.kids && formik.errors.kids && (
                <div className="error">{formik.errors.kids}</div>
              )}
            </div>
          </div>

          <div className="form-row button-row">
            <button type="submit" id="update-button">
              Update
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default PersonalDetails;
