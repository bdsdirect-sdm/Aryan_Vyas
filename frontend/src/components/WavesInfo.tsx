import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import userIcon from "../../public/images/user.jpeg";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Local } from "../environment/env";
import axios from "axios";
import "../css/WavesInfo.css";

interface WavesInfoProps {
  setOpenModel: React.Dispatch<React.SetStateAction<boolean>>;
  waveId: number | null;
  waveImage: string | null;
  waveMessage: string | null;
  posterIcon: string | null;
  posterName: string | null;
}

const WavesInfo: React.FC<WavesInfoProps> = ({
  setOpenModel,
  waveId,
  waveImage,
  waveMessage,
  posterIcon,
  posterName,
}) => {
  const [showInput, setShowInput] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [editCommentId, setEditCommentId] = useState<number | null>(null);
  const [editingComment, setEditingComment] = useState<string>(""); 
  const { id } = useParams();

  const formik = useFormik({
    initialValues: {
      comment: editingComment,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      comment: Yup.string()
        .min(3, "Comment must be at least 3 characters")
        .max(200, "Comment must not exceed 200 characters")
        .required("Comment is required"),
    }),
    onSubmit: (values, { resetForm }) => {
      console.log("Comment submitted:", values);
      if (editCommentId) {
        updateComment(values.comment);
      } else {
        PostWaveComment(values.comment);
      }
      resetForm();
      setShowInput(false);
      setEditCommentId(null);
      setEditingComment("");
    },
  });

  useEffect(() => {
    fetchAllComment();
  }, []);

  const fetchAllComment = async () => {
    if (!waveId) {
      console.error("waveId is null or undefined.");
      return;
    }

    try {
      const response = await axios.get(
        `${Local.BASE_URL}getallcommentwave/${waveId}/waves/comment`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        console.log("Comments fetched successfully:", response.data.data);
        setComments(response.data.data);
      } else {
        console.error("Failed to fetch comments:", response.status);
      }
    } catch (error: any) {
      console.error(
        "Error fetching comments:",
        error.response || error.message
      );
    }
  };

  const PostWaveComment = async (comment: string) => {
    try {
      if (!waveId) {
        console.error("Wave ID is required to post a comment.");
        return;
      }

      const response = await axios.post(
        `${Local.BASE_URL}addcomment/${id}/waves/comment`,
        {
          waveId,
          comment,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );  

      if (response.status === 200) {
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 1000,
        });
        fetchAllComment();
        setShowInput(false);
      } else {
        console.error("Failed to post comment:", response.status);
      }
    } catch (error: any) {
      console.error("Error posting comment:", error.response || error.message);
    }
  };

  const updateComment = async (comment: string) => {
    console.log(id);
    try {
      const response = await axios.put(
        `${Local.BASE_URL}updatecomment/${id}/waves/comment`,
        {
          comment,
          id: editCommentId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Comment updated successfully", {
          position: "top-right",
          autoClose: 1000,
        });
        fetchAllComment();
        setEditCommentId(null);
        setEditingComment("");
      } else {
        console.error("Failed to update comment:", response.status);
      }
    } catch (error: any) {
      console.error("Error updating comment:", error.response || error.message);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      const response = await axios.delete(
        `${Local.BASE_URL}deletecomment/${commentId}/waves/comment`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        setComments((prevComments) =>
          prevComments.filter((comment) => comment.id !== commentId)
        );
        toast.success("Comment deleted successfully", {
          position: "top-right",
          autoClose: 1000,
        });
      } else {
        console.error("Failed to delete comment:", response.status);
      }
    } catch (error: any) {
      console.error("Error deleting comment:", error.response || error.message);
    }
  };

  const handleEditClick = (commentId: number, currentComment: string) => {
    setEditCommentId(commentId);
    setEditingComment(currentComment);
    setShowInput(true);
  };

  return (
    <>
      <div id="model-wrapper">
        <div id="wave-model">
          <div id="cover-color">
            <h1>Details</h1>
            <div id="user-profile">
              <img
                src={posterIcon ? posterIcon : userIcon}
                alt="user"
                id="wave-user-icon"
              />
              <div id="creator-details">
                <p id="creator-name">{posterName}</p>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="23"
                height="25"
                viewBox="0 0 23 25"
                fill="none"
                onClick={() => setOpenModel(false)}
              >
                <ellipse
                  cx="11.4194"
                  cy="12.6786"
                  rx="10.7319"
                  ry="11.7643"
                  fill="#DECAA5"
                />
                <line
                  y1="-0.5"
                  x2="15.924"
                  y2="-0.5"
                  transform="matrix(0.673947 0.738779 -0.673947 0.738779 6.64966 7.44995)"
                  stroke="#B18D4B"
                />
                <line
                  y1="-0.5"
                  x2="15.924"
                  y2="-0.5"
                  transform="matrix(-0.673947 0.738779 0.673947 0.738779 17.3816 7.44995)"
                  stroke="#B18D4B"
                />
              </svg>
            </div>
          </div>
          <div id="wave-message-container">
            <div id="message">
              <h3>Message</h3>
              <p>{waveMessage}</p>
            </div>
            <span id="image-height-line"></span>
            <div id="image">
              <img src={waveImage ? waveImage : ""} alt="" />
            </div>
          </div>
          <div id="add-button-container">
            
            {!showInput && ( 
              <button
                id="add-comment"
                type="button"
                onClick={() => setShowInput(true)} 
              >
                Add Comments
              </button>
            )}
            {showInput && (
              <form id="comment-input" onSubmit={formik.handleSubmit}>
                <div id="input-box">
                  <input
                    type="text"
                    name="comment"
                    id="comment"
                    placeholder="Write something.."
                    value={formik.values.comment}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.comment && formik.errors.comment ? (
                    <div className="error" style={{marginTop:10}}>{formik.errors.comment}</div>
                  ) : null}
                </div>
                <button
                  type="button"
                  id="post-comment"
                  onClick={() => setShowInput(false)}
                >
                  Cancel
                </button>
                <button type="submit" id="post-comment">
                  {editCommentId ? "Update" : "Post"}{" "}
                </button>
              </form>
            )}
          </div>
          
          {comments.length > 0 ? (
  comments.map((item) => (
    <div key={item.id} id="comment-details">
      <p id="commenter-message">
        <b id="commenter-name">{item.commenterName} :</b> {item.comment}
      </p>
      {item.isSameUser && (
        <div id="button-container">
          <p
            id="edit-button"
            onClick={() => handleEditClick(item.id, item.comment)}
          >
            Edit&nbsp;|&nbsp;
          </p>
          <p
            id="delete-button"
            onClick={() => handleDeleteComment(item.id)}
          >
            Delete
          </p>
        </div>
      )}
    </div>
  ))
) : (
  <p style={{marginTop:55 , marginLeft:7}}>No comments yet.</p>
)}

        </div>
      </div>
    </>
  );
};

export default WavesInfo;
