'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from '../Table';

const HotelTable = ({ openCreate, openPreview }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const headers = [
        { key: 'version', label: 'Version' },
        { key: 'id', label: 'Product ID' },
        { key: 'price', label: 'Price' },
        { key: 'quantity', label: 'Quantity' },
        { key: 'sale', label: 'Sale' },
        { key: 'stock', label: 'Stock' },
        { key: 'start_date', label: 'Start Date' },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');


                 const response = await axios.get('https://dashboard.cowdly.com/api/project_versions/', {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });

                setData(response.data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);


    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="font-sans">
            <Table
                headers={headers}
                data={data}
                openCreate={openCreate}
                openPreview={openPreview}
            />
        </div>
    );
};

export default React.memo(HotelTable);
