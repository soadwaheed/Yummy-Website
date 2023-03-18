$(document).ready(function()
{
    $('.loading').fadeOut(500);
    $("body").css("overflow", "visible");
    closeNav();
    $('.close').click(function(){
        if($('.sideNav').css('left')=='0px')
        {
            closeNav();
        }
        else
        {
            openNav();
        }
    });
    function closeNav()
    {
        let sideNavWidth=$('.nav-details').innerWidth();
        $('.close').removeClass('fa-xmark');
        $('.close').addClass(' fa-align-justify');
        $('.sideNav').animate({ left: -sideNavWidth }, 500);
        $(".links li").animate({top: 300}, 500)
    };
    function openNav()
    {
        $('.close').removeClass('fa-align-justify');
            $('.close').addClass('fa-xmark');
            $('.sideNav').animate({left:0},500);
            for (let i = 0; i < 5; i++) {
                $(".links li").eq(i).animate({top: 0}, (i + 5) * 100)
            };
    };
    async function getMeals(meal) {
        $(".inner-loading").css("display","flex").hide().fadeIn(300);
        let apiResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${meal}`);
        let finalResponse = await apiResponse.json();
        console.log(finalResponse.meals);
        $(".inner-loading").fadeOut(300);
        if(finalResponse.meals !=null)
        {
            showMeals(finalResponse.meals);
        }
        else
        {
            showMeals([]);
        }
    }
    function showMeals(meals) {
        let cartona = ``;
        for (let i = 0; i < meals.length; i++) {
            cartona += `<div class="col-md-3">
        <div class="meal-item position-relative overflow-hidden rounded-2" id=${meals[i].idMeal}>
            <div class=" rounded-2 ">
                <img src=${meals[i].strMealThumb} class="w-100 rounded-2">
            </div>
            <div class="meal-shadow w-100 h-100 text-black  position-absolute  d-flex align-items-center p-2 rounded-2">
                <div class="meal-info ">
                    <h3>${meals[i].strMeal}</h3>
                </div>
            </div>
        </div>
    </div>`
        }
        $('#data').html(cartona);
        mealEvent();
    }
    getMeals("");
    async function getDetails(mealId)
    {
        $(".inner-loading").css("display","flex").hide().fadeIn(300);
        let apiResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
        let finalResponse = await apiResponse.json();
        $(".inner-loading").fadeOut(300);
        console.log(finalResponse.meals);
        showDetails(finalResponse.meals);
    }
    function showDetails(detail)
    {
        closeNav();
        document.querySelector('.search .container').innerHTML='';
        let list=``;
        for(let i=1;i<=20;i++)
        {
            if(detail[0][`strIngredient${i}`] !='')
            {
                list +=`<li class="alert color-alert m-2 p-1">${detail[0][`strMeasure${i}`]} ${detail[0][`strIngredient${i}`]}</li>`
            }
        };
        let tag = ``;
        if(detail[0].strTags != null)
        {
            let tags = detail[0].strTags.split(',');
            for (let i = 0; i < tags.length; i++) {
                tag += `<li class="alert alert-danger m-2 p-1">${tags[i]}</li>`
            };
        }
       
        let cartona = ``;
        cartona = `  <div class="col-md-4">
            <img src=${detail[0].strMealThumb} class="w-100 rounded-3">
            <h2>${detail[0].strMeal}</h2>
           </div>
           <div class="col-md-8">
            <h2>Instructions</h2>
            <p>
            ${detail[0].strInstructions}
            </p>
            <h3><span class="fw-bolder">Area : </span>${detail[0].strArea}</h3>
            <h3><span class="fw-bolder">Category : </span>${detail[0].strCategory}</h3>
            <h3>Recipes :</h3>
            
            <ul class="list-unstyled d-flex flex-wrap">
                ${list}
            </ul>
            <h3>Tags :</h3>
            <ul class="list-unstyled d-flex flex-wrap">
               ${tag}
            </ul>
            <a class="btn btn-success" href=${detail[0].strSource} target="_blank">Source</a>
            <a class="btn btn-danger" href=${detail[0].strYoutube} target="_blank">Youtube</a>
           </div>`

        $('#data').html(cartona);
    }
    function mealEvent()
    {
        let mealSize=$('.meal-item');
        for(let i=0;i<mealSize.length;i++)
        {
            $(mealSize[i]).click(function(){
                let id=$(mealSize[i]).attr('id');
                console.log(id)
                getDetails(id);
            });  
        };
    };


    // search
    function searchMealByName()
    {
        $('#searchName').on('input',function(e)
        {
            closeNav();
            let mealSearch =$(e.target).val();
            getMeals(mealSearch);
        });
    }
    async function getMealByLetter(letter)
    {
        if(letter=='')
        {
            letter='a';
        }
        $(".inner-loading").css("display","flex").hide().fadeIn(300);
        let apiResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
        let finalResponse = await apiResponse.json();
        console.log(finalResponse.meals);
        $(".inner-loading").fadeOut(300);
        if(finalResponse.meals !=null)
        {
            showMeals(finalResponse.meals);
        }
        else
        {
            showMeals([]);
        }

    }
    function searchMealByLetter()
    {
        $('#searchLetter').on('input',function(e)
        {
            closeNav();
            let mealSearch =$(e.target).val();
            getMealByLetter(mealSearch);
        });

    }
    function showSearch() {
        document.querySelector('.search .container').innerHTML = `<div class="row py-4">
    <div class="col-md-6">
        <input class="form-control bg-transparent text-white"type="text" placeholder="Search By Name" id="searchName">
    </div>
    <div class="col-md-6">
        <input class="form-control bg-transparent text-white" type="text" placeholder="Search By First Letter"maxlength="1" id="searchLetter">
    </div>
</div>`
        $('#data').html("");
        searchMealByName();
        searchMealByLetter();
        
    }
    $('#searchPage').click(function(){
        showSearch();
        closeNav();
    });

    // categories
    async function getCategories()
    {
        $(".inner-loading").css("display","flex").hide().fadeIn(300);
        let apiResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
        let finalResponse = await apiResponse.json();
        $(".inner-loading").fadeOut(300);
        console.log(finalResponse.categories);
        showCategories(finalResponse.categories);
    }
    function showCategories(categories)
    {
        let cartona=``;
        for(let i=0;i<categories.length;i++)
        {
            cartona+=`<div class="col-md-3">
            <div class="meal-item position-relative overflow-hidden text-center rounded-2" category=${categories[i].strCategory}>
                <div class=" rounded-2 ">
                    <img src=${categories[i].strCategoryThumb} class="w-100 rounded-2">
                </div>
                <div class="meal-shadow w-100 h-100 text-black  position-absolute  p-2 rounded-2">
                    <div class="meal-info ">
                        <h3>${categories[i].strCategory}</h3>
                        <p>
                        ${categories[i].strCategoryDescription.split(' ').slice(0,20).join(" ")}
                        </p>
                    </div>
                </div>
            </div>
           </div>`
        }
        $('#data').html(cartona);
        document.querySelector('.search .container').innerHTML='';
        categoryEvent();
       
    }
    $('#categoriesPage').click(function(){
        closeNav();
        getCategories();
    })
    async function getCategoriesForMeal(category)
    {
        closeNav();
        $(".inner-loading").css("display","flex").hide().fadeIn(300);
        let apiResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
        let finalResponse = await apiResponse.json();
        $(".inner-loading").fadeOut(300);
        console.log(finalResponse.meals);
        showMeals(finalResponse.meals.slice(0,20));
    }
    function categoryEvent()
    {
        let mealSize=$('.meal-item');
        for(let i=0;i<mealSize.length;i++)
        {
            $(mealSize[i]).click(function(){
                let categoryMeal=$(mealSize[i]).attr('category');
                console.log(categoryMeal);
                getCategoriesForMeal(categoryMeal);
            });  
        };
    };


    // Area
    async function getArea()
    {
        $(".inner-loading").css("display","flex").hide().fadeIn(300);
        let apiResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
        let finalResponse = await apiResponse.json();
        $(".inner-loading").fadeOut(300);
        console.log(finalResponse.meals);
        showArea(finalResponse.meals);
    }
    function showArea(area)
    {
        let cartona=``;
        for(let i=0;i<area.length;i++)
        {
            cartona+=`<div class="col-md-3">
            <div class="text-center area" area=${area[i].strArea}>
                <i class="fa-solid fa-house-laptop fa-4x"></i>
                <h3>${area[i].strArea}</h3>
            </div>
        </div>`
        }
        $('#data').html(cartona);
        document.querySelector('.search .container').innerHTML='';
        areaEvent();
    }
    $('#areaPage').click(function(){
        closeNav();
        getArea();
    })
    async function getMealsForArea(location)
    {
        closeNav();
        $(".inner-loading").css("display","flex").hide().fadeIn(300);
        let apiResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${location}`);
        let finalResponse = await apiResponse.json();
        $(".inner-loading").fadeOut(300);
        console.log(finalResponse.meals);
        showMeals(finalResponse.meals.slice(0,20));
    }
    function areaEvent()
    {
        let mealSize=$('.area');
        for(let i=0;i<mealSize.length;i++)
        {
            $(mealSize[i]).click(function(){
                let categoryMeal=$(mealSize[i]).attr('area');
                console.log(categoryMeal);
                getMealsForArea(categoryMeal);
            });  
        };
    }


    // ingredients
    async function getIngredients()
    {
        $(".inner-loading").css("display","flex").hide().fadeIn(300);
        let apiResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);
        let finalResponse = await apiResponse.json();
        $(".inner-loading").fadeOut(300);
        console.log(finalResponse.meals);
        showIngredients(finalResponse.meals.slice(0,20));
    }
    function showIngredients(mealIngredients)
    {
        let cartona=``;
        for(let i=0;i<mealIngredients.length;i++)
        {
            cartona+=`<div class="col-md-3">
            <div class="ingredients text-center" ingredient="${mealIngredients[i].strIngredient}">
                <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                <h3>${mealIngredients[i].strIngredient}</h3>
                <p>
                ${mealIngredients[i].strDescription.split(" ").slice(0,20).join(" ")}
                </p>
            </div>
        </div>`
        }
        $('#data').html(cartona);
        document.querySelector('.search .container').innerHTML='';
        ingredientEvent()
    }
    $('#ingredientsPage').click(function(){
        closeNav();
        getIngredients();
    })
    async function getMealIngredients(mainIngredient)
    {
        closeNav();
        $(".inner-loading").css("display","flex").hide().fadeIn(300);
        let apiResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${mainIngredient}`);
        let finalResponse = await apiResponse.json();
        $(".inner-loading").fadeOut(300);
        console.log(finalResponse.meals);
        showMeals(finalResponse.meals.slice(0,20));
    }
    function ingredientEvent()
    {
        let mealSize=$('.ingredients');
        for(let i=0;i<mealSize.length;i++)
        {
            $(mealSize[i]).click(function(){
                let categoryMeal=$(mealSize[i]).attr('ingredient');
                console.log(categoryMeal);
                getMealIngredients(categoryMeal);
            });  
        };
    };


    // contact
    let event1=false;
    let event2=false;
    let event3=false;
    let event4=false;
    let event5=false;
    let event6=false;
    function showContact()
    {
        let cartona = `  <div class="contact d-flex align-items-center justify-content-center  min-vh-100">
        <div class="container w-75 text-center ">
            <div class="row g-4">
                <div class="col-md-6">
                    <input id="nameInput" type="text" class="form-control" placeholder="Enter Your Name">
                    <div id="nameAlert" class="alert alert-danger mt-2  ">
                        Special characters and numbers not allowed
                    </div>
                </div>
                <div class="col-md-6">
                    <input id="emailInput" type="email" class="form-control " placeholder="Enter Your Email">
                    <div id="emailAlert" class="alert alert-danger  mt-2 ">
                        Email not valid *exemple@yyy.zzz
                    </div>
                </div>
                <div class="col-md-6">
                    <input id="phoneInput" type="text" class="form-control " placeholder="Enter Your Phone">
                    <div id="phoneAlert" class="alert alert-danger mt-2 ">
                        Enter valid Phone Number
                    </div>
                </div>
                <div class="col-md-6">
                    <input id="ageInput" type="number" class="form-control " placeholder="Enter Your Age">
                    <div id="ageAlert" class="alert alert-danger mt-2 ">
                        Enter valid age
                    </div>
                </div>
                <div class="col-md-6">
                    <input id="passwordInput" type="password" class="form-control " placeholder="Enter Your Password">
                    <div id="passwordAlert" class="alert alert-danger mt-2 ">
                        Enter valid password *Minimum eight characters, at least one letter and one number:*
                    </div>
                </div>
                <div class="col-md-6">
                    <input id="repasswordInput" type="password" class="form-control " placeholder="Repassword">
                    <div id="repasswordAlert" class="alert alert-danger mt-2 ">
                        Enter valid repassword
                    </div>
                </div>
            </div>
            <button disabled id="submitBtn" class="btn btn-outline-danger px-2 mt-3">Submit</button>
        
        </div>
    </div>`;
    $('#data').html(cartona);
    }
    $('#contactPage').click(function(){
        showContact();
        closeNav();
        contactEvent();
    });
    

    function validateName()
    {
        let nameReg= /^[a-z A-Z]+$/;
        return nameReg.test($('#nameInput').val());
    };
    function validateEmail()
    {
        let emailReg=/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return emailReg.test($('#emailInput').val());
    }
    function validatePhone()
    {
        let phoneReg=/^(\+)?[(]?[0-9]{3}[)]?[\- \s \.]?[0-9]{3}[\- \s \.]?[0-9]{4,6}$/;
        return phoneReg.test($('#phoneInput').val());
    }
    function validateAge()
    {
        let ageReg=/^(0{0,1}[1-9]|[1-9][0-9]|[1][0-9][0-9]|200)$/;
        return ageReg.test($('#ageInput').val());
    }
    function validatePassword()
    {
        let passwordReg= /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/;
        return passwordReg.test($('#passwordInput').val());
    }
    function validateRepassword()
    {
        return($('#passwordInput').val()== $('#repasswordInput').val());   
    }
    function contactEvent()
    {
        $('#nameInput').on('input',function(){
           
           validateButton();
        })
        $('#emailInput').on('input',function(){
           
            validateButton()
        });
        $('#phoneInput').on('input',function(){
            
            validateButton()
        });
        $('#ageInput').on('input',function(){
            
            validateButton()
        });
        $('#passwordInput').on('input',function(){
           
            validateButton()
        });
        $('#repasswordInput').on('input',function(){
           validateButton()
        }); 
        $('#nameInput').focus(function()
        {
            event1=true;
        }) 
        $('#emailInput').focus(function()
        {
            event2=true;
        })
        $('#phoneInput').focus(function()
        {
            event3=true;
        })
        $('#ageInput').focus(function()
        {
            event4=true;
        })
        $('#passwordInput').focus(function()
        {
            event5=true;
        })
        $('#repasswordInput').focus(function()
        {
            event6=true;
        })


    }
    function validateButton()
    {
        if(event1)
        {
            if (validateName()) {
                $('#nameAlert').css('display', 'none');
            }
            else {
                $('#nameAlert').css('display', 'block');
            }
        }
        if(event2)
        {
            if (validateEmail()) {
                $('#emailAlert').css('display', 'none');
            }
            else {
                $('#emailAlert').css('display', 'block');
            }
        }
        if(event3)
        {
            if (validatePhone()) {
                $('#phoneAlert').css('display', 'none');
            }
            else {
                $('#phoneAlert').css('display', 'block');
            }
        }
        if(event4)
        {
            if (validateAge()) {
                $('#ageAlert').css('display', 'none');
            }
            else {
                $('#ageAlert').css('display', 'block');
            }
        }
        if(event5)
        {
            if (validatePassword()) {
                $('#passwordAlert').css('display', 'none');
            }
            else {
                $('#passwordAlert').css('display', 'block');
            }
        }
        if(event6)
        {
            if(validateRepassword())
            {
                $('#repasswordAlert').css('display', 'none');
            }
            else
            {
                $('#repasswordAlert').css('display', 'block');
            }
        }
        let submitButton = document.getElementById("submitBtn");
        if (validateName() && validateEmail() && validatePhone() && validateAge() && validatePassword() && validateRepassword()) {
            submitButton.removeAttribute('disabled');
        }
        else {
            submitButton.setAttribute("disabled","true");
        };
    }




    

    


      
   

   
    
    
    

    

}   
);






