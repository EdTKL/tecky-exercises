// Change the selector to select your memo input form
const memo = document.querySelector('#memo-form');

memo.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent the form from submitting synchronously
    const form = e.target;
    let formObj = {}
    // Create your form object with the form inputs
    // formObject["SomeCol"] = form.SomeCol.value;
  
    const res = await fetch('/memos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formObject),
    });
  
    // Clear the form here
  })



// document.addEventListener('mouseover',function(e){
//     var cursor = e.target.style.cursor;
//     console.log(cursor);
// },false);