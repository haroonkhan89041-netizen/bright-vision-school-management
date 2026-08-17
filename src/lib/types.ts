export type Role = 'admin' | 'teacher' | 'accountant' | 'staff' | 'parent' | 'student';

export interface UserAccount {
  id: string;
  email?: string | null;
  full_name?: string | null;
  role: Role;
  is_active?: boolean;
}
