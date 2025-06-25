const apiUrl = 'http://localhost:3000/todoList';

document.getElementById("form-task").addEventListener("submit", async function (e) {
    e.preventDefault();
    const form = new FormData(this);
    const data = Object.fromEntries(form.entries());
    data.is_active = true;
    
    try {
        await fetch(apiUrl, {
            method: 'POST',
            Headers: {'Content-Type':'aplication/json'},
            body: JSON.stringify(data)
        });
        this.reset();
        await showTasks();
    } catch (error) {
        console.error('Error al crear tarea')
    }
});

const getStatus = (status) => {
    switch (status){
        case "todo":
            return "Por hacer";
        case "in_prgress":
            return "En progreso";
        case "done":
            return "Comletada"
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
              <button onclick>Eliminar</button>
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

document.addEventListener("DOMContentLoaded", function () {
    showTasks();
});

