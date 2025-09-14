"use server";
import { revalidatePath } from "next/cache";
import prisma from "./prisma";
import { clerkClient } from "@clerk/nextjs/server";

type CurrentState = {
    success: boolean,
    error: boolean
}

//helper functions
const relationSetter = (items: string[]) => {
    return items.length > 0
        ? { set: items.map((id) => ({ id: parseInt(id) })) }
        : undefined;
};

const relationCreatorSetter = (items: string[]) => {
    return items.length > 0
        ? { connect: items.map((id) => ({ id: parseInt(id) })) }
        : undefined;
};

function combineDateWithTime(timeStr: string) {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const now = new Date();
    now.setHours(hours, minutes, 0, 0); // set to chosen time
    return now;
}

export const createSubject = async (currentState: CurrentState, data: any) => {
    try {
        const name = data?.get("name") as string;
        const teacherData = data?.get('teachers') as string;
        const teachers = teacherData.split(',');
        await prisma.subject.create({
            data: {
                name: name,
                teachers: {
                    connect: teachers.map(teacherId => ({ id: teacherId }))
                }
            }
        })
        revalidatePath('/list/subjects');
        return { success: true, error: false }
    } catch (error) {
        console.log(error);
        return { success: false, error: true }
    }
}

export const updateSubject = async (currentState: CurrentState, data: any) => {
    try {
        const id = data?.get('id') as string;
        const name = data?.get('name') as string;
        const teacherData = data?.get('teachers') as string;
        const teachers = teacherData.split(',');
        console.log(teachers);
        await prisma.subject.update({
            where: {
                id: parseInt(id)
            },
            data: {
                name: name,
                teachers: {
                    set: teachers.map(teacherId => ({ id: teacherId }))
                }
            }
        })
        revalidatePath('/list/subjects');
        return { success: true, error: false }
    } catch (error) {
        console.log(error);
        return { success: false, error: true }
    }
}

export const deleteSubject = async (currentState: CurrentState, data: FormData): Promise<CurrentState> => {
    try {
        const id = data.get("id") as string;
        await prisma.subject.delete({
            where: {
                id: (parseInt(id)),
            },
        })
        revalidatePath('/list/subjects');
        return { success: true, error: false }
    } catch (error) {
        console.log(error);
        return { success: false, error: true }
    }
}

export const createClass = async (currentState: CurrentState, data: any) => {
    try {
        const name = data?.get("name") as string;
        const supervisor = data?.get("supervisorId") as string;
        const grade = data?.get("gradeId") as string;
        await prisma.class.create({
            data: {
                name: name,
                supervisorId: supervisor,
                gradeId: parseInt(grade),
            }
        })
        revalidatePath('/list/classes');
        return { success: true, error: false }
    } catch (error) {
        console.log(error);
        return { success: false, error: true }
    }
}

export const updateClass = async (currentState: CurrentState, data: any): Promise<{
    success: boolean;
    error: boolean;
}> => {
    try {
        const classId = data?.get('id') as string;
        const name = data?.get("name") as string;
        const supervisor = data?.get("supervisorId") as string;
        const grade = data?.get("gradeId") as string;
        await prisma.class.update({
            where: {
                id: parseInt(classId)
            },
            data: {
                name: name,
                supervisorId: supervisor,
                gradeId: parseInt(grade),
            }
        })
        revalidatePath('/list/classes');
        return { success: true, error: false }
    } catch (error) {
        console.log(error);
        return { success: false, error: true }
    }
}

export const deleteClass = async (currentState: CurrentState, data: FormData): Promise<CurrentState> => {
    try {
        const id = data.get("id") as string;
        await prisma.class.delete({
            where: {
                id: (parseInt(id)),
            },
        })
        revalidatePath('/list/classes');
        return { success: true, error: false }
    } catch (error) {
        console.log(error);
        return { success: false, error: true }
    }
}

