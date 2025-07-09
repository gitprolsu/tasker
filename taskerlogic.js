// taskerlogic.js (Refactored)

// ===== Utilities =====
function getFormattedTimestamp(date = new Date()) {
    return date.toString().split(" ").slice(0, 5).join(" ");
}

function getTaskerObject() {
    try {
        return JSON.parse(localStorage.getItem("taskerObject") || "{}");
    } catch (e) {
        console.error("Failed to parse taskerObject:", e);
        return {};
    }
}

function setTaskerObject(obj) {
    localStorage.setItem("taskerObject", JSON.stringify(obj));
}

function getTaskStatus(task) {
    if (task.completed) {
        return {
            status: "Done",
            color: "green",
            label: "Completed",
            timestamp: task.timeCompleted
        };
    } else if (task.updatedTime) {
        return {
            status: "Active",
            color: "tomato",
            label: "Updated",
            timestamp: task.updatedTime
        };
    } else {
        return {
            status: "Active",
            color: "tomato",
            label: "Posted",
            timestamp: task.timeStamp
        };
    }
}

// ===== UI Handling =====
document.querySelector("#postArea").innerHTML = `
<form>
  <div class="row form-group">
    <div class="col-sm-2"></div>
    <div class="col-6 col-sm-3">
      <input type="text" class="form-control inputBoxLight" id="taskName" placeholder="Enter your task here...">
    </div>
    <div class="col-6 col-sm-3" style="display: none;">
      <input type="text" class="form-control inputBoxLight" id="taskDescription" placeholder="Any additional notes?">
    </div>
    <div class="col-12 col-sm-2">
      <button type="submit" class="btn btn-outline-success" id="newBtn">post</button>
    </div>
  </div>
</form>
`;

function renderTasks() {
    const container = document.getElementById("taskContainer");
    container.innerHTML = "";

    const tasks = getTaskerObject();
    const keys = Object.keys(tasks);

    if (keys.length === 0) {
        container.innerHTML = `
            <div class="row">
              <div class="col-0 col-sm-1"></div>
              <div class="col-12 col-sm-11" id="emptyContainer">
                <h6>No tasks yet! Enter your first task above and press enter or click on 'post'</h6>
              </div>
            </div>`;
        return;
    }

    keys.forEach((id) => {
        const task = tasks[id];
        const status = getTaskStatus(task);

        if (!task.completed) {
            const div = document.createElement("div");
            div.setAttribute("id", id);
            div.innerHTML = `
                <div class="col-12 col-sm-12">
                  <div class="row">
                    <div class="col-12 col-sm-12">
                      <h4 type="button" class="postedTask">${task.taskTitle}</h4>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-12 col-sm-12 taskDescription">
                      <p>${task.taskDescription}</p>
                    </div>
                    <div class="col-3 col-sm-4 taskStatus">
                      <h6>Status: <span style="color: ${status.color};">${status.status}</span></h6>
                    </div>
                    <div class="col-9 col-sm-8 taskTimeStamp">
                      <h6>${status.label}: <span style="color: ${status.color};">${status.timestamp}</span></h6>
                    </div>
                  </div>
                </div>
                <hr/>
            `;
            container.prepend(div);

            div.querySelector(".postedTask").addEventListener("click", (e) => {
                showUpdateTasker(e, id);
            });
        }
    });
}

function renderCompletedTasks() {
    const container = document.getElementById("tasksCompleted");
    container.innerHTML = "";
    const tasks = getTaskerObject();

    Object.values(tasks).forEach(task => {
        if (task.completed) {
            const div = document.createElement("div");
            div.setAttribute("id", `${task.taskId}done`);
            div.innerHTML = `
                <div class="row">
                  <div class="col-12 col-sm-12">
                    <h4 type="button" class="postedTask">${task.taskTitle}</h4>
                  </div>
                </div>
                <div class="row">
                  <div class="col-12 col-sm-12 taskTimeStamp">
                    <h6>Completed on: <span style="color: green;">${task.timeCompleted}</span></h6>
                  </div>
                </div>
                <hr/>
            `;
            container.appendChild(div);
        }
    });
}

function showUpdateTasker(e, id) {
    const task = getTaskerObject()[id];
    const container = document.createElement("div");

    container.innerHTML = `
        <div class="row">
            <div class="col-md-4">
                <input id="taskToUpdate" value="${task.taskTitle}" class="form-control" />
            </div>
            <div class="col-md-4">
                <input id="descriptionToUpdate" value="${task.taskDescription}" class="form-control" />
            </div>
            <div class="col-md-1">
                <img src="icons/refresh.png" onclick="postUpdate('${id}')" title="update" />
            </div>
            <div class="col-md-1">
                <img src="icons/trash (1).png" onclick="deletePost('${id}')" title="delete" />
            </div>
            <div class="col-md-1">
                <img src="icons/done.png" onclick="taskDone('${id}')" title="complete" />
            </div>
        </div>
        <hr/>
    `;
    document.getElementById(id).replaceWith(container);
}

function createNewTask() {
    const title = document.getElementById("taskName").value.trim();
    const description = document.getElementById("taskDescription").value.trim();
    if (!title) return alert("Task name required!");

    const taskId = Date.now().toString();
    const timeStamp = getFormattedTimestamp();
    const tasks = getTaskerObject();

    tasks[taskId] = {
        taskId,
        taskTitle: title,
        taskDescription: description,
        timeStamp,
        updatedTime: "",
        timeCompleted: "",
        completed: false
    };

    setTaskerObject(tasks);
    document.getElementById("taskName").value = "";
    document.getElementById("taskDescription").value = "";
    document.getElementById("taskDescription").parentElement.style.display = "none";
    renderTasks();
    renderCompletedTasks();
}

function postUpdate(id) {
    const title = document.getElementById("taskToUpdate").value.trim();
    const description = document.getElementById("descriptionToUpdate").value.trim();
    if (!title) return renderTasks();

    const tasks = getTaskerObject();
    tasks[id].taskTitle = title;
    tasks[id].taskDescription = description;
    tasks[id].updatedTime = getFormattedTimestamp();

    setTaskerObject(tasks);
    renderTasks();
    renderCompletedTasks();
}

function deletePost(id) {
    const tasks = getTaskerObject();
    delete tasks[id];
    setTaskerObject(tasks);
    renderTasks();
    renderCompletedTasks();
}

function taskDone(id) {
    const tasks = getTaskerObject();
    tasks[id].completed = true;
    tasks[id].timeCompleted = getFormattedTimestamp();
    setTaskerObject(tasks);
    renderTasks();
    renderCompletedTasks();
}

// ===== Settings =====
function initialAppSettings() {
    const settings = JSON.parse(localStorage.getItem("taskerSettings") || '{"screen":"Light"}');
    document.body.className = settings.screen === "Dark" ? "nightOwl" : "lightMode";
}

// ===== Event Listeners =====
document.addEventListener("DOMContentLoaded", () => {
    initialAppSettings();
    renderTasks();
    renderCompletedTasks();

    document.getElementById("newBtn").addEventListener("click", (e) => {
        e.preventDefault();
        createNewTask();
    });

    document.getElementById("taskName").addEventListener("input", function () {
        document.getElementById("taskDescription").parentElement.style.display = this.value ? "" : "none";
    });
});
