
type PerformanceEntry = {
  term: string;
  average: number;
};

type Child = {
  name: string;
  regId: string;
  class: string;
  className: string;
  formTeacher: string;
  performanceData: PerformanceEntry[];
};

export type User = {
  name: string;
  email: string;
  role: 'Parent' | 'Student' | 'Admin' | 'Staff';
  regId: string;
  avatar: string;
  className?: string; // e.g. "JS2"
  children?: Child[];
  formTeacherOf?: 'JS1' | 'JS2';
};

// --- Mock User Database ---

const studentUser1: User = {
  name: "Alex Doe",
  email: "student@flemzin.com",
  role: "Student",
  regId: "FZP-12345",
  avatar: "/placeholder-images/1.png",
  className: "JS2",
};

const studentUser2: User = {
  name: "Jane Doe",
  email: "jane.doe@flemzin.com",
  role: "Student",
  regId: "FZP-54321",
  avatar: "/placeholder-images/1.png",
  className: "JS1",
};

const parentUser: User = {
  name: "Mr. & Mrs. Doe",
  email: "parent@flemzin.com",
  role: "Parent",
  regId: "PAR-001",
  avatar: "/placeholder-images/1.png",
  children: [
    {
      name: "Alex Doe",
      regId: "FZP-12345",
      class: "JS2",
      className: "JS2 Class",
      formTeacher: "Mr. Adekunle",
      performanceData: [
        { term: "1st Term JS1 '23", average: 88 },
        { term: "2nd Term JS1 '23", average: 85 },
        { term: "3rd Term JS1 '23", average: 90 },
        { term: "1st Term JS2 '24", average: 92 },
        { term: "2nd Term JS2 '24", average: 91 },
      ]
    },
    {
      name: "Jane Doe",
      regId: "FZP-54321",
      class: "JS1",
      className: "JS1 Class",
      formTeacher: "Mrs. Davis",
      performanceData: [
        { term: "1st Term JS1 '24", average: 92 },
        { term: "2nd Term JS1 '24", average: 91 },
      ]
    }
  ]
};

const adminUser: User = {
  name: "Dr. Evelyn Reed",
  email: "admin@flemzin.com",
  role: "Admin",
  regId: "ADM-001",
  avatar: "/placeholder-images/1.png",
};

const staffUser: User = {
    name: "Mr. David Smith",
    email: "staff@flemzin.com",
    role: "Staff",
    regId: "STF-001",
    avatar: "/placeholder-images/1.png",
};

const staffUserAdekunle: User = {
    name: "Mr. Adekunle",
    email: "adekunle@flemzin.com",
    role: "Staff",
    regId: "STF-002",
    avatar: "/placeholder-images/1.png",
    formTeacherOf: 'JS2',
};

const staffUserDavis: User = {
    name: "Mrs. Davis",
    email: "davis@flemzin.com",
    role: "Staff",
    regId: "STF-003",
    avatar: "/placeholder-images/1.png",
    formTeacherOf: 'JS1',
};


export const allUsers: User[] = [parentUser, studentUser1, studentUser2, adminUser, staffUser, staffUserAdekunle, staffUserDavis];

// --- Other Mock Data ---

export const announcements = [
  {
    id: 1,
    title: "Mid-Term Break Announcement",
    content: "This is to inform all students and parents that the school will be on a mid-term break from 20th July to 27th July. Classes will resume on 28th July.",
    author: "Admin",
    date: "2024-07-15",
  },
  {
    id: 2,
    title: "Annual Sports Day",
    content: "The annual sports day will be held on 5th August. All students are encouraged to participate. Parents are welcome to attend.",
    author: "Mr. Smith (Staff)",
    date: "2024-07-10",
  },
  {
    id: 3,
    title: "Fee Payment Deadline",
    content: "The deadline for payment of school fees for the current term is 31st July. Please ensure all outstanding fees are cleared.",
    author: "Admin",
    date: "2024-07-05",
  },
];

