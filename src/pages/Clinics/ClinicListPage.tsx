import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllClinics } from '../../api/clinics';
import type { ClinicDto } from '../../types/clinic';

export default function ClinicListPage() {
  const [clinics, setClinics] = useState<ClinicDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllClinics()
      .then(setClinics)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando…</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Clínicas</h1>
        <Link to="/clinics/new" className="btn btn-primary">
          Nueva clínica
        </Link>
      </div>

      {/* <table className="min-w-full bg-white shadow rounded"> */}
      <table className="min-w-full rounded">
        <thead>
          <tr className="bg-slate-100/10 text-left text-sm">
            <th className="p-2">ID</th>
            <th className="p-2">Nombre</th>
            <th className="p-2">Dirección</th>
            <th className="p-2">Email</th>
          </tr>
        </thead>
        <tbody>
          {clinics.map(c => (
            <tr key={c.id} className="border-b text-sm">
              <td className="p-2">{c.id}</td>
              <td className="p-2">{c.name}</td>
              <td className="p-2">{c.address ?? '—'}</td>
              <td className="p-2">{c.email ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
