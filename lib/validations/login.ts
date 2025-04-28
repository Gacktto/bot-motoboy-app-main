import * as z from "zod";

export const loginSchema = z.object({
  phone: z
    .string()
    .regex(/^\(\d{2}\)\s\d{5}-\d{4}$/, {
      message: "Telefone deve estar no formato (00) 00000-0000.",
    })
    .transform((phone) => phone.replace(/\D/g, "")), // Remove all non-digit characters
  password: z.string().min(6, {
    message: "A senha deve ter pelo menos 6 caracteres.",
  }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
