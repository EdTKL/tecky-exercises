// const { after } = require("node:test");

const plan = document.querySelector("#plan-form");
// const task = document.querySelector("#task-form");
const btnPanel = document.querySelector("#btn-panel");
const addButton = document.querySelector("#add-btn");
const okButton = document.querySelector("#ok-btn");
const delButton = document.querySelector(".del-btn");
const allTaskForms = document.querySelectorAll(".task-form");
// const task = document.querySelector(".task-container");


//PLAN FORM INPUT//PLAN FORM INPUT//PLAN FORM INPUT
plan.addEventListener("submit", async function (event) {
  event.preventDefault();
  console.log("plan submit!");
  const planForm = {
    planName: plan.planName.value,
    planDate: plan.planDate.value,
    startLocation: plan.startLocation.value,
    returnLocation: plan.returnLocation.value,
    startTime: plan.startTime.value,
    endTime: plan.endTime.value,
    lunchStart: plan.lunchStart.value,
    lunchEnd: plan.lunchEnd.value,
    dinnerStart: plan.dinnerStart.value,
    dinnerEnd: plan.dinnerEnd.value,
    pubTrans: plan.pubTrans.checked,
    walk: plan.walk.checked,
    drive: plan.drive.checked,
  };
  let taskFormArr = [];
  allTaskForms.forEach(task => {
    // console.log(task)
    taskFormArr.push({
        taskDescription: task.taskDescription.value,
        taskDuration: task.taskDuration.value,
        taskLocation: task.taskLocation.value,
        remarks: task.remarks.value,
        priority: task.priority.checked,
    })
  });
  let combinedFormData = {
    "planFormData": planForm,
    "taskFomData": taskFormArr
  }
  console.log(combinedFormData)
  const res = await fetch("/forms", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(combinedFormData),
  });
  const result = await res.json(); // { success: true }
  console.log(result);
});

//TASK FORM INPUT//TASK FORM INPUT//TASK FORM INPUT
// const taskForm = {
//   taskDescription: task.taskDescription.value,
//   taskDuration: task.taskDuration.value,
//   taskLocation: task.taskLocation.value,
//   remarks: task.remarks.value,
//   priority: task.priority.checked,
// };
// const combinedForm = Object.assign(planForm, taskForm);

delButton.addEventListener('click', () => {
  if (document.querySelectorAll('.task-container').length === 1) {
  console.log('Input at least 1 task.');
  } else {
  document.querySelector('.task-container').remove();
  let i = 1;
  document.querySelectorAll('.task-count').forEach(e => {
    e.innerHTML = i;
    i++
  })};
});

addButton.addEventListener('click', () => {
  let newNode = document.querySelector('.task-container').cloneNode(true);
  console.log(newNode)
  newNode.querySelector('.task-count').innerHTML = document.querySelectorAll('.task-container').length+1;
  newNode.querySelector('#taskDescription').value = '';
  newNode.querySelector('#taskDuration').value = 1;
  newNode.querySelector('#taskLocation').value = '';
  newNode.querySelector('#remarks').value = '';
  newNode.querySelector('#priority').checked = false;
  newNode.classList.add("fade-in");
  document.querySelector('#task-list').appendChild(newNode)
  newNode.scrollIntoView({ behavior: "smooth"});
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

okButton.addEventListener("click", () => {
    console.log("okButton clicked!");
    plan.dispatchEvent(new Event("submit"));
    // await taskForm.dispatchEvent(new Event("submit"));
  });
