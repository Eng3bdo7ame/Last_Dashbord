'use client';
import { useState, useCallback } from "react";
import { X } from "@phosphor-icons/react";
import axios from 'axios';
import Cookies from 'js-cookie';
import FormText from "../../form/FormText";

const AddClients = ({ closeModal, modal, onClientAdded }) => {
    const [formData, setFormData] = useState({
        "name": "",
        "email": "",
        "phone": "",
        "address": ""
    });

    const handleChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior

        try {
            const token = Cookies.get('token'); // Retrieve token from cookies
            if (!token) {
                console.error('No token found in cookies');
                return;
            }

            const response = await axios.post('https://dashboard.cowdly.com/api/clients/', formData, {
                headers: {
                    'Authorization': `Token ${token}`, // Include token in the request header
                },
            });

            console.log('Client added successfully:', response.data);
            closeModal(); // Close the modal on successful submission
            onClientAdded(); // Call the callback function to refresh the table data

        } catch (error) {
            console.error('Error adding client:', error.response?.data || error.message);
        }
    };

    return (
        <div
            onClick={(e) => e.target === e.currentTarget && closeModal()}
            id="createStudent"
            className={`createStudent overflow-y-auto overflow-x-hidden duration-200 ease-linear
                shadow-2xl shadow-slate-500 
                backdrop-blur-sm backdrop-saturate-[180%]
                dark:shadow-white/[0.10] dark:backdrop-blur-sm dark:backdrop-saturate-[180%] 
                fixed top-0 left-0 z-50 justify-center items-center
                w-full h-full ${modal ? "visible" : "invisible"}`}
        >
            <div
                style={{ boxShadow: "black 19px 0px 45px -12px" }}
                className={`rounded-l-[15px] p-4 w-full max-w-[55rem] pb-10 bg-white
                dark:bg-gray-800 rounded-r-lg duration-200 ease-linear
                ${modal ? "fixed right-0" : "absolute -left-full"}
                h-screen overflow-auto`}
                dir="rtl"
            >
                <div className="relative p-4 bg-white dark:bg-gray-800 sm:p-5">
                    <div className=" flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600 shadow-md shadow-gray-300/10 ">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                            <X size={18} weight="bold" />
                            <span className="sr-only">Close modal</span>
                        </button>
                        <h2>Add Client</h2>
                    </div>
                    <div className="main-content-wrap mt-5">
                        <form className="form-add-product text-left" onSubmit={handleSubmit}>
                            {/* Form content */}
                            <FormText label="Client Name" type={"text"} name="name" placeholder={"Enter Client Name"} value={formData.name} onChange={handleChange} />
                            <FormText label="Phone Number" type={"number"} name="phone" placeholder={"Enter Phone Number"} value={formData.phone} onChange={handleChange} />
                            <FormText label="Email" type={"email"} name="email" placeholder={"Enter Email"} value={formData.email} onChange={handleChange} />
                            <FormText label="Address" type={"text"} name="address" placeholder={"Enter Address"} value={formData.address} onChange={handleChange} />
                            <button className="bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 rounded mt-10 style-1 w208" type="submit"><i className="icon-plus"></i>Add New</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddClients;
