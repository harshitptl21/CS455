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
        coverageReporter: {
            check: {
              global: { 
                functions: 75
              }
            }
        },
        reporters: ['progress', 'coverage'],
        browsers: ['ChromeHeadless'],
        singleRun: true
    });
};
