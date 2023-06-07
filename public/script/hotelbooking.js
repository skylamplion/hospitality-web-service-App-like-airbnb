
//HOTEL BOOKING PAGE SCRIPTING::

const list = document.querySelector(".list");
const option_btn = document.getElementById("options");
option_btn.addEventListener("click", ()=>{
    list.classList.toggle("list--show");
})

const key = localStorage.getItem("clickedPropertyId");
console.log(key);
const url = "/fetchall";
const userUrl = "/fetchuser";
async function hotelBookPageData(){
    try {
        // localStorage.clear();
        const d = await fetch(url);
        const propData = await d.json();

        //user data fetch and image change
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


        //our required data a/c to the tab user clicked::
        const reqData = propData.filter(result => {
            if (key == result.property_id){
                return result;
            }
        });

        //images section:;

        const prop_images = document.querySelectorAll(".property_images");

        
        console.log(reqData);

        for (let i=0; i<prop_images.length; i++){
            
            prop_images[i].style.backgroundImage = `url("${reqData[0].images[i]}")`;
        }
        
        //manipulating the booking page::
        document.getElementById("name").textContent = reqData[0].property_name;
        document.getElementById("property_location").textContent = reqData[0].property_details.city;
        document.getElementById("property_owner_name").textContent = reqData[0].owner_name
        document.getElementById("guest_allowed").textContent = reqData[0].guests_allowed + " guests";
        document.getElementById("bedrooms").textContent = reqData[0].bedrooms + " bedrooms";
        document.getElementById("bed").textContent = reqData[0].beds + " beds";

        document.querySelector("#information").textContent = reqData[0].description;

        const answer = document.querySelectorAll(".answer");


        document.querySelector(".property_owner_image").style.backgroundImage = `url("https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHw%3D&w=1000&q=80")`

        //amenities section::

        let k = 0;
        for (let i in reqData[0].amenities){
            if (reqData[0].amenities[i] === "yes"){
                answer[k].textContent = "Yes";
                k++;
            }else{
                answer[k].textContent = "No";
                k++;
            }
        };


        //SCRIPTING THE BOOKING DIV FOR DYNAMIC DATA::
        // console.log(dataToBeRendered);

        const nightPrice = document.getElementById("night_price").textContent = reqData[0].price;

        const checkIn = document.querySelector("#check_in_date");
        const checkOut = document.getElementById("check_out_date");
        const nights = document.getElementById("nights");
        const livePrice = document.getElementById("live_price");
        const prop_id = document.getElementById("prop_id_m");


        const minVal = `${new Date(Date.now()).getFullYear()}-${new Date(Date.now()).getMonth()+ 1}-${new Date(Date.now()).getDate()}`;
        checkIn.setAttribute("min", minVal);
        checkOut.min = minVal;

        let minValForCheckOut;
        checkIn.addEventListener("input", ()=>{
            minValForCheckOut = checkIn.value;
            minValForCheckOut = new Date(minValForCheckOut)
            minValForCheckOut =  minValForCheckOut.getTime() + (24*60*60*1000);

            minValForCheckOut = new Date(minValForCheckOut);

            minValForCheckOut = `${minValForCheckOut.getFullYear()}-${minValForCheckOut.getMonth() + 1}-${minValForCheckOut.getDate()}`;

            setCheckOutMin(minValForCheckOut);
            
        });
        
        function setCheckOutMin(parameter){
            checkOut.min = parameter;
        };
        
        checkOut.addEventListener("input", ()=>{

            if (checkOut.value <= checkIn.value){
                alert("Check Out date cannot be less than Check In date");
            }else{
                const checkIn_day = new Date(checkIn.value);
                
                if ((checkOut.value != null || undefined)){
                    checkIn.addEventListener("input", (e)=>{
                        let checkInTime = new Date(checkIn.value).getTime();

                        let checkOutTime = new Date(checkOut.value).getTime();
                        let timeDiff = (checkOutTime-checkInTime)/(24*60*60*1000);
                        console.log(timeDiff);

                        
                        nights.value = timeDiff;
                        
                        livePrice.value = `${timeDiff * reqData[0].price }`;
                        prop_id.value = key;
                    });
                };

                let checkInTime = new Date(checkIn.value).getTime();

                let checkOutTime = new Date(checkOut.value).getTime();
                let timeDiff = (checkOutTime-checkInTime)/(24*60*60*1000);

                nights.value = timeDiff;
                
                livePrice.value = `${timeDiff * reqData[0].price }`;
                prop_id.value = key;

            };
        });

        //SCRIPTING THE REVIEW AND RATING PART::

        const myBox = document.querySelector(".my-box");
        const rating_num = document.getElementById("rating_number");
        const total_ratings_count = document.getElementById("total_ratings");
        

        const ratingUrl = "/ratings";
        const newD = await fetch(ratingUrl);
        const ratingData = await newD.json();

        const reqRatingData = ratingData.filter(result =>{
            if (result.property_id == reqData[0].property_id){
                return result;
            };
        });
        
        let curr_rating = 0;
        for (let i=0; i<reqRatingData.length; i++){
            curr_rating += (reqRatingData[i].rating)/reqRatingData.length;
        };
        

        if (curr_rating==0){
            rating_num.textContent = "-";
        }else{
            rating_num.textContent = curr_rating;
        };



        if (reqRatingData.length==0){
            total_ratings_count.textContent = "No Reviews Yet!";
        }else{
            total_ratings_count.textContent = reqRatingData.length + " reviews";
        }

        console.log(reqData);

        let counter2 = 0;
        for (let i=0; i<ratingData.length; i++){
            console.log(ratingData[i].property_id == reqData[0].property_id);
            if (ratingData[i].property_id == reqData[0].property_id){
                const newDynamicCont = `
                    <div class="rating_description">
                        <div class="reviewer_details">
                            <div id="reviewer_image" class="reviewer_images"></div>
                            <div class="reviewer">
                                <div class="reviewer_names">${ratingData[i].user_name}</div>
                                <div id="review_date" class="review_dates"></div>
                            </div>
                        </div>
                        <p class="reviews">${ratingData[i].review_description}</p>
                    </div>
                    `;
                    

                const newrange = document.createRange();
                const newdocFrag = newrange.createContextualFragment(newDynamicCont);
                myBox.appendChild(newdocFrag);

                document.querySelectorAll(".reviewer_images")[counter2].style.backgroundImage = `url("${ratingData[i].profile_picture}")`;
                counter2++;
            }else{
                continue;
            }
        }

        const reserve_tab = document.querySelector(".reserve_tab");
        const booking_div = document.querySelector(".booking_div");

        let flag = false;
        reserve_tab.addEventListener("click", ()=>{
            if (flag == false){
                booking_div.style.display = 'flex';
                flag = true;
            }else{
                booking_div.style.display = 'none';
                flag = false;
            }
        });

        let wishlisturl = "/fetchMyFav";

        const wd = await fetch(wishlisturl);
        const wishD = await wd.json();

        document.querySelector(".no_of_info").textContent = wishD.length;
        document.querySelector(".no_of_info").style.color = "white";

    } catch (error) {
        console.log(error);
    }
}

window.onload = hotelBookPageData();