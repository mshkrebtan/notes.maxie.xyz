function FindProxyForURL(url, host) {
  if  (dnsDomainIs(host, ".telegram.org.")
    || dnsDomainIs(host, ".telegram.org")
    || dnsDomainIs(host, "telegram.org")
  )
    return "SOCKS proxy.address.org:1080";
  return "DIRECT";
}
