'use client';
import React from "react";
import { useState, useCallback, useMemo } from "react";
import { X } from "@phosphor-icons/react";
import FormText from "../../form/FormText";
import FormNumber from "../../form/FormNumber";
import FormEmail from "../../form/FormEmail";
import FormSelect from "../../form/FormSelect";
import FormInput from "@/form/FormInput";
import { Button, Input, Label } from "reactstrap";
import { Inter } from 'next/font/google';
 
const AddRenting = ({ closeModal, role, modal }) => {
    const initialFormData = useMemo(() => ({
        customerName: "",
        mobileNumber: "",
        email: "",
        country: "",
        customerID: "",
        carType: "",
        facility: "",
        DeliveryDate: "",
        RentalPeriod: "",
        adults: 2,
        currency: "",
    }), []);

    const [formData, setFormData] = useState(initialFormData);
    const [selectedFacility, setSelectedFacility] = useState("");

    const handleChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    }, []);

    const handleFacilityChange = useCallback((e) => {
        setSelectedFacility(e.target.value);
        setFormData(prevData => ({ ...prevData, facility: e.target.value }));
    }, []);

    const handleBackgroundClick = useCallback((e) => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    }, [closeModal]);

    const handleAdultsChange = useCallback((action) => {
        setFormData(prevData => ({
            ...prevData,
            adults: action === "increment" ? prevData.adults + 1 : Math.max(1, prevData.adults - 1),
        }));
    }, []);

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
                    <div className="bg-green-700 w-full flex justify-between items-center text-white p-3 mb-4 rounded-t-lg border-b">
                        <h3 className="text-lg font-semibold">Add Renting</h3>
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
                        <div className="gap-4 mb-4 px-4">
                            <div className="flex justify-between items-center gap-3">
                                <div className="w-1/2">
                                    <FormText
                                        label="Customer Name"
                                        name="customerName"
                                        value={formData.customerName}
                                        placeholder="Enter Customer Name"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="w-1/2">
                                    <FormNumber
                                        label="Mobile Number"
                                        name="mobileNumber"
                                        value={formData.mobileNumber}
                                        placeholder="+966 0123456789"
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex justify-between items-center gap-3 mt-3">
                                <div className="w-1/2">
                                    <FormEmail
                                        label="Email"
                                        name="email"
                                        value={formData.email}
                                        placeholder="Enter Email Address"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="w-1/2">
                                    <FormText
                                        label="Country"
                                        name="country"
                                        value={formData.country}
                                        placeholder="Enter Country"
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex justify-between items-center gap-3 mt-3">
                                <div className="w-1/2">
                                    <FormText
                                        label="Customer ID"
                                        name="customerID"
                                        value={formData.customerID}
                                        placeholder="Enter Customer ID"
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="w-1/2">
                                    <FormText
                                        label="Car Type"
                                        name="carType"
                                        value={formData.carType}
                                        placeholder="Enter Car Type"
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex justify-between gap-3 mt-3">
                                <div className="w-2/3">
                                    <Label>Facilities</Label>
                                    <div className="flex space-x-2">
                                        {["AC", "Standing", "Additional"].map((facility) => (
                                            <div key={facility} className="flex items-center space-x-2">
                                                <input
                                                    type="radio"
                                                    id={facility.toLowerCase()}
                                                    name="facility"
                                                    value={facility.toLowerCase()}
                                                    checked={selectedFacility === facility.toLowerCase()}
                                                    onChange={handleFacilityChange}
                                                    className="form-radio h-4 w-4 text-green-600"
                                                />
                                                <Label htmlFor={facility.toLowerCase()} className="ml-2 text-gray-700">
                                                    {facility}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="w-1/3">
                                    <FormInput
                                        label="Delivery Date"
                                        name="DeliveryDate"
                                        type="date"
                                        value={formData.DeliveryDate}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-between gap-3 mt-5">
                                <div className="md:w-1/2">
                                    <FormSelect
                                        selectLabel="Rental Period"
                                        name="RentalPeriod"
                                        value={formData.RentalPeriod}
                                        options={[
                                            { value: "day", label: "Day" },
                                            { value: "week", label: "Week" },
                                            { value: "month", label: "Month" },
                                        ]}
                                        handleChange={handleChange}
                                    />
                                </div>
                                <div className="md:w-1/2 flex flex-col items-center">
                                    <Label htmlFor="adults">Adults</Label>
                                    <div className="flex items-center p-2 my-3 bg-gray-50">
                                        <Button
                                            type="button"
                                            onClick={() => handleAdultsChange("decrement")}
                                            className="px-2"
                                        >
                                            -
                                        </Button>
                                        <Input
                                            id="adults"
                                            value={formData.adults}
                                            readOnly
                                            className="text-center bg-gray-50 mx-2"
                                        />
                                        <Button
                                            type="button"
                                            onClick={() => handleAdultsChange("increment")}
                                            className="px-2"
                                        >
                                            +
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between gap-3 mt-5">
                                <div className="w-1/2">
                                    <FormText
                                        label="Car Type"
                                        name="carType"
                                        value={formData.carType}
                                        placeholder="Enter Car Type"
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="md:w-1/2">
                                    <FormSelect
                                        selectLabel="Currency"
                                        name="currency"
                                        value={formData.currency}
                                        options={[
                                            { value: "USD", label: "USD" },
                                            { value: "EUR", label: "EUR" },
                                        ]}
                                        handleChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-center gap-2 mt-8">
                                <button
                                    type="button"
                                    className="px-8 py-2 bg-green-700 text-white rounded-lg shadow-md hover:bg-green-800"
                                >
                                    Approve
                                </button>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-8 py-2 w-fit bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700"
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

export default React.memo(AddRenting);
