export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address?: Address;
  phone?: string;
  website?: string;
  company?: Company;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

export interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
}

export interface Company {
  name: string;
  catchPhrase: string;
  bs: string;
}

export type ProjectStatus = 'Activo' | 'En pausa' | 'Archivado';

export interface Project {
  id: number;
  code: string;
  name: string;
  owner: string;
  email: string;
  city?: string;
  website?: string;
  status: ProjectStatus;
}

export const userToProject = (u: User): Project => {
  const statuses: ProjectStatus[] = ['Activo', 'En pausa', 'Archivado'];
  return {
    id: u.id,
    code: u.username,
    name: u.company?.name || u.name,
    owner: u.name,
    email: u.email,
    city: u.address?.city,
    website: u.website,
    status: statuses[(u.id - 1) % statuses.length],
  };
};

export interface ApiError {
  status: number;
  message: string;
  detail?: string;
  url?: string;
}

export interface Task {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}
