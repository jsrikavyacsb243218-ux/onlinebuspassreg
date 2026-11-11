
// ======================================
// BUS PASS APPLICATION
// ======================================

document.addEventListener("DOMContentLoaded", function() {

    const user = requireUser();

    if (!user) return;

    const form = document.getElementById("applicationForm");

    const typeSelect = document.getElementById("passengerType");
    const studentFields = document.getElementById("studentFields");
    const institution = document.getElementById("institution");
    const studentId = document.getElementById("studentId");

    // Load logged-in user information
    document.getElementById("appName").value = user.name;
    document.getElementById("appPhone").value = user.phone;
    document.getElementById("appEmail").value = user.email;
    typeSelect.value = user.category;

    function updateStudentFields() {
        const isStudent = typeSelect.value === "Student";

        studentFields.hidden = !isStudent;

        institution.required = isStudent;
        studentId.required = isStudent;

        if (!isStudent) {
            institution.value = "";
            studentId.value = "";
        }
    }

    typeSelect.addEventListener("change", updateStudentFields);
    updateStudentFields();

    form.addEventListener("submit", function(event) {

        event.preventDefault();

        const message = document.getElementById("applicationMessage");

        const dob = document.getElementById("dob").value;
        const today = new Date().toISOString().split("T")[0];

        if (dob >= today) {
            message.dataset.tone = "error";
            message.textContent = "Please select a valid date of birth.";
            return;
        }

        const source = document.getElementById("source").value.trim();
        const destination = document.getElementById("destination").value.trim();

        if (source.toLowerCase() === destination.toLowerCase()) {
            message.dataset.tone = "error";
            message.textContent = "Source and destination must be different.";
            return;
        }

        const applications = getApplications();

        const application = {
            applicationId: "BP" + Date.now(),
            userEmail: user.email,
            name: document.getElementById("appName").value.trim(),
            dob: dob,
            gender: document.getElementById("gender").value,
            phone: document.getElementById("appPhone").value.trim(),
            email: document.getElementById("appEmail").value.trim(),
            address: document.getElementById("address").value.trim(),
            passengerType: typeSelect.value,
            institution: institution.value.trim(),
            studentId: studentId.value.trim(),
            source: source,
            destination: destination,
            duration: document.getElementById("duration").value,
            applicationDate: new Date().toLocaleDateString(),
            status: "Pending"
        };

        applications.push(application);

        saveApplications(applications);

        message.dataset.tone = "success";
        message.textContent =
            "Application submitted successfully! Your application ID is " +
            application.applicationId;

        form.reset();

        setTimeout(function() {
            window.location.href = "dashboard.html";
        }, 1800);

    });

});
