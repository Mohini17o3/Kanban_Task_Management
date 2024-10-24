'use client'

import Link from "next/link";
import {useState} from "react" ; 
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";



function SignUp () {
    const router = useRouter();
    const[name , setName] = useState('') ;
    const[email , setEmail] = useState('') ;
    const[password , setPassword] = useState('') ;
    const[error , setError] = useState('') ;


      const handleSubmit = async (e)=> {
        e.preventDefault(); 

        // reset the error value
        setError(''); 
        console.log("submit triggered");


       try{ 
        const response = await fetch('http://localhost:5000/api/signup' ,  {
            method : 'POST' , 
            headers : {
                'Content-Type'  : 'application/json' , 
            } , 
            body : JSON.stringify({name , email , password})
        });

        if(response.ok) {
                router.push('/Login');
                } 
        
        else{
            const data = await response.json().catch(() => null ) ; 
            setError(data?.message || "Couldn't Sign Up");
        }

    } catch(error) {
        setError("Unxpected error happened");
    }


        } 
       
          

    return (
    <>  
    <Navbar />
     <div className="flex flex-col m-8 items-center justify-center font-bold md:text-6xl text-4xl text-customHeading"> Organise Your Tasks
     
      </div>  
     
    <div className="grid m-4 md:grid-cols-2">
        <div className="flex items-center justify-center md:m-6">
            Video to be added 
        </div>  

        <div className="flex flex-col  items-center justify-center m-6">
        <form className="flex flex-col bg-customBrown2 items-center justify-center mt-7 rounded p-4 border drop-shadow-lg" onSubmit={handleSubmit}>

                <div className="flex flex-row m-4">
                <label className="p-2 text-xl " htmlFor="name">Name  </label>
                <input className="text-gray-600 bg-gray-300 focus:bg-white rounded mx-2 p-2  border focus:border-purple-500 focus:outline-none" type="text" id= "name" placeholder="enter your name" value={name} onChange={(e)=>setName(e.target.value)} required />
                </div>

                <div className="flex flex-row m-4">
                <label className="p-2 text-xl " htmlFor="email">Email  </label>
                <input className="text-gray-600 bg-gray-300 focus:bg-white  rounded mx-2 p-2 border focus:border-purple-500  focus:outline-none" type="email" id= "email" placeholder="enter your email"value={email} onChange={(e)=>setEmail(e.target.value)} required />
                </div>

                <div className="flex flex-row m-4">
                <label className="p-2 text-xl" htmlFor="password">Password  </label>
                <input className="text-gray-600 bg-gray-300 focus:bg-white  rounded mx-2 p-2 border focus:border-purple-500  focus:outline-none" type="password" id= "password" placeholder="create a strong password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
                </div>
           
             <input className="cursor-pointer px-4 py-2 m-2 bg-white text-black hover:bg-gray-600 hover:text-white rounded-md"  type="submit" value="Sign Up" />
             
             {error && <p className="flex items-center justify-center m-8">{error}</p>}
            </form>

         <p className="m-4">Already a user ? 
         <Link className="cursor-pointer hover:underline" href={"/Login"}>
            Login here
          </Link>
          </p>  

        </div>
     
        </div>


</>

    ) ;


}

export default SignUp ;