export const createTeacher = async (currentState: CurrentState, data: any) => {
    try {
        const username = data?.get("username") as string;
        const email = data?.get("email") as string || null;
        const password = data?.get("password") as string;
        const name = data?.get("firstName") as string;
        const surname = data?.get("lastName") as string;
        const phone = data?.get("phone") as string;
        const address = data?.get("address") as string;
        const img = data?.get("img") as string || null;
        const bloodgroup = data?.get("bloodgroup") as string;
        const gender = data?.get("gender") as "MALE" | "FEMALE";
        const birthday = data?.get("birthday") as string;
        const subjects = (data?.get("subjects") as string)?.split(",").filter(Boolean) ?? [];
        const classes = (data?.get("classes") as string)?.split(",").filter(Boolean) ?? [];
        const lessons = (data?.get("lessons") as string)?.split(",").filter(Boolean) ?? [];
        //========creating clerk user===========
        const client = await clerkClient();
        const user = await client.users.createUser({
            firstName: name,
            lastName: surname,
            emailAddress: email ? [email] : undefined,
            username: username,
            password: password,
            publicMetadata: {
                role: "teacher" // or "admin", "moderator", "viewer"
            }
        });

        // Now create teacher in your database
        await prisma.teacher.create({
            data: {
                id: user.id,
                username,
                name,
                surname,
                email,
                phone,
                img,
                address,
                bloodgroup,
                gender,
                birthday: new Date(birthday),
                subjects: relationCreatorSetter(subjects),
                lessons: relationCreatorSetter(lessons),
                classes: relationCreatorSetter(classes),
            }
        });

        revalidatePath('/list/teachers');
        return { success: true, error: false };
    } catch (error: any) {
        if (error.clerkError) {
            console.log('Clerk Error Details:', error.errors);
            console.log('Status:', error.status);
            console.log('Trace ID:', error.clerkTraceId);
        } else if (error.prisma) {
            console.log('Prisma error:', error.errors);
        } else {
            console.log('Other errors', error);
        }
        return { success: false, error: true };
    }
}

export const updateTeacher = async (prevState: { success: boolean; error: boolean }, data: FormData): Promise<{
    success: boolean;
    error: boolean;
}> => {
    try {
        const id = data?.get("id") as string;
        const email = data?.get("email") as string || null;
        const name = data?.get("firstName") as string;
        const surname = data?.get("lastName") as string;
        const username = data?.get("username") as string;
        const phone = data?.get("phone") as string;
        const address = data?.get("address") as string;
        const img = data?.get("img") as string || null;
        const bloodgroup = data?.get("bloodgroup") as string;
        const gender = data?.get("gender") as "MALE" | "FEMALE";
        const birthday = data?.get("birthday") as string;
        const subjects = (data?.get("subjects") as string)?.split(",").filter(Boolean) ?? [];
        const classes = (data?.get("classes") as string)?.split(",").filter(Boolean) ?? [];
        const lessons = (data?.get("lessons") as string)?.split(",").filter(Boolean) ?? [];

        // Now updating teacher in your database
        await prisma.teacher.update({
            where: {
                id,
            },
            data: {
                username,
                name,
                surname,
                email,
                phone,
                img,
                address,
                bloodgroup,
                gender,
                birthday: new Date(birthday),
                subjects: relationSetter(subjects),
                classes: relationSetter(classes),
                lessons: relationSetter(lessons),
            }
        });
        revalidatePath('/list/teachers');
        return { success: true, error: false };
    } catch (error: any) {
        if (error.clerkError) {
            console.log('Clerk Error Details:', error.errors);
            console.log('Status:', error.status);
            console.log('Trace ID:', error.clerkTraceId);
        } else if (error.prisma) {
            console.log('Prisma error:', error.errors);
        } else {
            console.log('Other errors', error);
        }
        return { success: false, error: true };
    }
}

export const deleteTeacher = async (currentState: CurrentState, data: FormData): Promise<CurrentState> => {
    try {
        const teacherId = data.get("id") as string;
        await prisma.teacher.delete({
            where: {
                id: teacherId,
            },
        })
        const client = await clerkClient();
        await client.users.deleteUser(teacherId);
        revalidatePath('/list/teachers');
        return { success: true, error: false }
    } catch (error) {
        console.log(error);
        return { success: false, error: true }
    }
}

