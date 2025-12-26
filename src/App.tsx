import { Routes, Route } from "react-router-dom";
import { AppNavbar } from "./components/AppNavbar/AppNavbar";
import { HomePage } from "./pages/Home/HomePage";
import { ServicesPage } from "./pages/Services/ServicesPage";
import { ServiceDetailPage } from "./pages/ServiceDetail/ServiceDetailPage";
import { LoginPage } from "./pages/Login/LoginPage";
import { RegistrationPage } from "./pages/Registration/RegistrationPage";
import { ProfilePage } from "./pages/Profile/ProfilePage";
import { LicenseCalculationRequestsPage } from "./pages/LicenseCalculationRequests/LicenseCalculationRequestsPage";
import { LicenseCalculationRequestPage } from "./pages/LicenseCalculationRequest/LicenseCalculationRequestPage";
import { ROUTES } from "./Routes";
import "./App.css";

function App() {
  return (
    <>
      <AppNavbar />
      <Routes>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.SERVICES} element={<ServicesPage />} />
        <Route path={`${ROUTES.SERVICES}/:id`} element={<ServiceDetailPage />} />
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegistrationPage />} />
        <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
        <Route path={ROUTES.ORDERS} element={<LicenseCalculationRequestsPage />} />
        <Route path={`${ROUTES.ORDER}/:id`} element={<LicenseCalculationRequestPage />} />
      </Routes>
    </>
  );
}

export default App;
