import { CONSTANTS, customAxios } from "../../config/Constants";
import { logoutInterface } from "../../config/types";
import { useSetCurrentSession } from "./useSetCurrentSession";
import { useNavigate } from "react-router-dom";
import { defaultLogoutToLink } from '../../config/defaults'

export function useLogout() {

    const navigate = useNavigate();
    const setSession = useSetCurrentSession()

    async function logout({ toLink }: logoutInterface) {
        try {
            await customAxios(CONSTANTS.AUTH.GET_LOGOUT(), { withCredentials: true })

        } catch (e) {
            console.log(e)
        } finally {
            setSession({ accessToken: null, userData: null })
            if (toLink) {
                navigate(toLink)
            } else {
                navigate(defaultLogoutToLink)
            }
        }
    }

    return logout

}