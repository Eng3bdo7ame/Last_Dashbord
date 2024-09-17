'use client';

const boardId = 1;
const socket = new WebSocket(
    `wss://dashboard.cowdly.com/ws/boards/${boardId}/`
);

const boardData = {
    action: "update_board",
    board: {
        lists: [
            {
                name: "To Do",
                description: "Tasks to be done",
                tasks: [
                    { title: "Task 1", description: "Description 1", priority: "medium" },
                    { title: "Task 2", description: "Description 2", priority: "high" },
                ],
            },
            {
                name: "In Progress",
                description: "Tasks in progress",
                tasks: [
                    { title: "Task 3", description: "Description 3", priority: "low" },
                ],
            },
        ],
    },
};

socket.onopen = function () {
    console.log("Connected to WebSocket server");
    try {
        socket.send(JSON.stringify(boardData));
    } catch (error) {
        console.error("Error sending data:", error);
    }
};

socket.onmessage = function (event) {
    try {
        const data = JSON.parse(event.data);
        if (data.board_data) {
            console.log("Board updated:", data.board_data);
        } else {
            console.warn("No board_data in the received message");
        }
    } catch (error) {
        console.error("Error parsing message data:", error);
    }
};

socket.onerror = function (error) {
    console.error("WebSocket Error:", error.message || error);
    if (error.reason) {
        console.error("Error reason:", error.reason);
    }
    if (error.code) {
        console.error("Error code:", error.code);
    }
};

socket.onclose = function (event) {
    console.log("WebSocket closed:", event.reason || "No reason provided");
};

// React component with draggable columns and cards
 
import "../../css/taskes.css";
import React, { useEffect, useState } from "react";
import Sortable from "sortablejs";
import { GoPaperclip } from "react-icons/go";
import { BiMessageSquareDetail } from "react-icons/bi";
import { FaUserCircle } from "react-icons/fa";
import EditTaskForm from "./updateTask"; // Update with the correct path to your edit form component
import Image from "next/image";
import { CiMenuKebab } from "react-icons/ci";
import { RiDeleteBin7Line } from "react-icons/ri";

// Initial column data for the board
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
                users: [1, 2, 3],
            },
            {
                label: "Code Review",
                labelColor: "bg-red-200 text-red-700",
                title: "Review Javascript code",
                attachments: 2,
                comments: 8,
                users: [4, 5],
            },
        ],
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
                users: [6, 7],
            },
            {
                label: "Images",
                labelColor: "bg-yellow-200 text-yellow-700",
                title: "Find new images for pages",
                attachments: 10,
                comments: 18,
                image: "/placeholder.svg", // Placeholder image
                users: [1, 2, 3, 4],
            },
        ],
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
                users: [8, 9, 10],
            },
            {
                label: "Charts & Maps",
                labelColor: "bg-purple-200 text-purple-700",
                title: "Completed Charts & Maps",
                attachments: 6,
                comments: 21,
                users: [11],
            },
        ],
    },
];

