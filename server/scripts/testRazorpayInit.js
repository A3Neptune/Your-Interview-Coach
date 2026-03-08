import dotenv from 'dotenv';
import Razorpay from 'razorpay';

/**
 * Test script to verify Razorpay credentials are loaded correctly
 * Run with: node scripts/testRazorpayInit.js
 */

console.log('🔍 Testing Razorpay Initialization...\n');

// Load environment variables
dotenv.config();

console.log('Environment Variables Status:');
console.log('  RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID ? '✅ Set' : '❌ Missing');
console.log('  RAZORPAY_KEY_SECRET:', process.env.RAZORPAY_KEY_SECRET ? '✅ Set' : '❌ Missing');

if (process.env.RAZORPAY_KEY_ID) {
  console.log('  Key ID (first 8 chars):', process.env.RAZORPAY_KEY_ID.substring(0, 8) + '...');
}

console.log('\nTrying to initialize Razorpay...');

try {
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID?.trim(),
    key_secret: process.env.RAZORPAY_KEY_SECRET?.trim(),
  });

  console.log('✅ Razorpay initialized successfully!\n');

  // Test fetching payments (will fail if credentials are invalid)
  console.log('🔍 Testing Razorpay API connection...');

  razorpay.payments.all({ count: 1 })
    .then(payments => {
      console.log('✅ Razorpay API connection successful!');
      console.log('   Retrieved', payments.items?.length || 0, 'payment(s)\n');
      console.log('🎉 All tests passed! Your Razorpay configuration is correct.\n');
      process.exit(0);
    })
    .catch(error => {
      if (error.statusCode === 401) {
        console.error('❌ Authentication failed! Your Razorpay credentials are invalid.');
        console.error('   Please check your RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env\n');
      } else {
        console.log('⚠️  Could not verify API connection (this might be a network issue)');
        console.log('   Error:', error.message);
        console.log('   However, Razorpay was initialized successfully.\n');
      }
      process.exit(error.statusCode === 401 ? 1 : 0);
    });

} catch (error) {
  console.error('❌ Failed to initialize Razorpay!');
  console.error('   Error:', error.message);
  console.error('\n📝 Make sure your .env file contains:');
  console.error('   RAZORPAY_KEY_ID=your_key_id_here');
  console.error('   RAZORPAY_KEY_SECRET=your_key_secret_here\n');
  process.exit(1);
}
