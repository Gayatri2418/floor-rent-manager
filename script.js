/* =====================================================
   FLOOR & RENT MANAGER - VERSION 3
   Floor → Room → People → Details
   Includes:
   ✅ Add Floor
   ✅ Add Room
   ✅ Add Person
   ✅ Person Details
   ✅ Rent Payment
   ✅ Rent History
   ✅ Rent Reminders
   ✅ Delete Person
   ===================================================== */


/* ================= DATA ================= */

let floors =
    JSON.parse(localStorage.getItem("roomManagerData")) || [];


/* ================= CURRENT SELECTION ================= */

let selectedFloorIndex = null;
let selectedRoomIndex = null;
let selectedPersonIndex = null;


/* =====================================================
   SAVE DATA
   ===================================================== */

function saveData() {

    localStorage.setItem(
        "roomManagerData",
        JSON.stringify(floors)
    );

}


/* =====================================================
   PAGE MANAGEMENT
   ===================================================== */

function hideAllPages() {

    document.getElementById("floorPage")
        ?.classList.add("hidden");

    document.getElementById("roomPage")
        ?.classList.add("hidden");

    document.getElementById("peoplePage")
        ?.classList.add("hidden");

    document.getElementById("detailsPage")
        ?.classList.add("hidden");

}


function showFloorPage() {

    hideAllPages();

    document.getElementById("floorPage")
        ?.classList.remove("hidden");

    displayFloors();
    displayRentReminders();

}


function showRoomPage() {

    hideAllPages();

    document.getElementById("roomPage")
        ?.classList.remove("hidden");

    displayRooms();

}


function showPeoplePage() {

    hideAllPages();

    document.getElementById("peoplePage")
        ?.classList.remove("hidden");

    displayPeople();

}


function showDetailsPage() {

    hideAllPages();

    document.getElementById("detailsPage")
        ?.classList.remove("hidden");

}


/* =====================================================
   FLOOR DISPLAY
   ===================================================== */

function displayFloors() {

    const floorList =
        document.getElementById("floorList");

    if (!floorList) return;

    floorList.innerHTML = "";


    if (floors.length === 0) {

        floorList.innerHTML = `
            <div class="empty-state">
                <h3>No floors added yet</h3>

                <p>
                    Click "+ Add Floor" to create your first floor.
                </p>
            </div>
        `;

        updateStatistics();

        return;
    }


    floors.forEach((floor, index) => {

        let totalPeople = 0;


        floor.rooms.forEach(room => {

            totalPeople += room.people.length;

        });


        const card =
            document.createElement("div");


        card.className = "floor-card";


        card.onclick = function () {

            openFloor(index);

        };


        card.innerHTML = `

            <div class="floor-icon">
                🏢
            </div>

            <h3>
                ${escapeHTML(floor.name)}
            </h3>

            <p>
                🚪 ${floor.rooms.length} Rooms
            </p>

            <p>
                👥 ${totalPeople} People
            </p>

        `;


        floorList.appendChild(card);

    });


    updateStatistics();

}


/* =====================================================
   STATISTICS
   ===================================================== */

function updateStatistics() {

    let totalRooms = 0;

    let totalPeople = 0;

    let totalPendingRent = 0;


    floors.forEach(floor => {

        floor.rooms.forEach(room => {

            totalRooms++;

            totalPeople += room.people.length;


            room.people.forEach(person => {

                const currentRent =
                    getCurrentMonthRent(person);


                if (currentRent.status === "pending") {

                    totalPendingRent +=
                        Number(person.monthlyRent) || 0;

                }

            });

        });

    });


    const totalFloorsElement =
        document.getElementById("totalFloors");

    const totalRoomsElement =
        document.getElementById("totalRooms");

    const totalPeopleElement =
        document.getElementById("totalPeople");

    const totalPendingRentElement =
        document.getElementById("totalPendingRent");


    if (totalFloorsElement) {

        totalFloorsElement.textContent =
            floors.length;

    }


    if (totalRoomsElement) {

        totalRoomsElement.textContent =
            totalRooms;

    }


    if (totalPeopleElement) {

        totalPeopleElement.textContent =
            totalPeople;

    }


    if (totalPendingRentElement) {

        totalPendingRentElement.textContent =
            "₹" +
            totalPendingRent.toLocaleString("en-IN");

    }

}


/* =====================================================
   ADD FLOOR
   ===================================================== */

function openAddFloorModal() {

    const modal =
        document.getElementById("floorModal");

    if (modal) {

        modal.style.display = "flex";

    }

}


