// Debug utility for Supabase connection issues
import { supabase } from './supabaseClient';

const MEDIA_BUCKET = import.meta.env.VITE_SUPABASE_MEDIA_BUCKET || 'media';

/**
 * Comprehensive debug function to test Supabase setup
 */
export async function debugSupabaseSetup() {
  console.log('🔍 Starting Supabase Debug...');
  
  // Check environment variables
  console.log('📋 Environment Variables:');
  console.log('  - SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL ? '✅ Set' : '❌ Missing');
  console.log('  - SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing');
  console.log('  - MEDIA_BUCKET:', MEDIA_BUCKET);
  
  if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
    console.error('❌ Missing required environment variables');
    return;
  }

  try {
    // Test 1: Basic connection
    console.log('\n🔗 Testing basic connection...');
    const { error: authError } = await supabase.auth.getSession();
    if (authError) {
      console.error('❌ Auth error:', authError);
    } else {
      console.log('✅ Basic connection successful');
    }

    // Test 2: List buckets
    console.log('\n🪣 Testing bucket access...');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    if (bucketsError) {
      console.error('❌ Bucket list error:', bucketsError);
    } else {
      console.log('✅ Buckets found:', buckets?.map(b => b.name) || []);
    }

    // Test 3: Test specific bucket
    console.log(`\n📁 Testing access to '${MEDIA_BUCKET}' bucket...`);
    const { data: files, error: filesError } = await supabase.storage
      .from(MEDIA_BUCKET)
      .list('', { limit: 1 });
    
    if (filesError) {
      console.error('❌ Bucket access error:', filesError);
      console.log('💡 This might indicate:');
      console.log('   - Bucket does not exist');
      console.log('   - RLS policies are not configured');
      console.log('   - Bucket is not public');
    } else {
      console.log('✅ Bucket access successful');
      console.log('   - Files in bucket:', files?.length || 0);
    }

    // Test 4: Try to get bucket info
    console.log('\n🔍 Testing bucket info...');
    try {
      const { data: bucketInfo, error: bucketInfoError } = await supabase.storage.getBucket(MEDIA_BUCKET);
      if (bucketInfoError) {
        console.error('❌ Bucket info error:', bucketInfoError);
      } else {
        console.log('✅ Bucket info:', bucketInfo);
      }
    } catch (error) {
      console.error('❌ Bucket info failed:', error);
    }

  } catch (error) {
    console.error('❌ Debug failed:', error);
  }
  
  console.log('\n🎯 Debug complete. Check the console for issues.');
}

/**
 * Test upload with a small test file
 */
export async function testUpload() {
  console.log('🧪 Testing upload functionality...');
  
  // Create a small test file
  const testContent = 'test';
  const testFile = new File([testContent], 'test.txt', { type: 'text/plain' });
  
  try {
    const { data, error } = await supabase.storage
      .from(MEDIA_BUCKET)
      .upload(`test-${Date.now()}.txt`, testFile, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error('❌ Upload test failed:', error);
      return false;
    } else {
      console.log('✅ Upload test successful:', data);
      
      // Clean up test file
      const { error: deleteError } = await supabase.storage
        .from(MEDIA_BUCKET)
        .remove([data.path]);
      
      if (deleteError) {
        console.warn('⚠️ Failed to clean up test file:', deleteError);
      } else {
        console.log('✅ Test file cleaned up');
      }
      
      return true;
    }
  } catch (error) {
    console.error('❌ Upload test exception:', error);
    return false;
  }
} 