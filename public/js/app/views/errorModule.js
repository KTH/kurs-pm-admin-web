if (window.ga) {
  let from = ''

  if (document.referrer) {
    from = ', referralPage=' + document.referrer
  }

  window.ga(
    'send',
    'event',
    'PageError',
    window.StatusCode,
    document.location.pathname + document.location.search + ' ' + from
  )
}
