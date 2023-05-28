const taskForm = document.querySelector("#task-form");
const addButton = document.querySelector("#add-btn");

taskForm.addEventListener("submit", async function (event) {
  console.log("Submit!");
  event.preventDefault();
  // Serialize the Form afterwards
  const form = event.target;
  const formObject = {
    taskDescription: form.taskDescription.value,
    taskDuration: form.taskDuration.value,
    taskLocation: form.taskLocation.value,
    remarks: form.remarks.value,
    priority: form.priority.value,
  };

  const res = await fetch("/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formObject),
  });

  const result = await res.json(); // { success: true }
  document.querySelector("#contact-result").textContent = result;
});

addButton.addEventListener("click", async () => {
    await taskForm.dispatchEvent(new Event("submit"));
  });