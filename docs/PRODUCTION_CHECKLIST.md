# Bright Vision School Management — Production Checklist

Before promoting a deployment, verify:

- Vercel has `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` for the intended Bright Vision Supabase project.
- Supabase has the `school_app_state` table with row id `bright-vision-school` permitted for the authenticated user.
- Supabase Auth has at least one intended school user and that user's `user_metadata.role` is one of `admin`, `teacher`, `accountant`, `student`, or `parent`.
- Login reaches the application shell and all navigation buttons respond.
- Student/teacher/class/subject/attendance/fees/exams/timetable/notices/reports/users/settings pages render.
- Logout returns to login.
- Data changes survive a page reload when Supabase is configured.
- Demo/localStorage fallback remains usable when Supabase variables are absent.

Do not point production at an unknown or newly-created Supabase organization/project just to make the UI load. Use the intended project and verify its schema first.
