const list = document.querySelector(".list");
const option_btn = document.getElementById("options");
option_btn.addEventListener("click", ()=>{
    list.classList.toggle("list--show");
});


let bookingsurl = "/fetchbookings";
let propertyurl = "/fetchall";
const userUrl = "/fetchuser";
async function mybookings(){
    try {
        const bookings = await fetch(bookingsurl);
        const bookingsdata = await bookings.json();
    

        const properties = await fetch(propertyurl);
        const propertydata = await properties.json();

        const u = await fetch(userUrl);
        const userdata = await u.json();

        //setting up the login btn image::
        document.getElementById("hide").style.display = "none";

        document.getElementById("loginuser_image").style.backgroundImage = `url("abc.png")`;
        // console.log(userdata[0].user_image);

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
            <a class='type-hidden' href="/hostedproperties
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
        
        if (userdata[0].user_type == "guest"){
            typeH.remove();
            typeH1.remove();
        };

        //IIFE::
        (async function (){
            let wishlisturl = "/fetchMyFav";
            const userUrl = "/fetchuser";

                const wd = await fetch(wishlisturl);
                const wishD = await wd.json();

                document.querySelector(".no_of_info").textContent = wishD.length;
                document.querySelector(".no_of_info").style.color = "white";


        }());



        //rendering dynamic data in the page::

        const section = document.querySelector(".my_bookings_cont");
        let a = `<div class="no_booking_cont">
        <h2>No trips booked...yet!</h2>
        <p>Time to dust of your bag and start planning your next adventure</p>
        <div class="btn_to_dashboard">
            <a href="/dashboard">Start searching</a>
        </div>
        <div class="road_to_help">
            <p>Can't find your reservation here? <a href="/contactus"> Visit the Help Centre</a></p>
        </div>
    </div>`;

        const bookedhistory = `
        <div class="bookings">
            <h1 class="booked_prop_name"></h1>
            <div class="booked_prop_cont">
                <div class="image_of_prop">
                    <div class="image"></div>
                    <div class="image_properties">
                        <p>location : 
                            <span class="booked_prop_location">
                            </span>
                        </p>
                        <p>check-in date : 
                            <span class="booked_checkIn"></span>
                        </p>
                        <p>Check-out Date :
                            <span class="booked_checkOut"></span>
                        </p>
                        <p>Price :
                            <span class="booked_price"></span>
                        </p>
                        <p>Payment Mode :
                            <span class="booked_payMode"></span>
                        </p>
                        <button class="rating-btn hide-rating-btn" type="button">Rate</button>
                        <button class="cancel-trip hide-trip-btn" type=button">Cancel</button>
                        <div class="bookingCancellation-confirmBox hide-confirm-box">
                            <h2>Are you sure you want to cancel your booking?</h2>
                            <div class="confirmBox-btns">
                                <button type="button" class='ok'>Yes</button>
                                <button type="button" class="no">Cancel</button>
                            </div>
                        </div>    
                    </div>
                </div>

            </div>
            <div class="alert">
                <h2>Free cancellation before 48 hours</h2>
                <p>For any other queries <a href="/contactus">Visit the Help Centre</a></p>
            </div>
        </div>
        `;


        const docFrag = range.createContextualFragment(a);
        

        const mydata = bookingsdata.filter(result => {
            for (let i=0; i<propertydata.length; i++){
                if (result.property_id == propertydata[i].property_id){
                    return result;
                }
            }
        });



        if (mydata.length<=0){
            section.append(docFrag);
        }else{
            for (let i=0; i<mydata.length; i++){
                const docFrag2 = range.createContextualFragment(bookedhistory);
                section.append(docFrag2);
            };
        };

        const prop_name = document.getElementsByClassName("booked_prop_name");
        const prop_image = document.querySelectorAll(".image");
        const location = document.getElementsByClassName("booked_prop_location");
        const checkIn = document.getElementsByClassName("booked_checkIn");
        const checkOut = document.getElementsByClassName("booked_checkOut");
        const priceOfprop = document.getElementsByClassName("booked_price");
        const payModeOfProp = document.getElementsByClassName("booked_payMode");

        const booking = document.getElementsByClassName("bookings");

        const rating_btn = document.querySelectorAll(".rating-btn");

        const ratingWrapper = document.querySelector(".rating-wrapper");
        const cancelRating_btn = document.getElementById("cancel-rating-btn");

        const ide = document.getElementById("xyz");
        const id = document.getElementById("id");

        const starsCont = document.querySelector(".stars");
        console.log(starsCont);
        const rateinput = document.getElementById("rated");
        

        //setting the rating stars section color and value part so that we can set it into the database::
        const s = starsCont.children;
        let counter = 0;
        for (let k=0; k<s.length; k++){
            s[k].addEventListener("click", ()=>{
                //removing stars on double click::
                rateinput.value = 0;
                for(let m=0; m<=counter; m++){
                    s[m].style.color = "black";
                };

                rateinput.value = k+1;
                for (j=0; j<=k; j++){
                    s[j].style.color = "gold";
                    counter = j;
                };
            });
        };

        // console.log(mydata);



        //implementing the cancel bookings button::
        const cancel_bookings = document.querySelectorAll(".cancel-trip");


        for (let i=0; i<booking.length; i++){


            if (new Date(bookingsdata[i].checkIn_date).getTime() - 2*(24*60*60*1000) > new Date(Date.now()).getTime() ){
                cancel_bookings[i].classList.remove("hide-trip-btn");
            }else{
                cancel_bookings[i].classList.add("hide-trip-btn");
            };

            // prop_name[i].textContent = propertydata[bookingsdata[i].property_id-1].property_name;

            propertydata.filter(ele => {
                if (ele.property_id == bookingsdata[i].property_id){
                    prop_name[i].textContent = ele.property_name;    
                    location[i].textContent = ele.property_details.city;

                    prop_image[i].style.backgroundImage = `url("${ele.images[0]}")`
                }
            });

            //restricting the host user from rating his own property::
            let propArr=[];
            propertydata.forEach(ele=>{
                if (ele.user_id == userdata[0].user_id){
                    propArr.push(ele.property_id);
                }
            });
            
            bookingsdata.forEach((ele, k)=>{
                for (let i=0; i<propArr.length; i++){
                    if (ele.property_id == propArr[i]){
                        rating_btn[k].style.backgroundColor = "lightgray";
                        rating_btn[k].disabled = true;
                        rating_btn[k].textContent = "Can't rate own property";
                        rating_btn[k].style.pointerEvents = "none"
                    }
                }
            });


            checkIn[i].textContent = new Date(bookingsdata[i].checkIn_date).toString().slice(0, 15);

            checkOut[i].textContent = new Date(bookingsdata[i].checkOut_date).toString().slice(0, 15);

            priceOfprop[i].textContent = "Rs "+bookingsdata[i].total_price;

            payModeOfProp[i].textContent = bookingsdata[i].payment_mode;


            //redirecting to the hotel page if a user clicks on a booking image or name::

            prop_image[i].addEventListener("click", ()=>{
                localStorage.setItem("clickedPropertyId", bookingsdata[i].property_id);
                window.location.assign("/hotelBooking");
            });

            prop_name[i].addEventListener("click", ()=>{
                localStorage.setItem("clickedPropertyId", bookingsdata[i].property_id);
                window.location.assign("/hotelBooking");
            });

            //removing the rating btn if the host himself has booked his own hotel, so that he can't rate his own hotel::

            

            
            if (new Date(Date.now()).getTime() >= new Date(bookingsdata[i].checkIn_date).getTime()){
                rating_btn[i].classList.remove("hide-rating-btn");
            }else{
                rating_btn[i].classList.add("hide-rating-button");
            };

            rating_btn[i].addEventListener("click", ()=>{
                ratingWrapper.classList.remove("hide-rating");
                
                //setting the hotel name on the modal::
                propertydata.filter(ele=>{
                    if (ele.property_id == bookingsdata[i].property_id){
                        ide.textContent = ele.property_name;
                        id.value = ele.property_id;
                    }    
                })
            });

            cancelRating_btn.addEventListener("click", ()=>{
                //resetting the stars color to black when the user clicks the cancel button::
                Array.from(s).forEach(ele => ele.style.color = "black");
                ratingWrapper.classList.add("hide-rating");
                
            });


            const cancellationBox = document.querySelectorAll(".bookingCancellation-confirmBox");
            const ok = document.querySelectorAll(".ok");

            cancel_bookings[i].addEventListener('click', ()=>{
                cancellationBox[i].classList.toggle("hide-confirm-box");
            });

            ok[i].addEventListener("click", async()=>{

                console.log(bookingsdata[i].booking_id);
                let bookingCancelUrl = `/delBookings/${bookingsdata[i].booking_id}`;
                
                const response = await fetch(bookingCancelUrl);

                if (response.status == 200){
                    window.location.assign("/mybookingspage");
                }

            });

            document.querySelectorAll(".no")[i].addEventListener("click", ()=>{
                cancellationBox[i].classList.add("hide-confirm-box");
            })
        };

    } catch (error) {
        console.log(error);
    }
}

mybookings();