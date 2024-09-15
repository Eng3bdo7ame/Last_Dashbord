'use client'
import React from 'react';
import  { Suspense, useCallback, useState } from 'react'
import ProjectsTable from './ProjectsTable'
import AddProjects from './AddProjects';
import PreviewProjects from './PreviewProjects';
 const Projects = ({ role }) => {
    const [openPreview, setOpenPreview] = useState(false);
    const [openCreate, setOpenCreate] = useState(false);
    const toggleOpenCreateModal = useCallback(() => setOpenCreate(prev => !prev), []);
    const toggleOpenPreviewModal = useCallback(() => setOpenPreview(prev => !prev), []);
 
    return (
        <div>
            <ProjectsTable
                openPreview={toggleOpenPreviewModal}
                openCreate={toggleOpenCreateModal}
            />
            <Suspense fallback={<div>Loading...</div>}>
                {openCreate && <AddProjects closeModal={toggleOpenCreateModal} modal={openCreate} role={role} />}
                {openPreview && <PreviewProjects closeModal={toggleOpenPreviewModal} />}
            </Suspense>
        </div>
    )
}

export default React.memo(Projects)
