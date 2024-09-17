'use client';

import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Sortable from 'sortablejs';
import { GoPaperclip } from 'react-icons/go';
import { BiMessageSquareDetail } from 'react-icons/bi';
import { FaUserCircle } from 'react-icons/fa';
import { CiMenuKebab } from 'react-icons/ci';

// WebSocket URL and board data initialization
const boardId = 1;
const socketUrl = `wss://dashboard.cowdly.com/ws/boards/${boardId}/`;

const DraggableBoard = () => {
    const [columnsData, setColumnsData] = useState([]);
    const [newColumnName, setNewColumnName] = useState('');
    const [newCardName, setNewCardName] = useState('');
    const [showColumnForm, setShowColumnForm] = useState(false);
    const [showCardForm, setShowCardForm] = useState(null);
    const [socket, setSocket] = useState(null);

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

    useEffect(() => {
        // Initialize WebSocket
        const webSocket = new WebSocket(socketUrl);
        setSocket(webSocket);

        webSocket.onopen = () => {
            console.log("Connected to WebSocket server");
            try {
                webSocket.send(JSON.stringify(boardData));
            } catch (error) {
                console.error("Error sending data:", error);
            }
        };

        webSocket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.board_data) {
                    console.log("Board updated:", data.board_data);
                    setColumnsData(data.board_data.lists);
                    localStorage.setItem('boardData', JSON.stringify(data.board_data.lists));
                } else {
                    console.warn("No board_data in the received message");
                }
            } catch (error) {
                console.error("Error parsing message data:", error);
            }
        };

        webSocket.onerror = (error) => {
            console.error("WebSocket Error:", error.message || error);
        };

        webSocket.onclose = (event) => {
            console.log("WebSocket closed:", event.reason || "No reason provided");
        };

        // Clean up on unmount
        return () => {
            webSocket.close();
        };
    }, []);

    useEffect(() => {
        if (columnsData.length > 0) {
            const columnsContainer = document.querySelector('.draggable-board');
            if (columnsContainer) {
                Sortable.create(columnsContainer, {
                    group: 'columns',
                    animation: 150,
                    onEnd: handleColumnEnd,
                });
            }

            columnsData.forEach((_, colIndex) => {
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

    const handleColumnEnd = (evt) => {
        const updatedColumns = [...columnsData];
        const [movedColumn] = updatedColumns.splice(evt.oldIndex, 1);
        updatedColumns.splice(evt.newIndex, 0, movedColumn);
        setColumnsData(updatedColumns);
        updateBoardDataOnServer(updatedColumns);
    };

    const handleCardEnd = (evt) => {
        const sourceColumnIndex = evt.from.closest('.draggable-column').getAttribute('data-colindex');
        const destinationColumnIndex = evt.to.closest('.draggable-column').getAttribute('data-colindex');

        const updatedColumns = [...columnsData];
        const [movedCard] = updatedColumns[sourceColumnIndex].tasks.splice(evt.oldIndex, 1);
        updatedColumns[destinationColumnIndex].tasks.splice(evt.newIndex, 0, movedCard);
        setColumnsData(updatedColumns);
        updateBoardDataOnServer(updatedColumns);
    };

    const updateBoardDataOnServer = (updatedColumns) => {
        if (socket) {
            const boardData = {
                action: 'update_board',
                board: { lists: updatedColumns },
            };
            socket.send(JSON.stringify(boardData));
        } else {
            console.warn('WebSocket is not connected.');
        }
    };

    const handleAddNewColumn = () => {
        if (newColumnName.trim()) {
            const newColumn = {
                name: newColumnName,
                description: '',
                tasks: [],
            };
            const updatedColumns = [...columnsData, newColumn];
            setColumnsData(updatedColumns);
            setShowColumnForm(false);
            setNewColumnName('');
            updateBoardDataOnServer(updatedColumns);
        }
    };

    const handleAddNewCard = (colIndex) => {
        if (newCardName.trim()) {
            const newCard = {
                title: newCardName,
                description: '',
                priority: 'medium',
            };
            const updatedColumns = [...columnsData];
            updatedColumns[colIndex].tasks.push(newCard);
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
                    <div key={colIndex} id={`column-${colIndex}`} className="min-w-[260px] draggable-column" data-colindex={colIndex}>
                        <div className="flex justify-between items-center mb-3 relative">
                            <h3 className="text-[1.125rem] font-medium text-[#3b4056]">{column.name}</h3>
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
                            {column.tasks.map((item, cardIndex) => (
                                <div key={cardIndex} className="draggable-card bg-white border rounded-lg mb-2 p-3">
                                    <div className="flex items-center mb-2">
                                        <div className={`h-3 w-3 ${item.priority === 'high' ? 'bg-red-500' : item.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'} rounded-full`}></div>
                                        <p className="text-sm font-medium ml-2">{item.title}</p>
                                    </div>
                                    <div className="flex items-center justify-between text-gray-500 text-xs">
                                        <div className="flex items-center">
                                            <GoPaperclip className="mr-1" />
                                            <span>{item.attachments || 0}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <BiMessageSquareDetail className="mr-1" />
                                            <span>{item.comments || 0}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <FaUserCircle className="mr-1" />
                                            <span>{item.users ? item.users.length : 0}</span>
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
                    <button onClick={handleAddNewColumn} className="bg-blue-500 text-white rounded-lg py-2 px-4 mt-2">
                        Add Column
                    </button>
                </div>
            )}

            <button onClick={() => setShowColumnForm(true)} className="bg-blue-500 text-white rounded-lg py-2 px-4 mt-4">
                Add Column
            </button>
        </div>
    );
};

export default DraggableBoard;
