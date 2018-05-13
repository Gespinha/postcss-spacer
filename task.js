var postcss = require('postcss');

module.exports = postcss.plugin('spacer', function spacer(options) {
  "use strict";

  return function (css) {

    // default options
    var defaultOptions = {
      'all': {
        pattern: false,
        before: false,
        after: false,
        debug: false
      },
      'comments': {
        pattern: false,
        before: false,
        after: 1,
        debug: false
      },
      'rules': {
        pattern: false,
        before: false,
        after: 1,
        debug: false
      },
      'declarations': {
        pattern: false,
        before: false,
        after: false,
        debug: false
      },
      'at-rules': {
        pattern: false,
        before: false,
        after: 1,
        debug: false
      }
    };

    options = options || defaultOptions;
    var updateCount = 0;

    var logColors = {
      reset: "\x1b[0m",
      cyan: "\x1b[36m"
    };

    var typeMethods = {
      'all': 'walk',
      'comments': 'walkComments',
      'rules': 'walkRules',
      'declarations': 'walkDecls',
      'at-rules': 'walkAtRules'
    };

    // status logs
    function statusLog(type, count, pattern, debug){
      type = type === 'all' ? 'rules' : type;
      type = count === 1 ? type.slice(0, -1) : type;

      var patternCount = !pattern ? false : pattern.length,
          message = '';

      if(debug){
        // totals log
        message += logColors.cyan + '==== TOTALS ====' + logColors.reset + '\n';
        message += 'Lines type: ' + type + '\n';
        message += 'Lines updated: ' + count + '\n';
        if(patternCount){
          message += 'Patterns found: ' + patternCount + '\n';
        }
        message += logColors.cyan + '================' + logColors.reset;
      } else {
        // line type log
        message += 'Updated ' + count + ' ' + type;
        if(patternCount){
          message += ' from ' + patternCount + ' pattern' + (patternCount === 1 ? '' : 's');
        }
      }
      return console.log(message);
    }

    // debug mode log
    function debugLog(line, activePatterns){
      var message = line.toString() + '\n';

      if(activePatterns){
        message += 'Patterns: ' + activePatterns + '\n';
      }

      return console.log(logColors.cyan + '-> ' + logColors.reset + message);
    }

    // add line space
    function addLineSpace(type, position){
      return new Array(options[type][position] + 2).join('\n');
    }

    // update lines
    function updateLine(type, line, pattern){
      var lineBefore = options[type].before,
          lineAfter = options[type].after;

      if((lineBefore || lineBefore === 0) && css.nodes[0] !== line){
        line.raws.before = lineBefore === 0 ? '\n' : addLineSpace(type, 'before');
      }
      if((lineAfter || lineAfter === 0) && line.next() !== undefined){
        line.next().raws.before = lineAfter === 0 ? '\n' : addLineSpace(type, 'after');
      }

      if(!pattern && options[type].debug){
        debugLog(line, false);
      }
      return updateCount++;
    }

    // update line with patterns
    function updateLinePattern(type, line, pattern){
      var patternCount = 0;

      for(var i = 0; i < pattern.length; i++){
        if(line.toString().indexOf(pattern[i]) > -1){
          patternCount++;
          updateLine(type, line, pattern);

          if(options[type].debug){
            debugLog(line, patternCount);
          }
        }
      }
      return;
    }

    // type process
    function typeProcess(type, pattern){
      if(options[type].debug){
        console.log('\n' + logColors.cyan + '==== CHANGED ' + type.toUpperCase() + ' ====' + logColors.reset);
      }

      css[typeMethods[type]](function(comment){
        if(pattern){
          updateLinePattern(type, comment, pattern);
        } else {
          updateLine(type, comment, false);
        }
      });
      statusLog(type, updateCount, pattern, options[type].debug);
    }

    // global process
    function globalProcess(type){
      var pattern = options[type].pattern;

      if(!pattern && typeMethods.hasOwnProperty(type)){
        // if all good
        typeProcess(type, false);
      } else if(Array.isArray(pattern) && pattern.length > 0 && typeMethods.hasOwnProperty(type)){
        // if didn't find the pattern
        typeProcess(type, pattern);
      }
    }

    // run all processes
    var validProcesses = Object.keys(defaultOptions),
        activeProcesses = Object.keys(options);

    function checkOptions(type, opts){
      var validOptions = Object.getOwnPropertyNames(defaultOptions[type]);

      for(var i = 0; i < opts.length; i++){
        if(validOptions.indexOf(opts[i]) < 0){
          throw new Error('"' + opts[i] + '" is not a valid parameter for the "' + type + '" line type object');
        }
      }
    }

    for(var i = 0; i < activeProcesses.length; i++){
      var currProcess = activeProcesses[i],
          setOptions = Object.keys(options[currProcess]);

      // if process is valid
      if(validProcesses.indexOf(currProcess) > -1){
        // check if properties are valid
        checkOptions(currProcess, setOptions);
        // run process
        globalProcess(currProcess);
      } else {
        throw new Error('"' + currProcess + '" is not a valid line type object');
      }
    }
  }
});