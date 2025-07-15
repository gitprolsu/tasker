let postArea = document.querySelector("#postArea");

postArea.innerHTML = `
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
        <button type="submit" class="btn btn-outline-success" id="newBtn">
            post
        </button>
    </div>
    </div>
    </form>
    `;

// initialAppSettings() works!
function initialAppSettings() {
  if (localStorage.taskerSettings == undefined) {
    let appSettings = {
      version: 1.01,
      screen: "Light",
    };
    localStorage.setItem("taskerSettings", JSON.stringify(appSettings));
  } else {
    let settings = JSON.parse(localStorage.taskerSettings);
    let screen = settings.screen == "Light" ? "lightMode" : "nightOwl";
    let body = document.querySelector("body");
    body.setAttribute("class", screen);
  }
}

// switchScreenMode() works!
function switchScreenMode() {
  let settings = JSON.parse(localStorage.taskerSettings);

  if (settings.screen === "Light") {
    document.querySelector("body").setAttribute("class", "nightOwl");
    settings.screen = "Dark";
    localStorage.setItem("taskerSettings", JSON.stringify(settings));
  } else if (settings.screen === "Dark") {
    document.querySelector("body").setAttribute("class", "lightMode");
    settings.screen = "Light";
    localStorage.setItem("taskerSettings", JSON.stringify(settings));
  }
  let settingsArea = document.getElementById("settingsArea");
  settingsArea.setAttribute("style", "display: none;");
}

// settings() works!
function settings() {
  console.log("hello settings!");
  let settingsArea = document.getElementById("settingsArea");
  let style = settingsArea.getAttribute("style");
  if (style == "display: none;") {
    settingsArea.setAttribute("style", "display: ;");
  } else {
    settingsArea.setAttribute("style", "display: none;");
  }
}

// factoryReset() works!
function factoryReset() {
  let confirmed = confirm(
    "Are you sure you want to delete all your tasks from this computer?"
  );

  if (confirmed) {
    localStorage.removeItem("taskerObject");
    localStorage.removeItem("taskerSettings");
    window.location.reload();
  } else {
    let settingsArea = document.getElementById("settingsArea");
    settingsArea.setAttribute("style", "display: none;");
  }
}

// createNewTask() works!
function createNewTask() {
  let taskDescription, timeStamp, newDate, taskId;
  let taskTitle = document.getElementById("taskName").value;

  if (taskTitle == "") {
    alert("task name required!");
    return;
  } else {
    taskDescription = document.getElementById("taskDescription").value;
    timeStamp = "";
    newDate = new Date().toString().split(" ");
    taskId = newDate[1] + newDate[2] + newDate[3] + newDate[4];

    for (var i = 0; i < 5; i++) {
      timeStamp += `${newDate[i]} `;
    }

    let taskerObject = JSON.parse(localStorage.taskerObject);

    taskerObject[taskId] = {
      taskId,
      newDate,
      taskTitle,
      taskDescription,
      timeStamp,
      updatedTime: "",
      timeCompleted: "",
      completed: false,
    };
    localStorage.setItem("taskerObject", JSON.stringify(taskerObject));
  }

  window.location.reload();
}

// pullTasksFromLocalStorage() works!
function pullTasksFromLocalStorage() {
  if (
    localStorage.taskerObject == undefined ||
    localStorage.taskerObject == "{}"
  ) {
    localStorage.setItem("taskerObject", "{}");

    let divElement = document.createElement("div");
    divElement.setAttribute("class", "row");

    divElement.innerHTML = `
            <div class="col-0 col-sm-1"></div>
            <div class="col-12 col-sm-11" id="emptyContainer">
                <h6>No tasks yet! Enter your first task above and press enter or click on 'post'</h6>
            </div>
        `;

    document.querySelector("#taskContainer").prepend(divElement);
  } else {
    let taskList = JSON.parse(localStorage.taskerObject);
    let storedTasks = [];

    let listKeys = Object.keys(taskList);
    for (var i = 0; i < listKeys.length; i++) {
      storedTasks.push(listKeys[i]);
    }
    storedTasks.forEach((task) => displayTasksToScreen(task));
  }
}

// displayTasksToScreen() works!
function displayTasksToScreen(taskIndex) {
  let tasks = JSON.parse(localStorage.taskerObject);
  let currentTask = tasks[taskIndex];

  if (currentTask.completed == true) return;
  let status, color, timeStat, timeStatColor, taskTimeStamp;

  if (currentTask.updatedTime === "") {
    timeStat = "Posted";
    timeStatColor = "tomato";
    taskTimeStamp = currentTask.timeStamp;
  } else {
    timeStat = "Updated";
    timeStatColor = "rgb(0, 113, 365)";
    taskTimeStamp = currentTask.updatedTime;
  }

  if (currentTask.completed === true) {
    status = "Done";
    color = "green";
    timeStat = "Completed";
    timeStatColor = "green";
    taskTimeStamp = currentTask.timeCompleted;
  } else if (currentTask.completed === false) {
    status = "Active";
    color = "tomato";
  }

  let divElement = document.createElement("div");
  divElement.setAttribute("id", currentTask.taskId);

  divElement.innerHTML = `
                    <div class="col-12 col-sm-12">
                        <div class="row">
                            <div class="col-12 col-sm-12">
                                <h4 type="button" class="postedTask" onclick="showUpdateTasker('${currentTask.taskId}')">${currentTask.taskTitle}</h4>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12 col-sm-12 taskDescription">
                                <p>${currentTask.taskDescription}</p>
                            </div>
                            <div class="col-3 col-sm-4 taskStatus">
                                <h6>Status: <span style="color: ${color};">${status}</span></h6>
                            </div>
                            <div class="col-9 col-sm-8 taskTimeStamp">
                                <h6>${timeStat}: <span style="color: ${timeStatColor};">${taskTimeStamp}</span></h6>
                            </div>
                        </div>
                    </div>
                    <hr/>
                    `;

  document.getElementById("taskContainer").prepend(divElement);
}

