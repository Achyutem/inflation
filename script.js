function formatIndianCurrency(number) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(
    number
  );
}

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

const referralSource = getQueryParam("ref");
if (referralSource) {
  gtag("event", "custom_referral", {
    referral_source: referralSource,
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const starButton = document.querySelector("#star-button");

  if (starButton) {
    starButton.addEventListener("click", function () {
      gtag("event", "custom_referral", {
        referral_source: "github_star",
      });

      window.open("https://github.com/achyutem/inflation", "_blank");
    });
  }
});

const INVESTMENT_DATA = {
  fd: {
    name: "Fixed Deposit",
    avgReturn: 0.06,
    source: "Reserve Bank of India - Average FD rates from major banks",
    link: "https://www.rbi.org.in/scripts/PublicationsView.aspx?id=21072",
  },
  gold: {
    name: "Gold",
    avgReturn: 0.092,
    source: "World Gold Council - India Gold Return Analysis",
    link: "https://www.gold.org/goldhub/research/india-gold-market",
  },
  sensex: {
    name: "Sensex",
    avgReturn: 0.14,
    source: "Bombay Stock Exchange - Historical Returns",
    link: "https://www.bseindia.com/indices/IndexArchiveData.html",
  },
  nifty: {
    name: "Nifty 50",
    avgReturn: 0.13,
    source: "National Stock Exchange - Historical Returns",
    link: "https://www.nseindia.com/all-reports",
  },
};

const COUNTRY_INFLATION = {
  india: {
    name: "India",
    avgInflation: 0.073,
  },
  usa: {
    name: "USA",
    avgInflation: 0.025,
    source: "US Federal Reserve Economic Data",
  },
  china: {
    name: "China",
    avgInflation: 0.032,
    source: "National Bureau of Statistics of China",
  },
};

function calculateInflation() {
  const yearInput = document.getElementById("year");
  const year = parseInt(yearInput.value);
  const amount = parseFloat(document.getElementById("amount").value);
  const resultDiv = document.querySelector(".result");
  const output = document.getElementById("output");
  const comparisonOutput = document.getElementById("comparison-output");
  const displayDiv = document.getElementById("displayDiv");
  const amountErrorDiv = document.getElementById("amount-error");

  displayDiv.textContent = "";
  amountErrorDiv.textContent = "";
  displayDiv.style.display = "none";
  amountErrorDiv.style.display = "none";
  resultDiv.style.display = "none";
  yearInput.classList.remove("error-input");

  if (isNaN(year) || year < 1947 || year > 2050) {
    displayDiv.textContent = "Please enter a valid year (1947–2050).";
    displayDiv.style.display = "block";
    yearInput.classList.add("error-input");
    return;
  }

  if (isNaN(amount) || amount <= 0) {
    amountErrorDiv.textContent = "Please enter a valid amount greater than 0.";
    amountErrorDiv.style.display = "block";
    return;
  }

  const currentYear = 2025;
  const averageInflationRate = COUNTRY_INFLATION.india.avgInflation;

  const isPastCalculation = year <= currentYear;
  const years = isPastCalculation ? currentYear - year : year - currentYear;

  const futureValue = amount * Math.pow(1 + averageInflationRate, years);
  const formattedValue = formatIndianCurrency(Math.round(futureValue));

  const referenceYear = isPastCalculation ? year : currentYear;

  const comparisonResults = calculateInvestmentComparisons(
    amount,
    years,
    referenceYear,
    !isPastCalculation
  );

  const countryComparisons = isPastCalculation
    ? {}
    : calculateCountryComparisons(amount, years);
  if (isPastCalculation) {
    output.innerHTML = `What cost ₹${formatIndianCurrency(
      amount
    )} in ${year} would cost approximately <br> ₹${formattedValue} in ${currentYear}.`;
  } else {
    output.innerHTML = `To match the value of ₹${formatIndianCurrency(
      amount
    )} today, you would need approximately <br> ₹${formattedValue} in ${year}, assuming average inflation.`;
  }

  let comparisonHTML = `<div class="comparison-title">What if you ${
    isPastCalculation ? "had invested" : "invest"
  } in:</div>`;
  Object.keys(comparisonResults).forEach((key) => {
    const item = comparisonResults[key];
    comparisonHTML += `
            <div class="comparison-item ${key}">
                <div class="comparison-name">${INVESTMENT_DATA[key].name}</div>
                <div class="comparison-value">₹${formatIndianCurrency(
                  item.value
                )}</div>
                <div class="comparison-source">Source: ${
                  INVESTMENT_DATA[key].source
                }</div>
            </div>
        `;
  });

  if (!isPastCalculation && Object.keys(countryComparisons).length > 0) {
    comparisonHTML += `<div class="comparison-title">Equivalent value with inflation rates in:</div>`;
    Object.keys(countryComparisons).forEach((key) => {
      if (key !== "india") {
        const item = countryComparisons[key];
        comparisonHTML += `
            <div class="comparison-item country-${key}">
                <div class="comparison-name">${item.name}</div>
                <div class="comparison-value">₹${formatIndianCurrency(
                  item.value
                )}</div>
                <div class="comparison-source">Source: ${item.source}</div>
            </div>
        `;
      }
    });
  }

  comparisonOutput.innerHTML = comparisonHTML;
  resultDiv.style.display = "block";

  const formatAmountForChart = function (value) {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(1)}Cr`;
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`;
    } else if (value >= 1000) {
      return `₹${(value / 1000).toFixed(1)}K`;
    } else {
      return `₹${value}`;
    }
  };

  setTimeout(() => {
    updateComparisonChart(
      comparisonResults,
      futureValue,
      formatAmountForChart,
      referenceYear
    );
  }, 100);
}

