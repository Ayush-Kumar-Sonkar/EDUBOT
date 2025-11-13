// populateSampleData.js
import FAQ from '../models/faq.js'

// -----------------------------
// Synonyms map for keyword expansion
// -----------------------------
const synonymsMap = {
  admission: ["admission", "entry", "enrollment", "register", "apply"],
  course: ["course", "class", "subject", "module"],
  library: ["library", "books", "reading room", "study hall"],
  tuition: ["tuition", "fees", "cost", "payment", "charges"],
  scholarship: ["scholarship", "grant", "financial aid", "funding"],
  password: ["password", "passcode", "login key", "credentials"],
  wifi: ["wifi", "internet", "network", "wireless"],
  hostel: ["hostel", "dormitory", "accommodation", "residence"],
  application: ["application", "form", "submit", "deadline"],
  registration: ["registration", "enroll", "signup", "course selection"]
}

// -----------------------------
// Helper: Expand keywords with synonyms
// -----------------------------
const expandKeywords = (keywords) => {
  const expanded = new Set()
  keywords.forEach(k => {
    expanded.add(k.toLowerCase())
    if (synonymsMap[k.toLowerCase()]) {
      synonymsMap[k.toLowerCase()].forEach(s => expanded.add(s.toLowerCase()))
    }
  })
  return Array.from(expanded)
}

