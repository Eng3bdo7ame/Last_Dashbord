 

import React from "react";
  
function FormSelect({ selectLabel, handleChange, options, value, name, readOnly }) {
 
  return (
    <div>
      <label
        htmlFor={selectLabel}
        className="block mb-2 text-md font-medium   font-sans  outline-none focus:border-gray-600 dark:focus:border-gray-100 duration-100 ease-linear"
      >
        {selectLabel}
      </label>

      <select
        onChange={handleChange}
        id={selectLabel}
        readOnly={readOnly}
        name={name}
        className="w-full p-2.5 dark:bg-gray-50 rounded-md
        dark:border-gray-600 dark:placeholder-gray-400
         outline-none border text-gray-700 bg-gray-50
        focus:border-orange-400 dark:focus:border-orange-400
        duration-100 ease-linear"
        value={value}
      >
        <option value={""}> select </option>
        {Array.isArray(options) &&
          options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
      </select>
    </div>
  );
}

export default FormSelect;
