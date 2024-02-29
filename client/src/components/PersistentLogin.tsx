import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { Outlet } from "react-router-dom";
import { useRefreshToken } from "../hooks/useRefreshToken";
import { accessTokenAtom } from "../store/atoms/authAtom";
import { Loader } from "./Loader";

export function PersistentLogin() {
    const [isLoading, setIsLoading] = useState(true)
    const refresh = useRefreshToken({ sendUserData: true })
    const accessToken = useRecoilValue(accessTokenAtom)

    useEffect(() => {
        const verifyRefreshToken = async () => {
            try {
                await refresh();
            } catch (e) {
                console.log(e)
            } finally {
                setIsLoading(false)
            }
        }

        const persistence = localStorage.getItem('persistence')

        if (persistence && persistence == 'true') {
            !accessToken ? verifyRefreshToken() : setIsLoading(false)
        } else {
            setIsLoading(false)
        }
    }, [])

    return isLoading ? <Loader fullPage={true} /> : <Outlet />
}