import Menu from "../components/Menu";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/Navbar";
export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ul className="flex h-screen list-none">
        <li className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] pl-2 lg:pl-3 flex flex-col gap-10 sm:gap-2 text-sm h-screen">
          <Link href='/' className="flex gap-2 items-center my-2">
            <Image src='/logo.png' alt="logo" width={30} height={30}/>
            <span className="hidden lg:block font-bold text-gray-950">SmartSchool</span>
          </Link>
          <Menu/>
        </li>
        <li className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-gray-100 overflow-scroll scrollbar-hide">
          <Navbar/>
          {children}
        </li>
    </ul>
  );
}