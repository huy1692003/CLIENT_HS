const path = require('path');

module.exports = function override(config) {
    config.resolve.alias = {
        ...(config.resolve.alias || {}),
        '~': path.resolve(__dirname, 'src'), // Chỉ định ~ trỏ đến thư mục src
    };
    return config;
};
