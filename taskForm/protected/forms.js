

const plan = document.querySelector("#plan-form");

const btnPanel = document.querySelector("#btn-panel");
const addButton = document.querySelector("#add-btn");
const okButton = document.querySelector("#ok-btn");
const delButton = document.querySelector(".del-btn");
const saveButton = document.querySelector("#save-btn");



//PLAN FORM INPUT//PLAN FORM INPUT//PLAN FORM INPUT
plan.addEventListener("submit", async function (event) {
  const allTaskForm = document.querySelectorAll(".task-form");
  event.preventDefault();
  if (clickBtn === "ok-btn") {
    //check input
    let checkingPlan = validatePlanForm(plan);
    let checkingTask = validateTaskForm(allTaskForm);
    if (!checkingPlan || !checkingTask) {
      console.log("Plan:" + checkingPlan + " Task:" + checkingTask);
      return;
    };
  } else if (clickBtn === "save-btn") {
    //form data is wt is it filling now
    tempPlanForm(plan);
    tempTaskForm(allTaskForm);
  };

  console.log(planForm);
  console.log(taskFormArr);
  let combineFormData = {
    planFormData: planForm,
    taskFormData: taskFormArr,
    clickButton: clickBtn,
    planID: ""
  };
  console.log(combineFormData);

  // Extract the planID from the URL
  const searchParams = new URLSearchParams(window.location.search);
  let planID = "";
  // Check if the plan already exists on the server

  planID = await searchParams.get("ID");
  let resultCheckID = { success: false };
  if (planID !== null) {
    const resCheckID = await fetch(`/check?ID=${planID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    resultCheckID = await resCheckID.json();
    console.log(resultCheckID);
  } else {
    resultCheckID = { success: false };
  };

  let result = ""
  if (resultCheckID.success) {
    // Plan already exists, update it
    combineFormData.planID = planID;

    let body = await encrypt(combineFormData);
    console.log(body);
    const res = await fetch("/forms", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ en: body })
    });
    result = await res.json();
    console.log(result);
  } else {

    let body = await encrypt(combineFormData);
    console.log(body);
    const res = await fetch("/forms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ en: body })
    });
    result = await res.json(); // { success: true }
    console.log(result);
  };

  const resultContent = decrypt(result.en);
  console.log(resultContent);
  clickBtn = "";
  try {
    let checkID = document.getElementById(resultContent.planID);
    if (checkID) {
      //if hv this id, then revise innerHTML
      document.getElementById(resultContent.planID).innerHTML = `${resultContent.planName} - ${resultContent.planDate}`;
    } else {
      //if dun hv this id, then create button
      createSavedPlanBtn(resultContent.planID, resultContent.planName, resultContent.planDate);
    };
    //change the url to show planID
    window.history.replaceState(null, "", `/search?ID=${resultContent.planID}`);

    //show result
    document.querySelector(".offcanvas-body").innerHTML = resultContent.resultHTML;
  } catch (e) {
    console.log(`createSavedPlanBtn: ${e}`);
  }



});

// create plan button when saved
function createSavedPlanBtn(id, name, date) {
  let btn = document.createElement("li");

  if (date === "") {
    btn.innerHTML = `<a class="dropdown-item" id="${id}" href="#">${name}</a>`;
  } else {
    btn.innerHTML = `<a class="dropdown-item" id="${id}" href="#">${name} - ${date}</a>`;
  };
  // btn.id = id;
  // btn.classList.add('saved-plan-btn');
  document.querySelector(".saved-plan-list").appendChild(btn);
};


let planForm = {
  planName: "",
  planDate: "",
  startLocation: "",
  returnLocation: "",
  startTime: "",
  endTime: "",
  lunchStart: "",
  lunchEnd: "",
  dinnerStart: "",
  dinnerEnd: "",
  pubTrans: false,
  walk: false,
  drive: true
};

function validatePlanForm(plan) {
  if (plan.planName.value === "") {
    planForm.planName = "New Plan";
  } else {
    planForm.planName = plan.planName.value;
  };
  if (plan.planDate.value === "") {
    let tdy = new Date();
    let year = tdy.getFullYear();
    let month = tdy.getMonth() + 1;
    month = month.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
    let day = tdy.getDate() + 1;
    day = day.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
    let dateString = `${year}-${month}-${day}`;
    planForm.planDate = dateString;
  } else {
    planForm.planDate = plan.planDate.value;
  };
  planForm.startLocation = plan.startLocation.value;
  planForm.returnLocation = plan.returnLocation.value;
  if (plan.startTime.value === "") {
    planForm.startTime = "09:00";
  } else {
    planForm.startTime = plan.startTime.value;
  };
  if (plan.endTime.value === "") {
    planForm.endTime = "17:00";
  } else {
    planForm.endTime = plan.endTime.value;
  };
  if (plan.lunchStart.value === "") {
    planForm.lunchStart = "12:30";
  } else {
    planForm.lunchStart = plan.lunchStart.value;
  };
  if (plan.lunchEnd.value === "") {
    planForm.lunchEnd = "13:30";
  } else {
    planForm.lunchEnd = plan.lunchEnd.value;
  };
  planForm.dinnerStart = plan.dinnerStart.value;
  planForm.dinnerEnd = plan.dinnerEnd.value;
  if (plan.pubTrans.checked === false && plan.walk.checked === false && plan.drive.checked === false) {
    planForm.drive = true;
    planForm.pubTrans = plan.pubTrans.checked;
    planForm.walk = plan.walk.checked;
  } else {
    planForm.drive = plan.drive.checked;
    planForm.pubTrans = plan.pubTrans.checked;
    planForm.walk = plan.walk.checked;
  };
  return true;
};

function tempPlanForm(plan) {
  planForm.planName = plan.planName.value;
  planForm.planDate = plan.planDate.value;
  planForm.startLocation = plan.startLocation.value;
  planForm.returnLocation = plan.returnLocation.value;
  planForm.startTime = plan.startTime.value;
  planForm.endTime = plan.endTime.value;
  planForm.lunchStart = plan.lunchStart.value;
  planForm.lunchEnd = plan.lunchEnd.value;
  planForm.dinnerStart = plan.dinnerStart.value;
  planForm.dinnerEnd = plan.dinnerEnd.value;
  planForm.drive = plan.drive.checked;
  planForm.pubTrans = plan.pubTrans.checked;
  planForm.walk = plan.walk.checked;
  return true;
};

let taskFormArr = []
taskFormArr[0] = {
  taskDescription: "", //show error if empty
  taskDuration: 0, //default null
  taskLocation: "", //show error if empty
  remarks: "", //default null
  priority: false, //default false
};
function validateTaskForm(allTaskForm) {
  let result = true;
  for (let [i, task] of allTaskForm.entries()) {
    if (task.taskDescription.value == "" || task.taskLocation.value == "") {
      console.log(i);
      alert("Task Description and Task Location must be filled out");
      result = false;
      break;
    } else if (task.taskDuration.value < 0 || task.taskDuration.value > 12) {
      console.log(i);
      alert("Task Duration must be 0-12");
      result = false;
      break;
    };
  };
  for (let [i, task] of allTaskForm.entries()) {
    taskFormArr[i] = {
      taskDescription: task.taskDescription.value,
      taskDuration: task.taskDuration.value,
      taskLocation: task.taskLocation.value,
      remarks: task.remarks.value,
      priority: task.priority.checked
    };
  };
  return result;
};

function tempTaskForm(allTaskForm) {
  for (let [i, task] of allTaskForm.entries()) {
    taskFormArr[i] = {
      taskDescription: task.taskDescription.value,
      taskDuration: task.taskDuration.value,
      taskLocation: task.taskLocation.value,
      remarks: task.remarks.value,
      priority: task.priority.checked
    };
  };
  return true;
};

let clickBtn = "";

okButton.addEventListener("click", (event) => {

  console.log("okButton clicked!");
  clickBtn = "ok-btn";
  plan.dispatchEvent(new Event("submit"));

});

saveButton.addEventListener("click", (event) => {
  console.log("saveButton clicked!");
  clickBtn = "save-btn";
  plan.dispatchEvent(new Event("submit"));
});



delButton.addEventListener('click', () => {
  if (document.querySelectorAll('.task-container').length === 1) {
    console.log('Input at least 1 task.');
  } else {
    document.querySelector('.task-container').remove();
    let i = 1;
    document.querySelectorAll('.task-count').forEach(e => {
      e.innerHTML = i;
      i++
    })
  };
});

addButton.addEventListener('click', () => {
  let newNode = document.querySelector('.task-container').cloneNode(true);
  console.log(newNode)
  newNode.querySelector('.task-count').innerHTML = document.querySelectorAll('.task-container').length + 1;
  newNode.querySelector('.taskDescription').value = '';
  newNode.querySelector('.taskDuration').value = 1;
  newNode.querySelector('.taskLocation').value = '';
  newNode.querySelector('.remarks').value = '';
  newNode.querySelector('.priority').checked = false;
  newNode.classList.add("fade-in");
  document.querySelector('#task-list').appendChild(newNode)
  newNode.scrollIntoView({ behavior: "smooth" });
  //DEL-BUTTON IN NEW TASK //DEL-BUTTON IN NEW TASK //DEL-BUTTON IN NEW TASK//
  let newDelBtn = newNode.querySelector(".del-btn");
  newDelBtn.addEventListener('click', () => {
    if (document.querySelectorAll('.task-container').length === 1) {
      console.log('Input at least 1 task.');
    } else {
      newNode.remove();
      let i = 1;
      document.querySelectorAll('.task-count').forEach(e => {
        e.innerHTML = i;
        i++
      });
    };
  });
});
