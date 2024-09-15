import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Table from '../Table';
import AddClients from './AddClients';
import ViewClient from './PreviewClients';   

const ClientsTable = () => {
    const [modalType, setModalType] = useState(null);
    const [tableData, setTableData] = useState([]);
    const [tableHeaders, setTableHeaders] = useState([]);
    const [selectedClientId, setSelectedClientId] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            const token = Cookies.get('token');
            if (!token) {
                console.error('No token found in cookies');
                return;
            }

            const response = await axios.get('https://dashboard.cowdly.com/api/clients/', {
                headers: {
                    'Authorization': `Token ${token}`,
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
        fetchData();
    }, [fetchData]);

    const openPreview = (clientId) => {
        setModalType('preview');
        setSelectedClientId(clientId);
    };

    const addNewClientToTable = (newClient) => {
        setTableData((prevData) => [...prevData, newClient]);
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

            {modalType === 'client' && (
                <AddClients
                    closeModal={() => setModalType(null)}
                    modal={modalType === 'client'}
                    onClientAdded={addNewClientToTable}
                />
            )}

            {modalType === 'preview' && (
                <ViewClient
                    closeModal={() => setModalType(null)}
                    clientId={selectedClientId}
                />
            )}
        </div>
    );
};

export default ClientsTable;
