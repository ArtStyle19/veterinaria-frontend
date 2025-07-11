import { useEffect, useState } from 'react';
import api from '../../api/axios';
import type { PetListItemDto } from '../../types/pet';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { useQrModal } from '../../qr-modal/QrModalContext';


export default function PetListPage() {
  const { user } = useAuth();
  const [pets, setPets] = useState<PetListItemDto[]>([]);
  const { open } = useQrModal();
  const navigate = useNavigate();

  useEffect(() => {
    api.get<PetListItemDto[]>('/api/pets')
       .then(res => setPets(res.data))
       .catch(console.error);
  }, []);

  return (

    
        // <div className="flex flex-col  gap-6 h-full">
              <div className="flex flex-col gap-6 h-full ">


{/* <section className=" bg-violet-700/5 p-6 rounded-2xl shadow-lg backdrop-blur-md border border-white/10 mx-auto"> */}
      {/* <div className="flex justify-between items-center mb-6">

      </div> */}

      <div className="space-y-6">
        <section className="bg-white/5 shadow rounded p-4 space-y-4">
        

<header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
  <h1 className="text-2xl font-semibold">
          {user?.roleName === 'PET_OWNER' ? 'Mis mascotas' : 'Mis pacientes'}
        </h1>


<div className="left-4 flex gap-4">
        {user?.roleName === 'PET_OWNER' && (
          <>
            <Link to="/pets/new" className="btn btn-primary">
              Registrar nueva mascota
            </Link>
            <button className="btn btn-primary" onClick={() => open('IMPORT_VET')}>
              Importar Mascota
            </button>
          </>
        )}
        {user?.roleName === 'VET' && (
          <>
            <Link to="/pets/new" className="btn btn-primary">
              Registrar nuevo paciente
            </Link>
            <button className="btn btn-primary" onClick={() => open('IMPORT_VET')}>
              Importar paciente
            </button>
          </>
        )}
      </div>




</header>


        
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-slate-100/10">
                <th className="p-1">ID</th>
                <th className="p-1">Nombre</th>
                <th className="p-1">Especie</th>
                <th className="p-1">Estado</th>
                <th className="p-1">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pets.map(p => (
                <tr key={p.id} className="border-b">
                  <td className="p-1 items-center">{p.id}</td>
                  <td className="p-1">
                    <Link to={`/pets/${p.id}`} className="text-blue-500 hover:underline">
                      {p.name}
                    </Link>
                  </td>
                  <td className="p-1">{p.species}</td>
                  <td className="p-1">{p.status}</td>
                  <td className="p-1">
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => navigate(`/pets/${p.id}/comp-history`)}
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>

      
    {/* </section> */}

      

      
    </div>
  );
}
