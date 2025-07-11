// MongoDB initialization script for Insight360
// This script runs when the MongoDB container is first created

// Switch to the insight360 database
db = db.getSiblingDB('insight360');

// Create a user for the application
db.createUser({
  user: 'insight360_user',
  pwd: 'insight360_pass',
  roles: [
    {
      role: 'readWrite',
      db: 'insight360'
    }
  ]
});

// Create initial collections (optional)
db.createCollection('users');

// Insert a welcome document (optional)
db.users.insertOne({
  _id: ObjectId(),
  fullName: 'System',
  email: 'system@insight360.com',
  createdAt: new Date(),
  isSystem: true
});

print('✅ Insight360 database initialized successfully!');