function addFloor(event) {

    event.preventDefault();


    const input =
        document.getElementById("floorName");


    const name =
        input.value.trim();


    if (!name) {

        alert("Please enter floor name.");

        return;

    }


    floors.push({

        name: name,

        rooms: []

    });


    saveData();


    input.value = "";


    closeModal("floorModal");


    displayFloors();

}


/* =====================================================
   OPEN FLOOR
   ===================================================== */

function openFloor(index) {

    selectedFloorIndex = index;


    const floor =
        floors[index];


    if (!floor) return;


    const nameElement =
        document.getElementById("selectedFloorName");


    const countElement =
        document.getElementById("floorRoomCount");


    if (nameElement) {

        nameElement.textContent =
            floor.name;

    }


    if (countElement) {

        countElement.textContent =
            `${floor.rooms.length} Rooms`;

    }


    showRoomPage();

}


/* =====================================================
   DISPLAY ROOMS
   ===================================================== */

function displayRooms() {

    const roomList =
        document.getElementById("roomList");


    if (!roomList) return;


    roomList.innerHTML = "";


    const floor =
        floors[selectedFloorIndex];


    if (!floor) return;


    if (floor.rooms.length === 0) {

        roomList.innerHTML = `

            <div class="empty-state">

                <h3>
                    No rooms added
                </h3>

                <p>
                    Click "+ Add Room" to add a room.
                </p>

            </div>

        `;

        return;

    }


    floor.rooms.forEach((room, index) => {

        const card =
            document.createElement("div");


        card.className = "room-card";


        card.onclick = function () {

            openRoom(index);

        };


        card.innerHTML = `

            <div class="room-number">
                🚪 Room ${escapeHTML(room.number)}
            </div>

            <div class="room-info">
                Floor: ${escapeHTML(floor.name)}
            </div>

            <div class="room-people">

                👥 ${room.people.length}

                ${
                    room.people.length === 1
                    ? "Person"
                    : "People"
                }

            </div>

        `;


        roomList.appendChild(card);

    });

}


/* =====================================================
   ADD ROOM
   ===================================================== */

function openAddRoomModal() {

    const modal =
        document.getElementById("roomModal");

    if (modal) {

        modal.style.display = "flex";

    }

}


function addRoom(event) {

    event.preventDefault();


    const input =
        document.getElementById("roomNumber");


    const number =
        input.value.trim();


    if (!number) {

        alert("Please enter room number.");

        return;

    }


    const floor =
        floors[selectedFloorIndex];


    if (!floor) {

        alert("Please select a floor first.");

        return;

    }


    floor.rooms.push({

        number: number,

        people: []

    });


    saveData();


    input.value = "";


    closeModal("roomModal");


    displayRooms();


    const countElement =
        document.getElementById("floorRoomCount");


    if (countElement) {

        countElement.textContent =
            `${floor.rooms.length} Rooms`;

    }


    updateStatistics();

}


/* =====================================================
   OPEN ROOM
   ===================================================== */

function openRoom(index) {

    selectedRoomIndex = index;


    const floor =
        floors[selectedFloorIndex];


    if (!floor) return;


    const room =
        floor.rooms[index];


    if (!room) return;


    const roomName =
        document.getElementById("selectedRoomName");


    const peopleCount =
        document.getElementById("roomPeopleCount");


    if (roomName) {

        roomName.textContent =
            `Room ${room.number}`;

    }


    if (peopleCount) {

        peopleCount.textContent =
            `${room.people.length} People`;

    }


    showPeoplePage();

}


/* =====================================================
   DISPLAY PEOPLE
   ===================================================== */

function displayPeople() {

    const peopleList =
        document.getElementById("peopleList");


    if (!peopleList) return;


    peopleList.innerHTML = "";


    const floor =
        floors[selectedFloorIndex];


    if (!floor) return;


    const room =
        floor.rooms[selectedRoomIndex];


    if (!room) return;


    if (room.people.length === 0) {

        peopleList.innerHTML = `

            <div class="empty-state">

                <h3>
                    No people added
                </h3>

                <p>
                    Click "+ Add Person" to add someone.
                </p>

            </div>

        `;

        return;

    }


    room.people.forEach((person, index) => {

        const card =
            document.createElement("div");


        card.className = "person-card";


        card.onclick = function () {

            openPerson(index);

        };


        card.innerHTML = `

            <div class="person-avatar">
                👤
            </div>

            <div>

                <h3>
                    ${escapeHTML(person.name)}
                </h3>

                <p>
                    ${escapeHTML(person.type || "Resident")}
                </p>

            </div>

        `;


        peopleList.appendChild(card);

    });

}


