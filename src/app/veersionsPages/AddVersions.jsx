'use client';
import { useState, useCallback } from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { X } from "@phosphor-icons/react";
import axios from "axios";
import FormText from "../../form/FormText";
import FormNumber from "../../form/FormNumber";
import FormTextArea from "../../form/FormTextArea";
import FormSelect from "../../form/FormSelect";

const AddVersions = ({ closeModal, modal }) => {
    const [formData, setFormData] = useState({
        name: "",
        budget: "",
        start_date: "",
        duration: "",
        project: "",
        projectTeam: "",
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
    };

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const versionData = {
            ...formData,
            startDate, // include the selected start date
            endDate,   // include the end date
        };

        try {
            const response = await axios.post("https://dashboard.cowdly.com/api/project_versions/", versionData);
            console.log("Version added successfully:", response.data);
        } catch (error) {
            console.error("Error adding version:", error);
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
                                        selectLabel="project"
                                        label="project"
                                        name="project"
                                        value={formData.project}
                                        options={[
                                            { value: "project 1", label: "project 1" },
                                            { value: "project 2", label: "project 2" }
                                        ]}
                                        handleChange={handleChange}
                                    />
                                </div>

                                <div className="md:w-1/2">
                                    <FormSelect
                                        selectLabel="project Team"
                                        label="project Team"
                                        name="projectTeam"
                                        value={formData.projectTeam}
                                        options={[
                                            { value: "Manager 1", label: "Manager 1" },
                                            { value: "Manager 2", label: "Manager 2" }
                                        ]}
                                        handleChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="md:w-1/2 flex flex-col">
                                    <label className="text-gray-900 mb-2">Start Date</label>
                                    <DatePicker
                                        value={formData.start_date}

                                        selected={startDate}
                                        onChange={handleChangeStartDate}
                                        minDate={today}
                                        className="inputDate bg-gray-100 w-full p-2 rounded-lg"
                                    />
                                </div>
                                <div className="md:w-1/2">
                                    <FormNumber
                                        label="duration (Days)"
                                        name="duration"
                                        value={formData.duration}
                                        placeholder="Enter duration"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="md:w-full">
                                    <FormTextArea
                                        label="project Description"
                                        name="description"
                                        value={formData.description}
                                        placeholder="Enter project Description"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center items-start gap-2 mt-5">
                            <button
                                type="submit"
                                className={`px-4 py-2 bg-green-700 text-white rounded-lg shadow-md hover:bg-green-800 ${loading ? 'opacity-50' : ''}`}
                                disabled={loading}
                            >
                                {loading ? 'Adding...' : 'Add New'}
                            </button>
                            <button
                                type="button"
                                className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700"
                                onClick={closeModal}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddVersions;
