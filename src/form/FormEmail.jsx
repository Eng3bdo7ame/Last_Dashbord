/*
<div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white outline-none focus:border-gray-600 dark:focus:border-gray-100 duration-100 ease-linear"
                  >
                
                    {t("teachersForm.email")}
                  </label>
                  <input
                    type="email"
                    name="name"
                    id="name"
                    value={formData.name}
                    className="bg-gray-50 border border-gray-300
                        text-gray-900 text-sm rounded-md
                        block w-full p-2.5 dark:bg-gray-700
                        dark:border-gray-600 dark:placeholder-gray-400 
                        dark:text-white outline-none 
                        focus:border-orange-400 dark:focus:border-orange-400
                        duration-100 ease-linear"
                    placeholder="email@gmail.com"
                    required=""
                    onChange={handleChange}
                  />
                </div>
*/

// FormEmail.jsx
import React from "react";

const FormEmail = ({ label, name, value, placeholder, required, onChange, readOnly }) => {
  return (
    <div>
      <label
        htmlFor="email"
        className="block mb-2 text-md font-medium   font-sans  outline-none focus:border-gray-600 dark:focus:border-gray-100 duration-100 ease-linear"
      >
        {label}
      </label>
      <input
        type="email"
        name={name}
        readOnly={readOnly}
        id={name}
        defaultValue={value}
        className=" bg-gray-50 border border-gray-300
                    text-gray-900 text-sm rounded-md
                    block w-full p-2.5 
                    dark:border-gray-600 dark:placeholder-gray-400 
                      outline-none 
                    focus:border-orange-400 dark:focus:border-orange-400
                    duration-100 ease-linear"
        placeholder={placeholder}
        required={required}
        onChange={onChange}
      />
    </div>
  );
};

export default FormEmail;
