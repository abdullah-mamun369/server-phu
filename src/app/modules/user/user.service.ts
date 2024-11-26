import config from '../../config';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import { generateStudentId } from './user.utils';

const createStudentIntoDB = async (password: string, payload: TStudent) => {
  //create a user object
  const userData: Partial<TUser> = {};

  //if password is not given, deafult password will set
  userData.password = password || (config.default_password as string);

  //set the role strudent
  userData.role = 'student';

  // find academic semester info
  const admissionSemester = await AcademicSemester.findById(
    payload.admissionSemester,
  );

  // Ensure admissionSemester is not null
  if (!admissionSemester) {
    throw new Error('Academic Semester not found');
  }

  //set generated id
  userData.id = await generateStudentId(admissionSemester);

  //create a user
  const newUser = await User.create(userData);

  //crete a student
  if (Object.keys(newUser).length) {
    payload.id = newUser.id;
    payload.user = newUser._id; //reference _id

    const newStudent = await Student.create(payload);

    return newStudent;
  }

  return newUser;
};

export const UserService = {
  createStudentIntoDB,
};
