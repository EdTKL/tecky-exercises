const planForm = document.querySelector("#plan-form");
const taskForm = document.querySelector("#task-form");
const okButton = document.querySelector("#ok-btn");


//PLAN FORM INPUT
planForm.addEventListener("submit", async function (event) {
  event.preventDefault();
  console.log("plan submit!");
  // Serialize the Form afterwards
  // const form = event.target;
  const planFormObject = {
    planName: planForm.planName.value,
    planDate: planForm.planDate.value,
    startLocation: planForm.startLocation.value,
    returnLocation: planForm.returnLocation.value,
    startTime: planForm.startTime.value,
    endTime: planForm.endTime.value,
    lunchStart: planForm.lunchStart.value,
    lunchEnd: planForm.lunchEnd.value,
    dinnerStart: planForm.dinnerStart.value,
    dinnerEnd: planForm.dinnerEnd.value,
    pubTrans: planForm.pubTrans.value,
    walk: planForm.walk.value,
    drive: planForm.drive.value,
  };
  const taskFormObject = {
    taskDescription: taskForm.taskDescription.value,
    taskDuration: taskForm.taskDuration.value,
    taskLocation: taskForm.taskLocation.value,
    remarks: taskForm.remarks.value,
    priority: taskForm.priority.value,
  };

  const combineFormObj = Object.assign(planFormObject,taskFormObject)
  // console.log(formObject)
  const res = await fetch("/forms", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(combineFormObj),
  });

  const result = await res.json(); // { Success: true }
  console.log(result);
});

//TASK FORM INPUT
// taskForm.addEventListener("submit", async function (event) {
//   event.preventDefault();
//   console.log("task submit!");
//   // Serialize the Form afterwards
//   const form = event.target;
//   const formObject = {
//     taskDescription: form.taskDescription.value,
//     taskDuration: form.taskDuration.value,
//     taskLocation: form.taskLocation.value,
//     remarks: form.remarks.value,
//     priority: form.priority.value,
//   };

//   const res = await fetch("/forms", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(formObject),
//   });

//   const result = await res.json(); // { Success: true }
//   console.log(result);
// });

okButton.addEventListener("click", async () => {
  console.log("okButton clicked!")
  await planForm.dispatchEvent(new Event("submit"));
  // await taskForm.dispatchEvent(new Event("submit"));
});