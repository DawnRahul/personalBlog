
let deleteIcon = document.querySelector(".del-icon");
let cancelBtn = document.querySelector(".form-btn-n");
let delContainer = document.querySelector(".del-container");

deleteIcon.addEventListener("click",()=>{
    //post delete confirmation
    // Are you sure? Yes or Cancel
    delContainer.style.display = "flex";
});

cancelBtn.addEventListener("click",()=>{
    //close delete conformation dialog box
    delContainer.style.display = "none";
});

