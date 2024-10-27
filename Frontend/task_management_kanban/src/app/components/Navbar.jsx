'use client'
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";



function Navbar() {


   const router = useRouter();
  const [authenticated , setauthenticated] = useState(null) ;


  useEffect ( () => { 
    const storedToken  = localStorage.getItem("token") ; 
    if(storedToken) {
      setauthenticated(true) ;
    } else {
      setauthenticated(false) ;   
    }
  } , [] ) ; 



  function handleClick () {

    localStorage.removeItem("token");
    setauthenticated(false);
    router.refresh();
  }
  

 return (
    
<nav className="sticky top-0 z-10 m-2 backdrop-filter space-x-4 backdrop-blur-lg bg-opacity-30 border-b border-gray-200">
<div className="max-w-5xl mx-auto px-2">
  <div className="flex items-center md:justify-between md:h-16">
    <ul className="flex md:space-x-20 text-customHeading">
      <li>
        <Link href="/" className="p-2 cursor-pointer hover:text-gray-200 text-customPink focus:border-b-2 focus:border-customPink">
            Home
        
        </Link>
      </li>
      <li>
        <Link href="/DiffPages/ListView" className="p-2 cursor-pointer hover:text-gray-200 text-customPink focus:border-b-2 focus:border-customPink">
            List View
          
        </Link>
      </li>
      <li>
        <Link href="/DiffPages/KanbanView" className="p-2 cursor-pointer hover:text-gray-200 text-customPink focus:border-b-2 focus:border-customPink">
            Kanban View
          
        </Link>
      </li>
      <div className="text-customHeading ml-auto">


{ 
 
  authenticated ?

<Link href="/"><button onClick={handleClick} className="bg-gray-600 hover:text-gray-700 hover:bg-white text-customPink p-2 ml-24 rounded "> Log Out </button>
 </Link> 

:   

<Link href="/Login">         
     <button onClick={handleClick} className="bg-gray-600 hover:text-gray-700 hover:bg-white text-customPink p-2 md:ml-24 rounded ">
          Sign In 
    </button></Link>  


}
      
           </div>  
    </ul>
  </div>
</div>
</nav>
);
    }

export default Navbar ; 