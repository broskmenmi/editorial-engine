import process from 'node:process';

const AUTHORIZE_URL = 'https://accounts.spotify.com/authorize';
const TOKEN_URL = 'https://accounts.spotify.com/api/token';
const SCOPES = [
  'playlist-read-private',
  'playlist-modify-private',
  'playlist-modify-public',
];

function option(name, fallback = null) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : fallback;
}

function required(name, value) {
  if (!value) throw new Error(`Missing ${name}.`);
  return value;
}

async function main() {
  const clientId = required('SPOTIFY_CLIENT_ID', process.env.SPOTIFY_CLIENT_ID);
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri = option('--redirect-uri', 'http://127.0.0.1:4387/callback');
  const code = option('--code', process.env.SPOTIFY_AUTH_CODE);

  if (!code) {
    const url = new URL(AUTHORIZE_URL);
    url.search = new URLSearchParams({
      client_id: clientId,
      response_type: 'code',
      redirect_uri: redirectUri,
      scope: SCOPES.join(' '),
      show_dialog: 'true',
    });
    console.log('Open this URL, approve access, then copy the code query parameter from the redirect URL:');
    console.log(url.toString());
    console.log('\nThen run:');
    console.log('SPOTIFY_CLIENT_ID=... SPOTIFY_CLIENT_SECRET=... npm run authorize -- --redirect-uri "' + redirectUri + '" --code "COPIED_CODE"');
    return;
  }

  required('SPOTIFY_CLIENT_SECRET', clientSecret);
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
    }),
  });
  const body = await response.json();
  if (!response.ok || !body.refresh_token) {
    throw new Error(`Authorization exchange failed (${response.status}): ${JSON.stringify(body)}`);
  }

  console.log('Store this value as the GitHub Actions secret SPOTIFY_REFRESH_TOKEN:');
  console.log(body.refresh_token);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
