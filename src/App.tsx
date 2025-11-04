import { Routes, Route } from "react-router-dom";
import { AppNavbar } from "./components/AppNavbar/AppNavbar";
import { HomePage } from "./pages/Home/HomePage";
import { ServicesPage } from "./pages/Services/ServicesPage";
import { ServiceDetailPage } from "./pages/ServiceDetail/ServiceDetailPage";
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
      </Routes>
    </>
  );
}

export default App;
