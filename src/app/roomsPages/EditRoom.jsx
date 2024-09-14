'use client';
import React from "react";
import { useState, useCallback, useMemo } from "react";
import { Plus, X } from "@phosphor-icons/react";
import FormBtnIcon from "../../form/FormBtnIcon";
import FormText from "../../form/FormText";
import FormNumber from "../../form/FormNumber";
import FormEmail from "../../form/FormEmail";
import FormSelect from "../../form/FormSelect";
import FormInput from "../../form/FormInput";
import debounce from 'lodash.debounce';

const optimizedDebounce = debounce((callback) => callback(), 300);

const EditRoom = ({ closeModal, modal, role }) => {
    const [formData, setFormData] = useState({
        customerName: "",
        roomType: "",
        country: "",
        mobileNumber: "",
        email: "",
        hotelName: "",
        checkIn: "17/4/2002",
        checkOut: "18/4/2002"
    });

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        optimizedDebounce(() => setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        })));
    }, []);

    const handleBackgroundClick = useCallback((e) => {
        if (e.target === e.currentTarget) closeModal();
    }, [closeModal]);

    const memoizedFormComponents = useMemo(() => (
        <>
            <div className="flex justify-between items-center gap-3">
                <div className="w-1/2">
                    <FormText
                        label="Customer Name"
                        name="customerName"
                        value={formData.customerName}
                        placeholder="Enter Customer Name"
                        required
                        onChange={handleChange}
                    />
                </div>
                <div className="w-1/2">
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
            <div className="flex justify-between items-center gap-3 mt-3">
                <div className="w-1/2">
                    <FormText
                        label="Country"
                        name="country"
                        value={formData.country}
                        placeholder="Enter Country"
                        required
                        onChange={handleChange}
                    />
                </div>
                <div className="w-1/2">
                    <FormNumber
                        label="Mobile Number"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        placeholder="+966 0123456789"
                        required
                        onChange={handleChange}
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
                    <FormSelect
                        selectLabel="Hotel Name"
                        name="hotelName"
                        value={formData.hotelName}
                        options={[
                            { value: "hotel1", label: "Hotel 1" },
                            { value: "hotel2", label: "Hotel 2" },
                            { value: "hotel3", label: "Hotel 3" },
                        ]}
                        handleChange={handleChange}
                    />
                </div>
            </div>
            <div className="flex justify-between gap-3 mt-3">
                <div className="w-1/2">
                    <FormInput
                        label="Check In"
                        name="checkIn"
                        value={formData.checkIn}
                        required
                        type="date"
                        onChange={handleChange}
                    />
                </div>
                <div className="w-1/2">
                    <FormInput
                        label="Check Out"
                        name="checkOut"
                        type="date"
                        value={formData.checkOut}
                        onChange={handleChange}
                    />
                </div>
            </div>
        </>
    ), [formData, handleChange]);

    return (
        <div
            onClick={handleBackgroundClick}
            className={`fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center ${modal ? "visible" : "invisible"}`}
            role="dialog"
            aria-modal="true"
        >
            <div
                className={`CreateBooking font-sans fw-bold w-full bg-white rounded-lg shadow-lg fixed top-0 right-0 h-full ${modal ? "translate-x-0" : "translate-x-full"} transition-transform duration-300 ease-in-out`}
                style={{ width: '40vw', zIndex: 50 }}
            >
                <div className="relative text-gray-900">
                    <div className="bg-green-700 w-full flex justify-between items-center text-white p-3 mb-4 rounded-t-lg border-b">
                        <h3 className="text-lg font-semibold">Edit Booking</h3>
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
                            {memoizedFormComponents}
                            <div className="flex justify-end items-end gap-3 my-4">
                                <div className="w-fit rounded-xl bg-green-700">
                                    <FormBtnIcon
                                        label="Save"
                                        Icon={Plus}
                                        type="submit"
                                        className="w-full mt-6 text-white text-lg font-bold py-2 px-4"
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default React.memo(EditRoom);
