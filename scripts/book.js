const petTypes = ["Cat", "Small Dog", "Medium Dog", "Large Dog"];
const serviceTypes = ["Basic Cleaning", "Deluxe Cleaning", "Cleaning + Trim"]
const dogCosts = ["$49.99","$79.99","$99.99"];
const catCosts = ["$39.99","$59.99","$69.99"];

var curSlide;

// Booking info
var selPetType;
var selService;
var selStaffMember;
var selDate;
var selTime;

// slide buttons
var prevBtn;
var nextBtn;

//initial configs
var initprevBtnDisplay;
var initnextBtnDisplay;

//progress bar elements
var circ1;
var circ2;
var circ3;

var top1;
var top2;
var top3;


function onLoad() {
    curSlide = 0;
    prevBtn = document.getElementById("prevBtn");
    nextBtn = document.getElementById("nextBtn");

    initprevBtnDisplay = prevBtn.style.display;
    initnextBtnDisplay = nextBtn.style.display;

    circ1 = document.getElementById("circ1");
    circ2 = document.getElementById("circ2");
    circ3 = document.getElementById("circ3");

    top1 = document.getElementById("top1");
    top2 = document.getElementById("top2");
    top3 = document.getElementById("top3");

    updatePage();
}

function nextClick() {
    curSlide++;

    updatePage();
}
function prevClick() {
    curSlide--;
    updatePage();
}

function updatePage() {
    console.log(curSlide);
    switch (curSlide) {
        case 0:
            slide0();
            break;
        case 1:
            slide1();
            break;
        case 2:
            slide2();
            break;
        case 3:
            slide3();
            break;

    }

    function slide0() {
        prevBtn.style.display = "none";
        nextBtn.style.display = initnextBtnDisplay;
        circ1.setAttribute("fill", "#6d1b99");
        circ2.setAttribute("fill", "black");
        circ3.setAttribute("fill", "black");
        top1.className = "purple-primary";
        top2.className = "";
        top3.className = "";
    }

    function slide1() {
        prevBtn.style.display = initprevBtnDisplay;
        nextBtn.style.display = initnextBtnDisplay;
        circ1.setAttribute("fill", "#6d1b99");
        circ2.setAttribute("fill", "#6d1b99");
        circ3.setAttribute("fill", "black");
        top1.className = "purple-primary";
        top2.className = "purple-primary";
        top3.className = "";
    }

    function slide2() {
        prevBtn.style.display = initprevBtnDisplay;
        nextBtn.style.display = initnextBtnDisplay;
        circ1.setAttribute("fill", "#6d1b99");
        circ2.setAttribute("fill", "#6d1b99");
        circ3.setAttribute("fill", "#6d1b99");
        top1.className = "purple-primary";
        top2.className = "purple-primary";
        top3.className = "purple-primary";

        //Update Appointment details
        selPetType = document.querySelector("input[name = 'petRad']:checked").value;
        selService = document.querySelector("input[name = 'servRad']:checked").value;
        selStaffMember = document.getElementById("staffSelect").value;
        selDate = document.getElementById("datePick").value;
        selTime = document.getElementById("timePick").value;
        

        document.getElementById("sizeLabel").innerHTML ="Pet Type: " + petTypes[selPetType];
        document.getElementById("serviceLabel").innerHTML = "Service: " + serviceTypes[selService];
        document.getElementById("staffLabel").innerHTML =  "Staff Member: " + selStaffMember;
        
        document.getElementById("costLabel").innerHTML =  "Cost: " + (selPetType == 0 ? catCosts[selService] : dogCosts[selService]);
        document.getElementById("dateTimeLabel").innerHTML = "Date and Time: " + selTime + " at " + selDate;

    }

    function slide3() {
        prevBtn.style.display = "none";
        nextBtn.style.display = "none";
        circ1.setAttribute("fill", "#6d1b99");
        circ2.setAttribute("fill", "#6d1b99");
        circ3.setAttribute("fill", "#6d1b99");
        top1.className = "purple-primary";
        top2.className = "purple-primary";
        top3.className = "purple-primary";
        

        var email = document.getElementById("emailField").value;
        //update text
        document.getElementById("confirmationText").innerHTML = ` Your appointment with ${selStaffMember} on ${selDate} at ${selTime} has been booked. An email confirmation has been sent to ${email}.`
       
    }

}