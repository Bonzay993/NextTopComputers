

const DROP_DOWN_BTN = document.getElementById("dropdownMenuLink");
const DROP_DOWN_ITEMS = document.querySelectorAll(".dropdown-item");
const form = document.getElementById("registerForm");
const passwordField = document.getElementById("password");
const repeatPasswordField = document.getElementById("repeat-password");
const registerForm = document.getElementById('registerForm');


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
const passwordRulesDiv = document.querySelector('.password-validator');
const passwordRules = {
    uppercase: /[A-Z]/,
    lowercase: /[a-z]/,
    number: /\d/,
    minLength: /.{8,}/
};

function updatePasswordRules() {
  const value = passwordInput.value;
  
  // Check and update the uppercase rule
  const uppercaseValid = passwordRules.uppercase.test(value);
  document.getElementById('uppercase').innerHTML = uppercaseValid ? '✅ Needs an uppercase letter' : '❌ Needs an uppercase letter';
  document.getElementById('uppercase').style.color = uppercaseValid ? 'green' : 'red';
  
  // Check and update the lowercase rule
  const lowercaseValid = passwordRules.lowercase.test(value);
  document.getElementById('lowercase').innerHTML = lowercaseValid ? '✅ Needs a lowercase letter' : '❌ Needs a lowercase letter';
  document.getElementById('lowercase').style.color = lowercaseValid ? 'green' : 'red';
  
  // Check and update the number rule
  const numberValid = passwordRules.number.test(value);
  document.getElementById('number').innerHTML = numberValid ? '✅ Needs a number' : '❌ Needs a number';
  document.getElementById('number').style.color = numberValid ? 'green' : 'red';
  
  // Check and update the minimum length rule
  const minLengthValid = passwordRules.minLength.test(value);
  document.getElementById('minLength').innerHTML = minLengthValid ? '✅ Minimum 8 characters' : '❌ Minimum 8 characters';
  document.getElementById('minLength').style.color = minLengthValid ? 'green' : 'red';
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



// Function to check if all password rules are satisfied
function arePasswordRulesSatisfied() {
    const value = passwordInput.value;
    
    const uppercaseValid = passwordRules.uppercase.test(value);
    const lowercaseValid = passwordRules.lowercase.test(value);
    const numberValid = passwordRules.number.test(value);
    const minLengthValid = passwordRules.minLength.test(value);
    
    // Check if all rules are valid
    return uppercaseValid && lowercaseValid && numberValid && minLengthValid;
}

// Event listener for form submission
registerForm.addEventListener('submit', function (event) {
    // If password rules are not satisfied, prevent form submission
    if (!arePasswordRulesSatisfied()) {
        event.preventDefault(); // Prevent form submission
        alert("Please make sure your password meets all the requirements.");
    }
});