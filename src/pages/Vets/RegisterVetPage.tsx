import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { registerVet } from '../../api/vets';
import { getAllClinics } from '../../api/clinics';
import type { ClinicDto } from '../../types/clinic';
import type { RegisterVetRequest } from '../../types/vet';

const schema: yup.Schema<RegisterVetRequest> = yup.object({
  username: yup.string().required('Requerido'),
  password: yup.string().min(6, 'Mínimo 6 caracteres').required(),
  clinicId: yup.number().required('Elige clínica'),
  celNum: yup.string().optional(),
  email: yup.string().email('Formato inválido').optional()
});

export default function RegisterVetPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterVetRequest>({ resolver: yupResolver(schema) });

  const [clinics, setClinics] = useState<ClinicDto[]>([]);
  const [loadingClinics, setLoadingClinics] = useState(true);
  const navigate = useNavigate();

  /* cargamos clínicas para el <select> */
  useEffect(() => {
    getAllClinics().then(setClinics).finally(() => setLoadingClinics(false));
  }, []);

  const onSubmit = async (data: RegisterVetRequest) => {
    await registerVet(data);
    navigate('/clinics'); // page futura (opcional) o a donde prefieras
  };

  return (
    <div className="max-w-xl mx-auto bg-white/0 p-6 rounded shadow">
      <h1 className="text-xl font-semibold mb-4">Registrar nuevo veterinario</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
        <Input label="Usuario" {...register('username')} error={errors.username?.message} />
        <Input
          label="Contraseña"
          type="password"
          {...register('password')}
          error={errors.password?.message}
        />

        {/* Select de clínica */}
        <div>
          <label className="block text-sm mb-1">Clínica</label>
          {loadingClinics ? (
            <p>Cargando clínicas…</p>
          ) : (
            <select className="select w-full" {...register('clinicId')}>
              <option value="">— Elegir —</option>
              {clinics.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          )}
          {errors.clinicId && (
            <p className="text-red-500 text-xs">{errors.clinicId.message}</p>
          )}
        </div>

        <Input label="Celular" {...register('celNum')} />
        <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />

        <button disabled={isSubmitting} className="btn btn-primary mt-4">
          {isSubmitting ? 'Registrando…' : 'Registrar'}
        </button>
      </form>
    </div>
  );
}

/* reutilizable */
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