export const allResults = {
  "FZP-12345": {
    "js2-1-2425": {
        details: {
            name: "Alex Doe",
            regId: "FZP-12345",
            class: "JS2",
            session: "JS2 First Term, 2024/2025",
            formTeacher: "Mr. Adekunle",
            position: "5th",
            totalInClass: "30",
            totalScore: "519",
            averageScore: "86.5",
            overallGrade: "Excellent",
            principalComment: "A very good result. Keep up the great work and continue to strive for excellence in all your subjects. The school is proud of your achievements.",
            teacherComment: "Alex has shown remarkable improvement this term, especially in sciences. With a bit more focus on Mathematics, Alex can be unstoppable. Excellent behavior.",
            affectiveSkills: [
                { name: "Punctuality", rating: 5 },
                { name: "Attendance", rating: 5 },
                { name: "Honesty", rating: 5 },
                { name: "Self Control", rating: 4 },
                { name: "Relationship with Peers", rating: 5 },
                { name: "Attentiveness", rating: 4 },
                { name: "Neatness", rating: 5 },
            ],
            psychomotorSkills: [
                { name: "Handwriting", rating: 4 },
                { name: "Games & Sports", rating: 5 },
                { name: "Creativity", rating: 4 },
            ]
        },
        results: [
            { subject: "Mathematics", ca1: 18, ca2: 17, exam: 50, total: 85, grade: "A", remark: "Excellent" },
            { subject: "English Language", ca1: 19, ca2: 18, exam: 55, total: 92, grade: "A+", remark: "Excellent" },
            { subject: "Physics", ca1: 15, ca2: 13, exam: 50, total: 78, grade: "B", remark: "Very Good" },
            { subject: "Chemistry", ca1: 16, ca2: 15, exam: 50, total: 81, grade: "A", remark: "Excellent" },
            { subject: "Biology", ca1: 18, ca2: 17, exam: 53, total: 88, grade: "A", remark: "Excellent" },
            { subject: "Computer Science", ca1: 20, ca2: 20, exam: 55, total: 95, grade: "A+", remark: "Excellent" },
        ],
    },
    "js1-3-2324": {
        details: {
            name: "Alex Doe",
            regId: "FZP-12345",
            class: "JS1",
            session: "JS1 Third Term, 2023/2024",
            formTeacher: "Mr. Adekunle",
            position: "8th",
            totalInClass: "30",
            totalScore: "490",
            averageScore: "81.6",
            overallGrade: "Very Good",
            principalComment: "Good performance. There is still room for improvement, especially in English Language. Keep working hard.",
            teacherComment: "Alex is a dedicated student. A little more effort in class participation would be beneficial.",
            affectiveSkills: [
                { name: "Punctuality", rating: 4 },
                { name: "Attendance", rating: 5 },
                { name: "Honesty", rating: 5 },
                { name: "Self Control", rating: 3 },
                { name: "Relationship with Peers", rating: 4 },
                { name: "Attentiveness", rating: 4 },
                { name: "Neatness", rating: 4 },
            ],
            psychomotorSkills: [
                { name: "Handwriting", rating: 3 },
                { name: "Games & Sports", rating: 4 },
                { name: "Creativity", rating: 4 },
            ]
        },
        results: [
            { subject: "Mathematics", ca1: 17, ca2: 15, exam: 50, total: 82, grade: "A", remark: "Excellent" },
            { subject: "English Language", ca1: 15, ca2: 15, exam: 45, total: 75, grade: "B", remark: "Very Good" },
            { subject: "Basic Science", ca1: 18, ca2: 17, exam: 50, total: 85, grade: "A", remark: "Excellent" },
            { subject: "Basic Technology", ca1: 18, ca2: 18, exam: 52, total: 88, grade: "A", remark: "Excellent" },
            { subject: "Social Studies", ca1: 16, ca2: 15, exam: 48, total: 79, grade: "B", remark: "Very Good" },
            { subject: "Civic Education", ca1: 16, ca2: 15, exam: 50, total: 81, grade: "A", remark: "Excellent" },
        ],
    }
  },
  "FZP-54321": {
    "js1-1-2425": {
        details: {
            name: "Jane Doe",
            regId: "FZP-54321",
            class: "JS1",
            session: "JS1 First Term, 2024/2025",
            formTeacher: "Mrs. Davis",
            position: "1st",
            totalInClass: "28",
            totalScore: "550",
            averageScore: "91.6",
            overallGrade: "Outstanding",
            principalComment: "An outstanding performance. Jane has set a new standard for her peers. We are incredibly proud of her diligence and academic excellence.",
            teacherComment: "Jane is a brilliant and hardworking student who excels in all areas. Her participation in class is exemplary. A pleasure to teach.",
            affectiveSkills: [
                { name: "Punctuality", rating: 5 },
                { name: "Attendance", rating: 5 },
                { name: "Honesty", rating: 5 },
                { name: "Self Control", rating: 5 },
                { name: "Relationship with Peers", rating: 5 },
                { name: "Attentiveness", rating: 5 },
                { name: "Neatness", rating: 5 },
            ],
            psychomotorSkills: [
                { name: "Handwriting", rating: 5 },
                { name: "Games & Sports", rating: 4 },
                { name: "Creativity", rating: 5 },
            ]
        },
        results: [
            { subject: "Mathematics", ca1: 20, ca2: 19, exam: 58, total: 97, grade: "A+", remark: "Excellent" },
            { subject: "English Language", ca1: 18, ca2: 18, exam: 56, total: 92, grade: "A+", remark: "Excellent" },
            { subject: "Basic Science", ca1: 19, ca2: 19, exam: 54, total: 92, grade: "A+", remark: "Excellent" },
            { subject: "Basic Technology", ca1: 17, ca2: 18, exam: 50, total: 85, grade: "A", remark: "Excellent" },
            { subject: "Social Studies", ca1: 18, ca2: 17, exam: 52, total: 87, grade: "A", remark: "Excellent" },
            { subject: "Civic Education", ca1: 20, ca2: 20, exam: 57, total: 97, grade: "A+", remark: "Excellent" },
        ],
    }
  },
};


