var browserSync = require('browser-sync');

browserSync({
	server: "app",
	files: ["app/*.html", "app/css/*.css", "app/scripts/*.js", "app/templates/*.html"]
});