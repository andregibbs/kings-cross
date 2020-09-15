/**********************************************
 ===============================================
 **** The Almighty Handlebars Helpers File! ****
 ===============================================
 ***********************************************/

if (typeof module !== 'undefined') {
	module.exports.register = function (Handlebars) {

		/**
		 * If Divisible By
		 *        Returns back the options passed to it if the number passed to it is divisible by the input passed to it.
		 ***/
		Handlebars.registerHelper('if_divisible_by', function (number, input, options) {
			var fnTrue = options.fn,
				fnFalse = options.inverse;

			return input % number === 1 ? fnTrue(this) : fnFalse(this);
		});

		/**
		 * If Equals
		 *        Handlebars if with parameter value input.
		 ***/
		Handlebars.registerHelper('if_equals', function (v1, v2, options) {
			if (v1 === v2) {
				return options.fn(this);
			}
			return options.inverse(this);
		});

		/**
		 * Load Layout
		 *        Returns back one of the partials based on the slug & context (object data) passed to it
		 ***/
		Handlebars.registerHelper('load_layout', function (slug, json) {
			var fs = require("fs");

			var contents = fs.readFileSync('./src/data/' + json + ".json");
			var jsonContent = JSON.parse(contents);
			var loadedPartial = Handlebars.partials[slug];
			return new Handlebars.SafeString(loadedPartial(jsonContent));
		});

		/**
		 * JSON
		 *        Returns back JS object when passed in a Handlebars object
		 ***/
		Handlebars.registerHelper('json', function (context) {
			return JSON.stringify(context);
		});

    Handlebars.registerHelper('array', function (context) {
      return [context]
    })

		/**
		 * Object Length
		 *        Returns back length of object passed in.
		 ***/
		Handlebars.registerHelper("object_length", function (obj) {
			return Object.keys(obj).length;
		});

		/**
		 * Slugify
		 *      Returns slug version of string passed in
		 ***/
		Handlebars.registerHelper('slugify', function (str) {
			if (str) {
				var slug = str.replace(/[^\w\s]+/gi, '').replace(/ +/gi, '-');
				return slug.toLowerCase();
			}
			return '';
		});

		/**
		 * To Lower Case
		 *        Returns back the string passed in, in lower case
		 ***/
		Handlebars.registerHelper('to_lower_case', function (str) {
			if (str) {
				return str.toLowerCase();
			}
			return '';

		});

		Handlebars.registerHelper('if_eq', function (lvalue, rvalue, options) {
			if (arguments.length < 3)
				throw new Error("Handlebars Helper equal needs 2 parameters");
			if (lvalue != rvalue) {
				return options.inverse(this);
			} else {
				return options.fn(this);
			}
		});

		Handlebars.registerHelper('ifCond', function (v1, v2, options) {
			if (v1 === v2) {
				return options.fn(this);
			}
			return options.inverse(this);
		});

		Handlebars.registerHelper('times', function (n, block) {
			var accum = '';
			for (var i = 0; i < n; ++i)
				accum += block.fn(i);
			return accum;
		});

		Handlebars.registerHelper('dash', function (str) {
			return str.replace(" ", "-");
		});


		Handlebars.registerHelper('renderPartial', function (partialName, options) {
			if (!partialName) {
				console.error('No partial name given.');
				return '';
			}
			var partial = Handlebars.partials[partialName];
			if (!partial) {
				console.error('Couldnt find the compiled partial: ' + partialName);
				return '';
			}
			return new Handlebars.SafeString(partial(options.hash));
		});

    // Pad items to desired multiple
    Handlebars.registerHelper('spacerElements', function (items, divisible, opt) {
      var remainder = items.length % divisible;
      if (remainder > 0) {
        remainder = divisible - remainder
      }
      var results = '';
      for (var i = 0; i < remainder; i++) {
        results += opt.fn()
      }
      return results
    })

    // Pad items to desired multiple
    Handlebars.registerHelper('if_defined', function (v1, options) {
			if (v1 !== undefined) {
				return options.fn(this);
			}
			return options.inverse(this);
		});

    Handlebars.registerHelper({
        eq: (v1, v2) => v1 === v2,
        ne: (v1, v2) => v1 !== v2,
        lt: (v1, v2) => v1 < v2,
        gt: (v1, v2) => v1 > v2,
        lte: (v1, v2) => v1 <= v2,
        gte: (v1, v2) => v1 >= v2,
        and() {
            return Array.prototype.every.call(arguments, Boolean);
        },
        or() {
            return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
        }
    });

    // filters items for graduate fashion week, removes incatives
    Handlebars.registerHelper('gfw-filter', function(context) {
      context.items = context.items.filter((i) => {
        return i.active !== "false"
      })
      return context
    })

    // Splits a single array into an array of arrays containing 4 items.
    // Items are filled backwards so the first item array will try to contain the least items
    Handlebars.registerHelper('group-land-split', function(context) {
      let i, j, newArray = [], size = 4;
      context = context.reverse()
      for (i = 0, j = context.length; i < j; i += size) {
        newArray.push(context.slice(i, i + size).reverse())
      }
      return newArray.reverse()
    })


    /*
      Searches string for <a> links
      adds omni and ga tracking if not already present
    */
    Handlebars.registerHelper('addInlineLinkTracking', function(context, title) {
      // regexp to find any <a> links
      var regexp = /<a.*(?!(?:[^>]*?)(data-omni-type)|(data-omni)|(ga-ca)|(ga-la)).*>(.*)<\/a>/g
      // template for tracking action
      var actionTemplate = (title, action) => {
        action = action.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()
        return `uk:kings-cross:${title}:${action}`
      }
      // replace all link matches
      return context.replace(regexp, (m) => {
        let matches = regexp.exec(m)
        let tags = []
        // check if tags are missing, if so add
        if (!matches[1]) { // mising omni-type
          tags.push(`data-omni-type="microsite"`)
        }
        if (!matches[2]) { // missing omni
          tags.push(`data-omni="${actionTemplate(title, matches[5])}"`)
        }
        if (!matches[3]) { // missing ga-ca
          tags.push(`ga-ca="microsite"`)
        }
        if (!matches[4]) { //missing ga-la
          tags.push(`ga-la="${actionTemplate(title, matches[5])}"`)
        }
        // return match with additional tags
        return m.replace('<a',`<a ${tags.join(' ')}`)
      })
    })
  }
}
