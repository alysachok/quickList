import "@fontsource/roboto"
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  List,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography
} from "@mui/material"
import React, { RefObject, useEffect, useRef, useState } from "react"
import TodoItemComponent, { TodoData, TodoItem } from "./TodoItem"
import { downloadPdf } from "./utils/downloadPdf"

const styles = {
  appContaner: {
    backgroundImage: `url(${process.env.PUBLIC_URL}/background.jpg)`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    width: "100%",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    overflowY: "auto",
    overflowX: "hidden"
  },
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
  },
  selector: {
    color: "#6e6464",
    "& label.Mui-focused": {
      color: "#6e6464"
    },
    "& .MuiSelect-icon": {
      color: "#6e6464"
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "orange"
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "yellow"
    },

    "& .MuiInput-underline:after": {
      borderBottomColor: "#6e6464"
    }
  },
  button: {
    backgroundColor: "#6e6464",
    color: "white",
    "&:hover": {
      backgroundColor: "#8a8a8a"
    },

    "&:disabled": {
      backgroundColor: "#cececa",
      color: "#a8a5a2"
    }
  },
  deleteAllbutton: {
    backgroundColor: "#b8a898",
    color: "white",
    "&:hover": {
      backgroundColor: "#c9bdb2"
    },

    "&:disabled": {
      backgroundColor: "#cececa",
      color: "#a8a5a2"
    }
  },
  contentContaner: {
    width: "80%",
    maxWidth: 500,
    padding: 3,

    backgroundColor: "rgb(241,241,240, 0.85)"
  },
  footer: {
    width: "100%",
    padding: {
      xs: "1rem",
      sm: "1.5rem",
      md: "2rem"
    }
  }
}

const initialData: TodoData = {
  items: []
}

