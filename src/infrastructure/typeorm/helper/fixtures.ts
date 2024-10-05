import { EnrollmentStatus } from '@domain/enums/enrollment-status.enum';

const lectures = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  title: `foo${i}`,
  description: `bar${i}`,
  faculty: `bazFaculty${i}`,
  subtitle: `baz${i}`,
  slot: 30,
  isAvailable: true,
  date: new Date().toISOString().split('T')[0],
  createdAt: new Date(),
  updatedAt: new Date(),
}));
// 40 users
const users = Array.from({ length: 40 }, (_, i) => ({
  id: i + 1,
  email: `${i + 1}` + '@test.com',
  name: `user${i}`,
  password: `password${i}`,
  createdAt: new Date(),
  updatedAt: new Date(),
}));

export const fixtures = {
  lecture: lectures,
  user: users,
  // enrollment: [
  //   {
  //     id: 1,
  //     userId: 1,
  //     lectureId: 2,
  //     status: EnrollmentStatus.ENROLLED,
  //     createdAt: new Date(),
  //     updatedAt: new Date(),
  //   },
  //   {
  //     id: 2,
  //     userId: 2,
  //     lectureId: 1,
  //     status: EnrollmentStatus.ENROLLED,
  //     createdAt: new Date(),
  //     updatedAt: new Date(),
  //   },
  // ],
};
