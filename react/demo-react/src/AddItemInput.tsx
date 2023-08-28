import { useState } from "react"

export type Item = {
    id: Number,
    label: String,
    isCompleted: Boolean,
}

export default function AddItemInput() {
    const [input, setInput] = useState<String>("");
    const [list, setList] = useState<Array<Item>>([]);
    
    let cbChangeCompletion = (id: Number) => {
        setList(list => {
            let newList = [...]
        } )

    }

    const handleInput = (e:any) => {
        setInput(e.target.value);
    };


    return (
        <div>
            <input type="text" defaultValue={input} onBlur={handleInput} name="item" />
            <button>Add item</button>
            {list.map((obj:Item)=>
            <ToDoItem 
                id={obj.id} 
                label={object.label} 
                isCompleted={object.isComplete}
                changeCompletion={cbChangeCompletion}
                removeItem={cbRemoveItem}
             />)}
        </div>
    );
};