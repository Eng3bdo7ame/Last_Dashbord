import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Table from '../Table';
import AddClients from './AddClients';
import ViewClient from './PreviewClients';
import EditClient from './EditClient';

const ClientsTable = ({ openPreview, openCreate }) => {
    const [modalType, setModalType] = useState(null);
    const [tableData, setTableData] = useState([]);
    const [tableHeaders, setTableHeaders] = useState([]);
    const [selectedClientId, setSelectedClientId] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            const token = Cookies.get('token');
            const response = await axios.get('https://dashboard.cowdly.com/api/clients/', {
                headers: {
                    'Authorization': `Token ${token}`,
                },
            });
            if (response.data.length > 0) {
                const headers = Object.keys(response.data[0]).map(key => ({
                    key,
                    label: key.charAt(0).toUpperCase() + key.slice(1),
                }));
                setTableHeaders(headers);
                setTableData(response.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const openEdit = (clientId) => {
        setModalType('edit');
        setSelectedClientId(clientId);
    };

    const addNewClientToTable = (newClient) => {
        setTableData(prevData => [...prevData, newClient]);
    };

    const handleClientUpdate = (updatedClient) => {
        setTableData(prevData =>
            prevData.map(client =>
                client.id === updatedClient.id ? updatedClient : client
            )
        );
    };

    const openCreateModal = () => {
        setModalType('client');
    };

    const handleDelete = async (clientId) => {
        try {
            const token = Cookies.get('token');
            await axios.delete(`https://dashboard.cowdly.com/api/clients/${clientId}/`, {
                headers: {
                    'Authorization': `Token ${token}`,
                },
            });
            setTableData(prevData => prevData.filter(client => client.id !== clientId));
        } catch (error) {
            console.error('Error deleting client:', error);
        }
    };

    const handleClientAdded = (newClient) => {
        addNewClientToTable(newClient);
    };

    return (
        <div>
            <Table
                data={tableData}
                headers={tableHeaders}
                openCreate={openCreateModal} // Pass function to open create modal
                openPreview={openPreview}
                openEdit={openEdit}
                addItemLabel="Clients"
                onDelete={handleDelete}
            />

            {modalType === "client" && (
                <AddClients
                    closeModal={() => setModalType(null)}
                    modal={modalType === "client"}
                    onClientAdded={handleClientAdded}
                />
            )}

            {modalType === 'preview' && (
                <ViewClient closeModal={() => setModalType(null)} clientId={selectedClientId} />
            )}
            {modalType === 'edit' && (
                <EditClient closeModal={() => setModalType(null)} clientId={selectedClientId} onClientUpdated={handleClientUpdate} />
            )}
        </div>
    );
};

export default ClientsTable;
