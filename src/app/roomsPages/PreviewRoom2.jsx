'use client';
import React, { useState, useCallback } from "react";
import { Plus, X } from "@phosphor-icons/react";
import FormBtnIcon from "../../form/FormBtnIcon";
import FormText from "../../form/FormText";
import FormNumber from "../../form/FormNumber";
import FormEmail from "../../form/FormEmail";
import FormSelect from "../../form/FormSelect";
import FormInput from "../../form/FormInput";
import debounce from 'lodash.debounce';
import { Badge, Button, Input, Label } from "reactstrap";

 function PreviewRoom2({ closeModal }) {
    const [formData, setFormData] = useState({
        customerName: "name",
        roomNumber: "50",
        customerID: "1",
        roomType: "observed",
        country: "Egypt",
        mobileNumber: "01032210349",
        email: "info@gmail.com",
        hotelName: "kiloPatra",
        checkIn: "17/4/2002",
        checkOut: "18/4/2002"
    });



    const handleChange = useCallback(debounce((e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }, 300), []);

    const handleBackgroundClick = (e) => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    };

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
                        <h3 className="text-lg font-semibold">View Room</h3>
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
                                        readOnly
                                    />
                                </div>
                                <div className="w-1/2">
                                    <FormText
                                        label="Room Type"
                                        name="roomType"
                                        value={formData.roomType}
                                        placeholder="Enter Room Type"
                                        required
                                        readOnly
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
                                        readOnly
                                    />
                                </div>
                                <div className="w-1/2">
                                    <FormNumber
                                        label="Mobile Number"
                                        name="mobileNumber"
                                        value={formData.mobileNumber}
                                        placeholder="+966 0123456789"
                                        required
                                        readOnly
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
                                        readOnly
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
                                        readOnly
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
                                        readOnly
                                    />
                                </div>
                                <div className="w-1/2">
                                    <FormInput
                                        label="Check Out"
                                        name="checkOut"
                                        type="date"
                                        value={formData.checkOut}
                                        readOnly
                                    />
                                </div>
                            </div>
                            <div className="flex justify-between items-center gap-3 my-3">
                                <div className="w-1/2">
                                    <FormText
                                        label="Customer ID"
                                        name="customerID"
                                        value={formData.customerID}
                                        placeholder="Enter Customer ID"
                                        required
                                        readOnly
                                    />
                                </div>
                                <div className="w-1/2">
                                    <FormNumber
                                        label="Room Number"
                                        name="roomNumber"
                                        value={formData.roomNumber}
                                        placeholder="123456789"
                                        required
                                        readOnly
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4 items-center">
                                <div className="space-y-2">
                                    <Label>Features</Label>
                                    <div className="flex space-x-1">
                                        <Badge variant="default">WIFI</Badge>
                                        <Badge variant="default">AC</Badge>
                                        <Badge variant="default">Free breakfast</Badge>
                                        <Badge variant="default">VIP</Badge>
                                    </div>
                                </div>
                                <div className="w-1/3">
                                    <Label htmlFor="adults">Adults</Label>
                                    <div className="flex items-center">
                                        <Button variant="outline">-</Button>
                                        <Input id="adults" value="2" className="text-center" readOnly />
                                        <Button variant="outline">+</Button>
                                    </div>
                                </div>
                                <div className="w-1/3">
                                    <Label htmlFor="children">Children</Label>
                                    <div className="flex items-center">
                                        <Button variant="outline">-</Button>
                                        <Input id="children" value="2" className="text-center" readOnly />
                                        <Button variant="outline">+</Button>
                                    </div>
                                </div>
                            </div>



                            <div className="flex justify-center items-center gap-3 my-5">
                                <div className="rounded-3xl bg-green-700">
                                    <FormBtnIcon
                                        label="Approve"
                                        Icon={Plus}
                                        type="submit"
                                        className="w-full mt-6 text-white font-bold py-2 px-4 rounded"
                                    />
                                </div>
                                <div className="rounded-3xl bg-red-700">
                                    <FormBtnIcon
                                        label="Decline"
                                        Icon={Plus}
                                        type="submit"
                                        className="w-full mt-6 text-white font-bold py-2 px-4 rounded"

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
export default React.memo(PreviewRoom2)