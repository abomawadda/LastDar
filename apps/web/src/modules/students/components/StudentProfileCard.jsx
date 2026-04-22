import {
  User,
  IdCard,
  Phone,
  MapPin,
  Users,
  Shield,
  CalendarDays,
  School
} from "lucide-react";

const genderLabel = {
  male: "ذكر",
  female: "أنثى"
};

const branchLabel = {
  main: "الفرع الرئيسي",
  branch_damietta: "فرع دمياط"
};

const relationLabel = {
  father: "الأب",
  mother: "الأم",
  brother: "الأخ",
  sister: "الأخت",
  uncle: "العم",
  aunt: "العمة / الخالة",
  other: "أخرى"
};

function InfoItem({ label, value, icon: Icon }) {
  return (
    <div className="theme-muted-block flex items-center justify-between gap-2 px-3 py-2.5">
      <div className="inline-flex items-center gap-2 text-sm font-bold text-slate-700">
        <Icon size={14} className="text-[var(--gold-dark)]" />
        <span>{label}</span>
      </div>
      <span className="text-sm text-slate-600">{value || "-"}</span>
    </div>
  );
}

export default function StudentProfileCard({ student }) {
  return (
    <section className="theme-surface overflow-hidden rounded-3xl">
      <div className="bg-gradient-to-l from-[var(--gold-dark)] to-[var(--gold)] p-5 text-white">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-white/80">الملف الشخصي</p>
            <h2 className="mt-1 text-xl font-extrabold">{student.fullName || "-"}</h2>
            <p className="mt-1 text-xs text-white/80">كود الطالب: {student.studentCode || "غير محدد"}</p>
          </div>

          <span className="rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs font-bold">
            {student.status === "active" ? "نشط" : student.status || "-"}
          </span>
        </div>
      </div>

      <div className="space-y-3 p-4">
        <InfoItem label="الرقم القومي" value={student.nationalId} icon={IdCard} />
        <InfoItem label="رقم الهاتف" value={student.phone} icon={Phone} />
        <InfoItem label="النوع" value={genderLabel[student.gender] || "-"} icon={User} />
        <InfoItem label="تاريخ الميلاد" value={student.birthDate} icon={CalendarDays} />
        <InfoItem label="المحافظة" value={student.governorate} icon={MapPin} />
        <InfoItem label="الفرع" value={branchLabel[student.branchId] || student.branchId} icon={School} />
        <InfoItem label="ولي الأمر" value={student.guardian?.guardianName || student.guardianName} icon={Users} />
        <InfoItem
          label="صلة القرابة"
          value={relationLabel[student.guardian?.relation || student.guardianRelation] || "-"}
          icon={Shield}
        />
      </div>
    </section>
  );
}
