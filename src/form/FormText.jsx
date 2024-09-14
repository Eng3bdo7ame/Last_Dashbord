import React from "react";

function FormText({ label, name, value, placeholder, required, onChange, readOnly }) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block mb-2 text-md font-medium font-sans  outline-none focus:border-gray-600 dark:focus:border-gray-100 duration-100 ease-linear"
      >
        {label}
      </label>
      <input
        type="text"
        name={name}
        id={name}
        readOnly={readOnly}
        defaultValue={value}
        className="bg-gray-50 border border-gray-300
                            text-sm rounded-md
                            block w-full p-2.5  
                            dark:border-gray-600  
                              outline-none 
                            focus:border-orange-400 dark:focus:border-orange-400
                            duration-100 ease-linear"
        placeholder={placeholder}
        required={required}
        onChange={onChange}
      />
    </div>
  );
}

export default FormText;
