'use client'
import React, { useState, useCallback } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaFacebookF, FaTwitter, FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";
import Link from "next/link";
import auth1 from "../../../public/images/auth-login-illustration-light.png";
import { Eye, EyeClosed } from "@phosphor-icons/react";

import { TextField } from "@mui/material";

const FormStepOne = ({ formData, handleInputChange, nextStep }) => (
    <>
        <div className=" ">

            <TextField
                id="outlined-basic"
                name="username"
                label="User Name"
                type="text"
                placeholder="Username"
                required
                value={formData.username}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"

                className="mb-1"
            />
            <TextField
                id="first_name"
                name="first_name"
                label="first name"
                type="text"
                placeholder="First Name"
                required
                value={formData.first_name}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                className="mb-1"
            />
            <TextField
                id="last_name"
                name="last_name"
                label="last name"
                type="text"
                placeholder="Last Name"
                required
                value={formData.last_name}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                className="mb-1"
            />
            <TextField
                id="email"
                name="email"
                type="email"
                label="email"
                placeholder="Email"
                required
                value={formData.email}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                className="mb-1"
            />
            <TextField
                id="phone_number"
                name="phone_number"
                label="phone number"
                type="tel"
                placeholder="Phone Number"
                required
                value={formData.phone_number}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                className="mb-1"
            />
            <TextField
                id="country"
                name="country"
                label="country"
                type="text"
                placeholder="Country"
                required
                value={formData.country}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                className="mb-1"
            />
            <TextField
                id="city"
                name="city"
                label="city"
                type="text"
                placeholder="City"
                required
                value={formData.city}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                className="mb-1"
            />
            <TextField
                id="address"
                name="address"
                label="address"
                type="text"
                placeholder="Address"
                required
                value={formData.address}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                className="mb-1"
            />

            <div className="flex flex-col">
                <div className="flex items-center justify-center space-x-2 mt-2">
                    <Link href="#" className="p-2 bg-gray-100 rounded-full">
                        <FcGoogle className="w-6 h-6" />
                    </Link>
                    <Link href="#" className="p-2 bg-gray-100 rounded-full">
                        <FaFacebookF className="w-6 h-6 text-blue-600" />
                    </Link>
                    <Link href="#" className="p-2 bg-gray-100 rounded-full">
                        <FaTwitter className="w-6 h-6 text-blue-400" />
                    </Link>
                    <Link href="#" className="p-2 bg-gray-100 rounded-full">
                        <FaGithub className="w-6 h-6" />
                    </Link>
                </div>

                <p className="text-center text-xl mt-0">
                    Already have an account?{" "}
                    <Link href="/" className="text-blue-600 hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
        <div className="flex justify-end space-x-4 mt-4">
            <button onClick={nextStep} className="py-3 px-5 text-xl bg-blue-600 text-white font-bold rounded-2xl">
                Next
            </button>
        </div>
    </>
);


const FormStepTwo = ({ formData, handleInputChange, handleFileChange, handleRegister, showPassword, toggleShowPassword, loading, previousStep }) => (
    <div>
        <div className="relative my-4">
            <TextField
                id="password1"
                name="password1"
                label="password1"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
                value={formData.password1}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                className="mb-1"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" onClick={toggleShowPassword}>
                {showPassword ? <EyeClosed className="h-8 w-8 text-gray-400" /> : <Eye className="h-8 w-8 text-gray-400" />}
            </div>
        </div>

        <div className="relative my-4">
            <TextField
                id="password2"
                name="password2"
                label="password2"
                type={showPassword ? "text" : "password"}
                placeholder="Confirm Password"
                required
                value={formData.password2}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                className="mb-1"
            />
        </div>

        <TextField
            id="national_id"
            name="national_id"
            label="national id"
            type="text"
            placeholder="National ID"
            required
            value={formData.national_id}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            className="mb-1"
        />
        <TextField
            id="college"
            name="college"
            label="college"
            type="text"
            placeholder="College"
            required
            value={formData.college}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            className="mb-1"
        />
        <TextField
            id="grad_year"
            name="grad_year"
            label="grade year"
            type="text"
            placeholder="Graduation Year"
            required
            value={formData.grad_year}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            className="mb-1"
        />
        <TextField
            id="department"
            name="department"
            label="department"
            type="number"
            placeholder="Department"
            required
            value={formData.department}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            className="mb-1"
        />
        <div className="flex mt-3">
            <div className="w-full text-xl p-3">
                <label className="block mb-2">Upload Image</label>
                <input
                    id="image"
                    name="image"
                    label="image"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full"
                />
            </div>
            <div className="w-full p-3 text-xl">
                <label className="block mb-2">Upload CV</label>
                <input
                    id="cv"
                    name="cv"
                    label="cv"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="w-full"
                />
            </div>
        </div>
        <div className="flex justify-between space-x-4 mt-5">
            <button onClick={previousStep} className="py-3 px-5 text-xl bg-gray-500 text-white font-bold rounded-2xl">
                Back
            </button>
            <button
                onClick={handleRegister}
                disabled={loading}
                className="py-3 px-5 bg-blue-600 text-xl text-white font-bold rounded-2xl"
            >
                {loading ? "Registering..." : "Register"}
            </button>
        </div>
    </div>
);


