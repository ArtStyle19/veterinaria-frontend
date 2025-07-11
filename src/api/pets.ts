import api from './axios';
import type { ImportPetRequest } from '../types/pet';

export async function importPet(body: ImportPetRequest) {
  await api.post('/api/pets/import', body);
}