/* =====================================================
   ADD PERSON
   ===================================================== */

function openAddPersonModal() {

    const modal =
        document.getElementById("personModal");

    if (modal) {

        modal.style.display = "flex";

    }

}


function addPerson(event) {

    event.preventDefault();


    const person = {

        name:
            getValue("personName"),

        phone:
            getValue("personPhone"),

        type:
            getValue("personType"),

        address:
            getValue("personAddress"),

        joiningDate:
            getValue("joiningDate"),

        monthlyRent:
            getValue("monthlyRent"),

        securityDeposit:
            getValue("securityDeposit"),

        rentDueDay:
            getValue("rentDueDay"),

        rentHistory: []

    };


    if (!person.name) {

        alert("Please enter person's name.");

        return;

    }


    const floor =
        floors[selectedFloorIndex];


    if (!floor) {

        alert("Please select a floor.");

        return;

    }


    const room =
        floor.rooms[selectedRoomIndex];


    if (!room) {

        alert("Please select a room.");

        return;

    }


    room.people.push(person);


    saveData();


    event.target.reset();


    closeModal("personModal");


    displayPeople();


    const countElement =
        document.getElementById("roomPeopleCount");


    if (countElement) {

        countElement.textContent =
            `${room.people.length} People`;

    }


    updateStatistics();

    displayRentReminders();

}


/* =====================================================
   PERSON DETAILS
   ===================================================== */

function openPerson(index) {

    selectedPersonIndex = index;


    const floor =
        floors[selectedFloorIndex];


    const room =
        floor.rooms[selectedRoomIndex];


    const person =
        room.people[index];


    if (!person) return;


    setText(
        "detailsName",
        person.name
    );


    setText(
        "detailsRoom",
        `${floor.name} • Room ${room.number}`
    );


    setText(
        "detailFullName",
        person.name || "Not provided"
    );


    setText(
        "detailPhone",
        person.phone || "Not provided"
    );


    setText(
        "detailType",
        person.type || "Not provided"
    );


    setText(
        "detailJoiningDate",
        person.joiningDate || "Not provided"
    );


    setText(
        "detailAddress",
        person.address || "Not provided"
    );


    setText(
        "detailRent",
        person.monthlyRent
        ? `₹${Number(person.monthlyRent).toLocaleString("en-IN")}`
        : "Not provided"
    );


    setText(
        "detailDeposit",
        person.securityDeposit
        ? `₹${Number(person.securityDeposit).toLocaleString("en-IN")}`
        : "Not provided"
    );


    setText(
        "detailDueDate",
        person.rentDueDay
        ? `Every month on ${person.rentDueDay}`
        : "Not provided"
    );


    displayRent();


    showDetailsPage();

}


/* =====================================================
   MONTH FUNCTIONS
   ===================================================== */

function getMonthName(monthIndex) {

    const months = [

        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"

    ];


    return months[monthIndex];

}


function getCurrentMonthKey() {

    const date =
        new Date();


    return `${date.getFullYear()}-${String(
        date.getMonth() + 1
    ).padStart(2, "0")}`;

}


/* =====================================================
   CURRENT MONTH RENT
   ===================================================== */

function getCurrentMonthRent(person) {

    if (!person.rentHistory) {

        person.rentHistory = [];

    }


    const monthKey =
        getCurrentMonthKey();


    const existing =
        person.rentHistory.find(
            rent => rent.month === monthKey
        );


    if (existing) {

        return {

            status: "paid",

            record: existing

        };

    }


    return {

        status: "pending",

        record: null

    };

}


/* =====================================================
   DISPLAY RENT
   ===================================================== */

