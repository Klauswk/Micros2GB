const gulp = require('gulp');
const clean = require('gulp-clean');
const electronPackager = require('electron-packager');
 
gulp.task('clean', function () {
    return gulp.src('hminodejs', {read: false})
        .pipe(clean());
});

gulp.task('copy', () => {
    return gulp.src(['electron/**/*']).pipe(gulp.dest('hminodejs'))
});

gulp.task('build', function() {
    return gulp.src(['*app/**/*','*bower_components/**/*','*node_modules/**/*','package.json'])
    .pipe(gulp.dest('hminodejs/resources/app'));
});

gulp.task('package',['build'],function() {
    electronPackager({dir:"hminodejs/resources/app/",prune:false, tmpdir:false, overwrite:true,name:"IHM"})
      .then((appPaths) => { 
          console.log("Build complete");
      })
});
