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
import VersionTable from "./versionTable";

const PreviewVersion = lazy(() => import("./PreviewVersion"));
const AddVersion = lazy(() => import("./AddVersions"));


const Version = ({ role }) => {
    const [openPreview, setOpenPreview] = useState(false);
    const [openCreate, setOpenCreate] = useState(false);

    const toggleOpenCreateModal = useCallback(
        () => setOpenCreate((prev) => !prev),
        []
    );
    const toggleOpenPreviewModal = useCallback(
        () => setOpenPreview((prev) => !prev),
        []
    );

    return (
        <div className="flex items-center">
            <main className="-mt-5 flex w-full flex-col lg:flex-row">
                <section className="flex-1">
                    <VersionTable
                        openPreview={toggleOpenPreviewModal}
                        openCreate={toggleOpenCreateModal}
                    />
                    <Suspense fallback={<div>Loading...</div>}>
                        {openCreate && (
                            <AddVersion
                                closeModal={toggleOpenCreateModal}
                                modal={openCreate}
                                role={role}
                            />
                        )}
                        {openPreview && (
                            <PreviewVersion closeModal={toggleOpenPreviewModal} />
                        )}
                    </Suspense>
                </section>
            </main>
        </div>
    );
};

export default React.memo(Version);
