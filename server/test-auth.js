import 'dotenv/config';
import AuthService from './src/services/auth.service.js';

async function testAuth() {
  try {
    console.log('🧪 Testing Authentication System...\n');

    // Test user registration
    console.log('1. Testing user registration...');
    const uniqueEmail = `test${Date.now()}@example.com`;
    const registerResult = await AuthService.registerUser({
      email: uniqueEmail,
      password: 'TestPass123!',
      firstName: 'Test',
      lastName: 'User',
      marketingConsent: true
    }, {
      ip: '127.0.0.1',
      userAgent: 'Test/1.0'
    });

    console.log('✅ Registration successful:', {
      user: registerResult.user,
      hasTokens: !!registerResult.tokens.accessToken,
      hasSession: !!registerResult.tokens.sessionToken
    });

    // Test user login
    console.log('\n2. Testing user login...');
    const loginResult = await AuthService.loginUser(uniqueEmail, 'TestPass123!', {
      ip: '127.0.0.1',
      userAgent: 'Test/1.0'
    });

    console.log('✅ Login successful:', {
      user: loginResult.user,
      hasTokens: !!loginResult.tokens.accessToken,
      hasSession: !!loginResult.tokens.sessionToken
    });

    // Test session validation
    console.log('\n3. Testing session validation...');
    const sessionValidation = await AuthService.validateSession(loginResult.tokens.sessionToken);

    if (sessionValidation) {
      console.log('✅ Session validation successful:', {
        userId: sessionValidation.user.id,
        sessionId: sessionValidation.session.id
      });
    } else {
      console.log('❌ Session validation failed');
    }

    // Test logout
    console.log('\n4. Testing logout...');
    const logoutResult = await AuthService.logout(loginResult.tokens.refreshToken);
    console.log('✅ Logout successful:', logoutResult);

    // Test login again to create new session
    console.log('\n5. Testing login again...');
    const loginResult2 = await AuthService.loginUser(uniqueEmail, 'TestPass123!', {
      ip: '127.0.0.1',
      userAgent: 'Test/1.0'
    });

    // Test logout from all devices
    console.log('\n6. Testing logout from all devices...');
    const logoutAllResult = await AuthService.logoutAll(loginResult2.user.id);
    console.log('✅ Logout from all devices successful:', logoutAllResult);

    // Test password reset request
    console.log('\n7. Testing password reset request...');
    const resetRequest = await AuthService.requestPasswordReset(uniqueEmail);
    console.log('✅ Password reset request successful:', {
      hasToken: !!resetRequest.resetToken,
      user: resetRequest.user
    });

    console.log('\n🎉 All authentication tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Full error:', error);
  }
}

testAuth();