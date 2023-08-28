const plan = document.querySelector("#plan-form");
const btnPanel = document.querySelector("#btn-panel");
const addButton = document.querySelector("#add-btn");
const okButton = document.querySelector("#ok-btn");
const delButton = document.querySelector(".del-btn");
const saveButton = document.querySelector("#save-btn");
const favButton = document.querySelector("#fav-btn");//sumsum
const logoutButton = document.querySelector("#logout-btn");
const gptButton = document.querySelector("#gpt-btn");

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

    document.querySelector(".offcanvas-body").innerHTML = `<div class="spinner-border text-light" role="status">
    <span class="visually-hidden">Loading...</span></div>`;
    // Triggering "click" of #gpt-btn//
    gptButton.dispatchEvent(new Event("click"));

  } else if (clickBtn === "save-btn") {
    //form data is wt is it filling now
    tempPlanForm(plan);
    tempTaskForm(allTaskForm);
  }

  console.log(planForm);
  console.log(taskFormArr);
  let combineFormData = {
    planFormData: planForm,
    taskFormData: taskFormArr,
    clickButton: clickBtn,
    planID: "",
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
  }

  let result = "";
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
      body: JSON.stringify({ en: body }),
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
      body: JSON.stringify({ en: body }),
    });
    result = await res.json(); // { success: true }
    console.log(result);
  }

  const resultContent = decrypt(result.en);
  console.log(resultContent);

  try {
    let checkID = document.querySelector(
      `p.savedPlanChoice[data-id="${resultContent.planID}"]`
    );
    if (checkID) {
      //if hv this id, then revise innerHTML
      updateNameOfPlanBtn(
        resultContent.planID,
        resultContent.planName,
        resultContent.planDate,
        "saved"
      );
    } else {
      //if dun hv this id, then create button
      createSavedPlanBtn(
        resultContent.planID,
        resultContent.planName,
        resultContent.planDate
      );
    }
    //change the url to show planID
    window.history.replaceState(null, "", `/search?ID=${resultContent.planID}`);

    //show result
    if (clickBtn === "ok-btn") {
      document.querySelector(".offcanvas-body").innerHTML =
        resultContent.resultHTML;
    }
    //sumsum
    if (resultContent.fav) {
      // fav plan

      favButton.firstElementChild.setAttribute("class", "fa-solid fa-heart");

      if (
        document.querySelector(
          `a.favPlanChoice[data-id="${resultContent.planID}"]`
        ) !== null
      ) {
        //if hv this id in fav list, then revise innerHTML
        updateNameOfPlanBtn(
          resultContent.planID,
          resultContent.planName,
          resultContent.planDate,
          "fav"
        );
      } else {
        //if dun hv this id in fav list, then create button
        createFavPlanBtn(
          resultContent.planID,
          resultContent.planName,
          resultContent.planDate
        );
      }
    } else {
      // not fav plan
      favButton.firstElementChild.setAttribute("class", "fa-regular fa-heart");
      if (
        document.querySelector(
          `a.favPlanChoice[data-id="${resultContent.planID}"]`
        ) !== null
      ) {
        //if hv this id in fav list, remove it
        document
          .querySelector(`a.favPlanChoice[data-id="${resultContent.planID}"]`)
          .parentNode.remove();
      } else {
        // do nothing
      }
    }
  } catch (e) {
    console.log(`createSavedPlanBtn: ${e}`);
  }
  clickBtn = "";
});

// create plan button when sumsum
function createFavPlanBtn(id, name, date) {
  let btn = document.createElement("li");

  if (name === "" && date === "") {
    btn.innerHTML = `<a class="dropdown-item favPlanChoice" data-id="${id}" href="#">New Plan</a>
    <button class="del-bmk-btn">
      <i class="bi bi-x-square del-bmk-btn-i"></i>
    </button>`;
  } else if (name === "") {
    btn.innerHTML = `<a class="dropdown-item favPlanChoice" data-id="${id}" href="#">New Plan - ${date}</a>
    <button class="del-bmk-btn">
      <i class="bi bi-x-square del-bmk-btn-i"></i>
    </button>`;
  } else if (date === "") {
    btn.innerHTML = `<a class="dropdown-item favPlanChoice" data-id="${id}" href="#">${name}</a>
    <button class="del-bmk-btn">
      <i class="bi bi-x-square del-bmk-btn-i"></i>
    </button>`;
  } else {
    btn.innerHTML = `<a class="dropdown-item favPlanChoice" data-id="${id}" href="#">${name} - ${date}</a>
    <button class="del-bmk-btn">
      <i class="bi bi-x-square del-bmk-btn-i"></i>
    </button>`;
  }
  // btn.id = id;
  // btn.classList.add('saved-plan-btn');
  document.querySelector(".bookmarked").appendChild(btn);
}

