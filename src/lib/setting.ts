export const ITEM_PER_PAGE = 10;

type RouteAccessMap = {
    [key: string]: string[],
}

export const routeAccessMap: RouteAccessMap = {
    '/admin(.*)' : ["admin"],
    '/teacher(.*)' : ["teacher"],
    '/student(.*)' : ["student"],
    '/parent(.*)' : ["parent"],
    '/list/teachers(.*)' : ["admin", "teacher"],
    '/list/students(.*)' : ["admin", "teacher"],
    '/list/parents(.*)' : ["admin", "teacher"],
    '/list/subjects(.*)' : ["admin"],
    '/list/lessons(.*)' : ["admin", "teacher", "student", "parent"],
    '/list/classes(.*)' : ["admin", "teacher", "student", "parent"],
    '/list/exams(.*)' : ["admin", "teacher", "student", "parent"],
    '/list/results(.*)' : ["admin", "teacher", "student", "parent"],
    '/list/events(.*)' : ["admin", "teacher", "student", "parent"],
    '/list/announcements(.*)' : ["admin", "teacher", "student", "parent"],
    '/list/assignments(.*)' : ["admin", "teacher", "student", "parent"],
    '/list/attendence(.*)' : ["admin", "teacher", "student", "parent"],
}