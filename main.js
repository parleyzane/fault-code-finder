// ===============================
//  Fault Code Finder - main.js
// ===============================

// DOM elements
const searchInput = document.getElementById("search");
const resultsDiv = document.getElementById("results");
const pinnedDiv = document.getElementById("pinned");

// Load pinned faults from localStorage
let pinned = JSON.parse(localStorage.getItem("pinnedFaults") || "[]");

// Render pinned faults on startup
renderPinned();

// -------------------------------
// Search handler
// -------------------------------
searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim();

    if (query.length === 0) {
        resultsDiv.innerHTML = "<p>Type an SPN number to search.</p>";
        return;
    }

    // Filter FAULTS by SPN prefix
    const matches = FAULTS.filter(f => f.spn && f.spn.startsWith(query));

    if (matches.length === 0) {
        resultsDiv.innerHTML = "<p>No matching SPN codes found.</p>";
        return;
    }

    renderResults(matches);
});

// -------------------------------
// Render search results
// -------------------------------
function renderResults(list) {
    resultsDiv.innerHTML = "";

    list.forEach(f => {
        const card = document.createElement("div");
        card.className = "fault-card";

        card.innerHTML = `
            <h3>SPN ${f.spn} / FMI ${f.fmi}</h3>
            <p><strong>ECU:</strong> ${f.ecuName}</p>
            <p><strong>Module:</strong> ${f.module}</p>
            <p><strong>Description:</strong> ${f.description}</p>
            <p><strong>Low Condition:</strong> ${f.lowCondition}</p>
            <p><strong>High Condition:</strong> ${f.highCondition}</p>
            <button class="pin-btn">Pin</button>
        `;

        // Pin button handler
        card.querySelector(".pin-btn").addEventListener("click", () => {
            pinFault(f);
        });

        resultsDiv.appendChild(card);
    });
}

// -------------------------------
// Pinning system
// -------------------------------
function pinFault(fault) {
    // Avoid duplicates
    if (!pinned.some(p => p.spn === fault.spn && p.fmi === fault.fmi)) {
        pinned.push(fault);
        localStorage.setItem("pinnedFaults", JSON.stringify(pinned));
        renderPinned();
    }
}

function renderPinned() {
    pinnedDiv.innerHTML = "";

    if (pinned.length === 0) {
        pinnedDiv.innerHTML = "<p>No pinned faults.</p>";
        return;
    }

    pinned.forEach(f => {
        const card = document.createElement("div");
        card.className = "fault-card pinned";

        card.innerHTML = `
            <h3>SPN ${f.spn} / FMI ${f.fmi}</h3>
            <p><strong>ECU:</strong> ${f.ecuName}</p>
            <p><strong>Description:</strong> ${f.description}</p>
            <button class="remove-btn">Remove</button>
        `;

        card.querySelector(".remove-btn").addEventListener("click", () => {
            pinned = pinned.filter(p => !(p.spn === f.spn && p.fmi === f.fmi));
            localStorage.setItem("pinnedFaults", JSON.stringify(pinned));
            renderPinned();
        });

        pinnedDiv.appendChild(card);
    });
}
