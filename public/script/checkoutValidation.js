// Checkout Form Validation
document.addEventListener("DOMContentLoaded", function () {
  const checkoutForm = document.getElementById("checkoutForm");

  // Add submit listener
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", function (e) {
      // Clear all previous error messages
      clearAllErrors();

      // Perform validation
      const isValid = validateForm();

      if (!isValid) {
        e.preventDefault();
        return false;
      }
    });
  }

  // Real-time validation
  addRealTimeValidation();
});

// Clear all error messages
function clearAllErrors() {
  const errorSpans = document.querySelectorAll(".text-red-600");
  errorSpans.forEach((span) => {
    if (span.id && span.id.includes("Error")) {
      span.textContent = "";
      span.classList.add("hidden");
    }
  });

  // Remove error borders from inputs
  document.querySelectorAll(".border-red-500").forEach((el) => {
    el.classList.remove("border-red-500");
    el.classList.add("border-gray-300");
  });
}

// Main validation function
function validateForm() {
  let isValid = true;

  // Validate customer name
  const nameInput = document.getElementById("name");
  const nameError = document.getElementById("nameError");
  if (!nameInput.value.trim()) {
    showError(nameError, "Full name is required");
    highlightError(nameInput);
    isValid = false;
  } else if (nameInput.value.trim().length < 2) {
    showError(nameError, "Name must be at least 2 characters");
    highlightError(nameInput);
    isValid = false;
  }

  // Validate email
  const emailInput = document.getElementById("email");
  const emailError = document.getElementById("emailError");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailInput.value.trim()) {
    showError(emailError, "Email is required");
    highlightError(emailInput);
    isValid = false;
  } else if (!emailRegex.test(emailInput.value.trim())) {
    showError(emailError, "Please enter a valid email address");
    highlightError(emailInput);
    isValid = false;
  }

  // Validate phone
  const phoneInput = document.getElementById("phone");
  const phoneError = document.getElementById("phoneError");
  const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;
  if (!phoneInput.value.trim()) {
    showError(phoneError, "Phone number is required");
    highlightError(phoneInput);
    isValid = false;
  } else if (!phoneRegex.test(phoneInput.value.trim())) {
    showError(
      phoneError,
      "Please enter a valid phone number (7-20 characters)"
    );
    highlightError(phoneInput);
    isValid = false;
  }

  // Validate street
  const streetInput = document.getElementById("street");
  const streetError = document.getElementById("streetError");
  if (!streetInput.value.trim()) {
    showError(streetError, "Street address is required");
    highlightError(streetInput);
    isValid = false;
  } else if (streetInput.value.trim().length < 5) {
    showError(streetError, "Please enter a valid street address");
    highlightError(streetInput);
    isValid = false;
  }

  // Validate city
  const cityInput = document.getElementById("city");
  const cityError = document.getElementById("cityError");
  if (!cityInput.value.trim()) {
    showError(cityError, "City is required");
    highlightError(cityInput);
    isValid = false;
  } else if (cityInput.value.trim().length < 2) {
    showError(cityError, "City must be at least 2 characters");
    highlightError(cityInput);
    isValid = false;
  }

  // Validate state
  const stateInput = document.getElementById("state");
  const stateError = document.getElementById("stateError");
  if (!stateInput.value) {
    showError(stateError, "State is required");
    highlightError(stateInput);
    isValid = false;
  }

  // Validate ZIP code
  const zipInput = document.getElementById("zipCode");
  const zipError = document.getElementById("zipCodeError");
  const zipRegex = /^\d{5}(-\d{4})?$/;
  if (!zipInput.value.trim()) {
    showError(zipError, "ZIP code is required");
    highlightError(zipInput);
    isValid = false;
  } else if (!zipRegex.test(zipInput.value.trim())) {
    showError(zipError, "Please enter a valid ZIP code (e.g., 10001)");
    highlightError(zipInput);
    isValid = false;
  }

  // Validate country
  const countryInput = document.getElementById("country");
  const countryError = document.getElementById("countryError");
  if (!countryInput.value) {
    showError(countryError, "Country is required");
    highlightError(countryInput);
    isValid = false;
  }

  // Validate payment method
  const paymentRadios = document.querySelectorAll(
    'input[name="paymentMethod"]'
  );
  const paymentError = document.getElementById("paymentError");
  const paymentSelected = Array.from(paymentRadios).some((radio) => radio.checked);
  if (!paymentSelected) {
    showError(paymentError, "Please select a payment method");
    isValid = false;
  }

  // Scroll to first error if exists
  if (!isValid) {
    const firstError = document.querySelector(".text-red-600:not(.hidden)");
    if (firstError) {
      firstError.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  return isValid;
}

// Helper function to show error message
function showError(errorElement, message) {
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.classList.remove("hidden");
  }
}

