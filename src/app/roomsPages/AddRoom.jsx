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

 function AddBooking({ closeModal, modal }) {
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

    const debouncedHandleChange = useMemo(() =>
        debounce((e) => {
            const { name, value } = e.target;
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }, 300), []);

    const handleChange = useCallback((e) => {
        debouncedHandleChange(e);
    }, [debouncedHandleChange]);

    const handleBackgroundClick = useCallback((e) => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    }, [closeModal]);

    const modalClasses = useMemo(() =>
        `fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center ${modal ? "visible" : "invisible"}`,
        [modal]
    );

    const bookingPanelClasses = useMemo(() =>
        `CreateBooking font-sans fw-bold w-full bg-white rounded-lg shadow-lg fixed top-0 right-0 h-full ${modal ? "translate-x-0" : "translate-x-full"} transition-transform duration-300 ease-in-out`,
        [modal]
    );

    return (
        <div
            onClick={handleBackgroundClick}
            className={modalClasses}
            role="dialog"
            aria-labelledby="add-room-title"
            aria-modal="true"
        >
            <div
                className={bookingPanelClasses}
                style={{ width: '40vw', zIndex: 50 }}
            >
                <div className="relative text-gray-900">
                    <div className="bg-green-700 w-full flex justify-between items-center text-white p-3 mb-4 rounded-t-lg border-b">
                        <h3 id="add-room-title" className="text-lg font-semibold">Add Room</h3>
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
                        <div className="gap-4 mb-4 px-4">
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
                                        type={"date"}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="w-1/2">
                                    <FormInput
                                        label="Check Out"
                                        name="checkOut"
                                        type={"date"}
                                        value={formData.checkOut}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-between items-center gap-3 my-3">
                                <div className="w-full">
                                    <FormBtnIcon
                                        label="Save"
                                        Icon={Plus}
                                        type="submit"
                                        className="w-full mt-6 bg-green-700 text-white font-semibold py-2 px-4 rounded"
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
export default React.memo(AddBooking)