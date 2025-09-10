import Image from "next/image";
import { motion } from "framer-motion";
import CountChart from "./CountCharts";
import prisma from "@/lib/prisma";

const StudentCountContainer = async () => {
    const data = await prisma.student.groupBy({
        by: ["gender"],
        _count: true
    })
    const boys = data.find(d=> d.gender === 'MALE')?._count || 0;
    const girls = data.find(d=> d.gender === 'FEMALE')?._count || 0;
    return (
        <div
            className="h-full bg-white relative flex flex-col items-center justify-center rounded-2xl py-5"
        >
            {/* <motion.span
                className="mb-2 font-semibold"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                Students
            </motion.span> */}
            <div>Student</div>

            <div>
                <Image
                    src="/malefemale.png"
                    alt="students"
                    width={20}
                    height={20}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                />
            </div>
            <CountChart boys={boys} girls={girls}/>
            <div className="flex justify-between w-35 ">
                <div className="flex flex-col items-center">
                    <div className="w-5 h-5 rounded-full bg-[#C3EBFa]" />
                    <span className="text-sm text-gray-500">{girls}</span>
                    <span className="text-xs text-gray-300">Girls {Math.round(girls / (girls + boys) * 100)}%</span>
                </div>
                <div className="flex flex-col items-center">
                    <div className="w-5 h-5 rounded-full bg-[#FAE27C]" />
                    <span className="text-sm text-gray-500">{boys}</span>
                    <span className="text-xs text-gray-300">Boys {Math.round(boys / (girls + boys) * 100)}%</span>
                </div>
            </div>
        </div>
    )
}

export default StudentCountContainer
