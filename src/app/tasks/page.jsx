"use client";
import React, { useEffect, useState } from 'react';
import Sortable from 'sortablejs';
import { GoPaperclip } from "react-icons/go";
import { BiMessageSquareDetail } from "react-icons/bi";
import { FaUserCircle } from "react-icons/fa";
import EditTaskForm from './updateTask'; // تأكد من المسار الصحيح لمكون نموذج التعديل

const boardId = 1;
const boardSocketUrl = `wss://dashboard.cowdly.com/ws/boards/${boardId}/`;

const TaskPage = () => {
    const [columnsData, setColumnsData] = useState(() => {
        const savedData = localStorage.getItem('columnsData');
        return savedData ? JSON.parse(savedData) : initialColumnsData;
    });

    const [showForm, setShowForm] = useState(false);
    const [newColumnName, setNewColumnName] = useState('');
    const [newCardName, setNewCardName] = useState('');
    const [showCardForm, setShowCardForm] = useState(null);
    const [selectedCard, setSelectedCard] = useState(null);
    const [boardSocket, setBoardSocket] = useState(null);

    // WebSocket Setup for Real-Time Updates
    useEffect(() => {
        const socket = new WebSocket(boardSocketUrl);
        setBoardSocket(socket);

        socket.onopen = () => {
            console.log('Connected to WebSocket for board updates.');
        };

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.board_data) {
                    console.log('Board updated:', data.board_data);
                    setColumnsData(data.board_data.lists);
                    localStorage.setItem('columnsData', JSON.stringify(data.board_data.lists));
                } else {
                    console.warn('No board_data in the received message');
                }
            } catch (error) {
                console.error('Error parsing board update message:', error);
            }
        };

        socket.onerror = (error) => {
            console.error('Board WebSocket error:', error.message || error);
        };

        socket.onclose = (event) => {
            console.log('Board WebSocket closed:', event.reason || 'No reason provided');
        };

        // Cleanup on unmount
        return () => {
            socket.close();
        };
    }, []);

    // Sync local changes with the server via WebSocket
    const updateBoardDataOnServer = (updatedColumns) => {
        if (boardSocket) {
            const boardData = {
                action: 'update_board',
                board: { lists: updatedColumns },
            };
            boardSocket.send(JSON.stringify(boardData));
        } else {
            console.warn('Board WebSocket is not connected.');
        }
    };

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
                    // Handle the logic when dragging ends
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
            const updatedColumns = [...columnsData, newColumn];
            setColumnsData(updatedColumns);
            setShowForm(false);
            setNewColumnName('');
            updateBoardDataOnServer(updatedColumns); // Send update to server
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
            updateBoardDataOnServer(updatedColumns); // Send update to server
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
        updateBoardDataOnServer(updatedColumns); // Send update to server
    };

    return (
        <div className=''>
            <div className='relative flex justify-between'>
                <h1 className='text-4xl font-bold'>Tasks</h1>
                <button
                    className="text-lg bg-blue-500 text-white rounded-lg px-4 py-2 mr-16"
                    onClick={() => setShowForm(true)}
                >
                    + Add new
                </button>

                {showForm && (
                    <div className="absolute top-[9rem] right-[-9rem] transform -translate-x-1/2 -translate-y-1/2 p-4 w-[20%] bg-white rounded-xl shadow-lg">
                        <h2 className='text-xl'>Add new column</h2>
                        <input
                            type="text"
                            placeholder="Enter column name"
                            value={newColumnName}
                            onChange={(e) => setNewColumnName(e.target.value)}
                            className="border border-gray-300 rounded-lg px-4 py-2 w-full text-lg"
                        />
                        <div className="mt-4">
                            <button
                                className="bg-green-500 text-white rounded-lg text-lg px-4 py-2 mr-4"
                                onClick={handleAddNewColumn}
                            >
                                Confirm
                            </button>
                            <button
                                className="bg-red-500 text-white rounded-lg text-lg px-4 py-2"
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
                        <h3 className="text-2xl font-semibold mb-4">{column.title}</h3>
                        <div className="draggable-column space-y-4">
                            {column.items.map((item, itemIndex) => (
                                <div
                                    key={itemIndex}
                                    className="draggable-card p-4 bg-white rounded-lg shadow-md cursor-move"
                                    onClick={() => handleCardClick(item)}
                                >
                                    <span className={`inline-block px-2 py-1 text-sm font-semibold ${item.labelColor} rounded-full mb-2`}>
                                        {item.label}
                                    </span>
                                    {item.image && (
                                        <div className="mb-4">
                                            <img src={item.image} alt={item.title} className="rounded-lg w-full" />
                                        </div>
                                    )}
                                    <h4 className="text-lg font-medium mb-2">{item.title}</h4>
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
                                    className="border border-gray-300 rounded-lg px-4 py-2 w-full text-lg"
                                />
                                <button
                                    className="bg-green-500 text-white rounded-lg text-lg px-4 py-2 mt-2"
                                    onClick={() => handleAddNewCard(colIndex)}
                                >
                                    Add Card
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {selectedCard && (
                <EditTaskForm card={selectedCard} onSave={handleSaveCard} onClose={() => setSelectedCard(null)} />
            )}
        </div>
    );
};

export default TaskPage;
