import * as z from "zod"

export const contactSchema = z.object({
  name: z.string().min(3, {
    message: "O nome deve ter pelo menos 3 caracteres.",
  }),
  phone: z.string().regex(/^\(\d{2}\) \d{5}-\d{4}$/, {
    message: "Telefone deve estar no formato (00) 00000-0000.",
  }),
})

export type ContactFormValues = z.infer<typeof contactSchema>
