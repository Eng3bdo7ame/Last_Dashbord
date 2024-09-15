import React from "react";

function FormTextArea({ label, name, value, placeholder, required, onChange }) {
  return (
    <div className="mb-10 text-left">
      <fieldset className="name">
        <label className="body-title mb-10">{label}
          <span className="tf-color-1">*</span></label>
        <textarea className="mb-10 text-left" type="text" placeholder={placeholder} name={name} value={value} onChange={onChange} required={required} />
      </fieldset>
    </div>
  );
}

export default FormTextArea;
