/*
<div>
                  <label
                    htmlFor="gender"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white outline-none focus:border-gray-600 dark:focus:border-gray-100 duration-100 ease-linear"
                  >
                    {t("teachersForm.gender")}
                  </label>

                  <FormSelect
                    handleChange={handleChange}
                    //  options = [{value: 'daily', label: 'Daily'}, {value: 'monthly', label: 'Monthly'}]
                    options={[
                      { value: "male", label: t("teachersForm.male") },
                      { value: "female", label: t("teachersForm.female") },
                    ]}
                  />
                </div>
*/

import React from "react";

function FormSelect({ label, handleChange, options, value, name }) {

  return (
    <div>
      <label className="body-title mb-10">{label} <span className="tf-color-1">*</span></label>


      <select
        onChange={handleChange}

        name={name}
        className="mb-10 text-left text-2xl"
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
    </div >
  );
}

export default FormSelect;
