'use client';

import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Sortable from 'sortablejs';
import { GoPaperclip } from 'react-icons/go';
import { BiMessageSquareDetail } from 'react-icons/bi';
import { FaUserCircle } from 'react-icons/fa';
import EditTaskForm from './updateTask'; // Ensure the path is correct
import { CiMenuKebab } from 'react-icons/ci';
import { RiDeleteBin7Line } from 'react-icons/ri';

const boardId = 'your-board-id'; // Replace with the actual board ID
const socketUrl = `wss://dashboard.cowdly.com/ws/boards/${boardId}/`;
const socket = io(socketUrl, {
    query: { boardId },
});

const DraggableBoard = () => {
    const [columnsData, setColumnsData] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newColumnName, setNewColumnName] = useState('');
    const [newCardName, setNewCardName] = useState('');
    const [showCardForm, setShowCardForm] = useState(null);
    const [selectedCard, setSelectedCard] = useState(null);
    const [showMenuIndex, setShowMenuIndex] = useState(null); // For toggling menu

    useEffect(() => {
        // Load data from Socket.IO
        socket.on('board_data', (data) => {
            setColumnsData(data.lists); // Update the columnsData from server
        });

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
            socket.off('board_data'); // Clean up event listener on component unmount
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
    };

    // Update board on card drag
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

    // Function to update the board data via Socket.IO
    const updateBoardDataOnServer = (updatedColumns) => {
        const boardData = {
            board: { lists: updatedColumns },
        };
        socket.emit('update_board', boardData);
    };

    const handleAddNewColumn = () => {
        if (newColumnName.trim()) {
            const newColumn = {
                title: newColumnName,
                items: [],
            };
            const updatedColumns = [...columnsData, newColumn];
            setColumnsData(updatedColumns);
            setShowForm(false);
            setNewColumnName('');
            updateBoardDataOnServer(updatedColumns);
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
        updateBoardDataOnServer(updatedColumns);
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
                    <div key={colIndex} className="min-w-[260px]">
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
                                            {item.users.length ? (
                                                item.users.map((user, index) => (
                                                    <FaUserCircle key={index} className="text-gray-400" />
                                                ))
                                            ) : (
                                                <FaUserCircle className="text-gray-400" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {showCardForm === colIndex && (
                                <div className="bg-white p-4 rounded-lg shadow mt-4">
                                    <input
                                        type="text"
                                        value={newCardName}
                                        onChange={(e) => setNewCardName(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                        placeholder="Card Name"
                                    />
                                    <button
                                        onClick={() => handleAddNewCard(colIndex)}
                                        className="mt-2 w-full bg-blue-500 text-white py-2 rounded-lg"
                                    >
                                        Add Card
                                    </button>
                                </div>
                            )}
                        </div>
                        {!showCardForm && (
                            <button
                                onClick={() => setShowCardForm(colIndex)}
                                className="mt-2 bg-green-500 text-white py-2 px-4 rounded-lg"
                            >
                                Add New Card
                            </button>
                        )}
                    </div>
                ))}
            </div>
            {showForm && (
                <div className="bg-white p-4 rounded-lg shadow mt-4">
                    <input
                        type="text"
                        value={newColumnName}
                        onChange={(e) => setNewColumnName(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        placeholder="Column Name"
                    />
                    <button
                        onClick={handleAddNewColumn}
                        className="mt-2 w-full bg-blue-500 text-white py-2 rounded-lg"
                    >
                        Add Column
                    </button>
                </div>
            )}
            <button
                onClick={() => setShowForm(!showForm)}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg"
            >
                {showForm ? 'Cancel' : 'Add New Column'}
            </button>
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
