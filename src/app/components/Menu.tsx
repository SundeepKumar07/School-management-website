import getRole from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { SignOutButton } from "./SignOutAndProfile";
// import { role } from "@/lib/data";

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "/home.png",
        label: "Home",
        href: "/",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/teacher.png",
        label: "Teachers",
        href: "/list/teachers",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/student.png",
        label: "Students",
        href: "/list/students",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/parent.png",
        label: "Parents",
        href: "/list/parents",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/subject.png",
        label: "Subjects",
        href: "/list/subjects",
        visible: ["admin"],
      },
      {
        icon: "/class.png",
        label: "Classes",
        href: "/list/classes",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/lesson.png",
        label: "Lessons",
        href: "/list/lessons",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/exam.png",
        label: "Exams",
        href: "/list/exams",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/assignment.png",
        label: "Assignments",
        href: "/list/assignments",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/result.png",
        label: "Results",
        href: "/list/results",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/attendance.png",
        label: "Attendance",
        href: "/list/attendance",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/calendar.png",
        label: "Events",
        href: "/list/events",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/message.png",
        label: "Messages",
        href: "/list/messages",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/announcement.png",
        label: "Announcements",
        href: "/list/announcements",
        visible: ["admin", "teacher", "student", "parent"],
      },
    ],
  },
  {
    title: "OTHER",
    items: [
      {
        icon: "/profile.png",
        label: "Profile",
        href: "/profile",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/setting.png",
        label: "Settings",
        href: "/settings",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/logout.png",
        label: "Logout",
        href: "/admin",
        visible: ["admin", "teacher", "student", "parent"],
      },
    ],
  },
];

const Menu = async () => {
  const role = await getRole();
  return (
    <div className="flex flex-col gap-2">
      {menuItems.map((mainItem) => (
        <div key={mainItem.title} className="flex flex-col gap-2">
          <span className="text-gray-300 font-bold lg:pl-0">{mainItem.title}</span>
          {mainItem.items.map((item) => {
            if (item.visible.includes(role)) {
              if (mainItem.title === 'OTHER' && item.label === 'Logout')
                  return (
                    <div key={item.label} className="cursor-pointer flex gap-2 justify-center items-center lg:justify-start lg:pl-3 rounded-md hover:bg-gray-100">
                      <Image src={'/logout.png'} alt="icon" width={20} height={20} />
                      <SignOutButton/>
                    </div>
                  )
              return (
                (
                  <Link href={item.href} key={item.label} title={item.label} className="cursor-pointer flex gap-2 justify-center items-center lg:justify-start lg:pl-3 rounded-md hover:bg-gray-100">
                    <Image src={item.icon} alt="icon" width={20} height={20} />
                    <span className="hidden lg:block">{item.label}</span>
                  </Link>
                )
              )
            }
          })}
        </div>
      ))}
    </div>
  )
}

export default Menu;