// -----------------------------
// Sample FAQ data (you can add more)
// -----------------------------
const sampleFAQs = [
  {
    question: "What are the admission requirements for postgraduate programs?",
    answer: "For postgraduate programs, you must have a bachelor's degree with minimum 60% marks, pass the entrance exam, and submit transcripts and recommendation letters.",
    category: "admissions",
    language: "en",
    keywords: expandKeywords(["admission", "requirements", "postgraduate", "degree", "entrance","PG"])
  },
  {
    question: "What are the admission requirements for undergraduate programs?",
    answer: "For undergraduate programs, you need to have completed 12th grade with minimum 60% marks, pass our entrance exam, and submit all required documents including transcripts, recommendation letters, and personal statement.",
    category: "admissions",
    language: "en",
    keywords: expandKeywords(["admission", "requirements", "undergraduate", "eligibility", "12th", "grade", "entrance", "exam", "documents", "apply","UG"])
  },
  {
    question: "When is the application deadline?",
    answer: "The application deadline for undergraduate programs is March 31st. Late applications may be considered on a case-by-case basis with additional fees.",
    category: "admissions",
    language: "en",
    keywords: expandKeywords(["deadline", "application", "date", "last", "march", "when", "apply", "time", "due"])
  },
  {
    question: "How do I check my application status?",
    answer: "You can check your application status by logging into the student portal with your application ID and password. Status updates are available 24/7.",
    category: "admissions",
    language: "en",
    keywords: expandKeywords(["application", "status", "check", "portal", "login", "track", "how", "where", "student"])
  },

  // Academic - English
  {
    question: "How do I access the Learning Management System (LMS)?",
    answer: "You can access the LMS at lms.college.edu using your student ID and password. If you forgot your password, use the 'Forgot Password' link or contact IT support at it-support@college.edu.",
    category: "academic",
    language: "en",
    keywords: expandKeywords(["LMS", "learning management system", "access", "login", "password"])
  },
  {
    question: "What courses are available for Computer Science?",
    answer: "Our Computer Science program offers courses in Programming, Data Structures, Algorithms, Database Systems, Web Development, Machine Learning, and more. Visit our website for the complete curriculum.",
    category: "academic",
    language: "en",
    keywords: expandKeywords(["courses", "computer science", "curriculum", "subjects", "programming","CS courses"])
  },
  {
    question: "How do I register for courses?",
    answer: "Course registration opens at the beginning of each semester. Log into the student portal, go to 'Course Registration', select your courses, and submit. Contact the academic office if you need assistance.",
    category: "academic",
    language: "en",
    keywords: expandKeywords(["course registration", "enroll", "subjects", "semester", "register"])
  },

  // Campus - English
  {
    question: "What are the library hours?",
    answer: "The library is open Monday to Friday from 8:00 AM to 10:00 PM, and weekends from 9:00 AM to 6:00 PM. During exam periods, we extend hours until midnight.",
    category: "campus",
    language: "en",
    keywords: expandKeywords(["library", "hours", "timing", "open", "close", "schedule"])
  },
  {
    question: "What dining options are available on campus?",
    answer: "We have a main cafeteria, coffee shop, pizza corner, and healthy food court. Meal plans are available for residential students. Operating hours vary by location.",
    category: "campus",
    language: "en",
    keywords: expandKeywords(["dining", "food", "cafeteria", "meal", "restaurant", "eating"])
  },
  {
    question: "Are there hostel facilities available?",
    answer: "Yes, we provide separate hostel facilities for boys and girls with modern amenities including Wi-Fi, laundry, and 24/7 security. Applications are processed on a first-come, first-served basis.",
    category: "campus",
    language: "en",
    keywords: expandKeywords(["hostel", "accommodation", "residence", "rooms", "boarding", "dormitory"])
  },

  // Financial - English
  {
    question: "What scholarships are available?",
    answer: "We offer merit-based scholarships, need-based financial aid, and special scholarships for sports and cultural activities. Visit the financial aid office or our website for detailed information and application procedures.",
    category: "financial",
    language: "en",
    keywords: expandKeywords(["scholarship", "financial aid", "merit", "need-based", "funding", "grants"])
  },
  {
    question: "How much are the tuition fees?",
    answer: "Tuition fees vary by program. Undergraduate programs range from $15,000-$25,000 per year. Graduate programs range from $20,000-$35,000 per year. Additional fees may apply for labs and activities.",
    category: "financial",
    language: "en",
    keywords: expandKeywords(["tuition", "fees", "cost", "payment", "charges", "price"])
  },
  {
    question: "What payment methods are accepted?",
    answer: "We accept online payments via credit/debit cards, bank transfers, and demand drafts. Installment plans are available. Contact the accounts office for payment assistance.",
    category: "financial",
    language: "en",
    keywords: expandKeywords(["payment", "methods", "online", "installment", "bank transfer", "credit card"])
  },

  // Technical - English
  {
    question: "I forgot my password. How can I reset it?",
    answer: "You can reset your password using the 'Forgot Password' link on the login page. Enter your student ID or email, and follow the instructions sent to your registered email address.",
    category: "technical",
    language: "en",
    keywords: expandKeywords(["password", "reset", "forgot", "login", "account", "recover"])
  },
  {
    question: "How do I connect to the campus Wi-Fi?",
    answer: "Connect to the 'Campus-WiFi' network and use your student credentials to log in. For technical issues, contact IT support at ext. 1234 or visit the IT help desk in the main building.",
    category: "technical",
    language: "en",
    keywords: expandKeywords(["wifi", "internet", "connection", "network", "login", "wireless"])
  },
  {
    question: "Where can I get technical support?",
    answer: "Technical support is available at the IT Help Desk (Main Building, Ground Floor) from 9 AM to 5 PM on weekdays. For urgent issues, call ext. 1234 or email it-support@college.edu.",
    category: "technical",
    language: "en",
    keywords: expandKeywords(["technical support", "IT help", "computer", "system", "assistance", "help desk"])
  },
  {
    question: "How can I apply for hostel accommodation?",
    answer: "Hostel applications can be submitted online through the student portal. Ensure you select your preferred hostel type and submit before the deadline.",
    category: "campus",
    language: "en",
    keywords: expandKeywords(["hostel", "accommodation", "apply", "residence"])
  },
  {
    question: "What is the fee structure for the Computer Science program?",
    answer: "The Computer Science tuition fees for undergraduate programs are Rs. 1,50,000-2,05,000 per year. Additional charges may apply for labs and activities.",
    category: "financial",
    language: "en",
    keywords: expandKeywords(["tuition", "fees", "computer science", "payment", "cost"])
  },
  {
    question: "How do I reset my campus portal password?",
    answer: "Use the 'Forgot Password' link on the portal login page, enter your student ID, and follow the instructions sent to your registered email.",
    category: "technical",
    language: "en",
    keywords: expandKeywords(["password", "reset", "login", "credentials"])
  },
  {
    question: "What are the library borrowing rules?",
    answer: "Students can borrow up to 5 books for 2 weeks. Late returns will incur fines. Reference books cannot be borrowed.",
    category: "campus",
    language: "en",
    keywords: expandKeywords(["library", "borrowing", "books", "rules", "fines"])
  },
  {
    question: "Which scholarships are available for meritorious students?",
    answer: "Merit-based scholarships are awarded to students with high academic performance. Visit the financial aid office or website for details.",
    category: "financial",
    language: "en",
    keywords: expandKeywords(["scholarship", "merit", "financial aid", "funding"])
  },
  {
    question: "How can I register for elective courses?",
    answer: "Elective course registration opens each semester. Log into the student portal, choose your electives, and submit before the deadline.",
    category: "academic",
    language: "en",
    keywords: expandKeywords(["registration", "elective", "courses", "semester"])
  },
  {
    question: "How do I connect my device to campus Wi-Fi?",
    answer: "Select the 'Campus-WiFi' network and enter your student credentials. Contact IT support if connection issues occur.",
    category: "technical",
    language: "en",
    keywords: expandKeywords(["wifi", "internet", "network", "connection"])
  },
  {
    question: "What dining options are available for students?",
    answer: "Students can access the main cafeteria, coffee shop, and healthy food court. Meal plans are available for residential students.",
    category: "campus",
    language: "en",
    keywords: expandKeywords(["dining", "food", "cafeteria", "meal plan"])
  },
  {
    question: "How do I check my scholarship application status?",
    answer: "You can check the status of your scholarship application by logging into the financial aid portal and reviewing your submission history.",
    category: "financial",
    language: "en",
    keywords: expandKeywords(["scholarship", "status", "application", "financial aid"])
  },
  {
    question: "Where can I find the academic calendar?",
    answer: "The academic calendar, including semester dates and holidays, is available on the college website and student portal.",
    category: "academic",
    language: "en",
    keywords: expandKeywords(["academic calendar", "semester", "dates", "holidays"])
  },
  {
    question: "How do I submit my course feedback?",
    answer: "Course feedback can be submitted online at the end of each semester via the student portal.",
    category: "academic",
    language: "en",
    keywords: expandKeywords(["course feedback", "submit", "evaluation", "portal"])
  },
  {
    question: "Are there any IT workshops available for students?",
    answer: "The IT department conducts workshops on coding, cybersecurity, and software tools. Check the portal for schedule and registration.",
    category: "technical",
    language: "en",
    keywords: expandKeywords(["IT workshop", "coding", "cybersecurity", "software"])
  },
  {
    question: "How do I update my student profile?",
    answer: "You can update personal details, contact info, and academic information through the student portal under 'Profile Settings'.",
    category: "academic",
    language: "en",
    keywords: expandKeywords(["profile", "update", "student portal", "details"])
  },
  {
    question: "What transport facilities are available on campus?",
    answer: "The college provides shuttle buses and parking spaces. Timings and routes are posted on the student portal.",
    category: "campus",
    language: "en",
    keywords: expandKeywords(["transport", "shuttle", "bus", "parking"])
  },
  {
    question: "How do I submit lab reports?",
    answer: "Lab reports should be submitted via the LMS before the deadline. Late submissions may incur penalties.",
    category: "academic",
    language: "en",
    keywords: expandKeywords(["lab reports", "submit", "LMS", "deadline"])
  },
  {
    question: "Can I apply for multiple scholarships?",
    answer: "Yes, students can apply for multiple scholarships if eligibility criteria are met. Check each scholarship's guidelines.",
    category: "financial",
    language: "en",
    keywords: expandKeywords(["scholarship", "apply", "eligibility", "financial aid"])
  },
  {
    question: "How do I access online learning materials?",
    answer: "All learning materials are available on the LMS. Login with your student credentials to access lecture notes, videos, and assignments.",
    category: "academic",
    language: "en",
    keywords: expandKeywords(["LMS", "learning materials", "online", "access"])
  },
  {
    question: "Are there counseling services for students?",
    answer: "The college offers counseling for mental health, academic, and career guidance. Appointments can be booked via the student portal.",
    category: "campus",
    language: "en",
    keywords: expandKeywords(["counseling", "mental health", "guidance", "appointment"])
  },
  {
    question: "How can I recover a forgotten password?",
    answer: "Click on 'Forgot Password' at login, provide your student ID or email, and follow the instructions sent to your registered email.",
    category: "technical",
    language: "en",
    keywords: expandKeywords(["password", "forgot", "recover", "login"])
  }
]
// -----------------------------
// Additional 20 FAQs
// -----------------------------
const additionalFAQs = [
  // Admissions
  {
    question: "Can I apply for multiple programs at the same time?",
    answer: "Yes, students can apply for multiple programs, but each application must be submitted separately with required documents and fees.",
    category: "admissions",
    language: "en",
    keywords: expandKeywords(["apply", "multiple programs", "application", "documents", "fees"])
  },
  {
    question: "Is there an age limit for admission?",
    answer: "There is no strict age limit for most programs. Some professional courses may have specific age requirements.",
    category: "admissions",
    language: "en",
    keywords: expandKeywords(["age limit", "eligibility", "admission", "requirements"])
  },

  // Academic
  {
    question: "How do I request an official transcript?",
    answer: "Transcripts can be requested via the student portal or by contacting the registrar's office. Processing may take 5-7 business days.",
    category: "academic",
    language: "en",
    keywords: expandKeywords(["transcript", "request", "registrar", "student portal", "academic records"])
  },
  {
    question: "Are online courses available for all programs?",
    answer: "Many programs offer online courses. Check the course catalog for details about virtual learning options.",
    category: "academic",
    language: "en",
    keywords: expandKeywords(["online courses", "virtual", "e-learning", "distance education"])
  },
  {
    question: "How can I drop or withdraw from a course?",
    answer: "Course drop or withdrawal requests must be submitted through the student portal before the deadline. Contact the academic office for assistance.",
    category: "academic",
    language: "en",
    keywords: expandKeywords(["drop course", "withdraw", "student portal", "academic office"])
  },

  // Campus
  {
    question: "Are parking facilities available on campus?",
    answer: "Yes, parking is available for students, faculty, and visitors. Permits may be required in some areas.",
    category: "campus",
    language: "en",
    keywords: expandKeywords(["parking", "campus", "permit", "vehicle", "facilities"])
  },
  {
    question: "What are the gym hours on campus?",
    answer: "The campus gym is open Monday to Saturday from 6 AM to 10 PM. Membership may be required for some facilities.",
    category: "campus",
    language: "en",
    keywords: expandKeywords(["gym", "hours", "fitness", "membership", "campus"])
  },
  {
    question: "Is there a campus shuttle service?",
    answer: "Yes, a free shuttle operates between main campus buildings and nearby residence halls on weekdays.",
    category: "campus",
    language: "en",
    keywords: expandKeywords(["shuttle", "campus transport", "residence hall", "service"])
  },

  // Financial
  {
    question: "Can I pay fees in installments?",
    answer: "Installment plans are available for tuition and other fees. Contact the accounts office for details and deadlines.",
    category: "financial",
    language: "en",
    keywords: expandKeywords(["installments", "fees", "payment", "tuition", "accounts office"])
  },
  {
    question: "Are early payment discounts available?",
    answer: "Some programs offer early payment discounts. Check the fee schedule or consult the accounts office for eligibility.",
    category: "financial",
    language: "en",
    keywords: expandKeywords(["discount", "early payment", "fees", "tuition"])
  },
  {
    question: "How do I apply for financial aid or scholarships?",
    answer: "Financial aid applications can be submitted online via the student portal. Required documents include income proof and academic records.",
    category: "financial",
    language: "en",
    keywords: expandKeywords(["financial aid", "apply", "student portal", "documents", "scholarship"])
  },

  // Technical
  {
    question: "How do I set up my student email account?",
    answer: "Student email accounts are automatically created. Activation instructions are sent to your registered personal email.",
    category: "technical",
    language: "en",
    keywords: expandKeywords(["email", "setup", "student account", "activation"])
  },
  {
    question: "What should I do if I encounter a system error on the portal?",
    answer: "Report the error to IT support with screenshots and description. Support will guide troubleshooting or escalate the issue.",
    category: "technical",
    language: "en",
    keywords: expandKeywords(["system error", "portal", "IT support", "troubleshooting"])
  },
  {
    question: "How do I install required software for my courses?",
    answer: "Installation guides are available on the course page or LMS. Contact IT support for license keys or assistance.",
    category: "technical",
    language: "en",
    keywords: expandKeywords(["software", "installation", "LMS", "IT support", "course"])
  },
  {
    question: "Is campus Wi-Fi available for guest users?",
    answer: "Yes, guest Wi-Fi is available in select areas. Temporary credentials can be obtained from IT support or the front desk.",
    category: "technical",
    language: "en",
    keywords: expandKeywords(["guest Wi-Fi", "network", "IT support", "access", "credentials"])
  },

  // Miscellaneous / Campus
  {
    question: "Are there student clubs and organizations?",
    answer: "Yes, students can join clubs for academics, sports, arts, and social causes. Visit the student affairs office for details.",
    category: "campus",
    language: "en",
    keywords: expandKeywords(["clubs", "organizations", "student life", "activities", "social"])
  },
  {
    question: "Can students volunteer for campus events?",
    answer: "Yes, students can register to volunteer via the student affairs office or event organizers.",
    category: "campus",
    language: "en",
    keywords: expandKeywords(["volunteer", "events", "student", "register"])
  },
  {
    question: "What is the procedure for grievance redressal?",
    answer: "Grievances can be submitted online or at the student affairs office. The committee reviews and responds within 10 working days.",
    category: "campus",
    language: "en",
    keywords: expandKeywords(["grievance", "complaint", "procedure", "student affairs"])
  },
  {
    question: "Are career counseling services available?",
    answer: "Career counseling and placement services are available via the career center. Appointments can be booked online.",
    category: "academic",
    language: "en",
    keywords: expandKeywords(["career counseling", "placement", "career center", "appointments"])
  },
  {
    question: "How can I access online library resources off-campus?",
    answer: "Access online library resources via the library portal using student credentials. VPN may be required off-campus.",
    category: "campus",
    language: "en",
    keywords: expandKeywords(["library", "online resources", "portal", "VPN", "access"])
  },
  {
    question: "Do I need to take an entrance exam for international programs?",
    answer: "Yes, international programs may require standardized entrance exams like GRE, GMAT, or program-specific tests.",
    category: "admissions",
    language: "en",
    keywords: expandKeywords(["entrance exam", "international", "GRE", "GMAT", "program tests"])
  },
  {
    question: "Can I defer my admission to the next semester?",
    answer: "Admission deferral is possible for valid reasons. Submit a written request to the admissions office before the semester begins.",
    category: "admissions",
    language: "en",
    keywords: expandKeywords(["defer", "admission", "semester", "request", "admissions office"])
  },

  // Academic
  {
    question: "How can I request a course syllabus?",
    answer: "Syllabi are available on the course page of the LMS. Contact the instructor if a copy is not listed.",
    category: "academic",
    language: "en",
    keywords: expandKeywords(["syllabus", "course", "LMS", "instructor", "request"])
  },
  {
    question: "Are there opportunities for research projects?",
    answer: "Yes, students can participate in faculty-led or independent research projects. Applications are usually posted on the academic portal.",
    category: "academic",
    language: "en",
    keywords: expandKeywords(["research", "projects", "faculty", "academic portal", "application"])
  },
  {
    question: "How do I change my major or specialization?",
    answer: "Major or specialization changes must be requested via the academic office and approved by the program coordinator.",
    category: "academic",
    language: "en",
    keywords: expandKeywords(["major", "specialization", "change", "academic office", "program coordinator"])
  },

  // Campus
  {
    question: "Is there a student health center on campus?",
    answer: "Yes, the student health center provides medical services, counseling, and emergency care for students.",
    category: "campus",
    language: "en",
    keywords: expandKeywords(["health center", "medical", "emergency", "counseling", "services"])
  },
  {
    question: "Are bicycles allowed on campus?",
    answer: "Yes, bicycles are allowed and bike racks are available. Registration may be required for security purposes.",
    category: "campus",
    language: "en",
    keywords: expandKeywords(["bicycle", "campus", "registration", "bike rack", "security"])
  },
  {
    question: "Can I book meeting rooms for student clubs?",
    answer: "Meeting rooms can be booked through the student affairs portal. Availability depends on the schedule and room capacity.",
    category: "campus",
    language: "en",
    keywords: expandKeywords(["meeting room", "book", "student clubs", "portal", "availability"])
  },

  // Financial
  {
    question: "Are student loans available for tuition fees?",
    answer: "Yes, banks and financial institutions offer student loans. Contact the accounts or financial aid office for guidance.",
    category: "financial",
    language: "en",
    keywords: expandKeywords(["student loans", "tuition", "financial aid", "accounts office", "banks"])
  },
  {
    question: "Can I get a refund if I drop a course?",
    answer: "Refunds depend on the drop date and program policies. Check the fee refund schedule on the student portal.",
    category: "financial",
    language: "en",
    keywords: expandKeywords(["refund", "drop course", "policy", "fee schedule", "student portal"])
  },
  {
    question: "Is there a late fee for delayed tuition payment?",
    answer: "Yes, late payment of tuition may incur additional charges. Refer to the fee schedule for applicable fines.",
    category: "financial",
    language: "en",
    keywords: expandKeywords(["late fee", "tuition", "payment", "fines", "charges"])
  },

  // Technical
  {
    question: "How do I reset my email password if locked out?",
    answer: "Use the 'Forgot Password' option on the email login page or contact IT support for assistance.",
    category: "technical",
    language: "en",
    keywords: expandKeywords(["email", "password", "reset", "IT support", "locked out"])
  },
  {
    question: "What are the supported browsers for the LMS portal?",
    answer: "The LMS portal supports Chrome, Firefox, Edge, and Safari. Ensure your browser is updated for best performance.",
    category: "technical",
    language: "en",
    keywords: expandKeywords(["LMS", "portal", "browser", "Chrome", "Firefox", "Edge", "Safari"])
  },
  {
    question: "How do I report a network outage?",
    answer: "Report any network outages immediately to IT support with details of the issue and affected devices.",
    category: "technical",
    language: "en",
    keywords: expandKeywords(["network", "outage", "report", "IT support", "devices"])
  },
  {
    question: "Can I install software on campus computers?",
    answer: "Installation on campus computers is restricted. Students may request approved software via IT support.",
    category: "technical",
    language: "en",
    keywords: expandKeywords(["software", "installation", "campus computers", "IT support"])
  },

  // Miscellaneous / Campus
  {
    question: "Are there quiet study areas available on campus?",
    answer: "Yes, quiet study zones are available in the library and designated study halls.",
    category: "campus",
    language: "en",
    keywords: expandKeywords(["quiet study", "library", "study hall", "zones", "campus"])
  },
  {
    question: "Can I participate in student exchange programs?",
    answer: "Yes, students can apply for exchange programs via the international office. Requirements and deadlines are posted on the portal.",
    category: "academic",
    language: "en",
    keywords: expandKeywords(["student exchange", "international office", "apply", "programs", "deadline"])
  },
  {
    question: "Are counseling services confidential?",
    answer: "Yes, all counseling sessions are confidential unless there is a risk of harm to the student or others.",
    category: "campus",
    language: "en",
    keywords: expandKeywords(["counseling", "confidential", "student services", "mental health"])
  },
  {
    question: "How do I subscribe to campus notifications?",
    answer: "Campus notifications can be subscribed through the student portal or mobile app settings.",
    category: "campus",
    language: "en",
    keywords: expandKeywords(["notifications", "subscribe", "student portal", "mobile app"])
  },
  {
    question: "Can I access campus resources remotely?",
    answer: "Yes, students can access many resources like LMS, library, and software via VPN or portal login.",
    category: "technical",
    language: "en",
    keywords: expandKeywords(["remote access", "resources", "VPN", "portal", "LMS", "library"])
  },
  {
  question: "How do I apply for a summer internship?",
  answer: "Summer internship applications can be submitted via the career portal. Ensure your resume and cover letter are uploaded before the deadline.",
  category: "academic",
  language: "en",
  keywords: expandKeywords(["summer internship", "application", "career portal", "resume", "cover letter"])
  },
  {
  question: "Are there any sports facilities on campus?",
  answer: "Yes, students have access to a gym, basketball courts, football fields, and indoor sports halls.",
  category: "campus",
  language: "en",
  keywords: expandKeywords(["sports", "gym", "basketball", "football", "indoor sports"])
  },
  {
  question: "Can I request extra tutoring sessions?",
  answer: "Extra tutoring sessions may be arranged with faculty approval. Contact the academic office for scheduling.",
  category: "academic",
  language: "en",
  keywords: expandKeywords(["tutoring", "extra classes", "faculty", "academic office", "schedule"])
  },
  {
  question: "How do I submit an academic grievance?",
  answer: "Submit academic grievances in writing to the registrar's office. Supporting documents must be attached.",
  category: "academic",
  language: "en",
  keywords: expandKeywords(["academic grievance", "submit", "registrar", "documents", "appeal"])
},
{
  question: "Is there an orientation program for new students?",
  answer: "Yes, all new students must attend the orientation program, which covers campus facilities, rules, and student resources.",
  category: "campus",
  language: "en",
  keywords: expandKeywords(["orientation", "new students", "campus facilities", "rules", "resources"])
  },
  {
  question: "How do I access the online library resources?",
  answer: "Login to the library portal using your student credentials to access e-books, journals, and databases.",
  category: "campus",
  language: "en",
  keywords: expandKeywords(["library", "online", "portal", "e-books", "journals", "databases"])
  },
  {
  question: "Can I apply for financial aid after the semester starts?",
  answer: "Financial aid applications are usually accepted before the semester begins. Late applications may be considered in exceptional cases.",
  category: "financial",
  language: "en",
  keywords: expandKeywords(["financial aid", "application", "semester", "late", "exceptional cases"])
  },
  {
  question: "Are there any language learning programs?",
  answer: "Yes, language learning workshops for Spanish, French, and Mandarin are offered each semester.",
  category: "academic",
  language: "en",
  keywords: expandKeywords(["language", "learning", "workshops", "Spanish", "French", "Mandarin"])
  },
  {
  question: "How do I report lost student ID card?",
  answer: "Report lost ID cards to the campus security office immediately. A replacement card can be issued for a nominal fee.",
  category: "campus",
  language: "en",
  keywords: expandKeywords(["lost ID", "report", "security", "replacement", "fee"])
  },
  {
  question: "What career counseling services are available?",
  answer: "Career counseling includes resume reviews, interview preparation, and job search guidance provided by the career office.",
  category: "academic",
  language: "en",
  keywords: expandKeywords(["career counseling", "resume", "interview", "guidance", "career office"])
  },
  {
  question: "Can I reserve library study rooms?",
  answer: "Yes, library study rooms can be reserved online via the library portal. Reservations are subject to availability.",
  category: "campus",
  language: "en",
  keywords: expandKeywords(["library", "study room", "reserve", "online", "portal"])
  },
  {
  question: "Is there a dress code for campus events?",
  answer: "Campus events may have specific dress codes, which are communicated via event announcements or student portal notifications.",
  category: "campus",
  language: "en",
  keywords: expandKeywords(["dress code", "events", "campus", "announcements", "portal"])
  },
  {
  question: "How do I request transcripts for previous semesters?",
  answer: "Transcript requests must be submitted to the registrar’s office online or in person, with a processing fee applied.",
  category: "academic",
  language: "en",
  keywords: expandKeywords(["transcripts", "request", "registrar", "previous semesters", "fee"])
  },
  {
  question: "Are there mental health awareness programs?",
  answer: "Yes, workshops and counseling sessions are organized regularly to support student mental health.",
  category: "campus",
  language: "en",
  keywords: expandKeywords(["mental health", "workshops", "counseling", "awareness", "student support"])
  },
  {
  question: "How do I connect my laptop to the campus VPN?",
  answer: "Download the VPN client from the IT portal and login with your student credentials. Contact IT support if issues arise.",
  category: "technical",
  language: "en",
  keywords: expandKeywords(["VPN", "connect", "laptop", "IT portal", "credentials", "IT support"])
  },
  {
  question: "Can I volunteer for campus events?",
  answer: "Yes, student volunteers can register through the student affairs portal and assist in organizing events.",
  category: "campus",
  language: "en",
  keywords: expandKeywords(["volunteer", "campus events", "student affairs", "register", "organize"])
  },
  {
  question: "What is the process to appeal a grade?",
  answer: "Grade appeals must be submitted in writing to the academic office within two weeks of receiving the grade, along with supporting evidence.",
  category: "academic",
  language: "en",
  keywords: expandKeywords(["grade appeal", "process", "academic office", "submit", "supporting evidence"])
  },
  {
  question: "Are there printing facilities on campus?",
  answer: "Yes, printing stations are available in libraries and computer labs. Payment is via prepaid campus cards.",
  category: "campus",
  language: "en",
  keywords: expandKeywords(["printing", "facilities", "library", "computer labs", "campus card"])
  },
  {
  question: "How do I submit a request for academic accommodations?",
  answer: "Students needing accommodations must submit a request with documentation to the disability services office.",
  category: "academic",
  language: "en",
  keywords: expandKeywords(["academic accommodations", "request", "disability services", "documentation"])
  },
  {
  question: "Are there any student mentorship programs?",
  answer: "Yes, mentorship programs pair new students with senior students to provide guidance and support throughout the semester.",
  category: "academic",
  language: "en",
  keywords: expandKeywords(["mentorship", "students", "guidance", "support", "program"])
  },
  {
  question: "How do I apply for international exchange programs?",
  answer: "Students can apply via the International Office portal, providing academic transcripts and a statement of purpose.",
  category: "academic",
  language: "en",
  keywords: expandKeywords(["exchange program", "international", "application", "transcripts", "statement of purpose"])
},
{
  question: "What health services are available on campus?",
  answer: "Campus health center provides general consultations, vaccinations, and emergency care for students and staff.",
  category: "campus",
  language: "en",
  keywords: expandKeywords(["health services", "campus clinic", "vaccinations", "emergency care"])
},
{
  question: "How can I change my course enrollment?",
  answer: "Course enrollment changes can be made via the student portal within the add/drop period each semester.",
  category: "academic",
  language: "en",
  keywords: expandKeywords(["course enrollment", "change", "add/drop period", "portal"])
},
{
  question: "Are there cultural clubs I can join?",
  answer: "Yes, students can join cultural clubs such as music, drama, dance, and debate by registering on the student affairs portal.",
  category: "campus",
  language: "en",
  keywords: expandKeywords(["cultural clubs", "music", "drama", "dance", "debate"])
},
{
  question: "What is the procedure for applying for leave of absence?",
  answer: "Submit a leave of absence request through the student portal, including reasons and supporting documentation.",
  category: "academic",
  language: "en",
  keywords: expandKeywords(["leave of absence", "request", "portal", "documentation"])
},
{
  question: "How do I report campus maintenance issues?",
  answer: "Report maintenance issues through the facilities management portal or contact campus services directly.",
  category: "campus",
  language: "en",
  keywords: expandKeywords(["maintenance", "report", "facilities", "campus services"])
},
{
  question: "Are there workshops for entrepreneurship?",
  answer: "Yes, the entrepreneurship cell conducts workshops on startups, business planning, and pitching ideas every semester.",
  category: "academic",
  language: "en",
  keywords: expandKeywords(["entrepreneurship", "workshops", "startups", "business planning", "pitching"])
},
{
  question: "Can I get academic transcripts electronically?",
  answer: "Yes, official transcripts can be downloaded electronically via the registrar's portal after verification.",
  category: "academic",
  language: "en",
  keywords: expandKeywords(["transcripts", "electronic", "registrar", "download"])
},
{
  question: "How do I apply for on-campus jobs?",
  answer: "Students can apply for on-campus jobs through the career portal. Job listings are updated every semester.",
  category: "financial",
  language: "en",
  keywords: expandKeywords(["on-campus jobs", "application", "career portal", "job listings"])
},
{
  question: "Are there language labs available?",
  answer: "Yes, language labs equipped with software for practice and assessment are available in the library and language center.",
  category: "campus",
  language: "en",
  keywords: expandKeywords(["language labs", "practice", "assessment", "library", "language center"])
},
{
  question: "What is the process for course credit transfer?",
  answer: "Submit a credit transfer request to the academic office along with the previous institution’s transcripts and course descriptions.",
  category: "academic",
  language: "en",
  keywords: expandKeywords(["credit transfer", "request", "academic office", "transcripts", "course description"])
},
{
  question: "Are there student insurance programs?",
  answer: "Yes, the college offers health and accident insurance for enrolled students. Details are available on the student portal.",
  category: "financial",
  language: "en",
  keywords: expandKeywords(["insurance", "student", "health", "accident", "portal"])
},
{
  question: "How can I get my lab equipment repaired?",
  answer: "Report lab equipment issues to the lab technician or submit a request through the laboratory management portal.",
  category: "technical",
  language: "en",
  keywords: expandKeywords(["lab equipment", "repair", "technician", "portal", "maintenance"])
},
{
  question: "What transportation passes are available for students?",
  answer: "Students can purchase shuttle and public transport passes via the student portal for discounted rates.",
  category: "campus",
  language: "en",
  keywords: expandKeywords(["transport", "shuttle", "public transport", "pass", "student portal"])
},
{
  question: "Are there student housing options off-campus?",
  answer: "Yes, the student affairs office maintains a list of verified off-campus housing options for students.",
  category: "campus",
  language: "en",
  keywords: expandKeywords(["housing", "off-campus", "student affairs", "verified", "options"])
},
{
  question: "How do I access virtual labs for practice?",
  answer: "Virtual labs can be accessed via the LMS with your student credentials. Ensure you have a stable internet connection.",
  category: "technical",
  language: "en",
  keywords: expandKeywords(["virtual labs", "LMS", "practice", "student credentials", "internet"])
},
{
  question: "Are there financial aid workshops?",
  answer: "Yes, workshops explaining scholarships, grants, and aid applications are conducted at the start of each semester.",
  category: "financial",
  language: "en",
  keywords: expandKeywords(["financial aid", "workshops", "scholarship", "grants", "applications"])
},
{
  question: "What are the library quiet zone rules?",
  answer: "Quiet zones in the library require silence and restricted phone use. Study sessions and group discussions should use designated areas.",
  category: "campus",
  language: "en",
  keywords: expandKeywords(["library", "quiet zone", "rules", "silence", "study areas"])
},
{
  question: "How do I appeal for late submission of assignments?",
  answer: "Submit a written appeal to the academic office explaining the reason for delay, along with supporting documentation.",
  category: "academic",
  language: "en",
  keywords: expandKeywords(["late submission", "assignment", "appeal", "academic office", "documentation"])
},
{
  question: "Can I join multiple student clubs?",
  answer: "Yes, students can join multiple clubs provided they meet eligibility criteria and register via the student portal.",
  category: "campus",
  language: "en",
  keywords: expandKeywords(["student clubs", "join", "eligibility", "portal"])
},
{
  question: "How do I update emergency contact information?",
  answer: "Update your emergency contacts via the student profile section on the portal or contact the registrar for assistance.",
  category: "campus",
  language: "en",
  keywords: expandKeywords(["emergency contact", "update", "portal", "registrar", "student profile"])
},
{
  question: "Are there art and music classes available?",
  answer: "Yes, elective art and music classes are offered each semester. Registration is done through the student portal.",
  category: "academic",
  language: "en",
  keywords: expandKeywords(["art classes", "music classes", "elective", "registration", "portal"])
},
{
  question: "How can I request a printed copy of my grade report?",
  answer: "Submit a request to the registrar's office with the relevant semester details and pay the nominal processing fee.",
  category: "academic",
  language: "en",
  keywords: expandKeywords(["grade report", "printed copy", "request", "registrar", "semester", "fee"])
},
{
  question: "Are there recycling and sustainability programs on campus?",
  answer: "Yes, sustainability initiatives including recycling, awareness drives, and eco-clubs are active on campus.",
  category: "campus",
  language: "en",
  keywords: expandKeywords(["recycling", "sustainability", "eco-club", "awareness", "campus"])
},
{
  question: "How do I register for online seminars and webinars?",
  answer: "Seminar and webinar registrations are done via the event portal. Ensure you confirm your attendance in advance.",
  category: "academic",
  language: "en",
  keywords: expandKeywords(["seminar", "webinar", "register", "event portal", "attendance"])
},
{
  question: "Can I extend library book return deadlines?",
  answer: "Yes, book return deadlines can be extended online through the library portal unless the book is reserved by another student.",
  category: "campus",
  language: "en",
  keywords: expandKeywords(["library", "book return", "extend", "deadline", "portal"])
},
{
  question: "What IT support services are available for software installation?",
  answer: "IT support can help with installation of approved software on campus computers or personal devices via remote assistance.",
  category: "technical",
  language: "en",
  keywords: expandKeywords(["IT support", "software installation", "campus computer", "personal devices", "remote assistance"])
},
{
  question: "How do I submit internship evaluation forms?",
  answer: "Submit completed internship evaluation forms to the career services office online or in person within the deadline.",
  category: "academic",
  language: "en",
  keywords: expandKeywords(["internship", "evaluation", "submit", "career services", "deadline"])
},
{
  question: "Are there gender-neutral facilities on campus?",
  answer: "Yes, the campus provides gender-neutral washrooms and changing rooms across all major buildings.",
  category: "campus",
  language: "en",
  keywords: expandKeywords(["gender-neutral", "washroom", "changing room", "campus"])
},
{
  question: "Can I participate in hackathons organized by the college?",
  answer: "Yes, students can register for hackathons via the event portal. Teams can be formed across departments.",
  category: "academic",
  language: "en",
  keywords: expandKeywords(["hackathon", "participate", "register", "event portal", "team"])
},
{
  question: "How do I apply for summer research projects?",
  answer: "Submit your proposal to the academic office or relevant department. Approval is required before commencing the project.",
  category: "academic",
  language: "en",
  keywords: expandKeywords(["summer research", "application", "proposal", "department", "approval"])
},
{
  question: "Are there facilities for differently-abled students?",
  answer: "Yes, ramps, elevators, and assistive technology are available. Disability services provide additional support as needed.",
  category: "campus",
  language: "en",
  keywords: expandKeywords(["differently-abled", "facilities", "ramps", "elevators", "assistive technology"])
},
{
  question: "How do I access previous semester question papers?",
  answer: "Previous semester question papers can be accessed through the LMS under the resources section using your student credentials.",
  category: "academic",
  language: "en",
  keywords: expandKeywords(["question papers", "previous semester", "LMS", "resources", "student credentials"])
},
{
  question: "Can I attend lectures from other departments?",
  answer: "Yes, cross-departmental lectures are allowed with prior permission from both the home and host department.",
  category: "academic",
  language: "en",
  keywords: expandKeywords(["lectures", "cross-department", "attendance", "permission", "departments"])
},
{
  question: "How do I update my bank details for stipend payments?",
  answer: "Update your bank details via the student finance portal to ensure correct stipend and fee refund processing.",
  category: "financial",
  language: "en",
  keywords: expandKeywords(["bank details", "update", "stipend", "finance portal", "payments"])
},
{
  question: "Are there alumni networking events?",
  answer: "Yes, alumni events and networking sessions are organized regularly. Students can register through the alumni portal.",
  category: "campus",
  language: "en",
  keywords: expandKeywords(["alumni", "networking", "events", "register", "portal"])
},
{
  question: "How do I report harassment or misconduct?",
  answer: "Report any harassment or misconduct to the student grievance cell or through the online complaint portal anonymously if needed.",
  category: "campus",
  language: "en",
  keywords: expandKeywords(["harassment", "misconduct", "report", "grievance cell", "complaint portal"])
},
{
  question: "Can I access recorded lectures if I miss classes?",
  answer: "Yes, recorded lectures are available on the LMS. Students must log in to access lecture recordings for each course.",
  category: "academic",
  language: "en",
  keywords: expandKeywords(["recorded lectures", "missed classes", "LMS", "access", "courses"])
},
{
  question: "Are there peer mentoring programs for first-year students?",
  answer: "Yes, first-year students are paired with senior mentors to help with academics, social adjustment, and campus orientation.",
  category: "academic",
  language: "en",
  keywords: expandKeywords(["peer mentoring", "first-year", "senior mentor", "academics", "orientation"])
},
{
  question: "How do I reserve a bicycle from the campus bike-sharing program?",
  answer: "Log into the campus mobility portal, choose a bike, and reserve it for your preferred time slot.",
  category: "campus",
  language: "en",
  keywords: expandKeywords(["bicycle", "bike", "reservation", "mobility"])
},
{
  question: "What is the process to request additional library books?",
  answer: "Submit a book request form on the library portal. The library will notify you once the books are available.",
  category: "campus",
  language: "en",
  keywords: expandKeywords(["library", "books", "request", "portal"])
},
{
  question: "How can I access the campus shuttle live tracking?",
  answer: "Download the campus shuttle app and login with your student credentials to view real-time shuttle locations.",
  category: "campus",
  language: "en",
  keywords: expandKeywords(["shuttle", "bus", "tracking", "app"])
},
{
  question: "Are there any language learning programs available?",
  answer: "Yes, the language center offers courses in Spanish, French, and Mandarin. Registration is via the student portal.",
  category: "academic",
  language: "en",
  keywords: expandKeywords(["language", "learning", "courses", "registration"])
},
{
  question: "How do I check my campus dining meal plan balance?",
  answer: "Login to the dining portal or app to see your remaining meal credits and transaction history.",
  category: "campus",
  language: "en",
  keywords: expandKeywords(["dining", "meal plan", "balance", "portal"])
},
{
  question: "What steps are required to apply for research assistant positions?",
  answer: "Check department postings on the student portal and submit your CV and application form online.",
  category: "academic",
  language: "en",
  keywords: expandKeywords(["research", "assistant", "application", "position"])
},
{
  question: "How can I report technical issues with the LMS?",
  answer: "Use the 'Report Issue' button on the LMS dashboard or contact IT support via the helpdesk email.",
  category: "technical",
  language: "en",
  keywords: expandKeywords(["LMS", "technical", "issue", "support"])
},
{
  question: "Are students allowed to use the campus gym?",
  answer: "Yes, students can access the gym with their ID card. Membership registration is available on the portal.",
  category: "campus",
  language: "en",
  keywords: expandKeywords(["gym", "fitness", "access", "membership"])
},
{
  question: "How do I submit feedback about cafeteria services?",
  answer: "Submit feedback online via the dining portal or through feedback forms available in cafeterias.",
  category: "campus",
  language: "en",
  keywords: expandKeywords(["feedback", "cafeteria", "dining", "services"])
},
{
  question: "What is the procedure to book a projector for classroom use?",
  answer: "Submit a request via the campus resources portal, including date, time, and room number.",
  category: "campus",
  language: "en",
  keywords: expandKeywords(["projector", "booking", "classroom", "resources"])
},
{
  question: "How can I join the student newsletter mailing list?",
  answer: "Sign up via the communications portal with your student email address to receive newsletters.",
  category: "campus",
  language: "en",
  keywords: expandKeywords(["newsletter", "mailing list", "subscribe", "communications"])
},
{
  question: "Are there any tutoring services available for students?",
  answer: "Yes, tutoring services are offered for various subjects. Schedule sessions through the academic support portal.",
  category: "academic",
  language: "en",
  keywords: expandKeywords(["tutoring", "support", "academic", "sessions"])
},
{
  question: "How do I apply for on-campus research grants?",
  answer: "Submit a grant application through your department’s research portal before the deadline.",
  category: "academic",
  language: "en",
  keywords: expandKeywords(["research grant", "application", "department", "funding"])
},
{
  question: "What are the policies for bringing guests on campus?",
  answer: "Visitors must register at the security office and carry a guest pass at all times.",
  category: "campus",
  language: "en",
  keywords: expandKeywords(["guest", "visitor", "registration", "security"])
},
{
  question: "How can I participate in student government elections?",
  answer: "Check eligibility and submit your candidacy form on the student government portal.",
  category: "campus",
  language: "en",
  keywords: expandKeywords(["student government", "elections", "participation", "candidacy"])
},
{
  question: "What is the process for reserving sports facilities?",
  answer: "Book facilities such as courts or fields through the sports services portal with your student ID.",
  category: "campus",
  language: "en",
  keywords: expandKeywords(["sports", "facilities", "booking", "courts"])
},
{
  question: "How do I access digital copies of textbooks?",
  answer: "Use the library’s eBook portal or LMS to access available digital textbooks.",
  category: "academic",
  language: "en",
  keywords: expandKeywords(["textbooks", "digital", "ebooks", "library"])
},
{
  question: "Are there any mental health workshops on campus?",
  answer: "Yes, workshops are conducted monthly. Register through the counseling services portal.",
  category: "campus",
  language: "en",
  keywords: expandKeywords(["mental health", "workshops", "counseling", "registration"])
},
{
  question: "How can I request academic transcripts for internships?",
  answer: "Submit a transcript request via the student portal specifying the purpose as internship.",
  category: "academic",
  language: "en",
  keywords: expandKeywords(["transcripts", "internship", "request", "academic"])
},
{
  question: "How do I apply for a parking permit?",
  answer: "Submit your vehicle details and student ID on the campus parking portal to receive a permit.",
  category: "campus",
  language: "en",
  keywords: expandKeywords(["parking", "permit", "vehicle", "registration"])
},
{
  question: "What are the emergency evacuation procedures?",
  answer: "Evacuation maps and instructions are posted in all buildings. Follow alarms and exit signs during emergencies.",
  category: "campus",
  language: "en",
  keywords: expandKeywords(["emergency", "evacuation", "procedures", "safety"])
},
{
  question: "How can I report maintenance issues in hostels?",
  answer: "Submit a maintenance request via the hostel management portal or contact the hostel warden.",
  category: "campus",
  language: "en",
  keywords: expandKeywords(["maintenance", "hostel", "issues", "report"])
},
{
  question: "Are there any volunteer opportunities on campus?",
  answer: "Yes, volunteer programs are posted on the student activities portal. Sign up online.",
  category: "campus",
  language: "en",
  keywords: expandKeywords(["volunteer", "opportunity", "activities", "signup"])
},
{
  question: "How do I access campus Wi-Fi during events?",
  answer: "Event-specific Wi-Fi credentials are distributed via email or the event portal for participants.",
  category: "technical",
  language: "en",
  keywords: expandKeywords(["wifi", "events", "access", "credentials"])
},
{
  question: "Can I borrow laptops from the IT services department?",
  answer: "Yes, laptops can be borrowed by submitting a request on the IT services portal with your student ID.",
  category: "technical",
  language: "en",
  keywords: expandKeywords(["laptops", "borrow", "IT services", "request"])
},
{
  question: "How do I apply for summer internships?",
  answer: "Check the internship listings on the career services portal and submit your application online.",
  category: "academic",
  language: "en",
  keywords: expandKeywords(["internship", "summer", "application", "career"])
},
{
  question: "How can I access counseling services remotely?",
  answer: "Remote sessions are available via video conferencing. Book through the counseling portal.",
  category: "campus",
  language: "en",
  keywords: expandKeywords(["counseling", "remote", "video", "session"])
},
{
  question: "How do I update my bank account details for stipend?",
  answer: "Update your bank account information in the student finance portal under 'Stipend Details'.",
  category: "financial",
  language: "en",
  keywords: expandKeywords(["bank", "account", "update", "stipend"])
},
{
  question: "Are there facilities for students with disabilities?",
  answer: "Accessible classrooms, ramps, and support services are available. Contact the student support office for assistance.",
  category: "campus",
  language: "en",
  keywords: expandKeywords(["disabilities", "accessible", "support", "services"])
},
{
  question: "How do I apply for conference travel funding?",
  answer: "Submit your conference details and application form via the research funding portal.",
  category: "academic",
  language: "en",
  keywords: expandKeywords(["conference", "travel", "funding", "application"])
},
{
  question: "How can I join online student webinars?",
  answer: "Register via the student activities portal. Links and details are sent to your registered email.",
  category: "campus",
  language: "en",
  keywords: expandKeywords(["webinars", "online", "register", "student"])
},
{
  question: "What is the process to request course syllabus updates?",
  answer: "Submit a syllabus request through the academic portal specifying the course and reason for the update.",
  category: "academic",
  language: "en",
  keywords: expandKeywords(["syllabus", "update", "course", "request"])
},
{
  question: "Are there peer mentoring programs available?",
  answer: "Yes, students can apply to become mentors or mentees via the student mentoring portal.",
  category: "campus",
  language: "en",
  keywords: expandKeywords(["mentoring", "peer", "program", "application"])
},
{
  question: "How do I reserve a computer in the lab for project work?",
  answer: "Use the lab reservation system on the portal to book a workstation in advance.",
  category: "technical",
  language: "en",
  keywords: expandKeywords(["computer", "lab", "reservation", "project"])
},
{
  question: "What is the procedure to apply for field trips?",
  answer: "Submit the field trip application via the academic portal with necessary approvals from the instructor.",
  category: "academic",
  language: "en",
  keywords: expandKeywords(["field trip", "application", "approval", "portal"])
},
{
  question: "How can I access archived exam papers?",
  answer: "Archived exam papers are available in the library portal or LMS for reference and practice.",
  category: "academic",
  language: "en",
  keywords: expandKeywords(["exam papers", "archived", "LMS", "library"])
},
{
  question: "Can I request extra practice sessions for labs?",
  answer: "Submit a request to the lab coordinator specifying your course and preferred time slots.",
  category: "academic",
  language: "en",
  keywords: expandKeywords(["lab", "practice", "sessions", "request"])
},
{
  question: "How do I join student discussion forums?",
  answer: "Discussion forums are accessible via the LMS. Enroll in your courses to participate.",
  category: "academic",
  language: "en",
  keywords: expandKeywords(["forums", "discussion", "student", "LMS"])
},
{
  question: "Are there any cultural events for students?",
  answer: "Cultural events are listed on the student activities portal. Registration is online and free for enrolled students.",
  category: "campus",
  language: "en",
  keywords: expandKeywords(["cultural", "events", "registration", "students"])
},
{
  question: "How can I access online coding practice platforms provided by the college?",
  answer: "Login to the LMS and navigate to the 'Coding Practice' section to access the platforms.",
  category: "academic",
  language: "en",
  keywords: expandKeywords(["coding", "practice", "platforms", "online"])
}

]

// -----------------------------
// Merge with original sampleFAQs
// -----------------------------
const combinedFAQs = [...sampleFAQs, ...additionalFAQs]

// -----------------------------
// Populate database with combined FAQs
// -----------------------------
export const populateSampleData = async () => {
  try {
    await FAQ.deleteMany({})
    console.log('🗑️ Cleared old FAQs')

    await FAQ.insertMany(combinedFAQs)
    console.log(` Successfully populated ${combinedFAQs.length} sample FAQs`)
  } catch (err) {
    console.error('❌ Error populating sample FAQs:', err)
  }
}
