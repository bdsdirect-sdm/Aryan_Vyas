import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { Local } from "../environment/env";
import api from "../api/axiosInstance";
import "./UpdateAppointment.css";
import { IoIosArrowBack } from "react-icons/io";

const UpdateAppointment: React.FC = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [initialValues, setInitialValues] = useState({
    appointmentDate: "",
    appointmentType: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [patientName, setPatientName] = useState<{ firstname: string; lastname: string }>({
    firstname: "",
    lastname: "",
  });

  const validationSchema = Yup.object({
    appointmentDate: Yup.date().required("Appointment date is required"),
    appointmentType: Yup.string()
      .oneOf(["Consultation", "Surgery"], "Invalid appointment type")
      .required("Appointment type is required"),
  });

  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      try {
        const response = await api.get(
          `${Local.VIEW_APPOINTMENT}/${appointmentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const { appoinment } = response.data;
        const { firstname, lastname } = response.data.patient;
      
        setInitialValues({
          appointmentDate: appoinment.date || "",
          appointmentType: appoinment.type || "",
        });

        // Store patient name
        setPatientName({ firstname, lastname });
      } catch (error) {
        toast.error("Failed to fetch appointment details");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchAppointmentDetails();
    } else {
      navigate("/login");
    }
  }, [appointmentId, token, navigate]);

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      const response = await api.put(
        `${Local.UPDATE_APPOINTMENT}/${appointmentId}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.message || "Appointment updated successfully");
      navigate(-1);
    } catch (error) {
      toast.error("Failed to update appointment");
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
    <div className="update-appointment-container">
      <div className="back1 fw-bold" onClick={() => navigate(-1)}><IoIosArrowBack />Back</div>
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="form-group">
              <div className='fieldflex row'>
              <div className="form-field1 col">
  <label className="form-label" style={{color:"black"}}>Patient Name</label>
  <div className="name-box">
    {patientName.firstname} {patientName.lastname}
  </div>
</div>
                <div className="form-field1 col">
                  <label htmlFor="appointmentDate" className="add-appointment-lable" style={{color:"black"}}>Appointment Date<span className="star">*</span></label>
                  <Field type="date" name="appointmentDate" className="form-select1" />
                  <ErrorMessage name="appointmentDate" component="div" className="text-danger" />
                </div>
                <div className="form-field1 col">
                  <label htmlFor="appointmentType" className="add-appointment-lable" style={{color:"black"}}>Appointment Type<span className="star">*</span></label>
                  <Field as="select" name="appointmentType" className="form-select1">
                    <option value="">Select</option>
                    <option value="Consultation">Consultation</option>
                    <option value="Surgery">Surgery</option>
                  </Field>
                  <ErrorMessage name="appointmentType" component="div" className="text-danger" />
                </div>
              </div>
            </div>
            <div className="btn-subcancel">
              <button type="button" onClick={() => navigate(-1)} className="btn btn-cancel1">Cancel</button>
              <button type="submit" className="appointment-btn" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Appointment"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default UpdateAppointment;