function calculateInvestmentComparisons(
  amount,
  years,
  referenceYear,
  isFuture = false
) {
  const result = {};
  const inflationValue =
    amount * Math.pow(1 + COUNTRY_INFLATION.india.avgInflation, years);

  Object.keys(INVESTMENT_DATA).forEach((key) => {
    if (!isFuture) {
      if (key === "nifty" && referenceYear < 1996) return;
      if (key === "sensex" && referenceYear < 1986) return;
    }

    const data = INVESTMENT_DATA[key];
    const investmentValue = amount * Math.pow(1 + data.avgReturn, years);
    result[key] = {
      value: Math.round(investmentValue),
      ratio: (investmentValue / inflationValue).toFixed(2),
    };
  });

  return result;
}

function calculateCountryComparisons(amount, years) {
  const result = {};
  const indianInflationValue =
    amount * Math.pow(1 + COUNTRY_INFLATION.india.avgInflation, years);

  Object.keys(COUNTRY_INFLATION).forEach((key) => {
    const data = COUNTRY_INFLATION[key];
    const value = amount * Math.pow(1 + data.avgInflation, years);
    result[key] = {
      name: data.name,
      value: Math.round(value),
      ratio: (value / indianInflationValue).toFixed(2),
      source: data.source || "World Economic Data",
    };
  });

  return result;
}

function updateComparisonChart(
  comparisonResults,
  inflationValue,
  formatFn,
  year
) {
  const chartBars = document.querySelectorAll(".chart-bar");
  const maxValue = Math.max(
    inflationValue,
    ...Object.values(comparisonResults).map((item) => item.value)
  );

  chartBars.forEach((bar) => {
    bar.style.display = "block";
  });

  // const inflationBar = document.querySelector(".chart-bar.inflation");
  // inflationBar.style.height = `${(inflationValue / maxValue) * 100}%`;
  // inflationBar.querySelector(".chart-value").textContent = formatFn(
  //   Math.round(inflationValue)
  // );

  Object.keys(INVESTMENT_DATA).forEach((key) => {
    const bar = document.querySelector(`.chart-bar.${key}`);
    if (key === "nifty" && year < 1996 && year <= 2025) {
      bar.style.display = "none";
    } else if (key === "sensex" && year < 1986 && year <= 2025) {
      bar.style.display = "none";
    } else if (comparisonResults[key]) {
      const item = comparisonResults[key];
      bar.style.height = `${(item.value / maxValue) * 100}%`;
      bar.querySelector(".chart-value").textContent = formatFn(item.value);
    }
  });
}

function calculateRandom() {
  document.getElementById("amount").value = 10000;

  const currentYear = 2025;
  const randomYear =
    Math.floor(Math.random() * (2050 - currentYear)) + currentYear + 1;
  document.getElementById("year").value = randomYear;

  calculateInflation();
}

document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    calculateInflation();
  }
});

const BIN_ID = "67dfb9fb8960c979a576bcf1";
const API_KEY = "$2a$10$TJDp4VBjaNjiSszauNJyPeg0jG2W/j.7tv3SuxEr.O/OkX5XBNDFu";
const BIN_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

async function fetchLikes() {
  try {
    const response = await fetch(BIN_URL, {
      headers: { "X-Master-Key": API_KEY },
    });
    const data = await response.json();
    document.getElementById("like-count").textContent = data.record.likes;
  } catch (error) {
    console.error("Error fetching likes:", error);
  }
}

async function incrementLike() {
  const likeCountElement = document.getElementById("like-count");

  let currentLikes = parseInt(likeCountElement.textContent, 10) || 0;
  likeCountElement.textContent = currentLikes + 1;

  const likeButton = document.getElementById("like-button");
  const heart = document.createElement("span");
  heart.classList.add("floating-heart");
  heart.innerHTML = "❤️";
  likeButton.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 1000);

  try {
    const response = await fetch(BIN_URL, {
      headers: { "X-Master-Key": API_KEY },
    });
    const data = await response.json();
    const newLikes = data.record.likes + 1;

    await fetch(BIN_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": API_KEY,
      },
      body: JSON.stringify({ likes: newLikes }),
    });
  } catch (error) {
    console.error("Error updating likes:", error);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const infoButton = document.getElementById("info-button");
  const infoModal = document.getElementById("info-modal");
  const infoClose = document.querySelector(".info-close");
  const diceButton = document.getElementById("dice-button");

  if (diceButton) {
    diceButton.addEventListener("click", calculateRandom);
  }

  if (infoClose) {
    infoClose.addEventListener("click", function () {
      infoModal.style.display = "none";
    });
  }

  infoButton.addEventListener("click", function (event) {
    event.stopPropagation();
    infoModal.style.display =
      infoModal.style.display === "block" ? "none" : "block";
  });

  document.addEventListener("click", function (event) {
    if (
      !infoButton.contains(event.target) &&
      !infoModal.contains(event.target)
    ) {
      infoModal.style.display = "none";
    }
  });

  const themeSwitcher = document.getElementById("theme-switcher");
  themeSwitcher.addEventListener("click", function () {
    document.body.classList.toggle("dark-theme");
    updateThemeIcon();
  });

  function updateThemeIcon() {
    const isDark = document.body.classList.contains("dark-theme");
    themeSwitcher.innerHTML = isDark ? "☀️" : "🌙";
  }

  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    document.body.classList.add("dark-theme");
    updateThemeIcon();
  }

  document
    .getElementById("like-button")
    .addEventListener("click", incrementLike);
  fetchLikes();
});
