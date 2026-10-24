/** Keep email links on the configured app instead of an ephemeral preview host. */
export function authOrigin(currentOrigin, configuredOrigin = '', isDevelopment = false) {
  const url = new URL(configuredOrigin || currentOrigin);
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
  if (url.username || url.password || url.pathname !== '/' || url.search || url.hash ||
      (local ? !isDevelopment || !['http:', 'https:'].includes(url.protocol) : url.protocol !== 'https:')) {
    throw new Error('Authentication links need a valid HTTPS app origin.');
  }
  return url.origin;
}

export function authCallbackUrl(currentOrigin, configuredOrigin = '', purpose = 'confirm', isDevelopment = false) {
  if (!['confirm', 'reset'].includes(purpose)) throw new Error('Unknown email link purpose.');
  const url = new URL('/auth/callback', authOrigin(currentOrigin, configuredOrigin, isDevelopment));
  if (purpose === 'reset') url.searchParams.set('next', 'reset');
  return url.toString();
}

/** A missing browser verifier is a sign-in handoff, never proof of confirmation. */
export function emailCallbackStatus(error, hasSession = false, isRecovery = false) {
  if (!error && hasSession) return isRecovery ? 'reset' : 'confirmed';
  if (error?.code === 'pkce_code_verifier_not_found' || error?.name === 'AuthPKCECodeVerifierMissingError') {
    return isRecovery ? 'recovery-retry' : 'signin';
  }
  return 'expired';
}

export function emailLinkNotice(status) {
  if (status === 'signin') return {
    mode: 'login',
    notice: 'This email link opened in a different browser. Sign in with your email and password to continue. If confirmation is still needed, use Resend confirmation email below.'
  };
  if (status === 'expired') return {
    mode: 'login',
    notice: 'This email link has expired or was already used. Try signing in. If your email still needs confirmation, request a new link below.'
  };
  if (status === 'recovery-retry') return {
    mode: 'forgot',
    notice: 'Request a new password reset link from this browser, then open it in this same browser to finish resetting your password.'
  };
  return null;
}
