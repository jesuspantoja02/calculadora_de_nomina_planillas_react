# UNIVERSIDAD TECNOLÓGICA DEL PERÚ (UTP)

**FACULTAD DE INGENIERÍA DE SISTEMAS Y ELECTRÓNICA**

**CURSO: JAVASCRIPT AVANZADO / REDES Y COMUNICACIÓN DE DATOS II**
**Compilado de Semanas 11 a 14 (Unidad 3: React)**

Este documento consolida la totalidad de los contenidos, explicaciones, ejemplos de código, pasos de implementación y prácticas correspondientes a las Semanas 11, 12, 13 y 14 del curso de JavaScript Avanzado. Todo el material ha sido estructurado de manera organizada y sin omitir detalles.

---

## Índice

- [Semana 11: Introducción a React](#semana-11-introducción-a-react)
- [Semana 12: Elementos de React (Navegación, Componentes, Formularios)](#semana-12-elementos-de-react-navegación-componentes-formularios)
- [Semana 13: Hooks en React (State, Context, Ref, Resource)](#semana-13-hooks-en-react-state-context-ref-resource)
- [Semana 14: Servicios en React (Fetch API, Axios, Alova) y Consumo REST](#semana-14-servicios-en-react-fetch-api-axios-alova-y-consumo-rest)

---

## SEMANA 11: Introducción a React

### 1. Presentación y Contexto General

- **Sistema de Evaluación:** PF = (20%)PC1 + (20%)PC2 + (20%)PC3 + (40%)EXF
- **Preguntas de Inicio:** ¿Cómo les fue en la PC2?, ¿Cómo te vas a preparar para la PC3?

### 2. Utilidad y Logro de Aprendizaje

- **Logro específico de aprendizaje:** Al finalizar la unidad el participante aplica los frameworks NodeJS, React, Vue.js, Next JS y Express en la generación de soluciones web.
- **Saberes previos:** ¿Qué función realiza la librería React?, ¿Cómo podemos utilizar el Lenguaje JSX y TSX?, ¿Qué tipo de aplicación web se realiza con la librería React?

### 3. Introducción a React

React es una biblioteca de JavaScript de código abierto desarrollada por Facebook para construir interfaces de usuario (UI). Se basa en componentes reutilizables que permiten crear aplicaciones web dinámicas y eficientes.

- **Concepto:** Facilita el desarrollo mediante componentes que gestionan su propio estado y renderizan partes de la UI. Utiliza un DOM virtual para optimizar el rendimiento, actualizando únicamente las partes del DOM real que han cambiado.

- **Instalación:** Requiere Node.js y npm. Se instala y configura rápidamente mediante la herramienta create-react-app:

  ```bash
  npx create-react-app mi-app
  cd mi-app
  npm start
  ```

  Este comando crea una nueva carpeta con una estructura preconfigurada e inicia un servidor local en http://localhost:3000.

- **Lenguaje JSX (JavaScript XML):** Es una extensión de la sintaxis de JavaScript que permite escribir código similar a HTML dentro de JavaScript. JSX es compilado a React.createElement.

  ```jsx
  const element = <h1>Hello, world!</h1>;
  ```

- **Lenguaje TSX:** Es la versión de JSX utilizada con TypeScript, un superconjunto de JavaScript que añade tipos estáticos para evitar errores y mejorar la productividad.

  ```tsx
  import React from 'react';

  const App: React.FC = () => {
    return <h1>Hello, world!</h1>;
  }

  export default App;
  ```

- **Instalación de Bootstrap:** Bootstrap es un popular framework CSS para diseños rápidos y responsivos.

  ```bash
  npm install bootstrap
  ```

  ```js
  // Importar en index.js o index.tsx:
  import 'bootstrap/dist/css/bootstrap.min.css';
  ```

### 4. Transformación: Ejemplo Práctico (Todo List con React y Bootstrap)

Creación de una aplicación sencilla de lista de tareas utilizando React y Bootstrap.

**Paso 1: Crear el proyecto y Bootstrap**

```bash
npx create-react-app todo-app
cd todo-app
npm install bootstrap
```

**Paso 2: Código completo de `src/App.js`**

```jsx
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Button, InputGroup, FormControl, ListGroup } from 'react-bootstrap';

function App() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState('');

  const handleAddTask = () => {
    if (task) {
      setTasks([...tasks, task]);
      setTask('');
    }
  };

  return (
    <Container className="mt-4">
      <h1 className="text-center">Todo List</h1>
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Add a new task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <Button variant="primary" onClick={handleAddTask}>Add Task</Button>
      </InputGroup>
      <ListGroup>
        {tasks.map((t, index) => (
          <ListGroup.Item key={index}>{t}</ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
}

export default App;
```

**Explicación del Código:**

1. **Estado de la aplicación:** `tasks` guarda la lista de tareas y `task` almacena el valor actual del input.
2. **Función `handleAddTask`:** Añade la tarea al array si no está vacía y limpia el input.
3. **Renderización:** Se emplean componentes de react-bootstrap (Container, InputGroup, FormControl, Button, ListGroup).

### 5. Práctica y Cierre

- **Práctica:** Resolver preguntas del docente sobre la función de React, uso de JSX/TSX y tipos de aplicaciones web.
- **Cierre:** ¡Gracias!

---

## SEMANA 12: Elementos de React (Navegación, Componentes, Formularios)

### 1. Saberes Previos e Inicio

- **Preguntas de inicio:** ¿Qué elementos de navegación de React conoce?, ¿Cuáles son los componentes de React que puede indicar?, ¿Qué tipo de aplicación web se puede realizar con ReactJS?

### 2. Contenido Temático

#### 2.1. Navegación

Se maneja comúnmente usando react-router-dom para crear aplicaciones de una sola página (SPA).

```bash
npm install react-router-dom
```

```jsx
// Configuración del Router en App.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './Home';
import About from './About';
import NotFound from './NotFound';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}

export default App;
```

#### 2.2. Componentes

Bloques de construcción reutilizables. Pueden ser funcionales o de clase.

```jsx
// Componente funcional
import React from 'react';

function FunctionalComponent() {
  return <h1>Hello from a functional component!</h1>;
}

export default FunctionalComponent;
```

```jsx
// Componente de clase
import React, { Component } from 'react';

class ClassComponent extends Component {
  render() {
    return <h1>Hello from a class component!</h1>;
  }
}

export default ClassComponent;
```

**Props y Estado:**

- **Props:** Datos pasados de padre a hijo (ej. `function Greeting(props) { return <h1>Hello, {props.name}!</h1>; }`).
- **Estado (State):** Datos internos gestionados con el hook `useState`.

#### 2.3. Formularios

Manejan el estado a través de componentes y controladores de eventos (formularios controlados).

```jsx
import React, { useState } from 'react';

function Form() {
  const [inputValue, setInputValue] = useState('');

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    alert('A name was submitted: ' + inputValue);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input type="text" value={inputValue} onChange={handleChange} />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}

export default Form;
```

### 3. Transformación: Aplicación de Tareas con React (Task App)

Ejemplo integral que incluye navegación, componentes y formularios.

**Estructura del proyecto:**

```text
src/
├── components/
│   ├── Header.js
│   ├── Home.js
│   ├── About.js
│   ├── TaskList.js
│   └── AddTask.js
├── App.js
└── index.js
```

**1. `Header.js` (Navegación)**

```jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/tasks">Tasks</Link>
    </nav>
  );
}

export default Header;
```

**2. `Home.js`**

```jsx
import React from 'react';

function Home() {
  return <div><h1>Welcome to the Task App</h1></div>;
}

export default Home;
```

**3. `About.js`**

```jsx
import React from 'react';

function About() {
  return <div><h1>About This App</h1><p>Simple task management app built with React.</p></div>;
}

export default About;
```

**4. `TaskList.js`**

```jsx
import React, { useState } from 'react';

function TaskList() {
  const [tasks] = useState([
    { id: 1, text: 'Learn React' },
    { id: 2, text: 'Build a React app' },
  ]);

  return (
    <div>
      <h1>Task List</h1>
      <ul>{tasks.map(task => <li key={task.id}>{task.text}</li>)}</ul>
    </div>
  );
}

export default TaskList;
```

**5. `AddTask.js`**

```jsx
import React, { useState } from 'react';

function AddTask() {
  const [task, setTask] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Task added: ' + task);
    setTask('');
  };

  return (
    <div>
      <h1>Add a New Task</h1>
      <form onSubmit={handleSubmit}>
        <label>Task: <input type="text" value={task} onChange={(e) => setTask(e.target.value)} /></label>
        <button type="submit">Add Task</button>
      </form>
    </div>
  );
}

export default AddTask;
```

### 4. Práctica y Cierre

- **Práctica:** Responder preguntas sobre navegación, componentes y tipos de aplicaciones web.
- **Cierre:** ¡Gracias!

---

## SEMANA 13: Hooks en React (State, Context, Ref, Resource)

### 1. Saberes Previos e Inicio

- **Preguntas de inicio:** ¿Qué función realiza hooks?, ¿Qué característica tienen los diferentes tipos de hooks en react?, ¿Qué tipo de aplicación web se realiza con hooks?

### 2. Contenido Temático: Hooks en React

Los hooks son funciones especiales introducidas en React 16.8 que permiten usar estado y otras características de React en componentes funcionales sin necesidad de convertirlos en clases.

#### 2.1. State Hooks (`useState`)

Permite manejar el estado local en componentes funcionales.

```jsx
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

#### 2.2. Context Hooks (`useContext`)

Facilita el acceso a contextos globales creados con React.createContext.

```jsx
import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext('light');

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

#### 2.3. Ref Hooks (`useRef`)

Permite acceder directamente a elementos del DOM o mantener referencias mutables sin causar re-renderizaciones.

```jsx
import React, { useRef } from 'react';

function FocusInput() {
  const inputRef = useRef(null);

  return (
    <div>
      <input ref={inputRef} type="text" />
      <button onClick={() => inputRef.current.focus()}>Focus the input</button>
    </div>
  );
}
```

#### 2.4. Resource / Effect Hooks (`useEffect`)

Maneja efectos secundarios, operaciones asíncronas y suscripciones.

```jsx
import React, { useEffect, useState } from 'react';

function DataFetching() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('https://api.example.com/data')
      .then(res => res.json())
      .then(data => setData(data));
  }, []);

  return <div>{JSON.stringify(data)}</div>;
}
```

### 3. Transformación: Aplicación Integral con Varios Hooks

Ejemplo completo combinando `useState`, `useContext`, `useRef` y `useEffect`.

```jsx
import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import './App.css';

const ThemeContext = createContext('light');

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}

function ThemedComponent() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div style={{ background: theme === 'light' ? '#fff' : '#333', color: theme === 'light' ? '#000' : '#fff', padding: '20px' }}>
      <p>Current theme is {theme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ThemedComponent />
      <Counter />
    </ThemeProvider>
  );
}

export default App;
```

### 4. Práctica y Cierre

- **Práctica:** Responder indicaciones del docente sobre el funcionamiento y características de los hooks.
- **Cierre:** ¡Gracias!

---

## SEMANA 14: Servicios en React (Fetch API, Axios, Alova) y Consumo REST

### 1. Saberes Previos e Inicio

- **Preguntas de inicio:** ¿Qué tipo de servicio es fetch en react?, ¿Qué tipo de servicio es alova en react?, ¿Qué tipo de servicio es rest en react para la aplicación web?

### 2. Contenido Temático: Servicios y Consumo REST

#### 2.1. Fetch API

Interfaz nativa de JavaScript para realizar solicitudes HTTP. Es ampliamente compatible y no requiere instalación adicional.

```jsx
useEffect(() => {
  fetch('https://api.example.com/data')
    .then(response => response.json())
    .then(data => setData(data))
    .catch(error => console.error(error));
}, []);
```

#### 2.2. Axios

Biblioteca popular basada en promesas que simplifica las solicitudes HTTP.

```bash
npm install axios
```

```jsx
import axios from 'axios';

useEffect(() => {
  axios.get('https://api.example.com/data')
    .then(response => setData(response.data))
    .catch(error => console.error(error));
}, []);
```

#### 2.3. Alova

Biblioteca moderna y ligera para manejar solicitudes HTTP en React. Utiliza fetch internamente pero ofrece una interfaz más sencilla.

```bash
npm install alova
```

### 3. Transformación: Aplicación React Consumiendo un Servicio REST (Axios)

Ejemplo práctico mostrando una lista de usuarios de una API pública (JSONPlaceholder).

```jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/users');
        setUsers(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="App">
      <h1>User List</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <h2>{user.name}</h2>
            <p>Email: {user.email}</p>
            <p>Phone: {user.phone}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
```

### 4. Práctica y Cierre

- **Práctica:** Ejercicios guiados por el docente sobre Fetch, Axios y servicios REST.
- **Cierre:** ¡Gracias!
