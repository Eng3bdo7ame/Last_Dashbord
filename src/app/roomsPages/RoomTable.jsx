'use client';

import Table from "../Table";
import React from "react";
 
 function RoomTable({ openEdit, openCreate, openPreview }) {
    const headers = [
        { key: 'RoomType', label: 'Room Type' },
        { key: 'PeopleNumber', label: 'People Number	' },
        { key: 'RoomNumber', label: 'Room Number	' },
         { key: 'Price', label: 'Price' },
        { key: 'Status', label: 'Status' },
    ];
    const data = [
        {
            RoomType: 'Single',
            PeopleNumber: '+123466565',
            RoomNumber: '50',
             Price: '$5,000',
            Status: 'FULL Reserved',
        },
    ];
    return (
        <div><Table headers={headers}
            data={data}
            addItemLabel="Room" 
            openCreate={openCreate}
            openPreview={openPreview} />
        </div>
    );
}
export default React.memo(RoomTable)