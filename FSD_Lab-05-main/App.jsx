import React, { useEffect, useState } from 'react'

function useLocalStorage(key, initial) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? JSON.parse(raw) : initial
    } catch {
      return initial
    }
  })
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state))
    } catch {}
  }, [key, state])
  return [state, setState]
}

export default function App() {
  const [tasks, setTasks] = useLocalStorage('tasks', [])
  const [text, setText] = useState('')

  function addTask(e) {
    e.preventDefault()
    const t = text.trim()
    if (!t) return
    setTasks([{ id: Date.now(), text: t, done: false }, ...tasks])
    setText('')
  }

  function toggle(id) {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  }

  function remove(id) {
    setTasks(tasks.filter((t) => t.id !== id))
  }

  return (
    <div className="app">
      <header>
        <h1>Tasks</h1>
      </header>
      <form onSubmit={addTask} className="input-row">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a task..."
          aria-label="New task"
        />
        <button type="submit">Add</button>
      </form>

      <ul className="task-list">
        {tasks.length === 0 && <li className="empty">No tasks yet</li>}
        {tasks.map((t) => (
          <li key={t.id} className={t.done ? 'done' : ''}>
            <label>
              <input type="checkbox" checked={t.done} onChange={() => toggle(t.id)} />
              <span className="text">{t.text}</span>
            </label>
            <button className="del" onClick={() => remove(t.id)} aria-label="Delete task">×</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
