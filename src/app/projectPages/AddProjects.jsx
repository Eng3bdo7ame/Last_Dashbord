'use client';
import { useState, useCallback } from "react";
import { Plus, X } from "@phosphor-icons/react";
import axios from "axios"; // Import Axios
import FormText from "../../form/FormText";
import FormTextArea from "../../form/FormTextArea";
import FormSelect from "../../form/FormSelect";

// import FormNumber from "../../form/FormNumber";

const AddProjects = ({ closeModal, modal, onProjectAdded }) => {
    const [formData, setFormData] = useState({
        name: "",
        client: "",
        description: "",
    });

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    }, []);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://dashboard.cowdly.com/api/projects/', formData);
            console.log('Project added successfully:', response.data);

            // إضافة المشروع الجديد للجدول
            onProjectAdded(response.data);

            closeModal(); // إغلاق النافذة بعد الإضافة
        } catch (error) {
            console.error('Error adding project:', error);
        }
    }, [formData, onProjectAdded, closeModal]);

    const handleBackgroundClick = useCallback((e) => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    }, [closeModal]);

    return (
        <div
            onClick={handleBackgroundClick}
            className={`fixed top-0 left-0 z-50 w-full h-full backdrop-blur-sm backdrop-saturate-[180%] duration-200 ease-linear 
                shadow-2xl shadow-slate-500 dark:shadow-white/[0.10] 
                ${modal ? "visible" : "invisible"} flex justify-center items-center`}
        >
            <div
                className={`rounded-l-[15px] p-4 w-full max-w-[55rem] bg-white dark:bg-gray-800 rounded-r-lg duration-200 ease-linear 
                    ${modal ? "fixed right-0" : "absolute -left-full"} h-screen overflow-auto`}
            >
                <div className="relative p-4 bg-white dark:bg-gray-800">
                    <div className="flex justify-between items-center pb-4 mb-4 border-b dark:border-gray-600">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                            <X size={18} weight="bold" />
                            <span className="sr-only">Close modal</span>
                        </button>
                        <h2>Add New Project</h2>
                    </div>
                    <form onSubmit={handleSubmit} className="form-add-product text-left">
                        <FormText label="Project Name" type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter Project Name" />
                        <FormSelect label="Project Client" name="client" value={formData.client} onChange={handleChange} placeholder="Enter Project Client" />
                        <FormTextArea label="Project Description" name="description" value={formData.description} onChange={handleChange} placeholder="Enter Project Description" />
                        <button className="bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 rounded mt-10 style-1 w208" type="submit"><i className="icon-plus"></i>Add New</button>
s                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddProjects;
