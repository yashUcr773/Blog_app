import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { accessTokenAtom } from "../store/atoms/authAtom";

export function RequireAuth() {
    const location = useLocation()
    const accessToken = useRecoilValue(accessTokenAtom)

    return (
        accessToken
            ? <Outlet />
            : <Navigate to="/signin" state={{ from: location }} replace></Navigate>
    )
}
