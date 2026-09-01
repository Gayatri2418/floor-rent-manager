/* =====================================================
   FLOOR & RENT MANAGER - VERSION 3
   Rent Reminders + Delete Person
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
        .classList.add("hidden");

    document.getElementById("roomPage")
        .classList.add("hidden");

    document.getElementById("peoplePage")
        .classList.add("hidden");

    document.getElementById("detailsPage")
        .classList.add("hidden");

}


function showFloorPage() {

    hideAllPages();

    document.getElementById("floorPage")
        .classList.remove("hidden");

    displayFloors();

    displayRentReminders();

}


function showRoomPage() {

    hideAllPages();

    document.getElementById("roomPage")
        .classList.remove("hidden");

    displayRooms();

}


function showPeoplePage() {

    hideAllPages();

    document.getElementById("peoplePage")
        .classList.remove("hidden");

    displayPeople();

}


function showDetailsPage() {

    hideAllPages();

    document.getElementById("detailsPage")
        .classList.remove("hidden");

}


/* =====================================================
   FLOOR
   ===================================================== */

function displayFloors() {

    const floorList =
        document.getElementById("floorList");

    floorList.innerHTML = "";


    if (floors.length === 0) {

        floorList.innerHTML = `
            <div class="empty-state">

                <h3>
                    No floors added yet
                </h3>

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
                ${floor.name}
            </h3>

            <p>
                🚪 ${floor.rooms.length} Rooms
            </p>

            <p>
                👥 ${totalPeople} People
            </p>

            <div class="card-actions">

        <button
            class="edit-btn"
            onclick="event.stopPropagation(); editFloor(${index})">

            ✏️ Edit

        </button>

        <button
            class="delete-floor-btn"
            onclick="event.stopPropagation(); deleteFloor(${index})">

            🗑️ Delete

        </button>

    </div>
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

            totalRooms += 1;

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


    document.getElementById("totalFloors")
        .textContent = floors.length;


    document.getElementById("totalRooms")
        .textContent = totalRooms;


    document.getElementById("totalPeople")
        .textContent = totalPeople;


    document.getElementById("totalPendingRent")
        .textContent =
        "₹" + totalPendingRent.toLocaleString("en-IN");

}


/* =====================================================
   ADD FLOOR
   ===================================================== */

function openAddFloorModal() {

    document.getElementById("floorModal")
        .style.display = "flex";

}


function addFloor(event) {

    event.preventDefault();


    const name =
        document.getElementById("floorName")
            .value.trim();


    if (!name) {

        alert("Please enter floor name.");

        return;

    }
// Prevent duplicate floor names
    const duplicate =
        floors.some(
            floor =>
                floor.name.toLowerCase() === name.toLowerCase()
        );


    if (duplicate) {

        alert(
            `"${name}" already exists. Please use a different floor name.`
        );

        return;
    }

    floors.push({

        name: name,

        rooms: []

    });


    saveData();


    document.getElementById("floorName")
        .value = "";


    closeModal("floorModal");


    displayFloors();

    displayRentReminders();

}


/* =====================================================
   OPEN FLOOR
   ===================================================== */

function openFloor(index) {

    selectedFloorIndex = index;


    const floor =
        floors[index];


    document.getElementById("selectedFloorName")
        .textContent = floor.name;


    document.getElementById("floorRoomCount")
        .textContent =
        `${floor.rooms.length} Rooms`;


    showRoomPage();

}


/* =====================================================
   ROOMS
   ===================================================== */

function displayRooms() {

    const roomList =
        document.getElementById("roomList");


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
                🚪 Room ${room.number}
            </div>

            <div class="room-info">
                Floor: ${floor.name}
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

    document.getElementById("roomModal")
        .style.display = "flex";

}


function addRoom(event) {

    event.preventDefault();


    const number =
        document.getElementById("roomNumber")
            .value.trim();


    if (!number) {

        alert("Please enter room number.");

        return;

    }


    const floor =
        floors[selectedFloorIndex];


    floor.rooms.push({

        number: number,

        people: []

    });


    saveData();


    document.getElementById("roomNumber")
        .value = "";


    closeModal("roomModal");


    displayRooms();


    document.getElementById("floorRoomCount")
        .textContent =
        `${floor.rooms.length} Rooms`;

}


/* =====================================================
   OPEN ROOM
   ===================================================== */

function openRoom(index) {

    selectedRoomIndex = index;


    const room =
        floors[selectedFloorIndex]
            .rooms[index];


    document.getElementById("selectedRoomName")
        .textContent =
        `Room ${room.number}`;


    document.getElementById("roomPeopleCount")
        .textContent =
        `${room.people.length} People`;


    showPeoplePage();

}


/* =====================================================
   PEOPLE
   ===================================================== */

function displayPeople() {

    const peopleList =
        document.getElementById("peopleList");


    peopleList.innerHTML = "";


    const room =
        floors[selectedFloorIndex]
            .rooms[selectedRoomIndex];


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
                    ${person.name}
                </h3>

                <p>
                    ${person.type}
                </p>

            </div>

            <div class="person-actions">

        <button
            class="edit-btn"
            onclick="event.stopPropagation(); editPerson(${index})">

            ✏️ Edit

        </button>

        <button
            class="delete-person-btn"
            onclick="event.stopPropagation(); selectedPersonIndex = ${index}; deletePerson()">

            🗑️ Delete

        </button>

    </div>


        `;


        peopleList.appendChild(card);

    });

}


