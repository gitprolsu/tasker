
let postArea = document.querySelector("#postArea");
postArea.innerHTML = `
    <div class="row">
    <div class="col-sm-2"></div>
    <div class="col-6 col-sm-3">
        <input type="text" class="form-control inputBoxLight" id="taskName" placeholder="Enter your task here...">
    </div>
    <div class="col-6 col-sm-3" style="display: none;">
        <input type="text" class="form-control inputBoxLight" id="taskDescription" placeholder="Any additional notes?">
    </div>
    <div class="col-12 col-sm-2">
        <button type="button" class="btn btn-outline-success" id="newBtn">
            post
        </button>
    </div>
    </div>
    `
function retrieveAllTasks() {

    let storedTasks, taskerObject = localStorage.taskerObject;

    if (!taskerObject) {
        localStorage.setItem("taskerObject", "");
    }
    else {
        taskerObject = JSON.parse(taskerObject);
        taskerObject = Object.keys(taskerObject);
        storedTasks = [];

        for (var i = 0; i < taskerObject.length; i++) {
            storedTasks.push(taskerObject[i]);
        };

        if (storedTasks)
            storedTasks.forEach(task => retrieveTasks(task));

        function retrieveTasks(taskIndex) {
            let status, color, timeStat, timeStatColor, taskTimeStamp, foundTask, taskId = taskIndex;
            foundTask = JSON.parse(localStorage.taskerObject);
            foundTask = foundTask[taskId];

            if (foundTask.completed === false) {
                status = "Active";
                color = "tomato";
            };

            if (foundTask.updatedTime === "") {
                timeStat = "Posted";
                timeStatColor = "tomato";
                taskTimeStamp = foundTask.timeStamp;
            } else if (foundTask.updatedTime !== "") {
                timeStat = "Updated";
                timeStatColor = "rgb(0, 113, 365)";
                taskTimeStamp = foundTask.updatedTime;
            };

            if (foundTask.completed === true) {
                status = "Done";
                color = "green";
                timeStat = "Completed";
                timeStatColor = "green";
                taskTimeStamp = foundTask.timeCompleted;
            };

            let divElement = document.createElement("div");
            divElement.setAttribute("id", foundTask.taskId);

            divElement.innerHTML = `
                    <div class="col-12 col-sm-12">
                        <div class="row">
                            <div class="col-12 col-sm-12">
                                <h4 class="postedTask">${foundTask.taskTitle}</h4>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12 col-sm-12 taskDescription">
                                <p>${foundTask.taskDescription}</p>
                            </div>
                            <div class="col-3 col-sm-2 taskStatus">
                                <h6>Status: <span style="color: ${color};">${status}</span></h6>
                            </div>
                            <div class="col-9 col-sm-5 taskTimeStamp">
                                <h6>${timeStat}: <span style="color: ${timeStatColor};">${taskTimeStamp}</span></h6>
                            </div>
                        </div>
                    </div>
                    <hr/>
                    `
            document.getElementById("taskContainer").prepend(divElement);
        };
    };

    let activeTasks = document.getElementsByClassName("postedTask");

    for (var i = 0; i < activeTasks.length; i++) {
        activeTasks[i].parentElement.addEventListener("click", function (data) {
            showUpdateTasker(data);
        });
    };
};

