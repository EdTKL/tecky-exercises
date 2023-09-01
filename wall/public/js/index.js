const login = document.getElementById("login");

login.addEventListener("submit", async (e) => {
  e.preventDefault(); // Prevent the form from submitting synchronously
  // Create your form object with the form inputs
  // formObject["SomeCol"] = form.SomeCol.value;
  const form = e.target;
  const formObj = {
    username: form.username.value,
    password: form.password.value,
  };

  const res = await fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formObj),
  });
  const result = await res.json();
  if (res.ok) {
      location.assign(result.url);
  } else if (res.status === 401) {
    alert(result.err);
  }
  // Clear the form here
  form.reset();
});