import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { login, whoAmI } from '../api/auth';
import { useAuth } from './AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import PageWrapper from '../components/PageWrapper';
// import { whoAmI } from '../auth/AuthContext';

interface FormData {
  username: string;
  password: string;
}

const schema = yup.object({
  username: yup.string().required(),
  password: yup.string().required(),
});

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: yupResolver(schema) });
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // 👈 Aquí

  const onSubmit = async (data: FormData) => {
    try {
      await login(data.username, data.password);
      const me = await whoAmI();
      setUser(me);
      const from = (location.state as any)?.from?.pathname;
      navigate(from && from !== '/' ? from : '/home', { replace: true });
    } catch (err) {
      // add Styles
      toast.error('Usuario o contraseña incorrectos');
    }
  };

  return (
    <PageWrapper>
      <div className="flex flex-col items-center justify-center gap-6 h-9/10">
        {/* <div className="flex items-center justify-center max-h-1/2"> */}
        {/* <div className="max-w-xl mx-auto  p-6 rounded shadow"> */}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-black/20 p-8 rounded shadow w-80"
        >
          <h1 className="text-xl mb-4">Iniciar sesión</h1>

          <input
            placeholder="Usuario"
            {...register('username')}
            className="input w-full mb-3"
          />
          {errors.username && (
            <p className="text-red-500 text-sm">Obligatorio</p>
          )}

          <input
            type="password"
            placeholder="Contraseña"
            {...register('password')}
            className="input w-full mb-3"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">Obligatorio</p>
          )}

          <button disabled={isSubmitting} className="btn btn-primary w-full">
            {isSubmitting ? '...' : 'Entrar'}
          </button>
        </form>
      </div>
    </PageWrapper>
  );
}
