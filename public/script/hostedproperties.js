const list = document.querySelector(".list");
const option_btn = document.getElementById("options");
option_btn.addEventListener("click", ()=>{
    list.classList.toggle("list--show");
});
console.log("hello");

let user_url = "/fetchuser";
let hostingsurl = "/fetchhostings";
async function myhostings(){
    try {
        const hostings = await fetch(hostingsurl);
        const hostingsdata = await hostings.json();
        
        const u = await fetch(user_url);
        const user = await u.json();
        
        console.log(user);
        console.log(hostingsdata);

        //setting up the login btn image::
        document.getElementById("hide").style.display = "none";

        document.getElementById("loginuser_image").style.backgroundImage = `url("${user[0].user_image}")`;


        //removing login signup options whwn a user is logged in::
        list.firstElementChild.remove();

        let changedFirstChild = `
        <div class="logIn-signUp">
            <a href="/myprofile"><p>&emsp;My Profile</p></a>
            <a href="/myFavourites"><p>&emsp;My Wishlist</p>
                <div class="air-information">
                    <p class='no_of_info'>1</p>
                </div>
            </a>
            <a class="type-hidden" href="/hostedproperties
            "><p>&emsp;My hostings</p></a>
            <a href="/mybookingspage"><p>&emsp;My bookings</p></a>
            <a href="/contactus"><p>&emsp;Help</p></a>
            <a href="/logout"><p>&emsp;Log Out</p></a>
        </div>`;

        const range = document.createRange();
        const docFrag3 = range.createContextualFragment(changedFirstChild);
        list.appendChild(docFrag3);

        const typeH = document.querySelector(".type-hidden");
        const typeH1 = document.querySelector(".type-hidden-1");
        
        if (user[0].user_type == "guest"){
            typeH.remove();
            typeH1.remove();
        };

        //wishlist::

        let wishlisturl = "/fetchMyFav";

        const wd = await fetch(wishlisturl);
        const wishD = await wd.json();

        document.querySelector(".no_of_info").textContent = wishD.length;
        document.querySelector(".no_of_info").style.color = "white";



        //rendering dynamic data in the page::

        const section = document.querySelector(".my_hostings_cont");
        let emptypage = `
        <div class="no_hosting_cont">
            <h2>No properties hosted...yet!</h2>
            <p>Time to put your properties on work for you!</p>
            <div class="btn_to_dashboard">
                <a href="/hosting">Start hosting</a>
            </div>
            <div class="road_to_help">
                <p>Can't find your reservation here? <a href="/contactus"> Visit the Help Centre</a></p>
            </div>
        </div>`;

        let hostedhistory = `
        <div class="hostings">
            <h1 class="hosted_prop_name"></h1>
            <div class="hosted_prop_cont">
                <div class="image_of_prop">
                    <div class="image"></div>
                    <div class="image_properties">
                        <p>location : 
                            <span class="hosted_prop_location">
                            </span>
                        </p>
                        <p>Price :
                            <span class="hosted_price"></span>
                        </p>
                        <p>Area :
                            <span class="hosted_area"></span>
                        </p>
                        <p>Rating :
                            <span class="hosted_rating"></span>
                        </p>
                        <button type="button" class="remove-btn">Delete Property?</button>
                        <form action="" method="get" class="prop-del-form hide-form">
                            <p>Are you sure you want to delete this property?</p>
                            <div class="prop_del_btns">
                                <button type="button" class="remove">Remove</button>
                                <button type="button" class="cancel">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>

            </div>
            <div class="alert">
                <p>For any other queries <a href="/contactus">Visit the Help Centre</a></p>
            </div>
        </div>
        `;

        
        const docFrag = range.createContextualFragment(emptypage);
        

        if (hostingsdata.length<=0){
            section.append(docFrag);
            
        }else{
            for (let i=0; i<hostingsdata.length; i++){
                console.log("haha");
                const docFrag2 = range.createContextualFragment(hostedhistory);
                section.append(docFrag2);
            };
        };

        const prop_name = document.getElementsByClassName("hosted_prop_name");
        // const prop_image = document.getElementsByClassName("image");
        const location = document.getElementsByClassName("hosted_prop_location");
    
        const priceOfprop = document.getElementsByClassName("hosted_price");
        const hostedarea = document.getElementsByClassName("hosted_area");
        const hostedrating = document.getElementsByClassName("hosted_rating");
        const image = document.querySelectorAll(".image");

        const hosting = document.getElementsByClassName("hostings");

        const delProp = document.querySelectorAll(".remove-btn")
        const propForms = document.querySelectorAll(".prop-del-form");
        const cancel = document.querySelectorAll(".cancel");
        


        
        for (let i=0; i<hosting.length; i++){
            image[i].style.backgroundImage = `url("${hostingsdata[i].images[0]}")`;

            prop_name[i].textContent = hostingsdata[i].property_name;
            location[i].textContent = hostingsdata[i].property_details.city;
            
            priceOfprop[i].textContent = "Rs "+hostingsdata[i].price;
            hostedarea[i].textContent = hostingsdata[i].area + "sq. m";
            hostedrating[i].textContent = "-";

            delProp[i].addEventListener("click", ()=>{
                propForms[i].classList.toggle("hide-form");
            })

            cancel[i].addEventListener("click", ()=>{
                propForms[i].classList.add("hide-form");
            });

            //redirecting to the hotel page if a user clicks on a property::

            image[i].addEventListener("click", ()=>{
                localStorage.setItem("clickedPropertyId", hostingsdata[i].property_id);
                window.location.assign("/hotelBooking");
            });

            prop_name[i].addEventListener("click", ()=>{
                localStorage.setItem("clickedPropertyId", hostingsdata[i].property_id);
                window.location.assign("/hotelBooking");
            });

            
            const remove_btn = document.querySelectorAll(".remove");
            
            remove_btn[i].addEventListener("click", async()=>{
                const del_url = `/delProp/${hostingsdata[i].property_id}`;

                const response = await fetch(del_url);

                if (response.status == 200){
                    window.location.assign("/hostedproperties")
                }
            })

        }

    
    } catch (error) {
        
    }
}

myhostings();