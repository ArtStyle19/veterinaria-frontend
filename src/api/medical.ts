import api from './axios';
import type {
  HistoricalRecordDto,
  AppointmentSummaryDto,
  CreateAppointmentRequest
} from '../types/medical';

export async function getPetHistory(petId: number) {
  const { data } = await api.get<HistoricalRecordDto[]>(`/api/pets/${petId}/history`);
  return data;
}

export async function getSymptoms() {
  const { data } = await api.get<string[]>('/api/symptoms');
  return data;
}

export async function createAppointment(recordId: number, body: CreateAppointmentRequest) {
  await api.post(`/api/appointments/${recordId}`, body);
}

export async function getAppointmentsByRecord(recordId: number) {
  const { data } = await api.get<AppointmentSummaryDto[]>(`/api/appointments/${recordId}`);
  return data;
}

import type { AppointmentDetailDto } from '../types/medical';

export async function getAppointmentDetail(id: number) {
  const { data } = await api.get<AppointmentDetailDto>(`/api/appointments/specific/${id}`);
  return data;
}

