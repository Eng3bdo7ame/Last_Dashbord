import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Table from '../Table'; // تأكد من صحة المسار
import AddSections from './AddSections'; // تأكد من صحة المسار

const SectionsTable = ({ openPreview, openCreate }) => {
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

            const Sections = response.data;

            if (Sections.length > 0) {
                // استخراج الرؤوس من أول مشروع
                const headers = Object.keys(Sections[0]);
                setTableHeaders(headers.map(header => ({ key: header, label: header })));

                setTableData(Sections);
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
    const addNewSectionsToTable = (newSections) => {
        setTableData((prevData) => [...prevData, newSections]);
    };

    return (
        <div>
            <Table
                data={tableData}
                headers={tableHeaders}
                openCreate={() => setModalType('sections')}
                openPreview={openPreview}
                addItemLabel="Sections"
                onDelete={() => console.log('Delete function not implemented')}
            />
            {modalType === "sections" && (
                <AddSections
                    closeModal={() => setModalType(null)}
                    modal={modalType === "sections"}
                    onSectionsAdded={addNewSectionsToTable} // تمرير الوظيفة لتحديث الجدول
                />
            )}
        </div>
    );
};

export default SectionsTable;
