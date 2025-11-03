declare const grecaptcha: any;
import { actions } from "astro:actions";
import { isInputError } from "astro:actions";

document.addEventListener("astro:page-load", () => {
  const form = document.getElementById("contact-form") as HTMLFormElement;
  const submitBtn = document.getElementById("submit-btn") as HTMLButtonElement;
  const successMsg = document.getElementById(
    "delivery-success-msg"
  ) as HTMLParagraphElement;
  const errorMsg = document.getElementById(
    "delivery-error-msg"
  ) as HTMLParagraphElement;

  const showMessage = (el: HTMLElement, show: boolean) => {
    if (!el) return;
    el.classList.toggle("hidden", !show);
    el.classList.toggle("block", show);
  };

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!form || !submitBtn) return;

    submitBtn.disabled = true;

    form.querySelectorAll(".error-msg").forEach((el) => {
      el.textContent = "";
      el.classList.add("hidden");
    });

    const formData = new FormData(form);

    if (!import.meta.env.PUBLIC_RECAPTCHA_API_KEY) {
      console.error("PUBLIC_RECAPTCHA_API_KEY no está definida en el cliente");
    }

    await new Promise<void>((resolve) => {
      grecaptcha.ready(resolve);
    });

    const token = await grecaptcha.execute(
      import.meta.env.PUBLIC_RECAPTCHA_API_KEY,
      { action: "submit" }
    );

    // Validaciones/Logs para depuración: no imprimir token completo en producción
    if (!token) {
      console.error("No se pudo generar el token de reCAPTCHA");
      showMessage(errorMsg, true);
      submitBtn.disabled = false;
      return;
    }

    if (!token) {
      console.error("No se pudo generar el token de reCAPTCHA");
      showMessage(errorMsg, true);
      submitBtn.disabled = false;
      return;
    }

    formData.append("recaptchaToken", token);

    const result = await actions.sendEmail(formData);

    if (!result.error) {
      showMessage(successMsg, true);
      showMessage(errorMsg, false);
      form.reset();
    } else {
      showMessage(successMsg, false);
      showMessage(errorMsg, true);

      if (isInputError(result.error)) {
        const fields = result.error.fields;
        Object.entries(fields).forEach(([name, messages]) => {
          const input = form.querySelector(`[name="${name}"]`);
          const errorEl = input?.parentElement?.querySelector(".error-msg");
          if (errorEl) {
            errorEl.textContent = Array.isArray(messages)
              ? messages.join(", ")
              : String(messages);
            errorEl.classList.remove("hidden");
            errorEl.classList.add("block");
          }
        });
      }
    }
    submitBtn.disabled = false;

    setTimeout(() => {
      showMessage(successMsg, false);
      showMessage(errorMsg, false);
    }, 5000);
  });
});
