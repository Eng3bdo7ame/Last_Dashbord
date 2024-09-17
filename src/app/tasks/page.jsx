"use client";
import "../../css/taskes.css"
import React, { useEffect, useState } from 'react';
import Sortable from 'sortablejs';
import { GoPaperclip } from "react-icons/go";
import { BiMessageSquareDetail } from "react-icons/bi";
import { FaUserCircle } from "react-icons/fa";
import EditTaskForm from './updateTask'; // تأكد من المسار الصحيح لمكون نموذج التعديل
import Image from 'next/image';
import { CiMenuKebab } from "react-icons/ci";
import { RiDeleteBin7Line } from 'react-icons/ri';

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
        const columnContainers = document.querySelectorAll('.draggable-board');

        columnContainers.forEach(container => {
            new Sortable(container, {
                group: 'columns', // Group for columns
                animation: 150,
                onEnd: handleColumnEnd, // Handle column drag end
            });
        });

        const cardContainers = document.querySelectorAll('.draggable-column');

        cardContainers.forEach(container => {
            new Sortable(container, {
                group: 'shared', // Group for cards
                draggable: '.draggable-card',
                animation: 150,
                onEnd: handleCardEnd, // Handle card drag end
            });
        });
    }, [columnsData]);


    const [showMenuIndex, setShowMenuIndex] = useState(null); // للتحكم بظهور القائمة

    const toggleMenu = (index) => {
        setShowMenuIndex(showMenuIndex === index ? null : index); // إظهار/إخفاء القائمة
    };


    const handleColumnEnd = (evt) => {
        const updatedColumns = [...columnsData];
        const [movedColumn] = updatedColumns.splice(evt.oldIndex, 1);
        updatedColumns.splice(evt.newIndex, 0, movedColumn);
        setColumnsData(updatedColumns);
    };

    const handleCardEnd = (evt) => {
        if (evt.from !== evt.to) {
            const sourceColumnIndex = Array.from(evt.from.parentNode.children).indexOf(evt.from);
            const destinationColumnIndex = Array.from(evt.to.parentNode.children).indexOf(evt.to);

            const updatedColumns = [...columnsData];
            const [movedCard] = updatedColumns[sourceColumnIndex].items.splice(evt.oldIndex, 1);
            updatedColumns[destinationColumnIndex].items.splice(evt.newIndex, 0, movedCard);
            setColumnsData(updatedColumns);
        }
    };

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
        <div className=''>
            <div className="draggable-board flex overflow-x-auto space-x-4 p-8">
                {columnsData.map((column, colIndex) => (
                    <div key={colIndex} className="min-w-[260px]">
                        <div className="flex justify-between items-center mb-3 relative">
                            <h3 className="text-[1.125rem] font-medium text-[#3b4056]">{column.title}</h3>
                            <CiMenuKebab
                                className="text-black cursor-pointer"
                                onClick={() => toggleMenu(colIndex)}
                            />

                            {/* القائمة المنسدلة */}
                            {showMenuIndex === colIndex && (
                                <div className="absolute top-8 right-0 bg-white border rounded-lg shadow-lg z-10 w-36">
                                    <div className="menu flex flex-col py-2 px-3">
                                        <div className="menu-item">
                                            <a className="menu-link text-[18px] font-medium" href="#">
                                                <div className="menu-icon flex items-center ">
                                                    <RiDeleteBin7Line />
                                                    <span className="menu-title">Delete</span>
                                                </div>
                                            </a>
                                        </div>
                                        <div className="menu-item">
                                            <a className="menu-link" href="#">
                                                <span className="menu-title">Menu link 2</span>
                                            </a>
                                        </div>
                                        <div className="menu-item">
                                            <a className="menu-link" href="#">
                                                <span className="menu-title">Menu link 3</span>
                                            </a>
                                        </div>
                                        <div className="menu-item">
                                            <a className="menu-link" href="#">
                                                <span className="menu-title">Menu link 4</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="draggable-column space-y-4">
                            {column.items.map((item, itemIndex) => (
                                <div
                                    key={itemIndex}
                                    className="draggable-card p-4 bg-white rounded-lg shadow-lg shadow-gray-300 cursor-move"
                                    onClick={() => handleCardClick(item)}
                                >
                                    <span className={`inline-block px-2 py-1 text-sm font-medium ${item.labelColor} rounded-full mb-2`}>
                                        {item.label}
                                    </span>
                                    {item.image && (
                                        <div className="mb-4">
                                            <Image src={item.image} alt={item.title} width={200} height={200} className="rounded-lg w-full" />
                                        </div>
                                    )}
                                    <h4 className="text-[.9375rem] font-medium mb-2">{item.title}</h4>
                                    <div className="flex justify-between items-center text-sm text-gray-500">
                                        <div className="flex items-center space-x-4">
                                            <span className="text-lg flex items-center">
                                                <GoPaperclip className="mr-1" /> {item.attachments}
                                            </span>
                                            <span className="text-lg  flex items-center">
                                                <BiMessageSquareDetail className="mr-1" /> {item.comments}
                                            </span>
                                        </div>
                                        <div className="flex -space-x-2">
                                            {item.users.map((user, userIndex) => (
                                                <FaUserCircle key={userIndex} className="w-5 h-5 text-gray-400" />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            className="mt-4 text-lg text-gray-500 rounded-lg px-4 py-2"
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

                <div className="min-w-[260px] flex items-center justify-center">
                    {showForm ? (
                        <div className="">
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
                                    Add Column
                                </button>
                                <button
                                    className="bg-red-500 text-white rounded-lg text-xl px-4 py-2"
                                    onClick={() => setShowForm(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            className="text-lg text-gray-500 rounded-lg px-4 py-2"
                            onClick={() => setShowForm(true)}
                        >
                            + Add New Column
                        </button>
                    )}
                </div>
            </div>

            {selectedCard && (
                <EditTaskForm card={selectedCard} onSave={handleSaveCard} onCancel={() => setSelectedCard(null)} />
            )}
        </div>
    );
};

export default DraggableBoard;
