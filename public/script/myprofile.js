//scripting the nav-menu list show feature on click::
const list = document.querySelector(".list");
const option_btn = document.getElementById("options");
option_btn.addEventListener("click", ()=>{
    list.classList.toggle("list--show");
})


//removing login signup options whwn a user is logged in::
list.firstElementChild.remove();
let changedFirstChild = `
<div class="logIn-signUp">
    <a href="myprofile"><p>&emsp;My Profile</p></a>
    <a href="/myFavourites"><p>&emsp;My Wishlist</p>
        <div class="air-information">
            <p class='no_of_info'>1</p>
        </div>
    </a>
    <a class='type-hidden' href="hostedproperties"><p>&emsp;My Hostings</p></a>
    <a href="/mybookingspage"><p>&emsp;My bookings</p></a>
    <a href="/logout"><p>&emsp;Log Out</p></a>
</div>`;

const range = document.createRange();
const docFrag = range.createContextualFragment(changedFirstChild);
list.appendChild(docFrag);


const edit_btn = document.getElementsByClassName("edit_button");
const myprofile_inputs = document.getElementsByClassName("myprofile_inputs");
const input = document.getElementsByClassName("input");
console.log(myprofile_inputs);
console.log(input);

const inp_pass = document.querySelector("#inp_pass");
const pass_profile = document.querySelector("#pass_profile");
const pass_btn = document.querySelector("#pass_btn");

for (let i=0; i<edit_btn.length; i++){

    edit_btn[i].addEventListener("click", ()=>{
        

        if(edit_btn[i].textContent == "Save"){
            myprofile_inputs[i].classList.add("user-select-none");
            edit_btn[i].textContent = "Edit";
            input[i].classList.remove("indent");
            pass_btn.addEventListener("click", ()=>{
                inp_pass.placeholder = "Mandatory* field!!";
            })
        }else{
            myprofile_inputs[i].classList.remove("user-select-none");
            edit_btn[i].textContent = "Save";
            input[i].classList.add("indent");
            inp_pass.classList.add("indent");
            pass_profile.classList.remove("user-select-none");
            pass_btn.textContent = "Save"
            inp_pass.placeholder = "Mandatory* field!";
            inp_pass.placeholder.color = "red";
            pass_btn.addEventListener("click", ()=>{
                inp_pass.placeholder = "*********";
            });
        };
            
        });
    };

//scripting the delete account button on the page::
const deleteAcc = document.getElementById("delete_acc");
const confirmBox = document.querySelector(".confirm_box");
const cancelBtn = document.getElementById("cancel");

deleteAcc.addEventListener("click", ()=>{
    confirmBox.classList.toggle("hide_me");
});

cancelBtn.addEventListener("click", ()=>{
    confirmBox.classList.add("hide_me");
});

const deleteuser = document.getElementById("delete-user");

// deleteuser.addEventListener("click", async()=>{
//     const delurl = "/deleteuser";
//     await fetch(delurl).then(res=> {
//         if (res.status==200){
//             alert("acc deleted");
//         }
//     });


// });

//IIFE::
(async function (){
    let wishlisturl = "/fetchMyFav";
    const userUrl = "/fetchuser";

        const wd = await fetch(wishlisturl);
        const wishD = await wd.json();

        const u = await fetch(userUrl);
        const userdata = await u.json();

        document.querySelector(".no_of_info").textContent = wishD.length;
        document.querySelector(".no_of_info").style.color = "white";

        const typeH = document.querySelector(".type-hidden");
        const typeH1 = document.querySelector(".type-hidden-1");
        
        if (userdata[0].user_type == "guest"){
            typeH.remove();
            typeH1.remove();
        };

        const user_img = document.querySelector(".my_user_image");

        user_img.style.backgroundImage = `url("${userdata[0].user_image}")`;

        document.getElementById("hide").style.display = "none";

        document.getElementById("loginuser_image").style.backgroundImage = `url("getImages/${userdata[0].user_image}")`
}());