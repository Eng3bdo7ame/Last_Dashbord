import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Table from '../Table';
import AddClients from './AddClients'; // Ensure the path is correct

const ClientsTable = ({ openPreview, openCreate }) => {
    const [modalType, setModalType] = useState(null);
    const [tableData, setTableData] = useState([]);
    const [tableHeaders, setTableHeaders] = useState([]);

    const fetchData = useCallback(async () => {
        try {
            const token = Cookies.get('token'); // Retrieve token from cookies
            if (!token) {
                console.error('No token found in cookies');
                return;
            }

            const response = await axios.get('https://dashboard.cowdly.com/api/clients/', {
                headers: {
                    'Authorization': `Token ${token}`, // Include token in the request header
                },
            });

            const data = response.data;
            if (data.length > 0) {
                const headers = Object.keys(data[0]);
                setTableHeaders(headers.map(header => ({ key: header, label: header })));
                setTableData(data);
            } else {
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

    // Function to add the new client directly to the table without fetching
    const addNewClientToTable = (newClient) => {
        setTableData((prevData) => [...prevData, newClient]); // Add new client to the existing table data
    };

    return (
        <div>
            <Table
                data={tableData}
                headers={tableHeaders}
                openCreate={() => setModalType('client')}
                openPreview={openPreview}
                addItemLabel="Clients"
                onDelete={() => console.log('Delete function not implemented')}
            />
            {modalType === "client" && (
                <AddClients
                    closeModal={() => setModalType(null)}
                    modal={modalType === "client"}
                    onClientAdded={addNewClientToTable} // Pass the function to update the table
                />
            )}
        </div>
    );
};

export default ClientsTable;
