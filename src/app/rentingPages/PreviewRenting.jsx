'use client';
import { useState, useCallback } from "react";
import { Plus, X } from "@phosphor-icons/react";
import FormBtnIcon from "../../form/FormBtnIcon";
import FormText from "../../form/FormText";
import FormNumber from "../../form/FormNumber";
import FormEmail from "../../form/FormEmail";
import FormSelect from "../../form/FormSelect";
import FormInput from "../../form/FormInput";
import debounce from 'lodash.debounce';
import {    Button, Input, Label } from "reactstrap";
 
export default function PreviewRenting({ closeModal }) {
    const [formData, setFormData] = useState({
        customerName: "name",
        roomNumber: "50",
        customerID: "1",
        carType: "Lada",
        RentalPeriod: "Day",
        Currency: "Currency",
        country: "Egypt",
        mobileNumber: "01032210349",
        email: "info@gmail.com",
        hotelName: "kiloPatra",
        DeliveryDate: "17/4/2002",
    });

    const [showDeclineReason, setShowDeclineReason] = useState(false);
    const [declineReason, setDeclineReason] = useState("");
    const [selectedFacility, setSelectedFacility] = useState("ac");

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

    const handleDeclineClick = () => {
        setShowDeclineReason(true);
    };

    const handleReasonChange = (e) => {
        setDeclineReason(e.target.value);
    };

    const handleFacilityChange = (e) => {
        setSelectedFacility(e.target.value);
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
                        <h3 className="text-lg font-semibold">View Renting</h3>
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
                                    <FormText
                                        label="Country"
                                        name="country"
                                        value={formData.country}
                                        placeholder="Enter Country"
                                        required
                                        readOnly
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
                                        required
                                        readOnly
                                    />
                                </div>
                                <div className="w-1/2">
                                    <FormText
                                        label="Car Type"
                                        name="carType"
                                        value={formData.carType}
                                        placeholder="Enter car Type"
                                        required
                                        readOnly
                                    />
                                </div>

                            </div>
                            <div className="flex justify-between gap-3 mt-3">


                                <div className="w-2/3">
                                    <Label>Facilities</Label>
                                    <div className="flex space-x-2 ">
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="radio"
                                                id="ac"
                                                name="facility"
                                                value="ac"
                                                checked={selectedFacility === 'ac'}
                                                onChange={handleFacilityChange}
                                                className="form-radio h-4 w-4 text-green-600"
                                            />
                                            <Label htmlFor="ac" className="ml-2 text-gray-700">AC</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="radio"
                                                id="standing"
                                                name="facility"
                                                value="standing"
                                                checked={selectedFacility === 'standing'}
                                                onChange={handleFacilityChange}
                                                className="form-radio h-4 w-4 text-green-600"
                                            />
                                            <Label htmlFor="standing" className="ml-2 text-gray-700">Standing at rest stops</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="radio"
                                                id="additional"
                                                name="facility"
                                                value="additional"
                                                checked={selectedFacility === 'additional'}
                                                onChange={handleFacilityChange}
                                                className="form-radio h-4 w-4 text-green-600"
                                            />
                                            <Label htmlFor="additional" className="ml-2 text-gray-700">Additional trips</Label>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-1/3">
                                    <FormInput
                                        label="Delivery date"
                                        name="Delivery date"
                                        type="date"
                                        value={formData.DeliveryDate}
                                        readOnly
                                    />
                                </div>
                            </div>

                            <div className="flex justify-between gap-3 mt-5">
                                <div className="md:w-1/2">
                                    <FormSelect
                                        selectLabel="Rental period"
                                        name="Rental period"
                                        value={formData.RentalPeriod}
                                        options={[{ value: "Day", label: "Day" }, { value: "week", label: "week" }, { value: "month", label: "month" }]}
                                        handleChange={handleChange}
                                    />
                                </div>
                                <div className="md:w-1/2 flex flex-col  items-center">
                                    <Label htmlFor="adults">Adults</Label>
                                    <div className="flex items-center p-2 my-3 bg-gray-50">
                                        <Button variant="outline">-</Button>
                                        <Input id="adults" value="2" className="text-center bg-gray-50" readOnly />
                                        <Button variant="outline">+</Button>
                                    </div>
                                </div>
                                </div>
                            <div className="flex justify-between gap-3 mt-5">
                               
                                <div className="w-1/2">
                                    <FormText
                                        label="Car Type"
                                        name="carType"
                                        value={formData.carType}
                                        placeholder="Enter car Type"
                                        required
                                        readOnly
                                    />
                                </div>
                                <div className="md:w-1/2">
                                    <FormSelect
                                        selectLabel="Currency"
                                        name="Currency"
                                        value={formData.Currency}
                                        options={[{ value: "Currency", label: "Currency" }, { value: "Currency", label: "Currency" }]}
                                        handleChange={handleChange}
                                    />
                                </div>
                                </div>


                            {showDeclineReason && (
                                <div className="mt-4">
                                    <textarea
                                        className="form-textarea w-full border border-gray-300 rounded-lg p-2"
                                        placeholder="Reason for Declining"
                                        value={declineReason}
                                        onChange={handleReasonChange}
                                    />
                                </div>
                            )}

                            <div className="flex justify-center gap-2 my-5">
                                <div className="w-fit bg-green-700 py-2 rounded-2xl  text-center">
                                    <FormBtnIcon
                                        Icon={Plus}
                                        label="Approve"
                                        type="submit"
                                        className="w-full mt-6 text-white  font-bold py-2 px-4 rounded"
                                    />
                                </div>
                                <div className="w-fit  bg-red-500 py-2  rounded-2xl text-center">
                                    <FormBtnIcon
                                        label="Decline"
                                        Icon={X}
                                        type="button"
                                        className="w-full mt-6 text-white font-bold py-2 px-4 rounded"
                                        onClick={handleDeclineClick}
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
