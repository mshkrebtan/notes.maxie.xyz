module.exports = {
  title: 'Maxie’s Notes',
  description: 'Maksim Shkrebtan’s personal documentation website',

  dest: 'docs',
  themeConfig: {
    locales: {
      '/': {
        selectText: 'Languages',
        label: 'English',
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
          },
          {
            title: 'Linux',
            children: [
              '/linux/change-intel-i915-s-pwm-frequency-on-boot'
            ]
          },
          {
            title: 'macOS',
            children: [
              '/macos/mount-ntfs-volume-for-writing',
              '/macos/temporarily-prevent-mac-from-sleeping',
              '/macos/silence-the-startup-chime',
              '/macos/batch-convert-doc-to-pdf-with-libreoffice'
            ]
          }
        ],

        lastUpdated: 'Last Updated'
      },
      '/ru/': {
        selectText: 'Языки',
        label: 'Русский',
        sidebarDepth: '4',
        sidebar: [
          {
            title: 'macOS',
            children: [
              '/ru/macos/nalog-ru-digital-signature'
            ]
          }
        ],
        lastUpdated: 'Последнее обновление'
      }
    }
  },
  markdown: {
    lineNumbers: true
  },
  plugins: {
    '@vuepress/google-analytics': {
      'ga': 'UA-142563675-1'
    },
    'disqus': {}
  },
  locales: {
    '/': {
      lang: 'en-GB',
      title: 'Maxie’s Notes',
      description: 'Maksim Shkrebtan’s personal documentation website'
    },
    '/ru/': {
      lang: 'ru-RU',
      title: 'Maxie’s Notes',
      description: 'Личные заметки Максима Шкребтана'
    }
  }
}