export const createStudent = async (currentState: CurrentState, data: any) => {
    try {
        const username = data?.get("username") as string;
        const email = data?.get("email") as string || null;
        const password = data?.get("password") as string;
        const name = data?.get("firstName") as string;
        const surname = data?.get("lastName") as string;
        const phone = data?.get("phone") as string;
        const address = data?.get("address") as string;
        const img = data?.get("img") as string || null;
        const bloodgroup = data?.get("bloodgroup") as string;
        const gender = data?.get("gender") as "MALE" | "FEMALE";
        const birthday = data?.get("birthday") as string;
        const classId = parseInt((data?.get("classId") as string));
        const gradeId = parseInt((data?.get("gradeId") as string));
        const parentId = (data?.get("parentId") as string);
        //========creating clerk user===========
        const client = await clerkClient();
        const user = await client.users.createUser({
            firstName: name,
            lastName: surname,
            emailAddress: email ? [email] : undefined,
            username: username,
            password: password,
            publicMetadata: {
                role: "student" // or "admin", "moderator", "viewer"
            }
        });

        // Now create teacher in your database
        await prisma.student.create({
            data: {
                id: user.id,
                username,
                name,
                surname,
                email,
                phone,
                img,
                address,
                bloodgroup,
                gender,
                birthday: new Date(birthday),
                classId,
                gradeId,
                parentId,
            }
        });

        revalidatePath('/list/students');
        return { success: true, error: false };
    } catch (error: any) {
        if (error.clerkError) {
            console.log('Clerk Error Details:', error.errors);
            console.log('Status:', error.status);
            console.log('Trace ID:', error.clerkTraceId);
        } else if (error.prisma) {
            console.log('Prisma error:', error.errors);
        } else {
            console.log('Other errors', error);
        }
        return { success: false, error: true };
    }
}

export const updateStudent = async (prevState: { success: boolean; error: boolean }, data: FormData): Promise<{
    success: boolean;
    error: boolean;
}> => {
    try {
        const id = data?.get("id") as string;
        const email = data?.get("email") as string || null;
        const name = data?.get("firstName") as string;
        const username = data?.get("username") as string;
        const surname = data?.get("lastName") as string;
        const phone = data?.get("phone") as string;
        const address = data?.get("address") as string;
        const img = data?.get("img") as string || null;
        const bloodgroup = data?.get("bloodgroup") as string;
        const gender = data?.get("gender") as "MALE" | "FEMALE";
        const birthday = data?.get("birthday") as string;
        const classId = parseInt((data?.get("classId") as string));
        const gradeId = parseInt((data?.get("gradeId") as string));
        const parentId = (data?.get("parentId") as string);

        // Now updating teacher in your database
        await prisma.student.update({
            where: {
                id,
            },
            data: {
                name,
                username,
                surname,
                email,
                phone,
                img,
                address,
                bloodgroup,
                gender,
                birthday: new Date(birthday),
                classId,
                gradeId,
                parentId,
            }
        });
        revalidatePath('/list/students');
        return { success: true, error: false };
    } catch (error: any) {
        if (error.clerkError) {
            console.log('Clerk Error Details:', error.errors);
            console.log('Status:', error.status);
            console.log('Trace ID:', error.clerkTraceId);
        } else if (error.prisma) {
            console.log('Prisma error:', error.errors);
        } else {
            console.log('Other errors', error);
        }
        return { success: false, error: true };
    }
}

export const deleteStudent = async (currentState: CurrentState, data: FormData): Promise<CurrentState> => {
    try {
        const studentId = data.get("id") as string;
        await prisma.student.delete({
            where: {
                id: studentId,
            },
        })
        const client = await clerkClient();
        await client.users.deleteUser(studentId);
        revalidatePath('/list/students');
        return { success: true, error: false }
    } catch (error) {
        console.log(error);
        return { success: false, error: true }
    }
}

