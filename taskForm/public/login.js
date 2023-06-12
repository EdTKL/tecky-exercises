const loginForm = document.querySelector("#login-form");
const loginBtn = document.querySelector("#login-btn");
const regForm = document.querySelector("#reg-form");
const regBtn = document.querySelector("#reg-btn");
const tryBtn = document.querySelector("#try-btn");
const loginWindow = document.querySelector("#login-window");
const delBtn = document.querySelector("#del-btn");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  document.querySelector("#error-message").innerHTML = "";
  // ...Rest of the Form populating logic
  const form = event.target;
  const formObject = {
    name: form.name.value,
    password: form.password.value,
  };
  const res = await fetch("/login", {
    // Login Body and Headers
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formObject),
  });

  form.reset();
  if (res.status === 200) {
    window.location = "./forms.html";
  } else {
    document.querySelector("#error-message").innerHTML += `
				<div class="alert alert-danger" id="login-error" role="alert">
					Wrong Username/Password
				</div>
			`;
  }
});

regForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  document.querySelector("#reg-message").innerHTML = "";
  // ...Rest of the Form populating logic
  const form = event.target;
  const formObject = {
    name: form.name.value,
    email: form.email.value,
    password: form.password.value,
  };
  const res = await fetch("/reg", {
    // Login Body and Headers
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formObject),
  });

  form.reset();
  if (res.status === 200) {
    document.querySelector("#reg-message").innerHTML += `
				<div class="alert alert-danger" id="reg-error" role="alert">
					Registration successful!
				</div>
			`;
  } else {
    document.querySelector("#reg-message").innerHTML += `
				<div class="alert alert-danger" id="reg-error" role="alert">
					An error has occurred. Please use another user name / email address.
				</div>
			`;
  }
});

//...TRY BUTTON...////...TRY BUTTON...//

tryBtn.addEventListener('click', () => {
  loginWindow.classList.add("fade-in");
  loginWindow.style.visibility = "visible";
});

delBtn.addEventListener('click', () => {
  setTimeout(()=>{loginWindow.style.visibility = "hidden"}, 1000);
  loginWindow.classList.add("fade-out");
  loginWindow.classList.remove("fade-in");
  setTimeout(()=>{loginWindow.classList.remove("fade-out")}, 1000);
});