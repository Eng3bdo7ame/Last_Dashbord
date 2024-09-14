import Table from '../Table'; 
import React from 'react';
const BookingTable = ({ openCreate, openPreview }) => {
     const headers = [
        { key: 'hotelName', label: 'Hotel Name' },
        { key: 'phoneNumber', label: 'Phone Number' },
        { key: 'email', label: 'Hotel Email' },
        { key: 'city', label: 'City' }
    ];

    const data = [
        {
            hotelName: 'Hotel California',
            phoneNumber: '+1 123 456 789',
             email: 'john.doe@example.com',
            city: 'New York',
        },
    ];

    return (
        <div>
            <Table headers={headers} data={data} addItemLabel="Booking" openCreate={openCreate} openPreview={openPreview} />

        </div>
    );
};

export default React.memo(BookingTable);
