import { defineAction, ActionError } from "astro:actions";
import { z } from "astro:schema";
import { Resend } from "resend";

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const sendEmail = defineAction({
  accept: "form",
  input: z.object({
    nombre: z
      .string({
        message: "El nombre es obligatorio",
      })
      .min(1, "El nombre es obligatorio"),
    email: z
      .string({
        message: "El e-mail es obligatorio",
      })
      .email("Debe ser un email válido"),
    telefono: z
      .string({ message: "El teléfono es obligatorio" })
      .min(1, "El teléfono es obligatorio"),
    mensaje: z
      .string({
        message: "El mensaje es obligatorio",
      })
      .min(1, "El mensaje es obligatorio"),
    recaptchaToken: z.string(),
  }),
  async handler(input) {
    try {
      // Validación básica del token para evitar llamadas inútiles a Google
      if (!input.recaptchaToken || typeof input.recaptchaToken !== "string") {
        console.error(
          "reCAPTCHA token ausente o inválido:",
          input.recaptchaToken
        );
        throw new Error("Token de reCAPTCHA ausente o inválido");
      }
      const token = input.recaptchaToken as string;

      const recaptchaSecret = import.meta.env.RECAPTCHA_API_KEY;
      if (!recaptchaSecret) {
        console.error(
          "RECAPTCHA_API_KEY (secret) no está definida en el servidor"
        );
        throw new Error("RECAPTCHA secret no configurada en el servidor");
      }

      const response = await fetch(
        "https://www.google.com/recaptcha/api/siteverify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            secret: import.meta.env.RECAPTCHA_API_KEY,
            response: input.recaptchaToken,
          }),
        }
      );

      const result = await response.json();
      if (
        !result.success ||
        (typeof result.score === "number" && result.score < 0.5)
      ) {
        console.error("reCAPTCHA verification failed. Details:", result);
        const errors = result["error-codes"]
          ? result["error-codes"].join(", ")
          : undefined;
        throw new Error(
          `Falló la verificación de reCAPTCHA${errors ? `: ${errors}` : ""}`
        );
      }

      await resend.emails.send({
        from: "Remeco Silos <noreply@silosremeco.com>",
        to: ["juanmderosa@gmail.com"],
        subject: "Nuevo mensaje de contacto desde Silos",
        html: `
          <h2>Mensaje recibido desde el formulario</h2>
          <ul>
            <li><strong>Nombre:</strong> ${input.nombre}</li>
            <li><strong>Email:</strong> ${input.email}</li>
            <li><strong>Teléfono:</strong> ${input.telefono}</li>
            <li><strong>Mensaje:</strong> ${input.mensaje}</li>
          </ul>
        `,
      });
      return { success: true };
    } catch (error) {
      console.error(error);
      throw new ActionError({
        code: "BAD_REQUEST",
        message: "Error al enviar el mensaje.",
      });
    }
  },
});
