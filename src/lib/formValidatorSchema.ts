import { literal, z } from 'zod'; // or 'zod/v4'

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const SubjectSchema = z.object({
    name: z.string()
        .min(1, { message: 'Field is required' }),
    id: z.number().optional(),
    teachers: z.array(z.string()),
});
export type SubjectSchemaType = z.infer<typeof SubjectSchema>

export const ClassSchema = z.object({
    name: z.string()
        .min(1, { message: 'Field is required' }),
    id: z.number().optional(),
    supervisorId: z.string().optional(),
    gradeId: z.string()
        .min(1, { message: 'Field is required' }),
});
export type ClassSchemaType = z.infer<typeof ClassSchema>

export const teacherSchema = z.object({
    id: z.string().optional(),
    username: z.string()
        .min(3, { message: 'atleast 3 character are required' })
        .max(20, { message: 'You can use 20 character maximum' }),
    email: z.string()
        .email({ message: 'Invalid email address' })
        .optional()
        .or(z.literal("")),
    password: z.string()
        .min(8, { message: 'Minimum 8 character required' }),
    firstName: z.string()
        .min(1, { message: 'Field is required' }),
    lastName: z.string()
        .min(1, { message: 'Field is required' }),
    phone: z.string()
        .min(11, { message: 'Minimum 11 character are required' }),
    address: z.string()
        .min(1, { message: 'Address is required' }),
    birthday: z.string().refine(val => !isNaN(Date.parse(val)), {
        message: "Invalid date",
    }),
    bloodgroup: z.string()
        .min(2, { message: 'Miniumu 2 character required' }),
    gender: z.enum(['MALE', 'FEMALE'], { message: 'Gender is required' }),
    //   img: z.instanceof(File, {message: 'File is required'}),
    img: z.string()
        .optional(),
    subjects: z.array(z.string())
        .optional(),
    classes: z.array(z.string())
        .optional(),
    lessons: z.array(z.string())
        .optional(),
});

export const studentSchema = z.object({
    id: z.string().optional(),
    username: z.string()
        .min(3, { message: 'atleast 3 character are required' })
        .max(20, { message: 'You can use 20 character maximum' }),
    email: z.string()
        .email({ message: 'Invalid email address' })
        .optional()
        .or(z.literal("")),
    password: z.string()
        .min(8, { message: 'Minimum 8 character required' }),
    firstName: z.string()
        .min(1, { message: 'Field is required' }),
    lastName: z.string()
        .min(1, { message: 'Field is required' }),
    phone: z.string()
        .min(11, { message: 'Minimum 11 character are required' }),
    address: z.string()
        .min(1, { message: 'Address is required' }),
    birthday: z.string().refine(val => !isNaN(Date.parse(val)), {
        message: "Invalid date",
    }),
    bloodgroup: z.string()
        .min(2, { message: 'Miniumu 2 character required' }),
    gender: z.enum(['MALE', 'FEMALE'], { message: 'Gender is required' }),
    //   img: z.instanceof(File, {message: 'File is required'}),
    img: z.string()
        .optional(),
    parentId: z.string(),
    classId: z.number().or(z.string()),
    gradeId: z.number().or(z.string()),
});

export const parentSchema = z.object({
    id: z.string().optional(),
    username: z.string()
        .min(3, { message: 'atleast 3 character are required' })
        .max(20, { message: 'You can use 20 character maximum' }),
    email: z.string()
        .email({ message: 'Invalid email address' })
        .optional()
        .or(z.literal("")),
    password: z.string()
        .min(8, { message: 'Minimum 8 character required' }),
    firstName: z.string()
        .min(1, { message: 'Field is required' }),
    lastName: z.string()
        .min(1, { message: 'Field is required' }),
    phone: z.string()
        .min(11, { message: 'Minimum 11 character are required' }),
    address: z.string()
        .min(1, { message: 'Address is required' }),
});

export const lessontSchema = z.object({
    id: z.number().optional(),
    name: z.string()
        .min(3, { message: 'Mininum 3 character are required' })
        .max(20, { message: 'You can use 20 character maximum' }),
    day: z.enum(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'], { message: 'Day is required' }),
    startTime: z.string().regex(timeRegex, {
        message: "Invalid time format (HH:mm)",
    }),
    endTime: z.string().regex(timeRegex, {
        message: "Invalid time format (HH:mm)",
    }),
    subjectId: z.string().or(z.number()),
    classId: z.string().or(z.number()),
    teacherId: z.string(),
});

export const examSchema = z.object({
    id: z.number().optional(),
    title: z.string()
        .min(3, { message: 'Mininum 3 character are required' })
        .max(20, { message: 'You can use 20 character maximum' }),
    startTime: z.string().refine(val => !isNaN(Date.parse(val)), {
        message: "Invalid date",
    }),
    endTime: z.string().refine(val => !isNaN(Date.parse(val)), {
        message: "Invalid date",
    }),
    lessonId: z.string().or(z.number()),
});

export const assignmentSchema = z.object({
    id: z.number().optional(),
    title: z.string()
        .min(3, { message: 'Mininum 3 character are required' })
        .max(20, { message: 'You can use 20 character maximum' }),
    startDate: z.string().refine(val => !isNaN(Date.parse(val)), {
        message: "Invalid date",
    }),
    dueDate: z.string().refine(val => !isNaN(Date.parse(val)), {
        message: "Invalid date",
    }),
    lessonId: z.string().or(z.number()),
});

export const eventSchema = z.object({
    id: z.number().optional(),
    title: z.string()
        .min(3, { message: 'Mininum 3 character are required' })
        .max(20, { message: 'You can use 20 character maximum' }),
    description: z.string(),
    startDate: z.string().refine(val => !isNaN(Date.parse(val)), {
        message: "Invalid date",
    }),
    endDate: z.string().refine(val => !isNaN(Date.parse(val)), {
        message: "Invalid date",
    }),
    classId: z.string().or(z.number()).optional(),
});

export const announcementSchema = z.object({
    id: z.number().optional(),
    title: z.string()
        .min(3, { message: 'Mininum 3 character are required' })
        .max(20, { message: 'You can use 20 character maximum' }),
    description: z.string(),
    date: z.string().refine(val => !isNaN(Date.parse(val)), {
        message: "Invalid date",
    }),
    classId: z.string().or(z.number()).optional(),
});

export const attendenceSchema = z.object({
    id: z.number().optional(),
    date: z.string().refine(val => !isNaN(Date.parse(val)), {
        message: "Invalid date",
    }),
    lessonId: z.number(),
    present: z.array(z.boolean()),
    studentId: z.array(z.string()),
});
