export const dashboardData = {
  campaign: {
    name: 'Aadhar MBU Campaign (Large Scale)',
    totalMessages: 150000,
    delivered: 138500,
    read: 112400,
    failed: 11500,
    flowCompleted: 85200,
    notCompleted: 64800,
    mbuYes: 42600,
    mbuNo: 24300,
    mbuNotNow: 18300,
    languages: { 
      english: 55000, 
      hindi: 75000, 
    },
    formats: { 
      formal: { total: 95000, english: 42000, hindi: 53000 }, 
      informal: { total: 55000, english: 13000, hindi: 22000 } 
    },
    remindersProgramYes: 38500,
    remindersSent: 125000,
    remindersPushed: 118000,
    remindersDelivered: 110500,
    remindersRead: 92400,
    assetsPushed: { video: 45000, poster: 105000 }
  },
  botLevels: {
    userInput: [
      { level: 3, branch: 'info', type: 'button' },
      { level: 4, branch: 'plandata', type: 'button' },
      { level: 5, branch: 'infoPlan', type: 'button' },
      { level: 5, branch: 'location', type: 'button' }
    ],
    nonUserInput: [
      { level: 3, branch: 'close', type: 'readonly' },
      { level: 6, branch: 'locationBtn', type: 'readonly' },
      { level: 7, branch: 'Remainder', type: 'readonly' }
    ]
  },
  recentCampaigns: [
    { id: 1, date: '2026-01-25', name: 'MBU Awareness Drive', language: 'Hindi', templateName: 'Formal', total: 52000, sent: 50000, delivered: 48000, read: 35000, failed: 2000 },
    { id: 2, date: '2026-01-25', name: 'MBU Awareness Drive', language: 'English', templateName: 'Formal', total: 52000, sent: 50000, delivered: 48000, read: 35000, failed: 2000  },
    { id: 3, date: '2026-01-22', name: 'Plan Info Broadcast', language: 'English', templateName: 'Informal', total: 31000, sent: 30000, delivered: 29000, read: 22000, failed: 1000},
    { id: 4, date: '2026-01-18', name: 'Renewal Reminder', language: 'Hindi', templateName: 'Formal', total: 26000, sent: 25000, delivered: 24000, read: 18000, failed: 1000 },
    { id: 5, date: '2026-01-15', name: 'Greeting Campaign', language: 'English', templateName: 'Informal', total: 16000, sent: 15000, delivered: 14500, read: 11000, failed: 500 },
  ]
}

// Helper to generate a larger set of users
const locations = ['Mumbai', 'Delhi', 'Ahmedabad', 'Hyderabad', 'Jaipur', 'Chennai', 'Kolkata', 'Kochi', 'Bangalore', 'Pune'];
const languages = ['English', 'Hindi', 'Marathi'];
const formats = ['Formal', 'Informal'];
const mbuStatuses = ['completed', 'pending', 'failed'];
const flowStatuses = ['MBU - Yes', 'MBU - No', 'In Progress', 'Not Completed'];
const names = [
  'Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Sneha Reddy', 'Vikram Singh',
  'Ananya Iyer', 'Rahul Gupta', 'Kavita Menon', 'Suresh Nair', 'Deepa Verma',
  'Sunita Bai', 'Arun Ghosh', 'Meera Deshmukh', 'Sanjay Mehra', 'Jyoti Rao',
  'Abhishek Jain', 'Poonam Vats', 'Nitin Gadkari', 'Swati Maliwal', 'Kiran Bedi'
];

export const usersData = Array.from({ length: 40 }, (_, i) => {
  const name = names[i % names.length] + (i >= names.length ? ` ${Math.floor(i/names.length)}` : '');
  const mbuStatus = mbuStatuses[i % 3];
  const language = languages[i % 3];
  const format = formats[i % 2];
  
  // Logical consistency for flowStatus based on mbuStatus
  let flowStatus;
  if (mbuStatus === 'completed') {
    flowStatus = i % 2 === 0 ? 'MBU - Yes' : 'MBU - No';
  } else if (mbuStatus === 'pending') {
    flowStatus = 'In Progress';
  } else {
    flowStatus = 'Not Completed';
  }

  const isDelivered = i % 10 !== 9; // 90% delivery
  const isRead = isDelivered && (i % 5 !== 0); // 80% read rate
  const isFailed = !isDelivered;

  return {
    id: i + 1,
    name,
    phone: `+91 ${90000 + i} ${10000 + i}`,
    aadhar: `XXXX-XXXX-${1000 + i}`,
    mbuStatus,
    lastActive: `2026-01-${Math.min(28, 10 + i)}`,
    location: locations[i % locations.length],
    flowStatus,
    language,
    format,
    isDelivered,
    isRead,
    isFailed,
    isReminderSent: i % 4 === 0,
    isReminderFailed: i % 4 === 1,
    isReminderProgramYes: flowStatus === 'MBU - Yes' && i % 3 === 0,
    assetType: i % 5 === 0 ? 'video' : (i % 5 === 2 ? 'poster' : 'none')
  };
});

