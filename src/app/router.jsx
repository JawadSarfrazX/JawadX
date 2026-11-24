import { Routes, Route, Navigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { useAuth } from "../store/AuthContext";
import MainLayout from "../components/layout/MainLayout";
import LoginPage from "../features/auth/pages/LoginPage";
import PortalLayout from "../features/portal/components/PortalLayout";
import PortalPage from "../features/portal/pages/PortalPage";
import PortalCoursesPage from "../features/portal/pages/PortalCoursesPage";
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import StudentsPage from "../features/students/pages/StudentsPage";
import TeachersPage from "../features/teachers/pages/TeachersPage";
import CoursesPage from "../features/courses/pages/CoursesPage";
import AttendancePage from "../features/attendance/pages/AttendancePage";
import ResultsPage from "../features/results/pages/ResultsPage";
import FeesPage from "../features/fees/pages/FeesPage";

function Protected({ children, adminOnly = false }) {
  const { user } = useAuth();
  if (!user) return <Navigate to={ROUTES.login} replace />;
  if (adminOnly && user.role !== "admin") return <Navigate to={ROUTES.portal} replace />;
  return children;
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path={ROUTES.login} element={<LoginPage />} />

      <Route element={<Protected><PortalLayout /></Protected>}>
        <Route path={ROUTES.portal} element={<PortalPage />} />
        <Route path={ROUTES.portalCourses} element={<PortalCoursesPage />} />
      </Route>

      <Route element={<Protected adminOnly><MainLayout /></Protected>}>
        <Route path={ROUTES.dashboard} element={<DashboardPage />} />
        <Route path={ROUTES.students} element={<StudentsPage />} />
        <Route path={ROUTES.teachers} element={<TeachersPage />} />
        <Route path={ROUTES.courses} element={<CoursesPage />} />
        <Route path={ROUTES.attendance} element={<AttendancePage />} />
        <Route path={ROUTES.results} element={<ResultsPage />} />
        <Route path={ROUTES.fees} element={<FeesPage />} />
      </Route>

      <Route path="*" element={<Navigate to={ROUTES.dashboard} replace />} />
    </Routes>
  );
}