export type Role = 'admin' | 'teacher' | 'accountant' | 'staff' | 'parent' | 'student';

export interface UserAccount {
  id: string;
  email?: string | null;
  full_name?: string | null;
  role: Role;
  is_active?: boolean;
}

export interface Student {
  id: string;
  studentId: string;
  admissionNumber: string;
  fullName: string;
  fatherName: string;
  motherName: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  classId: string;
  section: string;
  rollNumber: string;
  phone: string;
  address: string;
  admissionDate: string;
  photoUrl?: string;
  status: 'active' | 'inactive';
}

export interface Teacher {
  id: string;
  teacherId: string;
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  assignedClasses: string[];
  joiningDate: string;
  status: 'active' | 'inactive';
}

export interface SchoolClass {
  id: string;
  name: string;
  sections: string[];
  classTeacherId: string | null;
  studentCount: number;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  classId: string;
  teacherId: string | null;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  classId: string;
  section: string;
  status: 'present' | 'absent' | 'late' | 'leave';
}

export interface ExamType {
  id: string;
  name: string;
  weight: number;
}

export interface Exam {
  id: string;
  name: string;
  examTypeId: string;
  classId: string;
  startDate: string;
  endDate: string;
  status: 'planned' | 'ongoing' | 'completed' | 'cancelled';
}

export interface Mark {
  id: string;
  examId: string;
  studentId: string;
  subjectId: string;
  obtained: number;
  total: number;
}

export interface FeeStructureItem {
  id: string;
  classId: string;
  title: string;
  amount: number;
  frequency: 'monthly' | 'quarterly' | 'annual' | 'one_time';
}

export interface FeeInvoice {
  id: string;
  receiptNo: string;
  studentId: string;
  title: string;
  amount: number;
  paidAmount: number;
  dueDate: string;
  paidDate: string | null;
  method: 'cash' | 'bank' | 'online' | 'other';
  status: 'unpaid' | 'partial' | 'paid' | 'overdue';
}

export interface Notice {
  id: string;
  title: string;
  description: string;
  date: string;
  audience: 'all' | 'students' | 'parents' | 'teachers' | 'staff';
  status: 'draft' | 'published' | 'archived';
}

export interface SchoolSettings {
  schoolName: string;
  logoUrl: string;
  address: string;
  phone: string;
  email: string;
  academicSession: string;
  principalName: string;
  currency: string;
  dateFormat: string;
}
