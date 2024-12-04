/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { Local } from "../environment/env";
import api from "../api/axiosInstance";
import "./UpdatePatientDetails.css";
import { IoIosArrowBack } from "react-icons/io";
import moment from "moment";

const UpdatePatientDetails: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [initialValues, setInitialValues] = useState({
    firstname: "",
    lastname: "",
    gender: "",
    email: "",
    dob: "",
    disease: "",
    phoneNumber: "",
    laterality: "",
    timing: "",
    speciality: "",
    companyName: "",
    policyStartingDate: "",
    policyExpireDate: "",
    notes: "",
    referedto:"",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [patientName, setPatientName] = useState<{ firstname: string; lastname: string; }>({
    firstname: "",
    lastname: "",
  });

  const validationSchema = Yup.object({
    firstname: Yup.string()
    .matches(/^[A-Za-z]+$/, 'First Name must only contain letters')
    .required('First Name is required'),
  lastname: Yup.string()
    .matches(/^[A-Za-z]+$/, 'Last Name must only contain letters')
    .required('Last Name is required'),
    gender: Yup.string().required("Gender Is required"),
    // email: Yup.string().email("Invalid email format").required("Email is required"),
    dob: Yup.date().required('DOB is required').max(new Date(), 'Date of birth cannot be a future date'),
    disease: Yup.string().required("Disease is required"),
    phoneNumber: Yup.string()
    .required('Phone Number is required')
    .matches(/^\d+$/, 'Phone Number must be a numeric value')
    .length(10, 'Phone Number must be exactly 10 digits long') ,
    laterality: Yup.string().required("Laterality is required"),
    timing: Yup.string().required("Timing is required"),
    speciality: Yup.string().required("Speciality is required"),
    companyName: Yup.string().required("Company name is required"),
    policyStartingDate: Yup.date().required("Policy Starting Date Is Required").typeError('Invalid date format').max(new Date(), 'Policy Starting Date cannot be a future date'),
    policyExpireDate: Yup.date()
      .required('Policy Ending Date is required')
      .min(new Date(), 'Policy Ending Date must be a future date')
      .typeError('Invalid date format'),
    notes: Yup.string().required("Note Is required"),
  });

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const response = await api.get(
          `${Local.GET_PATIENT_DETAILS}/${patientId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // console.log("updatedetailes>>>>>>>>>a", response.data);

       
        const { patientDetails } = response.data;
        console.log("gender", patientDetails.referedto.firstname);
        console.log("patientdetails>>>>",patientDetails)
        const { firstname, lastname } = patientDetails;
        console.log("moment(patientDetails.dob).format(", moment(patientDetails.dob).format("DD/MM/YYYY"))

        setInitialValues({
          firstname: patientDetails.firstname || "",
          lastname: patientDetails.lastname || "",
          gender: patientDetails.gender || "",
          email: patientDetails.email,
          dob: moment(patientDetails.dob).format("YYYY-MM-DD") || "",
          disease: patientDetails.disease || "",
          phoneNumber: patientDetails.phoneNumber || "",
          laterality: patientDetails.laterality || "",
          timing: patientDetails.timing || "",
          speciality: patientDetails.speciality || "",
          companyName: patientDetails.companyName || "",
          policyStartingDate: moment(patientDetails.policyStartingDate).format("YYYY-MM-DD") || "",
          policyExpireDate: moment(patientDetails.policyExpireDate).format("YYYY-MM-DD") || "",
          notes: patientDetails.notes || "",
          referedto: `${patientDetails.referedto?.firstname || ""} ${patientDetails.referedto?.lastname || ""}`
,
        });

        // Store patient name
        setPatientName({ firstname, lastname });
      } catch (error) {
        toast.error("Failed to fetch patient details");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchPatientDetails();
    } else {
      navigate("/login");
    }
  }, [patientId, token, navigate]);

  const handleSubmit = async (values: typeof initialValues) => {
    console.log("upppppppppppppdatttt>>>>>>>>>>>>>.........", values);
    try {
      const response = await api.put(
        `${Local.UPDATE_PATIENT_DETAILS}/${patientId}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("upppppppppppppdatttt>>>>>>>>>>>>>.........", response);
      toast.success(response.data.message || "Patient details updated successfully");
      navigate(-1); // Go back to the previous page
    } catch (error) {
      toast.error("Failed to update patient details");
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    );
  }

  return (
    <div className="update-patient-details-container">
      <div className="back1 fw-bold" onClick={() => navigate(-1)}>
        <IoIosArrowBack /> Back
      </div>
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="update-patient-container">
              <div className="update-patient-form">
                <h5>Edit Patient Details</h5>
                <div className="update-details row">
                  <div className="form-group col">
                    <label
                      htmlFor="dob"
                      className="add-appointment-lable"
                      style={{ color: "black" }}
                    >
                      Date of Birth<span className="star">*</span>
                    </label>
                    <Field
                      type="date"
                      name="dob"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="dob"
                      component="div"
                      className="text-danger"
                    />
                  </div>

                  <div className="form-group col">
                    <label
                      htmlFor="email"
                      className="add-appointment-lable"
                      style={{ color: "black" }}
                    >
                      Email
                    </label>
                    <Field
                      type="email"
                      name="email"
                      className="form-control"
                      disabled
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-danger"
                    />
                  </div>


                  <div className="form-group col">
                    <label
                      htmlFor="phoneNumber"
                      className="add-appointment-lable"
                      style={{ color: "black" }}
                    >
                      Phone Number
                    </label>
                    <Field
                      type="text"
                      name="phoneNumber"
                      className="form-control"
                      maxLength={10}
                    />
                    <ErrorMessage
                      name="phoneNumber"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                </div>



                <div className="update-details row">

                  <div className="form-group col">
                    <label
                      htmlFor="firstname"
                      className="add-appointment-lable"
                      style={{ color: "black" }}
                    >
                      First Name
                    </label>
                    <Field
                      type="text"
                      name="firstname"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="firstname"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                  <div className="form-group col">
                    <label
                      htmlFor="lastname"
                      className="add-appointment-lable"
                      style={{ color: "black" }}
                    >
                      Last Name
                    </label>
                    <Field
                      type="text"
                      name="lastname"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="lastname"
                      component="div"
                      className="text-danger"
                    />
                  </div>

                  <div className="form-group col">
                    <label
                      htmlFor="gender"
                      className="add-appointment-lable"
                      style={{ color: "black" }}
                    >
                      Gender
                    </label>
                    <Field as="select" name="gender" className="form-control">
                      {/* <option value="">Select</option> */}
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </Field>
                    <ErrorMessage
                      name="gender"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                </div>

                <h5>Reason of consult</h5>
                <div className="fieldflex row">

                  <div className="form-group col">
                    <label
                      htmlFor="disease"
                      className="add-appointment-lable"
                      style={{ color: "black" }}
                    >
                      Reason
                    </label>
                    <Field as="select" name="disease" className="form-control">
                      {/* <option value="">Select</option> */}
                      <option value="Color Blindness">Color Blindness</option>
                      <option value="Dry Eye">Dry Eye</option>
                      <option value="Floaters">Floaters</option>
                      <option value="Amblyopia (Lazy Eye)">Amblyopia (Lazy Eye)</option>
                      <option value="Astigmatism">Astigmatism</option>
                    </Field>
                    <ErrorMessage
                      name="disease"
                      component="div"
                      className="text-danger"
                    />
                  </div>

                  <div className="form-group col">
                    <label
                      htmlFor="laterality"
                      className="add-appointment-lable"
                      style={{ color: "black" }}
                    >
                      Laterality
                    </label>
                    <Field as="select" name="laterality" className="form-control">
                      {/* <option value="">Select</option> */}
                      <option value="Left">Left</option>
                      <option value="Right">Right</option>
                      <option value="Both">Both</option>
                    </Field>
                    <ErrorMessage
                      name="laterality"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                  <div className="form-group col">
                  </div>
                </div>

                <div className="fieldflex row">
                  <div className="form-group col">
                    <label
                      htmlFor="timing"
                      className="add-appointment-lable"
                      style={{ color: "black" }}
                    >
                      Timing
                    </label>
                    <Field
                      as="select"
                      name="timing"
                      className="form-control">
                      {/* <option value="">Select</option> */}
                      <option value="routine">Routine(Within 1 month)</option>
                      <option value="urgent">Urgent(Within 1 Week)</option>
                      <option value="emergent">Emergent(Within 24 hours or less)</option>
                    </Field>

                    <ErrorMessage
                      name="timing"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                  <div className="form-group col">
                  </div>
                  <div className="form-group col">
                  </div>
                </div>

                <h5>Referral MD/OD</h5>
                <div className="fieldflex row">
                  <div className="form-group col">
                    <label
                      htmlFor="referedto"
                      className="add-appointment-lable"
                      style={{ color: "black" }}
                    >
                      MD/OD Name
                    </label>
                    <Field
                      type="text"
                      name="referedto"
                      className="form-control"
                      disabled
                    />
                    <ErrorMessage
                      name="referedto"
                      component="div"
                      className="text-danger"
                    />
                  </div>

                  

                  <div className="form-group col">
                    <label
                      htmlFor="speciality"
                      className="add-appointment-lable"
                      style={{ color: "black" }}
                    >
                      Speciality
                    </label>
                    <Field
                      as="select"
                      name="timing"
                      className="form-control">
                      {/* <option value="">Select</option> */}
                      <option value="opticians">Opticians</option>
                      <option value="optometrists">Optometrists</option>
                      <option value="ophthalmologists">Ophthalmologists</option>
                    </Field>
                    <ErrorMessage
                      name="speciality"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                  <div className="form-group col">
      
                  </div>
                  </div>

<h5>Insurance Details</h5>
                  <div className="fieldflex row">
                  <div className="form-group col">
                    <label
                      htmlFor="companyName"
                      className="add-appointment-lable"
                      style={{ color: "black" }}
                    >
                      Company Name
                    </label>
                    <Field
                      as="select"
                      name="companyName"
                      className="form-control">
                      <option value="">Select</option>
                      <option value="Ayushman Baharat">Ayushman Baharat</option>
                      <option value="LIC">LIC</option>
                      <option value="Bharat Bima">Bharat Bima</option>
                    </Field>
                    <ErrorMessage
                      name="companyName"
                      component="div"
                      className="text-danger"
                    />
                  </div>
               
                  <div className="form-group col">
                    <label
                      htmlFor="policyStartingDate"
                      className="add-appointment-lable"
                      style={{ color: "black" }}
                    >
                      Policy Start Date
                    </label>
                    <Field
                      type="date"
                      name="policyStartingDate"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="policyStartingDate"
                      component="div"
                      className="text-danger"
                    />
                  </div>

                  <div className="form-group col">
                    <label
                      htmlFor="policyExpireDate"
                      className="add-appointment-lable"
                      style={{ color: "black" }}
                    >
                      Policy Expiry Date
                    </label>
                    <Field
                      type="date"
                      name="policyExpireDate"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="policyExpireDate"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                  </div>
             
              <div className="fieldflex row" >
              <div className="form-group col">
                  <label
                    htmlFor="notes"
                    
                    style={{ color: "black" }}
                  >
                    Note
                  </label>
                  <Field
                    as="textarea"
                    name="notes"
                    className="form-control"
                    
                  />
                  <ErrorMessage
                    name="notes"
                    component="div"
                    className="text-danger"
                  />
                </div>
</div>
              
              <div className="btn-subcancel">
              <button
                  type="submit"
                  className="appointment-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="btn btn-cancel1"
                >
                  Cancel
                </button>
              </div>
            </div>
                </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default UpdatePatientDetails;
