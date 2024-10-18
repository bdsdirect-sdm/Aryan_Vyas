import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface User {
    usertype: string;
    resumeFile: string | null;
    profileImage: string | null;
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    gender: string;
    userType: string;
    agencyId: number | null;
    status: any | null;
}

const Dashboard: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("No token found. Please log in.");

                const response = await axios.get(
                    "http://localhost:4001/api/dashboard",
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setUsers(response.data.updatedUserList);
                setLoggedInUser(response.data.loggedInUserDetail);
            } catch (error:any) {
                setError(error.response?.data?.message || "Error fetching users");
            } finally {
                setLoading(false);
            }
        };
        
        fetchUsers();
    }, []);

    const handleStatusChange = async (userId: number, newStatus: string) => {
        try {
            await axios.post("http://localhost:4001/api/update-status", { userId, status: newStatus });
            setUsers(prevUsers => 
                prevUsers.map(user => 
                    user.id === userId ? { ...user, status: parseInt(newStatus) } : user
                )
            );
        } catch (error) {
            console.error("Error updating status:", error);
            setError("Error updating user status. Please try again.");
        }
    };

    const handleChatClick = (userId: number) => {
        navigate(`/chat/${userId}`);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div style={{ color: "red" }}>{error}</div>;

    return (
        <div>
            <h1>
                Hello, {loggedInUser ? `${loggedInUser.firstName} ${loggedInUser.lastName}` : "User"}
                <br />
                Email: {loggedInUser ? loggedInUser.email : "User"}
            </h1>
            <h1>User Dashboard</h1>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
                {users.map(user => (
                    <div key={user.id} style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "10px", width: "300px" }}>
                        <h3>{`${user.firstName} ${user.lastName}`}</h3>
                        <p>Email: {user.email}</p>
                        <p>Phone: {user.phone}</p>
                        <p>Gender: {user.gender}</p>
                        <p>User Type: {user.userType === "1" ? "Job Seeker" : "Agency"}</p>
                        {loggedInUser?.userType === "2" && (
                            <>
                                <p>
                                    Profile Image: {user.profileImage ? (
                                        <img src={user.profileImage} alt="Profile" style={{ width: "50px", height: "50px" }} />
                                    ) : "No image"}
                                </p>
                                <p>
                                    Resume: {user.resumeFile ? (
                                        <a href={user.resumeFile} target="_blank" rel="noopener noreferrer">
                                            Download Resume
                                        </a>
                                    ) : "No resume"}
                                </p>
                            </>
                        )}
                        <p>Status: {user.status === 0 ? "Pending" : user.status === 1 ? "Accepted" : "Rejected"}</p>
                        <div>
                            {loggedInUser?.userType === "2" ? (
                                <select
                                    value={user.status?.toString() || "0"}
                                    onChange={(e) => handleStatusChange(user.id, e.target.value)}
                                >
                                    <option value="0">Pending</option>
                                    <option value="1">Accepted</option>
                                    <option value="2">Rejected</option>
                                </select>
                            ) : (
                                <span>{user.status === 0 ? "Pending" : user.status === 1 ? "Accepted" : "Rejected"}</span>
                            )}
                        </div>
                        {user.status !== 1 ? (
                            <span>No Chat Available</span>
                        ) : (
                            <button onClick={() => handleChatClick(user.id)}>Chat</button>
                        )}
                    </div>
                ))}
            </div>
            <center style={{ marginTop: "10%" }}>
                <button onClick={logout} className="">Logout</button>
            </center>
        </div>
    );
};

export default Dashboard;
