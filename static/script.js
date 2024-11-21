

const DROP_DOWN_BTN = document.getElementById("dropdownMenuLink");
const DROP_DOWN_ITEMS = document.querySelectorAll(".dropdown-item");
const form = document.getElementById("registerForm");
const passwordField = document.getElementById("password");
const repeatPasswordField = document.getElementById("repeatPassword");

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
document.querySelectorAll('#first_name, #last_name, #email, #password').forEach(input => {
  input.addEventListener('blur', function () {
      const errorDiv = document.getElementById(input.id + "_error");
      if (!input.value.trim()) {
          errorDiv.style.display = "block";
      } else {
          errorDiv.style.display = "none";
      }
  });
});