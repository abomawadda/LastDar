import { z } from "zod";

const optionalText = z.string().max(150).optional().or(z.literal(""));
const optionalLongText = z.string().max(1000).optional().or(z.literal(""));

export const guardianSchema = z.object({
  fullName: z
    .string()
    .min(3, "اسم ولي الأمر يجب أن يكون 3 أحرف على الأقل")
    .max(120, "اسم ولي الأمر طويل جدًا"),

  phone: z
    .string()
    .min(11, "رقم الموبايل غير مكتمل")
    .max(20, "رقم الموبايل طويل جدًا"),

  alternatePhone: z.string().max(20).optional().or(z.literal("")),

  relationType: z.string().min(1, "يرجى اختيار صلة القرابة"),

  email: z.string().email("البريد الإلكتروني غير صالح").optional().or(z.literal("")),

  nationalId: z
    .string()
    .regex(/^\d{14}$|^$/, "الرقم القومي يجب أن يكون 14 رقمًا")
    .optional()
    .or(z.literal("")),

  address: optionalText,
  jobTitle: optionalText,
  preferredContactMethod: optionalText,
  notes: optionalLongText
});