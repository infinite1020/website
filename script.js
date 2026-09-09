const departments = [
  { name: "Cardiac Sciences", description: "Clear answers and steady hands for every heartbeat.", icon: "♥", timings: "Mon–Sat · 8:00–20:00" },
  { name: "Women & Child", description: "Care that grows with your family, from first scan to first steps.", icon: "●", timings: "Daily · 9:00–19:00" },
  { name: "Neurosciences", description: "Focused expertise for the most complex pathways.", icon: "✦", timings: "Mon–Fri · 8:00–18:00" },
  { name: "Orthopaedics", description: "Move with confidence through injury, surgery and recovery.", icon: "◇", timings: "Mon–Sat · 8:00–20:00" },
  { name: "Internal Medicine", description: "A familiar doctor for the health questions in between.", icon: "✚", timings: "Daily · 8:00–20:00" },
  { name: "Oncology", description: "A multidisciplinary team, present through every chapter.", icon: "♢", timings: "Mon–Sat · 9:00–18:00" }
];

const doctors = [
  { name: "Dr. Ananya Rao", qualification: "MD, DM (Cardiology)", specialization: "Interventional Cardiology", department: "Cardiac Sciences", experience: "16 years", availability: "Today · 4 slots" },
  { name: "Dr. Kabir Mehta", qualification: "MBBS, MS (Ortho)", specialization: "Joint Replacement", department: "Orthopaedics", experience: "12 years", availability: "Tomorrow · 6 slots" },
  { name: "Dr. Meera Iyer", qualification: "MBBS, DNB (Paediatrics)", specialization: "Child Health & Allergy", department: "Women & Child", experience: "14 years", availability: "Today · 3 slots" },
  { name: "Dr. Rohan Sen", qualification: "MBBS, MD (Medicine)", specialization: "Preventive Medicine", department: "Internal Medicine", experience: "18 years", availability: "Today · 5 slots" },
  { name: "Dr. Nisha Kapoor", qualification: "MBBS, DNB (Neuro)", specialization: "Stroke & Recovery", department: "Neurosciences", experience: "11 years", availability: "Tomorrow · 4 slots" },
  { name: "Dr. Arjun Pillai", qualification: "MBBS, MD (Oncology)", specialization: "Medical Oncology", department: "Oncology", experience: "15 years", availability: "Today · 2 slots" }
];

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function renderDepartments() {
  $("#departmentGrid").innerHTML = departments.map((item) => `
    <article class="department-card">
      <div class="department-icon">${item.icon}</div>
      <h3>${item.name}</h3>
      <p>${item.description}</p>
      <span class="card-link">${item.timings} →</span>
    </article>
  `).join("");
}

let selectedDepartment = "";

function renderDoctorFilters() {
  $("#doctorFilters").innerHTML = ["All doctors", ...departments.slice(0, 5).map((item) => item.name)]
    .map((name) => `<button class="filter-chip ${name === (selectedDepartment || "All doctors") ? "active" : ""}" type="button" data-department="${name === "All doctors" ? "" : name}">${name}</button>`)
    .join("");
  $$("#doctorFilters .filter-chip").forEach((button) => {
    button.addEventListener("click", () => {
      selectedDepartment = button.dataset.department;
      renderDoctorFilters();
      renderDoctors();
    });
  });
}

function renderDoctors() {
  const query = $("#doctorSearch").value.trim().toLowerCase();
  const filtered = doctors.filter((doctor) => {
    const matchesText = !query || [doctor.name, doctor.specialization, doctor.department].join(" ").toLowerCase().includes(query);
    return matchesText && (!selectedDepartment || doctor.department === selectedDepartment);
  });
  $("#doctorGrid").innerHTML = filtered.map((doctor) => {
    const initials = doctor.name.replace("Dr. ", "").split(" ").map((part) => part[0]).join("").slice(0, 2);
    return `
      <article class="doctor-card">
        <div class="doctor-avatar">${initials}</div>
        <div>
          <div class="eyebrow">${doctor.department}</div>
          <h3>${doctor.name}</h3>
          <p>${doctor.specialization}<br>${doctor.qualification}</p>
          <div class="doctor-meta">◷ ${doctor.availability} · ${doctor.experience}</div>
          <a class="card-link book-doctor" href="#appointment" data-doctor="${doctor.name}">Book a visit →</a>
        </div>
      </article>
    `;
  }).join("");
  $("#doctorEmpty").classList.toggle("hidden", filtered.length > 0);
  $$(".book-doctor").forEach((link) => link.addEventListener("click", () => {
    $("#appointmentDoctor").value = link.dataset.doctor;
  }));
}

function populateAppointmentOptions() {
  $("#appointmentDepartment").innerHTML += departments.map((item) => `<option value="${item.name}">${item.name}</option>`).join("");
  $("#appointmentDoctor").innerHTML += doctors.map((doctor) => `<option value="${doctor.name}">${doctor.name} · ${doctor.specialization}</option>`).join("");
}

function showMessage(element, message, success = true) {
  element.textContent = message;
  element.style.color = success ? "var(--primary)" : "var(--danger)";
}

function handleForm(formId, messageId, message) {
  const form = $(formId);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    form.reset();
    showMessage($(messageId), message);
    $("#toast").textContent = message;
    $("#toast").classList.add("show");
    window.setTimeout(() => $("#toast").classList.remove("show"), 3600);
  });
}

renderDepartments();
renderDoctorFilters();
renderDoctors();
populateAppointmentOptions();

$("#doctorSearch").addEventListener("input", renderDoctors);
handleForm("#appointmentForm", "#appointmentMessage", "Your appointment request has been received. Our care desk will call shortly.");
handleForm("#emergencyForm", "#emergencyMessage", "Your ambulance request has been received. Please call the emergency number if the situation is critical.");
handleForm("#contactForm", "#contactMessage", "Thank you. Our care desk will reply during working hours.");

const mobileNav = $("#mobileNav");
$("#mobileMenu").addEventListener("click", () => mobileNav.classList.toggle("open"));
$$(".mobile-nav a").forEach((link) => link.addEventListener("click", () => mobileNav.classList.remove("open")));

function updateActiveNav() {
  const current = `${window.location.hash || "#home"}`;
  $$(".nav-link").forEach((link) => link.classList.toggle("active", link.getAttribute("href") === current));
}
window.addEventListener("hashchange", updateActiveNav);
updateActiveNav();

const modal = $("#portalModal");
$("#portalButton").addEventListener("click", () => modal.classList.remove("hidden"));
$("#closeModal").addEventListener("click", () => modal.classList.add("hidden"));
modal.addEventListener("click", (event) => { if (event.target === modal) modal.classList.add("hidden"); });
handleForm("#portalForm", "#portalMessage", "Demo sign-in complete. Your patient portal dashboard is ready.");