const BASE_URL = "https://api.exchangerate-api.com/v4/latest/";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

//  Adding Currency options for each country code
for (let select of dropdowns) {
    let defaultOption = document.createElement("option");
  defaultOption.value = "none";
  defaultOption.innerText = "Select Currency";
  defaultOption.selected = true;
  defaultOption.disabled = true;
  select.append(defaultOption);

  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
     
    select.append(newOption);
  }

  // Update flag image on currency change
  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// Function to update exchange rate
const updateExchangeRate = async () => {
  let amountInput = document.querySelector(".amount input");
  let amtVal = amountInput.value;

  // Default amount to 0 if input is invalid
  if (amtVal === "" || amtVal < 1) {
    msg.innerText = "Please enter a amount.";
    return; // Stop the conversion if no valid input is given
  }

  // Construct the API URL using the selected from currency
  const URL = `${BASE_URL}${fromCurr.value}`;

  try {
    let response = await fetch(URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    let data = await response.json();
    let rate = data.rates[toCurr.value];

    // Calculate final amount
    let finalAmount = (amtVal * rate).toFixed(2);
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    msg.innerText = "Error fetching exchange rate. Please try again.";
  }
};

// Function to update flag based on selected currency
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

// Event listener for the button click to update exchange rate
btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

// Load event to update exchange rate on page load
window.addEventListener("load", () => {
  updateExchangeRate();
});

