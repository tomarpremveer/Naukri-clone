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
      result.json().then((r) => {
        let resultElement = document.querySelector("#emailExistsResult");
        resultElement.hidden = false;
        resultElement.innerHTML = r.isA;
      });
    })
    .catch((err) => {
      err.json().then((r) => {
        let resultElement = document.querySelector("#emailExistsResult");
        resultElement.hidden = false;
        resultElement.innerHTML = r.isA;
      });
    });
}

var debouncedFunction = debounce(checkForEmail, 500);
function sayhi(value) {
  console.log(value);
}
