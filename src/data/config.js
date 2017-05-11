export default function() {
  const baseRedirectUrl = window.location.origin + window.location.pathname;
  const redirectUri = baseRedirectUrl +
    (baseRedirectUrl.substring(baseRedirectUrl.length - 1) === '/' ||
      baseRedirectUrl.indexOf('html') > -1
      ? ''
      : '/') +
    (window.location.pathname.indexOf('.html') < 0 ? 'index.html' : '');

  return {
    clientId: '71ad6f6d14ef4f82b967b193dc8a3019',
    clientSecret: undefined,
    redirectUri,
    accessToken: ''
  };
}
