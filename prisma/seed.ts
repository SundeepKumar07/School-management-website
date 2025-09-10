import { PrismaClient } from '../src/generated/prisma'; // path to your generated client

const prisma = new PrismaClient();

async function main() {
    // Create an admin
    const admin = await prisma.admin.create({
        data: {
            id: 'admin1',
            username: 'superadmin1',
        },
    });

    // Create a grade
    for (let i = 1; i < 10; i++) {
        await prisma.grade.create({
            data: {
                level: `Grade${i}`,
            },
        });
    }
    // Create a class with a supervisor (teacher)
    for (let i = 1; i < 21; i++) {
        await prisma.teacher.create({
            data: {
                id: `${i}`,
                username: `teacher${i}`,
                name: 'John',
                surname: 'Doe',
                email: `john.doe${i}@example.com`,
                phone: `123456789${i}`,
                address: '123 Main St',
                bloodgroup: 'O+',
                gender: 'MALE',
            },
        });
    }

    for (let i = 1; i < 11; i++) {
        await prisma.class.create({
            data: {
                name: `${i}A`,
                gradeId: 1,
                supervisorId: `${i}`, // link to teacher
            },
        });
    }

    for (let i = 1; i < 11; i++) {
        await prisma.subject.create({
            data: {
                name: `Math${i}A`,
                teachers: { connect: { id: `${i}` } }, // connect teacher with matching ID
            },
        })
    }

    for (let i = 1; i < 10; i++) {
        const hourStart = String(i + 7).padStart(2, "0");
        const hourEnd = String(i + 8).padStart(2, "0");
        await prisma.lesson.create({
            data: {
                name: `Math${i}`,
                day: 'MONDAY',
                startTime: new Date(`2025-09-01T${hourStart}:00:00.000Z`),
                endTime: new Date(`2025-09-01T${hourEnd}:00:00.000Z`),
                subjectId: i, // Subject IDs start at 1
                classId: i,
                teacherId: `${i}`, // Teacher ID string
            },
        });
    }

    for (let i = 1; i < 8; i++) {
        await prisma.exam.create({
            data: {
                title: `Mid Term`,
                startTime: new Date('2025-08-30T10:00:00.000Z'),
                endTime: new Date('2025-08-30T11:00:00.000Z'),
                lessonId: i, // lesson IDs start at 1
            },
        });
    }

    for (let i = 1; i < 8; i++) {
        await prisma.assignment.create({
            data: {
                title: `Writen Work`,
                startDate: new Date('2025-08-30T10:00:00.000Z'),
                dueDate: new Date('2025-08-30T11:00:00.000Z'),
                lessonId: i, // lesson IDs start at 1
            },
        });
    }

    // Create a parent
    for (let i = 1; i < 51; i++) {
        await prisma.parent.create({
            data: {
                id: `parent${i}`,
                username: `parent${i}`,
                name: 'Jane',
                surname: 'Doe',
                email: `jane.doe${i}@example.com`,
                phone: `0987654321${i}`,
                address: '456 Elm St',
            },
        });
    }

    // Create a student
    for (let i = 1; i < 51; i++) {
        await prisma.student.create({
            data: {
                id: `${i}`,   // better ID format
                username: `student${i}`,
                name: 'Alice',
                surname: 'Doe',
                phone: `111222333${i}`,
                address: '456 Elm St',
                bloodgroup: 'A+',
                gender: 'FEMALE',
                parentId: `parent${i}`, // matches created parents
                classId: 1,           // matches created classes
                gradeId: 1,
            },
        });
    }

    // for (let i = 1; i < 51; i++) {
    //     await prisma.result.create({
    //         data: {
    //             score: i % 3 === 0 ? 30 : i % 2 === 1 ? 40 : 50,
    //             examId: (i % 15) + 1,
    //             assignmentId: (i % 15) + 1,
    //             studentId: `${i}`, // lesson IDs start at 1
    //         },
    //     });
    // }

    for (let i = 0; i < 50; i++) {
        await prisma.attendence.create({
            data: {
                date: new Date(),
                present: i%2 === 0? true: false,
                studentId: `${i + 1}`,
                lessonId: (i/15) + 1,
            },
        });
    }

    for (let i = 1; i < 11; i++) {
        await prisma.event.create({
            data: {
                title: `Annual Event`,
                description: "Annual Event of the School. One of the biggest event and festival of the year",
                startDate: new Date(),
                endDate: new Date(),
            },
        });
    }
    
    for (let i = 1; i < 11; i++) {
        await prisma.announcement.create({
            data: {
                title: `Announcement for Annual Event`,
                description: "Annual Event of the School. One of the biggest event and festival of the year",
                date: new Date(),
            },
        });
    }
}
main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });