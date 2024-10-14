  import React, { useEffect, useState } from "react";
  import * as Yup from "yup";
  import { Formik, Form, Field, ErrorMessage } from "formik";
  import { Link, useNavigate } from "react-router-dom";
  import axios from "axios";
  import "./UserRegistration.css";

  interface UserRegistrationValues {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    gender: string;
    hobbies: string[];
    userType: string;
    resumeFile?: File | null;
    profileImage?: File | null;
    agencyId: number | null;
  }

  const UserRegistration: React.FC = () => {
    const navigate = useNavigate();
    const [agencies, setAgencies] = useState<Array<{ id: number; firstName: string; lastName: string }>>([]);
    const [userType, setUserType] = useState<string>("");

    const initialValues: UserRegistrationValues = {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      gender: "",
      hobbies: [],
      userType: "",
      resumeFile: null,
      profileImage: null,
      agencyId: null,
    };

    const validationSchema = Yup.object({
      firstName: Yup.string()
        .max(15, "Must be 15 characters or less")
        .required("Required"),
      lastName: Yup.string()
        .max(15, "Must be 15 characters or less")
        .required("Required"),
      email: Yup.string().email("Invalid email address").required("Required"),
      phone: Yup.string()
        .required("Phone number is required")
        .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
      gender: Yup.string().required("Gender is required"),
      userType: Yup.string().required("User type is required"),
    });

    // Fetch agencies when userType is "Job Seeker"
    useEffect(() => {
      const fetchAgencies = async () => {
        try {
          const response = await axios.get("http://localhost:4001/api/agencies");
          console.log(response.data.agencies);
          
          setAgencies(response.data.agencies); // Assuming response.data is an array of agencies
        } catch (error) {
          console.error("Error fetching agencies:", error);
        }
      };

      if (userType === "1") {
        fetchAgencies();
      }
    }, [userType]);

    const handleSubmit = async (values: UserRegistrationValues) => {
      try {
        const formData = new FormData();
        Object.keys(values).forEach((key) => {
          const value = (values as any)[key];
          formData.append(key, value as any);
        });

        const response = await axios.post("http://localhost:4001/api/register", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log(response)
        alert("Registration successfully done");
        navigate("/login");
      } catch (error) {
        console.error("Error during submission:", error);
        alert("Registration failed. Please try again.");
      }
    };

    const handleUserTypeChange = (e: React.ChangeEvent<HTMLSelectElement>, setFieldValue: Function) => {
      const selectedUserType = e.target.value;
      setFieldValue("userType", selectedUserType);
      setUserType(selectedUserType);
    };

    return (
      <div className="registration-container">
      <div
     
      >
        <h1 >
          Select User
        </h1>
      

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form
             
            >
              <label htmlFor="firstName" className="form-container">
                First Name:
                <Field type="text" name="firstName" className="input-field" />
                <ErrorMessage name="firstName" component="div" className="error" />
              </label>

              <label htmlFor="lastName" className="form-container">
                Last Name:
                <Field type="text" name="lastName" className="input-field" />
                <ErrorMessage name="lastName" component="div" className="error" />
              </label>

              <label htmlFor="email" className="form-container">
                Email:
                <Field type="email" name="email" className="input-field" />
                <ErrorMessage name="email" component="div" className="error" />
              </label>

              <label htmlFor="phone" className="form-container">
                Phone Number:
                <Field name="phone" type="text" className="input-field" />
                <ErrorMessage name="phone" component="div" className="error" />
              </label>

              <div style={{ marginBottom: "10px" }}>
                Gender:
                <div>
                  <label>
                    <Field type="radio" name="gender" value="male" />
                    Male
                  </label>
                  <label>
                    <Field type="radio" name="gender" value="female" />
                    Female
                  </label>
                </div>
                <ErrorMessage name="gender" component="div" className="error" />
              </div>

              <label htmlFor="userType" className="form-container">
                User Type:
                <Field
                  as="select"
                  name="userType"
                  className="input-field"
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    handleUserTypeChange(e, setFieldValue)
                  }
                >
                  <option value="">Select</option>
                  <option value="1">Job Seeker</option>
                  <option value="2">Agency</option>
                </Field>
                <ErrorMessage name="userType" component="div" className="error" />
              </label>

              {values.userType === "1" && (
                <>
                  <div style={{ marginBottom: "10px" }}>
                    Hobbies:
                    <div>
                      <label>
                        <Field type="checkbox" name="hobbies" value="sports" />
                        Sports
                      </label>
                      <label>
                        <Field type="checkbox" name="hobbies" value="dance" />
                        Dance
                      </label>
                      <label>
                        <Field type="checkbox" name="hobbies" value="singing" />
                        Singing
                      </label>
                      <label>
                        <Field type="checkbox" name="hobbies" value="reading" />
                        Reading
                      </label>
                    </div>
                    <ErrorMessage name="hobbies" component="div" className="error" />
                  </div>

                  <label htmlFor="profileImage" className="form-container">
                    Profile Picture:
                    <input
                      type="file"
                      name="profileImage"
                      accept=".png,.jpg,.jpeg"
                      onChange={(event) => {
                        setFieldValue("profileImage", event.currentTarget.files![0]);
                      }}
                    />
                    <ErrorMessage name="profileImage" component="div" className="error" />
                  </label>

                  <label htmlFor="resumeFile" className="form-container">
                    Resume:
                    <input
                      type="file"
                      name="resumeFile"
                      accept=".pdf,.doc,.docx"
                      onChange={(event) => {
                        setFieldValue("resumeFile", event.currentTarget.files![0]);
                      }}
                    />
                    <ErrorMessage name="resumeFile" component="div" className="error" />
                  </label>

                  <label htmlFor="agencyId" className="form-container">
                    Agency:
                    <Field as="select" name="agencyId" className="input-field">
                      <option value="">Select Agency</option>
                      {agencies.map((agency) => (
                        <option key={agency.id} value={agency.id}>
                          {agency.firstName} {agency.lastName}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="agencyId" component="div" className="error" />
                  </label>
                </>
              )}
<center>
              <button type="submit" disabled={isSubmitting} className="submit-btn">
                Register
              </button>
              </center>
              <div >
          <center>
            <Link to="/login">
              <button
              >
                Click to Login
              </button>
            </Link>
          </center>
        </div>
            </Form>
          )}
        </Formik>
      </div>
      </div>
    );
  };

  export default UserRegistration;
