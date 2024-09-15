import React from "react";

function FormBtnIcon({ label, icon }) {
  return (
    <button
      type="submit"
      className="text-white gap-2 inline-flex font-sans  
         hover:bg-green-400 
        outline-none font-medium  
        text-sm px-5 py-2.5  
        ease-linear duration-100 rounded-xl"
    >
      {icon}
      {label}
    </button>
  );
}

export default FormBtnIcon;
