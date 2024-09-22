import useUserStore from "../store/userStore";
import { Outlet } from "react-router-dom";
import { Role } from "../types";
import UnauthorizedPage from "./UnauthorizedPage";

const AdminPage = () => {
    const user = useUserStore((state) => state.user);

    if (user?.role !== Role.admin) {
        return <UnauthorizedPage />;
    }

    return <Outlet />;
};

export default AdminPage;
