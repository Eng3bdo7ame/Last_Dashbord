'use client';
import React from "react";
import { useState, useCallback, useMemo } from "react";
import { X } from "@phosphor-icons/react";
import FormText from "../../form/FormText";
import FormNumber from "../../form/FormNumber";
import FormEmail from "../../form/FormEmail";
import FormSelect from "../../form/FormSelect";
import FormPic from "../../form/FormPic";
import { Button, Input, Label } from "reactstrap";
import FormInput from "@/form/FormInput";
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'], weight: ['400', '600'] });

const AddBooking = ({ closeModal, role, modal }) => {
    const initialFormData = useMemo(() => ({
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
    }), []);

    const [formData, setFormData] = useState(initialFormData);

    const handleChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    }, []);

    const handleFileUpload = useCallback((e) => {
        const file = e.target.files[0];
        setFormData(prevData => ({ ...prevData, file }));
    }, []);

    const handleRatingChange = useCallback((rating) => {
        setFormData(prevData => ({ ...prevData, rating }));
    }, []);

    const handleBackgroundClick = useCallback((e) => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    }, [closeModal]);

    return (
        <div
            onClick={handleBackgroundClick}
            className={` ${inter.className} fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center ${modal ? "visible" : "invisible"}`}
        >
            <div
                className={`CreateBooking   fw-bold w-full bg-white rounded-lg shadow-lg fixed top-0 right-0 h-full ${modal ? "translate-x-0" : "translate-x-full"} transition-transform duration-300 ease-in-out`}
                style={{ width: '40vw', zIndex: 50 }}
            >
                <div className="relative text-gray-900">
                    <div className="bg-green-700 w-full flex justify-between items-center text-white p-3 mb-4 rounded-t-lg border-b">
                        <h3 className="text-lg font-semibold">Add Booking</h3>
                        <button
                            type="button"
                            onClick={closeModal}
                            className="text-gray-400 hover:bg-gray-200 rounded-lg text-sm p-1.5 inline-flex items-center"
                        >
                            <X size={18} weight="bold" />
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    <form>
                        <div className="space-y-4 px-4">
                            <div className="flex gap-3">
                                <div className="md:w-1/2">
                                    <FormText
                                        label="Customer Name"
                                        name="customerName"
                                        value={formData.customerName}
                                        placeholder="Enter Customer Name"
                                        required
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="md:w-1/2">
                                    <FormText
                                        label="Room Type"
                                        name="roomType"
                                        value={formData.roomType}
                                        placeholder="Enter Room Type"
                                        required
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="md:w-1/2">
                                    <FormEmail
                                        label="Hotel Email"
                                        name="email"
                                        value={formData.email}
                                        placeholder="Type Hotel Email"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="md:w-1/2">
                                    <FormText
                                        label="Country"
                                        name="country"
                                        value={formData.country}
                                        placeholder="Enter Country"
                                        required
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="md:w-1/2">
                                    <FormText
                                        label="Customer ID"
                                        name="customerID"
                                        value={formData.customerID}
                                        placeholder="Enter Customer ID"
                                        required
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="flex flex-col items-center w-1/3">
                                    <Label htmlFor="adults">Adults</Label>
                                    <div className="flex items-center justify-center">
                                        <Button color="light" outline>-</Button>
                                        <Input id="adults" value="2" className="text-center" readOnly />
                                        <Button color="light" outline>+</Button>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center w-1/3">
                                    <Label htmlFor="children">Children</Label>
                                    <div className="flex items-center">
                                        <Button color="light" outline>-</Button>
                                        <Input id="children" value="2" className="text-center" readOnly />
                                        <Button color="light" outline>+</Button>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="md:w-1/2">

                                    <FormInput
                                        label="Check In"
                                        name="checkIn"
                                        value={formData.checkIn}
                                        required
                                        type="date"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="md:w-1/2">
                                    <FormInput
                                        label="Check Out"
                                        name="checkOut"
                                        value={formData.checkOut}
                                        required
                                        type="date"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="md:w-1/2">
                                    <FormNumber
                                        label="Mobile Number"
                                        name="mobileNumber"
                                        value={formData.mobileNumber}
                                        placeholder="+966 0123456789"
                                        required
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="md:w-1/2">
                                    <FormNumber
                                        label="Room Number"
                                        name="roomNumber"
                                        value={formData.roomNumber}
                                        placeholder="123456789"
                                        required
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="md:w-1/2">
                                    <FormSelect
                                        selectLabel="Location"
                                        name="locationType"
                                        value={formData.locationType}
                                        options={[{ value: "urban", label: "Type location" }]}
                                        handleChange={handleChange}
                                    />
                                </div>
                                <div className="w-1/2">
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
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M12 17.27l5.18 3.73-1.64-7.03L21 9.24l-7.19-.61L12 2 10.19 8.63 3 9.24l5.46 4.73-1.64 7.03L12 17.27z"
                                                />
                                            </svg>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex w-full gap-3">
                            <div className="flex justify-around gap-2 mt-3 w-1/2">
                                <FormPic
                                    label="Upload Image"
                                    name="file"
                                    onChange={handleFileUpload}
                                    className="w-full text-center"
                                />
                            </div>
                            <div className="flex justify-around gap-2 mt-3 w-1/2">
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-green-700 text-white rounded-lg shadow-md hover:bg-green-800"
                                >
                                    Approve
                                </button>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 w-fit bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700"
                                >
                                    Decline
                                </button>
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default React.memo(AddBooking);