const App: React.FC = () => {
  const [data, setData] = useState<TodoData>(initialData)
  const [inputValue, setInputValue] = useState<string>("")
  const [title, setTitle] = useState<string>("")
  const [shareMethod, setShareMethod] = useState<string>("")
  const titleInputRef: RefObject<HTMLInputElement> =
    useRef<HTMLInputElement>(null)
  const todoInputRef: RefObject<HTMLInputElement> =
    useRef<HTMLInputElement>(null)

  useEffect(() => {
    const storedData = localStorage.getItem("todos")

    if (storedData) {
      const parsedData = JSON.parse(storedData)

      if (!parsedData.items) {
        parsedData.items = []
      }

      if (!parsedData.title) {
        parsedData.title = ""
      }

      setData(parsedData)
      setTitle(parsedData.title)
    }
  }, [])

  // CRUD operations
  const addTodo = () => {
    if (inputValue.trim() === "") return
    const newTodo: TodoItem = {
      id: Date.now(),
      text: inputValue.trim(),
      completed: false
    }

    const updatedData = {
      ...data,
      title,
      items: [...data.items, newTodo]
    }

    setData(updatedData)
    localStorage.setItem("todos", JSON.stringify(updatedData))
    setInputValue("")
  }

  const deleteTodo = (id: number) => {
    const updatedItems = data.items.filter((todo) => todo.id !== id)

    const updatedData = {
      ...data,
      items: updatedItems
    }

    setData(updatedData)
    localStorage.setItem("todos", JSON.stringify(updatedData))
  }

  const handleUpdate = (id: number, updatedTask: Partial<TodoItem>) => {
    // Map through the items array and update the item that matches the id
    const updatedItems = data.items.map((todo) =>
      todo.id === id ? { ...todo, ...updatedTask } : todo
    )

    const updatedData = {
      ...data,
      title,
      items: updatedItems
    }

    setData(updatedData)

    localStorage.setItem("todos", JSON.stringify(updatedData))
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedTitle = e.target.value

    const updatedData = {
      ...data,
      title: updatedTitle
    }

    setTitle(updatedTitle)

    localStorage.setItem("todos", JSON.stringify(updatedData))
  }

  const deleteAllTodos = () => {
    setData(initialData)
    setTitle("")
    localStorage.removeItem("todos")
  }

  // share logic
  const handleShareChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value

    setShareMethod(value)

    switch (value) {
      case "email":
        shareByEmail()
        break
      case "whatsapp":
        shareByWhatsApp()
        break
      case "telegram":
        shareByTelegram()
        break
      case "sms":
        shareBySms()
        break
      default:
        console.log("Unknown share method:", value)
    }
  }

  const shareByEmail = () => {
    const subject = "My To-Do List"
    let body = title
      ? `${title}\n\n${data.items.map((todo) => `- ${todo.text}`).join("\n")}`
      : data.items.map((todo) => `- ${todo.text}`).join("\n")

    // URL encode the line breaks
    body = encodeURIComponent(body).replace(/%0A/g, "%0D%0A")

    const mailtoLink = `mailto:?subject=${encodeURIComponent(
      subject
    )}&body=${body}`

    window.location.href = mailtoLink
  }

  const message = title
    ? `${title}\n\n${data.items.map((todo) => `- ${todo.text}`).join("\n")}`
    : data.items.map((todo) => `- ${todo.text}`).join("\n")

  const shareByWhatsApp = () => {
    const waLink = `https://wa.me/?text=${encodeURIComponent(message)}`

    window.open(waLink, "_blank")
  }

  const shareByTelegram = () => {
    const tgLink = `https://t.me/share/url?url=${encodeURIComponent(
      "Shared To-Do List"
    )}&text=${encodeURIComponent(message)}`

    window.open(tgLink, "_blank")
  }

  const shareBySms = () => {
    const encodedMessage = encodeURIComponent(message)
    const smsLink = `sms:&body=${encodedMessage}`

    window.location.href = smsLink
  }

  // keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim() !== "") addTodo()
  }

  const handleTitleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      todoInputRef.current?.focus()
    }
  }

  return (
    <Box sx={styles.appContaner}>
      <Typography
        gutterBottom
        sx={{
          fontSize: { xs: "3rem", sm: "5rem", md: "8rem" },
          alignContent: "center",
          color: "#617168",
          fontFamily: '"Roboto", sans-serif',
          paddingTop: { xs: "2rem", ms: "3rem", md: "4rem" }
        }}
        variant="h1"
        width="80%"
      >
        Quick List
      </Typography>
      <Paper elevation={3} sx={styles.contentContaner}>
        <List id="todo-list">
          <TextField
            autoFocus
            fullWidth
            inputRef={titleInputRef}
            label="Title"
            margin="normal"
            onChange={handleTitleChange}
            onKeyDown={handleTitleKeyDown}
            placeholder="My list title"
            sx={styles.input}
            value={title}
            variant="standard"
          />
          {data.items.map((todo) => (
            <TodoItemComponent
              key={todo.id}
              onDelete={deleteTodo}
              onUpdate={handleUpdate}
              todo={todo}
            />
          ))}
        </List>

        <TextField
          fullWidth
          inputRef={todoInputRef}
          label="Add a new todo..."
          margin="normal"
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          sx={styles.input}
          value={inputValue}
          variant="standard"
        />

        <Stack
          direction="column"
          paddingTop={{ xs: "1rem", ms: "1rem", md: "2rem" }}
          spacing={2}
        >
          <Button
            fullWidth
            onClick={addTodo}
            sx={styles.button}
            variant="contained"
          >
            Add
          </Button>
          <Button
            disabled={data.items.length === 0}
            fullWidth
            onClick={downloadPdf}
            sx={styles.button}
            variant="contained"
          >
            Download as PDF
          </Button>
          <Button
            disabled={data.items.length === 0}
            fullWidth
            onClick={deleteAllTodos}
            sx={styles.deleteAllbutton}
            variant="contained"
          >
            Delete list
          </Button>

          <FormControl fullWidth sx={styles.selector} variant="standard">
            <InputLabel id="share-method-label">Select share method</InputLabel>
            <Select
              labelId="share-method-label"
              onChange={handleShareChange}
              value={shareMethod}
            >
              {shareOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Paper>
      <Box mt={3} sx={styles.footer}>
        <Typography align="center" color="#5b4a44" fontSize="calc(7px + 1vmin)">
          © {new Date().getFullYear()} Aleksandra. All Rights Reserved.
        </Typography>
      </Box>
    </Box>
  )
}

export default App

const shareOptions = [
  {
    value: "email",
    label: "Email"
  },
  {
    value: "whatsapp",
    label: "WhatsApp"
  },
  {
    value: "telegram",
    label: "Telegram"
  },
  {
    value: "sms",
    label: "iMessage"
  }
]
