-- Bright Vision English School
-- Development/demo seed data for the production Supabase schema.
-- Run schema.sql first. This file intentionally does not create auth.users.

insert into public.school_settings
  (school_name, logo_url, address, phone, email, academic_session, principal_name, currency, date_format)
select
  'Bright Vision English School', '',
  '12-C, Main Boulevard, Gulshan-e-Iqbal, Karachi',
  '+92 21 3456 7890', 'info@brightvision.edu',
  '2026 – 2027', 'Prof. Zubair Hameed', 'PKR', 'dd/MM/yyyy'
where not exists (select 1 from public.school_settings);

insert into public.exam_types (id, name, weight) values
  ('10000000-0000-0000-0000-000000000001', 'First Term', 25),
  ('10000000-0000-0000-0000-000000000002', 'Mid Term', 35),
  ('10000000-0000-0000-0000-000000000003', 'Final Term', 40)
on conflict (id) do nothing;

insert into public.school_classes (id, name, sections, student_count) values
  ('20000000-0000-0000-0000-000000000001', 'Nursery', '{A,B}', 42),
  ('20000000-0000-0000-0000-000000000002', 'Class 1', '{A,B}', 58),
  ('20000000-0000-0000-0000-000000000003', 'Class 2', '{A,B}', 55),
  ('20000000-0000-0000-0000-000000000004', 'Class 3', '{A,B,C}', 76),
  ('20000000-0000-0000-0000-000000000005', 'Class 4', '{A,B}', 61),
  ('20000000-0000-0000-0000-000000000006', 'Class 5', '{A,B}', 64),
  ('20000000-0000-0000-0000-000000000007', 'Class 6', '{A,B}', 52),
  ('20000000-0000-0000-0000-000000000008', 'Class 7', '{A}', 34)
on conflict (id) do nothing;

insert into public.teachers
  (id, teacher_id, full_name, email, phone, subject, assigned_classes, joining_date, status) values
  ('30000000-0000-0000-0000-000000000001','BV-T-001','Ayesha Siddiqui','ayesha@brightvision.edu','+92 300 1122334','English',ARRAY['20000000-0000-0000-0000-000000000001'::uuid,'20000000-0000-0000-0000-000000000002'::uuid],'2019-04-12','active'),
  ('30000000-0000-0000-0000-000000000002','BV-T-002','Imran Haider','imran@brightvision.edu','+92 301 2233445','Mathematics',ARRAY['20000000-0000-0000-0000-000000000002'::uuid,'20000000-0000-0000-0000-000000000003'::uuid],'2018-08-01','active'),
  ('30000000-0000-0000-0000-000000000003','BV-T-003','Sana Malik','sana@brightvision.edu','+92 302 3344556','Science',ARRAY['20000000-0000-0000-0000-000000000003'::uuid,'20000000-0000-0000-0000-000000000004'::uuid],'2020-01-15','active'),
  ('30000000-0000-0000-0000-000000000004','BV-T-004','Bilal Ahmed','bilal@brightvision.edu','+92 303 4455667','Urdu',ARRAY['20000000-0000-0000-0000-000000000004'::uuid],'2017-06-20','active'),
  ('30000000-0000-0000-0000-000000000005','BV-T-005','Hina Qureshi','hina@brightvision.edu','+92 304 5566778','Islamiat',ARRAY['20000000-0000-0000-0000-000000000005'::uuid],'2021-09-05','active'),
  ('30000000-0000-0000-0000-000000000006','BV-T-006','Kamran Yousuf','kamran@brightvision.edu','+92 305 6677889','Computer Science',ARRAY['20000000-0000-0000-0000-000000000006'::uuid,'20000000-0000-0000-0000-000000000007'::uuid],'2022-02-11','active'),
  ('30000000-0000-0000-0000-000000000007','BV-T-007','Nadia Farooq','nadia@brightvision.edu','+92 306 7788990','Social Studies',ARRAY['20000000-0000-0000-0000-000000000007'::uuid],'2016-03-30','inactive'),
  ('30000000-0000-0000-0000-000000000008','BV-T-008','Rehan Aslam','rehan@brightvision.edu','+92 307 8899001','Mathematics',ARRAY['20000000-0000-0000-0000-000000000008'::uuid],'2023-07-18','active')
on conflict (id) do nothing;

insert into public.subjects (id,name,code,class_id,teacher_id) values
 ('40000000-0000-0000-0000-000000000001','English','ENG-101','20000000-0000-0000-0000-000000000002','30000000-0000-0000-0000-000000000001'),
 ('40000000-0000-0000-0000-000000000002','Mathematics','MAT-101','20000000-0000-0000-0000-000000000002','30000000-0000-0000-0000-000000000002'),
 ('40000000-0000-0000-0000-000000000003','Science','SCI-101','20000000-0000-0000-0000-000000000003','30000000-0000-0000-0000-000000000003'),
 ('40000000-0000-0000-0000-000000000004','Urdu','URD-101','20000000-0000-0000-0000-000000000004','30000000-0000-0000-0000-000000000004'),
 ('40000000-0000-0000-0000-000000000005','Islamiat','ISL-101','20000000-0000-0000-0000-000000000005','30000000-0000-0000-0000-000000000005'),
 ('40000000-0000-0000-0000-000000000006','Computer Science','CS-101','20000000-0000-0000-0000-000000000006','30000000-0000-0000-0000-000000000006'),
 ('40000000-0000-0000-0000-000000000007','Social Studies','SST-101','20000000-0000-0000-0000-000000000007','30000000-0000-0000-0000-000000000007')
on conflict (id) do nothing;

insert into public.notices (id,title,description,date,audience,status) values
 ('50000000-0000-0000-0000-000000000001','Parent–Teacher Meeting','PTM for all classes will be held on Saturday from 9:00 AM to 1:00 PM in the main hall.','2026-08-15','parents','published'),
 ('50000000-0000-0000-0000-000000000002','Independence Day Assembly','Special assembly and tableau performances. Students must wear school uniform with flag badges.','2026-08-14','all','published'),
 ('50000000-0000-0000-0000-000000000003','Mid Term Datesheet Released','The Mid Term examination datesheet for Classes 1–7 is now available at the school office.','2026-08-10','students','published'),
 ('50000000-0000-0000-0000-000000000004','Staff Training Workshop','Teaching staff training on digital classroom tools scheduled for next Monday.','2026-08-08','teachers','draft')
on conflict (id) do nothing;
