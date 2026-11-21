//route data array//
const routes =[
{id: 1, name: "Newlands to Gateway (Umhlanga)",fare: 22},
{id: 2, name: "Newlands to Durban CBD (Rank)", fare: 16},
{id: 3, name: "Newlands to KwaMashu Station", fare: 14},
{id: 4, name: "Newlands to Phoenix Plaza", fare: 15},
{id: 5, name: "Newlands to Cornubia Mall", fare: 18}
];

//taxi row data array//
let taxirows =[
    {id: 0, name: "front seat", capacity: 1, paidseats: 0, cashcollected: 0, changeowed: 0},
     {id: 1, name: "row 2", capacity: 4, paidseats: 0, cashcollected: 0, changeowed: 0},
     {id: 2, name: "row 3", capacity: 3, paidseats: 0, cascollected: 0, changeowed: 0},
     {id: 3, name: "row 4", capacity: 3, paidseats:0, cashcollected: 0, changeowed: 0},
     {id: 4, name: "back row", capacity: 4, paidseats: 0, cashcollected: 0, changeowed: 0},
];
let currentfare = routes[0].fare;

//DOM Elements//
const routeselect = document.getElementById("route-select");
const faredisplay = document.getElementById("fare-display");
const paymentform = document.getElementById("payment-form");
const rowselect = document.getElementById("row-select");
const passengerinput = document.getElementById("passemgers-count");
const cashinput = document.getElementById("cash-given");
const rowscontainer = document.getElementById("rows-container");
const seatspaidEl =  document.getElementById("seats-paid");
const cashinhandEl = document.getElementById("cah-in-hand");
const totalchangeEl = document.getElementById("total-change");
const taxifullbanner = document.getElementById("tai-full-banner");
const resetBtn = document.getElementById("reset-btn");

//initialize app//
function init() {
    //using forEach loop//
    routes.forEach(route => {
        const option = document.createElement("option");
        option.value = route.id;
        option.textContent = '${route.name} (R${route.fare})';
        routeSelect.appendChild(option);
    
    });
    updatefaredisplay();
    updateUI();
    
}

//update fare when route changes//
routeSelect.addEventListeners("change", ()=> {
    //use find() method//
    const selectroute = routes.find(r => r.id === selectedId);
    currentfare = selectedroute.fare;
    updatefaredisplay();
    resettrip();
})

function updatefaredisplay() {
    faredisplay.textcontent = 'R${currentfare}';
}

//handle payment submission//
paymentform.addEventListeners("submit", (e)=>{
    e.preventdefault();

    const  rowindex = parseint(rowselect.value);
    const passengers = parseint(passengersinput.value);
    const cashgiven = parsefloat(cashinput.value);
    const row = taxirow[rowindex];

    //conditionals for validation//
    if (row.paidseats + passengers > row.capacity) {
        alert('Error: ${row.name} only has ${row.capacity - row.paidseats} seat(s) left!');
        return;
    }
    const totalcost = passengers* currentfare;

    if (cashgiven < totalcost) {
        alert('Insufficient cash! total for ${passengers} passenger(s)is R${totalcost}.');
        return;
    }

    //calculate change and update row objects//
    const change = cashgiven - totalcost;
    row.paidseat +=passengers;
    row.cashcollected += cashgiven;
    row,changeowed += change;

    //clear inputs//
    passengerInput.value = 1;
    cashInput.value = "";

    updateUI();
});

//mark change handed back to row//
function settlerowchange(rowIndex) {
    const row = taxirow[rowIndex];
    row.cashcollected -= row.changeowed;
    row.changeowed = 0;
    updateUI();
}

function updateUI() {
    rowscontainer.innerHTML = "";

    //use array.reduce() tocompute driver live summary totals//
    const totalpaidseats = taxirows.reduce((sum, row) => sum + row.paidseats, 0);
    const totalcashinhand = taxirows.reduce((sum, row) => sum + row. cashcollected, 0);
    const totalcashowed = taxirows.reduce((sum, row) => sum + row.changeowed, 0);

    //update driver dashboard//
    seatspaidEl.textcontent = '${totalpaidseats} /15';
    cashinhandEl.textcontent = 'R${totalcashinhand}';
    totalchangeEl.textcontent = 'R${totalchangeowed';

    if (totalpaidseats === 15){
        taxifullbanner.classlist.remove("hidden");
    } else {
        taxifullbanner.classlist.add("hidden");
    }

    for (const row of taxirows) {
        const isrowfull = row.paidseat === row.capacity;

        const card = document.createElement("div");
        card.classname = 'row-card ${isrowfull? "row-complete" : ""}';

        card.innerHTML = '
        <div class="row-top">
        <span class="row-title">${row.name}</span>
        <span class="seat-pill">${row.paidseats} / ${row.capacity} Paid</span>
        </div>
        <div class="row-details">
            <span>cash collected: <stong>R${row.cashcollected}</strong></span>
            ${row.changeowed > 0 ?'change owed: R${row.changeowed}' : 'No change owed!'}
            </span>
            </div>
            ${row.changeowed > 0 ? '<button class="btn-clear-change" onclick="settlerowchange(${row.id})">Mark R${row.changeowed} change given</button>' : ''}

                ';
        
                rowsContainer.appendchild(card);
    }
}

//reset trip//
function resettrip() {
    taxirows = taxirow.map(row =>({
        ...row,
        paidseats: 0,
        cashcollected: 0,
        changeowed: 0,
    }));
    updateUI();
}

resetBtn.addEventListener("click", resettrip);

init();
