'use client';

import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Sortable from 'sortablejs';
import { GoPaperclip } from 'react-icons/go';
import { BiMessageSquareDetail } from 'react-icons/bi';
import { FaUserCircle } from 'react-icons/fa';
import { CiMenuKebab } from 'react-icons/ci';

const boardId = 1; // Replace with dynamic board ID if necessary
const socketUrl = `https://dashboard.cowdly.com/`; // Only the base URL, Socket.IO will append the rest

const DraggableBoard = () => {
    const [columnsData, setColumnsData] = useState([]);
    const [newColumnName, setNewColumnName] = useState('');
    const [newCardName, setNewCardName] = useState('');
    const [showColumnForm, setShowColumnForm] = useState(false);
    const [showCardForm, setShowCardForm] = useState(null);
    const [socket, setSocket] = useState(null);

    // Function to initialize WebSocket connection with retries
    const initializeSocket = () => {
        const newSocket = io(socketUrl, {
            path: '/socket.io',  // This explicitly tells the client to use the correct path
            transports: ['websocket'],  // Ensure WebSocket is used as the transport
        });

        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Connected to Socket.IO server');
            newSocket.emit('get_board', { boardId });
        });

        newSocket.on('board_data', (data) => {
            if (data.board_data) {
                setColumnsData(data.board_data.lists); // Set board data from database
            }
        });

        newSocket.on('disconnect', (reason) => {
            console.log('Socket.IO disconnected:', reason);
            // Attempt to reconnect
            if (reason !== 'io client disconnect') {
                setTimeout(() => initializeSocket(), 3000); // Retry connection every 3 seconds
            }
        });
    };

    // Initialize and connect to WebSocket
    useEffect(() => {
        initializeSocket();

        return () => {
            if (socket) socket.disconnect(); // Disconnect socket on component unmount
        };
    }, []);

    // Initialize Sortable after data load
    useEffect(() => {
        const columnsContainer = document.querySelector('.draggable-board');
        if (columnsContainer) {
            Sortable.create(columnsContainer, {
                group: 'columns',
                animation: 150,
                onEnd: handleColumnEnd,
            });

            columnsData.forEach((column, colIndex) => {
                const columnElement = document.querySelector(`#column-${colIndex}`);
                if (columnElement) {
                    Sortable.create(columnElement, {
                        group: 'cards',
                        animation: 150,
                        onEnd: handleCardEnd,
                    });
                }
            });
        }
    }, [columnsData]);

    // Handle column drag-and-drop
    const handleColumnEnd = (evt) => {
        const updatedColumns = [...columnsData];
        const [movedColumn] = updatedColumns.splice(evt.oldIndex, 1);
        updatedColumns.splice(evt.newIndex, 0, movedColumn);
        setColumnsData(updatedColumns);
        updateBoardDataOnServer(updatedColumns);
    };

    // Handle card drag-and-drop between columns
    const handleCardEnd = (evt) => {
        if (evt.from !== evt.to) {
            const sourceColumnIndex = Array.from(evt.from.parentNode.children).indexOf(evt.from);
            const destinationColumnIndex = Array.from(evt.to.parentNode.children).indexOf(evt.to);

            const updatedColumns = [...columnsData];
            const [movedCard] = updatedColumns[sourceColumnIndex].items.splice(evt.oldIndex, 1);
            updatedColumns[destinationColumnIndex].items.splice(evt.newIndex, 0, movedCard);
            setColumnsData(updatedColumns);
            updateBoardDataOnServer(updatedColumns);
        }
    };

    // Update board data on the server via WebSocket
    const updateBoardDataOnServer = (updatedColumns) => {
        if (socket && socket.connected) {
            const boardData = {
                action: 'update_board',
                board: { lists: updatedColumns }, // Send updated board data to be saved in the database
            };
            socket.emit('update_board', boardData, (response) => {
                if (chrome.runtime.lastError) {
                    console.error('Socket message error:', chrome.runtime.lastError.message);
                }
            });
        } else {
            console.warn('Socket.IO client is not connected.');
        }
    };

    // Add a new column
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
        }
    };

    // Add a new card
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
        }
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
                            <CiMenuKebab className="text-black cursor-pointer" />
                        </div>

                        {showCardForm === colIndex && (
                            <div className="mb-4">
                                <input
                                    type="text"
                                    value={newCardName}
                                    onChange={(e) => setNewCardName(e.target.value)}
                                    placeholder="New Card Title"
                                    className="border rounded-lg p-2 w-full"
                                />
                                <button
                                    onClick={() => handleAddNewCard(colIndex)}
                                    className="bg-blue-500 text-white rounded-lg py-2 px-4 mt-2"
                                >
                                    Add Card
                                </button>
                            </div>
                        )}

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
                                    <div className="flex items-center justify-between text-gray-500 text-xs">
                                        <div className="flex items-center">
                                            <GoPaperclip className="mr-1" />
                                            <span>{item.attachments}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <BiMessageSquareDetail className="mr-1" />
                                            <span>{item.comments}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <FaUserCircle className="mr-1" />
                                            <span>{item.users.length}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => setShowCardForm(colIndex)}
                            className="bg-green-500 text-white rounded-lg py-2 px-4 mt-4"
                        >
                            Add Card
                        </button>
                    </div>
                ))}
            </div>

            {showColumnForm && (
                <div className="mb-4">
                    <input
                        type="text"
                        value={newColumnName}
                        onChange={(e) => setNewColumnName(e.target.value)}
                        placeholder="New Column Title"
                        className="border rounded-lg p-2 w-full"
                    />
                    <button
                        onClick={handleAddNewColumn}
                        className="bg-blue-500 text-white rounded-lg py-2 px-4 mt-2"
                    >
                        Add Column
                    </button>
                </div>
            )}

            <button
                onClick={() => setShowColumnForm(true)}
                className="bg-blue-500 text-white rounded-lg py-2 px-4 mt-4"
            >
                Add Column
            </button>
        </div>
    );
};

export default DraggableBoard;
