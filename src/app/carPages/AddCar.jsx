'use client';
import React from "react";
import { useState, useCallback, useMemo } from "react";
import { X } from "@phosphor-icons/react";
import FormText from "../../form/FormText";
import FormNumber from "../../form/FormNumber";
import FormSelect from "../../form/FormSelect";
 import {   Label } from "reactstrap";
import { Inter } from 'next/font/google';
import Image from 'next/image';
import carImage from '../../../public/images/Group (5).svg'; // Import the car image
import FormTextArea from "@/form/FormTextArea";

const inter = Inter({ subsets: ['latin'], weight: ['400', '600'] });

const AddCar = ({ closeModal, role, modal }) => {
    const initialFormData = useMemo(() => ({
        carType: "",
        carModel: "",
        carPrice: "",
        carCondition: "",
        facilities: [],
        description: "",
    }), []);

    const [formData, setFormData] = useState(initialFormData);

    const handleChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    }, []);

    const handleBackgroundClick = useCallback((e) => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    }, [closeModal]);

    return (
        <div
            onClick={handleBackgroundClick}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center"
        >
            <div
                className="CreateBooking font-sans fw-bold w-full bg-white rounded-lg shadow-lg fixed top-0 right-0 h-full transition-transform duration-300 ease-in-out"
                style={{ width: '40vw', zIndex: 50 }}
            >
                <div className="relative text-gray-900">
                    {/* Car Image with Rotating Border */}
                   

                     <div className="bg-green-700 w-full flex justify-between items-center text-white p-3 mb-4 rounded-t-lg border-b">
                        <h3 className="text-lg font-semibold">Add Car</h3>
                        <button
                            type="button"
                            onClick={closeModal}
                            className="text-gray-400 hover:bg-gray-200 rounded-lg text-sm p-1.5 inline-flex items-center"
                        >
                            <X size={18} weight="bold" />
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    <div className="flex justify-center   my-8">
                        <div className="w-32 h-32 rounded-2xl rotate-45 border-4 border-green-700 p-2 animate-spin-slow">
                            <Image
                                src={carImage}
                                alt="Car"
                                className="w-full h-full -rotate-45 object-contain rounded-full"
                            />
                             
                        </div>
                    </div>
                     <form>
                        <div className="gap-4 mb-4 px-4">
                             <div className="flex justify-between items-center gap-3">
                                <div className="w-1/2">
                                    <FormText
                                        label="Car Type"
                                        name="carType"
                                        value={formData.carType}
                                        placeholder="Enter Car Type"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="w-1/2">
                                    <FormNumber
                                        label="Car Model"
                                        name="carModel"
                                        value={formData.carModel}
                                        placeholder="Enter Car Model"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                             <div className="flex justify-between items-center gap-3 mt-3">
                                <div className="w-1/2">
                                    <FormSelect
                                        selectLabel="Car Condition"
                                        name="carCondition"
                                        value={formData.carCondition}
                                        options={[
                                            { value: "perfect", label: "perfect" },
                                            { value: "Good", label: "Good" },
                                            { value: "bad", label: "bad" },
                                        ]}
                                        handleChange={handleChange}
                                    />
                                </div>
                                <div className="w-1/2">
                                    <FormNumber
                                        label="Car Price"
                                        name="carPrice"
                                        value={formData.carPrice}
                                        placeholder="Enter Car Price"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                           
                            <div className="flex justify-between items-center gap-3 mt-3">
                                <div className="w-1/2">
                                    <Label>Facilities</Label>
                                    <div className="flex space-x-2 my-3">
                                        {["AC", "GPS", "Bluetooth", "Wifi"].map((facility) => (
                                            <div key={facility} className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    id={facility.toLowerCase()}
                                                    name="facilities"
                                                    value={facility.toLowerCase()}
                                                    onChange={handleChange}
                                                    className="form-checkbox h-4 w-4 text-green-600"
                                                />
                                                <Label htmlFor={facility.toLowerCase()} className="ml-2 text-gray-700">
                                                    {facility}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="w-1/2">
                                    <button
                                        type="button"
                                        className="px-8 py-2 bg-red-700 text-white rounded-lg shadow-md hover:bg-green-800"
                                    >
                                        full observed
                                    </button>
                                </div>
                            </div>
                             <div className="mt-3">
                                <FormTextArea
                                    label="Description"
                                    name="description"
                                    value={formData.description}
                                    placeholder="Enter description"
                                    onChange={handleChange}
                                />
                            </div>
                         
                            {/* Buttons */}
                            <div className="flex justify-center gap-2 mt-8">
                                <button
                                    type="button"
                                    className="px-8 py-2 bg-green-700 text-white rounded-lg shadow-md hover:bg-green-800"
                                >
                                    Submit
                                </button>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-8 py-2 w-fit bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default React.memo(AddCar);
