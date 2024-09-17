import React, { useState, useEffect, useCallback } from 'react';

const DraggableBoard = () => {
    const [socket, setSocket] = useState(null);
    const [columnsData, setColumnsData] = useState([]);
    const [reconnectAttempts, setReconnectAttempts] = useState(0);

    // WebSocket URL
    const socketUrl = 'wss://dashboard.cowdly.com/ws/boards/1/';

    // Reconnect logic with exponential backoff
    const reconnectWebSocket = useCallback(() => {
        console.log('Attempting to reconnect...');
        const newWs = new WebSocket(socketUrl);
        setSocket(newWs);

        newWs.onopen = () => {
            console.log('Connected to WebSocket server');
            newWs.send(JSON.stringify({ action: 'get_board' }));
        };

        newWs.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.board_data) {
                setColumnsData(data.board_data.lists);
                localStorage.setItem('boardData', JSON.stringify(data.board_data.lists));
            }
        };

        newWs.onerror = (error) => {
            console.error('WebSocket Error:', error.message || error);
            newWs.close();
        };

        newWs.onclose = (event) => {
            console.log('WebSocket closed:', event.reason || 'No reason provided');
            const retryDelay = Math.min(10000, Math.pow(2, reconnectAttempts) * 1000); // Exponential backoff with max delay of 10 seconds
            setTimeout(() => {
                reconnectWebSocket();
                setReconnectAttempts(prev => prev + 1);
            }, retryDelay);
        };
    }, [reconnectAttempts]);

    // Initialize WebSocket connection
    useEffect(() => {
        reconnectWebSocket();
        return () => {
            if (socket) {
                socket.close();
            }
        };
    }, [reconnectWebSocket, socket]);

    // Add new card handler
    const handleAddNewCard = () => {
        // Your logic to add a new card
        // Example:
        // const newCard = { id: Date.now(), title: 'New Card' };
        // const updatedData = [...columnsData, newCard];
        // updateBoardDataOnServer(updatedData);
    };

    // Update board data on server
    const updateBoardDataOnServer = (newData) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ action: 'update_board', data: newData }));
        } else {
            console.warn('WebSocket is not open. Cannot send data.');
        }
    };

    return (
        <div>
            <button onClick={handleAddNewCard}>Add New Card</button>
            <div>
                {/* Render your columnsData or any other content */}
                {columnsData.map(column => (
                    <div key={column.id}>
                        <h2>{column.title}</h2>
                        {/* Render cards within column */}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DraggableBoard;