export const createParent = async (currentState: CurrentState, data: any) => {
    try {
        const username = data?.get("username") as string;
        const email = data?.get("email") as string || null;
        const password = data?.get("password") as string;
        const name = data?.get("firstName") as string;
        const surname = data?.get("lastName") as string;
        const phone = data?.get("phone") as string;
        const address = data?.get("address") as string;

        //========creating clerk user===========
        const client = await clerkClient();
        const user = await client.users.createUser({
            firstName: name,
            lastName: surname,
            emailAddress: email ? [email] : undefined,
            username: username,
            password: password,
            publicMetadata: {
                role: "parent" // or "admin", "moderator", "viewer"
            }
        });

        // Now create teacher in your database
        await prisma.parent.create({
            data: {
                id: user.id,
                username,
                name,
                surname,
                email,
                phone,
                address,
            }
        });

        revalidatePath('/list/parents');
        return { success: true, error: false };
    } catch (error: any) {
        if (error.clerkError) {
            console.log('Clerk Error Details:', error.errors);
            console.log('Status:', error.status);
            console.log('Trace ID:', error.clerkTraceId);
        } else if (error.prisma) {
            console.log('Prisma error:', error.errors);
        } else {
            console.log('Other errors', error);
        }
        return { success: false, error: true };
    }
}

export const updateParent = async (prevState: { success: boolean; error: boolean }, data: FormData): Promise<{
    success: boolean;
    error: boolean;
}> => {
    try {
        const id = data?.get("id") as string;
        const username = data?.get("username") as string;
        const email = data?.get("email") as string || null;
        const password = data?.get("password") as string;
        const name = data?.get("firstName") as string;
        const surname = data?.get("lastName") as string;
        const phone = data?.get("phone") as string;
        const address = data?.get("address") as string;

        // Now updating teacher in your database
        await prisma.parent.update({
            where: {
                id,
            },
            data: {
                username,
                name,
                surname,
                email,
                phone,
                address,
            }
        });
        revalidatePath('/list/teachers');
        return { success: true, error: false };
    } catch (error: any) {
        if (error.clerkError) {
            console.log('Clerk Error Details:', error.errors);
            console.log('Status:', error.status);
            console.log('Trace ID:', error.clerkTraceId);
        } else if (error.prisma) {
            console.log('Prisma error:', error.errors);
        } else {
            console.log('Other errors', error);
        }
        return { success: false, error: true };
    }
}

export const deleteParent = async (currentState: CurrentState, data: FormData): Promise<CurrentState> => {
    try {
        const parentId = data.get("id") as string;
        await prisma.parent.delete({
            where: {
                id: parentId,
            },
        })
        const client = await clerkClient();
        await client.users.deleteUser(parentId);
        revalidatePath('/list/teachers');
        return { success: true, error: false }
    } catch (error) {
        console.log(error);
        return { success: false, error: true }
    }
}

export const createLesson = async (currentState: CurrentState, data: any) => {
    try {
        const name = data?.get("name") as string;
        const day = data?.get("day") as "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY";
        const startTime = combineDateWithTime(data?.get("startTime") as string);
        const endTime = combineDateWithTime(data?.get("endTime") as string);
        const subjectId = parseInt(data?.get("subjectId") as string);
        const classId = parseInt(data?.get("classId") as string);
        const teacherId = data?.get("teacherId") as string;

        // Now create lesson in your database
        await prisma.lesson.create({
            data: {
                name,
                day,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                subjectId,
                classId,
                teacherId,
            }
        });

        revalidatePath('/list/lessons');
        return { success: true, error: false };
    } catch (error: any) {
        if (error.clerkError) {
            console.log('Clerk Error Details:', error.errors);
            console.log('Status:', error.status);
            console.log('Trace ID:', error.clerkTraceId);
        } else if (error.prisma) {
            console.log('Prisma error:', error.errors);
        } else {
            console.log('Other errors', error);
        }
        return { success: false, error: true };
    }
}

