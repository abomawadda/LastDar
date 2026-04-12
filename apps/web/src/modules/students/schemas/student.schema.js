import { z } from "zod";

const optionalText = z.string().max(150).optional().or(z.literal(""));
const optionalLongText = z.string().max(1000).optional().or(z.literal(""));

export const studentSchema = z.object({
  fullName: z
    .string()
    .min(3, "اسم الطالب يجب أن يكون 3 أحرف على الأقل")
    .max(120, "اسم الطالب طويل جدًا"),

  nationalId: z
    .string()
    .regex(/^\d{14}$|^$/, "الرقم القومي يجب أن يكون 14 رقمًا")
    .optional()
    .or(z.literal("")),

  birthDate: optionalText,
  age: z.union([z.number(), z.null()]).optional(),
  gender: z.enum(["male", "female", ""]).optional(),
  governorate: optionalText,

  phone: z.string().max(20).optional().or(z.literal("")),

  branchId: optionalText,
  joinType: optionalText,
  status: optionalText,

  levelId: optionalText,
  classId: optionalText,

  guardianName: optionalText,
  guardianPhone: z.string().max(20).optional().or(z.literal("")),
  guardianRelation: optionalText,

  fatherName: optionalText,
  fatherPhone: z.string().max(20).optional().or(z.literal("")),
  fatherNationalId: z
    .string()
    .regex(/^\d{14}$|^$/, "الرقم القومي للأب يجب أن يكون 14 رقمًا")
    .optional()
    .or(z.literal("")),

  motherName: optionalText,
  motherPhone: z.string().max(20).optional().or(z.literal("")),

  address: optionalText,
  area: optionalText,
  landmark: optionalText,

  chronicDiseaseDetails: optionalLongText,
  allergyDetails: optionalLongText,
  medications: optionalLongText,
  specialNeeds: optionalLongText,
  healthNotes: optionalLongText,

  emergencyContactName: optionalText,
  emergencyContactPhone: z.string().max(20).optional().or(z.literal("")),
  emergencyContactRelation: optionalText,

  adminNotes: optionalLongText
});