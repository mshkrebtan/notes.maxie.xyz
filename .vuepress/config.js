module.exports = {
    title: 'Maxie’s Notes',
    description: 'Maksim Shkrebtan’s personal documentation website',

    dest: 'docs',
    themeConfig: {
        nav: [
            { text: 'Kindle', link: '/kindle/'},
            { text: 'Privacy', link: '/privacy/'},
        ],

        sidebarDepth: '4',
        sidebar: {
            '/kindle/': [
                'best-way-to-convert-fb2-to-mobi',
                'convert-epub-to-mobi-with-kindlegen'
            ],
            '/privacy/': [
                'spoof-your-browser-platform'
            ]
        },

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
