const login = document.getElementById('login');
const logout = document.getElementById('logout');
const memo = document.querySelector('.memo-form');

login.addEventListener('submit', async (e) => {
  // e.preventDefault(); // Prevent the form from submitting synchronously
  // Create your form object with the form inputs
  // formObject["SomeCol"] = form.SomeCol.value;
  const form = e.target
  const formObj = {
    username: form.username.value,
    password: form.password.value
  }
  console.log(formObj);

  const res = await fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formObj)
  });

  // Clear the form here
  form.reset();
})

logout.addEventListener(onclick, async (e) => {
  // e.preventDefault(); // Prevent the form from submitting synchronously
  // Create your form object with the form inputs
  // formObject["SomeCol"] = form.SomeCol.value;
  const form = e.target
  const formObj = {
    username: form.username.value,
    password: form.password.value
  }
  console.log(formObj);

  const res = await fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formObj)
  });

  // Clear the form here
  form.reset();
})

memo.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent the form from submitting synchronously
    // Create your form object with the form inputs
    // formObject["SomeCol"] = form.SomeCol.value;
    const form = e.target;
    const formData = new FormData(form);
    formData.append('text', form.text.value)

    const res = await fetch('/memo', {
      method: 'POST',
      body: formData
    });
  
    // Clear the form here
    form.reset();
  })



// document.addEventListener('mouseover',function(e){
//     var cursor = e.target.style.cursor;
//     console.log(cursor);
// },false);