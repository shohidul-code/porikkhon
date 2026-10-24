import test from 'node:test';
import assert from 'node:assert/strict';
import {authOrigin,authCallbackUrl,emailCallbackStatus,emailLinkNotice} from '../lib/auth-links.mjs';

test('confirmation and recovery use the canonical production app origin',()=>{
  const origin='https://porikkhon-two.vercel.app';
  assert.equal(authCallbackUrl('https://preview.example',origin),'https://porikkhon-two.vercel.app/auth/callback');
  assert.equal(authCallbackUrl('https://preview.example',origin,'reset'),'https://porikkhon-two.vercel.app/auth/callback?next=reset');
});
test('production never emits localhost email links',()=>{
  for(const origin of ['http://localhost:3000','https://localhost:3000','http://127.0.0.1:3000','http://[::1]:3000'])assert.throws(()=>authOrigin(origin));
  assert.throws(()=>authOrigin('https://porikkhon-two.vercel.app','http://localhost:3000'));
  assert.equal(authOrigin('http://localhost:3000','',true),'http://localhost:3000');
});
test('unsafe or non-origin redirect configuration is rejected',()=>{
  for(const origin of ['javascript:alert(1)','http://external.example','https://user:pass@example.com','https://example.com/path','https://example.com/?next=https://other.example','https://example.com/#fragment'])assert.throws(()=>authOrigin(origin));
  assert.throws(()=>authCallbackUrl('https://example.com','','https://other.example'));
});
test('only a real successful session is shown as confirmed or ready to reset',()=>{
  assert.equal(emailCallbackStatus(null,true),'confirmed');
  assert.equal(emailCallbackStatus(null,true,true),'reset');
  assert.equal(emailCallbackStatus(null,false),'expired');
  assert.equal(emailCallbackStatus({code:'otp_expired'},true),'expired');
});
test('a phone email browser without the PKCE verifier receives a safe sign-in handoff',()=>{
  assert.equal(emailCallbackStatus({code:'pkce_code_verifier_not_found'},false),'signin');
  assert.equal(emailCallbackStatus({name:'AuthPKCECodeVerifierMissingError'},false),'signin');
  assert.equal(emailLinkNotice('signin').mode,'login');
  assert.match(emailLinkNotice('signin').notice,/different browser/);
});
test('cross-browser recovery requests a fresh browser-bound link',()=>{
  assert.equal(emailCallbackStatus({code:'pkce_code_verifier_not_found'},false,true),'recovery-retry');
  assert.equal(emailLinkNotice('recovery-retry').mode,'forgot');
  assert.match(emailLinkNotice('recovery-retry').notice,/same browser/);
  assert.equal(emailCallbackStatus({code:'flow_state_expired'},false,true),'expired');
});
test('expired email links offer sign-in and resend without trusting URL text',()=>{
  assert.equal(emailLinkNotice('expired').mode,'login');
  assert.match(emailLinkNotice('expired').notice,/new link/);
  assert.equal(emailLinkNotice('https://untrusted.example'),null);
});
