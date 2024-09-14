 'use client';
import React from "react";
import Table from "../Table";

 
 
const HotelTable = ({ openCreate, openPreview }) => {
    const headers = [
        { key: 'name', label: 'Hotel Name' },
        { key: 'phone', label: 'Phone Number' },
        { key: 'email', label: 'Hotel Email' },
        { key: 'city', label: 'City' }
    ];

    const data = [
        { id: 1, name: 'Hotel California', phone: '+1 234 567 890', email: 'info@hotelcalifornia.com', city: 'Los Angeles' },
     ];

    return (
        <div className="font-sans">
            <Table headers={headers} addItemLabel="Hotel" data={data} openCreate={openCreate} openPreview={openPreview} />

        </div>
    );
};

export default React.memo(HotelTable);

