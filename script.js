function formatIndianCurrency(number) {
      return new Intl.NumberFormat('en-IN').format(number);
    }

function calculateInflation() {
  const year = parseInt(document.getElementById('year').value);
  const amount = parseFloat(document.getElementById('amount').value);
  const resultDiv = document.querySelector('.result');
  const output = document.getElementById('output');

  // Validation
  if (isNaN(year) || isNaN(amount) || year < 1947 || year > 2023) {
    alert('Please enter a valid year (1947–2023) and amount.');
    resultDiv.style.display = 'none';
    return;
  }

  // Inflation Calculation
  const currentYear = 2025;
  const averageInflationRate = 6.5 / 100;
  const years = currentYear - year;
  const futureValue = amount * Math.pow(1 + averageInflationRate, years);
  const formattedValue = futureValue.toLocaleString('en-IN');

  // Display the result
  output.innerHTML = `₹${amount.toLocaleString('en-IN')} in year ${year} is worth approximately <br> ₹${formattedValue} in ${currentYear}.`;
  resultDiv.style.display = 'block';
}
