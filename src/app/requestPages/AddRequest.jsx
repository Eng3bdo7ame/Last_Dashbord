'use client';
import React from "react";
import { useState, useCallback, useMemo } from "react";
import {   X } from "@phosphor-icons/react";
 import FormText from "../../form/FormText";
import FormNumber from "../../form/FormNumber";
import FormTextArea from "../../form/FormTextArea";
import FormEmail from "../../form/FormEmail";
import FormSelect from "../../form/FormSelect";
import FormPic from "../../form/FormPic";

const convenienceOptions = ["wifi", "parking", "laundry", "ac", "bar"];

const AddRequest = ({ closeModal, role, modal }) => {
    const [formData, setFormData] = useState({
        hotelName: "",
        address: "",
        contactNumber: "",
        description: "",
        email: "",
        locationType: "",
        rating: 0,
        file: null,
        hotelNumber: "",
        distanceToShrine: "",
        convenience: {
            wifi: false,
            parking: false,
            laundry: false,
            ac: false,
            bar: false,
        },
    });

    const handleChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
            convenience: name === "convenience"
                ? {
                    ...prevData.convenience,
                    [value]: !prevData.convenience[value],
                }
                : prevData.convenience,
        }));
    }, []);

    const handleFileUpload = useCallback((e) => {
        const file = e.target.files[0];
        setFormData(prevData => ({
            ...prevData,
            file,
        }));
    }, []);

    const handleRatingChange = useCallback((rating) => {
        setFormData(prevData => ({
            ...prevData,
            rating,
        }));
    }, []);

    const handleBackgroundClick = useCallback((e) => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    }, [closeModal]);

    const convenienceCheckboxes = useMemo(() => (
        convenienceOptions.map(convenience => (
            <div key={convenience} className="flex items-center">
                <input
                    type="checkbox"
                    id={convenience}
                    name="convenience"
                    value={convenience}
                    checked={formData.convenience[convenience]}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 rounded"
                />
                <label htmlFor={convenience} className="ml-2 text-sm font-medium text-gray-900 capitalize">{convenience}</label>
            </div>
        ))
    ), [formData.convenience, handleChange]);

    return (
        <div
            onClick={handleBackgroundClick}
            className={`fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center ${modal ? "visible" : "invisible"}`}
        >
            <div
                className={`CreateBooking font-sans fw-bold w-full bg-white rounded-lg shadow-lg fixed top-0 right-0 h-full ${modal ? "translate-x-0" : "translate-x-full"} transition-transform duration-300 ease-in-out`}
                style={{ width: '40vw', zIndex: 50 }}
                aria-modal="true"
                role="dialog"
            >
                <div className="relative text-gray-900">
                    <div className="bg-green-700 w-full flex justify-between items-center text-white p-3 mb-4 rounded-t-lg border-b">
                        <h3 className="text-lg font-semibold">Add Request</h3>
                        <button
                            type="button"
                            onClick={closeModal}
                            className="text-gray-400 hover:bg-gray-200 rounded-lg text-sm p-1.5 inline-flex items-center"
                            aria-label="Close modal"
                        >
                            <X size={18} weight="bold" />
                        </button>
                    </div>
                    <form>
                        <div className="space-y-4 px-4">
                            <div className="flex gap-3">
                                <div className="w-full md:w-1/2 lg:w-1/2">
                                    <FormText
                                        label="Hotel Name"
                                        name="hotelName"
                                        value={formData.hotelName}
                                        placeholder="Enter Hotel Name"
                                        required
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="w-full md:w-1/2 lg:w-1/2">
                                    <FormNumber
                                        label="Hotel Number"
                                        name="hotelNumber"
                                        value={formData.hotelNumber}
                                        placeholder="+966 0123456789"
                                        required
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="w-full md:w-1/2 lg:w-1/2">
                                    <FormNumber
                                        label="Contact Number"
                                        name="contactNumber"
                                        value={formData.contactNumber}
                                        placeholder="+966 0123456789"
                                        required
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="w-full md:w-1/2 lg:w-1/2">
                                    <FormEmail
                                        label="Hotel Email"
                                        name="email"
                                        value={formData.email}
                                        placeholder="Type Hotel Email"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="w-full md:w-1/2 lg:w-1/2">
                                    <FormText
                                        label="Address"
                                        name="address"
                                        value={formData.address}
                                        placeholder="Type Your Address"
                                        required
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="w-full md:w-1/2 lg:w-1/2">
                                    <FormText
                                        label="Distance To The Shrine"
                                        name="distanceToShrine"
                                        value={formData.distanceToShrine}
                                        placeholder="Type Distance"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="w-full md:w-1/2 lg:w-1/2">
                                    <FormTextArea
                                        label="Description"
                                        name="description"
                                        value={formData.description}
                                        placeholder="Type Description About Your Hotel"
                                        required
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="w-full md:w-1/2 lg:w-1/2">
                                    <h4 className="text-gray-900 text-left mb-1">Convenience</h4>
                                    <div className="grid grid-cols-2 gap-1">
                                        {convenienceCheckboxes}
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="w-full md:w-1/2 lg:w-1/2">
                                    <FormSelect
                                        selectLabel="Location"
                                        name="locationType"
                                        value={formData.locationType}
                                        options={[{ value: "urban", label: "Urban" }]}
                                        handleChange={handleChange}
                                    />
                                </div>
                                <div className="w-full md:w-1/2 lg:w-1/2">
                                    <h4 className="text-gray-900 text-left mb-2">Rate</h4>
                                    <div className="flex space-x-2">
                                        {[...Array(5)].map((_, i) => (
                                            <svg
                                                key={i}
                                                onClick={() => handleRatingChange(i + 1)}
                                                className={`h-6 w-6 cursor-pointer ${i < formData.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                                aria-label={`Rate ${i + 1} stars`}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M12 17.27l5.18 3.73-1.64-7.03L21 9.24l-7.19-.61L12 2 10.19 8.63 3 9.24l5.46 4.73L6.82 21.0 12 17.27z"
                                                />
                                            </svg>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-full md:w-1/2 lg:w-1/2">
                                    <FormPic
                                        label="Upload Picture"
                                        name="file"
                                        onChange={handleFileUpload}
                                    />
                                </div>
                            <div className="flex justify-end gap-4 ">
                                <button
                                    type="button"
                                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                    onClick={closeModal}
                                >
                                    Save
                                </button>
                                <button
                                    type="button"
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                    onClick={closeModal}
                                >
                                    Cancel
                                </button>
                            </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default React.memo(AddRequest);
