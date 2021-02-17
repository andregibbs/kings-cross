// think this file is being loaded from gulp via the partials template glob

var fs = require("fs")

module.exports.register = function (Handlebars) {
  Handlebars.registerHelper('recipeTemplate', function (data) {
    var template = Handlebars.compile(fs.readFileSync(__dirname + '/recipe.hbs', 'utf8'));

    // console.log('recipeParser', data)

    data.kv = {
      media: {
        type: data.video ? "video" : "image",
        content: data.video ? data.video.id : data.image,
        poster: data.video ? data.image : ""
      },
      style: {
        desktop: "top",
        mobile: "top"
      },
      components: [
        {
          type: "headline",
          copy: data.name
        }
      ]
    }

    // console.log(data)
    return new Handlebars.SafeString(template(data));
  });
}
