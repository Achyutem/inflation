function formatIndianCurrency(number) {
  return new Intl.NumberFormat('en-IN').format(number);
}

function calculateInflation() {
  const yearInput = document.getElementById('year');
  const year = parseInt(yearInput.value);
  const amount = parseFloat(document.getElementById('amount').value);
  const resultDiv = document.querySelector('.result');
  const output = document.getElementById('output');
  const yearErrorDiv = document.getElementById('year-error');

  // Reset previous error message and result
  yearErrorDiv.textContent = '';
  resultDiv.style.display = 'none';

  // Validation for year
  if (isNaN(year) || year < 1947 || year > 2023) {
    yearErrorDiv.textContent = 'Please enter a valid year (1947–2023).';
    yearErrorDiv.style.display = 'block';
    yearInput.classList.add('error-input');
    return;
  }

  yearErrorDiv.style.display = 'none';
  yearInput.classList.remove('error-input');

  // Validation for amount
  if (isNaN(amount) || amount <= 0) {
    yearErrorDiv.textContent = 'Please enter a valid amount greater than 0.';
    yearErrorDiv.style.display = 'block';
    return;
  }

  // Inflation Calculation
  const currentYear = 2025;
  const averageInflationRate = 6.5 / 100;
  const years = currentYear - year;
  const futureValue = amount * Math.pow(1 + averageInflationRate, years);
  const formattedValue = formatIndianCurrency(Math.round(futureValue));

  // Display the result
  output.innerHTML = `₹${formatIndianCurrency(amount)} in year ${year} is worth approximately <br> ₹${formattedValue} in ${currentYear}.`;
  resultDiv.style.display = 'block';
}
