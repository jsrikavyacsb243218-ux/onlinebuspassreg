
// ======================================
// USER DASHBOARD
// ======================================

document.addEventListener("DOMContentLoaded", function() {

    const user = requireUser();

    if (!user) return;

    document.getElementById("userName").textContent = user.name;
    document.getElementById("profileName").textContent = user.name;
    document.getElementById("profileEmail").textContent = user.email;
    document.getElementById("profilePhone").textContent = user.phone;
    document.getElementById("profileCategory").textContent = user.category;

    const applications = getApplications();

    const userApplications = applications.filter(function(app) {
        return app.userEmail === user.email;
    });

    const latestApplication =
        userApplications[userApplications.length - 1];

    const statusElement = document.getElementById("applicationStatus");
    const infoElement = document.getElementById("applicationInfo");

    if (latestApplication) {
        statusElement.dataset.status = latestApplication.status;
        const progress = document.getElementById("applicationProgress");
        progress.hidden = false;
        const decision = document.getElementById("decisionStep");
        if (latestApplication.status === "Pending") {
            progress.children[1].setAttribute("aria-current", "step");
        } else if (["Approved", "Rejected"].includes(latestApplication.status)) {
            decision.textContent = latestApplication.status;
            decision.setAttribute("aria-current", "step");
        }

        statusElement.textContent = latestApplication.status;
        infoElement.textContent =
            "Application ID: " + latestApplication.applicationId;
    } else {
        statusElement.textContent = "No Application";
        infoElement.textContent = "Apply for your bus pass today.";
    }

    const table = document.getElementById("applicationTable");

    if (userApplications.length > 0) {
        table.innerHTML = "";

        userApplications.forEach(function(app) {
            const row = document.createElement("tr");

            [
                app.applicationId,
                app.passengerType,
                app.source + " → " + app.destination
            ].forEach(function(value) {
                const cell = document.createElement("td");
                cell.textContent = value;
                row.appendChild(cell);
            });

            row.insertCell().appendChild(createStatusBadge(app.status));
            table.appendChild(row);
        });
    }

});
