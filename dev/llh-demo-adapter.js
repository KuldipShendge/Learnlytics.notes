// UI simulation, NOT a production authentication implementation.
// State is private to one module instance/tab and disappears on reload.
export function createDemoAdapter({ now = () => Date.now() } = {}) {
  const DEMO_IDENTIFIER = 'admin';
  const DEMO_OTP = '0000';
  let account = null, pending = null, phase = 'idle', verified = false;
  let expires = 0, resendAt = 0, otpAttempts = 0, pinAttempts = 0, lockedUntil = 0;
  const requirePhase = expected => { if (phase !== expected) throw new Error('Start this step again.'); };
  const validatePin = pin => { if (!/^[0-9]{4}$/.test(pin)) throw new Error('Enter exactly 4 numbers.'); };
  const resetFlow = () => { pending = null; verified = false; phase = 'idle'; expires = 0; };
  async function digest(pin, salt) {
    validatePin(pin);
    const bytes = new TextEncoder().encode(pin);
    try {
      const key = await crypto.subtle.importKey('raw', bytes, 'PBKDF2', false, ['deriveBits']);
      return new Uint8Array(await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' }, key, 256));
    } finally { bytes.fill(0); }
  }
  const equal = (a, b) => { let difference = a.length ^ b.length; for (let i = 0; i < a.length; i++) difference |= a[i] ^ b[i]; return difference === 0; };
  function challenge() {
    if (now() < lockedUntil) throw new Error('Too many attempts. Wait 30 seconds and try again.');
    verified = false; pending = null; phase = 'otp'; expires = now() + 300000; resendAt = now() + 30000;
  }
  return Object.freeze({
    local: true,
    async begin(identifier, mode) {
      resetFlow();
      if (identifier !== DEMO_IDENTIFIER) throw new Error('For this local preview, use the demo identifier in the testing instructions.');
      if (mode === 'login') {
        if (!account) throw new Error('Create your PIN in this tab first. Choose Create account.');
        phase = 'login'; return 'login';
      }
      challenge(); return 'otp';
    },
    async verify(code) {
      requirePhase('otp');
      if (now() < lockedUntil) throw new Error('Too many attempts. Wait 30 seconds and try again.');
      if (now() >= expires) throw new Error('This code has expired. Request a new code.');
      if (code !== DEMO_OTP) {
        if (++otpAttempts >= 5) { lockedUntil = now() + 30000; otpAttempts = 0; }
        throw new Error('That code doesn’t match. Please try again.');
      }
      verified = true; phase = 'create'; expires = 0; otpAttempts = 0;
    },
    async preparePin(pin) {
      if (!verified || !['create', 'confirm'].includes(phase)) throw new Error('Verify your email first.');
      const salt = crypto.getRandomValues(new Uint8Array(16));
      pending = { salt, verifier: await digest(pin, salt) }; phase = 'confirm';
    },
    async confirmPin(pin) {
      requirePhase('confirm');
      if (!verified || !pending) throw new Error('Verify your email first.');
      const candidate = await digest(pin, pending.salt);
      const matches = equal(candidate, pending.verifier); candidate.fill(0);
      if (!matches) throw new Error('Your PINs don’t match. Please try again.');
      account = pending; pending = null; verified = false; pinAttempts = 0; phase = 'ready';
    },
    async enter() { requirePhase('ready'); phase = 'signed-in'; },
    async login(pin) {
      requirePhase('login');
      if (now() < lockedUntil) throw new Error('Too many attempts. Wait 30 seconds and try again.');
      if (!account) throw new Error('Create your PIN first.');
      const candidate = await digest(pin, account.salt);
      const matches = equal(candidate, account.verifier); candidate.fill(0);
      if (!matches) {
        if (++pinAttempts >= 5) { lockedUntil = now() + 30000; pinAttempts = 0; }
        throw new Error('That PIN doesn’t match. Try again or reset your PIN.');
      }
      pinAttempts = 0; phase = 'signed-in';
    },
    async recover() { requirePhase('login'); if (!account) throw new Error('Create your PIN first.'); challenge(); },
    async resend() {
      requirePhase('otp');
      if (now() < resendAt) throw new Error('Please wait 30 seconds before requesting another code.');
      challenge();
    },
    async logout() { requirePhase('signed-in'); resetFlow(); },
    cancel: resetFlow,
    destroy() { account?.verifier.fill(0); pending?.verifier.fill(0); account = null; resetFlow(); },
  });
}
