'use client'

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";


function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();


    const handleSubmit = async (e) => {
        e.preventDefault();
        //reset the error value 
        setError('');

        const response = await fetch('https://kanban-task-management-zu9y.onrender.com/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });


        if (response.ok) {

            const data = await response.json();
            const token = data.token;

            localStorage.setItem('token', token);

            const tokenPayload = JSON.parse(atob(token.split('.')[1]));
            const expirationTime = tokenPayload.exp;

            const expirationTimeMs = expirationTime * 1000;

            localStorage.setItem('tokenExpiration', expirationTimeMs);

            router.push("/DiffPages/Landing");



        } else {
            const data = await response.json();
            setError(data.message || "Oops login failed");
        }



    }




    return (
        <>
            <Navbar />
            <div className="flex flex-col m-8 items-center justify-center font-bold text-6xl text-customPink"> Organise Your Tasks
            </div>
            <p className="flex items-center justify-center text-xl text-yellow-200">Glad you are here</p>
            <div className="grid md:grid-cols-2">
                <div className="flex items-center justify-center m-6">

                    <img className="rounded-full h-66 w-66 opacity-70 border-2" src="/girl_study4.jpg" alt="girl_study_image" />
                </div>

                <div className="flex flex-col  items-center justify-center m-6">

                    <form className="flex flex-col items-center justify-center mt-7 rounded p-4 border drop-shadow-lg" onSubmit={handleSubmit}>


                        <div className="flex flex-row m-4">
                            <label className="p-2 ">Email : </label>
                            <input
                                className="text-gray-500 bg-gray-300 focus:bg-white rounded mx-2 p-2 border"
                                type="email"
                                id="email"
                                placeholder="enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)} required />
                        </div>


                        <div className="flex flex-row m-4">
                            <label className="p-2 " >Password : </label>
                            <input className="text-gray-500 rounded bg-gray-300 focus:bg-white mx-2 p-2 border"
                                type="password"
                                id="password"
                                placeholder="create a strong password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} required />
                        </div>

                        <input
                            className="cursor-pointer px-4 py-2 m-2 bg-white text-black font-bold hover:bg-gray-600 hover:text-white rounded-md"
                            id="submit"
                            type="submit"
                            value="Login" />

                        {error && <p className="flex items-center justify-center m-12">{error}</p>}
                    </form>
                    <p className="mt-6" >Do not have an account?<Link className="mt-6 hover:underline" href="/SignUp"> Sign Up</Link></p>

                </div>

            </div>

        </>
    )




}

export default Login;