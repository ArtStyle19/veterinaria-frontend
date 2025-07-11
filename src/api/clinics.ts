import api from './axios';
import type { ClinicDto } from '../types/clinic';

export async function getAllClinics() {
  const { data } = await api.get<ClinicDto[]>('/api/clinics');
  return data;
}

export async function createClinic(dto: ClinicDto) {
  const { data } = await api.post<ClinicDto>('/api/clinics', dto);
  return data;
}

export async function getVetClinic(): Promise<ClinicDto> {
  // Axios automatically adds the Bearer token via the interceptor
  const { data } = await api.get<ClinicDto>('/api/clinics/me');
  return data;
}