export const updateLesson = async (prevState: { success: boolean; error: boolean }, data: FormData): Promise<{
    success: boolean;
    error: boolean;
}> => {
    try {
        const id = parseInt(data?.get("id") as string);
        const name = data?.get("name") as string;
        const day = data?.get("day") as "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY";
        const startTime = combineDateWithTime(data?.get("startTime") as string);
        const endTime = combineDateWithTime(data?.get("endTime") as string);
        const subjectId = parseInt(data?.get("subjectId") as string);
        const classId = parseInt(data?.get("classId") as string);
        const teacherId = data?.get("teacherId") as string;

        // Now updating teacher in your database
        await prisma.lesson.update({
            where: {
                id,
            },
            data: {
                name,
                day,
                startTime,
                endTime,
                subjectId,
                classId,
                teacherId,
            }
        });
        revalidatePath('/list/lessons');
        return { success: true, error: false };
    } catch (error: any) {
        if (error.clerkError) {
            console.log('Clerk Error Details:', error.errors);
            console.log('Status:', error.status);
            console.log('Trace ID:', error.clerkTraceId);
        } else if (error.prisma) {
            console.log('Prisma error:', error.errors);
        } else {
            console.log('Other errors', error);
        }
        return { success: false, error: true };
    }
}

export const deleteLesson = async (currentState: CurrentState, data: FormData): Promise<CurrentState> => {
    try {
        const lessonId = parseInt(data.get("id") as string);
        await prisma.lesson.delete({
            where: {
                id: lessonId,
            },
        })

        revalidatePath('/list/lessons');
        return { success: true, error: false }
    } catch (error) {
        console.log(error);
        return { success: false, error: true }
    }
}

export const createExam = async (currentState: CurrentState, data: any) => {
    try {
        const title = data?.get("title") as string;
        const startTime = new Date(data?.get("startTime") as string);
        const endTime = new Date(data?.get("endTime") as string);
        const lessonId = parseInt(data?.get("lessonId") as string);

        // Now create lesson in your database
        await prisma.exam.create({
            data: {
                title,
                startTime,
                endTime,
                lessonId,
            }
        });

        revalidatePath('/list/exams');
        return { success: true, error: false };
    } catch (error: any) {
        if (error.clerkError) {
            console.log('Clerk Error Details:', error.errors);
            console.log('Status:', error.status);
            console.log('Trace ID:', error.clerkTraceId);
        } else if (error.prisma) {
            console.log('Prisma error:', error.errors);
        } else {
            console.log('Other errors', error);
        }
        return { success: false, error: true };
    }
}

export const updateExam = async (prevState: { success: boolean; error: boolean }, data: FormData): Promise<{
    success: boolean;
    error: boolean;
}> => {
    try {
        const id = parseInt(data?.get("id") as string);
        const title = data?.get("title") as string;
        const startTime = new Date(data?.get("startTime") as string);
        const endTime = new Date(data?.get("endTime") as string);
        const lessonId = parseInt(data?.get("lessonId") as string);

        // Now updating teacher in your database
        await prisma.exam.update({
            where: {
                id,
            },
            data: {
                title,
                startTime,
                endTime,
                lessonId,
            }
        });
        revalidatePath('/list/exams');
        return { success: true, error: false };
    } catch (error: any) {
        if (error.clerkError) {
            console.log('Clerk Error Details:', error.errors);
            console.log('Status:', error.status);
            console.log('Trace ID:', error.clerkTraceId);
        } else if (error.prisma) {
            console.log('Prisma error:', error.errors);
        } else {
            console.log('Other errors', error);
        }
        return { success: false, error: true };
    }
}

export const deleteExam = async (currentState: CurrentState, data: FormData): Promise<CurrentState> => {
    try {
        const examId = parseInt(data.get("id") as string);
        await prisma.exam.delete({
            where: {
                id: examId,
            },
        })
        revalidatePath('/list/exams');
        return { success: true, error: false }
    } catch (error) {
        console.log(error);
        return { success: false, error: true }
    }
}

