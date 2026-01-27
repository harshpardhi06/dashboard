// Dashboard data based on the flowchart requirements
export const dashboardData = {
  campaign: {
    name: 'Aadhar MBU Campaign',
    totalMessages: 150000,
    delivered: 100000,
    read: 85000,
    failed: 15000,
    flowCompleted: 50000,
    notCompleted: 50000,
    mbuYes: 12500,
    mbuNo: 7500,
    languages: { english: 45000, hindi: 85000, marathi: 20000 },
    formats: { formal: 90000, informal: 60000 },
    remindersProgramYes: 12000,
    remindersSent: 25000,
    remindersPushed: 22000,
    assetsPushed: { video: 15000, poster: 35000 }
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
    { id: 1, name: 'MBU Awareness Drive', status: 'active', sent: 5000, delivered: 4750, response: '68%' },
    { id: 2, name: 'Plan Info Broadcast', status: 'completed', sent: 3200, delivered: 3100, response: '72%' },
    { id: 3, name: 'Location Update', status: 'pending', sent: 1500, delivered: 0, response: '-' }
  ]
}

// Users data
export const usersData = [
  { id: 1, name: 'Rajesh Kumar', phone: '+91 98765 43210', aadhar: 'XXXX-XXXX-1234', mbuStatus: 'completed', lastActive: '2026-01-22', location: 'Mumbai', flowStatus: 'MBU - Yes' },
  { id: 2, name: 'Priya Sharma', phone: '+91 87654 32109', aadhar: 'XXXX-XXXX-5678', mbuStatus: 'completed', lastActive: '2026-01-22', location: 'Delhi', flowStatus: 'MBU - Yes' },
  { id: 3, name: 'Amit Patel', phone: '+91 76543 21098', aadhar: 'XXXX-XXXX-9012', mbuStatus: 'pending', lastActive: '2026-01-21', location: 'Ahmedabad', flowStatus: 'In Progress' },
  { id: 4, name: 'Sneha Reddy', phone: '+91 65432 10987', aadhar: 'XXXX-XXXX-3456', mbuStatus: 'completed', lastActive: '2026-01-22', location: 'Hyderabad', flowStatus: 'MBU - No' },
  { id: 5, name: 'Vikram Singh', phone: '+91 54321 09876', aadhar: 'XXXX-XXXX-7890', mbuStatus: 'failed', lastActive: '2026-01-20', location: 'Jaipur', flowStatus: 'Not Completed' },
  { id: 6, name: 'Ananya Iyer', phone: '+91 43210 98765', aadhar: 'XXXX-XXXX-2345', mbuStatus: 'completed', lastActive: '2026-01-22', location: 'Chennai', flowStatus: 'MBU - Yes' },
  { id: 7, name: 'Rahul Gupta', phone: '+91 32109 87654', aadhar: 'XXXX-XXXX-6789', mbuStatus: 'pending', lastActive: '2026-01-21', location: 'Kolkata', flowStatus: 'In Progress' },
  { id: 8, name: 'Kavita Menon', phone: '+91 21098 76543', aadhar: 'XXXX-XXXX-0123', mbuStatus: 'completed', lastActive: '2026-01-22', location: 'Kochi', flowStatus: 'MBU - Yes' },
  { id: 9, name: 'Suresh Nair', phone: '+91 10987 65432', aadhar: 'XXXX-XXXX-4567', mbuStatus: 'failed', lastActive: '2026-01-19', location: 'Bangalore', flowStatus: 'Not Completed' },
  { id: 10, name: 'Deepa Verma', phone: '+91 09876 54321', aadhar: 'XXXX-XXXX-8901', mbuStatus: 'completed', lastActive: '2026-01-22', location: 'Pune', flowStatus: 'MBU - Yes' },
]
