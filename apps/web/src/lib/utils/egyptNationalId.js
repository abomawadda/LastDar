const GOVERNORATE_CODES = {
  "01": "القاهرة",
  "02": "الإسكندرية",
  "03": "بورسعيد",
  "04": "السويس",
  "11": "دمياط",
  "12": "الدقهلية",
  "13": "الشرقية",
  "14": "القليوبية",
  "15": "كفر الشيخ",
  "16": "الغربية",
  "17": "المنوفية",
  "18": "البحيرة",
  "19": "الإسماعيلية",
  "21": "الجيزة",
  "22": "بني سويف",
  "23": "الفيوم",
  "24": "المنيا",
  "25": "أسيوط",
  "26": "سوهاج",
  "27": "قنا",
  "28": "أسوان",
  "29": "الأقصر",
  "31": "البحر الأحمر",
  "32": "الوادي الجديد",
  "33": "مطروح",
  "34": "شمال سيناء",
  "35": "جنوب سيناء",
  "88": "خارج الجمهورية"
};

function calculateAge(birthDate) {
  const today = new Date();
  const birth = new Date(birthDate);

  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birth.getDate())
  ) {
    age--;
  }

  return age;
}

export function parseEgyptianNationalId(nationalId) {
  const value = String(nationalId || "").trim();

  if (!/^\d{14}$/.test(value)) {
    return {
      isValid: false,
      message: "الرقم القومي يجب أن يكون 14 رقمًا"
    };
  }

  const centuryDigit = value[0];
  const yearPart = value.slice(1, 3);
  const monthPart = value.slice(3, 5);
  const dayPart = value.slice(5, 7);
  const govCode = value.slice(7, 9);
  const sequenceDigit = Number(value[12]);

  let centuryPrefix = "";

  if (centuryDigit === "2") centuryPrefix = "19";
  else if (centuryDigit === "3") centuryPrefix = "20";
  else {
    return {
      isValid: false,
      message: "الرقم القومي غير صالح: رقم القرن غير صحيح"
    };
  }

  const fullYear = Number(`${centuryPrefix}${yearPart}`);
  const month = Number(monthPart);
  const day = Number(dayPart);

  const birthDate = new Date(fullYear, month - 1, day);

  const isDateValid =
    birthDate.getFullYear() === fullYear &&
    birthDate.getMonth() === month - 1 &&
    birthDate.getDate() === day;

  if (!isDateValid) {
    return {
      isValid: false,
      message: "الرقم القومي غير صالح: تاريخ الميلاد غير صحيح"
    };
  }

  const gender = sequenceDigit % 2 === 0 ? "female" : "male";
  const governorate = GOVERNORATE_CODES[govCode] || "غير معروف";
  const birthDateIso = `${fullYear}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  return {
    isValid: true,
    nationalId: value,
    birthDate: birthDateIso,
    age: calculateAge(birthDateIso),
    gender,
    governorate,
    governorateCode: govCode
  };
}