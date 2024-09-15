"use client";
import React, { useEffect, useState } from 'react';
import Sortable from 'sortablejs';
import { GoPaperclip } from "react-icons/go";
import { BiMessageSquareDetail } from "react-icons/bi";
import { FaUserCircle } from "react-icons/fa";
import EditTaskForm from './updateTask'; // تأكد من المسار الصحيح لمكون نموذج التعديل

const initialColumnsData = [
    {
        title: "In Progress",
        items: [
            {
                label: "UX",
                labelColor: "bg-green-200 text-green-700",
                title: "Research FAQ page UX",
                attachments: 4,
                comments: 12,
                users: [1, 2, 3]
            },
            {
                label: "Code Review",
                labelColor: "bg-red-200 text-red-700",
                title: "Review Javascript code",
                attachments: 2,
                comments: 8,
                users: [4, 5]
            },
        ]
    },
    {
        title: "In Review",
        items: [
            {
                label: "Info",
                labelColor: "bg-blue-200 text-blue-700",
                title: "Review completed Apps",
                attachments: 8,
                comments: 17,
                users: [6, 7]
            },
            {
                label: "Images",
                labelColor: "bg-yellow-200 text-yellow-700",
                title: "Find new images for pages",
                attachments: 10,
                comments: 18,
                image: "/placeholder.svg", // Placeholder image
                users: [1, 2, 3, 4]
            },
        ]
    },
    {
        title: "Done",
        items: [
            {
                label: "App",
                labelColor: "bg-gray-200 text-gray-700",
                title: "Forms & Tables section",
                attachments: 1,
                comments: 4,
                users: [8, 9, 10]
            },
            {
                label: "Charts & Maps",
                labelColor: "bg-purple-200 text-purple-700",
                title: "Completed Charts & Maps",
                attachments: 6,
                comments: 21,
                users: [11]
            },
        ]
    },
];

