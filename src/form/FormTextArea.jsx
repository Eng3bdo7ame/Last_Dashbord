import React from "react";

function FormTextArea({ label, name, value, placeholder, required, onChange, readOnly }) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block mb-2 text-md font-medium  font-sans   outline-none focus:border-gray-600 dark:focus:border-gray-100 duration-100 ease-linear"
      >
        {label}
      </label>
      <textarea
        name={name}
        id={name}
        readOnly={readOnly}
        defaultValue={value}
        rows={5}
        className=" shadow-md rounded-2 border border-gray-300
                    text-gray-900 text-sm 
                    block w-full p-2.5 
                    dark:border-gray-600 dark:placeholder-gray-400 
                      outline-none
                    focus:border-orange-400 dark:focus:border-orange-400
                    duration-100 ease-linear resize-none"
        placeholder={placeholder}
        required={required}
        onChange={onChange}
      />
    </div>
  );
}

export default FormTextArea;