export const createAssignments = async (currentState: CurrentState, data: any) => {
    try {
        const title = data?.get("title") as string;
        const startDate = new Date(data?.get("startTime") as string);
        const dueDate = new Date(data?.get("endTime") as string);
        const lessonId = parseInt(data?.get("lessonId") as string);

        // Now create lesson in your database
        await prisma.assignment.create({
            data: {
                title,
                startDate,
                dueDate,
                lessonId,
            }
        });

        revalidatePath('/list/assignments');
        return { success: true, error: false };
    } catch (error: any) {
        if (error.clerkError) {
            console.log('Clerk Error Details:', error.errors);
            console.log('Status:', error.status);
            console.log('Trace ID:', error.clerkTraceId);
        } else if (error.prisma) {
            console.log('Prisma error:', error.errors);
        } else {
            console.log('Other errors', error);
        }
        return { success: false, error: true };
    }
}

export const updateAssignment = async (prevState: { success: boolean; error: boolean }, data: FormData): Promise<{
    success: boolean;
    error: boolean;
}> => {
    try {
        const id = parseInt(data?.get("id") as string);
        const title = data?.get("title") as string;
        const startDate = new Date(data?.get("startDate") as string);
        const dueDate = new Date(data?.get("dueDate") as string);
        const lessonId = parseInt(data?.get("lessonId") as string);

        // Now updating teacher in your database
        await prisma.assignment.update({
            where: {
                id,
            },
            data: {
                title,
                startDate,
                dueDate,
                lessonId,
            }
        });
        revalidatePath('/list/assignments');
        return { success: true, error: false };
    } catch (error: any) {
        if (error.clerkError) {
            console.log('Clerk Error Details:', error.errors);
            console.log('Status:', error.status);
            console.log('Trace ID:', error.clerkTraceId);
        } else if (error.prisma) {
            console.log('Prisma error:', error.errors);
        } else {
            console.log('Other errors', error);
        }
        return { success: false, error: true };
    }
}

export const deleteAssignment = async (currentState: CurrentState, data: FormData): Promise<CurrentState> => {
    try {
        const assignmentId = parseInt(data.get("id") as string);
        await prisma.assignment.delete({
            where: {
                id: assignmentId,
            },
        })
        revalidatePath('/list/assignments');
        return { success: true, error: false }
    } catch (error) {
        console.log(error);
        return { success: false, error: true }
    }
}
export const createEvent = async (currentState: CurrentState, data: any) => {
    try {
        const title = data?.get("title") as string;
        const description = data?.get("description") as string;
        const startDate = new Date(data?.get("startDate") as string);
        const endDate = new Date(data?.get("endDate") as string);
        const classId = parseInt(data?.get("classId") as string) || null;

        // Now create lesson in your database
        await prisma.event.create({
            data: {
                title,
                description,
                startDate,
                endDate,
                classId,
            }
        });

        revalidatePath('/list/events');
        return { success: true, error: false };
    } catch (error: any) {
        if (error.clerkError) {
            console.log('Clerk Error Details:', error.errors);
            console.log('Status:', error.status);
            console.log('Trace ID:', error.clerkTraceId);
        } else if (error.prisma) {
            console.log('Prisma error:', error.errors);
        } else {
            console.log('Other errors', error);
        }
        return { success: false, error: true };
    }
}

export const updateEvent = async (prevState: { success: boolean; error: boolean }, data: FormData): Promise<{
    success: boolean;
    error: boolean;
}> => {
    try {
        const id = parseInt(data?.get("id") as string);
        const title = data?.get("title") as string;
        const description = data?.get("description") as string;
        const startDate = new Date(data?.get("startDate") as string);
        const endDate = new Date(data?.get("endDate") as string);
        const classId = parseInt(data?.get("classId") as string) || null;

        // Now updating teacher in your database
        await prisma.event.update({
            where: {
                id,
            },
            data: {
                title,
                description,
                startDate,
                endDate,
                classId,
            }
        });
        revalidatePath('/list/events');
        return { success: true, error: false };
    } catch (error: any) {
        if (error.clerkError) {
            console.log('Clerk Error Details:', error.errors);
            console.log('Status:', error.status);
            console.log('Trace ID:', error.clerkTraceId);
        } else if (error.prisma) {
            console.log('Prisma error:', error.errors);
        } else {
            console.log('Other errors', error);
        }
        return { success: false, error: true };
    }
}