/* =====================================================
   ADD PERSON
   ===================================================== */

function openAddPersonModal() {

    document.getElementById("personModal")
        .style.display = "flex";

}


function addPerson(event) {

    event.preventDefault();


    const person = {

        name:
            document.getElementById("personName")
                .value.trim(),

        phone:
            document.getElementById("personPhone")
                .value.trim(),

        type:
            document.getElementById("personType")
                .value,

        address:
            document.getElementById("personAddress")
                .value.trim(),

        joiningDate:
            document.getElementById("joiningDate")
                .value,

        monthlyRent:
            document.getElementById("monthlyRent")
                .value,

        securityDeposit:
            document.getElementById("securityDeposit")
                .value,

        rentDueDay:
            document.getElementById("rentDueDay")
                .value,

        rentHistory: []

    };


    const room =
        floors[selectedFloorIndex]
            .rooms[selectedRoomIndex];


    room.people.push(person);


    saveData();


    event.target.reset();


    closeModal("personModal");


    displayPeople();


    document.getElementById("roomPeopleCount")
        .textContent =
        `${room.people.length} People`;


    updateStatistics();

    displayRentReminders();

}


/* =====================================================
   PERSON DETAILS
   ===================================================== */

function openPerson(index) {

    selectedPersonIndex = index;


    const person =
        floors[selectedFloorIndex]
            .rooms[selectedRoomIndex]
            .people[index];


    const room =
        floors[selectedFloorIndex]
            .rooms[selectedRoomIndex];


    const floor =
        floors[selectedFloorIndex];


    document.getElementById("detailsName")
        .textContent = person.name;


    document.getElementById("detailsRoom")
        .textContent =
        `${floor.name} • Room ${room.number}`;


    document.getElementById("detailFullName")
        .textContent =
        person.name || "Not provided";


    document.getElementById("detailPhone")
        .textContent =
        person.phone || "Not provided";


    document.getElementById("detailType")
        .textContent =
        person.type || "Not provided";


    document.getElementById("detailJoiningDate")
        .textContent =
        person.joiningDate || "Not provided";


    document.getElementById("detailAddress")
        .textContent =
        person.address || "Not provided";


    document.getElementById("detailRent")
        .textContent =
        person.monthlyRent
        ? `₹${Number(person.monthlyRent).toLocaleString("en-IN")}`
        : "Not provided";


    document.getElementById("detailDeposit")
        .textContent =
        person.securityDeposit
        ? `₹${Number(person.securityDeposit).toLocaleString("en-IN")}`
        : "Not provided";


    document.getElementById("detailDueDate")
        .textContent =
        person.rentDueDay
        ? `Every month on ${person.rentDueDay}`
        : "Not provided";


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

    const date = new Date();

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

    const person =
        floors[selectedFloorIndex]
            .rooms[selectedRoomIndex]
            .people[selectedPersonIndex];


    if (!person.rentHistory) {

        person.rentHistory = [];

    }


    const currentRentBox =
        document.getElementById("currentRentBox");


    const rentHistory =
        document.getElementById("rentHistory");


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
                    ${record.monthName}
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
   MARK RENT AS PAID
   ===================================================== */

function markCurrentMonthPaid() {

    const person =
        floors[selectedFloorIndex]
            .rooms[selectedRoomIndex]
            .people[selectedPersonIndex];


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

        alert("This month's rent is already marked as paid.");

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


    updateStatistics();

    displayRentReminders();


    alert("Rent marked as paid successfully! ✅");

}


/* =====================================================
   🔔 RENT REMINDERS
   ===================================================== */

function displayRentReminders() {

    const reminderList =
        document.getElementById("reminderList");


    const reminderCount =
        document.getElementById("reminderCount");


    if (!reminderList || !reminderCount) {

        return;

    }


    reminderList.innerHTML = "";


    const today =
        new Date();


    const todayDay =
        today.getDate();


    const currentMonthKey =
        getCurrentMonthKey();


    let reminders = [];


    /* ================= FIND PENDING RENT ================= */

    floors.forEach((floor) => {

        floor.rooms.forEach((room) => {

            room.people.forEach((person) => {

                const rent =
                    Number(person.monthlyRent) || 0;


                const dueDay =
                    Number(person.rentDueDay);


                /* No rent or due date */

                if (!rent || !dueDay) {

                    return;

                }


                /* Check if this month's rent is already paid */

                const paid =
                    person.rentHistory &&
                    person.rentHistory.some(
                        record =>
                            record.month === currentMonthKey
                    );


                /* Don't show paid rent */

                if (paid) {

                    return;

                }


                let status = "";

                let statusClass = "";


                /* ================= OVERDUE ================= */

                if (todayDay > dueDay) {

                    status =
                        `🔴 Overdue by ${todayDay - dueDay} day(s)`;

                    statusClass =
                        "overdue";

                }


                /* ================= DUE TODAY ================= */

                else if (todayDay === dueDay) {

                    status =
                        "🟠 Due Today";

                    statusClass =
                        "today";

                }


                /* ================= UPCOMING ================= */

                else {

                    status =
                        `🟡 Due in ${dueDay - todayDay} day(s)`;

                    statusClass =
                        "upcoming";

                }


                reminders.push({

                    name:
                        person.name,

                    room:
                        room.number,

                    floor:
                        floor.name,

                    rent:
                        rent,

                    status:
                        status,

                    statusClass:
                        statusClass

                });

            });

        });

    });


    /* ================= REMINDER COUNT ================= */

    reminderCount.textContent =
        reminders.length;


    /* ================= NO REMINDERS ================= */

    if (reminders.length === 0) {

        reminderList.innerHTML = `

            <div class="no-reminders">

                ✅ All current rent payments are up to date!

            </div>

        `;

        return;

    }


    /* ================= DISPLAY REMINDERS ================= */

    reminders.forEach(reminder => {

        const card =
            document.createElement("div");


        card.className =
            `reminder-card ${reminder.statusClass}`;


        card.innerHTML = `

            <div>

                <div class="reminder-person">

                    👤 ${reminder.name}

                </div>


                <div class="reminder-room">

                    ${reminder.floor}
                    • Room ${reminder.room}

                </div>

            </div>


            <div class="reminder-status">

                <div>

                    ${reminder.status}

                </div>


                <div class="reminder-amount">

                    ₹${reminder.rent.toLocaleString("en-IN")}

                </div>

            </div>

        `;


        reminderList.appendChild(card);

    });

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
   DELETE PERSON
   ===================================================== */

function deletePerson() {

    const room =
        floors[selectedFloorIndex]
            .rooms[selectedRoomIndex];


    const person =
        room.people[selectedPersonIndex];


    if (!person) {

        return;

    }


    const confirmed =
        confirm(
            `Are you sure you want to remove ${person.name} from Room ${room.number}?`
        );


    if (!confirmed) {

        return;

    }


    room.people.splice(
        selectedPersonIndex,
        1
    );


    saveData();


    selectedPersonIndex = null;


    document.getElementById("roomPeopleCount")
        .textContent =
        `${room.people.length} People`;


    updateStatistics();


    showPeoplePage();


    displayRentReminders();

}


/* =====================================================
   CLOSE MODALS
   ===================================================== */

function closeModal(id) {

    document.getElementById(id)
        .style.display = "none";

}


window.onclick = function(event) {

    if (
        event.target.classList.contains("modal")
    ) {

        event.target.style.display = "none";

    }

};


/* =====================================================
   START APPLICATION
   ===================================================== */

showFloorPage();

/* =====================================================
   DELETE FLOOR SAFELY
   ===================================================== */

function deleteFloor(index) {

    const floor = floors[index];

    if (!floor) {
        return;
    }


    // Don't allow deleting a floor that contains rooms
    if (floor.rooms && floor.rooms.length > 0) {

        alert(
            `"${floor.name}" cannot be deleted because it contains rooms.`
        );

        return;
    }


    const confirmed =
        confirm(
            `Are you sure you want to delete "${floor.name}"?`
        );


    if (!confirmed) {
        return;
    }


    floors.splice(index, 1);


    saveData();


    displayFloors();

    displayRentReminders();

}
/* =====================================================
   ✏️ EDIT FLOOR
   ===================================================== */

function editFloor(index) {

    const floor = floors[index];

    if (!floor) {
        return;
    }

    const newName = prompt(
        "Enter new floor name:",
        floor.name
    );

    if (newName === null) {
        return;
    }

    const trimmedName = newName.trim();

    if (!trimmedName) {

        alert("Floor name cannot be empty.");

        return;
    }


    // Check duplicate floor names
    const duplicate = floors.some(
        (item, i) =>
            i !== index &&
            item.name.toLowerCase() ===
            trimmedName.toLowerCase()
    );


    if (duplicate) {

        alert(
            `"${trimmedName}" already exists.`
        );

        return;
    }


    floor.name = trimmedName;


    saveData();

    displayFloors();

    displayRentReminders();


    // Update room page if this floor is currently selected
    if (selectedFloorIndex === index) {

        document.getElementById(
            "selectedFloorName"
        ).textContent = trimmedName;

    }

}
/* =====================================================
   ✏️ EDIT PERSON
   ===================================================== */

function editPerson(index) {

    const room =
        floors[selectedFloorIndex]
            .rooms[selectedRoomIndex];

    const person = room.people[index];

    if (!person) {
        return;
    }


    const name = prompt(
        "Person name:",
        person.name || ""
    );

    if (name === null) {
        return;
    }


    const phone = prompt(
        "Phone number:",
        person.phone || ""
    );

    if (phone === null) {
        return;
    }


    const type = prompt(
        "Person type:",
        person.type || ""
    );

    if (type === null) {
        return;
    }


    const address = prompt(
        "Address:",
        person.address || ""
    );

    if (address === null) {
        return;
    }


    const joiningDate = prompt(
        "Joining date (YYYY-MM-DD):",
        person.joiningDate || ""
    );

    if (joiningDate === null) {
        return;
    }


    const monthlyRent = prompt(
        "Monthly rent:",
        person.monthlyRent || ""
    );

    if (monthlyRent === null) {
        return;
    }


    const securityDeposit = prompt(
        "Security deposit:",
        person.securityDeposit || ""
    );

    if (securityDeposit === null) {
        return;
    }


    const rentDueDay = prompt(
        "Rent due day (1-31):",
        person.rentDueDay || ""
    );

    if (rentDueDay === null) {
        return;
    }


    // Update person
    person.name = name.trim();

    person.phone = phone.trim();

    person.type = type.trim();

    person.address = address.trim();

    person.joiningDate = joiningDate.trim();

    person.monthlyRent = monthlyRent.trim();

    person.securityDeposit =
        securityDeposit.trim();

    person.rentDueDay =
        rentDueDay.trim();


    saveData();


    displayPeople();

    displayRentReminders();

    updateStatistics();


    // Refresh details if necessary
    openPerson(index);


    alert("Person details updated successfully! ✅");

}
/* =====================================================
   EDIT ROOM
   ===================================================== */

function openEditRoomModal() {

    const floor =
        floors[selectedFloorIndex];

    if (!floor) {
        alert("Floor not found.");
        return;
    }

    const room =
        floor.rooms[selectedRoomIndex];

    if (!room) {
        alert("Room not found.");
        return;
    }

    document.getElementById("editRoomNumber")
        .value = room.number;

    document.getElementById("editRoomModal")
        .style.display = "flex";
}


/* =====================================================
   SAVE EDITED ROOM
   ===================================================== */

function editRoom(event) {

    event.preventDefault();

    const newNumber =
        document.getElementById("editRoomNumber")
            .value.trim();

    if (!newNumber) {
        alert("Please enter a room number.");
        return;
    }

    const floor =
        floors[selectedFloorIndex];

    const room =
        floor.rooms[selectedRoomIndex];

    if (!room) {
        alert("Room not found.");
        return;
    }

    room.number = newNumber;

    saveData();

    document.getElementById("selectedRoomName")
        .textContent = `Room ${room.number}`;

    closeModal("editRoomModal");

    displayRooms();

    alert("Room updated successfully! ✅");
}
/* =====================================================
   EDIT CURRENT ROOM
   ===================================================== */

function editCurrentRoom() {

    const floor = floors[selectedFloorIndex];

    if (!floor) {
        alert("Floor not found.");
        return;
    }

    const room = floor.rooms[selectedRoomIndex];

    if (!room) {
        alert("Room not found.");
        return;
    }

    const newNumber = prompt(
        "Enter new room number:",
        room.number
    );

    if (newNumber === null) {
        return;
    }

    const trimmedNumber = newNumber.trim();

    if (!trimmedNumber) {
        alert("Room number cannot be empty.");
        return;
    }

    // Check if another room already has this number
    const duplicate = floor.rooms.some(
        (item, index) =>
            index !== selectedRoomIndex &&
            String(item.number).toLowerCase() ===
            trimmedNumber.toLowerCase()
    );

    if (duplicate) {
        alert(`Room ${trimmedNumber} already exists on this floor.`);
        return;
    }

    room.number = trimmedNumber;

    saveData();

    document.getElementById("selectedRoomName")
        .textContent = `Room ${room.number}`;

    displayRooms();

    alert("Room updated successfully! ✅");
}