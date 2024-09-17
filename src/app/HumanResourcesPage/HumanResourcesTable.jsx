import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Table from '../Table'; // تأكد من صحة المسار
import AddHumanResources from './AddHumanResources'; // تأكد من صحة المسار

const HumanResourcesTable = ({ openPreview, openCreate }) => {
    const [modalType, setModalType] = useState(null);
    const [tableData, setTableData] = useState([]);
    const [tableHeaders, setTableHeaders] = useState([]);

    const fetchData = useCallback(async () => {
        try {
            const token = Cookies.get('token'); // استرجاع التوكن من الكوكيز
            if (!token) {
                console.error('No token found in cookies');
                return;
            }

            // جلب بيانات المشاريع
            const response = await axios.get('https://dashboard.cowdly.com/api/projects/', {
                headers: {
                    'Authorization': `Token ${token}`, // تضمين التوكن في رأس الطلب
                },
            });

            const HumanResources = response.data;

            if (HumanResources.length > 0) {
                // استخراج الرؤوس من أول مشروع
                const headers = Object.keys(HumanResources[0]);
                setTableHeaders(headers.map(header => ({ key: header, label: header })));

                setTableData(HumanResources);
            } else {
                setTableHeaders([]);
                setTableData([]);
            }
        } catch (error) {
            console.error('Error fetching data:', error.response?.data || error.message);
        }
    }, []);

    useEffect(() => {
        fetchData(); // جلب البيانات عند تحميل المكون
    }, [fetchData]);

    // وظيفة لإضافة مشروع جديد مباشرة إلى الجدول بدون إعادة جلب البيانات
    const addNewHumanResourcesToTable = (newHumanResources) => {
        setTableData((prevData) => [...prevData, newHumanResources]);
    };

    return (
        <div>
            <Table
                data={tableData}
                headers={tableHeaders}
                openCreate={() => setModalType('humanResources')}
                openPreview={openPreview}
                addItemLabel="Human Resources"
                onDelete={() => console.log('Delete function not implemented')}
            />
            {modalType === "humanResources" && (
                <AddHumanResources
                    closeModal={() => setModalType(null)}
                    modal={modalType === "humanResources"}
                    onHumanResourcesAdded={addNewHumanResourcesToTable} // تمرير الوظيفة لتحديث الجدول
                />
            )}
        </div>
    );
};

export default HumanResourcesTable;
