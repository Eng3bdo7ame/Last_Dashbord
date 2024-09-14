import Image from "next/image";
import React from "react";
//
function FormPic({ label, name, onChange, file, readOnly }) {
  return (
    <div>
      <label
        htmlFor="file-upload"
        className="flex font-sans items-center justify-center gap-2   
                                            outline-none font-medium rounded-md 
                                            text-md px-5 py-2 text-center 
                                            ease-linear bg-green-700 text-white duration-100"
      >
        {label}
      </label>
      <input
        type="file"
        id="file-upload"
        name="file-upload"
        className="hidden"
        onChange={onChange}
        readOnly={readOnly}
      />
      {file && (
        <div>
          <Image src={URL.createObjectURL(file)} alt="Uploaded Image" />
        </div>
      )}
    </div>
  );
}

export default FormPic;
