import { z } from "zod";

export const credentialsSchema = z.object({
  email: z.string().trim().toLowerCase().email("That doesn't look like an email."),
  password: z
    .string()
    .min(10, "Password needs to be at least 10 characters.")
    .max(200, "Password is too long."),
});

export const newEntrySchema = z.object({
  body: z.string().min(1, "Nothing to save.").max(20_000, "That's a very long entry."),
  kind: z.enum(["stamped", "planted"]),
});

export type Credentials = z.infer<typeof credentialsSchema>;
export type NewEntryInput = z.infer<typeof newEntrySchema>;
