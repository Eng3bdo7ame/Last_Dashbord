import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { X } from '@phosphor-icons/react';
import Cookies from 'js-cookie';
import FormText from '../../form/FormText';
import FormEmail from '../../form/FormEmail';
import FormNumber from '../../form/FormNumber';

function EditClient({ closeModal, clientId, onClientUpdated }) {
    const [clientData, setClientData] = useState({ name: '', email: '', phone: '', address: '' });

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
                const { name, email, phone, address } = response.data;
                setClientData({ name, email, phone, address });
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = Cookies.get('token');
            const response = await axios.put(`https://dashboard.cowdly.com/api/clients/${clientId}/`, clientData, {
                headers: {
                    'Authorization': `Token ${token}`,
                },
            });

            // بعد التحديث، يتم استدعاء الدالة لإرسال البيانات المعدلة إلى الجدول
            if (onClientUpdated) {
                onClientUpdated(response.data);
            }

            closeModal();
        } catch (error) {
            console.error('Error updating client data:', error.response?.data || error.message);
        }
    };

    const handleBackgroundClick = (e) => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    };

    return (
        <div onClick={handleBackgroundClick} className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
            <div className="font-sans fw-bold w-full bg-white rounded-lg shadow-lg fixed top-0 right-0 h-full transition-transform duration-300 ease-in-out"
                style={{ width: '40vw', zIndex: 50 }}>
                <div className="relative text-gray-900">
                    <div className="bg-green-700 w-full flex justify-between items-center text-white p-3 mb-4 rounded-t-lg border-b">
                        <h3 className="text-lg font-semibold">Edit Client</h3>
                        <button type="button" onClick={closeModal} className="text-gray-400 hover:bg-gray-200 rounded-lg text-sm p-1.5 inline-flex items-center">
                            <X size={18} weight="bold" />
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="gap-4 mb-4 px-4">
                            <FormText
                                label="Name"
                                name="name"
                                value={clientData.name}
                                onChange={(e) => setClientData({ ...clientData, name: e.target.value })}
                            />
                            <FormEmail
                                label="Email"
                                name="email"
                                value={clientData.email}
                                onChange={(e) => setClientData({ ...clientData, email: e.target.value })}
                            />
                            <FormNumber
                                label="Phone"
                                name="phone"
                                value={clientData.phone}
                                onChange={(e) => setClientData({ ...clientData, phone: e.target.value })}
                            />
                            <FormText
                                label="Address"
                                name="address"
                                value={clientData.address}
                                onChange={(e) => setClientData({ ...clientData, address: e.target.value })}
                            />

                            <div className="flex justify-center gap-2 mt-5">
                                <button type="submit" className="px-8 py-2 w-fit bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700">
                                    Save
                                </button>
                                <button type="button" onClick={closeModal} className="px-8 py-2 w-fit bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700">
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

export default EditClient;
