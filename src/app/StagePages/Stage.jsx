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
import StageTable from "./StageTable";
import dynamic from "next/dynamic";

const PreviewStage = lazy(() => import("./PreviewStage"));
const AddStage = lazy(() => import("./AddStage"));

const Stage = ({ role }) => {
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
      <div className="flex flex-col flex-wrap items-center justify-between gap-4 md:flex-row lg:flex-row xl:flex-row"></div>
    ),
    [],
  );

  return (
    <div className="flex items-center">
      <main className="-mt-5 flex w-full flex-col lg:flex-row">
        <section className="flex-1">
          <StageTable
            openPreview={toggleOpenPreviewModal}
            openCreate={toggleOpenCreateModal}
          />
          <Suspense fallback={<div>Loading...</div>}>
            {openCreate && (
              <AddStage
                closeModal={toggleOpenCreateModal}
                modal={openCreate}
                role={role}
              />
            )}
            {openPreview && (
              <PreviewStage closeModal={toggleOpenPreviewModal} />
            )}
          </Suspense>
        </section>
      </main>
    </div>
  );
};

export default Stage;
