"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAcceptedFriends =
  exports.updateComment =
  exports.deleteComment =
  exports.getComment =
  exports.addCommentWave =
  exports.getAllWaveList =
  exports.updateWaveStatus =
  exports.getWaveList =
  exports.createWave =
  exports.updatePersonalDetails =
  exports.getPersonalDetails =
  exports.updateBasicDetails =
  exports.getBasicDetails =
  exports.updateProfile =
  exports.updateOrCreatePreference =
  exports.getPreferenceDetailsById =
  exports.GetInviteFriend =
  exports.AddInviteFriend =
  exports.changePassword =
  exports.getUserDetails =
  exports.login =
  exports.signup =
  exports.editAdminUser =
  exports.getAdminProfile =
  exports.toggleUserStatus =
  exports.deleteUser =
  exports.getUsers =
  exports.loginAdmin =
  exports.registerAdmin =
    void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const statusCodes_1 = require("../utils/statusCodes");
const nodemailer_1 = __importDefault(require("nodemailer"));
const statusMessages_1 = require("../utils/statusMessages");
const users_1 = __importDefault(require("../models/users"));
const validationSchema_1 = require("../utils/validationSchema");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const models_1 = require("../models");
const models_2 = require("../models");
const waves_1 = __importDefault(require("../models/waves"));
dotenv_1.default.config();
const registerAdmin = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { adminEmail, adminPassword, adminFullName } = req.body;
      console.log("Received admin data:", req.body);
      if (!adminEmail || !adminPassword || !adminFullName) {
        console.log("Missing fields:", {
          adminEmail,
          adminPassword,
          adminFullName,
        });
        res.status(statusCodes_1.statusCodes.error.UNAUTHORIZED.code).json({
          error: statusMessages_1.signupMessage.error.missingFields,
        });
        return;
      }
      const existingAdmin = yield models_2.Admin.findOne({
        where: { adminEmail },
      });
      if (existingAdmin) {
        console.log("Admin with this email already exists:", adminEmail);
        res.status(statusCodes_1.statusCodes.error.UNAUTHORIZED.code).json({
          error: statusMessages_1.signupMessage.error.emailTaken,
        });
        return;
      }
      const hashedPassword = yield bcrypt_1.default.hash(adminPassword, 10);
      console.log("Hashed password:", hashedPassword);
      const newAdmin = yield models_2.Admin.create({
        adminEmail,
        adminPassword: hashedPassword,
        adminFullName,
      });
      console.log("New admin created:", newAdmin);
      res.status(statusCodes_1.statusCodes.success.OK.code).json({
        message: statusMessages_1.signupMessage.success.adminCreated,
        admin: {
          id: newAdmin.id,
          adminEmail: newAdmin.adminEmail,
          adminFullName: newAdmin.adminFullName,
        },
      });
    } catch (error) {
      console.error("Error in registerAdmin:", error);
      res.status(statusCodes_1.statusCodes.error.SERVER_ERROR.code).json({
        error: statusMessages_1.signupMessage.error.serverError,
      });
    }
  });
exports.registerAdmin = registerAdmin;
const loginAdmin = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { adminEmail, adminPassword } = req.body;
      if (!adminEmail || !adminPassword) {
        res.status(statusCodes_1.statusCodes.error.UNAUTHORIZED.code).json({
          error: statusMessages_1.LoginMessage.error.missingFields,
        });
        return;
      }
      const existingAdmin = yield models_2.Admin.findOne({
        where: { adminEmail },
      });
      if (!existingAdmin) {
        res.status(statusCodes_1.statusCodes.error.NOT_FOUND.code).json({
          error: statusMessages_1.LoginMessage.error.invalidCredentials,
        });
        return;
      }
      const passwordMatch = yield bcrypt_1.default.compare(
        adminPassword,
        existingAdmin.adminPassword
      );
      if (!passwordMatch) {
        res.status(statusCodes_1.statusCodes.error.UNAUTHORIZED.code).json({
          error: statusMessages_1.LoginMessage.error.invalidCredentials,
        });
        return;
      }
      const token = jsonwebtoken_1.default.sign(
        { id: existingAdmin.id, adminEmail: existingAdmin.adminEmail },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.status(statusCodes_1.statusCodes.success.OK.code).json({
        message: statusMessages_1.LoginMessage.success.loginSuccess,
        token,
        admin: {
          id: existingAdmin.id,
          adminEmail: existingAdmin.adminEmail,
        },
      });
    } catch (error) {
      console.error("Error during admin login:", error);
      res.status(statusCodes_1.statusCodes.error.SERVER_ERROR.code).json({
        error: statusMessages_1.LoginMessage.error.serverError,
      });
    }
  });
exports.loginAdmin = loginAdmin;
const getUsers = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const users = yield users_1.default.findAll({
        attributes: [
          "id", // Include the id in the response
          "first_name",
          "last_name",
          "email",
          "phone_number",
          "dob",
          "gender",
          "address1",
          "address2",
          "city",
          "state",
          "zip",
          "dob",
          "marital_status",
          "social",
          "kids",
          "status", // Include status field
        ],
        where: {
          deletedAt: null,
        },
      });
      if (users.length === 0) {
        res.status(404).json({
          message: "No users found",
        });
        return;
      }
      const userList = users.map((user) => ({
        id: user.id,
        full_name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        phone_number: user.phone_number,
        dob: user.dob,
        gender: user.gender,
        status: user.status,
        address1: user.address1,
        address2: user.address2,
        city: user.city,
        state: user.state,
        zip: user.zip,
        marital_status: user.marital_status,
        social: user.social,
        kids: user.kids,
      }));
      res.status(200).json({
        message: "Users retrieved successfully",
        users: userList,
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({
        error: "An error occurred while fetching users",
      });
    }
  });
