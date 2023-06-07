//scripting the nav-menu list show feature on click::
const list = document.querySelector(".list");
const option_btn = document.getElementById("options");
option_btn.addEventListener("click", ()=>{
    list.classList.toggle("list--show");
})



//removing login signup options whwn a user is logged in::
 (async function(){

    const userUrl = "/fetchuser";
    const wlurl = "/fetchMyFav";

    const wd = await fetch(wlurl);
    const wishD = await wd.json();

    const u = await fetch(userUrl);
    const userdata = await u.json();

    //srttting up the header bar::
    if (userdata != [] || userdata != null || userdata != undefined){
        document.getElementById("hide").style.display = "none";

        document.getElementById("loginuser_image").style.backgroundImage = `url("${userdata[0].user_image}")`;

        list.firstElementChild.remove();

    let changedFirstChild = `
    <div class="logIn-signUp">
    <a href="myprofile"><p>&emsp;My Profile</p></a>
    <a href="/myFavourites"><p>&emsp;My Wishlist</p>
        <div class="air-information">
            <p class='no_of_info'>1</p>
        </div>
    </a>
    <a class="type-hidden"  href="hostedproperties"><p>&emsp;My Hostings</p></a>
    <a href="/mybookingspage"><p>&emsp;My bookings</p></a>
    <a href="/contactus"><p>&emsp;Help</p></a>
    <a href="/logout"><p>&emsp;Log Out</p></a>
    </div>`;

    const range = document.createRange();
    const docFrag = range.createContextualFragment(changedFirstChild);
    list.appendChild(docFrag);


    const typeH = document.querySelector(".type-hidden");
    const typeH1 = document.querySelector(".type-hidden-1");

    if (userdata[0].user_type == "guest"){
        typeH.remove();
        typeH1.remove();
    };

    document.querySelector(".no_of_info").textContent = wishD.length;
    document.querySelector(".no_of_info").style.color = "white";
    }
 } ());


    


