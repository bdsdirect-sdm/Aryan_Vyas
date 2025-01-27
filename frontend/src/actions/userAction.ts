import axios from "axios";
import { Local } from "../environment/env";

export const toggleUserStatusAction = async(payload: any) => {
    try {
        
        const { userId } = payload
        const response =  await axios.patch(
            `${Local.BASE_URL}${Local.TOGGLE_ADMIN_USER}/${userId}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );
        
        return response;
    } catch (error) {
        return error;
    }
}