exports.getUsers = getUsers;
const deleteUser = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { userId } = req.params;
      const user = yield users_1.default.findOne({
        where: {
          id: userId,
          deletedAt: null,
        },
      });
      if (!user) {
        res.status(404).json({
          error: "User not found",
        });
        return;
      }
      yield user.destroy();
      res.status(200).json({
        message: "User deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({
        error: "An error occurred while deleting the user",
      });
    }
  });
exports.deleteUser = deleteUser;
const toggleUserStatus = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
      const user = yield users_1.default.findByPk(userId);
      if (!user) {
        res.status(404).json({
          message: "User not found",
        });
        return;
      }
      // Toggle the status (1 for active, 2 for inactive)
      const newStatus = user.status === 1 ? 2 : 1; // Use numbers instead of strings
      user.status = newStatus;
      yield user.save();
      res.status(200).json({
        message: `User status updated to ${
          newStatus === 1 ? "active" : "inactive"
        }`,
      });
    } catch (error) {
      console.error("Error updating user status:", error);
      res.status(500).json({
        message: "An error occurred while updating user status",
      });
    }
  });
exports.toggleUserStatus = toggleUserStatus;
const getAdminProfile = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
      const token =
        (_a = req.headers["authorization"]) === null || _a === void 0
          ? void 0
          : _a.split(" ")[1]; // Extract token from Authorization header
      if (!token) {
        res.status(401).json({ error: "Unauthorized: No token provided" });
        return;
      }
      // Verify token manually using the JWT secret key
      const decodedToken = jsonwebtoken_1.default.verify(
        token,
        process.env.JWT_SECRET
      );
      // Now, find the admin based on the decoded token
      const adminProfile = yield models_2.Admin.findByPk(decodedToken.id, {
        attributes: ["id", "adminEmail", "adminFullName"],
      });
      if (!adminProfile) {
        res.status(404).json({ error: "Admin not found" });
        return;
      }
      res.status(200).json({ admin: adminProfile });
      return;
    } catch (error) {
      console.error("Error fetching admin profile:", error);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
  });
exports.getAdminProfile = getAdminProfile;
const editAdminUser = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { userId } = req.params; // Extract userId from params
      const {
        first_name,
        last_name,
        email,
        phone_number,
        address1,
        address2,
        city,
        state,
        zip,
        dob,
        gender,
        marital_status,
        social,
        kids,
        status,
      } = req.body; // Extract new user data from the request body
      // Validate required fields (you can add more validation based on your requirements)
      if (!first_name || !last_name || !email || !phone_number) {
        res.status(400).json({
          error:
            "Missing required fields: first name, last name, email, or phone number.",
        });
        return;
      }
      // Check if the user exists
      const user = yield users_1.default.findOne({
        where: { id: userId, deletedAt: null },
      });
      if (!user) {
        res.status(404).json({
          error: "User not found",
        });
        return;
      }
      // Update the user details
      user.first_name = first_name;
      user.last_name = last_name;
      user.email = email;
      user.phone_number = phone_number;
      user.address1 = address1 || user.address1; // Only update if new value provided
      user.address2 = address2 || user.address2;
      user.city = city || user.city;
      user.state = state || user.state;
      user.zip = zip || user.zip;
      user.dob = dob || user.dob;
      user.gender = gender || user.gender;
      user.marital_status = marital_status || user.marital_status;
      user.social = social || user.social;
      user.kids = kids || user.kids;
      user.status = status || user.status; // Update status if provided
      yield user.save(); // Save the updated user
      res.status(200).json({
        message: "User details updated successfully",
        user: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          phone_number: user.phone_number,
          address1: user.address1,
          address2: user.address2,
          city: user.city,
          state: user.state,
          zip: user.zip,
          dob: user.dob,
          gender: user.gender,
          marital_status: user.marital_status,
          social: user.social,
          kids: user.kids,
          status: user.status,
        },
      });
    } catch (error) {
      console.error("Error editing user details:", error);
      res.status(500).json({
        error: "An error occurred while updating the user's details.",
      });
    }
  });
exports.editAdminUser = editAdminUser;
const signup = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      // Validate the incoming request body using Joi Schema
      const { error } = validationSchema_1.signupSchema.validate(req.body);
      if (error) {
        res.status(statusCodes_1.statusCodes.error.BAD_REQUEST.code).json({
          error: error.details[0].message,
        });
        return;
      }
      const { first_name, last_name, email, phone_number, password } = req.body;
      // Check for missing fields
      if (!first_name || !last_name || !email || !phone_number || !password) {
        res.status(statusCodes_1.statusCodes.error.UNAUTHORIZED.code).json({
          error: statusMessages_1.signupMessage.error.missingFields,
        });
        return;
      }
      // Check if the email is already registered
      const existingUser = yield users_1.default.findOne({ where: { email } });
      if (existingUser) {
        res.status(statusCodes_1.statusCodes.error.UNAUTHORIZED.code).json({
          error: statusMessages_1.signupMessage.error.emailTaken,
        });
        return;
      }
      // Hash the password
      const hashedPassword = yield bcrypt_1.default.hash(password, 10);
      // Create a new user
      const newUser = yield users_1.default.create({
        first_name,
        last_name,
        email,
        phone_number,
        password: hashedPassword,
        status: 1,
      });
      // Check for pending friend requests associated with the email
      const pendingFriends = yield models_1.Friend.findAll({
        where: { inviteEmail: email, status: 0, isAccepted: 0 },
      });
      if (pendingFriends.length > 0) {
        // Update friend requests to accepted
        yield models_1.Friend.update(
          { status: 1, isAccepted: 1 }, // Accepted status
          { where: { inviteEmail: email, status: 0, isAccepted: 0 } }
        );
      }
      // Respond with success message
      res.status(statusCodes_1.statusCodes.success.OK.code).json({
        message: statusMessages_1.signupMessage.success.userCreated,
        user: {
          id: newUser.id,
          first_name: newUser.first_name,
          last_name: newUser.last_name,
          email: newUser.email,
          phone_number: newUser.phone_number,
        },
        friendRequestUpdates:
          pendingFriends.length > 0
            ? `${pendingFriends.length} friend requests accepted.`
            : "No pending friend requests found.",
      });
    } catch (error) {
      console.error("Error during signup:", error);
      res.status(statusCodes_1.statusCodes.error.SERVER_ERROR.code).json({
        error: statusMessages_1.signupMessage.error.serverError,
      });
    }
  });
