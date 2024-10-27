'use client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent} from "@/components/ui/card";
import { useState  , useEffect} from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger , DialogClose , DialogFooter } from "@/components/ui/dialog";
import { DialogHeader } from "@/components/ui/dialog";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import { usePathname } from "next/navigation";

const Landing = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    status: "To Do",
  });

  const [dialog , setDialog] = useState(false);
  const [error , setError] = useState("");
  const pathname = usePathname();
  
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token  = localStorage.getItem("token");

    try { 
    const response = await fetch('https://kanban-task-management-zu9y.onrender.com/api/tasks' , {
        method  : "POST" , 
        headers : {
          'Authorization' : `Bearer ${token}` ,
          'Content-Type' : 'application/json' ,
        } , 
        body : JSON.stringify(formData)
    } );

    if(response.ok) {

      setDialog(true);
        
    }

    else {
      const data = await response.json();
      setError(data.message);

    }

  } catch(err) {
    console.log(err) ;
  }
  };

  return (
    <>    
  {pathname === "/DiffPages/Landing" && <Navbar />}
  
    <h1 className="text-3xl mt-6 flex items-center justify-center">Create tasks here </h1>
    <Card className="max-w-md mt-8 mx-auto p-4">
     
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              type="text"
              placeholder="Task Title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="mb-4">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              type="text"
              placeholder="Task Description"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-4">
            <Label htmlFor="priority">Priority</Label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              className="w-full rounded-md border-gray-300"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="mb-4">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full rounded-md border-gray-300"
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <Button type="submit" className="w-full">
            Create Task
          </Button>
        </form>
      </CardContent>
    </Card> 

{error && <p className="flex justify-center items-center"> {error} </p>}

<Dialog  open = {dialog} onOpenChange={setDialog} modal = {true}>

          <DialogTrigger asChild>
            <Button className ="hidden">Open</Button> 
            </DialogTrigger>

            <DialogContent className="sm: max-w-md bg-black/50 text-white">

              <DialogHeader>
                <DialogTitle className="text-white">
                  Which View do you wish to see ?
                </DialogTitle>
                <DialogDescription>
              <Link href= "/DiffPages/ListView"> <Button variant="secondary" className="m-4">Task View</Button> </Link>   
              <Link href= "/DiffPages/KanbanView" >  <Button variant="secondary" className="m-4">Kanban View</Button> </Link> 
                </DialogDescription>
              </DialogHeader>

              <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
           
          </DialogClose>
        </DialogFooter>
            </DialogContent>

        </Dialog>
    </>
  );
};

export default Landing;
