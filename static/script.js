

const DROP_DOWN_BTN = document.getElementById("dropdownMenuLink");
const DROP_DOWN_ITEMS = document.querySelectorAll(".dropdown-item");

window.onload = function() {
    const defaultItem = document.querySelector('.dropdown-item');
    if (defaultItem) {
        defaultItem.classList.add('selected');
    }
};

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

