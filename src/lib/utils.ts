import { auth } from "@clerk/nextjs/server";

export default async function getRole() {
  const { sessionClaims } = await auth();
  return (sessionClaims?.metadata as { role?: string })?.role ?? "guest";
}

// export default async function getRole() {
//   const role = 'admin'
//  return role; 
// }

export async function getUserId() {
  const { userId } = await auth();
 return userId; 
}

// export async function getUserId() {
//   const userId = '2222'
//  return userId; 
// }

const currentWorkWeek = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const startOfWeek = new Date(today);
  if(dayOfWeek === 0){
    startOfWeek.setDate(today.getDate() + 1);
  }else if(dayOfWeek === 6){
    startOfWeek.setDate(today.getDate() + 2);
  }else{
    startOfWeek.setDate(today.getDate());
  }
  startOfWeek.setHours(0,0,0,0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setHours(23, 59, 59, 999);
  return {startOfWeek, endOfWeek}
}

export const adjustScheduleToCurrentWeek = (
  lessons: { title: string; start: Date; end: Date }[]
): { title: string; start: Date; end: Date }[] => {
  const { startOfWeek } = currentWorkWeek();

  return lessons.map((lesson) => {
    const lessonDayOfWeek = lesson.start.getDay();
    const daysFromMonday = lessonDayOfWeek === 0 ? 6 : lessonDayOfWeek - 1;

    // Align start date to this week
    const adjustedStartDate = new Date(startOfWeek);
    adjustedStartDate.setDate(startOfWeek.getDate() + daysFromMonday);
    adjustedStartDate.setHours(
      lesson.start.getHours(),
      lesson.start.getMinutes(),
      lesson.start.getSeconds(),
      0
    );

    // Align end date accordingly
    const adjustedEndDate = new Date(startOfWeek);
    adjustedEndDate.setDate(startOfWeek.getDate() + daysFromMonday);
    adjustedEndDate.setHours(
      lesson.end.getHours(),
      lesson.end.getMinutes(),
      lesson.end.getSeconds(),
      999
    );

    return {
      title: lesson.title,
      start: adjustedStartDate,
      end: adjustedEndDate,
    };
  });
};
