module.exports = {
    devServer: {
        proxy: {
            '/proxy': {
                // target: 'http://apps.inside.gzeducard.net:19002',
                target: 'http://172.16.4.248:8011',
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/proxy': ''
                }
            }
        }
    }
};