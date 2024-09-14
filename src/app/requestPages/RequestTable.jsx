'use client';
import React from "react";
import Table from "../Table";

  
 

const RequestTable = ({ openCreate, openPreview }) => {
    const headers = [
        { key: 'hotelName', label: 'Hotel Name' },
        { key: 'phoneNumber', label: 'Phone Number' },
        { key: 'email', label: 'Hotel Email' },
        { key: 'city', label: 'City' }
    ];

    const data = [
        { id: 1, hotelName: 'Hotel California', phoneNumber: '+1 234 567 890', email: 'info@hotelcalifornia.com', city: 'Los Angeles' },
     ];
    return (
        <div className="font-sans">
            <Table headers={headers} addItemLabel="Request" data={data} openCreate={openCreate} openPreview={openPreview} />
        </div>
    );
};

export default React.memo(RequestTable);

