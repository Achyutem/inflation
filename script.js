function formatIndianCurrency(number) {
    return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(number);
}

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

const referralSource = getQueryParam('ref');
if (referralSource) {
    gtag('event', 'custom_referral', {
        'referral_source': referralSource
    });
}

function calculateInflation() {
    const yearInput = document.getElementById('year');
    const year = parseInt(yearInput.value);
    const amount = parseFloat(document.getElementById('amount').value);
    const resultDiv = document.querySelector('.result');
    const output = document.getElementById('output');
    const yearErrorDiv = document.getElementById('year-error');
    const amountErrorDiv = document.getElementById('amount-error');

    yearErrorDiv.textContent = '';
    amountErrorDiv.textContent = '';
    yearErrorDiv.style.display = 'none';
    amountErrorDiv.style.display = 'none';
    resultDiv.style.display = 'none';
    yearInput.classList.remove('error-input');

    if (isNaN(year) || year < 1947 || year > 2025) {
        yearErrorDiv.textContent = 'Please enter a valid year (1947–2025).';
        yearErrorDiv.style.display = 'block';
        yearInput.classList.add('error-input');
        return;
    }

    if (isNaN(amount) || amount <= 0) {
        amountErrorDiv.textContent = 'Please enter a valid amount greater than 0.';
        amountErrorDiv.style.display = 'block';
        return;
    }

    const currentYear = 2025;
    const averageInflationRate = 7.3 / 100;
    const years = currentYear - year;
    const futureValue = amount * Math.pow(1 + averageInflationRate, years);
    const formattedValue = formatIndianCurrency(Math.round(futureValue));

    output.innerHTML = `₹${formatIndianCurrency(amount)} in year ${year} is worth approximately <br> ₹${formattedValue} in ${currentYear}.`;
    resultDiv.style.display = 'block';
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        calculateInflation();
    }
});

const BIN_ID = "67dfb9fb8960c979a576bcf1"
const API_KEY = "$2a$10$TJDp4VBjaNjiSszauNJyPeg0jG2W/j.7tv3SuxEr.O/OkX5XBNDFu";
const BIN_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

async function fetchLikes() {
    try {
        const response = await fetch(BIN_URL, {
            headers: { "X-Master-Key": API_KEY }
        });
        const data = await response.json();
        document.getElementById("like-count").textContent = data.record.likes;
    } catch (error) {
        console.error("Error fetching likes:", error);
    }
}

async function incrementLike() {
    try {
        const response = await fetch(BIN_URL, {
            headers: { "X-Master-Key": API_KEY }
        });
        const data = await response.json();
        const newLikes = data.record.likes + 1;

        await fetch(BIN_URL, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "X-Master-Key": API_KEY
            },
            body: JSON.stringify({ likes: newLikes })
        });

        fetchLikes();
    } catch (error) {
        console.error("Error updating likes:", error);
    }
}

document.getElementById("like-button").addEventListener("click", incrementLike);
fetchLikes();

document.addEventListener("DOMContentLoaded", function () {
    const infoButton = document.getElementById("info-button");
    const infoModal = document.getElementById("info-modal");

    infoButton.addEventListener("click", function (event) {
        event.stopPropagation();
        infoModal.style.display = infoModal.style.display === "block" ? "none" : "block";
    });

    document.addEventListener("click", function (event) {
        if (!infoButton.contains(event.target) && !infoModal.contains(event.target)) {
            infoModal.style.display = "none";
        }
    });
});

