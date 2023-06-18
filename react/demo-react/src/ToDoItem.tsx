import {useCallback, useState } from "react"
import {Item} from "./AddItemInput"
import AddItemInput from "./AddItemInput";

export default function ToDoItem({id,label,isCompleted}:Item){

    const handleDelete = useCallback((e:any) => {
       e.target.parentElement.remove();
    },[])

    return (
        <div>
            <span>{label}</span>
            {isCompleted ? <button>Completed</button> : 
                <button>Not Completed</button>}
            <button onClick={handleComplete}>Not Complete</button>
            <button onClick={handleDelete}>Remove</button>
        </div>

    )
}