function displayRent() {

    const floor =
        floors[selectedFloorIndex];


    const room =
        floor.rooms[selectedRoomIndex];


    const person =
        room.people[selectedPersonIndex];


    if (!person) return;


    if (!person.rentHistory) {

        person.rentHistory = [];

    }


    const currentRentBox =
        document.getElementById("currentRentBox");


    const rentHistory =
        document.getElementById("rentHistory");


    if (!currentRentBox || !rentHistory) {

        return;

    }


    const date =
        new Date();


    const monthKey =
        getCurrentMonthKey();


    const monthName =
        getMonthName(date.getMonth());


    const year =
        date.getFullYear();


    const rentAmount =
        Number(person.monthlyRent) || 0;


    const dueDay =
        person.rentDueDay || "Not set";


    const current =
        getCurrentMonthRent(person);


    /* ================= CURRENT RENT ================= */


    if (current.status === "paid") {

        currentRentBox.innerHTML = `

            <h4>
                ${monthName} ${year} Rent
            </h4>

            <div class="rent-amount">
                ₹${rentAmount.toLocaleString("en-IN")}
            </div>

            <p class="rent-paid">
                ✅ PAID
            </p>

            <p>
                Paid on:
                ${formatDate(current.record.paidDate)}
            </p>

        `;

    }

    else {

        currentRentBox.innerHTML = `

            <h4>
                ${monthName} ${year} Rent
            </h4>

            <div class="rent-amount">
                ₹${rentAmount.toLocaleString("en-IN")}
            </div>

            <p class="rent-pending">
                🔴 PENDING
            </p>

            <p>
                Due day:
                ${dueDay}
            </p>

            <button
                class="mark-paid-btn"
                onclick="markCurrentMonthPaid()">

                ✅ Mark as Paid

            </button>

        `;

    }


    /* ================= HISTORY ================= */


    rentHistory.innerHTML = "";


    if (person.rentHistory.length === 0) {

        rentHistory.innerHTML = `

            <div class="empty-state">

                <p>
                    No previous payments recorded.
                </p>

            </div>

        `;

        return;

    }


    const sortedHistory =
        [...person.rentHistory].reverse();


    sortedHistory.forEach(record => {

        const row =
            document.createElement("div");


        row.className = "rent-row";


        row.innerHTML = `

            <div>

                <div class="rent-month">

                    ${escapeHTML(record.monthName)}
                    ${record.year}

                </div>

                <small>

                    Paid on:
                    ${formatDate(record.paidDate)}

                </small>

            </div>


            <div class="rent-details">

                <strong>

                    ₹${Number(record.amount)
                        .toLocaleString("en-IN")}

                </strong>

                <div class="rent-paid">

                    ✅ Paid

                </div>

            </div>

        `;


        rentHistory.appendChild(row);

    });

}


/* =====================================================
   MARK CURRENT MONTH RENT AS PAID
   ===================================================== */

function markCurrentMonthPaid() {

    const floor =
        floors[selectedFloorIndex];


    const room =
        floor.rooms[selectedRoomIndex];


    const person =
        room.people[selectedPersonIndex];


    if (!person) return;


    if (!person.rentHistory) {

        person.rentHistory = [];

    }


    const date =
        new Date();


    const monthKey =
        getCurrentMonthKey();


    const alreadyPaid =
        person.rentHistory.some(
            rent => rent.month === monthKey
        );


    if (alreadyPaid) {

        alert(
            "This month's rent is already marked as paid."
        );

        return;

    }


    const record = {

        month: monthKey,

        monthName:
            getMonthName(date.getMonth()),

        year:
            date.getFullYear(),

        amount:
            Number(person.monthlyRent) || 0,

        paidDate:
            date.toISOString()

    };


    person.rentHistory.push(record);


    saveData();


    displayRent();

    displayRentReminders();

    updateStatistics();


    alert(
        "Rent marked as paid successfully! ✅"
    );

}


/* =====================================================
   RENT REMINDERS
   ===================================================== */

