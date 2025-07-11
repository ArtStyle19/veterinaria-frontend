// src/pages/ClinicMePage.tsx

import { useEffect, useState } from 'react';
import { getVetClinic } from '../../api/clinics'; // Use the corrected function name
import type { ClinicDto } from '../../types/clinic';

export default function ClinicMePage() {
  const [clinic, setClinic] = useState<ClinicDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClinicData = async () => {
      setLoading(true); // Ensure loading is true before fetch
      setError(null); // Clear previous errors

      try {
        // No need to pass the token here; Axios interceptor handles it
        const data = await getVetClinic();
        setClinic(data);
      } catch (err: any) { // Use 'any' or check 'err instanceof AxiosError' if Axios provides it
        console.error("Error fetching clinic data:", err);
        // Axios error handling often includes err.response for server errors
        if (err.response && err.response.status === 401) {
          setError('Unauthorized: Please log in to view your clinic details.');
          // Your Axios interceptor should already handle redirecting to /login for 401
        } else if (err.response && err.response.data && err.response.data.message) {
          setError(`Error: ${err.response.data.message}`);
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred while fetching clinic data.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchClinicData();
  }, []); // Empty dependency array: runs once on mount

  if (loading) {
    return <p>Cargando información de la clínica…</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  if (!clinic) {
    // This case might mean no clinic is associated with the logged-in user,
    // or an error occurred that didn't set the error state.
    return <p>No se encontraron datos de la clínica para su cuenta.</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Mi Clínica</h1>
      {/* <div className="bg-white shadow rounded p-6"> */}
      <div className="p-6">
        <div className="mb-4">
          <strong>ID:</strong> {clinic.id}
        </div>
        <div className="mb-4">
          <strong>Nombre:</strong> {clinic.name}
        </div>
        <div className="mb-4">
          <strong>Dirección:</strong> {clinic.address ?? '—'}
        </div>
        <div className="mb-4">
          <strong>Email:</strong> {clinic.email ?? '—'}
        </div>
        {clinic.latitude && (
          <div className="mb-4">
            <strong>Latitud:</strong> {clinic.latitude}
          </div>
        )}
        {clinic.longitude && (
          <div className="mb-4">
            <strong>Longitud:</strong> {clinic.longitude}
          </div>
        )}
      </div>
    </div>
  );
}