export const deleteEvent = async (currentState: CurrentState, data: FormData): Promise<CurrentState> => {
    try {
        const eventId = parseInt(data.get("id") as string);
        await prisma.event.delete({
            where: {
                id: eventId,
            },
        })
        revalidatePath('/list/events');
        return { success: true, error: false }
    } catch (error) {
        console.log(error);
        return { success: false, error: true }
    }
}

export const createAnnouncement = async (currentState: CurrentState, data: any) => {
    try {
        const title = data?.get("title") as string;
        const description = data?.get("description") as string;
        const date = new Date(data?.get("date") as string);
        const classId = parseInt(data?.get("classId") as string) || null;

        // Now create lesson in your database
        await prisma.announcement.create({
            data: {
                title,
                description,
                date,
                classId,
            }
        });

        revalidatePath('/list/announcements');
        return { success: true, error: false };
    } catch (error: any) {
        if (error.clerkError) {
            console.log('Clerk Error Details:', error.errors);
            console.log('Status:', error.status);
            console.log('Trace ID:', error.clerkTraceId);
        } else if (error.prisma) {
            console.log('Prisma error:', error.errors);
        } else {
            console.log('Other errors', error);
        }
        return { success: false, error: true };
    }
}

export const updateAnnouncement = async (prevState: { success: boolean; error: boolean }, data: FormData): Promise<{
    success: boolean;
    error: boolean;
}> => {
    try {
        const id = parseInt(data?.get("id") as string);
        const title = data?.get("title") as string;
        const description = data?.get("description") as string;
        const date = new Date(data?.get("date") as string);
        const classId = parseInt(data?.get("classId") as string) || null;

        // Now updating teacher in your database
        await prisma.announcement.update({
            where: {
                id,
            },
            data: {
                title,
                description,
                date,
                classId,
            }
        });
        revalidatePath('/list/announcements');
        return { success: true, error: false };
    } catch (error: any) {
        if (error.clerkError) {
            console.log('Clerk Error Details:', error.errors);
            console.log('Status:', error.status);
            console.log('Trace ID:', error.clerkTraceId);
        } else if (error.prisma) {
            console.log('Prisma error:', error.errors);
        } else {
            console.log('Other errors', error);
        }
        return { success: false, error: true };
    }
}

export const deleteAnnouncement = async (currentState: CurrentState, data: FormData): Promise<CurrentState> => {
    try {
        const announcementId = parseInt(data.get("id") as string);
        await prisma.announcement.delete({
            where: {
                id: announcementId,
            },
        })
        revalidatePath('/list/announcements');
        return { success: true, error: false }
    } catch (error) {
        console.log(error);
        return { success: false, error: true }
    }
}

export const createAttendence = async (currentState: CurrentState, data: FormData) => {
  try {
    const date = new Date(data.get("date") as string);
    const lessonId = parseInt(data.get("lessonId") as string);

    // Get all students & presents
    const studentIds = (data.get("studentId") as string).split(',');
    const presentValues = ((data.get("present") as string).split(',')).map(v => v === 'true');
    
    //=======delete attendence if available
    await prisma.attendence.deleteMany({ where: { date, lessonId } });

    // Loop and insert
    for (let i = 0; i < studentIds.length; i++) {
      await prisma.attendence.create({
        data: {
          date,
          lessonId,
          studentId: studentIds[i],   // keep as string ✅
          present: presentValues[i],
        },
      });
    }
    console.log("attendenceMarked successfully")

    revalidatePath("/list/mark-attendence");
    return { success: true, error: false };

  } catch (error: any) {
    console.error("Attendence error:", error);
    return { success: false, error: true };
  }
};
