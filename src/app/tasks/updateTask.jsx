import React, { useState, useEffect } from 'react';
import { IoCloseOutline } from "react-icons/io5";
import { FaRegEdit, FaPlus, FaBold, FaItalic, FaUnderline, FaLink, FaImage } from "react-icons/fa";
import { LuClock } from "react-icons/lu";
import { format } from 'date-fns';

const EditTaskForm = ({ card, onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [dueDate, setDueDate] = useState(null);
    const [label, setLabel] = useState('');
    const [comment, setComment] = useState('');

    useEffect(() => {
        if (card) {
            setTitle(card.title || '');
            setDueDate(card.dueDate ? new Date(card.dueDate) : null);
            setLabel(card.label || 'App');
            setComment(card.comment || '');
        }
    }, [card]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Call onSave with updated card data
        onSave({
            ...card,
            title,
            dueDate,
            label,
            comment
        });
    };

    return (
        <div className="w-full mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-border-b flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-800">Edit Task</h2>
                <button
                    className="text-gray-400 hover:text-gray-600"
                    onClick={onClose}
                >
                    <IoCloseOutline size={24} />
                </button>
            </div>

            <div className="px-6 py-4">
                <div className="flex mb-6 border-b">
                    <button className="px-4 py-2 font-medium text-blue-600 border-b-2 border-blue-600">
                        <FaRegEdit size={20} className="inline mr-2" />
                        Edit
                    </button>
                    <button className="px-4 py-2 font-medium text-gray-400">
                        <LuClock size={20} className="inline mr-2" />
                        Activity
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input
                            type="text"
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                        />
                    </div>

                    <div>
                        <div>
                            <button
                                type="button"
                                className={`w-full justify-start text-left font-normal ${!dueDate && "text-muted-foreground"}`}
                            >
                                {dueDate ? format(dueDate, "d MMMM, yyyy") : <span>Due Date</span>}
                            </button>
                            {/* Replace with your calendar component */}
                            {/* <Calendar
                                mode="single"
                                selected={dueDate}
                                onSelect={setDueDate}
                                initialFocus
                            /> */}
                        </div>
                    </div>

                    <div>
                        <select value={label} onChange={(e) => setLabel(e.target.value)}>
                            <option value="App">App</option>
                            <option value="Website">Website</option>
                            <option value="Server">Server</option>
                        </select>
                    </div>

                    <div>
                        <p className="mb-2 font-medium text-gray-700">Assigned</p>
                        <div className="flex items-center">
                            {[1, 2, 3].map((index) => (
                                <img
                                    key={index}
                                    className="w-8 h-8 rounded-full border-2 border-white -ml-2 first:ml-0"
                                    src={`/placeholder.svg?height=32&width=32&text=${index}`}
                                    alt={`Assigned user ${index}`}
                                />
                            ))}
                            <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 ml-2">
                                <FaPlus size={20} />
                            </button>
                        </div>
                    </div>

                    <div>
                        <p className="mb-2 font-medium text-gray-700">Attachments</p>
                        <div className="flex border rounded-md overflow-hidden">
                            <button className="rounded-r-none border-r px-4 py-2 text-gray-700">Choose File</button>
                            <span className="flex items-center px-3 text-gray-500 bg-gray-50 flex-grow">No file chosen</span>
                        </div>
                    </div>

                    <div>
                        <p className="mb-2 font-medium text-gray-700">Comment</p>
                        <textarea
                            placeholder="Write a Comment..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                            rows={4}
                        />
                        <div className="flex mt-2 border-t pt-2 justify-end space-x-2">
                            <button className="text-gray-500"><FaBold size={18} /></button>
                            <button className="text-gray-500"><FaItalic size={18} /></button>
                            <button className="text-gray-500"><FaUnderline size={18} /></button>
                            <button className="text-gray-500"><FaLink size={18} /></button>
                            <button className="text-gray-500"><FaImage size={18} /></button>
                        </div>
                    </div>

                    <div className="flex justify-between pt-4">
                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-md">Update</button>
                        <button type="button" className="text-red-600 border-red-600 hover:bg-red-50 px-4 py-2 rounded-md">Delete</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditTaskForm;
