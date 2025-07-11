export interface PetListItemDto {
  id: number;
  name: string;
  species: string;
  breed: string;
  status: 'LOST' | 'OK' | 'SICK' | 'DECEASED';
}
export interface ImportPetRequest {
  qrCodeToken: string;
  editCode: string;
}
