import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { statusCodes } from "../utils/statusCodes";
import nodemailer from "nodemailer";
import {
  LoginMessage,
  signupMessage,
  userDetailsMessage,
} from "../utils/statusMessages";
import User from "../models/users";
import {
  validatePassword,
  signupSchema,
  updateUserSchema,
  updatePersonalSchema,
  inviteFriendSchema,
} from "../utils/validationSchema";
import { handleValidationError } from "../utils/handleValidationError";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { verifyToken } from "../middleware/verifyToken";
import { Comment, Friend, Preference } from "../models";
import { Admin } from "../models";
import Wave from "../models/waves";
import { profile } from "console";
import { Op } from "sequelize";
dotenv.config();

export const registerAdmin = async (req: any, res: Response): Promise<void> => {
  try {
    const { adminEmail, adminPassword, adminFullName } = req.body;

    console.log("Received admin data:", req.body);

    if (!adminEmail || !adminPassword || !adminFullName) {
      console.log("Missing fields:", {
        adminEmail,
        adminPassword,
        adminFullName,
      });
      res.status(statusCodes.error.UNAUTHORIZED.code).json({
        error: signupMessage.error.missingFields,
      });
      return;
    }

    const existingAdmin = await Admin.findOne({ where: { adminEmail } });
    if (existingAdmin) {
      console.log("Admin with this email already exists:", adminEmail);
      res.status(statusCodes.error.UNAUTHORIZED.code).json({
        error: signupMessage.error.emailTaken,
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    console.log("Hashed password:", hashedPassword);

    const newAdmin = await Admin.create({
      adminEmail,
      adminPassword: hashedPassword,
      adminFullName,
    });

    console.log("New admin created:", newAdmin);

    res.status(statusCodes.success.OK.code).json({
      message: signupMessage.success.adminCreated,
      admin: {
        id: newAdmin.id,
        adminEmail: newAdmin.adminEmail,
        adminFullName: newAdmin.adminFullName,
      },
    });
  } catch (error) {
    console.error("Error in registerAdmin:", error);
    res.status(statusCodes.error.SERVER_ERROR.code).json({
      error: signupMessage.error.serverError,
    });
  }
};

export const loginAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { adminEmail, adminPassword } = req.body;

    if (!adminEmail || !adminPassword) {
      res.status(statusCodes.error.UNAUTHORIZED.code).json({
        error: LoginMessage.error.missingFields,
      });
      return;
    }

    const existingAdmin = await Admin.findOne({ where: { adminEmail } });

    if (!existingAdmin) {
      res.status(statusCodes.error.NOT_FOUND.code).json({
        error: LoginMessage.error.invalidCredentials,
      });
      return;
    }

    const passwordMatch = await bcrypt.compare(
      adminPassword,
      existingAdmin.adminPassword
    );

    if (!passwordMatch) {
      res.status(statusCodes.error.UNAUTHORIZED.code).json({
        error: LoginMessage.error.invalidCredentials,
      });
      return;
    }

    const token = jwt.sign(
      { id: existingAdmin.id, adminEmail: existingAdmin.adminEmail },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    res.status(statusCodes.success.OK.code).json({
      message: LoginMessage.success.loginSuccess,
      token,
      admin: {
        id: existingAdmin.id,
        adminEmail: existingAdmin.adminEmail,
      },
    });
  } catch (error) {
    console.error("Error During Admin Login", error);
    res.status(statusCodes.error.SERVER_ERROR.code).json({
      error: LoginMessage.error.serverError,
    });
  }
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.findAll({
      attributes: [
        "id",
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
        "status",
        "ssn",
        "profileIcon",
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
      first_name: user.first_name,
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
      ssn: user.ssn,
      profileIcon: user.profileIcon
        ? `http://localhost:4000/uploads/${user.profileIcon}`
        : null,
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
};

export const getUserByIdForAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await User.findOne({
      attributes: [
        "id",
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
        "marital_status",
        "social",
        "kids",
        "ssn",
        "status",
        "profileIcon",
      ],
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    const userDetails = {
      id: user.id,
      first_name: user.first_name,
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
      ssn: user.ssn,
      profileIcon: user.profileIcon,
    };

    res.status(200).json({
      message: "User Details Found Successfully",
      user: userDetails,
    });
  } catch (error) {
    console.error("Error Fetching User Details", error);
    res.status(500).json({
      error: "An Error Occurred While Fetching User Details",
    });
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({
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
    await user.destroy();

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      error: "An error occurred while deleting the user",
    });
  }
};

export const deleteWave = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { waveId } = req.params;
    const wave = await Wave.findOne({
      where: {
        id: waveId,
        status: 1,
      },
    });

    if (!wave) {
      res.status(404).json({
        error: "Wave not found",
      });
      return;
    }
    wave.status = 0;
    await wave.save();

    res.status(200).json({
      message: "Wave deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting wave:", error);
    res.status(500).json({
      error: "An error occurred while deleting the wave",
    });
  }
};

export const toggleUserStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;

  try {
    const user: any = await User.findByPk(userId);

    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    const newStatus = !user?.status;
    user.status = newStatus;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Status update successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error updating user status:", error);
    res.status(500).json({
      message: "An error occurred while updating user status",
    });
  }
};

export const getAdminProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      res.status(401).json({ error: "Unauthorized: No token provided" });
      return;
    }

    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { id: number; adminEmail: string };

    const adminProfile = await Admin.findByPk(decodedToken.id, {
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
};

export const editAdminUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;
    const {
      first_name,
      last_name,
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
    } = req.body;

    const user = await User.findOne({
      where: { id: userId, deletedAt: null },
    });

    if (!user) {
      res.status(404).json({
        error: "User not found",
      });
      return;
    }

    user.first_name = first_name || user.first_name;
    user.last_name = last_name || user.last_name;
    user.phone_number = phone_number || user.phone_number;
    user.address1 = address1 || user.address1;
    user.address2 = address2 || user.address2;
    user.city = city || user.city;
    user.state = state || user.state;
    user.zip = zip || user.zip;
    user.dob = dob || user.dob;
    user.gender = gender || user.gender;
    user.marital_status = marital_status || user.marital_status;
    user.social = social || user.social;
    user.kids = kids || user.kids;

    await user.save();

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
      },
    });
  } catch (error) {
    console.error("Error editing user details:", error);
    res.status(500).json({
      error: "An error occurred while updating the user's details.",
    });
  }
};

