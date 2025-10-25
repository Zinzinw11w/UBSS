import { createAdminUser } from './src/services/database.js';

// Create initial admin user
const createInitialAdmin = async () => {
  try {
    const admin = await createAdminUser(
      'admin',           // username
      'admin123',        // password
      'admin@ubss.com'   // email
    );
    
    console.log('Admin user created successfully:', admin);
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('Email: admin@ubss.com');
    console.log('\nPlease change the default password after first login!');
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

createInitialAdmin();

