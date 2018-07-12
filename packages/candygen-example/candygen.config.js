module.exports = {  
  init: function () {
    return {
      schemaVersion: '1.0',
      
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
