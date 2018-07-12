module.exports = {  
  init: function () {
    return {
      schemaVersion: '1.0',
      outputPath: '/Users/turan/gh/candyland/candygen/packages/candygen-example/output',
      
      rules: [
        {
          template: 'templates/index.hbs',
          script: 'scripts/prepare-index.js',
          data: 'data/posts.json',
          output: 'index.html'
        }
      ],

      partials: [
        {
          name: 'header',
          template: 'templates/partials/header.hbs'
        }
      ]
    }
  }
};
