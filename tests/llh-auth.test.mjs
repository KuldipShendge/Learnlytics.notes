import test from 'node:test';
import assert from 'node:assert/strict';
import { publicConfigurationValid, emailLinkAction, escapeHtml } from '../js/llh-auth-utils.js';
test('only public keys and safe email verification/recovery link types are accepted',()=>{
 assert(publicConfigurationValid({supabaseUrl:'https://project.supabase.co',publishableKey:'sb_publishable_example'}));
 assert(!publicConfigurationValid({supabaseUrl:'https://project.supabase.co',publishableKey:'sb_secret_example'}));
 const jwt=role=>`e30.${btoa(JSON.stringify({role}))}.signature`;
 assert(publicConfigurationValid({supabaseUrl:'http://127.0.0.1:54321',publishableKey:jwt('anon')}));
 assert(!publicConfigurationValid({supabaseUrl:'https://project.supabase.co',publishableKey:jwt('service_role')}));
 assert(!publicConfigurationValid({supabaseUrl:'http://public.example.test',publishableKey:jwt('anon')}));
 assert(!publicConfigurationValid({supabaseUrl:'https://user:password@project.supabase.co',publishableKey:jwt('anon')}));
 assert.equal(emailLinkAction('#type=magiclink&token_hash=aaaaaaaaaaaaaaaaaaaa'),null);
 assert.equal(emailLinkAction('#access_token=forged&type=recovery'),null);
 assert.equal(emailLinkAction('#type=recovery&token_hash=short'),null);
 assert.deepEqual(emailLinkAction('#type=recovery&token_hash=aaaaaaaaaaaaaaaaaaaa'),{type:'recovery',token_hash:'aaaaaaaaaaaaaaaaaaaa'});
 assert.equal(escapeHtml('<img onerror="bad">'),'&lt;img onerror=&quot;bad&quot;&gt;');
});
