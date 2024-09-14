'use client';

import Table from "../Table";

 

const RentingTable = ({ openCreate, openPreview }) => {
     const headers = [
        { key: 'TenantName', label: 'Tenant Name' },
        { key: 'TenantNumber', label: 'Tenant Number' },
        { key: 'TenantID', label: 'Tenant ID' },
        { key: 'email', label: 'Hotel Email' },
        { key: 'city', label: 'City' }
    ];
    const data = [
        {
            TenantName: 'John Doe',
            TenantNumber: '+1 123 456 789',
            TenantID: 'T001',
            email: 'john.doe@example.com',
            city: 'New York',
        },
     ];

    return (
        <div className="font-sans">
            <Table headers={headers} addItemLabel="Renting" data={data} openCreate={openCreate} openPreview={openPreview} />
        </div>
    );
};

export default RentingTable;
