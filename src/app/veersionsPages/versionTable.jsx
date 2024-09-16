import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Table from '../Table';
import AddVersion from './AddVersions'; // تأكد من أن المسار صحيح

const VersionTable = ({ openPreview, openCreate }) => {
    const [modalType, setModalType] = useState(null);
    const [tableData, setTableData] = useState([]);
    const [tableHeaders, setTableHeaders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // دالة لجلب اسم المشروع بناءً على project_id
    const fetchProjectName = async (projectId) => {
        try {
            const token = Cookies.get('token');
            const response = await axios.get(`https://dashboard.cowdly.com/api/projects/${projectId}/`, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            return response.data.name; // جلب اسم المشروع
        } catch (error) {
            console.error(`Error fetching project name for ID ${projectId}:`, error.response?.data || error.message);
            return 'Unknown Project'; // قيمة افتراضية في حال حدوث خطأ
        }
    };

    const fetchData = useCallback(async () => {
        try {
            const token = Cookies.get('token'); // استرجاع التوكن
            if (!token) {
                console.error('No token found in cookies');
                return;
            }

            const response = await axios.get('https://dashboard.cowdly.com/api/project_versions/', {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });

            const versionData = response.data;

            // جلب أسماء المشاريع باستخدام project_id
            const formattedData = await Promise.all(versionData.map(async (item) => {
                const projectName = await fetchProjectName(item.project_id); // جلب اسم المشروع باستخدام ID
                return {
                    ...item,
                    project_name: projectName // استبدال project_id بـ project_name
                };
            }));

            if (formattedData.length > 0) {
                const headers = Object.keys(formattedData[0]).map(header => ({
                    key: header === 'project_id' ? 'project_name' : header, // تعديل العنوان ليكون project_name
                    label: header === 'project_id' ? 'Project Name' : header
                }));

                setTableHeaders(headers);
                setTableData(formattedData);
            } else {
                setTableHeaders([]);
                setTableData([]);
            }

            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error.response?.data || error.message);
            setError(error);
            setLoading(false);
        }
    }, []);

    const handleVersionAdded = () => {
        fetchData(); // تحديث البيانات بعد إضافة إصدار جديد
    };

    useEffect(() => {
        fetchData(); // جلب البيانات عند تحميل الكومبوننت
    }, [fetchData]);

    const openCreateModal = (type) => {
        setModalType(type);
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
                    onVersionAdded={handleVersionAdded} // تمرير الدالة هنا لتحديث البيانات بعد الإضافة
                />
            )}
        </div>
    );
};

export default VersionTable;
