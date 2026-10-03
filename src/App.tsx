import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { AppLayout } from "./components/layout/AppLayout";
import { ProtectedRoute, AdminRoute } from "./components/layout/RouteGuards";

import { Home } from "./pages/Home";
import { Survey } from "./pages/Survey";
import { Campaigns } from "./pages/Campaigns";
import { CampaignDetails } from "./pages/CampaignDetails";
import { Resources } from "./pages/Resources";
import { LegalAwareness } from "./pages/LegalAwareness";
import { Emergency } from "./pages/Emergency";
import { Report } from "./pages/Report";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Onboarding } from "./pages/Onboarding";
import { Profile } from "./pages/Profile";
import { About } from "./pages/About";
import { Privacy } from "./pages/Privacy";
import { Contact } from "./pages/Contact";
import { AdminDashboard } from "./pages/admin/AdminDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/survey" element={<Survey />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/campaigns/:slug" element={<CampaignDetails />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/legal-awareness" element={<LegalAwareness />} />
            <Route path="/emergency" element={<Emergency />} />
            <Route path="/report" element={<Report />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/contact" element={<Contact />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
