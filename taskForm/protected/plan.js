const createBtn = document.querySelector("#create-plan");
const savedPlanList = document.querySelector("#saved-plan-list");
const bookmarkedList = document.querySelector(".bookmarked");

// create new plan
createBtn.addEventListener("click", async () => {
  const res = await fetch("/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ clickButton: "create-btn" }),
  });
  const result = await res.json();
  console.log(result);
  window.location = "forms.html";
  favButton.firstElementChild.setAttribute("class", "fa-regular fa-heart");
});

// open/del saved plan in side bar
savedPlanList.addEventListener("click", async (e) => {
  // console.log(`e.target : ${e.target.id} , e.currentTarget : ${e.currentTarget.className}`);

  // let body = await encrypt({ planID: e.target.id });
  // console.log(body);
  e.preventDefault();

  let targetClass = e.target.classList;
  if (targetClass.contains("del-saved-btn-i")) {
    console.log("you want to del! " + e.target.classList);
    const savedPlanID = e.target.parentNode.previousElementSibling.dataset.id;
    const res = await fetch("/savedPlans", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ planID: savedPlanID }),
    });
    result = await res.json();
    console.log(result);
    if (result.success) {
      e.target.parentNode.parentNode.remove();
      if (document.querySelector(`a.favPlanChoice[data-id="${savedPlanID}"]`)) {
        document
          .querySelector(`a.favPlanChoice[data-id="${savedPlanID}"]`)
          .parentNode.remove();
      }
    }
    updateURLAfterDel(savedPlanID);
  } else if (targetClass.contains("saved-plans")) {
    console.log("you want to open! " + e.target.classList);
    console.log(e.target.dataset.id);
    const planID = e.target.dataset.id;
    const url = `/search?ID=${planID}`;
    history.pushState({}, "", url);
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await res.json(); // { success: true }
    console.log(result);
    const resultContent = decrypt(JSON.parse(result.content).en);
    console.log(resultContent);

    //write to html
    fillPlanInfo(resultContent, result.fav); //sumsum
    fillTaskInfo(resultContent);
    //show result
    if (!result.ans) {
      console.log("no saved ans");
      document.querySelector(".offcanvas-body").innerHTML = "...";
    } else {
      document.querySelector(".offcanvas-body").innerHTML = result.ans;
    }
  } else {
    console.log("where you click???");
    console.log(e.target.classList);
  }
});

function fillPlanInfo(responseData, resfav) {
  const planForm = document.querySelector("#plan-form");
  // Set value
  planForm.planName.value = responseData.planFormData.planName;
  planForm.planDate.value = responseData.planFormData.planDate;
  planForm.startLocation.value = responseData.planFormData.startLocation;
  planForm.returnLocation.value = responseData.planFormData.returnLocation;
  planForm.startTime.value = responseData.planFormData.startTime;
  planForm.endTime.value = responseData.planFormData.endTime;
  planForm.lunchStart.value = responseData.planFormData.lunchStart;
  planForm.lunchEnd.value = responseData.planFormData.lunchEnd;
  planForm.dinnerStart.value = responseData.planFormData.dinnerStart;
  planForm.dinnerEnd.value = responseData.planFormData.dinnerEnd;
  planForm.pubTrans.checked = responseData.planFormData.pubTrans;
  planForm.walk.checked = responseData.planFormData.walk;
  planForm.drive.checked = responseData.planFormData.drive;
  //sumsum
  if (resfav) {
    favButton.firstElementChild.setAttribute("class", "fa-solid fa-heart");
  } else {
    favButton.firstElementChild.setAttribute("class", "fa-regular fa-heart");
  };
}
async function fillTaskInfo(responseData) {
  //reset task list
  const taskList = document.querySelector("#task-list");
  taskList.innerHTML = "";
  // create form
  for (let i = 0; i < responseData.taskFormData.length; i++) {
    const newTaskContainer = document.createElement("div");
    newTaskContainer.classList.add("task-container");
    let res = await fetch("task-form.html");
    let html = await res.text();
    newTaskContainer.innerHTML = html;
    //task count
    newTaskContainer.querySelector(".task-count").innerHTML =
      document.querySelectorAll(".task-container").length + 1;
    //insert before div id=endlist
    document
      .querySelector("#task-list")
      .insertBefore(newTaskContainer, document.querySelector("#endList"));
  }
  // set value
  const taskForms = document.querySelectorAll(".task-form");
  for (let i = 0; i < responseData.taskFormData.length; i++) {
    const taskData = responseData.taskFormData[i];
    taskForms[i].taskDescription.value = taskData.taskDescription;
    taskForms[i].taskDuration.value = taskData.taskDuration;
    taskForms[i].taskLocation.value = taskData.taskLocation;
    taskForms[i].remarks.value = taskData.remarks;
    taskForms[i].priority.checked = taskData.priority;
    let currentTaskContainer = document.querySelectorAll(".task-container")[i];
    currentTaskContainer
      .querySelector(".del-btn")
      .addEventListener("click", () => {
        if (document.querySelectorAll(".task-container").length === 1) {
          console.log(
            Array.prototype.indexOf.call(
              document.querySelectorAll(".task-container"),
              currentTaskContainer.querySelector(".del-btn").parentNode
            )
          );
        } else {
          currentTaskContainer.querySelector(".del-btn").parentNode.parentNode.parentNode.remove();
        }
        let j = 1;
        document.querySelectorAll(".task-count").forEach((e) => {
          e.innerHTML = j;
          j++;
        });
      });
  }
}