// export const editAdminUser = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { userId } = req.params;
//     const {
//       first_name,
//       last_name,
//       phone_number,
//       address1,
//       address2,
//       city,
//       state,
//       zip,
//       dob,
//       gender,
//       marital_status,
//       social,
//       kids,
//     } = req.body;
    
//     const file = req.file; // Get uploaded file

//     const user = await User.findOne({
//       where: { id: userId, deletedAt: null },
//     });

//     if (!user) {
//       res.status(404).json({ error: "User not found" });
//       return;
//     }

//     // Update user details
//     user.first_name = first_name || user.first_name;
//     user.last_name = last_name || user.last_name;
//     user.phone_number = phone_number || user.phone_number;
//     user.address1 = address1 || user.address1;
//     user.address2 = address2 || user.address2;
//     user.city = city || user.city;
//     user.state = state || user.state;
//     user.zip = zip || user.zip;
//     user.dob = dob || user.dob;
//     user.gender = gender || user.gender;
//     user.marital_status = marital_status || user.marital_status;
//     user.social = social || user.social;
//     user.kids = kids || user.kids;


//     if (file) {
//       user.profileIcon = file.filename;
//     }

//     await user.save();

//     res.status(200).json({
//       message: "User details updated successfully",
//       user: {
//         id: user.id,
//         first_name: user.first_name,
//         last_name: user.last_name,
//         email: user.email,
//         phone_number: user.phone_number,
//         address1: user.address1,
//         address2: user.address2,
//         city: user.city,
//         state: user.state,
//         zip: user.zip,
//         dob: user.dob,
//         gender: user.gender,
//         marital_status: user.marital_status,
//         social: user.social,
//         kids: user.kids,
//         profileIcon: file ? `http://localhost:4000/uploads/${file.filename}` : user.profileIcon,
//       },
//     });
//   } catch (error) {
//     console.error("Error editing user details:", error);
//     res.status(500).json({ error: "An error occurred while updating the user's details." });
//   }
// };



// export const getAllWaveListAdmin = async (req: any, res: any) => {
//   try {
//     const waveList: any = await Wave.findAll({
//       attributes: ["id", "userId", "image", "message", "createdAt"],
//       where: {
//         status: 1,
//       },
//       order: [["id", "DESC"]],
//     });

//     if (waveList && waveList.length > 0) {
//       const data = await Promise.all(
//         waveList.map(async (wave: any) => {
//           const userDetails = await User.findByPk(wave.dataValues.userId, {
//             attributes: ["id", "first_name", "last_name", "profileIcon"],
//           });
//           return {
//             id: wave.dataValues.id,
//             message: wave.dataValues.message,
//             createdAt: wave.dataValues.createdAt,
//             image: wave.dataValues.image
//               ? `http://localhost:4000/uploads/${wave.dataValues.image}`
//               : null,
//             first_name: userDetails?.dataValues.first_name,
//             last_name: userDetails?.dataValues.last_name,
//             profileIcon: userDetails?.dataValues.profileIcon
//               ? `http://localhost:4000/uploads/${userDetails.dataValues.profileIcon}`
//               : null,
//           };
//         })
//       );

