const logout = document.getElementById("logout");
const memo = document.getElementById("memo-form");

memo.addEventListener("submit", async (e) => {
  e.preventDefault(); // Prevent the form from submitting synchronously
  // Create your form object with the form inputs
  // formObject["SomeCol"] = form.SomeCol.value;
  const form = e.target;
  const formData = new FormData(form);

  const res = await fetch("/memo", {
    method: "POST",
    body: formData,
  });
  const result = await res.json();
  if (res.ok) {
    console.log(result)
    loadMemos();
    form.reset();

  }
});

logout.addEventListener("click", async (e) => {
  const res = await fetch("/logout");
  const result = await res.json();
  if (res.ok) {
    location.assign(result.url);
  }
});

async function loadMemos() {
  const res = await fetch("/all-memos"); // Fetch from the correct url
  const memos = await res.json();
  const cardContainer = document.getElementById("card-container");
  cardContainer.innerHTML = ``
  for (let memo of memos) {
    // Create a new element
    const memoDiv = document.createElement('div');
    memoDiv.className = "card";
    memoDiv.innerHTML = `
      <img src="" class="card-img-top" alt="">
      <div class="card-body">
        <p class="card-text">${memo.text}</p>
        <button class="btn del-btn">
          <i class="bi bi-trash3-fill"></i>
        </button>
        <button class="btn edit-btn">
          <i class="bi bi-pencil-fill"></i>
        </button>
      </div>
    `;
    // Append it to the container
    cardContainer.appendChild(memoDiv);
  }
  //Open editor on <p>
  const cardTexts = document.querySelectorAll(".card-text");
    cardTexts.forEach( (p) => {
      p.addEventListener("click", () => {
        p.contentEditable = true;
        p.focus();
      });
    })
  //Confirm edited <p> and fetch
  const editBtns = document.querySelectorAll(".edit-btn");
  editBtns.forEach( (btn, idx) => {
    btn.addEventListener("click", async () => {
      const res = await fetch(`/memo/${idx}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: cardTexts[idx].innerText }),
      })
      const result = await res.json();
      console.log("edited", result)
    });
  });
  //Delete card
  const delBtns = document.querySelectorAll(".del-btn");
  delBtns.forEach( (btn, idx) => {
    btn.addEventListener("click", async () => {
      const res = await fetch(`/memo/${idx}`, {
        method: "DELETE",
      })
      const result = await res.json();
      if (res.ok) {
        console.log("deleted", result)
        loadMemos();
      }
    });
  });
}



window.addEventListener('load', async() => { await loadMemos(); })
