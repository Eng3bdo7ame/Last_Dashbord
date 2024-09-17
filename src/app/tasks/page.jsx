'use client';

import React, { useEffect, useState } from 'react';
import Sortable from 'sortablejs';
import { GoPaperclip } from 'react-icons/go';
import { BiMessageSquareDetail } from 'react-icons/bi';
import { FaUserCircle } from 'react-icons/fa';
import { CiMenuKebab } from 'react-icons/ci';

const boardId = 1;
const defaultApiUrl = `https://dashboard.cowdly.com/api/kanban/boards/1/`;
const boardSocketUrl = `wss://dashboard.cowdly.com/ws/boards/${boardId}/`;

const DraggableBoard = () => {
    const [columnsData, setColumnsData] = useState([]);
    const [newColumnName, setNewColumnName] = useState('');
    const [newCardName, setNewCardName] = useState('');
    const [showColumnForm, setShowColumnForm] = useState(false);
    const [showCardForm, setShowCardForm] = useState(null);
    const [boardSocket, setBoardSocket] = useState(null);

    useEffect(() => {
        // Fetch initial data via HTTP
        const fetchInitialData = async () => {
            try {
                const response = await fetch(defaultApiUrl);
                const data = await response.json();
                console.log('object',data)
                if (data.lists) {
                    console.log('Default board data received:', data.lists);
                    setColumnsData(data.lists);
                    localStorage.setItem('boardData', JSON.stringify(data.lists));
                } else {
                    console.warn('No board_data in the fetched response');
                }
            } catch (error) {
                console.error('Error fetching default data:', error);
            }
        };

        fetchInitialData();
    }, []);

    useEffect(() => {
        // WebSocket for real-time updates
        const boardSocket = new WebSocket(boardSocketUrl);
        setBoardSocket(boardSocket);

        boardSocket.onopen = () => {
            console.log('Connected to WebSocket for board updates.');
        };

        boardSocket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.board_data) {
                    console.log('Board updated:', data.board_data);
                    setColumnsData(data.board_data.lists);
                    localStorage.setItem('boardData', JSON.stringify(data.board_data.lists));
                } else {
                    console.warn('No board_data in the received message');
                }
            } catch (error) {
                console.error('Error parsing board update message:', error);
            }
        };

        boardSocket.onerror = (error) => {
            console.error('Board WebSocket error:', error.message || error);
        };

        boardSocket.onclose = (event) => {
            console.log('Board WebSocket closed:', event.reason || 'No reason provided');
        };

        // Clean up on unmount
        return () => {
            boardSocket.close();
        };
    }, []);

    useEffect(() => {
        if (columnsData.length > 0) {
            // Initialize column sorting
            const columnsContainer = document.querySelector('.draggable-board');
            if (columnsContainer) {
                Sortable.create(columnsContainer, {
                    group: 'columns',
                    animation: 150,
                    onEnd: handleColumnEnd,
                    // Disable drag-and-drop between columns
                    filter: '.draggable-card', // Ensures only columns can be dragged
                });
            }
    
            // Initialize card sorting for each column
            columnsData.forEach((_, colIndex) => {
                const columnElement = document.querySelector(`#column-${colIndex}`);
                if (columnElement) {
                    Sortable.create(columnElement, {
                        group: {
                            name: `cards-${colIndex}`, // Unique group for each column
                            put: false, // Prevent cards from being moved to other columns
                        },
                        animation: 150,
                        onEnd: (evt) => handleCardEnd(evt, colIndex),
                        // Ensure only the card is moved, not affecting the visibility of others
                        onStart: (evt) => {
                            evt.from.style.overflow = 'hidden'; // Hide overflow during drag
                        },
                        onEnd: (evt) => {
                            evt.from.style.overflow = ''; // Restore overflow after drag
                        },
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

    const handleCardEnd = (evt, colIndex) => {
        const sourceColumnIndex = evt.from.closest('.draggable-column').getAttribute('data-colindex');
        const destinationColumnIndex = evt.to.closest('.draggable-column').getAttribute('data-colindex');

        // Ensure the indices are valid and columns exist
        if (sourceColumnIndex === null || destinationColumnIndex === null) {
            console.error('Invalid column indices:', sourceColumnIndex, destinationColumnIndex);
            return;
        }

        const srcIndex = parseInt(sourceColumnIndex, 10);
        const destIndex = parseInt(destinationColumnIndex, 10);

        if (!columnsData[srcIndex] || !columnsData[destIndex]) {
            console.error('Invalid column data:', columnsData[srcIndex], columnsData[destIndex]);
            return;
        }

        const updatedColumns = [...columnsData];
        const [movedCard] = updatedColumns[srcIndex].tasks.splice(evt.oldIndex, 1);

        // Ensure tasks exist in the destination column
        if (!updatedColumns[destIndex].tasks) {
            updatedColumns[destIndex].tasks = [];
        }

        updatedColumns[destIndex].tasks.splice(evt.newIndex, 0, movedCard);
        setColumnsData(updatedColumns);
        updateBoardDataOnServer(updatedColumns);
    };

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
                priority: 'medium', // Set a default priority
            };
            const updatedColumns = [...columnsData];
            if (!updatedColumns[colIndex].tasks) {
                updatedColumns[colIndex].tasks = []; // Ensure tasks array exists
            }
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
                            {column.tasks && column.tasks.map((item, cardIndex) => {
                                console.log('Rendering item:', item); // Add this line to debug

                                if (!item) {
                                    return null; // Skip rendering if item is undefined or null
                                }

                                // Default priority in case it's missing
                                const priority = item.priority || 'low';

                                return (
                                    <div key={cardIndex} data-cardid={cardIndex} className="draggable-card bg-white border rounded-lg mb-2 p-3">
                                        <div className="flex items-center mb-2">
                                            <div className={`h-3 w-3 ${priority === 'high' ? 'bg-red-500' : priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'} rounded-full`}></div>
                                            <p className="text-sm font-medium ml-2">{item.title}</p>
                                        </div>
                                        <div className="flex items-center justify-between text-gray-500 text-xs">
                                            <div className="flex items-center">
                                                <GoPaperclip className="mr-1" />
                                                <BiMessageSquareDetail className="mr-1" />
                                                <FaUserCircle className="mr-1" />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <button
                            onClick={() => setShowCardForm(colIndex)}
                            className="bg-blue-500 text-white rounded-lg py-2 px-4 mt-2"
                        >
                            Add Card
                        </button>
                    </div>
                ))}
            </div>

            {showColumnForm && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[300px]">
                        <h3 className="text-lg font-medium mb-4">Add New Column</h3>
                        <input
                            type="text"
                            value={newColumnName}
                            onChange={(e) => setNewColumnName(e.target.value)}
                            placeholder="Column Name"
                            className="border rounded-lg p-2 w-full mb-4"
                        />
                        <button
                            onClick={handleAddNewColumn}
                            className="bg-blue-500 text-white rounded-lg py-2 px-4"
                        >
                            Add Column
                        </button>
                    </div>
                </div>
            )}

            <button
                onClick={() => setShowColumnForm(true)}
                className="bg-green-500 text-white rounded-lg py-2 px-4"
            >
                Add Column
            </button>
        </div>
    );
};

export default DraggableBoard;
