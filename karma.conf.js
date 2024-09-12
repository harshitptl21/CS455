module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        files: [
            'Game/**/*.js',
            'spec/**/*.js' // Adjust this to include your tests
        ],
        reporters: ['progress'],
        browsers: ['ChromeHeadless'],
        singleRun: true
    });
};
