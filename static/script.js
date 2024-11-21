

const DROP_DOWN_BTN = document.getElementById("dropdownMenuLink");
const DROP_DOWN_ITEMS = document.querySelectorAll(".dropdown-item");
const form = document.getElementById("registerForm");
const passwordField = document.getElementById("password");
const repeatPasswordField = document.getElementById("repeat-password");

window.onload = function() {
    const defaultItem = document.querySelector('.dropdown-item');
    if (defaultItem) {
        defaultItem.classList.add('selected');
    }
};


// This checks for Passwords to match in the registration form
  document.addEventListener("DOMContentLoaded", function() {
    
    form.addEventListener("submit", function(event) {
      if (passwordField.value !== repeatPasswordField.value) {
        event.preventDefault();
        passwordError.style.display = "block";  // Show error message
        repeatPasswordField.focus();
      }  else {
        passwordError.style.display = "none";  // Hide error message if passwords match
    }
    });
  });


//script for the filter button
DROP_DOWN_ITEMS.forEach(item => {
    item.addEventListener('click', function(event) {
      event.preventDefault(); 
      DROP_DOWN_BTN.textContent = this.textContent;
    });
  });

//function so that the items currently selected on the filter gets highlighted
function selectItem(element){
    const ITEMS = document.querySelectorAll(".dropdown-item");
    ITEMS.forEach(item => item.classList.remove('selected'));

    element.classList.add('selected');

    DROP_DOWN_BTN.textContent = element.textContent;
}

/** Registration Form Fields Validation */

// Validation messages for First Name, Last Name, and Email
document.querySelectorAll('#first_name, #last_name, #email, #password, #password_rules').forEach(input => {
  input.addEventListener('blur', function () {
      const errorDiv = document.getElementById(input.id + "_error");
      if (!input.value.trim()) {
          errorDiv.style.display = "block";
          input.style.border = "2px solid red";
      } else {
          errorDiv.style.display = "none";
          input.style.border = "";
      }
  });
});

const passwordInput = document.getElementById('password');
const passwordRulesDiv = document.getElementById('password_error');
const passwordRules = {
    uppercase: /[A-Z]/,
    lowercase: /[a-z]/,
    number: /\d/,
    minLength: /.{8,}/
};

// Create the rule status dynamically
function updatePasswordRules() {
    const value = passwordInput.value;
    document.getElementById('uppercase').innerHTML = passwordRules.uppercase.test(value) ? '✅ Needs an uppercase letter' : '❌ Needs an uppercase letter';
    document.getElementById('lowercase').innerHTML = passwordRules.lowercase.test(value) ? '✅ Needs a lowercase letter' : '❌ Needs a lowercase letter';
    document.getElementById('number').innerHTML = passwordRules.number.test(value) ? '✅ Needs a number' : '❌ Needs a number';
    document.getElementById('minLength').innerHTML = passwordRules.minLength.test(value) ? '✅ Minimum 8 characters' : '❌ Minimum 8 characters';
}

// Show password rules on focus
passwordInput.addEventListener('focus', () => {
    passwordRulesDiv.style.display = "block"; // Show rules
    updatePasswordRules(); // Update based on current value
});

// Hide password rules on blur if not needed
passwordInput.addEventListener('blur', () => {
    if (!passwordInput.value.trim()) {
        passwordRulesDiv.style.display = "none"; // Hide if empty
    }
});

// Update password rules dynamically on input
passwordInput.addEventListener('input', updatePasswordRules);