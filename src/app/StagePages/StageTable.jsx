import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Table from '../Table'; // تأكد من صحة مسار استيراد Table
import AddStages from './AddStage'; // تأكد من صحة مسار استيراد AddStage

const StageTable = ({ openPreview, openCreate }) => {
    const [modalType, setModalType] = useState(null);
    const [tableData, setTableData] = useState([]);
    const [tableHeaders, setTableHeaders] = useState([]);
    const [versions, setVersions] = useState([]);

    const fetchData = useCallback(async () => {
        try {
            const token = Cookies.get('token'); // استرجاع التوكن من الكوكيز
            if (!token) {
                console.error('No token found in cookies');
                return;
            }

            // جلب كل من الـ stages و الـ versions
            const [stagesResponse, versionsResponse] = await Promise.all([
                axios.get('https://dashboard.cowdly.com/api/project_stages/', {
                    headers: {
                        'Authorization': `Token ${token}`, // تضمين التوكن في ترويسة الطلب
                    },
                }),
                axios.get('https://dashboard.cowdly.com/api/project_versions/', {
                    headers: {
                        'Authorization': `Token ${token}`,
                    },
                })
            ]);

            const stages = stagesResponse.data;
            const versionsData = versionsResponse.data;

            // حفظ الـ versions لاستخدامها لاحقًا
            setVersions(versionsData);

            if (stages.length > 0) {
                // تحديد رؤوس الأعمدة استنادًا إلى أول عنصر في البيانات
                const headers = Object.keys(stages[0]);
                setTableHeaders(headers.map(header => ({ key: header, label: header })));

                // استبدال معرف النسخة باسم النسخة
                const formattedStages = stages.map(stage => {
                    const version = versionsData.find(v => v.id === stage.project_version); // تأكد من استخدام الاسم الصحيح للحقل
                    return {
                        ...stage,
                        project_version: version ? version.name : 'Unknown version' // تأكد من استخدام الاسم الصحيح للحقل
                    };
                });

                setTableData(formattedStages);
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

    // وظيفة لإضافة مراحل جديدة إلى الجدول بدون جلب البيانات
    const addNewStagesToTable = (newStage) => {
        const version = versions.find(v => v.id === newStage.project_version); // تأكد من استخدام الاسم الصحيح للحقل
        const formattedStage = {
            ...newStage,
            project_version: version ? version.name : 'Unknown version' // تأكد من استخدام الاسم الصحيح للحقل
        };
        setTableData((prevData) => [...prevData, formattedStage]);
    };

    return (
        <div>
            <Table
                data={tableData}
                headers={tableHeaders}
                openCreate={() => setModalType('stages')}
                openPreview={openPreview}
                addItemLabel="stages"
                onDelete={() => console.log('Delete function not implemented')}
            />
            {modalType === "stages" && (
                <AddStages
                    closeModal={() => setModalType(null)}
                    modal={modalType === "stages"}
                    onStageAdded={addNewStagesToTable} // تمرير الوظيفة لتحديث الجدول
                />
            )}
        </div>
    );
};

export default StageTable;