//       return res.status(statusCodes.success.OK.code).json({
//         status: statusCodes.success.OK.code,
//         message: "Wave list fetched successfully",
//         data,
//       });
//     } else {
//       return res.status(statusCodes.error.NOT_FOUND.code).json({
//         status: statusCodes.error.NOT_FOUND.code,
//         message: "No waves found",
//       });
//     }
//   } catch (error) {
//     return res.status(statusCodes.error.SERVER_ERROR.code).json({
//       status: statusCodes.error.SERVER_ERROR.code,
//       message: statusCodes.error.SERVER_ERROR.message,
//     });
//   }
// };



export const getAllWaveListAdmin = async (req: any, res: any) => {
  try {
    const waveList: any = await Wave.findAll({
      attributes: ["id", "userId", "image", "message", "createdAt"],
      where: {
        status: 1,
      },
      order: [["id", "DESC"]],
    });

    if (waveList && waveList.length > 0) {
      const data = await Promise.all(
        waveList.map(async (wave: any) => {
          const userDetails = await User.findByPk(wave.dataValues.userId, {
            attributes: ["id", "first_name", "last_name", "profileIcon"],
          });

          return {
            id: wave.dataValues.id,
            message: wave.dataValues.message,
            createdAt: wave.dataValues.createdAt,
            image: wave.dataValues.image
              ? `http://localhost:4000/uploads/${wave.dataValues.image}`
              : null,
            first_name: userDetails?.dataValues.first_name,
            last_name: userDetails?.dataValues.last_name,
            profileIcon: userDetails?.dataValues.profileIcon
              ? `http://localhost:4000/uploads/${userDetails.dataValues.profileIcon}`
              : null,
          };
        })
      );

      return res.status(statusCodes.success.OK.code).json({
        status: statusCodes.success.OK.code,
        message: "Wave list fetched successfully",
        data,
      });
    } else {
      return res.status(statusCodes.error.NOT_FOUND.code).json({
        status: statusCodes.error.NOT_FOUND.code,
        message: "No waves found",
      });
    }
  } catch (error) {
    return res.status(statusCodes.error.SERVER_ERROR.code).json({
      status: statusCodes.error.SERVER_ERROR.code,
      message: statusCodes.error.SERVER_ERROR.message,
    });
  }
};

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error } = signupSchema.validate(req.body);
    if (error) {
      res.status(statusCodes.error.BAD_REQUEST.code).json({
        error: error.details[0].message,
      });
      return;
    }

    const { first_name, last_name, email, phone_number, password } = req.body;

    if (!first_name || !last_name || !email || !phone_number || !password) {
      res.status(statusCodes.error.UNAUTHORIZED.code).json({
        error: signupMessage.error.missingFields,
      });
      return;
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(statusCodes.error.UNAUTHORIZED.code).json({
        error: signupMessage.error.emailTaken,
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      first_name,
      last_name,
      email,
      phone_number,
      password: hashedPassword,
      status: 1,
    });
    const pendingFriends = await Friend.findAll({
      where: { inviteEmail: email, status: 0, isAccepted: 0 },
    });

    if (pendingFriends.length > 0) {
      await Friend.update(
        { status: 1, isAccepted: 1 },
        { where: { inviteEmail: email, status: 0, isAccepted: 0 } }
      );
    }

    res.status(statusCodes.success.OK.code).json({
      message: signupMessage.success.userCreated,
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
    res.status(statusCodes.error.SERVER_ERROR.code).json({
      error: signupMessage.error.serverError,
    });
  }
};

export const login = async (req: any, res: any): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(statusCodes.error.UNAUTHORIZED.code).json({
        error: LoginMessage.error.missingFields,
      });
      return;
    }

    const user: any = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(statusCodes.error.UNAUTHORIZED.code).json({
        error: LoginMessage.error.invalidCredentials,
      });
    }
    if (!user.status) {
      return res.status(statusCodes.error.UNAUTHORIZED.code).json({
        error: "Your account is inactive. Please contact the admin.",
      });
    }
    console.log(user.status);
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(statusCodes.error.UNAUTHORIZED.code).json({
        error: LoginMessage.error.invalidCredentials,
      });
      return;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    res.status(statusCodes.success.OK.code).json({
      message: LoginMessage.success.loginSuccess,
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
    res.status(statusCodes.error.SERVER_ERROR.code).json({
      error: LoginMessage.error.serverError,
    });
  }
};

