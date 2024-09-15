
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Table from '../Table';
import AddVersion from './AddVersions'; // Ensure the path is correct

const VersionTable = ({ openPreview, openCreate }) => {
    const [modalType, setModalType] = useState(null);
    const [tableData, setTableData] = useState([]);
    const [tableHeaders, setTableHeaders] = useState([]);

    const fetchData = useCallback(async () => {
        try {
            const token = Cookies.get('token'); // Retrieve token from cookies
            if (!token) {
                console.error('No token found in cookies');
                return;

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

          

            if (data.length > 0) {
                // Set table headers based on keys of the first item
                const headers = Object.keys(data[0]);
                setTableHeaders(headers.map(header => ({ key: header, label: header })));

                // Format table data
                const formattedData = data.map(item => ({
                    ...item // نعرض كل القيم من الكائن كما هي بدون تعديل
                }));
                setTableData(formattedData);
            } else {
                // If data is empty
                setTableHeaders([]);
                setTableData([]);
            }
        } catch (error) {
            console.error('Error fetching data:', error.response?.data || error.message);
        }
    }, []);


    useEffect(() => {
        fetchData(); // Fetch data on component mount
    }, [fetchData]);

    const openCreateModal = (type) => {
        setModalType(type);
    };

    const handleClientAdded = () => {
        fetchData(); // Refresh the data after a new client is added
    };


    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;


    return (
        <div>
            <Table

                data={tableData}
                headers={tableHeaders}
                openCreate={openCreateModal}

                openPreview={openPreview}
                addItemLabel="Version"
                onDelete={() => console.log('Delete function not implemented')}
            />
            {modalType === "client" && (
                <AddVersion
                    closeModal={() => setModalType(null)}
                    modal={modalType === "client"}
                    onClientAdded={handleClientAdded}
                />
            )}
        </div>
    );
};

export default VersionTable;
