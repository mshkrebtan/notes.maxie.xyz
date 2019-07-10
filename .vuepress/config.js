module.exports = {
  title: 'Maxie’s Notes',
  description: 'Maksim Shkrebtan’s personal documentation website',

  dest: 'docs',
  themeConfig: {
    sidebarDepth: '4',
    sidebar: [
      {
        title: 'Kindle',
        children: [
          '/kindle/best-way-to-convert-fb2-to-mobi',
          '/kindle/convert-epub-to-mobi-with-kindlegen'
        ]
      },
      {
        title: 'Privacy',
        children: [
          '/privacy/spoof-your-browser-platform'
        ]
      },
      {
        title: 'Proxy & VPN',
        children: [
          '/proxy-and-vpn/configure-socks-proxy-on-ios-with-pac',
          '/proxy-and-vpn/simple-dante-configuration'
        ]
      }
    ],

    lastUpdated: 'Last Updated',
  },

      markdown: {
        lineNumbers: true
      },
      plugins: [
        [
          '@vuepress/google-analytics',
          {
            'ga': 'UA-142563675-1'
          }
        ]
      ]
  }