exports.signup = signup;
const login = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(statusCodes_1.statusCodes.error.UNAUTHORIZED.code).json({
          error: statusMessages_1.LoginMessage.error.missingFields,
        });
        return;
      }
      const user = yield users_1.default.findOne({ where: { email } });
      if (!user) {
        return res
          .status(statusCodes_1.statusCodes.error.UNAUTHORIZED.code)
          .json({
            error: statusMessages_1.LoginMessage.error.invalidCredentials,
          });
      }
      if (user.status === "2") {
        return res
          .status(statusCodes_1.statusCodes.error.UNAUTHORIZED.code)
          .json({
            error: "Your account is inactive. Please contact the admin.",
          });
      }
      const isPasswordValid = yield bcrypt_1.default.compare(
        password,
        user.password
      );
      if (!isPasswordValid) {
        res.status(statusCodes_1.statusCodes.error.UNAUTHORIZED.code).json({
          error: statusMessages_1.LoginMessage.error.invalidCredentials,
        });
        return;
      }
      const token = jsonwebtoken_1.default.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.status(statusCodes_1.statusCodes.success.OK.code).json({
        message: statusMessages_1.LoginMessage.success.loginSuccess,
        token,
        user: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          phone_number: user.phone_number,
          profileIcon: user.profileIcon,
          status: user.status,
        },
      });
    } catch (error) {
      console.error("Error during login", error);
      res.status(statusCodes_1.statusCodes.error.SERVER_ERROR.code).json({
        error: statusMessages_1.LoginMessage.error.serverError,
      });
    }
  });
exports.login = login;
const getUserDetails = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { id } = req.params;
      const userDetails = yield users_1.default.findByPk(id, {
        attributes: ["id", "first_name", "last_name", "email", "profileIcon"],
      });
      if (
        userDetails === null || userDetails === void 0
          ? void 0
          : userDetails.dataValues
      ) {
        const { first_name, last_name, profileIcon } = userDetails;
        return res.status(statusCodes_1.statusCodes.success.OK.code).json({
          message: statusMessages_1.userDetailsMessage.success.message,
          data: {
            userName: first_name,
            fullName: `${first_name} ${last_name}`,
            email: userDetails.email,
            profileIcon: userDetails.profileIcon
              ? `http://localhost:4000/uploads/${profileIcon}`
              : null,
          },
        });
      }
      console.log("fkslkf", userDetails);
      return res.status(statusCodes_1.statusCodes.error.NOT_FOUND).json({
        error: statusMessages_1.userDetailsMessage.error.notfound,
      });
    } catch (error) {
      console.error("Error fetching user details:", error);
      return res.status(statusCodes_1.statusCodes.error.SERVER_ERROR).json({
        message: statusMessages_1.userDetailsMessage.error.serverError,
      });
    }
  });
exports.getUserDetails = getUserDetails;
const changePassword = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { old_password, password } = req.body;
    try {
      const { error } = (0, validationSchema_1.validatePassword)({
        old_password,
        password,
      });
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      const userId = req.user.id;
      const user = yield users_1.default.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }
      const isMatch = yield bcrypt_1.default.compare(
        old_password,
        user.password
      );
      if (!isMatch) {
        return res
          .status(statusCodes_1.statusCodes.error.UNAUTHORIZED.code)
          .json({ error: "Current password is incorrect." });
      }
      const salt = yield bcrypt_1.default.genSalt(10);
      const hashedPassword = yield bcrypt_1.default.hash(password, salt);
      user.password = hashedPassword;
      yield user.save();
      res
        .status(statusCodes_1.statusCodes.success.OK.code)
        .json({ message: "Password changed successfully." });
    } catch (error) {
      console.error("Error changing password:", error);
      res
        .status(statusCodes_1.statusCodes.error.SERVER_ERROR.code)
        .json({ error: "An error occurred while changing the password." });
    }
  });