const DraggableBoard = () => {
    const [columnsData, setColumnsData] = useState(() => {
        const savedData = localStorage.getItem("columnsData");
        return savedData ? JSON.parse(savedData) : initialColumnsData;
    });

    const [showForm, setShowForm] = useState(false);
    const [newColumnName, setNewColumnName] = useState("");
    const [newCardName, setNewCardName] = useState("");
    const [showCardForm, setShowCardForm] = useState(null);
    const [selectedCard, setSelectedCard] = useState(null);
    const [showMenuIndex, setShowMenuIndex] = useState(null); // For toggling menu

    useEffect(() => {
        localStorage.setItem("columnsData", JSON.stringify(columnsData));
    }, [columnsData]);

    useEffect(() => {
        const columnContainers = document.querySelectorAll(".draggable-board");

        columnContainers.forEach((container) => {
            new Sortable(container, {
                group: "columns", // Group for columns
                animation: 150,
                onEnd: handleColumnEnd, // Handle column drag end
            });
        });

        const cardContainers = document.querySelectorAll(".draggable-column");

        cardContainers.forEach((container) => {
            new Sortable(container, {
                group: "shared", // Group for cards
                draggable: ".draggable-card",
                animation: 150,
                onEnd: handleCardEnd, // Handle card drag end
            });
        });
    }, [columnsData]);

    const toggleMenu = (index) => {
        setShowMenuIndex(showMenuIndex === index ? null : index); // Toggle menu visibility
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
            const [movedCard] = updatedColumns[sourceColumnIndex].items.splice(
                evt.oldIndex,
                1
            );
            updatedColumns[destinationColumnIndex].items.splice(evt.newIndex, 0, movedCard);
            setColumnsData(updatedColumns);
        }
    };

    const handleAddNewColumn = () => {
        if (newColumnName.trim()) {
            const newColumn = {
                title: newColumnName,
                items: [],
            };
            setColumnsData([...columnsData, newColumn]);
            setShowForm(false);
            setNewColumnName("");
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
                users: [],
            };
            const updatedColumns = [...columnsData];
            updatedColumns[colIndex].items.push(newCard);
            setColumnsData(updatedColumns);
            setNewCardName("");
            setShowCardForm(null);
        }
    };

    const handleCardClick = (card) => {
        setSelectedCard(card);
    };

    const handleSaveCard = (updatedCard) => {
        const updatedColumns = columnsData.map((column) => ({
            ...column,
            items: column.items.map((item) =>
                item === selectedCard ? updatedCard : item
            ),
        }));
        setColumnsData(updatedColumns);
        setSelectedCard(null);
    };

    return (
        <div className="">
            <div className="draggable-board flex overflow-x-auto space-x-4 p-8">
                {columnsData.map((column, colIndex) => (
                    <div key={colIndex} className="min-w-[260px]">
                        <div className="flex justify-between items-center mb-3 relative">
                            <h3 className="text-[1.125rem] font-medium text-[#3b4056]">
                                {column.title}
                            </h3>
                            <CiMenuKebab
                                className="text-black cursor-pointer"
                                onClick={() => toggleMenu(colIndex)}
                            />

                            {/* Dropdown menu */}
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
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Draggable column for tasks */}
                        <div className="draggable-column space-y-3">
                            {column.items.map((item, cardIndex) => (
                                <div
                                    key={cardIndex}
                                    className="bg-white p-4 rounded-lg draggable-card shadow cursor-pointer"
                                    onClick={() => handleCardClick(item)}
                                >
                                    <div className={`inline-block px-2 py-1 text-sm rounded-md ${item.labelColor}`}>
                                        {item.label}
                                    </div>
                                    <h4 className="font-medium mt-2 text-lg">{item.title}</h4>

                                    {/* Task Info */}
                                    <div className="mt-4 flex justify-between items-center">
                                        <div className="flex items-center space-x-1">
                                            <GoPaperclip />
                                            <span>{item.attachments}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <BiMessageSquareDetail />
                                            <span>{item.comments}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            {item.users.map((user, index) => (
                                                <FaUserCircle key={index} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Form for adding new card */}
                        {showCardForm === colIndex && (
                            <div className="mt-2">
                                <input
                                    type="text"
                                    placeholder="New card name"
                                    value={newCardName}
                                    onChange={(e) => setNewCardName(e.target.value)}
                                    className="border border-gray-300 rounded-md p-2 w-full"
                                />
                                <button
                                    onClick={() => handleAddNewCard(colIndex)}
                                    className="bg-blue-500 text-white rounded-md p-2 mt-2 w-full"
                                >
                                    Add Card
                                </button>
                            </div>
                        )}

                        {/* Button for showing card form */}
                        <button
                            onClick={() => setShowCardForm(colIndex)}
                            className="bg-blue-500 text-white rounded-md p-2 mt-2 w-full"
                        >
                            Add New Card
                        </button>
                    </div>
                ))}

                {/* Form for adding new column */}
                {showForm ? (
                    <div className="min-w-[260px] p-8">
                        <input
                            type="text"
                            placeholder="New column name"
                            value={newColumnName}
                            onChange={(e) => setNewColumnName(e.target.value)}
                            className="border border-gray-300 rounded-md p-2 w-full"
                        />
                        <button
                            onClick={handleAddNewColumn}
                            className="bg-blue-500 text-white rounded-md p-2 mt-2 w-full"
                        >
                            Add Column
                        </button>
                    </div>
                ) : (
                    
                     <button
                            onClick={() => setShowForm(true)}
                            className="bg-blue-500 text-white rounded-md h-fit p-2 mt-10 w-full"
                        >
                            Add New Column
                        </button>
                )}
            </div>

            {/* Modal for editing card */}
            {selectedCard && (
                <EditTaskForm
                    card={selectedCard}
                    onSave={handleSaveCard}
                    onCancel={() => setSelectedCard(null)}
                />
            )}
        </div>
    );
};

export default DraggableBoard;