// rmb to make: add new div for plan when save is clicked
// done in forms.js when click save/ok-btn

// create button according to user's saved plans when page onload
window.onload = async () => {
  // const userName = 'katie';
  const res = await fetch(`/onload`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const result = await res.json(); // { success: true }

  if (!result.resultMsg) {
    console.log("no saved plan found");
  } else {
    // create button for each saved plan
    // normal i=0, but if use "katie" try start from i=15 becuz some old data (not yet del) will make error
    for (let i = 0; i < result.resultMsg.length; i++) {
      const encrypted = JSON.parse(result.resultMsg[i].encryptedContent);
      console.log("now:" + encrypted);
      const resultContent = decrypt(encrypted.en);
      createSavedPlanBtn(
        result.resultMsg[i].planID,
        resultContent.planFormData.planName,
        resultContent.planFormData.planDate
      );
      if (result.resultMsg[i].fav) {
        // fav plan sumsum
        createFavPlanBtn(
          result.resultMsg[i].planID,
          resultContent.planFormData.planName,
          resultContent.planFormData.planDate
        );
      } else {
      }
    }
  }
};

// for encrypt
let secret = "dskngiuewnvlkdnvioenvlkniowe";
let options = { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 };

function encrypt(data) {
  console.log(JSON.stringify(data));
  let json = CryptoJS.AES.encrypt(JSON.stringify(data), secret, options);
  console.log(json);
  let encrypt = json.formatter.stringify(json);
  console.log("encrypt", encrypt);
  return encrypt;
}

function decrypt(encrypt) {
  let decrypt = CryptoJS.AES.decrypt(encrypt, secret, options);
  // console.log(decrypt)
  let data = decrypt.toString(CryptoJS.enc.Utf8);
  let reqData = JSON.stringify(data);
  // console.log("decrypt", reqData);
  // console.log(JSON.parse(reqData));
  let reqDataObj = JSON.parse(JSON.parse(reqData));
  console.log(reqDataObj);
  return reqDataObj;
}

// open/del saved plan in nav bar
bookmarkedList.addEventListener("click", async (e) => {
  e.preventDefault();
  let targetClass = e.target.classList;
  if (targetClass.contains("del-bmk-btn-i")) {
    console.log("you want to del! " + e.target.classList);
    const savedPlanID = e.target.parentNode.previousElementSibling.dataset.id;
    console.log("savedPlanID" + savedPlanID);
    const res = await fetch("/savedPlans", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ planID: savedPlanID }),
    });
    result = await res.json();
    console.log(result);
    if (result.success) {
      e.target.parentNode.parentNode.remove();
      document
        .querySelector(`p.savedPlanChoice[data-id="${savedPlanID}"]`)
        .parentNode.remove();
    }

    updateURLAfterDel(savedPlanID);
  } else if (targetClass.contains("dropdown-item")) {
    console.log("you want to open! " + e.target.classList);
    console.log(e.target.dataset.id);
    const planID = e.target.dataset.id;
    const url = `/search?ID=${planID}`;
    history.pushState({}, "", url);
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await res.json(); // { success: true }
    console.log(result);
    const resultContent = decrypt(JSON.parse(result.content).en);
    console.log(resultContent);

    //write to html
    fillPlanInfo(resultContent, result.fav); //sumsum
    fillTaskInfo(resultContent);
    //show result
    if (!result.ans) {
      console.log("no saved ans");
    } else {
      document.querySelector(".offcanvas-body").innerHTML = result.ans;
    }
  } else {
    console.log("where you click???");
    console.log(e.target.classList);
  }
});

//may need to change the url to not show deleted planID when del
async function updateURLAfterDel(id) {
  const searchParams = new URLSearchParams(window.location.search);
  let planID = await searchParams.get("ID");
  if (planID === id) {
    window.history.replaceState(null, "", `/forms`);
    return true;
  } else {
    return true;
  }
}
