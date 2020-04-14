const startScript = require("./puppeteer");

window.addEventListener("load", (event) => {
  const formData = {
    url:
      "https://gshow.globo.com/realities/bbb/bbb20/votacao/paredao-bbb20-quem-voce-quer-eliminar-babu-gizelly-ou-mari-6b0c783d-65cd-4a4e-940c-ad086cf73fee.ghtml",
  };

  const form = document.getElementById("form");
  const urlInput = document.getElementById("url");
  urlInput.value = formData.url;
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const radios = document.getElementsByClassName("form__radio__input");
  const submitButton = document.getElementById("submitButton");

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
    console.log("in prop", e.target.name);
    console.log("set value", e.target.value);
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

  console.log("current radios", radios[0]);

  if (radios && radios.length > 0) {
    for (let i = 0; i < radios.length; i++) {
      radios[i].addEventListener("change", setValue);
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("submit form with values", formData);
    startScript(
      formData.url,
      formData.email,
      formData.password,
      formData.personName
    ).then(res => {
      console.log('Votação encerrada');
    });
  });
});
