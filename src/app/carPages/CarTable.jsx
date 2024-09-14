import React from 'react';
import Table from '../Table';

const CarTable = ({ openCreate, openPreview }) => {
     const headers = [
        { key: 'hotelType', label: 'Hotel Type' },
        { key: 'CarModel', label: 'Car Model' },
        { key: 'CarCondition', label: 'Car Condition' },
        { key: 'Price', label: 'Price' },
        { key: 'Status', label: 'Status' },
    ];
    
    const data = [
        {
            hotelType: 'SUV',
            CarModel: 'Toyota Highlander',
            CarCondition: 'New',
            Price: '$85,000',
            Status: 'FULL Reserved',
        },
    ];
    return (
        <div><Table headers={headers}
            data={data}
            openCreate={openCreate}
            openPreview={openPreview}
            addItemLabel="Car" 
            />
            
        </div>
    );
};

export default React.memo(CarTable);
