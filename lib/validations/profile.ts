import * as z from "zod"

export const profileSchema = z.object({
  name: z.string().min(3, {
    message: "O nome deve ter pelo menos 3 caracteres.",
  }),
  email: z.string().email({
    message: "Email inválido.",
  }),
  phone: z.string().regex(/^$$\d{2}$$ \d{5}-\d{4}$/, {
    message: "Telefone deve estar no formato (00) 00000-0000.",
  }),
})

export const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, {
      message: "A senha deve ter pelo menos 6 caracteres.",
    }),
    newPassword: z.string().min(6, {
      message: "A senha deve ter pelo menos 6 caracteres.",
    }),
    confirmPassword: z.string().min(6, {
      message: "A senha deve ter pelo menos 6 caracteres.",
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  })

export type ProfileFormValues = z.infer<typeof profileSchema>
export type PasswordFormValues = z.infer<typeof passwordSchema>

