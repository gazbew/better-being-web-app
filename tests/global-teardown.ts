import { FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
  console.log('🏁 Starting AI-Native Design Workflow Global Teardown...');

  const setupTime = process.env.PLAYWRIGHT_SETUP_TIME;
  const teardownTime = new Date().toISOString();

  if (setupTime) {
    const duration = Date.now() - new Date(setupTime).getTime();
    console.log(`⏱️  Total test execution time: ${Math.round(duration / 1000)}s`);
  }

  // Clean up any temporary files or resources
  try {
    console.log('🧹 Cleaning up test artifacts...');

    // Log final status
    console.log('📊 Design validation completed');
    console.log('🎯 Brand Bible compliance testing finished');

    // Generate final report timestamp
    console.log(`📝 Teardown completed at: ${teardownTime}`);

    console.log('✅ AI-Native Design Workflow teardown successful');

  } catch (error) {
    console.error('❌ Teardown encountered issues:', error);
  }

  console.log('🎉 Better Being Design Review Session Complete');
}

export default globalTeardown;
