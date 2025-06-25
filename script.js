const apiUrl = 'http//localhost:3000/todoList';

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


document.getElementById("form-task").addEventListener("submit", async function (e) {
    e.preventDefault();
    const form = new FormData(this);
    const data = Object.fromEntries(form.entries());
    data.is_active = true;

    try {
        await fletch(apiUrl, {
            method: 'POST',
            Headers: {'Content-Type':'aplication/json'},
            body: JSON.stringify(data)
        });
        this.reset();
        await getStatus();
    } catch (error) {
        console.error('Error al crear tarea')
    }
});

async function createTask() {
    try {
        const response = await fletch(`${apiUrl}?is_active=true`);
        const tasks = await response.JSON();
        const tbody = document.querySelector("#form tbody");
        tbody.innerHTML = "";

        tasks.forEach(task => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
            <td>${task.name}</td>
            <td>${task.status}</td>
            <td>${task.description}</td>
            <td>
              <button onclick>Editar</button>
              <button onclick>Eliminar</button>
            </td>
          `;
        });
        tbody.appendChild(fila);
    } catch (error) {
        console.error("error al cargar la  tarea");
    }
}

