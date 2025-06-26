const apiUrl = 'http://localhost:3000/todoList';

document.getElementById("form-task").addEventListener("submit", async function (e) {
    e.preventDefault();
    const form = new FormData(this);
    const data = Object.fromEntries(form.entries());

    try {
        await fetch(apiUrl, {
            method: 'POST',
            Headers: {'Content-Type':'aplication/json'},
            body: JSON.stringify(data)
        });
        this.reset();
        await showTasks();
        alert("tarea creada exitosamente")
    } catch (error) {
        console.error('Error al crear tarea')
    }
});

const getStatus = (status) => {
    switch (status){
        case "todo":
            return "Por hacer";
        case "in_progress":
            return "En progreso";
        case "done":
            return "Completada"
        default:
            return "Desconocido"
    }
}

async function showTasks() {
    try {
        const response = await fetch(`${apiUrl}?is_active=true`);
        const tasks = await response.json();
        const tbody = document.querySelector("#table-tasks tbody");
        tbody.innerHTML = "";

        tasks.forEach(task => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
            <td>${task.name}</td>
            <td>${getStatus(task.status)}</td>
            <td>${task.description}</td>
            <td>
              <button onclick="updateTask(${task.id}, this)">Editar</button>
              <button onclick="deleteLogicTask(${task.id}, this)">Eliminar</button>
            </td>
            `;
            tbody.appendChild(fila);
        });
    } catch (error) {
        console.error("error al cargar la  tarea", error);
    }
}

async function updateTask(id, boton) {
    const fila = boton.closest("tr");
    const [tdname, tdstatus,tddescription] = fila.children;

    const name = prompt("Editar nombre:", tdname.textContent);
    const status = prompt("Editar estado:", tdstatus.textContent);
    const description = prompt("Editar nombre:", tddescription.textContent);
    
    if (!name || !status || !description){
        alert("Todos los campos son requeridos");
        return;
    }

    const editedTask = {name, status, description, is_active:true};

    try {
        await fetch(`${apiUrl}/${id}`, {
            method: "PUT",
            haders: {"Content-Type": "application/json"},
            body: JSON.stringify(editedTask)
        });
        await showTasks();
    } catch (error) {
        console.error("Error al editar",error);
    }
}
async function deleteLogicTask(id, boton) {
    const confirmar = confirm("¿Estás seguro de eliminar esta tarea?");
    if (!confirmar) return;

    const fila = boton.closest("tr");
    const [tdname, tdstatus,tddescription] = fila.children;

    const name = tdname.textContent;
    const status = tdstatus.textContent;
    const description = tddescription.textContent;
    
    const deltedTask = {name, status, description, is_active:false};

    try {
        await fetch(`${apiUrl}/${id}`, {
            method: "PATCH",
            haders: {"Content-Type": "application/json"},
            body: JSON.stringify(deltedTask)
        });
        await showTasks();
        alert("Tarea eliminada")
    } catch (error) {
        console.error("Error al ELIMINAR",error);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    showTasks();
});

async function showDeletedTasks() {
    try {
        const response = await fetch(`${apiUrl}?is_active=false`);
        const tasks = await response.json();
        const tbody = document.querySelector("#table-tasks tbody");
        tbody.innerHTML = "";

        tasks.forEach(task => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
            <td>${task.name}</td>
            <td>${task.status}</td>
            <td>${task.description}</td>
            <td>
              <button onclick="">Recuperar</button>
              <button onclick="deleteTask(${task.id})">Eliminar</button>
            </td>
            `;
            tbody.appendChild(fila);
        });
    } catch (error) {
        console.error("error al cargar la  tarea", error);
    }
};

async function deleteTask(id) {
    const confirmar = confirm("¿Estás seguro de eliminar este usuario?");
    if (!confirmar) return;

    try {
    await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
    await showDeletedTasks();
    alert("tarea elimiada")
    preventDefault()
    } catch (err) {
    console.error("Error al eliminar usuario:", err);
    }
}

async function recoverTask(id, boton) {
    const confirmar = confirm("¿Estás seguro de recuperar esta tarea?");
    if (!confirmar) return;

    const fila = boton.closest("tr");
    const [tdname, tdstatus,tddescription] = fila.children;

    const name = tdname.textContent;
    const status = tdstatus.textContent;
    const description = tddescription.textContent;
    
    const deltedTask = {name, status, description, is_active:true};

    try {
        await fetch(`${apiUrl}/${id}`, {
            method: "PATCH",
            haders: {"Content-Type": "application/json"},
            body: JSON.stringify(deltedTask)
        });
        await showTasks();
        alert("Tarea recuperada")
    } catch (error) {
        console.error("Error al recuperar tarea",error);
    }
}