 
function FormInput({
  label,
  type,
  name,
  value,
  placeholder,
  required,
  onChange,
  numberOnly,
  maxLength,
  readOnly
}) {
  const handleChange = (e) => {
    if (numberOnly) {
      const nonAlphabeticValue = e.target.value.replace(/[a-zA-Z]/g, "");
      e.target.value = nonAlphabeticValue;
      onChange(e); 
    } else {
      onChange(e);  
    }
  };

  return (
    <div>
      <label
        htmlFor={name}
        className="block mb-2 text-md font-medium font-sans  outline-none focus:border-gray-600 dark:focus:border-gray-100 duration-100 ease-linear"
      >
        {label}
      </label>
      <input
        type={type}
        readOnly={readOnly}
        name={name}
        id={name}
        defaultValue={value}
        className="bg-gray-50 border border-gray-300
                            text-gray-900 text-sm rounded-md
                            block w-full p-2.5 
                            dark:border-gray-600 dark:placeholder-gray-400 
                              outline-none 
                            focus:border-orange-400 dark:focus:border-orange-400
                            duration-100 ease-linear"
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
        onChange={numberOnly ? handleChange : onChange}
      
      />
    </div>
  );
}

export default FormInput;
