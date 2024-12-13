// NestedRoute.tsx

import { Navigate, Outlet } from "react-router-dom";
import { useAppContext } from "../contexts/AppProvider";

export default function NestedRoute() {

    const { isLoading, user } = useAppContext();

    if (isLoading) return <p>Loading...</p>;

    if (!user) return <Navigate to={'/sign-in'} />

    return <Outlet />
}