function createNewTask() {

    let taskTitle = document.getElementById("taskName").value;

    if (!taskTitle) {
        alert("task name required!")
    } else {

        let taskDescription = document.getElementById("taskDescription").value;
        let timeStamp = "";
        let taskId, stringDate, newDate = new Date();
        stringDate = newDate.toString();
        newDate = stringDate.split(" ");
        taskId = newDate[1] + newDate[2] + newDate[3] + newDate[4];

        for (var i = 0; i < 5; i++) {
            timeStamp += `${newDate[i]} `;
        };

        let divElement = document.createElement("div");
        divElement.setAttribute("id", taskId);

        divElement.innerHTML = `
                    <div class="col-12 col-sm-12">
                        <div class="row">
                            <div class="col-12 col-sm-12">
                                <h4 class="postedTask" onclick="showUpdateTasker('${taskId}')">${taskTitle}</h4>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12 col-sm-12 taskDescription">
                                <p>${taskDescription}</p>
                            </div>
                            <div class="col-3 col-sm-2 taskStatus">
                                <h6>Status: <span style="color: tomato;">Active</span></h6>
                            </div>
                            <div class="col-9 col-sm-5 taskTimeStamp">
                                <h6>Posted: <span style="color: tomato;">${timeStamp}</span></h6>
                            </div>
                        </div>
                    </div>
                    <hr/>
                    `
        document.getElementById("taskContainer").prepend(divElement);

        document.getElementById("taskName").value = "";
        document.getElementById("taskDescription").value = "";
        document.getElementById("taskDescription").parentElement.style.display = "none";

        let savedTask = {};
        let currentLocalStorage;

        if (localStorage.getItem("taskerObject") === "") {
            savedTask[taskId] = {
                taskId,
                stringDate,
                taskTitle,
                taskDescription,
                timeStamp,
                "updatedTime": "",
                "timeCompleted": "",
                "completed": false,
            };

            localStorage.setItem("taskerObject", JSON.stringify(savedTask));
        } else {
            currentLocalStorage = JSON.parse(localStorage.getItem("taskerObject"));
            currentLocalStorage[taskId] = {
                taskId,
                stringDate,
                taskTitle,
                taskDescription,
                timeStamp,
                "updatedTime": "",
                "timeCompleted": "",
                "completed": false,
            }
            localStorage.setItem("taskerObject", JSON.stringify(currentLocalStorage));
        };
        window.location.reload();
    };
};

function showUpdateTasker(data) {

    let taskId = data.path[4].id;

    let taskerObject = JSON.parse(localStorage.taskerObject);
    taskerObject = taskerObject[taskId];

    let tempElement = document.createElement("div");

    tempElement.innerHTML = `
    <div class="row">
        <div class="col-12 col-sm-4">
            <input id="taskToUpdate" value="${taskerObject.taskTitle}" type="text" class="form-control" placeholder="Update this task's name...">
        </div>
        <div class="col-12 col-sm-4">
            <input id="descriptionToUpdate" value="${taskerObject.taskDescription}" type="text" class="form-control" placeholder="Update your task's optional description...">
        </div>
        <div class="col-4 col-sm-1">
            <img src="icons/refresh.png" type="button" onclick="postUpdate('${taskId}')" id="updateBtn" title="update"/>
        </div>
        <div class="col-4 col-sm-1">
            <img src="icons/trash (1).png" type="button" onclick="deletePost('${taskId}')" id="deleteBtn" title="delete"/>
        </div>
        <div class="col-4 col-sm-1">
            <img src="icons/done.png" type="button" onclick="taskDone('${taskId}')" id="doneBtn" title="complete"/>
        </div>
    </div>
    <hr/>
    `
    document.getElementById(taskId).replaceWith(tempElement);
};

function postUpdate(dataId) {
    // console.log(`Update post with id: ${dataId}`);

    let currentLocalStorage = JSON.parse(localStorage.taskerObject);

    let updatedTitle = document.getElementById("taskToUpdate").value;
    let updatedDescription = document.getElementById("descriptionToUpdate").value;

    if (!updatedTitle) {
        window.location.reload();
    } else {
        currentLocalStorage[dataId].taskTitle = updatedTitle;
        currentLocalStorage[dataId].taskDescription = updatedDescription;
        let newTimeStamp = "";
        let newDateUpdate = new Date();
        newDateUpdate = newDateUpdate.toString().split(" ");

        for (var i = 0; i < 5; i++) {
            newTimeStamp += `${newDateUpdate[i]} `;
        };

        currentLocalStorage[dataId].updatedTime = newTimeStamp;

        localStorage.setItem("taskerObject", JSON.stringify(currentLocalStorage));
        window.location.reload();
    };
};

function deletePost(dataId) {
    // console.log(`Delete post with id: ${dataId}`);
    let currentStorage = JSON.parse(localStorage.taskerObject);

    delete currentStorage[dataId];
    localStorage.setItem("taskerObject", JSON.stringify(currentStorage));
    window.location.reload();
};

