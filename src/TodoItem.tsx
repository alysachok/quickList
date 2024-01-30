import "@fontsource/roboto"
import DeleteIcon from "@mui/icons-material/Delete"
import {
  Checkbox,
  IconButton,
  ListItem,
  ListItemText,
  TextField
} from "@mui/material"
import React, { useState } from "react"

export interface TodoItem {
  id: number
  text: string
  completed: boolean
}

export interface TodoData {
  title?: string
  items: TodoItem[]
}

interface TodoItemComponentProps {
  todo: TodoItem
  onUpdate: (id: number, updatedTask: Partial<TodoItem>) => void
  onDelete: (id: number) => void
}

const styles = {
  input: {
    "& label.Mui-focused": {
      color: "#6e6464"
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#6e6464"
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "grey"
      },
      "&:hover fieldset": {
        borderColor: "black"
      },
      "&.Mui-focused fieldset": {
        borderColor: "#6e6464"
      }
    }
  }
}

const TodoItemComponent: React.FC<TodoItemComponentProps> = ({
  todo,
  onUpdate,
  onDelete
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedText, setEditedText] = useState(todo.text)

  const handleEdit = () => setIsEditing(true)
  const handleCancelEdit = () => setIsEditing(false)

  const handleSave = () => {
    if (editedText.trim() === "") {
      onDelete(todo.id)
    } else {
      onUpdate(todo.id, { text: editedText })
    }

    setIsEditing(false)
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEditedText(e.target.value)

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSave()
    else if (e.key === "Escape") handleCancelEdit()
  }

  return (
    <ListItem>
      <Checkbox
        checked={todo.completed}
        onChange={() => onUpdate(todo.id, { completed: !todo.completed })}
      />
      {isEditing ? (
        <TextField
          autoFocus
          fullWidth
          onBlur={handleSave}
          onChange={handleTextChange}
          onKeyDown={handleKeyPress}
          sx={styles.input}
          value={editedText}
          variant="standard"
        />
      ) : (
        <ListItemText onClick={handleEdit} primary={todo.text} />
      )}
      <IconButton onClick={() => onDelete(todo.id)}>
        <DeleteIcon />
      </IconButton>
    </ListItem>
  )
}

export default TodoItemComponent
