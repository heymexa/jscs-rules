var assert = require('assert');

module.exports = function () {
    /**
     * @param {JsFile} file
     * @param {string} text
     * @returns {{pos: number, line: number}|boolean}
     */
    function getTextPosition(file, text) {
        var lines = file.getLines();
        for (var i = 0, pos; i < lines.length; i++) {
            if ((pos = lines[i].indexOf(text)) > -1) {
                return {pos: pos, line: i + 1}
            }
        }
        return false;
    }

    /**
     * @param {boolean} option
     */
    this.configure = function (option) {
        assert(
            option === true,
            this.getOptionName() + ' option requires true value or should be removed'
        );
    };

    /**
     * @returns {string}
     */
    this.getOptionName = function () {
        return 'requireMixinDocumented';
    };

    /**
     * @param {JsFile} file
     * @param {Errors} errors
     */
    this.check = function (file, errors) {
        var fileSource = file.getSource(),
            matches = /(@(?:class|mixin)\s+\w+)[\s\S]*?\*\/\s+[\w\s=]+\.mix\(([\w\s,]+)\)/gi.exec(fileSource);
        if (!matches) {
            return;
        }
        var className = matches[1],
            mixins = matches[2].split(',');
        mixins.forEach(function (mixin) {
            mixin = mixin.trim();
            if (!getTextPosition(file, '@mixes ' + mixin)) {
                var classPosition = getTextPosition(file, className);
                errors.add('mixin ' + mixin + ' is not documented', classPosition.line, classPosition.pos);
            }
        }, this);
    };
};
