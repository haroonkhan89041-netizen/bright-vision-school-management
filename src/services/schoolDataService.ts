import { listStudents, type StudentRecord } from "./studentService";
import { listTeachers, type TeacherRecord } from "./teacherService";
import { listFees, type FeeRecord } from "./feeService";
import { listAttendance, type AttendanceRecord } from "./attendanceService";
import { listExams, type ExamRecord } from "./examService";
import { listClasses, listSubjects, listNotices, type ClassRecord, type SubjectRecord, type NoticeRecord } from "./academicService";

export type SchoolData = {
  students: StudentRecord[];
  teachers: TeacherRecord[];
  fees: FeeRecord[];
  attendance: AttendanceRecord[];
  exams: ExamRecord[];
  classes: ClassRecord[];
  subjects: SubjectRecord[];
  notices: NoticeRecord[];
};

export async function loadSchoolData(): Promise<SchoolData> {
  const [students, teachers, fees, attendance, exams, classes, subjects, notices] = await Promise.all([
    listStudents(), listTeachers(), listFees(), listAttendance(),
    listExams(), listClasses(), listSubjects(), listNotices(),
  ]);
  return { students, teachers, fees, attendance, exams, classes, subjects, notices };
}
