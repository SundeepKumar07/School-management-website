"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function AttendenceFilter({
    relatedData,
    type, // ✅ accept type
}: {
    relatedData: { classes: any };
    type?: string; // ✅ define type as optional
}) {
    const [selectedClass, setSelectedClass] = useState<number | null>(null);
    const [lessons, setLessons] = useState<{ id: number; name: string }[]>([]);
    const [selectedLesson, setSelectedLesson] = useState<number | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const router = useRouter();

    // Fetch lessons dynamically when class changes
    const handleClassChange = async (classId: number) => {
        setSelectedClass(classId);
        setSelectedLesson(null);

        const res = await fetch(`/api/lessons?classId=${classId}&type=${type || ""}`);
        const data = await res.json();
        setLessons(data);
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const params = new URLSearchParams(window.location.search);

        if (selectedClass) params.set("classId", selectedClass.toString());
        if (selectedLesson) params.set("lessonId", selectedLesson.toString());
        if (selectedDate) params.set("date", selectedDate);
        if (type) params.set("type", type); // ✅ keep type in query if needed

        router.push(`${window.location.pathname}?${params}`);
    };

    return (
        <div className="flex pt-4">
            <form onSubmit={handleSubmit} className="flex gap-1 items-center">
                <div className="flex gap-2 items-center">
                    {type === 'read' &&
                        <div>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="ring-2 outline-none ring-purple-500 bg-purple-200 py-0.5 px-2 rounded-md"
                            />
                        </div>
                    }
                    {/* Class Dropdown */}
                    <div className="flex gap-2 flex-col">
                        <select
                            defaultValue=""
                            onChange={(e) => handleClassChange(Number(e.target.value))}
                            className="ring-2 outline-none ring-blue-500 bg-blue-200 py-1 px-2 rounded-md"
                        >
                            <option value="" disabled>
                                Select a class
                            </option>
                            {relatedData.classes.map((cl: { id: number; name: string }) => (
                                <option key={cl.id} value={cl.id}>
                                    {cl.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-2 flex-col">
                        {/* Lesson Dropdown (only show if class selected) */}
                        {selectedClass && (
                            <select
                                defaultValue=""
                                onChange={(e) => setSelectedLesson(Number(e.target.value))}
                                className="ring-2 outline-none ring-green-500 bg-green-200 py-1 px-2 rounded-md"
                            >
                                <option value="" disabled>
                                    Select a lesson
                                </option>
                                {lessons.map((lesson) => (
                                    <option key={lesson.id} value={lesson.id}>
                                        {lesson.name}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                </div>
                <button
                    type="submit"
                    className="bg-black text-white py-1 px-2 rounded-md"
                >
                    Apply
                </button>
            </form>
        </div>
    );
}