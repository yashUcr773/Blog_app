import { useSetRecoilState } from "recoil";
import { accessTokenAtom } from "../store/atoms/authAtom";
import { userAtom } from "../store/atoms/userAtom";
import { defaultUserInterface } from "../../config/types";

interface currentSessionProps {
    accessToken: string | null,
    userData: defaultUserInterface | null
}

export function useSetCurrentSession() {

    const setUser = useSetRecoilState(userAtom)
    const setAccessToken = useSetRecoilState(accessTokenAtom)

    function setCurrentSession({ accessToken, userData }: currentSessionProps) {

        if (accessToken !== undefined) {
            setAccessToken(accessToken)
        }
        if (userData !== undefined) {
            setUser(userData)
        }

    }
    return setCurrentSession

}