exports.changePassword = changePassword;
const AddInviteFriend = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { inviteEmail, inviteName, inviteMessage } = req.body;
      // Validate input data
      const { error } = validationSchema_1.inviteFriendSchema.validate({
        inviteEmail,
        inviteName,
        inviteMessage,
      });
      if (error) {
        return res
          .status(statusCodes_1.statusCodes.error.BAD_REQUEST.code)
          .json({ message: error.details[0].message });
      }
      // Check if the invitation already exists
      let isInvited = yield models_1.Friend.findOne({
        where: {
          inviteEmail: req.body.inviteEmail,
          inviterId: req.user.id,
        },
      });
      if (isInvited) {
        return res.status(statusCodes_1.statusCodes.error.FORBIDDEN.code).json({
          status: statusCodes_1.statusCodes.error.FORBIDDEN.code,
          message: "Already Invited",
        });
      }
      // Check if the email exists in the User table
      let IsEmailExists = yield users_1.default.findOne({
        where: { email: req.body.inviteEmail },
      });
      const token = jsonwebtoken_1.default.sign(
        { email: req.body.inviteEmail },
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: "1h" }
      );
      const registrationLink = `${process.env.BASE_URL}/?token=${token}`;
      // console.log(registrationLink);
      const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: req.body.inviteEmail,
        subject: "You've been invited to register",
        text: `
        Hello ${req.body.inviteName},

        You've been invited to join our platform. To complete your registration, please click the link below:

        ${registrationLink}

        If you did not request this invitation, please ignore this email.

        Best regards,
        SmartData Enterprises
      `,
      };
      // Send the email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
          return res
            .status(500)
            .json({ message: "Error sending invitation email" });
        }
        // console.log('Email sent:', info.response);
      });
      const values = {
        inviterId: req.user.id,
        inviteEmail: req.body.inviteEmail,
        inviteMessage: req.body.inviteMessage,
        inviteName: req.body.inviteName,
        status: IsEmailExists ? 1 : 0,
        isAccepted: IsEmailExists ? 1 : 0,
      };
      // console.log("Values being passed to create:", values);
      // Create a new invitation record
      let newInvite = yield models_1.Friend.create(values);
      if (newInvite) {
        // console.log("New Invite Created:", newInvite.get());
        res.status(statusCodes_1.statusCodes.success.OK.code).json({
          message: "Invitation sent successfully",
          inviteId: newInvite.id,
          status: "Pending",
        });
      } else {
        // console.log("Failed to create invite");
        res
          .status(statusCodes_1.statusCodes.error.SERVER_ERROR.code)
          .json({ message: "Failed to create invitation" });
      }
    } catch (error) {
      console.error("Error during invitation creation:", error);
      res
        .status(statusCodes_1.statusCodes.error.SERVER_ERROR.code)
        .json({ message: "Internal server error" });
    }
  });
exports.AddInviteFriend = AddInviteFriend;
const GetInviteFriend = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const getInviteDetails = yield models_1.Friend.findAll({
        attributes: ["id", "inviteEmail", "inviteName", "status", "isAccepted"],
        where: {
          inviterId: req.user.id,
        },
        order: [["id", "DESC"]],
      });
      if (getInviteDetails) {
        let id = null;
        let email = "";
        let isAccepted = 0;
        let name = "";
        let icon = null;
        let data = []; // Explicitly typing as an array of any
        if (getInviteDetails.length > 0) {
          for (let i = 0; i < getInviteDetails.length; i++) {
            id = getInviteDetails[i].dataValues.id;
            email = getInviteDetails[i].dataValues.inviteEmail || ""; // Use fallback value
            isAccepted = getInviteDetails[i].dataValues.isAccepted;
            if (getInviteDetails[i].dataValues.status) {
              const fetchActualData = yield users_1.default.findAll({
                attributes: ["id", "first_name", "last_name", "profileIcon"],
                where: { email: getInviteDetails[i].dataValues.inviteEmail },
              });
              if (fetchActualData && fetchActualData.length > 0) {
                name = `${fetchActualData[0].dataValues.first_name || ""} ${
                  fetchActualData[0].dataValues.last_name || ""
                }`; // Use fallback values
                icon = fetchActualData[0].dataValues.profileIcon
                  ? `http://localhost:4000/uploads/${fetchActualData[0].dataValues.profileIcon}`
                  : null;
              } else {
                name = getInviteDetails[i].dataValues.inviteName || ""; // Use fallback value
                icon = null;
              }
            } else {
              name = getInviteDetails[i].dataValues.inviteName || ""; // Use fallback value
              icon = null;
            }
            // Push each invitee's data to the array
            data.push({
              id,
              name,
              email,
              icon,
              isAccepted,
            });
          }
          return res.status(statusCodes_1.statusCodes.success.OK.code).json({
            status: statusCodes_1.statusCodes.success.OK.code,
            message: "Invited Details Get Successfully",
            data, // Include the populated data array
          });
        } else {
          return res
            .status(statusCodes_1.statusCodes.error.NOT_FOUND.code)
            .json({
              status: statusCodes_1.statusCodes.error.NOT_FOUND.code,
              message: "Not Invited yet",
            });
        }
      } else {
        return res
          .status(statusCodes_1.statusCodes.error.SERVER_ERROR.code)
          .json({
            status: statusCodes_1.statusCodes.error.SERVER_ERROR.code,
            message: statusCodes_1.statusCodes.error.SERVER_ERROR.message,
          });
      }
    } catch (error) {
      console.error("Error fetching invite friends:", error);
      return res
        .status(statusCodes_1.statusCodes.error.SERVER_ERROR.code)
        .json({
          status: statusCodes_1.statusCodes.error.SERVER_ERROR.code,
          message: "An error occurred while fetching invite details.",
        });
    }
  });