function taskDone(dataId) {
    // console.log(`Task with id ${dataId} completed. Yay!`);
    let currentLocalStorage = JSON.parse(localStorage.taskerObject);
    currentLocalStorage[dataId].completed = true;
    let completeTimeStamp = "";
    let completedDate = new Date();
    completedDate = completedDate.toString().split(" ");
    for (var i = 0; i < 5; i++) {
        completeTimeStamp += `${completedDate[i]} `;
    };

    currentLocalStorage[dataId].timeCompleted = completeTimeStamp;
    localStorage.setItem("taskerObject", JSON.stringify(currentLocalStorage));
    window.location.reload();
};

function setScreenMode() {

    let currentScreen, taskerSettings = localStorage.taskerSettings;

    if (taskerSettings) {
        taskerSettings = JSON.parse(taskerSettings);
        if (taskerSettings.screen === "Light") {
            currentScreen = "lightMode";
        } else if (taskerSettings.screen === "Dark") {
            currentScreen = "nightOwl";
        }
    } else if (!taskerSettings) {
        localStorage.setItem("taskerSettings", "");
        currentScreen = "nightOwl";
    };

    document.querySelector("body").setAttribute("class", currentScreen);
};

function settings() {
    console.log("hello settings!");

    let currentScreenMode, taskerSettings = localStorage.taskerSettings;
    if (taskerSettings) {
        taskerSettings = JSON.parse(taskerSettings);

        if (taskerSettings.screen === "Dark") {
            currentScreenMode = "Dark";
        } else if (taskerSettings.screen === "Light") {
            currentScreenMode = "Light";
        };

    } else if (!taskerSettings) {
        currentScreenMode = "Dark";
    };

    console.log(currentScreenMode);

    let fontFamily = "Zen Maru Gothic"

    let settingsElement = document.createElement("div");
    settingsElement.setAttribute("class", "col-12 col-sm-12");

    settingsElement.innerHTML = `
        <div class="row">
            <div class="col-sm-2"></div>
            <div class="col-sm-8">
                <div class="row">
                    <div class="col-6 col-sm-6">
                        <p id="darkModeLabel">Screen Mode: <img type="button" onclick="switchScreenMode()" id="darkModeBtn" src="icons/dark-mode.png" title="Screen Mode"/> ${currentScreenMode}</p>
                    </div>
                    <!-- <div class="col-6 col-sm-6">
                        <h6>Font family: <span style="color: tomato;">${fontFamily}</span></h6>
                    </div> -->
                </div>
            </div>
            <div class="col-sm-2"></div>
        </div>
        <hr />
    `
    document.getElementById("settingsArea").append(settingsElement);
};

function switchScreenMode() {
    console.log("Screen mode changed...");

    let settings = localStorage.taskerSettings;
    if (!settings) {
        document.querySelector("body").setAttribute("class", "lightMode");
        localStorage.setItem("taskerSettings", JSON.stringify({ "screen": "Light" }));
        console.log("Settings: Light mode");
    } else if (settings) {
        settings = JSON.parse(settings);
        if (settings.screen === "Dark") {
            document.querySelector("body").setAttribute("class", "lightMode");
            settings.screen = "Light";
        } else if (settings.screen === "Light") {
            document.querySelector("body").setAttribute("class", "nightOwl");
            settings.screen = "Dark";
        };
        localStorage.setItem("taskerSettings", JSON.stringify(settings));
        console.log(settings);
    };

    window.location.reload();
};

// create new tasks
document.getElementById("newBtn").addEventListener("click", createNewTask);

// adjust page settings
document.getElementById("settingsBtn").addEventListener("click", settings);

//display optional input box:
document.getElementById("taskName").addEventListener("keyup", function () {
    let enteredValue = this.value;
    if (enteredValue) {
        document.getElementById("taskDescription").parentElement.style.display = "";
    } else if (!enteredValue) {
        document.getElementById("taskDescription").parentElement.style.display = "none";
        document.getElementById("taskDescription").value = "";
    }
});

setScreenMode();
retrieveAllTasks();