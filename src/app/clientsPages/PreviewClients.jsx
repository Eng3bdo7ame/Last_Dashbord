import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { X } from '@phosphor-icons/react';
import Cookies from 'js-cookie';
import FormText from '../../form/FormText';
import FormEmail from '../../form/FormEmail';
import FormNumber from '../../form/FormNumber';

function ViewClient({ closeModal, clientId }) {
    const [clientData, setClientData] = useState({

    });

    const fetchClientData = useCallback(async () => {
        try {
            const token = Cookies.get('token');
            if (!token) {
                console.error('No token found in cookies');
                return;
            }

            const response = await axios.get(`https://dashboard.cowdly.com/api/clients/${clientId}/`, {
                headers: {
                    'Authorization': `Token ${token}`,
                },
            });

            if (response.data) {
                const { id, name, email, phone, address } = response.data;
                setClientData({ id, name, email, phone, address });
            }
        } catch (error) {
            console.error('Error fetching client data:', error.response?.data || error.message);
        }
    }, [clientId]);

    useEffect(() => {
        if (clientId) {
            fetchClientData();
        }
    }, [fetchClientData, clientId]);

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
                        <h3 className="text-lg font-semibold">View Client</h3>
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
                            {/* ID Field */}
                            <div className="flex justify-between items-center gap-3">
                                <div className="w-full">
                                    <FormText
                                        label="ID"
                                        name="id"
                                        value={clientData.id}
                                        placeholder="Client ID"
                                        readOnly
                                    />
                                </div>
                            </div>

                            {/* Name Field */}
                            <div className="flex justify-between items-center gap-3 mt-3">
                                <div className="w-full">
                                    <FormText
                                        label="Name"
                                        name="name"
                                        value={clientData.name}
                                        placeholder="Client Name"
                                        readOnly
                                    />
                                </div>
                            </div>

                            {/* Email Field */}
                            <div className="flex justify-between items-center gap-3 mt-3">
                                <div className="w-full">
                                    <FormEmail
                                        label="Email"
                                        name="email"
                                        value={clientData.email}
                                        placeholder="Client Email"
                                        readOnly
                                    />
                                </div>
                            </div>

                            {/* Phone Field */}
                            <div className="flex justify-between items-center gap-3 mt-3">
                                <div className="w-full">
                                    <FormNumber
                                        label="Phone"
                                        name="phone"
                                        value={clientData.phone}
                                        placeholder="Client Phone"
                                        readOnly
                                    />
                                </div>
                            </div>

                             
                            <div className="flex justify-between items-center gap-3 mt-3">
                                <div className="w-full">
                                    <FormText
                                        label="Address"
                                        name="address"
                                        value={clientData.address}
                                        placeholder="Client Address"
                                        readOnly
                                    />
                                </div>
                            </div>

                            <div className="flex justify-center gap-2 mt-5">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-8 py-2 w-fit bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default React.memo(ViewClient);
