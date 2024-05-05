export type User = {
  id: number;
  name: string;
  email: string;
  company?: string;
  location?: string;
  picture?: Blob | null;
};
