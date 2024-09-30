// @ts-check

const withNextIntl = require('next-intl/plugin')();

/** @type {import('next').NextConfig} */
const config = {
    images: {
        domains: ['buildsuite-dev.app.buildsuite.io'],
        unoptimized: true,
    }
};

module.exports = withNextIntl(config);
