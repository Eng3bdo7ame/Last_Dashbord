'use client';
import { useState, useCallback, useEffect } from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { X } from "@phosphor-icons/react";
import axios from 'axios';
import Cookies from 'js-cookie';
import { format } from 'date-fns';
import FormText from "../../form/FormText";
import FormTextArea from "../../form/FormTextArea";
import FormSelect from "../../form/FormSelect";
import FormNumber from "../../form/FormNumber";

const AddStages = ({ closeModal, modal, onStageAdded }) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        start_date: "",
        duration: "",
        project_version: "", // سيتم تخزين id المشروع هنا
        budget: "" // إضافة حقل budget
    });

    const today = new Date();
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(today);
    const [loading, setLoading] = useState(false);

    const handleChangeStartDate = (date) => {
        if (date && date > endDate) {
            setEndDate(date);
        }
        setStartDate(date);
        setFormData(prevData => ({
            ...prevData,
            start_date: format(date, 'yyyy-MM-dd')
        }));
    };

    const handleChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    }, []);

    const [version, setVersion] = useState([]);

    useEffect(() => {
        const fetchVersions = async () => {
            try {
                const token = Cookies.get('token');
                const response = await axios.get('https://dashboard.cowdly.com/api/project_versions/', {
                    headers: {
                        'Authorization': `Token ${token}`,
                    },
                });

                setVersion(response.data);
            } catch (error) {
                console.error("Error fetching versions:", error);
            }
        };

        fetchVersions();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior

        try {
            setLoading(true);
            const token = Cookies.get('token'); // Retrieve token from cookies
            if (!token) {
                console.error('No token found in cookies');
                return;
            }

            const response = await axios.post('https://dashboard.cowdly.com/api/project_stages/', formData, {
                headers: {
                    'Authorization': `Token ${token}`, // Include token in the request header
                },
            });

            const newStage = response.data;
            console.log('Stage added successfully:', newStage);
            onStageAdded(newStage); // Pass the new stage data to the parent component
            closeModal(); // Close the modal on successful submission

        } catch (error) {
            console.error('Error adding stage:', error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            onClick={(e) => e.target === e.currentTarget && closeModal()}
            id="createStudent"
            className={`createStudent overflow-y-auto overflow-x-hidden duration-200 ease-linear
                shadow-2xl shadow-slate-500 
                backdrop-blur-sm backdrop-saturate-[180%]
                dark:shadow-white/[0.10] dark:backdrop-blur-sm dark:backdrop-saturate-[180%] 
                fixed top-0 left-0 z-50 justify-center items-center
                w-full h-full ${modal ? "visible" : "invisible"}`}
        >
            <div
                style={{ boxShadow: "black 19px 0px 45px -12px" }}
                className={`rounded-l-[15px] p-4 w-full max-w-[55rem] pb-10 bg-white
                dark:bg-gray-800 rounded-r-lg duration-200 ease-linear
                ${modal ? "fixed right-0" : "absolute -left-full"}
                h-screen overflow-auto`}
                dir="rtl"
            >
                <div className="relative p-4 bg-white dark:bg-gray-800 sm:p-5">
                    <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600 shadow-md shadow-gray-300/10">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                            <X size={18} weight="bold" />
                            <span className="sr-only">Close modal</span>
                        </button>
                        <h2>Add New Stage</h2>
                    </div>
                    <div className="main-content-wrap mt-5">
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4 px-4">
                                <div className="flex gap-3">
                                    <div className="md:w-1/2">
                                        <FormNumber
                                            label="Stage Cost"
                                            name="budget"
                                            value={formData.budget}
                                            placeholder="Enter Stage Cost"
                                            required
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="md:w-1/2">
                                        <FormText
                                            label="Stage Name"
                                            name="name"
                                            value={formData.name}
                                            placeholder="Enter Stage Name"
                                            required
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="md:w-full">
                                    <FormSelect
                                        label="Project Version"
                                        value={formData.project_version}
                                        name="project_version"
                                        onChange={handleChange}
                                        options={version.map(version => ({
                                            value: version.id,
                                            label: version.name
                                        }))}
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <div className="md:w-1/2 flex flex-col">
                                        <label className="text-gray-900 mb-2">Start Date</label>
                                        <DatePicker
                                            selected={startDate}
                                            onChange={handleChangeStartDate}
                                            minDate={today}
                                            className="inputDate bg-gray-100 w-full p-2 rounded-lg"
                                        />
                                    </div>
                                    <div className="md:w-1/2">
                                        <FormNumber
                                            label="Duration (Days)"
                                            name="duration"
                                            value={formData.duration}
                                            placeholder="Enter Duration"
                                            required
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <FormTextArea
                                        label="Description"
                                        name="description"
                                        value={formData.description}
                                        placeholder="Enter Description"
                                        rows={4}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end mt-4 px-4">
                                <button
                                    type="submit"
                                    className="bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                                    disabled={loading}
                                >
                                    {loading ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddStages;
