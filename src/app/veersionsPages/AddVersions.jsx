'use client';
import { useState, useCallback, useEffect } from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { X } from "@phosphor-icons/react";
import axios from "axios";
import Cookies from 'js-cookie';
import { format } from 'date-fns';
import FormText from "../../form/FormText";
import FormNumber from "../../form/FormNumber";
import FormTextArea from "../../form/FormTextArea";
import FormSelect from "../../form/FormSelect";

const AddVersions = ({ closeModal, modal, onVersionAdded }) => {
    const [formData, setFormData] = useState({
        name: "",
        budget: "",
        start_date: "",
        duration: "",
        project: "",
        description: "",
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

    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const token = Cookies.get('token');
                const response = await axios.get('https://dashboard.cowdly.com/api/projects/', {
                    headers: {
                        'Authorization': `Token ${token}`,
                    },
                });

                setProjects(response.data);
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        };

        fetchProjects();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = Cookies.get('token');
            if (!token) {
                console.error('No token found in cookies');
                return;
            }

            setLoading(true);
            const response = await axios.post('https://dashboard.cowdly.com/api/project_versions/', formData, {
                headers: {
                    'Authorization': `Token ${token}`,
                },
            });

            const newVersion = response.data;
            console.log('Version added successfully:', newVersion);
            if (onVersionAdded) onVersionAdded(); // Call the function to refresh data
            closeModal();

        } catch (error) {
            console.error('Error adding project version:', error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleBackgroundClick = useCallback((e) => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    }, [closeModal]);

    return (
        <div
            onClick={handleBackgroundClick}
            className={`fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center transition-opacity duration-300 ${modal ? "visible opacity-100" : "invisible opacity-0"}`}
        >
            <div
                className={`CreateBooking w-full bg-white rounded-lg shadow-lg fixed top-0 right-0 h-full transition-transform duration-300 ease-in-out transform ${modal ? "translate-x-0" : "translate-x-full"}`}
                style={{ width: '40vw', zIndex: 50 }}
            >
                <div className="relative text-gray-900">
                    <div className="bg-green-700 w-full flex justify-between items-center text-white p-3 mb-4 rounded-t-lg border-b">
                        <h3 className="text-lg font-semibold">Add Version</h3>
                        <button
                            type="button"
                            onClick={closeModal}
                            className="text-gray-400 hover:bg-gray-200 rounded-lg text-sm p-1.5 inline-flex items-center"
                        >
                            <X size={18} weight="bold" />
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4 px-4">
                            <div className="flex gap-3">
                                <div className="md:w-1/2">
                                    <FormText
                                        label="Version Name"
                                        name="name"
                                        value={formData.name}
                                        placeholder="Enter Version Name"
                                        required
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="md:w-1/2">
                                    <FormNumber
                                        label="Version Cost"
                                        name="budget"
                                        value={formData.budget}
                                        placeholder="Enter Version Cost"
                                        required
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="md:w-1/2">
                                    <FormSelect
                                        label="Project"
                                        value={formData.project}
                                        name="project"
                                        onChange={handleChange}
                                        options={projects.map(project => ({
                                            value: project.id,
                                            label: project.name
                                        }))}
                                    />
                                </div>
                                <div className="md:w-1/2">
                                    <FormSelect
                                        label="Project Team"
                                        name="projectTeam"
                                        value={formData.projectTeam}
                                        onChange={handleChange}
                                        options={[{ value: "Manager 1", label: "Manager 1" }, { value: "Manager 2", label: "Manager 2" }]}
                                    />
                                </div>
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
    );
};

export default AddVersions;
