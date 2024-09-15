import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Table from '../Table';
import AddProjects from './AddProjects'; // Ensure the path is correct

const ProjectsTable = ({ openPreview, openCreate }) => {
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

            const response = await axios.get('https://dashboard.cowdly.com/api/projects/', {
                headers: {
                    'Authorization': `Token ${token}`, // Include token in the request header
                },
            });

            const data = response.data;

            if (data.length > 0) {
                // Set table headers based on keys of the first item
                const headers = Object.keys(data[0]);
                setTableHeaders(headers);

                // Format table data
                const formattedData = data.map(item =>
                    headers.map(header => item[header] || 'N/A')
                );
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

    const handleAddProjectClick = () => {
        openCreateModal("project");
    };

    const handleProjectAdded = () => {
        fetchData(); // Refresh the data after a new project is added
    };

    return (
        <div>
            <Table
                data={tableData}
                headers={tableHeaders.map(header => ({ key: header, label: header }))}
                openCreate={openCreate}
                openPreview={openPreview}
                addItemLabel="Add Project"
                onAddClick={handleAddProjectClick} // Pass the handler
                onDelete={() => console.log('Delete function not implemented')}
            />
            {modalType === "project" && (
                <AddProjects
                    closeModal={() => setModalType(null)}
                    modal={modalType === "project"}
                    onProjectAdded={handleProjectAdded}
                />
            )}
        </div>
    );
};

export default ProjectsTable;
