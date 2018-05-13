# PostCSS Spacer

__PostCSS Spacer__ is a [PostCSS] plugin for normalising spaces between lines on your stylesheets.

Main features:
- Set the space before or after certain lines
- Define specific options for different types of lines
- Target only lines with specific patterns on them

## Installation

```bash
$ npm install postcss-spacer --save-dev
```

## Usage

This plugin runs as a [PostCSS] processor. To use it simply add it as a dependency on the `processors` option array in the `postcss` task.

### Syntax

This plugin can be used with pure CSS, SCSS, Sass or even Less. Pure CSS is supported by [PostCSS] natively, however to work with SCSS, Sass or Less you'll need to use a custom syntax parser such as:

- __SCSS__: [`postcss-scss`]
- __Sass__: [`sugarss`]
- __Less__: [`postcss-less`]

Note: to use a syntax parser you'll have to set it as a dependency (`require()`) on the `syntax` option of [PostCSS] like this, for example:

```js
grunt.initConfig({
    postcss: {
      options: {
        processors: [
          require('postcss-spacer')({ /* plugin options */ })
        ],
        syntax: require('sugarss')
      },
    }
});
```

### Grunt:

To run the `postcss` properly in Grunt its suggested to use [`grunt-postcss`] as a dependency.

```js
grunt.initConfig({
    postcss: {
      options: {
        processors: [
          require('postcss-spacer')({ /* plugin options */ })
        ]
      },
      dist: {
        src: '*.css'
      }
    }
});

grunt.loadNpmTasks('grunt-postcss');
```

## Options

This plugin analyses the types of lines on your `dist` files and fixes their spacing size according to the options you set.

### Line Types

Each line type is an option property in itself, which receives an object with a certain set of options for that specific file type.

In this example the `comments` handle is used as the key and its value is a set of options that adds 4 lines `before` and 2 lines `after` each comment:

```js
grunt.initConfig({
    postcss: {
      options: {
        processors: [
          require('postcss-spacer')({
            'comments': {
              before: 4,
              after: 2
            }
          })
        ]
      },
    }
});
```

Supported line types:

- `all` (object) : targets all types of lines
- `comments` (object) : targets comments held within `/**/`
- `rules` (object) : targets CSS rules
- `declarations` (object) : targets CSS declarations
- `at-rules` (object) : targets CSS at-rules

### Line Options

- `before` (number) : **false** : adds empty lines before the target line
- `after` (number) : **false** : adds empty lines after the target line

Example: 

__JS__
```js
'comments': {
  before: 4,
  after: 2
},
```

__CSS__

Before:
```css
/* ===== MAIN STYLES ===== */
body{
  background: #fff
}
```

After:
```css




/* ===== MAIN STYLES ===== */


body{
  background: #fff
}
```

Note: adding `0` as a value on any of the above options will remove the empty lines on that specific area of a line.

### Patterns

If `pattern` is defined, each line of the defined line type will be analysed and if any defined pattern (string) is found, the options are run

- `pattern` (array) : **false** : array of patterns to target

Example:

__JS__
```js
'comments': {
  pattern: ['====='],
  after: 2
},
```

__CSS__

Before:
```css
/* ===== MAIN STYLES ===== */
body{
  background: #fff
}
```

After:
```css
/* ===== MAIN STYLES ===== */


body{
  background: #fff
}
```

## Debug

By default, after each process a summary is displayed with the number of lines that were changed and how many patterns were identified.

- `debug` (boolean) : **false** : enables debug mode, which logs each line that was targeted by the process and how many patterns were identified in it. In the end of each line type report a comprehensive summary is also displayed. This mode will help the user identify why weren't certain lines targeted in the process and what the process is actually doing.

Each line type can hold its one `debug` mode, like so:

```js
'comments': {
  pattern: ['====='],
  after: 2,
  debug: true
},
```

## Upcoming Features

- **More flexible debug mode**: If you just want to run the debug process on all of the line types at once, you can set it on the `all` handle, for example:

## Changelog

- **[v0.0.3]** **More verbose error messages**: Error messages should be spot on the issue that is causing the process to fail.
- **[v0.0.2]** **Break task when error occurs**: When an error is found on the process, or something went wrong, the task should break.
- **[v0.0.1]** Initial release.

```js
'all': {
  debug: true
},
'comments': {
  pattern: ['====='],
  after: 2
},
```

[PostCSS]: https://github.com/postcss/postcss
[`postcss-sorting`]: https://github.com/hudochenkov/postcss-sorting
[`postcss-scss`]: https://github.com/postcss/postcss-scss
[`postcss-less`]: https://github.com/shellscape/postcss-less
[`grunt-postcss`]: https://github.com/nDmitry/grunt-postcss
[`sugarss`]: https://github.com/postcss/sugarss