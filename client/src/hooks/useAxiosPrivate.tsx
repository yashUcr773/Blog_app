import { useEffect } from "react";
import { customAxiosPrivate } from "../../config/Constants";
import { useRefreshToken } from "./useRefreshToken";
import { useRecoilValue } from "recoil";
import { accessTokenAtom } from "../store/atoms/authAtom";

export function useAxiosPrivate() {
    const refresh = useRefreshToken({ sendUserData: false })
    const accessToken = useRecoilValue(accessTokenAtom)


    useEffect(() => {

        // attach access token to each request
        const requestIntercept = customAxiosPrivate.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${accessToken}`;
                }
                return config
            }, (error) => Promise.reject(error)
        )

        // send refresh token to get new access token in case of token expiry.
        // then resend the request.
        const responseIntercept = customAxiosPrivate.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;
                if (error?.response?.status === 403 && !prevRequest?.sent) {
                    prevRequest.sent = true
                    const newAccessToken = await refresh()
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
                    return customAxiosPrivate(prevRequest)
                }
                return Promise.reject(error)
            }
        )
        return () => {
            customAxiosPrivate.interceptors.response.eject(requestIntercept)
            customAxiosPrivate.interceptors.response.eject(responseIntercept)
        }
    }, [accessToken, refresh])


    return customAxiosPrivate

}