function reverseTaskCompleted(id) {
  let reverse = confirm("Set task as 'Incomple'?");
  if (reverse) {
    let tasks = JSON.parse(localStorage.taskerObject);
    tasks[id].completed = false;
    localStorage.setItem("taskerObject", JSON.stringify(tasks));
  }
  window.location.reload();
}
//  retrieveDoneTasks() works!
function retrieveDoneTasks(taskArg) {
  let foundTask = JSON.parse(localStorage.taskerObject);
  let index = taskArg;

  if (foundTask[index].completed) {
    let divElement = document.createElement("div");
    divElement.setAttribute("id", `${foundTask[index].taskId}-done`);

    divElement.innerHTML = `
                <div class="row">
                    <div class="col-12 col-sm-12">
                        <h4 type="button" class="postedTask" onclick="reverseTaskCompleted('${index}')">${foundTask[index].taskTitle}</h4>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12 col-sm-12 taskTimeStamp">
                        <h6>Completed on: <span style="color: green;">${foundTask[index].timeCompleted}</span></h6>
                    </div>
                </div>
            <hr/>`;
    document.getElementById("tasksCompleted").append(divElement);
  }
}

// displayTasksCompleted() works!
function displayTasksCompleted() {
  if (localStorage.taskerObject !== undefined) {
    let taskerObject = JSON.parse(localStorage.taskerObject);
    taskerObject = Object.keys(taskerObject);
    let storedtaskIds = [];

    for (var i = 0; i < taskerObject.length; i++) {
      storedtaskIds.push(taskerObject[i]);
    }
    storedtaskIds.forEach((taskId) => retrieveDoneTasks(taskId));
  }
}

// showUpdateTasker() works!!
function showUpdateTasker(id) {
  let taskerObject = JSON.parse(localStorage.taskerObject);
  let thisTask = taskerObject[id];

  let tempElement = document.createElement("div");

  tempElement.innerHTML = `
    <div class="row">
        <div class="col-12 col-sm-12 col-md-4">
            <input id="taskToUpdate" value="${thisTask.taskTitle}" type="text" class="form-control" placeholder="Update this task's name...">
        </div>
        <div class="col-12 col-sm-12 col-md-4">
            <input id="descriptionToUpdate" value="${thisTask.taskDescription}" type="text" class="form-control" placeholder="Update your task's optional description...">
        </div>
        <div class="col-4 col-sm-2 col-md-1">
            <img src="icons/refresh.png" type="button" onclick="postUpdate('${id}')" id="updateBtn" title="update"/>
        </div>
        <div class="col-4 col-sm-2 col-md-1">
            <img src="icons/trash (1).png" type="button" onclick="deletePost('${id}')" id="deleteBtn" title="delete"/>
        </div>
        <div class="col-4 col-sm-2 col-md-1">
            <img src="icons/done.png" type="button" onclick="taskDone('${id}')" id="doneBtn" title="complete"/>
        </div>
    </div>
    <hr/>
    `;
  document.getElementById(id).replaceWith(tempElement);
}

function postUpdate(dataId) {
  let tasks = JSON.parse(localStorage.taskerObject);

  let updatedTitle = document.getElementById("taskToUpdate").value;
  let updatedDescription = document.getElementById("descriptionToUpdate").value;

  if (updatedTitle == "") {
    alert("Title require to update post!");
  } else {
    tasks[dataId].taskTitle = updatedTitle;
    tasks[dataId].taskDescription = updatedDescription;
    let newDateUpdate = new Date().toString().split(" ");
    let newTimeStamp = "";

    for (var i = 0; i < 5; i++) {
      newTimeStamp += `${newDateUpdate[i]} `;
    }

    tasks[dataId].updatedTime = newTimeStamp;

    localStorage.setItem("taskerObject", JSON.stringify(tasks));
    window.location.reload();
  }
}

function deletePost(dataId) {
  let tasks = JSON.parse(localStorage.taskerObject);

  delete tasks[dataId];
  localStorage.setItem("taskerObject", JSON.stringify(tasks));
  window.location.reload();
}

function taskDone(dataId) {
  let tasks = JSON.parse(localStorage.taskerObject);
  tasks[dataId].completed = true;
  let completeTimeStamp = "";
  let completedDate = new Date().toString().split(" ");
  for (var i = 0; i < 5; i++) {
    completeTimeStamp += `${completedDate[i]} `;
  }

  tasks[dataId].timeCompleted = completeTimeStamp;
  localStorage.setItem("taskerObject", JSON.stringify(tasks));
  window.location.reload();
}

// create new tasks
document.getElementById("newBtn").addEventListener("click", function (event) {
  event.preventDefault();
  createNewTask();
});

// adjust page settings
document.getElementById("settingsBtn").addEventListener("click", function () {
  settings();
});

// display optional input box: ??
document.getElementById("taskName").addEventListener("keyup", function () {
  let enteredValue = this.value;
  if (enteredValue) {
    document.getElementById("taskDescription").parentElement.style.display = "";
  } else if (!enteredValue) {
    document.getElementById("taskDescription").parentElement.style.display =
      "none";
    document.getElementById("taskDescription").value = "";
  }
});

initialAppSettings();
pullTasksFromLocalStorage();
displayTasksCompleted();
