
// ======================================
// DIGITAL BUS PASS
// ======================================

document.addEventListener("DOMContentLoaded", function() {

    const user = requireUser();

    if (!user) return;

    const applications = getApplications();

    // Find the latest approved application belonging to this user
    const approvedApplications = applications.filter(function(app) {
        return app.userEmail === user.email &&
               app.status === "Approved";
    });

    const app = approvedApplications[approvedApplications.length - 1];

    const container = document.getElementById("passContainer");
    const message = document.getElementById("passMessage");

    if (!app) {
        container.innerHTML = "";

        const heading = document.createElement("h3");
        heading.textContent = "No Approved Bus Pass Yet";

        const paragraph = document.createElement("p");
        paragraph.textContent =
            "Your bus pass will appear here after admin approval.";

        container.appendChild(heading);
        container.appendChild(paragraph);

        message.textContent =
            "Please check your application status in the dashboard.";

        return;
    }

    container.classList.remove("is-empty");
    document.getElementById("printButton").hidden = false;

    // Create digital pass elements safely
    container.innerHTML = `
        <div class="pass-header">
            <div><h2>CityRide</h2><span class="tagline">Digital bus pass</span></div>
            <span class="approved-label">Approved</span>
        </div>
        <div class="pass-details">
            <dl>
                <div><dt>Passenger name</dt><dd id="pName"></dd></div>
                <div><dt>Pass ID</dt><dd id="pId"></dd></div>
                <div><dt>Category</dt><dd id="pCategory"></dd></div>
                <div><dt>Pass duration</dt><dd id="pDuration"></dd></div>
                <div class="pass-route"><dt>Route</dt><dd id="pRoute"></dd></div>
                <div><dt>Valid from</dt><dd id="pFrom"></dd></div>
                <div><dt>Valid until</dt><dd id="pUntil"></dd></div>
            </dl>
        </div>
        <div class="pass-footer"><small>Academic demonstration only. This pass is invalid for travel.</small></div>
    `;

    document.getElementById("pName").textContent = app.name;
    document.getElementById("pId").textContent = app.passId;
    document.getElementById("pCategory").textContent = app.passengerType;
    document.getElementById("pDuration").textContent = app.duration;
    document.getElementById("pRoute").textContent =
        app.source + " → " + app.destination;
    document.getElementById("pFrom").textContent = app.validFrom;
    document.getElementById("pUntil").textContent = app.validUntil;



});

// ======================================
// PRINT DIGITAL BUS PASS
// ======================================

function printPass() {
    const container = document.getElementById("passContainer");

    if (!container || !container.querySelector("#pName")) {
        alert("You do not have an approved bus pass to print.");
        return;
    }

    window.print();
}
