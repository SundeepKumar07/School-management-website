'use server';

import prisma from "./prisma";

export const fetchAllTeachers = async () => {
    try {
        const data = await prisma.teacher.findMany({
            select: {
                id: true,
                name: true,
                surname: true
            }
        });
        return data;
    } catch (error) {
        console.log(error);
    }
}

export const fetchAllGrades = async () => {
    try {
        const data = await prisma.grade.findMany({
            select: {
                id: true,
                level: true,
            }
        });
        return data;
    } catch (error) {
        console.log(error);
    }
}

export const fetchAllLessons = async () => {
    try {
        const data = await prisma.lesson.findMany({
            select: {
                id: true,
                name: true,
            }
        });
        return data;
    } catch (error) {
        console.log(error);
    }
}

export const fetchAllSubjects = async () => {
    try {
        const data = await prisma.subject.findMany({
            select: {
                id: true,
                name: true,
            }
        });
        return data;
    } catch (error) {
        console.log(error);
    }
}

export const fetchAllClasses = async () => {
    try {
        const data = await prisma.class.findMany({
            select: {
                id: true,
                name: true,
            }
        });
        return data;
    } catch (error) {
        console.log(error);
    }
}

export const fetchAllParents = async () => {
    try {
        const data = await prisma.parent.findMany({
            select: {
                id: true,
                name: true,
                surname: true,
                address: true,
            }
        });
        return data;
    } catch (error) {
        console.log(error);
    }
}