function updateNameOfPlanBtn(id, name, date, click) {
  let btn;
  if (click === "fav") {
    btn = document.querySelector(`a.favPlanChoice[data-id="${id}"]`);
  } else if (click === "saved") {
    btn = document.querySelector(`p.savedPlanChoice[data-id="${id}"]`);
  } else {
    return false;
  };
  if (name === "" && date === "") {
    btn.innerHTML = `New Plan`;
  } else if (name === "") {
    btn.innerHTML = `New Plan - ${date}`;
  } else if (date === "") {
    btn.innerHTML = `${name}`;
  } else {
    btn.innerHTML = `${name} - ${date}`;
  };
  return true;
};

// create plan button when saved
function createSavedPlanBtn(id, name, date) {
  let btn = document.createElement("li");

  if (name === "" && date === "") {
    btn.innerHTML = `<p class="saved-plans savedPlanChoice" data-id="${id}" href="#">New Plan</p><button class="del-saved-btn">
    <i class="bi bi-x-square del-saved-btn-i"></i>
  </button>`;
  } else if (name === "") {
    btn.innerHTML = `<p class="saved-plans savedPlanChoice" data-id="${id}" href="#">New Plan - ${date}</p><button class="del-saved-btn">
    <i class="bi bi-x-square del-saved-btn-i"></i>
  </button>`;
  } else if (date === "") {
    btn.innerHTML = `<p class="saved-plans savedPlanChoice" data-id="${id}" href="#">${name}</p><button class="del-saved-btn">
    <i class="bi bi-x-square del-saved-btn-i"></i>
  </button>`;
  } else {
    btn.innerHTML = `<p class="saved-plans savedPlanChoice" data-id="${id}" href="#">${name} - ${date}</p><button class="del-saved-btn">
    <i class="bi bi-x-square del-saved-btn-i"></i>
  </button>`;
  }
  // btn.id = id;
  // btn.classList.add('saved-plan-btn');
  document.querySelector("#saved-plan-list").appendChild(btn);
}

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
  drive: true,
  fav: false, //sumsum
};

function validatePlanForm(plan) {
  if (plan.planName.value === "") {
    planForm.planName = "New Plan";
  } else {
    planForm.planName = plan.planName.value;
  }
  if (plan.planDate.value === "") {
    let tdy = new Date();
    let year = tdy.getFullYear();
    let month = tdy.getMonth() + 1;
    month = month.toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });
    let day = tdy.getDate() + 1;
    day = day.toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });
    let dateString = `${year}-${month}-${day}`;
    planForm.planDate = dateString;
  } else {
    planForm.planDate = plan.planDate.value;
  }
  planForm.startLocation = plan.startLocation.value;
  planForm.returnLocation = plan.returnLocation.value;
  if (plan.startTime.value === "") {
    planForm.startTime = "09:00";
  } else {
    planForm.startTime = plan.startTime.value;
  }
  if (plan.endTime.value === "") {
    planForm.endTime = "17:00";
  } else {
    planForm.endTime = plan.endTime.value;
  }
  if (plan.lunchStart.value === "") {
    planForm.lunchStart = "12:30";
  } else {
    planForm.lunchStart = plan.lunchStart.value;
  }
  if (plan.lunchEnd.value === "") {
    planForm.lunchEnd = "13:30";
  } else {
    planForm.lunchEnd = plan.lunchEnd.value;
  }
  planForm.dinnerStart = plan.dinnerStart.value;
  planForm.dinnerEnd = plan.dinnerEnd.value;
  if (
    plan.pubTrans.checked === false &&
    plan.walk.checked === false &&
    plan.drive.checked === false
  ) {
    planForm.drive = true;
    planForm.pubTrans = plan.pubTrans.checked;
    planForm.walk = plan.walk.checked;
  } else {
    planForm.drive = plan.drive.checked;
    planForm.pubTrans = plan.pubTrans.checked;
    planForm.walk = plan.walk.checked;
  }
  //sumsum
  if (favButton.firstElementChild.classList.contains("fa-regular")) {
    planForm.fav = false;
  } else {
    planForm.fav = true;
  };
  return true;
}

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
  //sumsum
  if (favButton.firstElementChild.classList.contains("fa-regular")) {
    planForm.fav = false;
  } else {
    planForm.fav = true;
  };
  return true;
}

