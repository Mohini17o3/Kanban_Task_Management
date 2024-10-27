'use client';
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
import DeleteButton from "../../deleteButton";
import Navbar from "@/app/components/Navbar";
import { useDrag, useDrop } from "react-dnd";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from 'react-dnd-touch-backend';


// Defining task card type for dragging
const TaskCardType = {
  TASK: 'task',
};

function KanbanView() {
  const [tasks, setTasks] = useState([]);

// for touch events in phones

const [isTouchDevice, setIsTouchDevice] = useState(false);


  useEffect(() => {

// for touch events in phones
    const checkTouchDevice = ()=> {
      if (typeof window !== 'undefined') {  
        const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        setIsTouchDevice(isTouch);
      }
    }
  
  
    checkTouchDevice() ;

    const fetchTasks = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      try {
        const response = await fetch('https://kanban-task-management-zu9y.onrender.com/api/tasks', {
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
          alert("Please try to login again, session has expired!");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchTasks();
  }, []);

  async function handleClick(taskId) {
    console.log("Deleting task with ID:", taskId);

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      const response = await fetch('https://kanban-task-management-zu9y.onrender.com/api/delete', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: taskId }),
      });

      if (response.ok) {
        setTasks((prevTasks) => {
          return prevTasks.filter((task) => task.id !== taskId);
        });
      } else {
        console.log("Failed to delete task");
      }
    } catch (error) {
      console.error(error);
    }
  }

  const TaskCard = ({ task }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: TaskCardType.TASK,
      item: { id: task.id },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }));

    return (
      <div
        key={task.id}
        ref={drag}
        className={`m-2 p-2 border-2 overflow-hidden bg-gray-600 rounded-md ${isDragging ? 'opacity-50' : ''}`}
      >
        <div className="flex justify-between items-start md:h-full">
          <div className="font-semibold break-words mb-2">
            {task.title}
            <p className="break-words mb-6 text-customPink">{task.description}</p>
          </div>
          <DeleteButton onClick={() => handleClick(task.id)} />
        </div>
      </div>
    );
  };

  const renderTasks = (status, priority) => {
    return tasks
      .filter((task) => task.status === status && task.priority === priority)
      .map((task) => <TaskCard key={task.id} task={task} />);
  };

  function moveItem(taskId, newStatus, newPriority) {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus, priority: newPriority } : task
      )
    );

    // Call API to update the task status and priority
    updateTaskStatus(taskId, newStatus, newPriority);
  }

  async function updateTaskStatus(taskId, newStatus, newPriority) {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      const response = await fetch('https://kanban-task-management-zu9y.onrender.com/api/update', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: taskId, status: newStatus, priority: newPriority }),
      });

      if (!response.ok) {
        console.error("Failed to update the task", response.statusText);
      }
    } catch (error) {
      console.error('Error updating the task on the backend', error);
    }
  }

  const DragBoard = ({ statusColumn, priorityLevel, children }) => {
    const [{ isOver }, drop] = useDrop({
      accept: TaskCardType.TASK,
      drop: (draggedItem) => {
        if (draggedItem && draggedItem.id) {
          moveItem(draggedItem.id, statusColumn, priorityLevel); // Pass new status and priority
        }
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    });

    return (
      <div
        ref={drop}
        className={`border-2 ${isOver ? 'bg-customPink' : 'bg-transparent'} transition-colors duration-300`}
        style={{ minHeight: '200px' }} // Set minimum height for better visibility
      >
        {children}
      </div>
    );
  };

  return (
    <DndProvider  backend={isTouchDevice ? TouchBackend({ enableMouseEvents: true }) : HTML5Backend}>
      <Navbar />
      {tasks.length > 0 ? (
        <>
          <Drawer>
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
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="md:text-2xl text-customPink border-2 md:w-1/12">Progress</TableHead>
                <TableHead className="md:text-2xl text-customPink border-2 md:w-1/4">To-Do</TableHead>
                <TableHead className="md:text-2xl text-customPink border-2 md:w-1/4">In-progress</TableHead>
                <TableHead className="md:text-2xl text-customPink border-2 md:w-1/4">Completed</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              <TableRow className="hover:bg-transparent">
                <TableHead className="md:text-2xl font-bold text-customPink border-2">Low</TableHead>

                <TableCell className="mb-4">
                  <DragBoard statusColumn={"To Do"} priorityLevel={'Low'}>
                    {renderTasks('To Do', 'Low')}
                  </DragBoard>
                </TableCell>

                <TableCell className="mb-4">
                  <DragBoard statusColumn={"In Progress"} priorityLevel={'Low'}>
                    {renderTasks('In Progress', 'Low')}
                  </DragBoard>
                </TableCell>

                <TableCell className="mb-4">
                  <DragBoard statusColumn={"Completed"} priorityLevel={'Low'}>
                    {renderTasks('Completed', 'Low')}
                  </DragBoard>
                </TableCell>
              </TableRow>

              <TableRow className="hover:bg-transparent">
                <TableHead className="md:text-2xl font-bold text-customPink border-2">Medium</TableHead>

                <TableCell className="mb-4">
                  <DragBoard statusColumn={"To Do"} priorityLevel={'Medium'}>
                    {renderTasks('To Do', 'Medium')}
                  </DragBoard>
                </TableCell>

                <TableCell className="mb-4">
                  <DragBoard statusColumn={"In Progress"} priorityLevel={'Medium'}>
                    {renderTasks('In Progress', 'Medium')}
                  </DragBoard>
                </TableCell>

                <TableCell className="mb-4">
                  <DragBoard statusColumn={"Completed"} priorityLevel={'Medium'}>
                    {renderTasks('Completed', 'Medium')}
                  </DragBoard>
                </TableCell>
              </TableRow>

              <TableRow className="hover:bg-transparent">
                <TableHead className="md:text-2xl font-bold text-customPink border-2">High</TableHead>

                <TableCell className="mb-4">
                  <DragBoard statusColumn={"To Do"} priorityLevel={'High'}>
                    {renderTasks('To Do', 'High')}
                  </DragBoard>
                </TableCell>

                <TableCell className="mb-4">
                  <DragBoard statusColumn={"In Progress"} priorityLevel={'High'}>
                    {renderTasks('In Progress', 'High')}
                  </DragBoard>
                </TableCell>

                <TableCell className="mb-4">
                  <DragBoard statusColumn={"Completed"} priorityLevel={'High'}>
                    {renderTasks('Completed', 'High')}
                  </DragBoard>
                </TableCell>
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

           
        </div>         )}
    </DndProvider>
  );
}

export default KanbanView;
