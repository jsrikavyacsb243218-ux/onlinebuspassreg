
// ======================================
// CITYRIDE ADMIN DASHBOARD
// ======================================

document.addEventListener("DOMContentLoaded", function() {

    if (!requireAdmin()) return;

    displayStatistics();
    displayApplications();
    displayUsers();

    document.getElementById("searchApplication").addEventListener("input", displayApplications);
    document.getElementById("statusFilter").addEventListener("change", displayApplications);
    window.addEventListener("storage", event => {
        if (event.key === "applications" || event.key === "users" || event.key === null) {
            displayStatistics();
            displayApplications();
            displayUsers();
        }
    });
});

// ======================================
// DISPLAY STATISTICS
// ======================================

function displayStatistics() {

    const users = getUsers();

    const applications = getApplications();

    const pending = applications.filter(app => app.status === "Pending").length;
    const approved = applications.filter(app => app.status === "Approved").length;
    const rejected = applications.filter(app => app.status === "Rejected").length;

    updateCounter(document.getElementById("totalUsers"), users.length);
    updateCounter(document.getElementById("totalApplications"), applications.length);
    updateCounter(document.getElementById("pendingApplications"), pending);
    updateCounter(document.getElementById("approvedApplications"), approved);

    const knownTotal = pending + approved + rejected;
    document.getElementById("statusBreakdown").hidden = knownTotal === 0;
    for (const [status, count] of Object.entries({ Pending: pending, Approved: approved, Rejected: rejected })) {
        const segment = document.querySelector(`[data-segment="${status}"]`);
        segment.hidden = count === 0;
        segment.style.flexGrow = count;
        document.querySelector(`[data-count="${status}"]`).textContent = count;
    }
}

// ======================================
// DISPLAY ALL APPLICATIONS
// ======================================

function displayApplications() {
    const searchText = document.getElementById("searchApplication").value.trim().toLowerCase();
    const status = document.getElementById("statusFilter").value;

    const applications = getApplications();

    const table =
        document.getElementById("adminApplicationTable");

    table.innerHTML = "";

    const filtered = applications.filter(function(app) {
        const matchesText = app.name.toLowerCase().includes(searchText) ||
            app.applicationId.toLowerCase().includes(searchText);
        return matchesText && (!status || app.status === status);
    });

    if (filtered.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.colSpan = 7;
        cell.textContent = searchText || status
            ? "No applications match your filters."
            : "No applications have been submitted yet.";

        row.appendChild(cell);
        table.appendChild(row);
        return;
    }

    filtered.forEach(function(app) {

        const row = document.createElement("tr");

        const values = [
            app.applicationId,
            app.name,
            app.passengerType,
            app.source + " → " + app.destination,
            app.duration
        ];

        values.forEach(function(value) {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        row.insertCell().appendChild(createStatusBadge(app.status));
        const actionCell = row.insertCell();

        if (app.status === "Pending") {
            const actions = document.createElement("div");
            actions.className = "row-actions";
            for (const [label, status, cssClass] of [
                ["Approve", "Approved", "approve-btn"],
                ["Reject", "Rejected", "reject-btn"]
            ]) {
                const button = document.createElement("button");
                button.type = "button";
                button.textContent = label;
                button.className = `action-btn ${cssClass}`;
                button.setAttribute("aria-label", `${label} application ${app.applicationId}`);
                button.addEventListener("click", () => reviewApplication(app, label, status));
                actions.appendChild(button);
            }
            actionCell.appendChild(actions);
        } else {
            actionCell.textContent = "—";
        }

        table.appendChild(row);

    });

}

// ======================================
// APPROVE OR REJECT APPLICATION
// ======================================

function reviewApplication(application, action, newStatus) {
    const dialog = document.getElementById("reviewDialog");
    document.getElementById("reviewTitle").textContent = `${action} application?`;
    document.getElementById("reviewDetails").textContent =
        `${application.name} · ${application.applicationId}`;
    document.getElementById("confirmReview").textContent = action;
    dialog.returnValue = "";
    dialog.addEventListener("close", () => {
        if (dialog.returnValue === "confirm") {
            updateApplicationStatus(application.applicationId, newStatus);
        }
    }, { once: true });
    dialog.showModal();
}

function updateApplicationStatus(applicationId, newStatus) {
    if (newStatus !== "Approved" && newStatus !== "Rejected") return;

    let applications = getApplications();

    const reviewMessage = document.getElementById("reviewMessage");
    if (!applications.some(app => app.applicationId === applicationId && app.status === "Pending")) {
        reviewMessage.dataset.tone = "error";
        reviewMessage.textContent = "This application has already been reviewed.";
        displayStatistics();
        displayApplications();
        return;
    }

    applications = applications.map(function(app) {

        if (app.applicationId === applicationId &&
            app.status === "Pending") {

            app.status = newStatus;

            if (newStatus === "Approved") {

                const startDate = new Date();
                const endDate = new Date(startDate);

                if (app.duration === "Monthly") {
                    endDate.setMonth(endDate.getMonth() + 1);
                } else {
                    endDate.setMonth(endDate.getMonth() + 3);
                }

                app.validFrom = startDate.toLocaleDateString("en-GB");
                app.validUntil = endDate.toLocaleDateString("en-GB");

                app.passId = "PASS" + Date.now();

            }
        }

        return app;

    });

    saveApplications(applications);

    reviewMessage.dataset.tone = "success";
    reviewMessage.textContent = `Application ${applicationId} ${newStatus.toLowerCase()}.`;

    displayStatistics();
    displayApplications();
    document.getElementById("searchApplication").focus();
}

// ======================================
// DISPLAY REGISTERED USERS
// ======================================

function displayUsers() {

    const users = getUsers();

    const table = document.getElementById("adminUserTable");

    table.innerHTML = "";

    if (users.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.colSpan = 4;
        cell.textContent = "No registered users.";

        row.appendChild(cell);
        table.appendChild(row);
        return;
    }

    users.forEach(function(user) {

        const row = document.createElement("tr");

        const values = [
            user.name,
            user.email,
            user.phone,
            user.category
        ];

        values.forEach(function(value) {

            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);

        });

        table.appendChild(row);

    });

}
