"use client";
import React, {
  useCallback,
  useState,
  useEffect,
  lazy,
  Suspense,
  useMemo,
} from "react";
import gsap from "gsap";
import ClientsTable from "./ClientsTable";
import dynamic from "next/dynamic";

const PreviewClients = lazy(() => import("./PreviewClients"));
const AddClients = lazy(() => import("./AddClients"));
const ChartSeven = dynamic(() => import("@/components/Charts/ChartSeven"), {
  ssr: false,
});
const MapOne = dynamic(() => import("@/components/Maps/MapOne"), {
  ssr: false,
});
const ChartTwo = dynamic(() => import("@/components/Charts/ChartTwo"), {
  ssr: false,
});

const Clients: React.FC<{ role: string }> = ({ role }) => {
  const [openPreview, setOpenPreview] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);

  const toggleOpenCreateModal = useCallback(
    () => setOpenCreate((prev) => !prev),
    [],
  );
  const toggleOpenPreviewModal = useCallback(
    () => setOpenPreview((prev) => !prev),
    [],
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          ".chart-container",
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1, stagger: 0.2 },
        );
      });

      return () => ctx.revert();
    }
  }, []);

  const chartSection = useMemo(
    () => (
      <div className="flex flex-col flex-wrap items-center justify-between gap-4 md:flex-row lg:flex-row xl:flex-row">
        <div className="flex-1 py-8">
          <ChartSeven />
        </div>
        <div className="flex-1 py-8">
          <MapOne />
        </div>
        <div className="flex-1 bg-white py-6 dark:bg-gray-dark dark:shadow-card">
          <h3 className="px-4 pb-5 font-sans text-lg font-bold">
            Total Revenue
          </h3>
          <ChartTwo />
        </div>
      </div>
    ),
    [],
  );

  return (
    <div className="flex items-center">
      <main className="-mt-5 flex w-full flex-col lg:flex-row">
        <section className="flex-1">
          {chartSection}
          <ClientsTable
            openPreview={toggleOpenPreviewModal}
            openCreate={toggleOpenCreateModal}
          />
          <Suspense fallback={<div>Loading...</div>}>
            {openCreate && (
              <AddClients
                closeModal={toggleOpenCreateModal}
                modal={openCreate}
                role={role}
              />
            )}
            {openPreview && (
              <PreviewClients closeModal={toggleOpenPreviewModal} />
            )}
          </Suspense>
        </section>
      </main>
    </div>
  );
};

export default React.memo(Clients);
