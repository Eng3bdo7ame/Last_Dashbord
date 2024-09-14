import React from "react";

function FormBtnIcon({ label, icon }) {
  return (
    <button
     
      className="text-white gap-2 inline-flex font-sans  
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
