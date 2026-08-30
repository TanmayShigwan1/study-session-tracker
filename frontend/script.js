const container = document.getElementById("sessions-container");

async function loadSessions() {

    try {

        const response = await fetch("http://localhost:8080/sessions");

        const sessions = await response.json();

        container.innerHTML = "";

        sessions.forEach(session => {

            const div = document.createElement("div");

            div.classList.add("session");

            div.innerHTML = `
                <h2>${session.subject}</h2>
                <p>Duration: ${session.duration} minutes</p>
                <p>Status: ${session.status}</p>
            `;

            container.appendChild(div);
        });

    } catch (error) {
        console.error(error);
        container.innerHTML = "<p>Failed to load sessions.</p>";
    }
}

loadSessions();