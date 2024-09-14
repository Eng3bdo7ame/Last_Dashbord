'use client'
import React, { Suspense, useCallback, useState } from 'react'
import RentingTable from './RentingTable'
import PreviewRenting from './../rentingPages/PreviewRenting'
import AddRenting from '../rentingPages/AddRenting'
 const Renting = ({ role }) => {
    const [openPreview, setOpenPreview] = useState(false);
    const [openCreate, setOpenCreate] = useState(false);
    const toggleOpenCreateModal = useCallback(() => setOpenCreate(prev => !prev), []);
    const toggleOpenPreviewModal = useCallback(() => setOpenPreview(prev => !prev), []);
 
  return (
    <div>
          <RentingTable
              openPreview={toggleOpenPreviewModal}
              openCreate={toggleOpenCreateModal}
          />
          <Suspense fallback={<div>Loading...</div>}>
              {openCreate && <AddRenting closeModal={toggleOpenCreateModal} modal={openCreate} role={role} />}
              {openPreview && <PreviewRenting closeModal={toggleOpenPreviewModal} />}
          </Suspense>
    </div>
  )
}

export default React.memo(Renting)
