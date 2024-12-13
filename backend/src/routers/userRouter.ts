import { Router } from "express";
import {
  registerUser,
  loginUser,
  verifyUser,
  getUser,
  getDocList,
  getPatientList,
  addPatient,
  addAddress,
  getDoctorList,
  updateprofile,
  changePassword,
  updateAddress,
  addStaff,
  getStaffList,
  deleteAddress,
  addAppointment,
  getAppointmentList,
  getPatientDetails,
  getAppointmentDetails,
  updateAppointment,
  updatePatientDetails,
  deletePatient,
  updateStatus,
  uploadProfilePhoto,
  getImage,
} from "../controllers/userController";
import userAuthMiddleware from "../middlewares/userAuth";
import signupValidation from "../middlewares/formValidation.ts/signupValidation";
import loginValidation from "../middlewares/formValidation.ts/loginValidation";
import { upload } from "../utils/multer";

const router = Router();

router.post("/register", signupValidation, registerUser);
router.post("/login", loginValidation, loginUser);
router.put("/verify", verifyUser);
router.get("/user", userAuthMiddleware, getUser);
router.get("/doc-list", userAuthMiddleware, getDocList);
router.get("/doctor-list", userAuthMiddleware, getDoctorList);
router.get("/patient-list", userAuthMiddleware, getPatientList);
router.post("/add-patient", userAuthMiddleware, addPatient);
router.post("/add-address", userAuthMiddleware, addAddress);
router.post("/update-profile", userAuthMiddleware, updateprofile);
router.post("/change-password", userAuthMiddleware, changePassword);
router.put("/update-address", userAuthMiddleware, updateAddress);
router.post("/add-staff", userAuthMiddleware, addStaff);
router.get("/get-staff", userAuthMiddleware, getStaffList);
router.delete("/delete-address", userAuthMiddleware, deleteAddress);
router.post("/add-appointment", userAuthMiddleware, addAppointment);
router.get(
  "/view-appointment/:appointmentId",
  userAuthMiddleware,
  getAppointmentDetails
);
router.get("/appointment-list", userAuthMiddleware, getAppointmentList);
router.get(
  "/patients-details/:patientId",
  userAuthMiddleware,
  getPatientDetails
);

router.put("/update-appointment/:appointmentId",userAuthMiddleware,updateAppointment)
router.put("/update-patient/:patientId",userAuthMiddleware,updatePatientDetails);
router.delete("/delete-patientDetails/:patientId", userAuthMiddleware, deletePatient);
router.put("/update-status/:patientId",userAuthMiddleware,updateStatus)
router.post("/profile-photo",upload.single('profilePhoto'),userAuthMiddleware,uploadProfilePhoto)
router.get("/get-profile-photo",userAuthMiddleware,getImage)
export default router;