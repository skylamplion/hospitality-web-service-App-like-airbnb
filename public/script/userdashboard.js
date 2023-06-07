const section = document.querySelector(".properties");



const list = document.querySelector(".list");
const option_btn = document.getElementById("options");
option_btn.addEventListener("click", ()=>{
    list.classList.toggle("list--show");
})

//HOME PAGE SCRIPTING WITH USER LOGIN::
const url = "/fetchall";
const userUrl = "/fetchuser";
const ratingUrl = "/ratings";
async function homePageFunction(){
    try {
        const d = await fetch(url);
        const data = await d.json();

        const u = await fetch(userUrl);
        const userdata = await u.json();

        const newD = await fetch(ratingUrl);
        const ratingData = await newD.json();


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

        //manipulating content a/c to user type::

        

        const ranger = document.createRange();
        const docFrag = ranger.createContextualFragment(changedFirstChild);
        list.appendChild(docFrag);

        const typeH = document.querySelector(".type-hidden");
        const typeH1 = document.querySelector(".type-hidden-1");
        
        if (userdata[0].user_type == "guest"){
            typeH.remove();
            typeH1.remove();
        };


        for (let i=0; i<data.length; i++){
            section.innerHTML += `
            <div class="card">
                <div class="carousel-items">
                    <div class="carousel"></div>
                    <div class="carousel-nav">
                        <span class="carousel-btn selected"></span>
                        <span class="carousel-btn"></span>
                        <span class="carousel-btn"></span>
                        <span class="carousel-btn"></span>
                    </div>
                    <span class="fa-solid fa-heart heart" flag="false"></span>
                </div>
                <input type="text" class="prop_type_inp" value=""/>
                <input type="text" class="prop_id_inp" value=""/>
                <div class="property-details">
                    <div class="property-head">
                        <h3 class="propertyName">property name</h3>
                        <p><i class="fa-solid fa-star"></i>&ensp;<span class="rated-star">New</span></p>
                    </div>
                    <p class="text">&emsp;location</p>
                    <button class="price" type="button"></button>
                </div>
            </div>`;            
        }

        // inner cards

        const prop_type = document.querySelectorAll(".prop_type_inp");
        const prop_id = document.querySelectorAll(".prop_id_inp");
        const cards = Array.from(document.querySelectorAll(".card"));
        const carouselCont = Array.from(document.querySelectorAll(".carousel-items"));
        const carousel = document.querySelectorAll(".carousel");
        // const buttons = Array.from(document.querySelectorAll(".carousel-btn"));
        const propertyName = document.getElementsByClassName("propertyName");
        const text = document.getElementsByClassName("text");
        const price = document.getElementsByClassName("price");
        let nav = document.querySelectorAll(".carousel-nav");

        for (let i=0; i<cards.length; i++){


            prop_type[i].value = data[i].property_type;
            prop_id[i].value = data[i].property_id;

            carousel[i].style.backgroundImage = `url("${data[i].images[0]}")`;
            
            propertyName[i].textContent = data[i].property_name;
            text[i].textContent = data[i].property_details.city;
            price[i].textContent = `Rs ${data[i].price} night`;
            price[i].addEventListener('click', ()=>{
                localStorage.setItem("clickedPropertyId", data[i].property_id);
                window.location.assign("/hotelBooking")
                // location.href = "/hotelBooking";  
            });

            const reqData_new = data.forEach((result, counter)=>{
                let total = 0;
                let count = 0;
                for (let i=0; i<ratingData.length; i++){
                    if (result.property_id == ratingData[i].property_id){
                        total += ratingData[i].rating;
                        count += 1;
                        document.querySelectorAll(".rated-star")[counter].textContent = (total/count).toFixed(2);
                    }else{
                        continue;
                    }
                }
            });
        };


        nav.forEach((div, i)=>{
            // const buttons = div.querySelectorAll(".carousel-btn");
            const buttons = Array.from(div.children);
            buttons.forEach((btn, j)=>{
        
                btn.addEventListener("click", ()=>{
                    //deselecting all the buttons::
                    buttons.forEach(btn=> btn.classList.remove("selected"));
        
        
                    //selecting the desired outputs::
                    buttons[j].classList.add("selected");
                    carousel[i].style.backgroundImage = `url("${data[i].images[j]}")`;
                });
            });
        });


        //making the search-bar dynamic::

        const searchIcon = document.getElementById("search-icon");
        const innerEle = document.querySelectorAll(".search_menu");
        const searchBar = document.getElementById("search_bar");

        let flag = false;
        searchIcon.addEventListener("click", ()=>{
            if (flag == false){
                innerEle.forEach(ele => ele.style.display = "none");
                searchBar.classList.remove("hide-search-bar");
                flag = true;
            }else if (flag == true){
                innerEle.forEach(ele => ele.style.display = "block");
                searchBar.classList.add("hide-search-bar");
                flag = false;
            }   
        });

        searchBar.addEventListener("input", (e)=>{

            let value = e.target.value.toLowerCase();

            for (let counter=0; counter<text.length; counter++){
                let dataValue = text[counter].textContent.toLowerCase();
                if (value == ""){
                    for(j=0; j<cards.length; j++){
                        cards[j].style.display = "block";
                    }
                }
                else if (dataValue.includes(value)){
                    cards[counter].style.display = "block"
                }else if(!dataValue.includes(value)){
                    cards[counter].style.display = "none";
                }
            }
        });

        //search bar section ends here......................


        //scripting the header's section for filter data::

        let dc = document.querySelectorAll(".dc");

        for (let i=0; i<dc.length; i++){
            dc[i].addEventListener("click", ()=>{
                for (let j=0; j<cards.length; j++){
                    if (prop_type[j].value == dc[i].lastElementChild.textContent.toLowerCase()){
                        cards[j].style.display = "block";
                    }else{
                        cards[j].style.display = "none"
                    }
                };
            });
        };


        //SCRIPTING THE FILTER BUTTON SO THAT OUR PAGE RENDERS THE FILTERED DATA ON THE PAGE A/C TO THE USER PREFERENCE::


        const filter_tab = document.querySelector(".filter_tab");

        const filter = document.querySelector(".filter");
        filter.addEventListener("click", ()=>{
            filter_tab.style.display = "grid";
        })

        const filter_tab_close_btn = document.querySelector(".close-filter");
        filter_tab_close_btn.addEventListener("click", ()=>{

            const allInputs = document.getElementsByTagName("input");

            //deselecting all the input tags and removing its values whwn the filter tab opens::
            Array.from(allInputs).forEach(ele=>{
                ele.value = null;
                ele.checked = false;
            })

            filter_tab.style.display = "none";

         });


        const apply_btn = document.getElementById("apply");
        const range_slider = document.getElementById("price_range");
        const min_price = document.getElementById("min_price");
        const location_fil = document.getElementById("location_fil");
        const inputs = Array.from(document.querySelectorAll(".checkbox_inputs"));


        apply_btn.addEventListener("click", renderTheFilteredPage);


        inputs.forEach(ele =>{
            let flag = false;
            ele.addEventListener("input", ()=>{
                if (flag == false){
                    ele.value = ele.id;
                    console.log(ele.value);
                    flag = true;
                }else{
                    ele.value = null;
                    console.log(ele.value);
                    flag = false;
                }
            })
        });
        
        
        range_slider.addEventListener("input", (e)=>{
            range_slider.min = "1000"
            range_slider.max = "25000";
            max_price.value = range_slider.max;
            min_price.value = range_slider.value
        });
        
        
        function renderTheFilteredPage(){
            const output1 = data.filter(ele => {
                if (ele.price >= min_price.value){
                    return ele;
                }
            });


            const output2 = output1.filter(ele => {
                if(location_fil.value.trim() == ""){
                    return ele;
                }
                else if (ele.property_details.city.trim().toLowerCase() == location_fil.value.trim().toLowerCase()){
                    return ele;
                }
            });


            let arr = [];
            inputs.forEach(ele=>{
                if (ele.value == "hotel" || ele.value == "flat" || ele.value == "resort" || ele.value == "house"){
                    arr.push(ele.value);
                }
            });
            console.log(arr);

            const output3 = output2.filter((ele, k)=> {
                for (let i=0; i<arr.length; i++){
                    if (ele.property_type == arr[i]){
                        return ele;
                    }
                }
            });



            if (output3.length == 0){
                document.querySelector(".search_box_wrapper").style.display = "grid";
            }else{
                for (let g=0; g<cards.length; g++){
                    innerLoop:for (let f=0; f<output3.length; f++){
                        if (prop_id[g].value == output3[f].property_id){
                            cards[g].style.display = "block";
                            console.log("inner");
                            break innerLoop;
                        }else{
                            cards[g].style.display = "none"
                        }
                    }
                }
            }
            filter_tab.style.display = "none";

        };


        // add-to-fav scripting::

        const heart = document.querySelectorAll(".heart");

        heart.forEach((ele, i) => {
            
            ele.addEventListener("click", async()=>{
                if (ele.getAttribute("flag")=="false"){
                    document.querySelector(".addToFavBox").style.display = "grid";
                    document.querySelector(".hidden_content").value = data[i].property_id;

                }else if (ele.getAttribute("flag")=="true"){
                    
                    const delUrl = `/delmyFav/${data[i].property_id}`;
                    const response = await fetch(delUrl);

                    if (response.status == 200){

                        heart[i].style.color = "black";
                        document.querySelector(".remarks").style.display = "flex";

                        setTimeout(()=>{
                            document.querySelector(".remarks").style.display = "none";
                        }, 4000)
                        ele.setAttribute("flag", "false");

                        (async function (){
                            const wishlisturl = "/fetchMyFav";

                            const wd = await fetch(wishlisturl);
                            const wishD = await wd.json();

                            document.querySelector(".no_of_info").textContent = wishD.length;
                            document.querySelector(".no_of_info").style.color = "white";
                        }());
                    }
                }
            })
        });


        const wishlisturl = "/fetchMyFav";

        const wd = await fetch(wishlisturl);
        const wishD = await wd.json();

        document.querySelector(".no_of_info").textContent = wishD.length;
        document.querySelector(".no_of_info").style.color = "white";


        data.forEach(async(result, i)=> {
            label: for (let cwd=0; cwd<wishD.length; cwd++){
                if (wishD[cwd].property_id == result.property_id){
                    heart[i].setAttribute("flag", "true");
                    heart[i].style.color = "red";
                    break label;
                }else{
                    heart[i].style.color = "black";
                    heart[i].setAttribute("flag", "false");
                }
            }
        });

        const a = document.querySelector(".search_box_wrapper")
        const abcde = document.getElementById("abcde");
        
        abcde.addEventListener("click", ()=>{
            a.style.display="none";
        });

        const cross = document.querySelector(".cross");
        cross.addEventListener("click", ()=>{
            document.querySelector(".addToFavBox").style.display = "none";
        });

        // const createBtn = document.getElementById("create_btn");

        // createBtn.addEventListener("click", async(e)=>{
        //     // e.preventDefault();
        //     let body = {
        //         prop_id:document.getElementById("prop_id").value
        //     }
        //     await fetch("/myFavourites", {
        //         method: 'POST',
        //         body: JSON.stringify(body),
        //         headers:{
        //             "Content-Type": "application/json"
        //         }
        //     }).then(res=>{
        //         console.log(res);
        //         if (res.status == 200){
        //             alert("hii");
        //             window.location.href = "/dashboard"
        //         }
        //     })
        // })

    } catch (error) {
        console.log(error);
    }
};
homePageFunction();