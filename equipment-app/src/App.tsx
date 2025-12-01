import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import Dashboard from "./pages/Dashboard/Dashboard";
import EquipmentDetail from "./pages/Equipment/EquipmentDetail";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import EquipmentList from "./pages/Equipment/EquipmentList";
import Login from "./pages/AuthPages/Login";
import Register from "./pages/AuthPages/Register";
import ChangePassword from "./pages/AuthPages/ChangePassword";
import Logout from "./pages/AuthPages/Logout";
import BorrowReturnList from "./pages/BorrowReturn/BorrowReturnList";
import OverdueEquipment from "./pages/BorrowReturn/OverdueEquipment";
import MyEquipment from "./pages/MyEquipment/MyEquipment";
import ApprovedRequest from "./pages/ApprovedRequest/ApprovedRequest";
import DepartmentList from "./pages/Department/DepartmentList";
import CategoryList from "./pages/Category/CategoryList";
import UserManagement from "./pages/UserManagement/UserManagement";
import PrivateRoute from "./layout/PrivateRoute";
import NotFound from "./pages/OtherPage/NotFound";
import { RoleEnum } from "./utils/enumerations";
import { useAuth } from "./hooks/useAuth";
import UserProfiles from "./pages/UserProfile/UserProfiles";

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Router>
        <ScrollToTop />

        <Routes>

          {/* Auth Layout */}
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/" replace />
              ) : (
                <Login />
              )
            }
          />

          <Route
            path="/change-password"
            element={
              isAuthenticated ? (
                <ChangePassword />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route path="/register" element={<Register />} />

          {/* Logout route */}
          <Route path="/logout" element={<Logout />} />

          {/* Dashboard Layout */}
          <Route element={<PrivateRoute> <AppLayout /> </PrivateRoute>}>
            <Route index path="/" element={<Dashboard />} />
            <Route path="/equipment-list" element={<EquipmentList />} />
            <Route path="/equipment-detail/:id" element={<EquipmentDetail />} />
            <Route path="/borrow-request" element={<ApprovedRequest />} />
            <Route path="/profile" element={<UserProfiles />} />
          </Route>

          {/* Role-based routes */}
          <Route element={<PrivateRoute allowedRoles={[RoleEnum.User, RoleEnum.Manager]}> <AppLayout /> </PrivateRoute>}>
            <Route path="/my-equipment" element={<MyEquipment />} />
            <Route path="/borrow-return" element={<BorrowReturnList />} />
          </Route>

          <Route element={<PrivateRoute allowedRoles={[RoleEnum.Admin, RoleEnum.Manager]}> <AppLayout /> </PrivateRoute>}>
            <Route path="/equipment-detail" element={<EquipmentDetail />} />
          </Route>

          <Route element={<PrivateRoute allowedRoles={[RoleEnum.Admin, RoleEnum.Supervisor]}> <AppLayout /> </PrivateRoute>}>
            <Route path="/category" element={<CategoryList />} />
            <Route path="/department" element={<DepartmentList />} />
            <Route path="/user" element={<UserManagement />} />
          </Route>

          <Route element={<PrivateRoute allowedRoles={[RoleEnum.Admin]}> <AppLayout /> </PrivateRoute>}>
            <Route path="/overdue-equipment" element={<OverdueEquipment />} />
          </Route>

          {/* Catch all - show 404 page for unknown routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
