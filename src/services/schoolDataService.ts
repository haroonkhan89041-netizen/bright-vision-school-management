import { listStudents } from "./studentService";
import { listTeachers } from "./teacherService";
import { listFees } from "./feeService";
import { listAttendance } from "./attendanceService";
import { listExams } from "./examService";
import { listClasses, listSubjects, listNotices } from "./academicService";

export async function loadSchoolData() {
  const [students, teachers, fees, attendance, exams, classes, subjects, notices] = await Promise.all([
    listStudents(),
    listTeachers(),
    listFees(),
    listAttendance(),
    listExams(),
    listClasses(),
    listSubjects(),
    listNotices(),
  ]);

  return { students, teachers, fees, attendance, exams, classes, subjects, notices };
}