exports.GetInviteFriend = GetInviteFriend;
const getPreferenceDetailsById = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    let data = null;
    try {
      const PreferenceDetails = yield models_1.Preference.findOne({
        where: { userId: userId },
      });
      if (PreferenceDetails && PreferenceDetails.dataValues) {
        let data = {
          language: PreferenceDetails.dataValues.language,
          breakfast: PreferenceDetails.dataValues.breakfast,
          lunch: PreferenceDetails.dataValues.lunch,
          dinner: PreferenceDetails.dataValues.dinner,
          wakeTime: PreferenceDetails.dataValues.wakeTime,
          bedTime: PreferenceDetails.dataValues.bedTime,
          weight: PreferenceDetails.dataValues.weight,
          height: PreferenceDetails.dataValues.height,
          bloodGlucose: PreferenceDetails.dataValues.bloodGlucose,
          distance: PreferenceDetails.dataValues.distance,
          cholesterol: PreferenceDetails.dataValues.cholesterol,
          bloodPressure: PreferenceDetails.dataValues.bloodPressure,
          systemEmails: PreferenceDetails.dataValues.systemEmails,
          memberServiceEmails: PreferenceDetails.dataValues.memberServiceEmails,
          sms: PreferenceDetails.dataValues.sms,
          phoneCall: PreferenceDetails.dataValues.phoneCall,
          post: PreferenceDetails.dataValues.post,
        };
        return res.status(statusCodes_1.statusCodes.success.OK.code).json({
          success: true,
          message: "Preference details fetched Successfully",
          data: data,
        });
      }
    } catch (error) {
      return res
        .status(statusCodes_1.statusCodes.error.SERVER_ERROR.code)
        .json({
          success: false,
          message: statusCodes_1.statusCodes.error.SERVER_ERROR.message,
        });
    }
  });
exports.getPreferenceDetailsById = getPreferenceDetailsById;
const updateOrCreatePreference = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const {
      language,
      breakfast,
      lunch,
      dinner,
      wakeTime,
      bedTime,
      weight,
      height,
      bloodGlucose,
      bloodPressure,
      distance,
      cholesterol,
      systemEmails,
      memberServiceEmails,
      phoneCall,
      post,
      sms,
    } = req.body;
    try {
      let preference = yield models_1.Preference.findOne({
        where: { userId: userId },
      });
      if (preference) {
        preference.language = language || preference.language;
        preference.breakfast = breakfast || preference.breakfast;
        preference.lunch = lunch || preference.lunch;
        preference.dinner = dinner || preference.dinner;
        preference.wakeTime = wakeTime || preference.wakeTime;
        preference.bedTime = bedTime || preference.bedTime;
        preference.weight = weight || preference.weight;
        preference.height = height || preference.height;
        preference.bloodGlucose = bloodGlucose || preference.bloodGlucose;
        preference.bloodPressure = bloodPressure || preference.bloodPressure;
        preference.distance = distance || preference.distance;
        preference.cholesterol = cholesterol || preference.cholesterol;
        // Ensure boolean-like fields are set to 0 or 1
        preference.systemEmails =
          systemEmails !== undefined
            ? Number(systemEmails)
            : preference.systemEmails;
        preference.sms = sms !== undefined ? Boolean(sms) : preference.sms;
        preference.memberServiceEmails =
          memberServiceEmails !== undefined
            ? Number(memberServiceEmails)
            : preference.memberServiceEmails;
        preference.phoneCall =
          phoneCall !== undefined ? Number(phoneCall) : preference.phoneCall;
        preference.post = post !== undefined ? Number(post) : preference.post;
        yield preference.save();
        console.log("preference", preference);
        return res.status(statusCodes_1.statusCodes.success.OK.code).json({
          success: true,
          message: "Preference Updated Successfully",
          data: preference,
        });
      } else {
        preference = yield models_1.Preference.create({
          userId,
          language,
          breakfast,
          lunch,
          dinner,
          wakeTime,
          bedTime,
          weight,
          height,
          bloodGlucose,
          bloodPressure,
          distance,
          cholesterol,
          systemEmails,
          sms,
          memberServiceEmails,
          post,
          phoneCall,
        });
        return res.status(statusCodes_1.statusCodes.success.OK.code).json({
          success: true,
          message: "Preference Created Successfully",
          data: preference,
        });
      }
    } catch (error) {
      console.error(error);
      return res
        .status(statusCodes_1.statusCodes.error.SERVER_ERROR.code)
        .json({
          success: false,
          message: statusCodes_1.statusCodes.error.SERVER_ERROR.message,
        });
    }
  });
exports.updateOrCreatePreference = updateOrCreatePreference;
const updateProfile = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    let data = null;
    const file = req.file;
    console.log(file);
    try {
      const result = yield users_1.default.update(
        { profileIcon: file.filename || null },
        {
          where: { id: req.user.id },
        }
      );
      if (result) {
        data = {
          profileIcon: `http://localhost:4000/uploads/${file.filename}`,
        };
        res.status(statusCodes_1.statusCodes.success.OK.code).json({
          status: statusCodes_1.statusCodes.success.OK.code,
          message: "Profile Picture Updated Successfully",
          data,
        });
      } else {
        res.status(statusCodes_1.statusCodes.error.BAD_REQUEST.code).json({
          status: statusCodes_1.statusCodes.error.BAD_REQUEST.code,
          message: "Something went wrong",
        });
      }
    } catch (error) {
      res.status(statusCodes_1.statusCodes.error.SERVER_ERROR.code).json({
        message: statusCodes_1.statusCodes.error.SERVER_ERROR.message,
      });
    }
  });
exports.updateProfile = updateProfile;
const getBasicDetails = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const userDetails = yield users_1.default.findByPk(req.user.id);
      if (
        userDetails === null || userDetails === void 0
          ? void 0
          : userDetails.dataValues
      ) {
        let data = {
          first_name: userDetails.first_name || "",
          last_name: userDetails.last_name || "",
          email: userDetails.email || "",
          phone_number: userDetails.phone_number || "",
          ssn: userDetails.ssn || null,
          address1: userDetails.address1 || "",
          address2: userDetails.address2 || "",
          city: userDetails.city || "",
          state: userDetails.state || "",
          zip: userDetails.zip || null,
          dob: userDetails.dob || "",
          gender: userDetails.gender || "",
          marital_status: userDetails.marital_status || "",
          social: userDetails.social || "",
          kids: userDetails.kids || null,
        };
        res.status(statusCodes_1.statusCodes.success.OK.code).json({
          status: statusCodes_1.statusCodes.success.OK.code,
          message: statusCodes_1.statusCodes.success.OK.message,
          data,
        });
      } else {
        res.status(statusCodes_1.statusCodes.error.NOT_FOUND.code).json({
          status: statusCodes_1.statusCodes.error.NOT_FOUND.code,
          message: statusCodes_1.statusCodes.error.NOT_FOUND.code,
        });
      }
    } catch (error) {
      console.error(error);
      res.status(statusCodes_1.statusCodes.error.SERVER_ERROR.code).json({
        status: statusCodes_1.statusCodes.error.SERVER_ERROR.code,
        message: statusCodes_1.statusCodes.error.SERVER_ERROR.code,
      });
    }
  });
