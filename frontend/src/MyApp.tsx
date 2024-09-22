import { Route, Routes } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import HomePage from "./pages/HomePage";
import CoursePage from "./pages/CoursePage";
import AssignmentPage from "./pages/AssignmentPage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProfilePage from "./pages/ProfilePage";
import AdminManageUser from "./components/admin/AdminManageUser";
import AdminManageCourse from "./components/admin/AdminManageCourse";
import AdminManageDepartment from "./components/admin/AdminManageDepartment";
import AdminPage from "./pages/AdminPage";

const MyApp = () => {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="/course/:id" element={<CoursePage />} />
                <Route path="/assignment/:id" element={<AssignmentPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route element={<AdminPage />}>
                    <Route
                        path="/admin/manage/users"
                        element={<AdminManageUser />}
                    />
                    <Route
                        path="/admin/manage/courses"
                        element={<AdminManageCourse />}
                    />
                    <Route
                        path="/admin/manage/departments"
                        element={<AdminManageDepartment />}
                    />
                </Route>
            </Route>
            <Route path="/sign-in" element={<LoginPage />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};

export default MyApp;