// Helper function to highlight error field
function highlightError(input) {
  input.classList.remove("border-gray-300");
  input.classList.add("border-red-500");
}

// Add real-time validation
function addRealTimeValidation() {
  const nameInput = document.getElementById("name");
  if (nameInput) {
    nameInput.addEventListener("blur", function () {
      const nameError = document.getElementById("nameError");
      if (!this.value.trim()) {
        showError(nameError, "Full name is required");
        highlightError(this);
      } else if (this.value.trim().length < 2) {
        showError(nameError, "Name must be at least 2 characters");
        highlightError(this);
      } else {
        nameError.textContent = "";
        nameError.classList.add("hidden");
        this.classList.remove("border-red-500");
        this.classList.add("border-gray-300");
      }
    });
  }

  const emailInput = document.getElementById("email");
  if (emailInput) {
    emailInput.addEventListener("blur", function () {
      const emailError = document.getElementById("emailError");
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!this.value.trim()) {
        showError(emailError, "Email is required");
        highlightError(this);
      } else if (!emailRegex.test(this.value.trim())) {
        showError(emailError, "Please enter a valid email address");
        highlightError(this);
      } else {
        emailError.textContent = "";
        emailError.classList.add("hidden");
        this.classList.remove("border-red-500");
        this.classList.add("border-gray-300");
      }
    });
  }

  const phoneInput = document.getElementById("phone");
  if (phoneInput) {
    phoneInput.addEventListener("blur", function () {
      const phoneError = document.getElementById("phoneError");
      const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;
      if (!this.value.trim()) {
        showError(phoneError, "Phone number is required");
        highlightError(this);
      } else if (!phoneRegex.test(this.value.trim())) {
        showError(
          phoneError,
          "Please enter a valid phone number (7-20 characters)"
        );
        highlightError(this);
      } else {
        phoneError.textContent = "";
        phoneError.classList.add("hidden");
        this.classList.remove("border-red-500");
        this.classList.add("border-gray-300");
      }
    });
  }

  const streetInput = document.getElementById("street");
  if (streetInput) {
    streetInput.addEventListener("blur", function () {
      const streetError = document.getElementById("streetError");
      if (!this.value.trim()) {
        showError(streetError, "Street address is required");
        highlightError(this);
      } else if (this.value.trim().length < 5) {
        showError(streetError, "Please enter a valid street address");
        highlightError(this);
      } else {
        streetError.textContent = "";
        streetError.classList.add("hidden");
        this.classList.remove("border-red-500");
        this.classList.add("border-gray-300");
      }
    });
  }

  const cityInput = document.getElementById("city");
  if (cityInput) {
    cityInput.addEventListener("blur", function () {
      const cityError = document.getElementById("cityError");
      if (!this.value.trim()) {
        showError(cityError, "City is required");
        highlightError(this);
      } else if (this.value.trim().length < 2) {
        showError(cityError, "City must be at least 2 characters");
        highlightError(this);
      } else {
        cityError.textContent = "";
        cityError.classList.add("hidden");
        this.classList.remove("border-red-500");
        this.classList.add("border-gray-300");
      }
    });
  }

  const zipInput = document.getElementById("zipCode");
  if (zipInput) {
    zipInput.addEventListener("blur", function () {
      const zipError = document.getElementById("zipCodeError");
      const zipRegex = /^\d{5}(-\d{4})?$/;
      if (!this.value.trim()) {
        showError(zipError, "ZIP code is required");
        highlightError(this);
      } else if (!zipRegex.test(this.value.trim())) {
        showError(zipError, "Please enter a valid ZIP code (e.g., 10001)");
        highlightError(this);
      } else {
        zipError.textContent = "";
        zipError.classList.add("hidden");
        this.classList.remove("border-red-500");
        this.classList.add("border-gray-300");
      }
    });
  }

  const stateSelect = document.getElementById("state");
  if (stateSelect) {
    stateSelect.addEventListener("change", function () {
      const stateError = document.getElementById("stateError");
      if (this.value) {
        stateError.textContent = "";
        stateError.classList.add("hidden");
        this.classList.remove("border-red-500");
        this.classList.add("border-gray-300");
      }
    });
  }

  const countrySelect = document.getElementById("country");
  if (countrySelect) {
    countrySelect.addEventListener("change", function () {
      const countryError = document.getElementById("countryError");
      if (this.value) {
        countryError.textContent = "";
        countryError.classList.add("hidden");
        this.classList.remove("border-red-500");
        this.classList.add("border-gray-300");
      }
    });
  }

  // Payment method validation
  const paymentRadios = document.querySelectorAll(
    'input[name="paymentMethod"]'
  );
  paymentRadios.forEach((radio) => {
    radio.addEventListener("change", function () {
      const paymentError = document.getElementById("paymentError");
      if (this.checked) {
        paymentError.textContent = "";
        paymentError.classList.add("hidden");
      }
    });
  });
}