let taskFormArr = [];
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
    } else if (task.taskDuration.value < 0) {
      console.log(i);
      alert("Task Duration must be >0");
      result = false;
      break;
    }
  }
  for (let [i, task] of allTaskForm.entries()) {
    taskFormArr[i] = {
      taskDescription: task.taskDescription.value,
      taskDuration: task.taskDuration.value,
      taskLocation: task.taskLocation.value,
      remarks: task.remarks.value,
      priority: task.priority.checked,
    };
  }
  return result;
}

function tempTaskForm(allTaskForm) {
  for (let [i, task] of allTaskForm.entries()) {
    taskFormArr[i] = {
      taskDescription: task.taskDescription.value,
      taskDuration: task.taskDuration.value,
      taskLocation: task.taskLocation.value,
      remarks: task.remarks.value,
      priority: task.priority.checked,
    };
  }
  return true;
}

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

delButton.addEventListener("click", () => {
  if (document.querySelectorAll(".task-container").length === 1) {
    console.log("Input at least 1 task.");
  } else {
    //Fade-out effect in CSS////Fade-out effect in CSS//  
    setTimeout(()=>{document.querySelector(".task-container").remove()}, 500);
    document.querySelector(".task-container").classList.add("fade-out");
    // firstTask.classList.remove("fade-in");
    // setTimeout(()=>{document.querySelector(".task-container").classList.remove("fade-out")}, 1000);
    setTimeout(()=>{
      let i = 1;
      document.querySelectorAll(".task-count").forEach((e) => {
      e.innerHTML = i;
      i++; 
      });
  }, 501);
}});

addButton.addEventListener("click", () => {
  let newNode = document.querySelector(".task-container").cloneNode(true);
  console.log(newNode);
  newNode.querySelector(".task-count").innerHTML =
    document.querySelectorAll(".task-container").length + 1;
  newNode.querySelector(".taskDescription").value = "";
  newNode.querySelector(".taskDuration").value = 1;
  newNode.querySelector(".taskLocation").value = "";
  newNode.querySelector(".remarks").value = "";
  newNode.querySelector(".priority").checked = false;
  newNode.classList.add("fade-in");
  document.querySelector("#task-list").appendChild(newNode);
  newNode.scrollIntoView({ behavior: "smooth" });
  //DEL-BUTTON IN NEW TASK //DEL-BUTTON IN NEW TASK //DEL-BUTTON IN NEW TASK//
  let newDelBtn = newNode.querySelector(".del-btn");
  newDelBtn.addEventListener("click", () => {
    if (document.querySelectorAll(".task-container").length === 1) {
      console.log("Input at least 1 task.");
    } else {
      //Fade-out effect in CSS////Fade-out effect in CSS//
      setTimeout(()=>{newNode.remove()}, 500);
      newNode.classList.add("fade-out");
      // setTimeout(()=>{newNode.classList.remove("fade-out")}, 500);
      // newNode.classList.remove("fade-in");
      setTimeout(()=>{
      let i = 1;
      document.querySelectorAll(".task-count").forEach((e) => {
        e.innerHTML = i;
        i++;
      });
    }, 501);
    }
  });
});

logoutButton.addEventListener("click", async () => {
  try {
    const res = await fetch("/logout", {
      method: "POST",
    });
    if (res.status === 200) {
      window.location = "/";
    }
  } catch (err) {
    console.log(err);
    throw new Error("Failed to logout");
  }
});

//sumsum
favButton.addEventListener("click", () => {
  console.log("sumsum clicked!");
  if (favButton.firstElementChild.classList.contains("fa-regular")) {
    favButton.firstElementChild.setAttribute("class", "fa-solid fa-heart");
  } else {
    favButton.firstElementChild.setAttribute("class", "fa-regular fa-heart");
  };
  clickBtn = "save-btn";
  plan.dispatchEvent(new Event("submit"));
});

document.body.addEventListener("click", (e) => {
  console.log(e.currenttarget);
  console.log(e.target);
});