exports.getBasicDetails = getBasicDetails;
const updateBasicDetails = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { error, value } = validationSchema_1.updateUserSchema.validate(
        req.body
      );
      if (error) {
        return res
          .status(statusCodes_1.statusCodes.error.BAD_REQUEST.code)
          .json({
            status: statusCodes_1.statusCodes.error.BAD_REQUEST.code,
            message: error.details[0].message,
          });
      }
      const user = yield users_1.default.findByPk(req.user.id);
      if (!user) {
        return res
          .status(statusCodes_1.statusCodes.error.BAD_REQUEST.code)
          .json({
            status: statusCodes_1.statusCodes.error.BAD_REQUEST.code,
            message: statusCodes_1.statusCodes.error.BAD_REQUEST.message,
          });
      }
      yield user.update(value);
      console.log("user", user);
      return res.status(statusCodes_1.statusCodes.success.OK.code).json({
        status: statusCodes_1.statusCodes.success.OK.code,
        message: "User details updated successfully",
        data: user,
      });
    } catch (error) {
      return res
        .status(statusCodes_1.statusCodes.error.SERVER_ERROR.code)
        .json({
          status: statusCodes_1.statusCodes.error.SERVER_ERROR.code,
          message: statusCodes_1.statusCodes.error.SERVER_ERROR.message,
        });
    }
  });
exports.updateBasicDetails = updateBasicDetails;
const getPersonalDetails = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const userDetails = yield users_1.default.findByPk(req.user.id);
      if (
        userDetails === null || userDetails === void 0
          ? void 0
          : userDetails.dataValues
      ) {
        let data = {
          dob: userDetails.dob || "",
          gender: userDetails.gender || "",
          marital_status: userDetails.marital_status || "",
          social: userDetails.social || "",
          ssn: userDetails.ssn || null,
          kids:
            userDetails.kids !== undefined && userDetails.kids !== null
              ? userDetails.kids
              : null,
        };
        res.status(statusCodes_1.statusCodes.success.OK.code).json({
          status: statusCodes_1.statusCodes.success.OK.code,
          message: statusCodes_1.statusCodes.success.OK.message,
          data,
        });
      } else {
        res.status(statusCodes_1.statusCodes.error.NOT_FOUND.code).json({
          status: statusCodes_1.statusCodes.error.NOT_FOUND.code,
          message: statusCodes_1.statusCodes.error.NOT_FOUND.code,
        });
      }
    } catch (error) {
      console.error(error);
      res.status(statusCodes_1.statusCodes.error.SERVER_ERROR.code).json({
        status: statusCodes_1.statusCodes.error.SERVER_ERROR.code,
        message: statusCodes_1.statusCodes.error.SERVER_ERROR.code,
      });
    }
  });
exports.getPersonalDetails = getPersonalDetails;
const updatePersonalDetails = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { error, value } = validationSchema_1.updatePersonalSchema.validate(
        req.body
      );
      if (error) {
        return res
          .status(statusCodes_1.statusCodes.error.BAD_REQUEST.code)
          .json({
            status: statusCodes_1.statusCodes.error.BAD_REQUEST.code,
            message: error.details[0].message,
          });
      }
      const user = yield users_1.default.findByPk(req.user.id);
      if (!user) {
        return res
          .status(statusCodes_1.statusCodes.error.BAD_REQUEST.code)
          .json({
            status: statusCodes_1.statusCodes.error.BAD_REQUEST.code,
            message: statusCodes_1.statusCodes.error.BAD_REQUEST.message,
          });
      }
      yield user.update(value);
      console.log("new Update ", user);
      return res.status(statusCodes_1.statusCodes.success.OK.code).json({
        status: statusCodes_1.statusCodes.success.OK.code,
        message: "User details updated successfully",
        data: user,
      });
    } catch (error) {
      return res
        .status(statusCodes_1.statusCodes.error.SERVER_ERROR.code)
        .json({
          status: statusCodes_1.statusCodes.error.SERVER_ERROR.code,
          message: statusCodes_1.statusCodes.error.SERVER_ERROR.message,
        });
    }
  });
exports.updatePersonalDetails = updatePersonalDetails;
const createWave = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.file);
    try {
      let values = {
        image: req.file && req.file.filename,
        message: req.body.message,
        userId: req.user.id,
      };
      let newWave = yield waves_1.default.create(values);
      if (newWave) {
        return res.status(statusCodes_1.statusCodes.success.OK.code).json({
          status: statusCodes_1.statusCodes.success.OK.code,
          message: "Wave Created Successfully Done",
        });
      } else {
        return res
          .status(statusCodes_1.statusCodes.error.BAD_REQUEST.code)
          .json({
            status: statusCodes_1.statusCodes.error.BAD_REQUEST.code,
            message: statusCodes_1.statusCodes.error.BAD_REQUEST.code,
          });
      }
    } catch (_a) {
      return res
        .status(statusCodes_1.statusCodes.error.SERVER_ERROR.code)
        .json({
          status: statusCodes_1.statusCodes.error.SERVER_ERROR.code,
          message: statusCodes_1.statusCodes.error.SERVER_ERROR.message,
        });
    }
  });
