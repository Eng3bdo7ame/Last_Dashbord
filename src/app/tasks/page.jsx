'use client';

import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Sortable from 'sortablejs';
import { GoPaperclip } from 'react-icons/go';
import { BiMessageSquareDetail } from 'react-icons/bi';
import { FaUserCircle } from 'react-icons/fa';
import { CiMenuKebab } from 'react-icons/ci';

// WebSocket setup
const boardId = 1;
const socket = new WebSocket(`wss://dashboard.cowdly.com/ws/boards/${boardId}/`);

const DraggableBoard = () => {
    const [columnsData, setColumnsData] = useState([]);
    const [newColumnName, setNewColumnName] = useState('');
    const [newCardName, setNewCardName] = useState('');
    const [showColumnForm, setShowColumnForm] = useState(false);
    const [showCardForm, setShowCardForm] = useState(null);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Load data from local storage on component mount
        const savedData = localStorage.getItem('boardData');
        if (savedData) {
            setColumnsData(JSON.parse(savedData));
        }

        // WebSocket events
        socket.onopen = () => {
            console.log('Connected to WebSocket server');
            socket.send(JSON.stringify({ action: 'get_board' }));
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.board_data) {
                setColumnsData(data.board_data.lists); // Update the columnsData from server
                // Save to local storage
                localStorage.setItem('boardData', JSON.stringify(data.board_data.lists));
            }
        };

        socket.onerror = (error) => {
            console.error('WebSocket Error:', error.message || error);
        };

        socket.onclose = (event) => {
            console.log('WebSocket closed:', event.reason || 'No reason provided');
        };

        // Set up Sortable.js for columns and cards
        const columnContainers = document.querySelectorAll('.draggable-board');
        columnContainers.forEach((container) => {
            new Sortable(container, {
                group: 'columns',
                animation: 150,
                onEnd: handleColumnEnd,
            });
        });

        const cardContainers = document.querySelectorAll('.draggable-column');
        cardContainers.forEach((container) => {
            new Sortable(container, {
                group: 'shared',
                draggable: '.draggable-card',
                animation: 150,
                onEnd: handleCardEnd,
            });
        });

        return () => {
            socket.close(); // Clean up WebSocket connection on component unmount
        };
    }, []);

    const toggleMenu = (index) => {
        setShowMenuIndex(showMenuIndex === index ? null : index);
    };

    // Update board on column drag
    const handleColumnEnd = (evt) => {
        const updatedColumns = [...columnsData];
        const [movedColumn] = updatedColumns.splice(evt.oldIndex, 1);
        updatedColumns.splice(evt.newIndex, 0, movedColumn);
        setColumnsData(updatedColumns);
        updateBoardDataOnServer(updatedColumns);
        localStorage.setItem('boardData', JSON.stringify(updatedColumns));
    };

    const handleCardEnd = (evt) => {
        if (evt.from !== evt.to) {
            const sourceColumnIndex = Array.from(evt.from.parentNode.children).indexOf(evt.from);
            const destinationColumnIndex = Array.from(evt.to.parentNode.children).indexOf(evt.to);

            const updatedColumns = [...columnsData];
            const [movedCard] = updatedColumns[sourceColumnIndex].items.splice(evt.oldIndex, 1);
            updatedColumns[destinationColumnIndex].items.splice(evt.newIndex, 0, movedCard);
            setColumnsData(updatedColumns);
            updateBoardDataOnServer(updatedColumns);
            localStorage.setItem('boardData', JSON.stringify(updatedColumns));
        }
    };

    // Function to update the board data via WebSocket
    const updateBoardDataOnServer = (updatedColumns) => {
        const boardData = {
            action: 'update_board',
            board: { lists: updatedColumns },
        };
        socket.send(JSON.stringify(boardData));
    };

    const handleAddNewColumn = () => {
        if (newColumnName.trim()) {
            const newColumn = {
                title: newColumnName,
                items: [],
            };
            const updatedColumns = [...columnsData, newColumn];
            setColumnsData(updatedColumns);
            setShowColumnForm(false);
            setNewColumnName('');
            updateBoardDataOnServer(updatedColumns);
            localStorage.setItem('boardData', JSON.stringify(updatedColumns));
        }
    };

    const handleAddNewCard = (colIndex) => {
        if (newCardName.trim()) {
            const newCard = {
                label: 'New Card',
                labelColor: 'bg-gray-200 text-gray-700',
                title: newCardName,
                attachments: 0,
                comments: 0,
                users: [],
            };
            const updatedColumns = [...columnsData];
            updatedColumns[colIndex].items.push(newCard);
            setColumnsData(updatedColumns);
            setNewCardName('');
            setShowCardForm(null);
            updateBoardDataOnServer(updatedColumns);
            localStorage.setItem('boardData', JSON.stringify(updatedColumns));
        }
    };

    const handleDeleteColumn = (colIndex) => {
        const updatedColumns = columnsData.filter((_, index) => index !== colIndex);
        setColumnsData(updatedColumns);
        updateBoardDataOnServer(updatedColumns);
    };

    return (
        <div>
            <div className="draggable-board flex overflow-x-auto space-x-4 p-8">
                {columnsData.map((column, colIndex) => (
                    <div key={colIndex} id={`column-${colIndex}`} className="min-w-[260px]">
                        <div className="flex justify-between items-center mb-3 relative">
                            <h3 className="text-[1.125rem] font-medium text-[#3b4056]">
                                {column.title}
                            </h3>
                            <CiMenuKebab
                                className="text-black cursor-pointer"
                                onClick={() => toggleMenu(colIndex)}
                            />

                            {showMenuIndex === colIndex && (
                                <div className="absolute top-8 right-0 bg-white border rounded-lg shadow-lg z-10 w-36">
                                    <div className="menu flex flex-col py-2 px-3">
                                        <div className="menu-item">
                                            <button
                                                className="menu-link text-[18px] font-medium w-full text-left"
                                                onClick={() => handleDeleteColumn(colIndex)}
                                            >
                                                <div className="menu-icon flex items-center space-x-2">
                                                    <RiDeleteBin7Line />
                                                    <span className="menu-title">Delete</span>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="draggable-column p-2 bg-[#F4F6F8] rounded-lg">
                            {column.items.map((item, cardIndex) => (
                                <div
                                    key={cardIndex}
                                    className="draggable-card bg-white border rounded-lg mb-2 p-3"
                                >
                                    <div className="flex items-center mb-2">
                                        <div className={`h-3 w-3 ${item.labelColor} rounded-full`}></div>
                                        <p className="text-sm font-medium ml-2">{item.title}</p>
                                    </div>
                                    <h4 className="font-medium mt-2 text-lg">{item.title}</h4>

                                    <div className="mt-4 flex justify-between items-center">
                                        <div className="flex items-center space-x-1">
                                            <GoPaperclip />
                                            <span>{item.attachments}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <BiMessageSquareDetail className="mr-1" />
                                            <span>{item.comments}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            {item.users.length ? (
                                                item.users.map((user, index) => (
                                                    <FaUserCircle key={index} />
                                                ))
                                            ) : (
                                                <FaUserCircle />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {showCardForm === colIndex && (
                                <div className="mt-4 flex">
                                    <input
                                        type="text"
                                        placeholder="New Card Title"
                                        value={newCardName}
                                        onChange={(e) => setNewCardName(e.target.value)}
                                        className="border rounded-l-lg p-2 w-full"
                                    />
                                    <button
                                        onClick={() => handleAddNewCard(colIndex)}
                                        className="bg-blue-500 text-white rounded-r-lg px-4"
                                    >
                                        Add
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <button
                onClick={() => setShowForm(true)}
                className="bg-green-500 text-white p-2 rounded-lg mt-4"
            >
                Add New Column
            </button>
            {showForm && (
                <div className="mt-4 flex">
                    <input
                        type="text"
                        value={newColumnName}
                        onChange={(e) => setNewColumnName(e.target.value)}
                        className="border rounded-l-lg p-2 w-full"
                    />
                    <button
                        onClick={handleAddNewColumn}
                        className="bg-blue-500 text-white rounded-r-lg px-4"
                    >
                        Add Column
                    </button>
                </div>
            )}
            {selectedCard && (
                <EditTaskForm
                    card={selectedCard}
                    onSave={handleSaveCard}
                    onClose={() => setSelectedCard(null)}
                />
            )}
        </div>
    );
};

export default DraggableBoard;
