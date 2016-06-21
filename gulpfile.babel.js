import gulp from 'gulp';
import babel from 'gulp-babel';
import del from 'del';

gulp.task('clean', () => del('lib'));

gulp.task('build', ['clean'], () => {
    return gulp.src('src/**/*.js').pipe(babel()).pipe(gulp.dest('lib'));
});