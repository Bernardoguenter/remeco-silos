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
  }),
  async handler(input) {
    try {
      await resend.emails.send({
        from: "Mi HOUSE <onboarding@resend.dev>",
        to: ["delivered@resend.dev"],
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
