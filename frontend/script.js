const API = "http://localhost:8080";

let allSessions = [];


// ==========================
// LOAD SESSIONS
// ==========================

async function loadSessions() {

    try {

        const response = await fetch(`${API}/sessions`);

        if (!response.ok) {
            throw new Error("Failed to load sessions");
        }

        allSessions = await response.json();

        displaySessions(allSessions);

        updateSummary(allSessions);

        createSubjectOptions(allSessions);

        loadLongestSession();

    } catch (error) {

        console.error(error);

        document.getElementById("sessionTable").innerHTML = `
            <tr>
                <td colspan="5">
                    Failed to connect to Spring Boot.
                </td>
            </tr>
        `;
    }
}


// ==========================
// DISPLAY TABLE
// ==========================

function displaySessions(sessions) {

    const table = document.getElementById("sessionTable");

    table.innerHTML = "";

    document.getElementById("sessionCount").textContent =
        `${sessions.length} sessions`;


    if (sessions.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="5">
                    No sessions found.
                </td>
            </tr>
        `;

        return;
    }


    sessions.forEach(session => {

        const row = document.createElement("tr");

        let badgeClass = "badge-todo";

        if (session.status === "COMPLETED") {
            badgeClass = "badge-completed";
        }

        if (session.status === "IN_PROGRESS") {
            badgeClass = "badge-progress";
        }


        row.innerHTML = `

            <td>${session.id}</td>

            <td>${session.subject}</td>

            <td>${session.duration} min</td>

            <td>
                <span class="badge ${badgeClass}">
                    ${session.status}
                </span>
            </td>

            <td>

                <button
                    class="edit-btn"
                    onclick="openEditModal('${session.id}')">
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteSession('${session.id}')">
                    Delete
                </button>

            </td>
        `;


        table.appendChild(row);

    });


    createBars(sessions);
}


// ==========================
// SUMMARY
// ==========================

async function updateSummary(sessions) {

    document.getElementById("totalSessions").textContent =
        sessions.length;


    try {

        const response =
            await fetch(`${API}/sessions/total-duration`);

        const total =
            await response.json();

        document.getElementById("totalMinutes").textContent =
            total;

    } catch (error) {

        console.error(error);

    }


    const completed =
        sessions.filter(s => s.status === "COMPLETED").length;


    const todo =
        sessions.filter(s => s.status === "TODO").length;


    document.getElementById("completedSessions").textContent =
        completed;

    document.getElementById("todoSessions").textContent =
        todo;
}


// ==========================
// BAR CHART
// ==========================

function createBars(sessions) {

    const container =
        document.getElementById("bars");

    container.innerHTML = "";


    if (sessions.length === 0) {
        container.innerHTML = "<p>No data</p>";
        return;
    }


    const maxDuration =
        Math.max(...sessions.map(s => s.duration));


    sessions.forEach(session => {

        const percentage =
            (session.duration / maxDuration) * 100;


        let barClass = "todo-bar";

        if (session.status === "COMPLETED") {
            barClass = "completed-bar";
        }

        if (session.status === "IN_PROGRESS") {
            barClass = "progress-bar";
        }


        container.innerHTML += `

            <div class="bar-item">

                <div class="bar-label">
                    ${session.subject}
                </div>

                <div class="bar-track">

                    <div
                        class="bar-fill ${barClass}"
                        style="width: ${percentage}%">

                        ${session.duration}m

                    </div>

                </div>

            </div>
        `;
    });
}


// ==========================
// LONGEST SESSION
// ==========================

async function loadLongestSession() {

    const container =
        document.getElementById("longestSession");


    try {

        const response =
            await fetch(`${API}/sessions/longest`);


        if (response.status === 404) {

            container.innerHTML =
                "<p>No sessions available.</p>";

            return;
        }


        const session =
            await response.json();


        container.innerHTML = `

            <div class="longest-content">

                <h3>${session.subject}</h3>

                <p>
                    Duration:
                    <strong>${session.duration} minutes</strong>
                </p>

                <p>
                    Status:
                    ${session.status}
                </p>

            </div>

        `;

    } catch (error) {

        console.error(error);

    }
}


// ==========================
// SUBJECT FILTER OPTIONS
// ==========================

function createSubjectOptions(sessions) {

    const select =
        document.getElementById("subjectFilter");


    const currentValue =
        select.value;


    const subjects =
        [...new Set(sessions.map(s => s.subject))];


    select.innerHTML =
        `<option value="">All Subjects</option>`;


    subjects.forEach(subject => {

        select.innerHTML += `
            <option value="${subject}">
                ${subject}
            </option>
        `;

    });


    select.value = currentValue;
}


// ==========================
// FILTER
// ==========================

async function applyFilters() {

    const subject =
        document.getElementById("subjectFilter").value;

    const status =
        document.getElementById("statusFilter").value;


    try {

        let url = `${API}/sessions`;


        if (subject) {

            url += `?subject=${encodeURIComponent(subject)}`;

        } else if (status) {

            url += `?status=${encodeURIComponent(status)}`;

        }


        const response =
            await fetch(url);


        const sessions =
            await response.json();


        displaySessions(sessions);

    } catch (error) {

        console.error(error);

    }
}


// ==========================
// CLEAR FILTERS
// ==========================

function clearFilters() {

    document.getElementById("subjectFilter").value = "";

    document.getElementById("statusFilter").value = "";

    displaySessions(allSessions);
}


// ==========================
// OPEN ADD MODAL
// ==========================

function openAddModal() {

    document.getElementById("modalTitle").textContent =
        "Add Study Session";


    document.getElementById("sessionId").value = "";

    document.getElementById("subject").value = "";

    document.getElementById("duration").value = "";

    document.getElementById("status").value = "TODO";


    document.getElementById("sessionModal").style.display =
        "flex";
}


// ==========================
// CLOSE MODAL
// ==========================

function closeModal() {

    document.getElementById("sessionModal").style.display =
        "none";
}


// ==========================
// ADD / UPDATE
// ==========================

async function saveSession() {

    const id =
        document.getElementById("sessionId").value;


    const subject =
        document.getElementById("subject").value;


    const duration =
        Number(document.getElementById("duration").value);


    const status =
        document.getElementById("status").value;


    if (!subject || !duration) {

        alert("Enter subject and duration.");

        return;
    }


    const session = {

        subject: subject,

        duration: duration,

        status: status
    };


    try {

        let response;


        // UPDATE

        if (id) {

            response = await fetch(
                `${API}/sessions/${id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(session)
                }
            );

        }


        // ADD

        else {

            response = await fetch(
                `${API}/sessions`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(session)
                }
            );

        }


        if (!response.ok) {

            throw new Error("Request failed");

        }


        closeModal();

        await loadSessions();

    } catch (error) {

        console.error(error);

        alert("Something went wrong.");
    }
}


// ==========================
// EDIT
// ==========================

function openEditModal(id) {

    const session =
        allSessions.find(s => s.id === id);


    if (!session) {
        return;
    }


    document.getElementById("modalTitle").textContent =
        "Edit Study Session";


    document.getElementById("sessionId").value =
        session.id;


    document.getElementById("subject").value =
        session.subject;


    document.getElementById("duration").value =
        session.duration;


    document.getElementById("status").value =
        session.status;


    document.getElementById("sessionModal").style.display =
        "flex";
}


// ==========================
// DELETE
// ==========================

async function deleteSession(id) {

    const confirmed =
        confirm("Delete this study session?");


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(`${API}/sessions/${id}`, {

                method: "DELETE"

            });


        if (!response.ok) {

            throw new Error("Delete failed");

        }


        await loadSessions();

    } catch (error) {

        console.error(error);

        alert("Failed to delete session.");
    }
}


// ==========================
// START
// ==========================

loadSessions();