export default function Register() {
    const [formData, setFormData] = useState({
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        country: "",
        city: "",
        address: "",
        national_id: "",
        college: "",
        grad_year: "",
        department: 1,
        password1: "",
        password2: "",
    });
    const [image, setImage] = useState(null);
    const [cv, setCv] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    }, []);

    const handleFileChange = useCallback((e) => {
        const { name, files } = e.target;
        if (name === "image") setImage(files[0]);
        if (name === "cv") setCv(files[0]);
    }, []);

    const handleRegister = async () => {
        setLoading(true);

        if (formData.password1 !== formData.password2) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Passwords do not match!",
            });
            setLoading(false);
            return;
        }

        const registerData = new FormData();
        for (const key in formData) {
            registerData.append(key, formData[key]);
        }
        if (image) registerData.append("image", image);
        if (cv) registerData.append("cv", cv);

        try {
            await axios.post("https://dashboard.cowdly.com/api/users/register/", registerData);
            Swal.fire({
                icon: "success",
                title: "Registration Successful",
                text: "Please log in to continue.",
            });
            window.location.href = "/dashboard";
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Registration failed",
                text: "An error occurred while registering. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    const toggleShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

    const nextStep = () => {
        setCurrentStep((prev) => prev + 1);
    };

    const previousStep = () => {
        setCurrentStep((prev) => prev - 1);
    };

    return (
        <div className="flex min-h-screen xl:overflow-y-hidden bg-gray-100 justify-between relative">
            <div className="absolute top-4 left-4 text-3xl font-bold text-gray-700">
                Cowdly
            </div>

            <div className="hidden md:flex lg:flex lg:w-2/3 justify-center items-center">
                <Image priority src={auth1} alt="Register illustration" className="w-[45vw] object-contain h-[90vh]" />
            </div>
            <div className="flex flex-col justify-center items-center xl:w-1/2 lg:w-1/2 md:w-1/2 w-fit  md:px-0 shadow-md py-2 shadow-gray-200 bg-white h-[100vh] min-h-screen  ">
                <div className="text-center">
                    <h2 className="xl:text-4xl lg:text-3xl font-semibold text-gray-700">
                        Create an Account! 🚀
                    </h2>
                    <p className="my-2 text-xl text-gray-600">
                        Join us and start the adventure!
                    </p>
                </div>
                <div className=" mx-5  md:px-0  py-2 w-4/5">
                    {currentStep === 1 && (
                        <FormStepOne
                            formData={formData}
                            handleInputChange={handleInputChange}
                            handleFileChange={handleFileChange}
                            nextStep={nextStep}
                        />
                    )}
                    {currentStep === 2 && (
                        <FormStepTwo
                            formData={formData}
                            handleInputChange={handleInputChange}
                            handleRegister={handleRegister}
                            showPassword={showPassword}
                            toggleShowPassword={toggleShowPassword}
                            loading={loading}
                            previousStep={previousStep}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
