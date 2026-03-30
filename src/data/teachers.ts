export interface Teacher {
  pin: string;
  name: string;
  county: string;
  school: string;
  subject: string;
}

export const TEACHERS: Teacher[] = [
  { pin: "TSC001234", name: "Mr. Otieno", county: "Kisumu", school: "Kisumu Day Primary", subject: "English" },
  { pin: "TSC005678", name: "Ms. Wanjiku", county: "Nairobi", school: "Starehe Primary", subject: "Mathematics" },
  { pin: "TSC009012", name: "Mr. Mwangi", county: "Kiambu", school: "Thika Road Primary", subject: "Science" },
  { pin: "TSC003456", name: "Mrs. Achieng", county: "Siaya", school: "Got Regea Primary", subject: "Kiswahili" },
  { pin: "TSC007890", name: "Mr. Kamau", county: "Murang'a", school: "Kandara Boys Primary", subject: "ICT" },
  { pin: "TSC002345", name: "Ms. Njeri", county: "Nyeri", school: "Nyeri Town Primary", subject: "English" },
  { pin: "TSC006789", name: "Mr. Omondi", county: "Migori", school: "Migori Primary", subject: "Social Studies" },
  // legacy pin kept for backward compat
  { pin: "12345678", name: "Mr. Otieno", county: "Kisumu", school: "Kisumu Day Primary", subject: "English" },
];

export const findTeacherByPin = (pin: string): Teacher | undefined =>
  TEACHERS.find((t) => t.pin.toLowerCase() === pin.trim().toLowerCase());
