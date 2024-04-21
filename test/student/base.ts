import { PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';

export const createSchool = async (prisma: PrismaClient) => {
  const createSchoolData = {
    name: (Math.random() + 1).toString(36).substring(7),
    region: '서울',
    created_at: dayjs().add(9, 'hour').toDate(),
    updated_at: dayjs().add(9, 'hour').toDate(),
  };

  return await prisma?.schools.create({
    data: createSchoolData,
  });
};

export const createStudent = async (prisma: PrismaClient) => {
  return await prisma?.students.create({
    data: {
      name: (Math.random() + 1).toString(36).substring(7),
      created_at: dayjs().add(9, 'hour').toDate(),
      updated_at: dayjs().add(9, 'hour').toDate(),
    },
  });
};
