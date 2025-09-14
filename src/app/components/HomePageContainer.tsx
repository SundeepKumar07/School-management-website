'use client';

import Link from 'next/link';
import { GraduationCap, Users, BookOpen, CalendarDays, Megaphone, ClipboardCheck } from 'lucide-react';

export default function HomePageContainer({ role, userId }: { role?: string, userId?: string }) {
    return (
        <main className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="flex flex-col items-center justify-center text-center py-20 px-6 bg-gradient-to-r from-green-500 to-green-700 text-white">
                <GraduationCap size={64} className="mb-4" />
                <h1 className="text-4xl sm:text-5xl font-bold mb-4">SmartSchool Management System</h1>
                <p className="text-lg sm:text-xl max-w-2xl mb-6">
                    A complete platform that connects administrators, teachers, students, and parents — all in one place.
                </p>
                {userId ? 
                    <Link
                        href={`/${role}`}
                        className="bg-white text-green-700 font-semibold px-6 py-3 rounded-xl shadow hover:bg-gray-100 transition"
                        >
                        {`Go to ${role} Panel`}
                    </Link>
                    : <Link
                        href="/sign-in"
                        className="bg-white text-green-700 font-semibold px-6 py-3 rounded-xl shadow hover:bg-gray-100 transition"
                        >
                        Login to Your Account
                    </Link>
                }
            </section>

            {/* Features Section */}
            <section className="flex-1 py-16 px-6 bg-gray-50">
                <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">Core Features</h2>
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                    <FeatureCard
                        icon={<Users className="w-10 h-10 text-green-600" />}
                        title="Attendance"
                        description="Easily mark and track student attendance with real-time updates."
                    />
                    <FeatureCard
                        icon={<BookOpen className="w-10 h-10 text-green-600" />}
                        title="Assignments"
                        description="Manage homework, assignments, and submissions in one place."
                    />
                    <FeatureCard
                        icon={<CalendarDays className="w-10 h-10 text-green-600" />}
                        title="Events & Exams"
                        description="Stay updated with school events, timetables, and exam schedules."
                    />
                    <FeatureCard
                        icon={<Megaphone className="w-10 h-10 text-green-600" />}
                        title="Announcements"
                        description="Broadcast important updates to students and parents instantly."
                    />
                    <FeatureCard
                        icon={<ClipboardCheck className="w-10 h-10 text-green-600" />}
                        title="Results"
                        description="View exam results and performance reports securely online."
                    />
                    <FeatureCard
                        icon={<GraduationCap className="w-10 h-10 text-green-600" />}
                        title="Role-based Access"
                        description="Custom dashboards for Admins, Teachers, Students, and Parents."
                    />
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-green-700 text-white py-6 text-center text-sm">
                © {new Date().getFullYear()} SmartSchool. All rights reserved.
            </footer>
        </main>
    );
}

function FeatureCard({
    icon,
    title,
    description,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition flex flex-col items-center text-center">
            <div className="mb-4">{icon}</div>
            <h3 className="font-semibold text-lg mb-2">{title}</h3>
            <p className="text-gray-600 text-sm">{description}</p>
        </div>
    );
}