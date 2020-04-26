const startScript = require("./puppeteer");

window.addEventListener("load", (event) => {
  const formData = {
    url:
      "https://gshow.globo.com/realities/bbb/bbb20/votacao/quem-deve-vencer-o-bbb20-934c622d-6036-4d57-a2d3-af4b982c1af9.ghtml",
  };

  let botsRunning = 0;

  let viewBrowser = false;

  const form = document.getElementById("form");
  const urlInput = document.getElementById("url");
  urlInput.value = formData.url;
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const radios = document.getElementsByClassName("form__radio__input");
  const submitButton = document.getElementById("submitButton");
  const viewCheckbox = document.getElementById("view");
  const botsEl = document.getElementById("bots");

  const validate = () => {
    if (
      formData.email &&
      formData.email !== "" &&
      formData.password &&
      formData.password !== "" &&
      formData.personName &&
      formData.personName !== ""
    )
      return true;

    return false;
  };
  const setValue = (e) => {
    formData[e.target.name] = e.target.value;
    if (validate()) {
      submitButton.disabled = false;
    } else {
      submitButton.disabled = true;
    }
  };

  urlInput.addEventListener("keyup", setValue);

  emailInput.addEventListener("keyup", setValue);

  passwordInput.addEventListener("keyup", setValue);

  viewCheckbox.addEventListener("click", (e) => {
    viewBrowser = e.target.checked;
  })

  if (radios && radios.length > 0) {
    for (let i = 0; i < radios.length; i++) {
      radios[i].addEventListener("change", setValue);
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("Start bot", formData);
    submitButton.innerText = "Iniciar novo bot";
    botsRunning += 1;
    botsEl.innerText = `${botsRunning} bot${
      botsRunning > 1 ? "s" : ""
    } ativo${botsRunning > 1 ? "s" : ""}`;
    startScript(
      formData.url,
      formData.email,
      formData.password,
      formData.personName,
      !viewBrowser,
    )
      .then((res) => {})
      .finally(() => {
        console.log("Votação finalizada");
      });
  });
});
