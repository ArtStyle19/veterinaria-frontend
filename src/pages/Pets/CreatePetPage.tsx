import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../auth/AuthContext';

interface BaseData {
  name: string;
  species: string;
  breed?: string;
  sex: 'MALE' | 'FEMALE' | 'UNKNOWN';
  status: 'OK' | 'LOST' | 'SICK';
  birthdate?: string;
  homeClinicId?: number;
}

/* campos extra para veterinario */
interface VetExtras {
  ownerName?: string;
  ownerContact?: string;
}

type FormData = BaseData & VetExtras;

const schema = yup.object({
  name: yup.string().required('Requerido'),
  species: yup.string().required('Requerido'),
  breed: yup.string(),
  sex: yup.mixed<'MALE' | 'FEMALE' | 'UNKNOWN'>().oneOf(['MALE', 'FEMALE', 'UNKNOWN']).required(),
  status: yup.mixed<'OK' | 'LOST' | 'SICK'>().oneOf(['OK', 'LOST', 'SICK']).required(),
  birthdate: yup.date().optional().typeError('Formato inválido'),
  homeClinicId: yup.number().optional(),
  ownerName: yup.string().optional(),
  ownerContact: yup.string().optional()
});

export default function CreatePetPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({ resolver: yupResolver(schema) });

  const { user } = useAuth();
  const isVet = user?.roleName === 'VET';
  const navigate = useNavigate();

//   const onSubmit = async (data: FormData) => {
//     const url = isVet ? '/api/pets/with-history' : '/api/pets';
    
//     await api.post(url, {
//       ...data,
//       birthdate: data.birthdate || null
//     });
//     navigate('/pets');
//   };

  const onSubmit = async (data: FormData) => {
    const url = isVet ? '/api/pets/with-history' : '/api/pets';

    // Construct the payload based on whether the user is a vet
    const payload = isVet
      ? { ...data, birthdate: data.birthdate || null, homeClinicId: undefined } // backend will assign with vet's clinic
      : { ...data, birthdate: data.birthdate || null }; // Ensure birthdate is null if empty

    try {
      await api.post(url, payload);
      navigate('/pets');
    } catch (error) {
      console.error('Error creating pet:', error);
      // You might want to display an error message to the user here
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white/3 p-6 rounded shadow">
      <h1 className="text-xl font-semibold mb-4">
        {isVet ? 'Registrar paciente' : 'Registrar nueva mascota'}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
        <Input label="Nombre" {...register('name')} error={errors.name?.message} />
        <Input label="Especie" {...register('species')} error={errors.species?.message} />
        <Input label="Raza" {...register('breed')} />

        <label className="block text-sm">Sexo</label>
        <select className="select w-full" {...register('sex')}>
          <option value="MALE">Macho</option>
          <option value="FEMALE">Hembra</option>
          <option value="UNKNOWN">Desconocido</option>
        </select>



        <label className="block text-sm">Estado de la Mascota</label>
        <select className="select w-full" {...register('status')}>
          <option value="OK">OK</option>
          <option value="LOST">PERDIDO</option>
          <option value="SICK">ENFERMO</option>
        </select>

        <Input label="Fecha de nacimiento" type="date" {...register('birthdate')} />

        {/* Dueño solo visible para vets */}
        {isVet && (
          <>
            <Input label="Nombre del dueño" {...register('ownerName')} />
            <Input label="Contacto del dueño" {...register('ownerContact')} />
          </>
        )}

        {/* Si el dueño quiere cambiar clínica manualmente */}
        {!isVet && (
          <Input
            label="ID Clínica (opcional)"
            type="number"
            {...register('homeClinicId')}
          />
        )}

        <button disabled={isSubmitting} className="btn btn-primary mt-4">
          {isSubmitting ? 'Guardando…' : 'Guardar'}
        </button>
      </form>
    </div>
  );
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};
function Input({ label, error, ...rest }: InputProps) {
  return (
    <div>
      <label className="block text-sm mb-1">{label}</label>
      <input {...rest} className="input w-full" />
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}
