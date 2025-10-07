import { BrowserRouter as Router, Routes, Route } from "react-router";
import Ecommerce from "./pages/Dashboard/Ecommerce";
import EquipmentDetail from "./pages/Equipment/EquipmentDetail";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import EquipmentList from "./pages/Equipment/EquipmentList";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Ecommerce />} />
            <Route path="/equipment-list" element={<EquipmentList />} />
            <Route path="/equipment-detail" element={<EquipmentDetail />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}
