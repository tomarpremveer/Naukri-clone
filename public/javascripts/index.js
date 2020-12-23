/**
 * Function to show/hide the Company Name input form
 * on change event of the "Are you a Recruiter?" checkbox.
 */

function showCompanyInput() {
  var companyNameElement = document.querySelector("#companyName-div");
  companyNameElement.hidden = !companyNameElement.hidden;
}

/**
 * debounce function to delay the execution of a function
 * @param {function} fn
 * @param {integer} delay
 */
function debounce(fn, delay) {
  var timer;
  return function functionTobeExecuted() {
    var context = this;
    var args = [...arguments];
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, delay);
  };
}

/**
 * Function to check whether username available or not
 */

function checkForEmail(value) {
  fetch("/checkForEmail", {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      value: value,
    }),
  })
    .then((result) => {
      console.log(result);
      // let resultElement = document.querySelector("#emailExistsResult");
      // resultElement.hidden = false;
      // resultElement.innerHTML = "This email is available";
    })
    .catch((err) => {
      let resultElement = document.querySelector("#emailExistsResult");
      resultElement.hidden = false;
      resultElement.innerHTML = "This email is not available";
    });
}

var debouncedFunction = debounce(checkForEmail, 1000);
function sayhi(value) {
  console.log(value);
}
