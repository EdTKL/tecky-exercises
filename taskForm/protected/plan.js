const createBtn = document.querySelector("#create-plan");
const savedPlanList = document.querySelector(".saved-plan-list");

// create new plan
createBtn.addEventListener('click', async () => {
    const res = await fetch("/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ clickButton: "create-btn" })
    });
    const result = await res.json();
    console.log(result);
    window.location = 'forms.html';
});

// open saved plan
savedPlanList.addEventListener("click", async (e) => {
    // console.log(`e.target : ${e.target.id} , e.currentTarget : ${e.currentTarget.className}`);

    // let body = await encrypt({ planID: e.target.id });
    // console.log(body);
    const planID = e.target.id;
    const url = `/search?ID=${planID}`;
    history.pushState({}, '', url);
    const res = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const result = await res.json(); // { success: true }
    console.log(result);
    const resultContent = decrypt(JSON.parse(result).en);
    console.log(resultContent);

    //write to html
    fillPlanInfo(resultContent);
    fillTaskInfo(resultContent);

});

function fillPlanInfo(responseData) {
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
};
async function fillTaskInfo(responseData) {
    //reset task list
    const taskList = document.querySelector("#task-list");
    taskList.innerHTML = "";
    // create form
    for (let i = 0; i < responseData.taskFormData.length; i++) {
        const newTaskContainer = document.createElement("div");
        newTaskContainer.classList.add("task-container");
        let res = await fetch('task-form.html');
        let html = await res.text();
        newTaskContainer.innerHTML = html;
        //task count
        newTaskContainer.querySelector('.task-count').innerHTML = document.querySelectorAll('.task-container').length + 1;
        //insert before div id=endlist
        document.querySelector("#task-list").insertBefore(newTaskContainer, document.querySelector("#endList"));
    };
    // set value
    const taskForms = document.querySelectorAll(".task-form");
    for (let i = 0; i < responseData.taskFormData.length; i++) {
        const taskData = responseData.taskFormData[i];
        taskForms[i].taskDescription.value = taskData.taskDescription;
        taskForms[i].taskDuration.value = taskData.taskDuration;
        taskForms[i].taskLocation.value = taskData.taskLocation;
        taskForms[i].remarks.value = taskData.remarks;
        taskForms[i].priority.checked = taskData.priority;
        let currentTaskContainer = document.querySelectorAll('.task-container')[i];
        currentTaskContainer.querySelector('.del-btn').addEventListener('click', () => {
            if (document.querySelectorAll('.task-container').length === 1) {
                console.log(Array.prototype.indexOf.call(document.querySelectorAll('.task-container'), currentTaskContainer.querySelector('.del-btn').parentNode));
            } else {
                currentTaskContainer.querySelector('.del-btn').parentNode.remove();
            };
            let j = 1;
            document.querySelectorAll('.task-count').forEach(e => {
                e.innerHTML = j;
                j++
            });

        });
    };

};

// rmb to make: add new div for plan when save is clicked
// done in forms.js when click save/ok-btn


// create button according to user's saved plans when page onload
window.onload = async () => {
    const userName = 'katie';
    const res = await fetch(`/login?username=${userName}`, {
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
        for (let i = 15; i < result.resultMsg.length; i++) {
            const encrypted = JSON.parse(result.resultMsg[i].encryptedContent);
            console.log("now:" + encrypted);
            const resultContent = decrypt(encrypted.en);
            createSavedPlanBtn(result.resultMsg[i].planID, resultContent.planFormData.planName, resultContent.planFormData.planDate);
        };
    };
};

// for encrypt
let secret = 'dskngiuewnvlkdnvioenvlkniowe';
let options = { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 };

function encrypt(data) {
  console.log(JSON.stringify(data));
  let json = CryptoJS.AES.encrypt(JSON.stringify(data), secret, options);
  console.log(json);
  let encrypt = json.formatter.stringify(json);
  console.log("encrypt", encrypt);
  return encrypt;
};

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
};