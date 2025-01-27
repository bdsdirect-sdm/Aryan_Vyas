/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import { toast } from "react-toastify";
import { Local } from "../environment/env";
import * as Yup from "yup";
import "../css/Preferences.css";

const Preferences = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [preferences, setPreferences] = useState<any>({});

  useEffect(() => {
    getPreferencesDetail();
  }, []);

  const getPreferencesDetail = async () => {
    try {
      const response = await axios.get(
        `${Local.BASE_URL}${Local.GET_PREFERENCES}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Preferences Details", response.data);
      if (response.status) {
        const data = response.data.data;
        setPreferences(data);
      }
    } catch (error: any) {
      console.error(error);
      toast.error("Preferences Details Cannot We Fetched At The Moment", {
        position: "top-right",
        autoClose: 1000,
      });
    }
  };

  const postPreferences = async (values: any) => {
    try {
      const response = await axios.put(
        `${Local.BASE_URL}${Local.UPDATE_PREFERENCES}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 1000,
        });
      }
    } catch (error: any) {
      console.error(error.response.data.message);
      toast.error("Preferences Cannot We Post At The Moment", {
        position: "top-right",
        autoClose: 1000,
      });
    }
  };
  const validationSchema = Yup.object().shape({
    breakfast: Yup.string().required("Breakfast Time Is Compulsory"),
    lunch: Yup.string().required("Lunch Time Is Compulsory"),
    dinner: Yup.string().required("Dinner Time Is Compulsory"),
    wakeTime: Yup.string().required("Wake Time Is Compulsory"),
    bedTime: Yup.string().required("Bed Time Is Compulsory"),
    weight: Yup.string().required("Weight Is Compulsory"),
    height: Yup.string().required("Height Is Compulsory"),
    bloodGlucose: Yup.string().required("BloodGlucose Is Compulsory"),
    cholesterol: Yup.string().required("Cholesterol Is Compulsory"),
    bloodPressure: Yup.string().required("Blood Pressure Is Compulsory"),
    distance: Yup.string().required("Distance Is Compulsory"),
  });

  return (
    <div className="dashboard-wrapper">
      <div className="user-wrapper">
        <div id="preferences-header">
          <img
            src="../../public/images/left-arrow.png"
            alt=""
            id="left-arrow"
            onClick={() => navigate(`/user`)}
          />
          <h2>Preferences</h2>
        </div>
      </div>

      {preferences && (
        <Formik
          enableReinitialize={true}
          initialValues={{
            language: preferences.language || "English",
            breakfast: preferences.breakfast || "",
            lunch: preferences.lunch || "",
            dinner: preferences.dinner || "",
            wakeTime: preferences.wakeTime || "",
            bedTime: preferences.bedTime || "",
            weight: preferences.weight || "",
            height: preferences.height || "",
            bloodGlucose: preferences.bloodGlucose || "",
            cholesterol: preferences.cholesterol || "",
            bloodPressure: preferences.bloodPressure || "",
            distance: preferences.distance || "",
            systemEmails: preferences.systemEmails || false,
            memberServiceEmails: preferences.memberServiceEmails || false,
            sms: preferences.sms || false,
            phoneCall: preferences.phoneCall || false,
            post: preferences.post || false,
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            postPreferences(values);
          }}
        >
          {({ values, setFieldValue, handleChange }) => (
            <Form>
              <div id="preferences-container" style={{ marginBottom: "39px" }}>
                <div id="preference-form">
                  <div id="preference-details">
                    <div id="preference-1">
                      <label htmlFor="language">Language</label>
                      <br />
                      <Field
                        as="select"
                        name="language"
                        id="language"
                        style={{ width: 405 }}
                        onChange={(e: any) => {
                          handleChange(e);
                          setFieldValue("language", e.target.value);
                          setPreferences((prev: any) => ({
                            ...prev,
                            language: e.target.value,
                          }));
                        }}
                      >
                        <option value="English">English</option>
                        <option value="Hindi">Hindi</option>
                      </Field>
                      <ErrorMessage
                        name="language"
                        component="div"
                        className="error"
                      />
                    </div>
                    <div id="preference-2">
                      <label htmlFor="breakfast">
                        Breakfast<span style={{ color: "red" }}>*</span>
                      </label>
                      <br />
                      <Field
                        type="time"
                        name="breakfast"
                        id="breakfast"
                        style={{ width: 405 }}
                        value={values.breakfast || "00:00"}
                        onChange={(e: any) => {
                          handleChange(e);
                          setFieldValue("breakfast", e.target.value);
                          setPreferences((prev: any) => ({
                            ...prev,
                            breakfast: e.target.value,
                          }));
                        }}
                      />
                      <ErrorMessage
                        name="breakfast"
                        component="div"
                        className="error"
                      />
                    </div>
                  </div>
                  <div id="preference-details">
                    <div id="preference-1">
                      <label htmlFor="lunch">
                        Lunch<span style={{ color: "red" }}>*</span>
                      </label>
                      <br />
                      <Field
                        type="time"
                        name="lunch"
                        className="Lunch"
                        id="Lunch"
                        value={values.lunch || "00:00"}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          handleChange(e);
                          setFieldValue("lunch", e.target.value);
                          setPreferences((prev: any) => ({
                            ...prev,
                            lunch: e.target.value,
                          }));
                        }}
                      />
                      <ErrorMessage
                        name="lunch"
                        component="div"
                        className="error"
                      />
                    </div>
                    <div id="preference-2">
                      <label htmlFor="dinner">
                        Dinner<span style={{ color: "red" }}>*</span>
                      </label>
                      <br />
                      <Field
                        type="time"
                        name="dinner"
                        className="Dinner"
                        id="Dinner"
                        value={values.dinner || "00:00"}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          handleChange(e);
                          setFieldValue("dinner", e.target.value);
                          setPreferences((prev: any) => ({
                            ...prev,
                            dinner: e.target.value,
                          }));
                        }}
                      />
                      <ErrorMessage
                        name="dinner"
                        component="div"
                        className="error"
                      />
                    </div>
                  </div>
                  <div id="preference-details">
                    <div id="preference-1">
                      <label htmlFor="wakeTime">
                        Wake Time<span style={{ color: "red" }}>*</span>
                      </label>
                      <br />
                      <Field
                        type="time"
                        name="wakeTime"
                        className="wakeTime"
                        id="wakeTime"
                        value={values.wakeTime || "00:00"}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          handleChange(e);
                          setFieldValue("wakeTime", e.target.value);
                          setPreferences((prev: any) => ({
                            ...prev,
                            wakeTime: e.target.value,
                          }));
                        }}
                      />
                      <ErrorMessage
                        name="wakeTime"
                        component="div"
                        className="error"
                      />
                    </div>
                    <div id="preference-2">
                      <label htmlFor="bedTime">
                        Bed Time<span style={{ color: "red" }}>*</span>
                      </label>
                      <br />
                      <Field
                        type="time"
                        name="bedTime"
                        className="bedTime"
                        id="bedTime"
                        value={values.bedTime || "00:00"}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          handleChange(e);
                          setFieldValue("bedTime", e.target.value);
                          setPreferences((prev: any) => ({
                            ...prev,
                            bedTime: e.target.value,
                          }));
                        }}
                      />
                      <ErrorMessage
                        name="bedTime"
                        component="div"
                        className="error"
                      />
                    </div>
                  </div>
                  <div id="radio-group">
                    <div className="radio-column">
                      <label htmlFor="weight">
                        Weight<span style={{ color: "red" }}>*</span>
                      </label>
                      <div className="radio-options">
                        <div className="radio-option">
                          <Field
                            type="radio"
                            id="weight-Kg"
                            name="weight"
                            value="Kg"
                            checked={values.weight === "Kg"}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              handleChange(e);
                              setFieldValue("weight", e.target.value);
                              setPreferences((prev: any) => ({
                                ...prev,
                                weight: e.target.value,
                              }));
                            }}
                          />
                          <label htmlFor="weight-Kg">Kg</label>
                          <br />
                        </div>
                        <div
                          className="radio-option"
                          style={{ marginLeft: "37px" }}
                        >
                          <Field
                            type="radio"
                            id="weight-lbs"
                            name="weight"
                            value="lbs"
                            checked={values.weight === "lbs"}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              handleChange(e);
                              setFieldValue("weight", e.target.value);
                              setPreferences((prev: any) => ({
                                ...prev,
                                weight: e.target.value,
                              }));
                            }}
                          />
                          <label htmlFor="weight-lbs">Lbs</label>
                        </div>
                      </div>
                      <ErrorMessage
                        name="weight"
                        component="div"
                        className="error"
                      />
                    </div>
                    <div className="radio-column">
                      <label htmlFor="height">
                        Height<span style={{ color: "red" }}>*</span>
                      </label>
                      <div className="radio-options">
                        <div className="radio-option">
                          <Field
                            type="radio"
                            id="height-cm"
                            name="height"
                            value="cm"
                            checked={values.height === "cm"}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              handleChange(e);
                              setFieldValue("height", e.target.value);
                              setPreferences((prev: any) => ({
                                ...prev,
                                height: e.target.value,
                              }));
                            }}
                          />
                          <label htmlFor="height-cm">cm</label>
                        </div>
                        <div
                          className="radio-option"
                          style={{ marginLeft: "30px" }}
                        >
                          <Field
                            type="radio"
                            id="height-ft"
                            name="height"
                            value="ft/inches"
                            checked={values.height === "ft/inches"}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              handleChange(e);
                              setFieldValue("height", e.target.value);
                              setPreferences((prev: any) => ({
                                ...prev,
                                height: e.target.value,
                              }));
                            }}
                          />
                          <label htmlFor="height-ft">ft/inches</label>
                        </div>
                      </div>
                      <ErrorMessage
                        name="height"
                        component="div"
                        className="error"
                      />
                    </div>
                  </div>
                  <div id="radio-group">
                    <div className="radio-column">
                      <label htmlFor="blood-glucose">
                        Blood Glucose<span style={{ color: "red" }}>*</span>
                      </label>
                      <div className="radio-options">
                        <div className="radio-option">
                          <Field
                            type="radio"
                            id="glucose-mmol"
                            name="bloodGlucose"
                            value="mmol/l"
                            checked={values.bloodGlucose === "mmol/l"}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              handleChange(e);
                              setFieldValue("bloodGlucose", e.target.value);
                              setPreferences((prev: any) => ({
                                ...prev,
                                bloodGlucose: e.target.value,
                              }));
                            }}
                          />
                          <label htmlFor="glucose-mmol">mmol/l</label>
                        </div>
                        <div className="radio-option">
                          <Field
                            type="radio"
                            id="glucose-mgdl"
                            name="bloodGlucose"
                            value="mg/dl"
                            checked={values.bloodGlucose === "mg/dl"}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              handleChange(e);
                              setFieldValue("bloodGlucose", e.target.value);
                              setPreferences((prev: any) => ({
                                ...prev,
                                bloodGlucose: e.target.value,
                              }));
                            }}
                          />
                          <label htmlFor="glucose-mgdl">mg/dl</label>
                        </div>
                      </div>
                      <ErrorMessage
                        name="bloodGlucose"
                        component="div"
                        className="error"
                      />
                    </div>

                    <div className="radio-column">
                      <label htmlFor="cholesterol">
                        Cholesterol<span style={{ color: "red" }}>*</span>
                      </label>
                      <div className="radio-options">
                        <div className="radio-option">
                          <Field
                            type="radio"
                            id="cholesterol-mmol"
                            name="cholesterol"
                            value="mmol/l"
                            checked={values.cholesterol === "mmol/l"}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              handleChange(e);
                              setFieldValue("cholesterol", e.target.value);
                              setPreferences((prev: any) => ({
                                ...prev,
                                cholesterol: e.target.value,
                              }));
                            }}
                          />
                          <label htmlFor="cholesterol-mmol">mmol/l</label>
                        </div>
                        <div className="radio-option">
                          <Field
                            type="radio"
                            id="cholesterol-mgdl"
                            name="cholesterol"
                            value="mg/dl"
                            checked={values.cholesterol === "mg/dl"}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              handleChange(e);
                              setFieldValue("cholesterol", e.target.value);
                              setPreferences((prev: any) => ({
                                ...prev,
                                cholesterol: e.target.value,
                              }));
                            }}
                          />
                          <label htmlFor="cholesterol-mgdl">mg/dl</label>
                        </div>
                      </div>
                      <ErrorMessage
                        name="cholesterol"
                        component="div"
                        className="error"
                      />
                    </div>
                  </div>
                  <div id="radio-group">
                    <div className="radio-column">
                      <label htmlFor="blood-pressure">
                        Blood Pressure<span style={{ color: "red" }}>*</span>
                      </label>
                      <div className="radio-options">
                        <div className="radio-option">
                          <Field
                            type="radio"
                            id="pressure-kpa"
                            name="bloodPressure"
                            value="kPa"
                            checked={values.bloodPressure === "kPa"}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              handleChange(e);
                              setFieldValue("bloodPressure", e.target.value);
                              setPreferences((prev: any) => ({
                                ...prev,
                                bloodPressure: e.target.value,
                              }));
                            }}
                          />
                          <label htmlFor="pressure-kpa">kpa</label>
                        </div>
                        <div
                          className="radio-option"
                          style={{ marginLeft: "20px" }}
                        >
                          <Field
                            type="radio"
                            id="pressure-mmHg"
                            name="bloodPressure"
                            value="mmHg"
                            checked={values.bloodPressure === "mmHg"}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              handleChange(e);
                              setFieldValue("bloodPressure", e.target.value);
                              setPreferences((prev: any) => ({
                                ...prev,
                                bloodPressure: e.target.value,
                              }));
                            }}
                          />
                          <label htmlFor="pressure-mmHg">mmHg</label>
                        </div>
                      </div>
                      <ErrorMessage
                        name="bloodPressure"
                        component="div"
                        className="error"
                      />
                    </div>

                    <div className="radio-column">
                      <label htmlFor="distance">
                        Distance<span style={{ color: "red" }}>*</span>
                      </label>
                      <div className="radio-options">
                        <div className="radio-option">
                          <Field
                            type="radio"
                            id="distance-km"
                            name="distance"
                            value="km"
                            checked={values.distance === "km"}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              handleChange(e);
                              setFieldValue("distance", e.target.value);
                              setPreferences((prev: any) => ({
                                ...prev,
                                distance: e.target.value,
                              }));
                            }}
                          />
                          <label htmlFor="distance-km">km</label>
                        </div>
                        <div className="radio-option">
                          <Field
                            type="radio"
                            id="distance-miles"
                            name="distance"
                            value="miles"
                            checked={values.distance === "miles"}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              handleChange(e);
                              setFieldValue("distance", e.target.value);
                              setPreferences((prev: any) => ({
                                ...prev,
                                distance: e.target.value,
                              }));
                            }}
                          />
                          <label htmlFor="distance-miles">miles</label>
                        </div>
                      </div>
                      <ErrorMessage
                        name="distance"
                        component="div"
                        className="error"
                      />
                    </div>
                  </div>
                  <div id="communication-type">
                    <span></span>
                    <p id="communication" style={{ color: "#3c3d3e" }}>
                      Communication Type (if any)
                    </p>
                    <span></span>
                  </div>
                  <div id="communication-preferences-container">
                    <div
                      id="communication-preferences"
                      className="preferences-section"
                    >
                      <div id="preference-email" className="preference-item">
                        <label htmlFor="systemEmails">System Emails</label>
                        <label className="new-switch">
                          <Field
                            type="checkbox"
                            name="systemEmails"
                            id="systemEmails"
                            checked={values.systemEmails === 1}
                            onChange={() =>
                              setFieldValue(
                                "systemEmails",
                                values.systemEmails === 1 ? 0 : 1
                              )
                            }
                          />
                          <span className="new-slider round"></span>
                        </label>
                      </div>

                      <div
                        id="preference-member-services"
                        className="preference-item"
                      >
                        <label htmlFor="memberServiceEmails">
                          Member Services Emails
                        </label>
                        <label className="new-switch">
                          <Field
                            type="checkbox"
                            name="memberServiceEmails"
                            id="memberServiceEmails"
                            checked={values.memberServiceEmails === 1}
                            onChange={() =>
                              setFieldValue(
                                "memberServiceEmails",
                                values.memberServiceEmails === 1 ? 0 : 1
                              )
                            }
                          />
                          <span className="new-slider round"></span>
                        </label>
                      </div>

                      <div id="preference-sms" className="preference-item">
                        <label htmlFor="sms">SMS</label>
                        <label className="new-switch" style={{ left: "16.2%" }}>
                          <Field
                            type="checkbox"
                            name="sms"
                            id="sms"
                            checked={values.sms === 1}
                            onChange={() =>
                              setFieldValue("sms", values.sms === 1 ? 0 : 1)
                            }
                          />
                          <span className="new-slider round"></span>
                        </label>
                      </div>

                      <div id="preference-phone" className="preference-item">
                        <label htmlFor="phoneCall">Phone Calls</label>
                        <label className="new-switch" style={{ left: "5%" }}>
                          <Field
                            type="checkbox"
                            name="phoneCall"
                            id="phoneCall"
                            checked={values.phoneCall === 1}
                            onChange={() =>
                              setFieldValue(
                                "phoneCall",
                                values.phoneCall === 1 ? 0 : 1
                              )
                            }
                          />
                          <span className="new-slider round"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div id="communication-preferences-container">
                    <div className="preferences-section">
                      <div id="preference-sms" className="preference-item">
                        <label htmlFor="post">Post</label>
                        <label className="new-switch" style={{ left: "16%" }}>
                          <Field
                            type="checkbox"
                            name="post"
                            id="post"
                            checked={values.post === 1}
                            onChange={() =>
                              setFieldValue("post", values.post === 1 ? 0 : 1)
                            }
                          />
                          <span className="new-slider round"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-row button-row">
                  <button
                    type="submit"
                    id="update-button"
                    style={{ cursor: "pointer" }}
                  >
                    Update
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
};

export default Preferences;
