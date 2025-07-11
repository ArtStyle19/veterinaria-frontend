import api from './axios';
import type { RegisterVetRequest } from '../types/vet';

export async function registerVet(body: RegisterVetRequest) {
  await api.post('/api/auth/register/vet', body);
}
