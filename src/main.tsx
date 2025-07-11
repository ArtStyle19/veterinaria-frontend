import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import AppLayout from './components/AppLayout';
import VisitorLayout from './components/VisitorLayout';

import LoginPage from './auth/LoginPage';
import PetListPage from './pages/Pets/PetListPage';
import PetDetailPage from './pages/Pets/PetDetailPage';
import CreatePetPage from './pages/Pets/CreatePetPage';
import Dashboard from './pages/Dashboard/Dashboard';
import ProtectedRoute from './auth/ProtectedRoute';

import CreateClinicPage from './pages/Clinics/CreateClinicPage';
import ClinicListPage from './pages/Clinics/ClinicListPage';
import RegisterVetPage from './pages/Vets/RegisterVetPage';
import './index.css';
import ClinicMePage from './pages/Clinics/ClinicMePage';
import AppointmentDetailPage from './pages/Appointments/AppointmentDetailPage';


//
import PetHistoryPage from './pages/Pets/PetHistoryPage';
import CreateAppointmentPage from './pages/Appointments/CreateAppointmentPage';

// VISITANTE

import VisitorDashboard from './pages/Public/VistorDashboard';
// import QRSearchPage from './pages/Public/QRSearchPage';
import PublicPetPage from './pages/Public/PublicPetPage';

import QrPetSearchPage from './pages/Public/QrPetSearchPage';
// import PublicPetPage    from './pages/Public/PublicPetPage';


import { Toaster } from 'react-hot-toast';


import { QrModalProvider } from './qr-modal/QrModalContext';
import CompletePetInfo from './pages/Pets/CompletePetInfo';
import PredictPage from './pages/Predict/PredictPage';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
      <QrModalProvider>

            <Toaster position="top-center" />
        <Routes>
          {/* <Route path="/login" element={<LoginPage />} /> */}


<Route path="/predict" element={<PredictPage />} />

          <Route element={<AppLayout />}>
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="pets"
              element={
                <ProtectedRoute roles={['PET_OWNER', 'VET']}>
                  <PetListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="pets/:id"
              element={
                <ProtectedRoute roles={['PET_OWNER', 'VET']}>
                  <PetDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="pets/new"
              element={
                <ProtectedRoute roles={['PET_OWNER', 'VET']}>
                  <CreatePetPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="clinics"
              element={
                <ProtectedRoute roles={['ADMIN']}>
                  <ClinicListPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="clinics/new"
              element={
                <ProtectedRoute roles={['ADMIN']}>
                  <CreateClinicPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="clinics/me"
              element={
                <ProtectedRoute roles={['VET']}>
                  <ClinicMePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="vets/new"
              element={
                <ProtectedRoute roles={['ADMIN']}>
                  <RegisterVetPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="pets/:id/history"
              element={
                <ProtectedRoute roles={['VET']}>
                  <PetHistoryPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="pets/:id/comp-history"
              element={
                <ProtectedRoute roles={['VET', 'PET_OWNER']}>
                  <CompletePetInfo />
                </ProtectedRoute>
              }
            />

            <Route
              path="records/:recordId/appointments/new"
              element={
                <ProtectedRoute roles={['VET']}>
                  <CreateAppointmentPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="appointments/:id"
              element={
                <ProtectedRoute roles={['VET']}>
                  <AppointmentDetailPage />
                </ProtectedRoute>
              }
            />






            {/* más rutas… */}

            {/* -----------------------  PÚBLICAS  --q--------------------- */}


                            <Route path="/"              element={<VisitorDashboard />} />
                  {/* <Route path="/qr"            element={<QRSearchPage />} /> */}
                  <Route path="/qr/:token"     element={<PublicPetPage />} />

                  {/* login (también público) */}
                  <Route path="/login"         element={<LoginPage />} />

                    <Route path="/qr"        element={<QrPetSearchPage />} />

          </Route>

            {/* <Route element={<VisitorLayout />}> */}
            {/* </Route> */}


        </Routes>
      </QrModalProvider>
      </AuthProvider>

    </BrowserRouter>
  </React.StrictMode>
);