exports.createWave = createWave;
const getWaveList = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    let data = [];
    try {
      let waveList = yield waves_1.default.findAll({
        where: { userId: req.user.id },
      });
      if (waveList) {
        for (let i = 0; i < waveList.length; i++) {
          data.push({
            id: waveList[i].dataValues.id,
            status: waveList[i].dataValues.status,
            message: waveList[i].dataValues.message,
          });
        }
        return res.status(statusCodes_1.statusCodes.success.OK.code).json({
          status: statusCodes_1.statusCodes.success.OK.code,
          message: statusCodes_1.statusCodes.success.OK.message,
          data,
        });
      } else {
        return res
          .status(statusCodes_1.statusCodes.error.BAD_REQUEST.code)
          .json({
            status: statusCodes_1.statusCodes.error.NOT_FOUND.code,
            message: "No Waves",
          });
      }
    } catch (error) {
      return res
        .status(statusCodes_1.statusCodes.error.SERVER_ERROR.code)
        .json({
          status: statusCodes_1.statusCodes.error.SERVER_ERROR.code,
          message: statusCodes_1.statusCodes.error.SERVER_ERROR.message,
        });
    }
  });
exports.getWaveList = getWaveList;
const updateWaveStatus = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const result = yield waves_1.default.update(
        { status: req.body.status }, //
        { where: { id: req.body.id } } //
      );
      if (result[0] > 0) {
        return res.status(statusCodes_1.statusCodes.success.OK.code).json({
          status: statusCodes_1.statusCodes.success.OK.code,
          message: "Status changed successfully",
        });
      } else {
        return res
          .status(statusCodes_1.statusCodes.error.BAD_REQUEST.code)
          .json({
            status: statusCodes_1.statusCodes.error.BAD_REQUEST.code,
            message: "No record found to update or no changes made",
          });
      }
    } catch (error) {
      console.error("Error updating wave status:", error);
      return res
        .status(statusCodes_1.statusCodes.error.SERVER_ERROR.code)
        .json({
          status: statusCodes_1.statusCodes.error.SERVER_ERROR.code,
          message: statusCodes_1.statusCodes.error.SERVER_ERROR.message,
        });
    }
  });
exports.updateWaveStatus = updateWaveStatus;
const getAllWaveList = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      let waveList = yield waves_1.default.findAll({
        attributes: ["id", "userId", "image", "message"],
        where: {
          status: 1,
        },
        order: [["id", "DESC"]],
      });
      if (waveList) {
        let data = [];
        for (let i = 0; i < waveList.length; i++) {
          const userDetails = yield users_1.default.findByPk(
            waveList[i].dataValues.userId,
            {
              attributes: ["id", "first_name", "last_name", "profileIcon"],
            }
          );
          data.push({
            id: waveList[i].dataValues.id,
            message: waveList[i].dataValues.message,
            image: waveList[i].dataValues.message
              ? `http://localhost:4000/uploads/${waveList[i].dataValues.image}`
              : null,
            first_name:
              userDetails === null || userDetails === void 0
                ? void 0
                : userDetails.dataValues.first_name,
            last_name:
              userDetails === null || userDetails === void 0
                ? void 0
                : userDetails.dataValues.last_name,
            profileIcon: (
              userDetails === null || userDetails === void 0
                ? void 0
                : userDetails.dataValues.profileIcon
            )
              ? `http://localhost:4000/uploads/${userDetails.dataValues.profileIcon}`
              : null,
          });
        }
        return res.status(statusCodes_1.statusCodes.success.OK.code).json({
          status: statusCodes_1.statusCodes.success.OK.code,
          message: "Wave list fetch Successfully",
          data,
        });
      } else {
        return res.status(statusCodes_1.statusCodes.error.NOT_FOUND.code).json({
          status: statusCodes_1.statusCodes.error.NOT_FOUND.code,
          message: "No waves",
        });
      }
    } catch (error) {
      return res
        .status(statusCodes_1.statusCodes.error.SERVER_ERROR.code)
        .json({
          status: statusCodes_1.statusCodes.error.SERVER_ERROR.code,
          message: statusCodes_1.statusCodes.error.SERVER_ERROR.message,
        });
    }
  });
exports.getAllWaveList = getAllWaveList;
const addCommentWave = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const userDetails = yield users_1.default.findByPk(req.user.id, {
        attributes: ["id", "first_name", "last_name"],
      });
      const values = {
        waveId: req.body.waveId,
        comment: req.body.comment,
        commenterId: req.user.id,
        commenterfirst_name:
          userDetails === null || userDetails === void 0
            ? void 0
            : userDetails.dataValues.first_name,
        commenterLastName:
          userDetails === null || userDetails === void 0
            ? void 0
            : userDetails.dataValues.last_name,
      };
      let newWave = yield models_1.Comment.create(values);
      console.log(newWave);
      if (newWave) {
        return res.status(statusCodes_1.statusCodes.success.OK.code).json({
          status: statusCodes_1.statusCodes.success.OK.code,
          message: "Comment Posted",
          values,
        });
      } else {
        return res.status(statusCodes_1.statusCodes.error.NOT_FOUND.code).json({
          status: statusCodes_1.statusCodes.error.NOT_FOUND.code,
          message: "Not found",
        });
      }
    } catch (error) {
      return res
        .status(statusCodes_1.statusCodes.error.SERVER_ERROR.code)
        .json({
          status: statusCodes_1.statusCodes.error.SERVER_ERROR.code,
          message: statusCodes_1.statusCodes.error.SERVER_ERROR.message,
        });
    }
  });
