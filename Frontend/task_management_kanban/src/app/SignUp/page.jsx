'use client'

import Link from "next/link";
import {useState} from "react" ; 
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Video from "../components/Video";
import { Github } from "lucide-react";
import { Mail } from "lucide-react";



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
        const response = await fetch('https://kanban-task-management-zu9y.onrender.com/api/signup' ,  {
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
     <div className="flex flex-col mt-8 mb-20 items-center justify-center font-bold md:text-6xl text-4xl text-customPink">  
     <span className="text-customPink3" style={{ WebkitTextStroke: '1px #FFFFFF' }}>
    Organise Your Tasks

  </span>
  <p className="text-xl flex justify-center mt-2">With  Kanban Board</p>
      </div>  
     
    <div className="grid m-4 md:grid-cols-2">
        <div className="flex items-center justify-center md:m-6">

<img  className="rounded-full h-66 w-66 opacity-70 border-2"  src={`${process.env.PUBLIC_URL}/Girl_study4.jpg`} alt="girl_study_image"/>
        
        </div>  

        <div className="flex flex-col  items-center justify-center m-6">
        <form className="flex flex-col items-center justify-center mt-7 rounded p-4 border drop-shadow-lg" onSubmit={handleSubmit}>

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
           
             <input className="cursor-pointer px-4 py-2 m-2 bg-gray-600 hover:text-gray-700 hover:bg-white text-customPink rounded-md"  type="submit" value="Sign Up" /> 
             
             {error && <p className="flex items-center justify-center m-8">{error}</p>}
            </form>

         <p className="m-4">Already a user ? 
         <Link className="cursor-pointer hover:underline ml-1" href={"/Login"}>
            Login here
          </Link>
          </p>  

        </div>
     
        </div>

        <section className="bg-customPink3 opacity-70 text-white text-4xl flex items-center justify-center mb-8 py-20">    
         A sneek peek 
         </section>

        <section className="py-12 flex items-center justify-center">
        <div className="w-full max-w-2xl h-96">
        <Video/>
        </div>
        
        </section>

<footer className="bg-customBrown2 text-white py-2 px-2 ">
            <div className="container mx-auto flex flex-col md:flex-row items-center justify-between ">
        
                <div className="mb-4 ml-6 md:mb-0 bg-customBrown2 rounded-full border-2 hover:bg-customBrown3">
                    <a href="https://github.com/Mohini17o3" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 text-lg">
                       <Github className="h-12 w-12" />
                    </a>
                </div>

                <div className="mb-4 ml-6 md:mb-0 bg-customBrown2 rounded-full border-2 hover:bg-customBrown3">                    <a href="mailto:upretimohini@gmail.com" className="hover:text-purple-400 text-lg">
                    <Mail className="h-12 w-12"/>
                    </a>
                </div>
            </div>
        </footer>

</>

    ) ;


}

export default SignUp ;