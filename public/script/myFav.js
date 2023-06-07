

const list = document.querySelector(".list");
const option_btn = document.getElementById("options");
option_btn.addEventListener("click", ()=>{
    list.classList.toggle("list--show");
});


let propertyurl = "/fetchall";
let wishlisturl = "/fetchMyFav";
const userUrl = "/fetchuser";
async function myWhishlist(){
    try {
        const propD = await fetch(propertyurl);
        const wishD = await fetch(wishlisturl);

        const propData = await propD.json();
        const wishData = await wishD.json();

        const u = await fetch(userUrl);
        const userdata = await u.json();

        document.getElementById("hide").style.display = "none";

        document.getElementById("loginuser_image").style.backgroundImage = `url("${userdata[0].user_image}")`;

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
            <a class="type-hidden" href="hostedproperties"><p>&emsp;My Hostings</p></a>
            <a href="/mybookingspage"><p>&emsp;My bookings</p></a>
            <a href="/logout"><p>&emsp;Log Out</p></a>
        </div>`;

        const range = document.createRange();
        const docFrag3 = range.createContextualFragment(changedFirstChild);
        list.appendChild(docFrag3);

        const typeH = document.querySelector(".type-hidden");
        const typeH1 = document.querySelector(".type-hidden-1");
        
        if (userdata[0].user_type == "guest"){
            typeH.remove();
            typeH1.remove();
        };


        const dynamicBody = `
        <div class="myFav_cont">
            <div class="myFav_img">

            </div>
            <div class="myFav_prop_info">
                <div class="title_wrapper">
                    <h2 class="title">My dream trip</h2>
                    <span class="fa-solid fa-heart heart"></span>
                </div>
                <h2 class="myFav_prop_name">hello</h2>
                <div class="myFav_prop_details">
                    <span class="guests">3 guests</span>
                    <span>.</span>
                    <span class="bedrooms">3 bedrooms</span>
                    <span>.</span>
                    <span class="beds">3 bed</span>
                </div>
                <div class="btn_n_price">
                    <button type="button" class="button_to_booking">Book now</button>
                    <p><span class="myFav_prop_price">Rs 2000</span> night</p>
                </div>
            </div>
        </div>
        `;

        const section = document.querySelector(".myFav_wrapper");
        const range1 = document.createRange();
        
        document.querySelector(".no_of_info").textContent = wishData.length;
        document.querySelector(".no_of_info").style.color = "white";

        
        if (wishData.length > 0){
            let data;
            document.querySelector(".no_favs").style.display = "none";
            data = propData.filter(res => {
                for (let count=0; count<wishData.length; count++){
                    if (res.property_id == wishData[count].property_id){
                        return res;
                    }
                }
            })

            for (let dataCount=0; dataCount<data.length; dataCount++){
                const docFrag1 = range1.createContextualFragment(dynamicBody);
                section.appendChild(docFrag1);
            }
            
            for (let i=0; i<data.length; i++){
                document.querySelectorAll(".myFav_prop_name")[i].textContent = data[i].property_name;
    
                document.querySelectorAll(".myFav_img")[i].style.backgroundImage = `url("${data[i].images[0]}")`;
    
                document.querySelectorAll(".title")[i].textContent = wishData[i].title;
    
                document.querySelectorAll(".guests")[i].textContent = data[i].guests_allowed + " guests";
    
                document.querySelectorAll(".bedrooms")[i].textContent = data[i].bedrooms + " bedrooms";
    
                document.querySelectorAll(".beds")[i].textContent = data[i].beds + " beds";
    
                document.querySelectorAll(".myFav_prop_price")[i].textContent = "₹ " + data[i].price;
    
                document.querySelectorAll(".button_to_booking")[i].addEventListener("click", ()=>{
                    localStorage.setItem("clickedPropertyId", data[i].property_id);
                    window.location.assign("/hotelBooking")
                });
    
                const action_form = document.querySelector(".theForm");
                action_form.setAttribute("action", undefined);
    
                const heart = document.querySelectorAll(".heart");
                const confirm_box = document.querySelector(".confirmation_wrapper");;
                heart[i].addEventListener("click", ()=>{
    
                    confirm_box.style.display = "grid";
    
                    document.querySelector(".name_of_the_prop").textContent = data[i].property_name;
    
                    action_form.setAttribute("action", `/delmyFavourite/${data[i].property_id}`);
                });
    
                const cancel = document.querySelector(".cancel");
                cancel.addEventListener("click", ()=>{
                    confirm_box.style.display = "none"
                });

            }

        }else{
            document.querySelector(".no_favs").style.display = "flex";
        }
        

    } catch (error) {
        console.log(error);
    }
};

myWhishlist();