exports.addCommentWave = addCommentWave;
const getComment = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const commentList = yield models_1.Comment.findAll({
        attributes: ["id", "commenterId", "comment"],
        where: {
          waveId: req.params.id,
          deletedAt: null,
          status: 1,
        },
        order: [["id", "DESC"]],
        include: [
          {
            model: users_1.default,
            as: "commenter", // Ensure that 'commenter' is the alias used for the association
            attributes: ["first_name", "last_name"], // Only fetch the first and last names
          },
        ],
      });
      if (commentList && commentList.length > 0) {
        let data = [];
        for (let i = 0; i < commentList.length; i++) {
          const commenter = commentList[i].commenter; // commenter will now be recognized
          data.push({
            id: commentList[i].dataValues.id,
            commenterId: commentList[i].commenterId,
            comment: commentList[i].comment,
            commenterName: `${
              commenter === null || commenter === void 0
                ? void 0
                : commenter.first_name
            } ${
              commenter === null || commenter === void 0
                ? void 0
                : commenter.last_name
            }`, // Combine first and last name
            isSameUser:
              commentList[i].commenterId === req.user.id ? true : false,
          });
        }
        return res.status(statusCodes_1.statusCodes.success.OK.code).json({
          status: statusCodes_1.statusCodes.success.OK.code,
          message: "Message Fetched Successfully",
          data,
        });
      } else {
        return res.status(statusCodes_1.statusCodes.error.NOT_FOUND.code).json({
          message: "No Comment",
        });
      }
    } catch (error) {
      console.log(error);
      return res
        .status(statusCodes_1.statusCodes.error.SERVER_ERROR.code)
        .json({
          status: statusCodes_1.statusCodes.error.SERVER_ERROR.code,
          message: statusCodes_1.statusCodes.error.SERVER_ERROR.message,
        });
    }
  });
exports.getComment = getComment;
const deleteComment = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      console.log(req.params);
      const commenterId = req.params.id;
      console.log(commenterId);
      const comment = yield models_1.Comment.findByPk(commenterId);
      if (!comment) {
        return res.status(statusCodes_1.statusCodes.error.NOT_FOUND.code).json({
          status: statusCodes_1.statusCodes.error.NOT_FOUND.code,
          message: "Comment not found",
        });
      }
      yield comment.destroy();
      return res.status(statusCodes_1.statusCodes.success.OK.code).json({
        status: statusCodes_1.statusCodes.success.OK.code,
        message: "Comment deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
      return res
        .status(statusCodes_1.statusCodes.error.SERVER_ERROR.code)
        .json({
          status: statusCodes_1.statusCodes.error.SERVER_ERROR.code,
          message: error.message || "Internal Server Error",
        });
    }
  });
exports.deleteComment = deleteComment;
const updateComment = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const result = yield models_1.Comment.update(
        { comment: req.body.comment },
        { where: { id: req.body.id } }
      );
      if (result) {
        return res.status(statusCodes_1.statusCodes.success.OK.code).json({
          status: statusCodes_1.statusCodes.success.OK.code,
          message: "Comment Updated Successfully",
        });
      } else {
        return res
          .status(statusCodes_1.statusCodes.error.BAD_REQUEST.code)
          .json({
            status: statusCodes_1.statusCodes.error.NOT_FOUND.code,
            message: "Something Went wrong",
          });
      }
    } catch (error) {
      return res
        .status(statusCodes_1.statusCodes.error.SERVER_ERROR.code)
        .json({
          status: statusCodes_1.statusCodes.error.SERVER_ERROR.code,
          message: statusCodes_1.statusCodes.error.SERVER_ERROR.message,
        });
    }
  });
exports.updateComment = updateComment;
const GetAcceptedFriends = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      // Fetch all invites where isAccepted is true
      const acceptedFriends = yield models_1.Friend.findAll({
        attributes: ["id", "inviteEmail", "inviteName", "status", "isAccepted"],
        where: {
          inviterId: req.user.id, // Match the inviterId to the current user's ID
          isAccepted: true, // Fetch only accepted friends
        },
        order: [["id", "DESC"]], // Order by ID in descending order
      });
      if (acceptedFriends.length > 0) {
        let data = []; // Array to store the formatted response
        // Loop through each accepted friend
        for (let i = 0; i < acceptedFriends.length; i++) {
          const friend = acceptedFriends[i].dataValues;
          let name = friend.inviteName || ""; // Default to inviteName if no user record is found
          let icon = null;
          // Check for actual user details (first_name, last_name, profileIcon)
          const fetchActualData = yield users_1.default.findOne({
            attributes: ["id", "first_name", "last_name", "profileIcon"],
            where: { email: friend.inviteEmail }, // Match user by email
          });
          if (fetchActualData) {
            name = `${fetchActualData.first_name || ""} ${
              fetchActualData.last_name || ""
            }`.trim();
            icon = fetchActualData.profileIcon
              ? `http://localhost:4000/uploads/${fetchActualData.profileIcon}`
              : null;
          }
          // Push formatted data to the response array
          data.push({
            id: friend.id,
            name,
            email: friend.inviteEmail,
            icon,
          });
        }
        // Send response with accepted friends
        return res.status(200).json({
          status: 200,
          message: "Accepted Friends Fetched Successfully",
          data,
        });
      } else {
        // No accepted friends found
        return res.status(404).json({
          status: 404,
          message: "No Accepted Friends Found",
        });
      }
    } catch (error) {
      console.error("Error fetching accepted friends:", error);
      // Handle server error
      return res.status(500).json({
        status: 500,
        message: "An error occurred while fetching accepted friends.",
      });
    }
  });
exports.GetAcceptedFriends = GetAcceptedFriends;
