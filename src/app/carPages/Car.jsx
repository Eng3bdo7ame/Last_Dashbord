'use client'
import React from 'react';
import  { Suspense, useCallback, useState } from 'react'
import CarTable from './CarTable'
import AddCar from './AddCar';
import PreviewCar from './PreviewCar';
 const Car = ({ role }) => {
    const [openPreview, setOpenPreview] = useState(false);
    const [openCreate, setOpenCreate] = useState(false);
    const toggleOpenCreateModal = useCallback(() => setOpenCreate(prev => !prev), []);
    const toggleOpenPreviewModal = useCallback(() => setOpenPreview(prev => !prev), []);
 
    return (
        <div>
            <CarTable
                openPreview={toggleOpenPreviewModal}
                openCreate={toggleOpenCreateModal}
            />
            <Suspense fallback={<div>Loading...</div>}>
                {openCreate && <AddCar closeModal={toggleOpenCreateModal} modal={openCreate} role={role} />}
                {openPreview && <PreviewCar closeModal={toggleOpenPreviewModal} />}
            </Suspense>
        </div>
    )
}

export default React.memo(Car)
