/* eslint-disable @typescript-eslint/no-unused-vars */
import { Link, useNavigate } from "react-router-dom";
import "../css/OpenModel.css"

interface OptionsModelProps {
    closeModel: () => void;
    id: string;
}

function OptionsModel({ closeModel, id }: OptionsModelProps) {
    const navigate = useNavigate();
    return (
        <>
            <div id="options-model-wrapper" onClick={closeModel}></div>
            <div id="options-model">
                <Link className="options-text" to={`/user/profile`}>
                    My Profile
                </Link>
                <br />
                <Link className="options-text" to={`/user/preferences`}>
                    Preferences
                </Link>
                <br />
                <Link className="options-text" to={`/user/friends`}>
                    Friends
                </Link>
                <br />
                <Link className="options-text" to={`/user/waves`}>
                    Create Waves
                </Link>
                <br />
                <Link className="options-text" to={`/user/change-password`}>
                    Change Password
                </Link>
                <br />
                <button
                    className="options-text"
                    id="logout-btn"
                    onClick={() => {
                        localStorage.clear();
                        navigate("/");
                    }}
                >
                    Log Out
                </button>
            </div>
        </>
    );
}

export default OptionsModel;