const DraggableBoard = () => {
    const [columnsData, setColumnsData] = useState(() => {
        const savedData = localStorage.getItem('columnsData');
        return savedData ? JSON.parse(savedData) : initialColumnsData;
    });

    const [showForm, setShowForm] = useState(false);
    const [newColumnName, setNewColumnName] = useState('');
    const [newCardName, setNewCardName] = useState('');
    const [showCardForm, setShowCardForm] = useState(null);
    const [selectedCard, setSelectedCard] = useState(null);

    useEffect(() => {
        localStorage.setItem('columnsData', JSON.stringify(columnsData));
    }, [columnsData]);

    useEffect(() => {
        const containers = document.querySelectorAll('.draggable-column');

        containers.forEach(container => {
            new Sortable(container, {
                draggable: '.draggable-card',
                group: 'shared',
                animation: 150,
                onEnd: (evt) => {
                    // Handle the logic when dragging ends, e.g., update state
                }
            });
        });
    }, [columnsData]);

    const handleAddNewColumn = () => {
        if (newColumnName.trim()) {
            const newColumn = {
                title: newColumnName,
                items: []
            };
            setColumnsData([...columnsData, newColumn]);
            setShowForm(false);
            setNewColumnName('');
        }
    };

    const handleAddNewCard = (colIndex) => {
        if (newCardName.trim()) {
            const newCard = {
                label: "New Card",
                labelColor: "bg-gray-200 text-gray-700",
                title: newCardName,
                attachments: 0,
                comments: 0,
                users: []
            };
            const updatedColumns = [...columnsData];
            updatedColumns[colIndex].items.push(newCard);
            setColumnsData(updatedColumns);
            setNewCardName('');
            setShowCardForm(null);
        }
    };

    const handleCardClick = (card) => {
        setSelectedCard(card);
    };

    const handleSaveCard = (updatedCard) => {
        const updatedColumns = columnsData.map(column => ({
            ...column,
            items: column.items.map(item => (item === selectedCard ? updatedCard : item))
        }));
        setColumnsData(updatedColumns);
        setSelectedCard(null);
    };

    return (
        <div className='pt-[100px] xl:w-[78%] lg:w-[68%] md:w-[95%] float-end'>
            <div className='relative flex justify-between'>
                <h1 className='text-7xl'>Tasks</h1>
                <button
                    className="text-3xl bg-blue-500 text-white rounded-lg px-4 py-2 mr-16"
                    onClick={() => setShowForm(true)}
                >
                    + Add new
                </button>

                {showForm && (
                    <div className="absolute top-[12rem] right-[-9rem] transform -translate-x-1/2 -translate-y-1/2 p-4 w-[20%] bg-white rounded-xl shadow-lg">
                        <h2 className='text-2xl'>Add new column</h2>
                        <input
                            type="text"
                            placeholder="Enter column name"
                            value={newColumnName}
                            onChange={(e) => setNewColumnName(e.target.value)}
                            className="border border-gray-300 rounded-lg px-4 py-2 w-full text-xl"
                        />
                        <div className="mt-4">
                            <button
                                className="bg-green-500 text-white rounded-lg text-xl px-4 py-2 mr-4"
                                onClick={handleAddNewColumn}
                            >
                                Confirm
                            </button>
                            <button
                                className="bg-red-500 text-white rounded-lg text-xl px-4 py-2"
                                onClick={() => setShowForm(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex overflow-x-auto space-x-4 p-8">
                {columnsData.map((column, colIndex) => (
                    <div key={colIndex} className="min-w-[300px]">
                        <h3 className="text-4xl font-semibold mb-4">{column.title}</h3>
                        <div className="draggable-column space-y-4">
                            {column.items.map((item, itemIndex) => (
                                <div
                                    key={itemIndex}
                                    className="draggable-card p-4 bg-white rounded-lg shadow-md cursor-move"
                                    onClick={() => handleCardClick(item)} // Handle card click
                                >
                                    <span className={`inline-block px-2 py-1 text-xl font-semibold ${item.labelColor} rounded-full mb-2`}>
                                        {item.label}
                                    </span>
                                    {item.image && (
                                        <div className="mb-4">
                                            <img src={item.image} alt={item.title} className="rounded-lg w-full" />
                                        </div>
                                    )}
                                    <h4 className="text-2xl font-medium mb-2">{item.title}</h4>
                                    <div className="flex justify-between items-center text-sm text-gray-500">
                                        <div className="flex items-center space-x-4">
                                            <span className="text-2xl flex items-center">
                                                <GoPaperclip className="mr-1" /> {item.attachments}
                                            </span>
                                            <span className="text-2xl font-semibold flex items-center">
                                                <BiMessageSquareDetail className="mr-1" /> {item.comments}
                                            </span>
                                        </div>
                                        <div className="flex -space-x-2">
                                            {item.users.map((user, userIndex) => (
                                                <FaUserCircle key={userIndex} className="w-8 h-8 text-gray-400" />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            className="mt-4 text-2xl text-gray-500 rounded-lg px-4 py-2"
                            onClick={() => setShowCardForm(colIndex)}
                        >
                            + Add New Item
                        </button>

                        {showCardForm === colIndex && (
                            <div className="mt-4">
                                <input
                                    type="text"
                                    placeholder="Enter card name"
                                    value={newCardName}
                                    onChange={(e) => setNewCardName(e.target.value)}
                                    className="border border-gray-300 rounded-lg px-4 py-2 w-full text-xl"
                                />
                                <div className="mt-4">
                                    <button
                                        className="bg-green-500 text-white rounded-lg text-xl px-4 py-2 mr-4"
                                        onClick={() => handleAddNewCard(colIndex)}
                                    >
                                        Confirm
                                    </button>
                                    <button
                                        className="bg-red-500 text-white rounded-lg text-xl px-4 py-2"
                                        onClick={() => setShowCardForm(null)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {selectedCard && (
                <div className='fixed inset-0 bg-black bg-opacity-50 z-40 backdrop-blur-sm'
                    onClick={() => setSelectedCard(null)}
                >
                    <div className={`fixed top-0 right-0 h-full w-[400px] bg-white shadow-lg z-50 transform transition-transform ease-in-out duration-300 ${selectedCard ? 'translate-x-0' : 'translate-x-full'}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <EditTaskForm
                            card={selectedCard}
                            onClose={() => setSelectedCard(null)}
                            onSave={handleSaveCard}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default DraggableBoard;