function displayRentReminders() {

    const reminderList =
        document.getElementById("reminderList");


    const reminderCount =
        document.getElementById("reminderCount");


    if (!reminderList) return;


    reminderList.innerHTML = "";


    let reminders = [];


    const today =
        new Date();


    const currentDay =
        today.getDate();


    const currentMonth =
        getCurrentMonthKey();


    floors.forEach((floor, floorIndex) => {

        floor.rooms.forEach((room, roomIndex) => {

            room.people.forEach((person, personIndex) => {

                const rent =
                    getCurrentMonthRent(person);


                if (rent.status !== "pending") {

                    return;

                }


                const dueDay =
                    Number(person.rentDueDay);


                if (!dueDay) {

                    return;

                }


                let status =
                    "upcoming";


                if (currentDay > dueDay) {

                    status = "overdue";

                }
                else if (currentDay === dueDay) {

                    status = "today";

                }


                reminders.push({

                    floorIndex,

                    roomIndex,

                    personIndex,

                    floorName:
                        floor.name,

                    roomNumber:
                        room.number,

                    personName:
                        person.name,

                    amount:
                        Number(person.monthlyRent) || 0,

                    dueDay,

                    status

                });

            });

        });

    });


    /* ================= SORT ================= */

    reminders.sort((a, b) => {

        const order = {

            overdue: 1,

            today: 2,

            upcoming: 3

        };


        return order[a.status] -
               order[b.status];

    });


    /* ================= COUNT ================= */

    if (reminderCount) {

        reminderCount.textContent =
            reminders.length;

    }


    /* ================= EMPTY ================= */

    if (reminders.length === 0) {

        reminderList.innerHTML = `

            <div class="empty-state">

                <h3>
                    🎉 No pending rent!
                </h3>

                <p>
                    Everyone's rent is up to date.
                </p>

            </div>

        `;

        return;

    }


    /* ================= DISPLAY ================= */

    reminders.forEach(reminder => {

        const card =
            document.createElement("div");


        card.className =
            "reminder-card";


        let statusText =
            "Due soon";


        if (reminder.status === "overdue") {

            statusText =
                "🔴 OVERDUE";

        }
        else if (reminder.status === "today") {

            statusText =
                "🟠 DUE TODAY";

        }
        else {

            statusText =
                "🟡 UPCOMING";

        }


        card.innerHTML = `

            <div class="reminder-icon">
                🔔
            </div>

            <div class="reminder-info">

                <h3>
                    ${escapeHTML(reminder.personName)}
                </h3>

                <p>

                    ${escapeHTML(reminder.floorName)}
                    • Room
                    ${escapeHTML(reminder.roomNumber)}

                </p>

                <p>

                    Rent:
                    <strong>
                        ₹${reminder.amount.toLocaleString("en-IN")}
                    </strong>

                </p>

                <p>

                    Due day:
                    ${reminder.dueDay}

                </p>

            </div>

            <div class="reminder-status">

                ${statusText}

            </div>

        `;


        card.onclick = function () {

            selectedFloorIndex =
                reminder.floorIndex;

            selectedRoomIndex =
                reminder.roomIndex;

            selectedPersonIndex =
                reminder.personIndex;


            openPerson(
                reminder.personIndex
            );

        };


        reminderList.appendChild(card);

    });

}


/* =====================================================
   DELETE PERSON
   ===================================================== */

function deletePerson() {

    const floor =
        floors[selectedFloorIndex];


    if (!floor) {

        alert("Floor not selected.");

        return;

    }


    const room =
        floor.rooms[selectedRoomIndex];


    if (!room) {

        alert("Room not selected.");

        return;

    }


    const person =
        room.people[selectedPersonIndex];


    if (!person) {

        alert("Person not found.");

        return;

    }


    const confirmed =
        confirm(
            `Are you sure you want to remove ${person.name} from Room ${room.number}?`
        );


    if (!confirmed) {

        return;

    }


    /* REMOVE PERSON */

    room.people.splice(
        selectedPersonIndex,
        1
    );


    /* SAVE */

    saveData();


    /* RESET PERSON SELECTION */

    selectedPersonIndex = null;


    /* UPDATE PEOPLE PAGE */

    const countElement =
        document.getElementById("roomPeopleCount");


    if (countElement) {

        countElement.textContent =
            `${room.people.length} People`;

    }


    displayPeople();

    displayRentReminders();

    updateStatistics();


    /* GO BACK TO PEOPLE PAGE */

    showPeoplePage();


    alert(
        "Person removed successfully."
    );

}


/* =====================================================
   FORMAT DATE
   ===================================================== */

function formatDate(dateString) {

    if (!dateString) {

        return "Not available";

    }


    const date =
        new Date(dateString);


    if (isNaN(date.getTime())) {

        return dateString;

    }


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }
    );

}


/* =====================================================
   MODAL
   ===================================================== */

function closeModal(id) {

    const modal =
        document.getElementById(id);


    if (modal) {

        modal.style.display = "none";

    }

}


window.onclick =
    function(event) {

        if (
            event.target.classList.contains("modal")
        ) {

            event.target.style.display =
                "none";

        }

    };


/* =====================================================
   HELPER FUNCTIONS
   ===================================================== */

function getValue(id) {

    const element =
        document.getElementById(id);


    if (!element) {

        return "";

    }


    return element.value.trim();

}


function setText(id, value) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent = value;

    }

}


function escapeHTML(value) {

    if (value === null ||
        value === undefined) {

        return "";

    }


    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =====================================================
   START APPLICATION
   ===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        showFloorPage();

        displayRentReminders();

    }
);