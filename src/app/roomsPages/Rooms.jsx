'use client';

import React, { useEffect, useState, useCallback, lazy, Suspense } from 'react';
import { FaFileExport } from 'react-icons/fa';
import gsap from 'gsap';
import { Inter } from 'next/font/google';
import RoomTable from './RoomTable';
import { AiOutlineUsergroupAdd } from 'react-icons/ai';
import { LuUserCheck } from 'react-icons/lu';
import { TbScreenShareOff } from 'react-icons/tb';
import ChartTwo from '@/components/Charts/ChartTwo';
import Card from '@/components/Dashboard/Card';

const AddBooking = lazy(() => import('./AddRoom'));
const EditRoom = lazy(() => import('./EditRoom'));
const PreviewRoom = lazy(() => import('./PreviewRoom'));
const PreviewRoom2 = lazy(() => import('./PreviewRoom2'));

const inter = Inter({ subsets: ['latin'], weight: ['400', '600'] });

const Rooms = ({ role }) => {
    const [openCreate, setOpenCreate] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openPreview, setOpenPreview] = useState(false);
    const [openPreview2, setOpenPreview2] = useState(false);

    const toggleOpenCreateModal = useCallback(() => setOpenCreate(prev => !prev), []);
    const toggleOpenEditModal = useCallback(() => setOpenEdit(prev => !prev), []);
    const toggleOpenPreviewModal = useCallback(() => setOpenPreview(prev => !prev), []);
    const toggleOpenPreviewModal2 = useCallback(() => setOpenPreview2(prev => !prev), []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
             let ctx = gsap.context(() => {
                gsap.fromTo(
                    ".chart-container",
                    { opacity: 0, y: 50 },
                    { opacity: 1, y: 0, duration: 1, stagger: 0.2 }
                );
                gsap.fromTo(".card1", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, stagger: 0.2 });
            });

            return () => ctx.revert(); 
        }
    }, []);



    return (
        <div className={`flex justify-between ${inter.className}`}>
            <div className='flex flex-col w-full'>
                <div>
                    <div className="animate-context">
                        <div className="flex w-full flex-col items-center gap-4 px-4 lg:flex-row xl:flex-row">
                            <div className="flex-1">
                                <div className="chart-container rounded-3xl bg-white py-5 pe-16 ps-8 shadow-md dark:bg-gray-dark xl:w-[48vw]">
                                    <div className="flex justify-between pb-12">
                                        <div>
                                            <h1 className="font-poppins fw-boldest text-3xl text-black dark:bg-gray-dark dark:text-white">
                                                Today’s Sales
                                            </h1>
                                            <h2 className="fw-boldest font-poppins text-gray-400">
                                                Sales Summary
                                            </h2>
                                        </div>
                                        <button className="flex h-full w-28 items-center justify-around gap-3 rounded-3xl border-2 border-blue-300 px-3 py-2">
                                            <FaFileExport /> Export
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-12 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                                        <Card
                                            icon={AiOutlineUsergroupAdd}
                                            label="Total Sales"
                                            h1="1k$"
                                            value="8% from yesterday"
                                            colorClass="bg-red-100"
                                            colorIcon="bg-[#FA5A7D]"
                                        />
                                        <Card
                                            icon={LuUserCheck}
                                            label="Total Booking"
                                            h1="300$"
                                            value="5% from yesterday"
                                            colorClass="bg-[#FFF4DE]"
                                            colorIcon="bg-[#FF947A]"
                                        />
                                        <Card
                                            icon={AiOutlineUsergroupAdd}
                                            label="Cancel Booking"
                                            h1="5$"
                                            value="3% from yesterday"
                                            colorClass="bg-[#F8B5B5]"
                                            colorIcon="bg-red-500"
                                        />
                                        <Card
                                            icon={TbScreenShareOff}
                                            label="New Booking"
                                            h1="400$"
                                            value="2% from yesterday"
                                            colorClass="bg-[#F3E8FF]"
                                            colorIcon="bg-[#BF83FF]"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="chart-container w-[90vw] rounded-2xl bg-white px-3 pt-3 shadow-md dark:bg-gray-dark dark:text-white md:w-[80vw] md:px-8 lg:w-[30vw] lg:px-2 xl:w-[30vw] xl:px-5">
                                <h3 className="text-lg font-bold">
                                    Reserved rooms / Empty rooms
                                </h3>
                                <ChartTwo />
                            </div>
                        </div>
                    </div>
                    <RoomTable
                        openEdit={toggleOpenEditModal}
                        openPreview={toggleOpenPreviewModal}
                        openCreate={toggleOpenCreateModal}
                    />
                    <Suspense fallback={<div>Loading...</div>}>
                        {openCreate && <AddBooking closeModal={toggleOpenCreateModal} modal={openCreate} role={role} />}
                        {openEdit && <EditRoom closeModal={toggleOpenEditModal} modal={openEdit} role={role} />}
                        {openPreview && (
                            <PreviewRoom
                                closeModal={() => setOpenPreview(false)}
                                openPreview2={toggleOpenPreviewModal2}
                            />
                        )}
                        {openPreview2 && <PreviewRoom2 closeModal={() => setOpenPreview2(false)} />}
                    </Suspense>
                </div>
            </div>
        </div>
    );
};

export default React.memo(Rooms);
