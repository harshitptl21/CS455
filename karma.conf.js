module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        files: [
            'Game/**/*.js',
            'spec/**/*.js' // Adjust this to include your tests
        ],
        preprocessors: {
            'Game/**/*.js': ['coverage']
        },
        reporters: ['progress', 'coverage'],
        browsers: ['ChromeHeadless'],
        singleRun: true
    });
};