export const performanceData = [
  { term: "1st Term JS1 '23", average: 75 },
  { term: "2nd Term JS1 '23", average: 78 },
  { term: "3rd Term JS1 '23", average: 82 },
  { term: "1st Term JS2 '24", average: 80 },
  { term: "2nd Term JS2 '24", average: 86 },
];
export const chartConfig = {
  average: {
    label: "Average Score",
    color: "hsl(var(--chart-1))",
  },
} satisfies {
  [key: string]: {
    label: string
    color: string
    icon?: React.ComponentType
  }
}

export const feeStatus = {
  total: 5000,
  paid: 4000,
  balance: 1000,
  transactions: [
    { id: "TXN001", date: "2024-05-10", amount: 2000, description: "Part Payment" },
    { id: "TXN002", date: "2024-06-15", amount: 2000, description: "Part Payment" },
  ],
};

export const calendarEvents = [
  { date: new Date(2024, 6, 20), title: "Mid-Term Break Starts" },
  { date: new Date(2024, 6, 27), title: "Mid-Term Break Ends" },
  { date: new Date(2024, 7, 5), title: "Annual Sports Day" },
  { date: new Date(2024, 7, 15), title: "Science Fair" },
];

// --- MOCK SUPPORT CHAT DATA ---
type SupportContact = {
    id: number;
    name: string;
    avatar: string;
    online: boolean;
    lastMessage: string;
    lastMessageTime: string;
    muted?: boolean;
}

