# Configure Dante SOCKS-server to Access Blocked Web-services


## Install Dante — a free SOCKS server

On a Debian/Ubuntu server, the simplest way is to install from the repos:

```
sudo apt install dante-server
```

Another way is to install the precompiled binaries from here:

<https://www.inet.no/dante/sslfiles/binaries.html>


## Configure Dante server

Dante server configuration is stored in file `/etc/danted.conf`.

Below is an example of simple configuration, without authentication and with a
“list” of allowed services and websites. So anyone from the Internet can
connect to this server and use it to proxy requests to the “white listed”
websites. Helping to bring freedom to the Internet!


### Basic configuration

First comes a basic global configuration:

<<< @/proxy-and-vpn/files/danted-global.conf


### Freedom to Telegram

Below is a configuration snippet to proxy requests to Telegram. Useful for those
who use Telegram in the countries that block it.

<<< @/proxy-and-vpn/files/danted-telegram.conf


### Access to blocked websites

Here is an example on how to allow requests to specific websites:

<<< @/proxy-and-vpn/files/danted-websites.conf


### Blocking the rest

Finally, block all the other requests:

<<< @/proxy-and-vpn/files/danted-rest.conf


## References

- Dante - Documentation

    <https://www.inet.no/dante/doc/1.4.x/index.html>


- Telegram calls via Dante socks5 proxy server not working - Stack Overflow

    <https://stackoverflow.com/questions/49855516/telegram-calls-via-dante-socks5-proxy-server-not-working>

<br/>
<ClientOnly>
<Disqus shortname="notes-maxie-xyz" language="en"/>
</ClientOnly>

<br/>
<div style="text-align: center; font-size: x-small">
    Allow loading scripts from disqus.com to see the comments.
</div>