export const getUserDetails = async (req: any, res: any) => {
  try {
    const { id } = req.user;
    const userDetails = await User.findByPk(id, {
      attributes: ["id", "first_name", "last_name", "email", "profileIcon"],
    });

    if (userDetails?.dataValues) {
      const { first_name, last_name, profileIcon } = userDetails;
      return res.status(statusCodes.success.OK.code).json({
        message: userDetailsMessage.success.message,
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

    return res.status(statusCodes.error.NOT_FOUND).json({
      error: userDetailsMessage.error.notfound,
    });
  } catch (error) {
    console.error("Error fetching user details:", error);

    return res.status(statusCodes.error.SERVER_ERROR).json({
      message: userDetailsMessage.error.serverError,
    });
  }
};

export const changePassword = async (req: any, res: any) => {
  const { old_password, password } = req.body;

  try {
    const { error } = validatePassword({ old_password, password });
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const userId = req.user.id;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const isMatch = await bcrypt.compare(old_password, user.password);
    if (!isMatch) {
      return res
        .status(statusCodes.error.UNAUTHORIZED.code)
        .json({ error: "Current password is incorrect." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    await user.save();

    res
      .status(statusCodes.success.OK.code)
      .json({ message: "Password changed successfully." });
  } catch (error) {
    console.error("Error changing password:", error);
    res
      .status(statusCodes.error.SERVER_ERROR.code)
      .json({ error: "An error occurred while changing the password." });
  }
};

export const AddInviteFriend = async (req: any, res: any) => {
  try {
    const { inviteEmail, inviteName, inviteMessage } = req.body;

    const { error } = inviteFriendSchema.validate({
      inviteEmail,
      inviteName,
      inviteMessage,
    });

    if (error) {
      return res
        .status(statusCodes.error.BAD_REQUEST.code)
        .json({ message: error.details[0].message });
    }

    let isInvited = await Friend.findOne({
      where: {
        inviteEmail: req.body.inviteEmail,
        inviterId: req.user.id,
      },
    });

    if (isInvited) {
      return res.status(statusCodes.error.FORBIDDEN.code).json({
        status: statusCodes.error.FORBIDDEN.code,
        message: "Already Invited",
      });
    }

    let IsEmailExists = await User.findOne({
      where: { email: req.body.inviteEmail },
    });

    const token = jwt.sign(
      { email: req.body.inviteEmail },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "1h" }
    );
    console.log(process.env.BASE_URL);
    console.log(process.env.SIGNUP_URL);
    const registrationLink = `${process.env.BASE_URL}${process.env.SIGNUP_URL}/?token=${token}`;

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: "gmail",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: req.body.inviteEmail,
      subject: "You've been invited to register",
      html: `
        <p>Hello ${req.body.inviteName},</p>
        <p>You've been invited to join our platform. To complete your registration, please click the link below:</p>
        <p><a href="${registrationLink}" style="color: #3e5677; font-weight: bold;">Click here to register</a></p>
        <p>If you did not request this invitation, please ignore this email.</p>
        <p>Best regards,<br>SmartData Enterprises</p>
      `,
    };

    transporter.sendMail(mailOptions, (error: any) => {
      if (error) {
        console.error("Error sending email:", error);
        return res
          .status(500)
          .json({ message: "Error sending invitation email" });
      }

      console.log("Email sent successfully");
    });

    const values: any = {
      inviterId: req.user.id,
      inviteEmail: req.body.inviteEmail,
      inviteMessage: req.body.inviteMessage,
      inviteName: req.body.inviteName,
      status: IsEmailExists ? 1 : 0,
      isAccepted: IsEmailExists ? 1 : 0,
    };
    let newInvite = await Friend.create(values);

    if (newInvite) {
      res.status(statusCodes.success.OK.code).json({
        message: "Invitation sent successfully",
        inviteId: newInvite.id,
        status: "Pending",
      });
    } else {
      res
        .status(statusCodes.error.SERVER_ERROR.code)
        .json({ message: "Failed to create invitation" });
    }
  } catch (error) {
    console.error("Error during invitation creation:", error);
    res
      .status(statusCodes.error.SERVER_ERROR.code)
      .json({ message: "Internal server error" });
  }
};

export const GetInviteFriend = async (req: any, res: any) => {
  try {
    const getInviteDetails = await Friend.findAll({
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
      let data: any[] = [];

      if (getInviteDetails.length > 0) {
        for (let i = 0; i < getInviteDetails.length; i++) {
          id = getInviteDetails[i].dataValues.id;
          email = getInviteDetails[i].dataValues.inviteEmail || "";
          isAccepted = getInviteDetails[i].dataValues.isAccepted;

          if (getInviteDetails[i].dataValues.status) {
            const fetchActualData = await User.findAll({
              attributes: ["id", "first_name", "last_name", "profileIcon"],
              where: { email: getInviteDetails[i].dataValues.inviteEmail },
            });

            if (fetchActualData && fetchActualData.length > 0) {
              name = `${fetchActualData[0].dataValues.first_name || ""} ${
                fetchActualData[0].dataValues.last_name || ""
              }`;
              icon = fetchActualData[0].dataValues.profileIcon
                ? `http://localhost:4000/uploads/${fetchActualData[0].dataValues.profileIcon}`
                : null;
            } else {
              name = getInviteDetails[i].dataValues.inviteName || "";
              icon = null;
            }
          } else {
            name = getInviteDetails[i].dataValues.inviteName || "";
            icon = null;
          }
          data.push({
            id,
            name,
            email,
            icon,
            isAccepted,
          });
        }

        return res.status(statusCodes.success.OK.code).json({
          status: statusCodes.success.OK.code,
          message: "Invited Details Get Successfully",
          data,
        });
      } else {
        return res.status(statusCodes.error.NOT_FOUND.code).json({
          status: statusCodes.error.NOT_FOUND.code,
          message: "Not Invited yet",
        });
      }
    } else {
      return res.status(statusCodes.error.SERVER_ERROR.code).json({
        status: statusCodes.error.SERVER_ERROR.code,
        message: statusCodes.error.SERVER_ERROR.message,
      });
    }
  } catch (error) {
    console.error("Error fetching invite friends:", error);
    return res.status(statusCodes.error.SERVER_ERROR.code).json({
      status: statusCodes.error.SERVER_ERROR.code,
      message: "An error occurred while fetching invite details.",
    });
  }
};

export const getPreferenceDetailsById = async (req: any, res: any) => {
  const {id:userId} = req.user;
  let data = null;

  try {
    const PreferenceDetails = await Preference.findOne({
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

      return res.status(statusCodes.success.OK.code).json({
        success: true,
        message: "Preference details fetched Successfully",
        data: data,
      });
    }
  } catch (error) {
    return res.status(statusCodes.error.SERVER_ERROR.code).json({
      success: false,
      message: statusCodes.error.SERVER_ERROR.message,
    });
  }
};

export const updateOrCreatePreference = async (req: any, res: any) => {
  const {id:userId} = req.user;
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
    let preference: any = await Preference.findOne({
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

      await preference.save();

      console.log("preference", preference);
      return res.status(statusCodes.success.OK.code).json({
        success: true,
        message: "Preference Updated Successfully",
        data: preference,
      });
    } else {
      preference = await Preference.create({
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

      return res.status(statusCodes.success.OK.code).json({
        success: true,
        message: "Preference Created Successfully",
        data: preference,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(statusCodes.error.SERVER_ERROR.code).json({
      success: false,
      message: statusCodes.error.SERVER_ERROR.message,
    });
  }
};

export const updateProfile = async (req: any, res: any) => {
  let data = null;
  const file = req.file;
  console.log(file);
  try {
    const result = await User.update(
      { profileIcon: file.filename || null },
      {
        where: { id: req.user.id },
      }
    );

    if (result) {
      data = {
        profileIcon: `http://localhost:4000/uploads/${file.filename}`,
      };
      res.status(statusCodes.success.OK.code).json({
        status: statusCodes.success.OK.code,
        message: "Profile Picture Updated Successfully",
        data,
      });
    } else {
      res.status(statusCodes.error.BAD_REQUEST.code).json({
        status: statusCodes.error.BAD_REQUEST.code,
        message: "Something went wrong",
      });
    }
  } catch (error) {
    res.status(statusCodes.error.SERVER_ERROR.code).json({
      message: statusCodes.error.SERVER_ERROR.message,
    });
  }
};

export const getBasicDetails = async (req: any, res: any) => {
  try {
    const userDetails = await User.findByPk(req.user.id);

    if (userDetails?.dataValues) {
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

      res.status(statusCodes.success.OK.code).json({
        status: statusCodes.success.OK.code,
        message: statusCodes.success.OK.message,
        data,
      });
    } else {
      res.status(statusCodes.error.NOT_FOUND.code).json({
        status: statusCodes.error.NOT_FOUND.code,
        message: statusCodes.error.NOT_FOUND.code,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(statusCodes.error.SERVER_ERROR.code).json({
      status: statusCodes.error.SERVER_ERROR.code,
      message: statusCodes.error.SERVER_ERROR.code,
    });
  }
};

export const updateBasicDetails = async (req: any, res: any) => {
  try {
    const { error, value } = updateUserSchema.validate(req.body);

    if (error) {
      return res.status(statusCodes.error.BAD_REQUEST.code).json({
        status: statusCodes.error.BAD_REQUEST.code,
        message: error.details[0].message,
      });
    }
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(statusCodes.error.BAD_REQUEST.code).json({
        status: statusCodes.error.BAD_REQUEST.code,
        message: statusCodes.error.BAD_REQUEST.message,
      });
    }

    await user.update(value);

    console.log("user", user);

    return res.status(statusCodes.success.OK.code).json({
      status: statusCodes.success.OK.code,
      message: "User details updated successfully",
      data: user,
    });
  } catch (error) {
    return res.status(statusCodes.error.SERVER_ERROR.code).json({
      status: statusCodes.error.SERVER_ERROR.code,
      message: statusCodes.error.SERVER_ERROR.message,
    });
  }
};

export const getPersonalDetails = async (req: any, res: any) => {
  try {
    const userDetails = await User.findByPk(req.user.id);

    if (userDetails?.dataValues) {
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

      res.status(statusCodes.success.OK.code).json({
        status: statusCodes.success.OK.code,
        message: statusCodes.success.OK.message,
        data,
      });
    } else {
      res.status(statusCodes.error.NOT_FOUND.code).json({
        status: statusCodes.error.NOT_FOUND.code,
        message: statusCodes.error.NOT_FOUND.code,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(statusCodes.error.SERVER_ERROR.code).json({
      status: statusCodes.error.SERVER_ERROR.code,
      message: statusCodes.error.SERVER_ERROR.code,
    });
  }
};

export const updatePersonalDetails = async (req: any, res: any) => {
  try {
    const { error, value } = updatePersonalSchema.validate(req.body);
    if (error) {
      return res.status(statusCodes.error.BAD_REQUEST.code).json({
        status: statusCodes.error.BAD_REQUEST.code,
        message: error.details[0].message,
      });
    }

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(statusCodes.error.BAD_REQUEST.code).json({
        status: statusCodes.error.BAD_REQUEST.code,
        message: statusCodes.error.BAD_REQUEST.message,
      });
    }

    await user.update(value);
    console.log("new Update ", user);
    return res.status(statusCodes.success.OK.code).json({
      status: statusCodes.success.OK.code,
      message: "User details updated successfully",
      data: user,
    });
  } catch (error: any) {
    return res.status(statusCodes.error.SERVER_ERROR.code).json({
      status: statusCodes.error.SERVER_ERROR.code,
      message: statusCodes.error.SERVER_ERROR.message,
    });
  }
};

export const createWave = async (req: any, res: any) => {
  console.log(req.file);
  try {
    let values: any = {
      image: req.file && req.file.filename,
      message: req.body.message,
      userId: req.user.id,
    };
    let newWave = await Wave.create(values);
    if (newWave) {
      return res.status(statusCodes.success.OK.code).json({
        status: statusCodes.success.OK.code,
        message: "Wave Created Successfully Done",
      });
    } else {
      return res.status(statusCodes.error.BAD_REQUEST.code).json({
        status: statusCodes.error.BAD_REQUEST.code,
        message: statusCodes.error.BAD_REQUEST.code,
      });
    }
  } catch {
    return res.status(statusCodes.error.SERVER_ERROR.code).json({
      status: statusCodes.error.SERVER_ERROR.code,
      message: statusCodes.error.SERVER_ERROR.message,
    });
  }
};

export const getWaveList = async (req: any, res: any) => {
  let data: any[] = [];
  try {
    let waveList: any = await Wave.findAll({ where: { userId: req.user.id } });
    if (waveList) {
      for (let i = 0; i < waveList.length; i++) {
        data.push({
          id: waveList[i].dataValues.id,
          status: waveList[i].dataValues.status,
          message: waveList[i].dataValues.message,
        });
      }

      return res.status(statusCodes.success.OK.code).json({
        status: statusCodes.success.OK.code,
        message: statusCodes.success.OK.message,
        data,
      });
    } else {
      return res.status(statusCodes.error.BAD_REQUEST.code).json({
        status: statusCodes.error.NOT_FOUND.code,
        message: "No Waves",
      });
    }
  } catch (error) {
    return res.status(statusCodes.error.SERVER_ERROR.code).json({
      status: statusCodes.error.SERVER_ERROR.code,
      message: statusCodes.error.SERVER_ERROR.message,
    });
  }
};

export const updateWaveStatus = async (req: any, res: any) => {
  try {
    const result = await Wave.update(
      { status: req.body.status },
      { where: { id: req.body.id } }
    );

    if (result[0] > 0) {
      return res.status(statusCodes.success.OK.code).json({
        status: statusCodes.success.OK.code,
        message: "Status changed successfully",
      });
    } else {
      return res.status(statusCodes.error.BAD_REQUEST.code).json({
        status: statusCodes.error.BAD_REQUEST.code,
        message: "No record found to update or no changes made",
      });
    }
  } catch (error) {
    console.error("Error updating wave status:", error);
    return res.status(statusCodes.error.SERVER_ERROR.code).json({
      status: statusCodes.error.SERVER_ERROR.code,
      message: statusCodes.error.SERVER_ERROR.message,
    });
  }
};

export const getAllWaveList = async (req: any, res: any) => {
  try {
    let waveList: any = await Wave.findAll({
      attributes: ["id", "userId", "image", "message"],
      where: {
        status: 1,
      },
      order: [["id", "DESC"]],
    });

    if (waveList) {
      let data = [];

      for (let i = 0; i < waveList.length; i++) {
        const userDetails = await User.findByPk(waveList[i].dataValues.userId, {
          attributes: ["id", "first_name", "last_name", "profileIcon"],
        });

        data.push({
          id: waveList[i].dataValues.id,
          message: waveList[i].dataValues.message,
          image: waveList[i].dataValues.message
            ? `http://localhost:4000/uploads/${waveList[i].dataValues.image}`
            : null,
          first_name: userDetails?.dataValues.first_name,
          last_name: userDetails?.dataValues.last_name,
          profileIcon: userDetails?.dataValues.profileIcon
            ? `http://localhost:4000/uploads/${userDetails.dataValues.profileIcon}`
            : null,
        });
      }
      return res.status(statusCodes.success.OK.code).json({
        status: statusCodes.success.OK.code,
        message: "Wave list fetch Successfully",
        data,
      });
    } else {
      return res.status(statusCodes.error.NOT_FOUND.code).json({
        status: statusCodes.error.NOT_FOUND.code,
        message: "No waves",
      });
    }
  } catch (error) {
    return res.status(statusCodes.error.SERVER_ERROR.code).json({
      status: statusCodes.error.SERVER_ERROR.code,
      message: statusCodes.error.SERVER_ERROR.message,
    });
  }
};

export const addCommentWave = async (req: any, res: any) => {
  try {
    const userDetails = await User.findByPk(req.user.id, {
      attributes: ["id", "first_name", "last_name"],
    });

    const values: any = {
      waveId: req.body.waveId,
      comment: req.body.comment,
      commenterId: req.user.id,
      commenterfirst_name: userDetails?.dataValues.first_name,
      commenterLastName: userDetails?.dataValues.last_name,
    };

    let newWave = await Comment.create(values);
    console.log(newWave);
    if (newWave) {
      return res.status(statusCodes.success.OK.code).json({
        status: statusCodes.success.OK.code,
        message: "Comment Posted",
        values,
      });
    } else {
      return res.status(statusCodes.error.NOT_FOUND.code).json({
        status: statusCodes.error.NOT_FOUND.code,
        message: "Not found",
      });
    }
  } catch (error) {
    return res.status(statusCodes.error.SERVER_ERROR.code).json({
      status: statusCodes.error.SERVER_ERROR.code,
      message: statusCodes.error.SERVER_ERROR.message,
    });
  }
};

export const getComment = async (req: any, res: any) => {
  try {
    const commentList = await Comment.findAll({
      attributes: ["id", "commenterId", "comment"],
      where: {
        waveId: req.params.id,
        deletedAt: null,
        status: 1,
      },
      order: [["id", "DESC"]],
      include: [
        {
          model: User,
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
          commenterName: `${commenter?.first_name} ${commenter?.last_name}`, // Combine first and last name
          isSameUser: commentList[i].commenterId === req.user.id ? true : false,
        });
      }

      return res.status(statusCodes.success.OK.code).json({
        status: statusCodes.success.OK.code,
        message: "Message Fetched Successfully",
        data,
      });
    } else {
      return res.status(statusCodes.error.NOT_FOUND.code).json({
        message: "No Comment",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(statusCodes.error.SERVER_ERROR.code).json({
      status: statusCodes.error.SERVER_ERROR.code,
      message: statusCodes.error.SERVER_ERROR.message,
    });
  }
};

export const deleteComment = async (req: any, res: any) => {
  try {
    console.log(req.params);
    const commenterId = req.params.id;
    console.log(commenterId);
    const comment = await Comment.findByPk(commenterId);

    if (!comment) {
      return res.status(statusCodes.error.NOT_FOUND.code).json({
        status: statusCodes.error.NOT_FOUND.code,
        message: "Comment not found",
      });
    }

    await comment.destroy();

    return res.status(statusCodes.success.OK.code).json({
      status: statusCodes.success.OK.code,
      message: "Comment deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting comment:", error);
    return res.status(statusCodes.error.SERVER_ERROR.code).json({
      status: statusCodes.error.SERVER_ERROR.code,
      message: error.message || "Internal Server Error",
    });
  }
};

export const updateComment = async (req: any, res: any) => {
  try {
    const result = await Comment.update(
      { comment: req.body.comment },
      { where: { id: req.body.id } }
    );

    if (result) {
      return res.status(statusCodes.success.OK.code).json({
        status: statusCodes.success.OK.code,
        message: "Comment Updated Successfully",
      });
    } else {
      return res.status(statusCodes.error.BAD_REQUEST.code).json({
        status: statusCodes.error.NOT_FOUND.code,
        message: "Something Went wrong",
      });
    }
  } catch (error) {
    return res.status(statusCodes.error.SERVER_ERROR.code).json({
      status: statusCodes.error.SERVER_ERROR.code,
      message: statusCodes.error.SERVER_ERROR.message,
    });
  }
};

export const GetAcceptedFriends = async (req: any, res: any) => {
  try {
    const acceptedFriends = await Friend.findAll({
      attributes: ["id", "inviteEmail", "inviteName", "status", "isAccepted"],
      where: {
        inviterId: req.user.id,
        isAccepted: true,
      },
      order: [["id", "DESC"]],
    });

    if (acceptedFriends.length > 0) {
      let data: any[] = [];

      for (let i = 0; i < acceptedFriends.length; i++) {
        const friend = acceptedFriends[i].dataValues;
        let name = friend.inviteName || "";
        let icon = null;

        const fetchActualData = await User.findOne({
          attributes: ["id", "first_name", "last_name", "profileIcon"],
          where: { email: friend.inviteEmail },
        });

        if (fetchActualData) {
          name = `${fetchActualData.first_name || ""} ${
            fetchActualData.last_name || ""
          }`.trim();
          icon = fetchActualData.profileIcon
            ? `http://localhost:4000/uploads/${fetchActualData.profileIcon}`
            : null;
        }

        data.push({
          id: friend.id,
          name,
          email: friend.inviteEmail,
          icon,
        });
      }

      return res.status(200).json({
        status: 200,
        message: "Accepted Friends Fetched Successfully",
        data,
      });
    } else {
      return res.status(404).json({
        status: 404,
        message: "No Accepted Friends Found",
      });
    }
  } catch (error) {
    console.error("Error fetching accepted friends:", error);

    return res.status(500).json({
      status: 500,
      message: "An error occurred while fetching accepted friends.",
    });
  }
};

export const getAcceptedFriendsList = async (req: any, res: any) => {
  try {
    const acceptedFriends = await Friend.findAll({
      attributes: ["id", "inviteEmail", "inviteName", "status", "isAccepted"],
      where: {
        inviterId: req.user.id,
        isAccepted: 1,
        status: 1,
      },
      order: [["id", "DESC"]],
    });

    if (acceptedFriends.length > 0) {
      let data: any[] = [];

      for (let i = 0; i < acceptedFriends.length; i++) {
        const friend = acceptedFriends[i].dataValues;
        let name = friend.inviteName || "";
        let icon = null;
        const fetchActualData = await User.findOne({
          attributes: [
            "id",
            "first_name",
            "last_name",
            "profileIcon",
            "email",
            "phone_number",
            "address1",
            "ssn",
            "address2",
            "city",
            "state",
            "zip",
            "dob",
            "gender",
            "marital_status",
          ],
          where: { email: friend.inviteEmail },
        });
        if (fetchActualData) {
          name = `${fetchActualData.first_name || ""} ${
            fetchActualData.last_name || ""
          }`.trim();
          icon = fetchActualData.profileIcon
            ? `http://localhost:4000/uploads/${fetchActualData.profileIcon}`
            : null;

          data.push({
            id: friend.id,
            name,
            email: friend.inviteEmail,
            icon,
            status: friend.status,
            userDetails: {
              id: fetchActualData.id,
              first_name: fetchActualData.first_name,
              last_name: fetchActualData.last_name,
              phoneNumber: fetchActualData.phone_number,
              address1: fetchActualData.address1,
              address2: fetchActualData.address2,
              city: fetchActualData.city,
              state: fetchActualData.state,
              zip: fetchActualData.zip,
              dob: fetchActualData.dob,
              gender: fetchActualData.gender,
              maritalStatus: fetchActualData.marital_status,
              ssn: fetchActualData.ssn,
            },
          });
        }
      }

      return res.status(200).json({
        status: 200,
        message: "Accepted Friends Fetched Successfully",
        data,
      });
    } else {
      return res.status(404).json({
        status: 404,
        message: "No Accepted Friends Found",
      });
    }
  } catch (error) {
    console.error("Error fetching accepted friends:", error);
    return res.status(500).json({
      status: 500,
      message: "An error occurred while fetching accepted friends.",
    });
  }
};
