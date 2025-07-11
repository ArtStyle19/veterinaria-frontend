import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../../api/axios';
import dayjs from 'dayjs';

import { getPetHistory } from '../../api/medical';
import type { PublicPetDto } from '../../types/pet';
import type { HistoricalRecordDto } from '../../types/medical';
import PetQRCode from '../../components/PetQRCode';
import { useAuth } from '../../auth/AuthContext';

export default function CompletePetInfo() {

    const { user } = useAuth();
  
//   const { pet_id } = useParams();
    const { id } = useParams<{ id: string }>();

  const [pet, setPet] = useState<PublicPetDto | null>(null);
  // const [record, setRecord] = useState<HistoricalRecordDto | null>(null);
    const [record, setRecord] = useState<HistoricalRecordDto[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  //   if (loading) return <p>Cargando historial…</p>;
  // if (!records.length) return <p>Sin historial clínico.</p>;


  useEffect(() => {
    if (!id) return;

    const pid = parseInt(id);

    Promise.all([
      api.get<PublicPetDto>(`/api/pets/${pid}`),
      getPetHistory(pid),
    ])
      .then(([resPet, records]) => {
        setPet(resPet.data);
        setRecord(records); // Asumes un único historial por mascota
      })
      .catch(() => setError('No se pudo cargar la información'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="p-6">Cargando…</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (!pet || !record) return null;


    
    

  return (
    // <div className="flex flex-col md:flex-row gap-6">
    <div className="flex flex-col md:flex-row gap-6 h-full">
      
    {/* INFO MASCOTA */}
      <section className="md:w-1/3 bg-white/0 shadow space-y-3">
        {/* <h2 className="text-xl font-semibold">{pet.name}</h2>
        <p className="text-slate-600">{pet.species} — {pet.breed}</p>

        <table className="text-sm mt-3 w-full">
          <tbody>
            <Row label="Sexo" value={pet.sex} />
            <Row
              label="Nacimiento"
              value={pet.birthdate ? dayjs(pet.birthdate).format('DD/MM/YYYY') : '—'}
            />
            <Row label="Estado" value={pet.status} />
            {record.clinics.length > 0 && (
              <Row label="Clínica(s)" value={record.clinics.map(c => c.name).join(', ')} />
            )}
          </tbody>
        </table>

        {pet.status === 'LOST' && (
          <div className="bg-amber-50/10 border border-amber-200 p-3 rounded mt-4 text-sm">
            <h3 className="font-medium text-amber-700">Mascota perdida</h3>
            <p>Dueño: {pet.ownerName || '—'}</p>
            <p>Contacto: {pet.ownerContact || '—'}</p>
            {pet.ownerEmail && <p>Email: {pet.ownerEmail}</p>}
          </div>
        )} */}

        <div className="max-w-xl mx-auto bg-blue-700/5 p-6 rounded-2xl shadow-lg backdrop-blur-md border border-white/10  ">
        {/* <div className="max-w-xl mx-auto rounded-2xl p-6 shadow-lg backdrop-blur-md bg-white/10 border border-white/20 text-white"></div> */}


<div className="overflow-hidden rounded-xl border border-white/0 backdrop-blur-sm bg-white/0">
  <table className="w-full text-xs text-white/100">
    <tbody>

 <tr className="border-b border-white/10">
          <td colSpan={2} className="px-5 py-6 text-center ">
    <h1 className="text-3xl font-bold mb-6 text-center text-emerald-200/90 drop-shadow-lg">
  {pet.name}
</h1>
          </td>
        </tr>

      <tr className="border-b border-white/10">
        <td className="px-4 py-3 font-semibold w-1/3">Especie</td>
        <td className="px-4 py-3">{pet.species}</td>
      </tr>
      <tr className="border-b border-white/10">
        <td className="px-4 py-3 font-semibold">Raza</td>
        <td className="px-4 py-3">{pet.breed ?? '—'}</td>
      </tr>
      <tr className="border-b border-white/10">
        <td className="px-4 py-3 font-semibold">Sexo</td>
        <td className="px-4 py-3">{pet.sex}</td>
      </tr>
      <tr className="border-b border-white/10">
        <td className="px-4 py-3 font-semibold">Nacimiento</td>
        <td className="px-4 py-3">{pet.birthdate ? dayjs(pet.birthdate).format('DD/MM/YYYY') : '—'}</td>
      </tr>
      <tr className="border-b border-white/10">
        <td className="px-4 py-3 font-semibold">Estado</td>
        <td className="px-4 py-3">{pet.visibility}</td>
      </tr>
      <tr className="border-b border-white/10">
        <td className="px-4 py-3 font-semibold">Propietario</td>
        <td className="px-4 py-3">{pet.ownerName ?? 'Sin asignar'}</td>
      </tr>
      <tr>
        <td className="px-4 py-3 font-semibold">Contacto</td>
        <td className="px-4 py-3">{pet.ownerContact ?? '—'}</td>
      </tr>

       <tr className="border-b border-white/10">
          <td colSpan={2} className="px-5 py-6 text-center ">
  <div className="mt-6">
    <h2 className="text-lg font-medium text-white mb-2">Código QR para compartir</h2>
    <PetQRCode token={pet.qrCodeToken} />
  </div>
          </td>
        </tr>

        <tr className='border-b border-white/10'>
        <td colSpan={2} className='px-5 py-6 text-center'>
  <Link
    to={`/pets/${pet.id}/history`}
    className=" inline-block px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-all shadow-md"
    >
    Ver historial
  </Link>

        </td>

        </tr>
    </tbody>
  </table>
</div>

{/* {(user?.roleName === 'VET' || user?.roleName === 'PET_OWNER') && ( */}

{/* )} */}

{/* {user?.roleName === 'VET' && ( */}

{/* )} */}
    </div>

      </section>

      {/* HISTORIAL */}
      {/* <section className="md:w-1/2 bg-white/10 rounded shadow p-4 space-y-4">
        <h2 className="text-xl font-semibold">Historial clínico</h2>

        {record.appointments.length === 0 ? (
          <p className="text-slate-500 text-sm">Sin citas registradas.</p>
        ) : (
          <ul className="divide-y text-sm">
            {record.appointments.map(apt => (
              <li key={apt.id} className="py-3 space-y-1">
                <p className="font-medium text-slate-700">
                  {dayjs(apt.date).format('DD/MM/YYYY')} — {apt.diagnosis || 'Sin diagnóstico'}
                </p>
                <p><strong>Síntomas:</strong> {apt.symptoms.join(', ') || '—'}</p>
                <p><strong>Tratamientos:</strong> {apt.treatments || '—'}</p>
                <p><strong>Notas:</strong> {apt.notes || '—'}</p>
                <p className="text-xs text-slate-500">
                  Peso: {apt.weight}kg — Temp: {apt.temperature}°C — FC: {apt.heartRate} bpm
                </p>
                {apt.clinicName && (
                  <p className="text-xs text-slate-500">Clínica: {apt.clinicName}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section> */}

            {/* <section className="md:w-1/3 bg-white/0 shadow space-y-3"> */}
                    <section className="md:w-2/3 bg-violet-700/5 p-6 rounded-2xl shadow-lg backdrop-blur-md border border-white/10  ">


      {/* <section className="md:w-1/2 bg-white/10 rounded shadow p-4 space-y-4"> */}
      

<div className="space-y-8">
  
      <h1 className="text-2xl font-semibold mb-2">Historial clínico</h1>

      {record.map(rec => (
        <section key={rec.recordId} className="bg-white/5 shadow rounded p-4 space-y-3">
          {/* <header className="flex justify-between items-center">
            <div>
              <h2 className="font-medium">
                Registro #{rec.recordId}{' '}
                {rec.clinic && (
                  <span className="text-slate-500 text-sm">
                    — {rec.clinic.name}
                  </span>
                )}
              </h2>
            </div>

            <Link
              to={`/records/${rec.recordId}/appointments/new`}
              className="btn btn-primary"
            >
              Nueva cita
            </Link>
          </header> */}
{/* cabecera incluye todas las clínicas */}
<header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
  <div>
    <h2 className="font-medium">
      Registro #{rec.recordId}
    </h2>
    <p className="text-slate-500 text-xs">
      {rec.clinics.map(c => c.name).join(' • ')}
    </p>
  </div>


        {user?.roleName === 'VET' && (
          <>
  <Link
    to={`/records/${rec.recordId}/appointments/new`}
    className="btn btn-primary"
  >
    Nueva cita
  </Link>
          </>
        )}

</header>



          {/* tabla de citas */}
          <table className="min-w-full text-sm">
            {/* <thead>
              <tr className="bg-slate-100">
                <th className="p-1">Fecha</th>
                <th className="p-1">Peso (kg)</th>
                <th className="p-1">Temp (°C)</th>
                <th className="p-1">Síntomas</th>
              </tr>
            </thead>
            <tbody>
              {rec.appointments.map(ap => (
                <tr key={ap.id} className="border-b">
                  <td className="p-1">{new Date(ap.date).toLocaleDateString()}</td>
                  <td className="p-1">{ap.weight}</td>
                  <td className="p-1">{ap.temperature}</td>
                  <td className="p-1">{ap.symptoms.join(', ')}</td>
                </tr>
              ))}
            </tbody> */}
            
<thead>
  <tr className="bg-slate-100/10">
    <th className="p-1">Fecha</th>
    <th className="p-1">Clínica</th> {/* nueva */}
    <th className="p-1">Peso</th>
    <th className="p-1">Temp</th>
    <th className="p-1">Síntomas</th>
    <th className="p-1">Acciones</th>

  </tr>
</thead>
<tbody>
  {rec.appointments.map(ap => (
    <tr key={ap.id} className="border-b">
      <td className="p-1">{new Date(ap.date).toLocaleDateString()}</td>
      <td className="p-1">{ap.clinicName ?? '—'}</td> {/* nueva */}
      <td className="p-1">{ap.weight}</td>
      <td className="p-1">{ap.temperature}</td>
      <td className="p-1">{ap.symptoms.join(', ')}</td>
            {/* 👉 NUEVA CELDA */}
      <td className="p-1">
        <Link
          to={`/appointments/${ap.id}`}
          className="btn btn-sm btn-secondary"
        >
          Ver cita
        </Link>
      </td>
    </tr>
  ))}
</tbody>


          </table>
        </section>
      ))}
    </div>





      
      </section>




       
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <tr>
      <td className="font-medium py-1 pr-2">{label}</td>
      <td className="py-1">{value || '—'}</td>
    </tr>
  );
}
