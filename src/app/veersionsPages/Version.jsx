"use client"
import React, { useEffect, useState, useCallback } from 'react';
import { FaStar } from 'react-icons/fa';
import gsap from 'gsap';
import HotelTable from './versionTable';
import AddHotel from './AddVersions';
import PreviewHotel from '../requestPages/PreviewRequest';
import ChartEight from '@/components/Charts/ChartEight';
import ChartNine from '@/components/Charts/ChartNine';

const Hotel = ({ role }) => {
    const [openCreate, setOpenCreate] = useState(false);
    const [openPreview, setOpenPreview] = useState(false);

    const toggleOpenPreviewModal = useCallback(() => {
        setOpenPreview(prev => !prev);
    }, []);
    const toggleOpenCreateModal = useCallback(() => {
        setOpenCreate(prev => !prev);
    }, []);

    useEffect(() => {
         if (typeof window !== 'undefined') {
            const ctx = gsap.context(() => {
                gsap.fromTo(
                    ".chart-container",
                    { opacity: 0, y: 50 },
                    { opacity: 1, y: 0, duration: 1, stagger: 0.2 }
                );
            });
            return () => ctx.revert();
        }
    }, []);

    const topRatedHotels = [
        { name: "Hotel A", count: 120, rating: 5 },
        { name: "Hotel B", count: 90, rating: 4.5 },
        { name: "Hotel C", count: 75, rating: 4 },
        { name: "Hotel D", count: 60, rating: 3.5 },
    ];

    const getRatingColor = (rating) => {
        if (rating >= 4.5) return "bg-green-500 text-white";
        if (rating >= 4) return "bg-yellow-400 text-black";
        if (rating >= 3.5) return "bg-orange-400 text-white";
        return "bg-red-500 text-white";
    };

    const getPercentageWidth = (count) => {
        const maxCount = Math.max(...topRatedHotels.map(hotel => hotel.count));
        return (count / maxCount) * 100;
    };

    return (
        <main className="flex flex-col lg:flex-row w-full -mt-5 gap-5 justify-between overflow-x-hidden">
            <section className="flex-1 lg:overflow-x-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 lg:grid-cols-2 gap-4">
                    <div className="chart-container p-3 rounded-2xl md:w-[45vw] xl:w-[24vw] lg:w-[30vw] w-full">
                        <ChartEight />
                    </div>

                    <div className="chart-container p-3 rounded-2xl w-full md:w-[40vw] lg:w-[30vw] xl:w-[24vw]">
                        <ChartNine />
                    </div>

                    <div className="flex flex-col justify-center items-center dark:text-white dark:bg-gray-dark bg-white chart-container xl:w-[24vw] shadow-md px-3 rounded-2xl w-full">
                        <h3 className="font-bold text-lg">Top Rated Hotels</h3>
                        <ul>
                            {topRatedHotels.map((hotel, index) => (
                                <li
                                    key={index}
                                    className="relative flex items-center dark:text-white dark:bg-gray-dark px-2 py-1 mb-1 rounded-lg bg-gray-100 w-full"
                                >
                                    <div className="flex items-center">
                                        <span className="font-bold">{index + 1}.</span>
                                        <span className="ml-3 font-semibold">{hotel.name}</span>
                                    </div>
                                    <div className="flex items-center justify-between relative w-full">
                                        <div
                                            className="absolute inset-0 rounded-lg"
                                            style={{
                                                width: `${getPercentageWidth(hotel.count)}%`,
                                                backgroundColor: getRatingColor(hotel.rating),
                                                opacity: 0.3,
                                            }}
                                        ></div>
                                    </div>
                                    <div className="relative z-10 flex items-center justify-between w-full">
                                        {[...Array(5)].map((_, starIndex) => (
                                            <FaStar
                                                key={starIndex}
                                                className={`ml-1 ${hotel.rating >= starIndex + 1
                                                    ? "text-yellow-400"
                                                    : "text-gray-300"
                                                    }`}
                                            />
                                        ))}
                                        <div className="flex">
                                            <span className="ml-2 font-bold flex">{hotel.rating}</span>
                                            <span>★</span>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <HotelTable openPreview={toggleOpenPreviewModal} openCreate={toggleOpenCreateModal} />
                <AddHotel closeModal={toggleOpenCreateModal} modal={openCreate} role={role} />
                {openPreview && (
                    <PreviewHotel closeModal={() => setOpenPreview(false)} />
                )}
            </section>
        </main>
    );
};

export default React.memo(Hotel);
