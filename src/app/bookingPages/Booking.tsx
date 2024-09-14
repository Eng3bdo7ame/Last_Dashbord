"use client";
import React, { useCallback, useState, useEffect, lazy, Suspense, useMemo } from 'react';
import gsap from 'gsap';
  import BookingTable from './BookingTable';
import dynamic from 'next/dynamic';

const PreviewBooking = lazy(() => import('./PreviewBooking'));
const AddBooking = lazy(() => import('./AddBooking'));
const ChartSeven = dynamic(() => import("@/components/Charts/ChartSeven"), {
  ssr: false,
});
const MapOne = dynamic(() => import("@/components/Maps/MapOne"), {
  ssr: false,
});
const ChartTwo = dynamic(() => import("@/components/Charts/ChartTwo"), {
  ssr: false,
});

const Booking: React.FC<{ role: string }> = ({ role }) => {
    const [openPreview, setOpenPreview] = useState(false);
    const [openCreate, setOpenCreate] = useState(false);

    const toggleOpenCreateModal = useCallback(() => setOpenCreate(prev => !prev), []);
    const toggleOpenPreviewModal = useCallback(() => setOpenPreview(prev => !prev), []);

    useEffect(() => {
        if (typeof window !== "undefined") {
        const ctx = gsap.context(() => {
            gsap.fromTo(".chart-container", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, stagger: 0.2 });
          });

        return () => ctx.revert();
    }}, []);

    const chartSection = useMemo(() => (
        <div className="flex flex-col flex-wrap items-center justify-between gap-4 md:flex-row lg:flex-row xl:flex-row">
            <div className="flex-1 py-8">
                <ChartSeven />
            </div>
            <div className="flex-1 py-8">
                <MapOne />
            </div>
            <div className="flex-1 py-6 bg-white dark:bg-gray-dark dark:shadow-card">
                <h3 className="font-sans text-lg font-bold px-4 pb-5">
                    Total Revenue
                </h3>
                <ChartTwo />
            </div>
        </div>
    ), []);

    return (
        <div className="flex items-center">
            <main className="flex flex-col lg:flex-row w-full -mt-5">
                <section className="flex-1">
                    {chartSection}
                    <BookingTable
                        openPreview={toggleOpenPreviewModal}
                        openCreate={toggleOpenCreateModal}
                    />
                    <Suspense fallback={<div>Loading...</div>}>
                        {openCreate && <AddBooking closeModal={toggleOpenCreateModal} modal={openCreate} role={role} />}
                        {openPreview && <PreviewBooking closeModal={toggleOpenPreviewModal} />}
                    </Suspense>
                </section>
            </main>
        </div>
    );
};

export default React.memo(Booking);
