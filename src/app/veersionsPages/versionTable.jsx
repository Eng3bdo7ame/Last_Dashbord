import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Table from '../Table';
import AddVersion from './AddVersions'; // Ensure the path is correct

const VersionTable = ({ openPreview, openCreate }) => {
    const [modalType, setModalType] = useState(null);
    const [tableData, setTableData] = useState([]);
    const [tableHeaders, setTableHeaders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            const token = Cookies.get('token'); // Retrieve token from cookies
            if (!token) {
                console.error('No token found in cookies');
                return;
            }

            const response = await axios.get('https://dashboard.cowdly.com/api/project_versions/', {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });

            setTableData(response.data);
            setLoading(false);

            if (response.data.length > 0) {
                // Set table headers based on keys of the first item
                const headers = Object.keys(response.data[0]);
                setTableHeaders(headers.map(header => ({ key: header, label: header })));

                // Format table data
                const formattedData = response.data.map(item => ({
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
            setError(error);
            setLoading(false);
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