const allSupportContacts: SupportContact[] = [
    { id: 1, name: 'General School Chat', avatar: 'GC', online: true, lastMessage: 'Remember the PTA meeting tomorrow.', lastMessageTime: '8m ago' },
    { id: 2, name: 'Admin Support', avatar: 'AS', online: true, lastMessage: 'Please let me know your registration ID.', lastMessageTime: '1h ago', muted: true },
    { id: 3, name: 'Mr. Adekunle (JS2 Teacher)', avatar: 'MA', online: false, lastMessage: 'The assignment is due Friday.', lastMessageTime: 'Yesterday' },
    { id: 4, name: 'Mrs. Davis (JS1 Teacher)', avatar: 'MD', online: true, lastMessage: 'Well done on the test, Jane.', lastMessageTime: '3h ago' },
    { id: 5, name: 'JS2 Class Chat', avatar: 'J2', online: true, lastMessage: 'Who has the notes for Physics?', lastMessageTime: '25m ago', muted: true },
    { id: 6, name: 'JS1 Class Chat', avatar: 'J1', online: true, lastMessage: 'See you at the sports meet!', lastMessageTime: '45m ago' },
    { id: 7, name: 'Staff Room', avatar: 'SR', online: true, lastMessage: 'Meeting at 2 PM.', lastMessageTime: '10m ago' },
];

export const chatMessages = {
    1: [ { id: 1, sender: 'Dr. Evelyn Reed', text: 'Welcome to the new school year! Remember the PTA meeting tomorrow.', time: '9:00 AM' } ],
    2: [ { id: 1, sender: 'Admin Support', text: 'Hello, how can I help you today? Please let me know your registration ID.', time: '10:31 AM' } ],
    3: [ { id: 1, sender: 'Mr. Adekunle (JS2 Teacher)', text: 'Hello Alex, the assignment is due Friday.', time: 'Yesterday' } ],
    4: [ { id: 1, sender: 'Mrs. Davis (JS1 Teacher)', text: 'Well done on the test, Jane.', time: '11:45 AM' } ],
    5: [ { id: 1, sender: 'Alex Doe', text: 'Who has the notes for Physics?', time: '1:00 PM' } ],
    6: [ { id: 1, sender: 'Jane Doe', text: 'See you at the sports meet!', time: '11:00 AM' } ],
    7: [ { id: 1, sender: 'Dr. Evelyn Reed', text: 'Staff meeting at 2 PM today.', time: '10:00 AM' } ],
};

// --- LOGIC TO GET SUPPORT CONTACTS BASED ON USER ---

export const getSupportContacts = (user: User): SupportContact[] => {
    const baseContacts = [
        allSupportContacts.find(c => c.id === 1)!, // General School Chat
        allSupportContacts.find(c => c.id === 2)!, // Admin Support
    ];

    if (user.role === 'Student') {
        if (user.className === 'JS2') {
            baseContacts.push(allSupportContacts.find(c => c.id === 5)!); // JS2 Class Chat
        }
        if (user.className === 'JS1') {
            baseContacts.push(allSupportContacts.find(c => c.id === 6)!); // JS1 Class Chat
        }
    }

    if (user.role === 'Parent') {
        return baseContacts;
    }

    if (user.role === 'Staff') {
        baseContacts.push(allSupportContacts.find(c => c.id === 7)!); // Staff Room
        
        // If they are a form teacher, add their class chat
        if (user.formTeacherOf === 'JS2') {
            baseContacts.push(allSupportContacts.find(c => c.id === 5)!);
        }
        if (user.formTeacherOf === 'JS1') {
            baseContacts.push(allSupportContacts.find(c => c.id === 6)!);
        }
    }
    
    return baseContacts;
}

export const getAdminSupportContacts = (): SupportContact[] => {
    return allSupportContacts; // Admin sees all chats
};

// --- NOTIFICATIONS ---
export const notifications = [
    {
        id: '1',
        type: 'announcement',
        title: 'Mid-Term Break',
        description: 'The school will be on mid-term break next week.',
        timestamp: '15 hours ago',
        read: false,
    },
    {
        id: '2',
        type: 'message',
        title: 'New Message from Mr. Adekunle',
        description: 'The assignment is due Friday.',
        timestamp: '1 day ago',
        read: false,
    },
    {
        id: '3',
        type: 'announcement',
        title: 'Annual Sports Day',
        description: 'The annual sports day will be held on 5th August.',
        timestamp: '2 days ago',
        read: true,
    },
    {
        id: '4',
        type: 'message',
        title: 'New Message in General School Chat',
        description: 'Remember the PTA meeting tomorrow.',
        timestamp: '3 days ago',
        read: true,
    }
];
