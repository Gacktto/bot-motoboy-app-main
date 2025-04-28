import * as z from "zod";

export const registrationSchema = z.object({
  name: z.string().min(3, {
    message: "O nome deve ter pelo menos 3 caracteres.",
  }),
  email: z.string().email({
    message: "Email inválido.",
  }),
  password: z.string().min(6, {
    message: "A senha deve ter pelo menos 6 caracteres.",
  }),
  phone: z
    .string()
    .regex(/^\(\d{2}\)\s\d{5}-\d{4}$/, {
      message: "Telefone deve estar no formato (00) 00000-0000.",
    })
    .transform((phone) => phone.replace(/\D/g, "")), // Remove all non-digit characters
});

export type RegistrationFormValues = z.infer<typeof registrationSchema>;
