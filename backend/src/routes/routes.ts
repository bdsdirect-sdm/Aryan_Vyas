import { Router, Request, Response } from "express";
import {
  signup,
  login,
  getUserDetails,
  changePassword,
  getPreferenceDetailsById,
  updateOrCreatePreference,
  updateProfile,
  getBasicDetails,
  updateBasicDetails,
  updatePersonalDetails,
  getPersonalDetails,
  createWave,
  getWaveList,
  updateWaveStatus,
  getAllWaveList,
  addCommentWave,
  deleteComment,
  updateComment,
  getComment,
  registerAdmin,
  loginAdmin,
  getUsers,
  deleteUser,
  toggleUserStatus,
  getAdminProfile,
  editAdminUser,
  AddInviteFriend,
  GetInviteFriend,
  GetAcceptedFriends,
  getAcceptedFriendsList,
  getUserByIdForAdmin,
  getAllWaveListAdmin,
  deleteWave,
} from "../controllers/userControllers";
import { verifyToken } from "../middleware/verifyToken";
import upload from "../middleware/multer";
const router = Router();

router.post("/adminSignup", registerAdmin);
router.post("/adminLogin", loginAdmin);
router.get("/admin/users", getUsers);
router.get("/adminProfile",getAdminProfile);
router.delete("/delete-admin-user/:userId", deleteUser);
router.delete("/delete-admin-wave/:waveId", deleteWave);
router.patch("/toggle-status/:userId", toggleUserStatus);
router.put("/editAdminUser/:userId",editAdminUser)
// router.put('/admin/user/:userId', upload.single('profileIcon'), editAdminUser);

router.get("/get-wavelist-admin",getAllWaveListAdmin)
router.post("/signup", signup);
router.post("/login", login);
router.get("/userDetails", verifyToken, getUserDetails);
router.put("/change-password", verifyToken, changePassword);
router.get("/getpreferencebyId", verifyToken, getPreferenceDetailsById);
router.put("/updatepreference", verifyToken, updateOrCreatePreference);
router.put(
  "/updateprofile",
  upload.single("profileIcon"),
  verifyToken,
  updateProfile
);
router.post("/invite-friend",verifyToken,AddInviteFriend);
router.get("/invite-friend",verifyToken,GetInviteFriend);
router.get("/accepted-friends",verifyToken,GetAcceptedFriends);
router.get("/getuserdetails",verifyToken,getPreferenceDetailsById);
router.get("/getpersonaldetails", verifyToken, getPersonalDetails);
router.put("/updatepersonaldetails", verifyToken, updatePersonalDetails);
router.get("/getbasicdetails", verifyToken, getBasicDetails);
router.put("/updatebasicdetails", verifyToken, updateBasicDetails);
router.post("/createwave", upload.single("image"), verifyToken, createWave);
router.get("/getwaveList", verifyToken, getWaveList);
router.put("/updatewavestatus", verifyToken, updateWaveStatus);
router.get("/getallwavelist", verifyToken, getAllWaveList);
router.post("/addcomment/:id/waves/comment", verifyToken, addCommentWave);
router.delete(
  "/deletecomment/:id/waves/comment",
  verifyToken,
  deleteComment
);
router.get("/singleUserDetails/:id", getUserByIdForAdmin);
router.put("/updatecomment/:id/waves/comment", verifyToken, updateComment);
router.get(
  "/getallcommentwave/:id/waves/comment",
  verifyToken,
  getComment
);
router.get("/accepted-friends-list",verifyToken,getAcceptedFriendsList)

export default router;
