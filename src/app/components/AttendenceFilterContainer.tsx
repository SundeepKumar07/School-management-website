// app/AttendenceFilterContainer.tsx
import { fetchAllClasses } from "@/lib/fetchRelatedData";
import AttendenceFilter from "./AttendenceFilter";

export default async function AttendenceFilterContainer({type}: {type?: string}) {
  const classes = await fetchAllClasses();

  return <AttendenceFilter relatedData={{ classes }} type={type} />;
}