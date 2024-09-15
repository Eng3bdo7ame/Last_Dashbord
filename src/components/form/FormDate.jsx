import React from 'react'

export default function FormDate({
    label,
    value,
    onChange,
    min,
    max,
}) {
    return (
        <div className="date-period-input">
            <label className="block mb-2">
                <span className="text-gray-700">{label}</span>
                <input
                    type="date"
                    value={value}
                    onChange={onChange}
                    className="border rounded p-2 mt-1 block w-full"
                    min={min}
                />
            </label>
        </div>
    )
}





