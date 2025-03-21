function formatIndianCurrency(number) {
    return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(number);
}

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

const referralSourcee = getQueryParam('ref');
if (referralSourcee) {
    gtag('event', 'custom_referral', {
        'event_category': 'traffic_source',
        'referral_source': referralSourcee
    });
}

const referralSource = getQueryParam('ref');
if (referralSource) {
    gtag('event', 'referral', {
        'event_category': 'traffic_source',
        'custom_referral': referralSource
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
    const averageInflationRate = 6.5 / 100;
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

function updateLikeUI() {
    const likeCount = localStorage.getItem('likeCount') || 0;
    document.getElementById('like-count').textContent = likeCount;
}

document.getElementById('like-button').addEventListener('click', function() {
    let likeCount = localStorage.getItem('likeCount') || 0;
    likeCount = parseInt(likeCount) + 1;
    localStorage.setItem('likeCount', likeCount);
    updateLikeUI();

    gtag('event', 'like', {
        'event_category': 'engagement',
        'event_label': 'Project Liked'
    });
});

updateLikeUI();
