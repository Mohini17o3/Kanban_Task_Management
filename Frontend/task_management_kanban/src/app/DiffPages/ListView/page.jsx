'use client'
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Drawer } from "@/components/ui/drawer";
import { DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import Landing from "../Landing/page";
import { DialogTitle } from "@radix-ui/react-dialog";
import DeleteButton from  "../../deleteButton" ;
import Navbar from "@/app/components/Navbar";

function ListView() {

  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/tasks', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTasks(data);
        } else {
          alert ("Please try to login again , session has expired !")
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchTasks();
  }, []);


  async function handleClick (taskId) {
    console.log("Deleting task with ID:", taskId); // Log the task ID

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    try  {
    
      const response = await fetch ('http://localhost:5000/api/delete' , {
        method : 'DELETE', 
        headers : {
          'Authorization' : `Bearer ${token}` ,
          'Content-Type': 'application/json',
  
        } , 
        body : JSON.stringify({id:taskId})
      } 
   
    )

    if(response.ok) {
       setTasks((prevTasks)=> {
        return prevTasks.filter((task)=> task.id !== taskId);
      }) 
    } else {
      console.log("Failed to delete task");
      
    }

    } catch(error) {

      console.log(error);
       
    }

    

  }

  const renderTasks = (status , priority) => {
    return tasks
      .filter((task) => task.status === status && task.priority === priority)
      .map((task) => (

        <div key={task.id} className="m-2 p-2 border-2 overflow-hidden bg-gray-600 rounded-md ">
        
        <div className="flex justify-between items-start h-full">
        <div className="font-semibold break-words mb-2">
        {task.title}
        <p className="break-words mb-6 text-customPink"> {task.description} </p>
        </div>
        <DeleteButton onClick={() => handleClick(task.id)} />
        </div>


        </div>
      ));
  };

  return (
    <>
    <Navbar />
      {tasks.length > 0 ? (

        <><Drawer>
          <DrawerTrigger className="bg-gray-600 text-customPink p-2 rounded-md">
              Add Tasks 
          </DrawerTrigger>
          <DrawerContent>
          <DialogTitle>
            Task Creation form 
          </DialogTitle>

            <div className="mx-auto w-full max-w-sm"> 
          <Landing />
            </div>


          </DrawerContent>
        </Drawer> 

        <Table className="mt-6 mb-2 h-screen p-2">
          <TableHeader >
            <TableRow className = "hover:bg-transparent " >
              <TableHead className = "text-2xl text-customPink  border-2 w-1/12">Progress</TableHead>
              <TableHead className = "text-2xl text-customPink  border-2 w-1/4">To-Do</TableHead>
              <TableHead className = "text-2xl text-customPink  border-2 w-1/4">In-progress</TableHead>
              <TableHead className = "text-2xl text-customPink  border-2 w-1/4">Completed</TableHead>
            </TableRow>
          </TableHeader>

    
 
          <TableBody > 


            <TableRow className = "hover:bg-transparent">
            <TableHead className = "text-2xl font-bold text-customPink border-2"> Low </TableHead>
              <TableCell className = "mb-4">{renderTasks('To Do' , 'Low')}</TableCell>
              <TableCell className = "mb-4">{renderTasks('In Progress'  ,'Low')}</TableCell>
              <TableCell className = "mb-4">{renderTasks('Completed' , 'Low')}</TableCell>
          </TableRow>

            <TableRow className = "hover:bg-transparent">
            <TableHead className = "text-2xl font-bold text-customPink border-2"> Medium </TableHead>
              <TableCell className = "mb-4">{renderTasks('To Do' , 'Medium')}</TableCell>
              <TableCell className = "mb-4">{renderTasks('In Progress'  ,'Medium')}</TableCell>
              <TableCell className = "mb-4">{renderTasks('Completed' , 'Medium')}</TableCell>
            </TableRow>


            <TableRow className = "hover:bg-transparent">
              <TableHead className = "text-2xl font-bold text-customPink  border-2"> High </TableHead>
              <TableCell className = "mb-4">{renderTasks('To Do' , 'High')}</TableCell>
              <TableCell className = "mb-4">{renderTasks('In Progress'  ,'High')}</TableCell>
              <TableCell className = "mb-4">{renderTasks('Completed' , 'High')}</TableCell>
            </TableRow>


          </TableBody>
        </Table>
        </>
      ) : (
        <div  className="flex flex-col items-center gap-4 justify-center">
        <p>No tasks available</p>
        <Drawer>
          <DrawerTrigger className="bg-gray-500 text-customPink p-2 rounded-md">
             Add Tasks 
          </DrawerTrigger>
          <DrawerContent>
          <DialogTitle>
            Task Creation form 
          </DialogTitle>
            <div className="mx-auto w-full max-w-sm">
          <Landing />
            </div>
          </DrawerContent>
        </Drawer>

           
        </div>      )}
    </>
  );
}

export default ListView;
