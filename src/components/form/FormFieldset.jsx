import React from "react";

function FormFieldset({ label, name, value, placeholder, required, onChange, type }) {
  return (
    <div className=" text-left">
      <fieldset className="name">
        <label className="body-title mb-10">{label} <span className="tf-color-1">*</span></label>
        <input className="mb-10 text-left" type={type} placeholder={placeholder} name={name} value={value} onChange={onChange} required={required} />
      </fieldset>
    </div>
  );
}

export default FormFieldset;
