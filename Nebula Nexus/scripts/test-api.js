const fetch = require('node-fetch');

async function testAPI() {
  try {
    console.log('=== API Test ===\n');

    // Test career recommendations API
    console.log('Testing career recommendations API...');
    
    const response = await fetch('http://localhost:3000/api/user/career-recommendations', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add any necessary auth headers here
      }
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    if (response.ok) {
      const data = await response.json();
      console.log('Response data:', JSON.stringify(data, null, 2));
    } else {
      const errorText = await response.text();
      console.log('Error response:', errorText);
    }

  } catch (error) {
    console.error('API test error:', error);
  }
}

testAPI(); 