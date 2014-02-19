var assert = require('assert');

module.exports = function () {
};

module.exports.prototype = {

    configure: function (option) {
        assert(
            typeof option === 'object',
            'requireFunctionsContent option requires object value'
        );
        assert(
            Array.isArray(option.functionNames),
            'property requireFunctionsContent.functionNames requires array value'
        );
        assert(
            typeof option.regexpText === 'string' && new RegExp(option.regexpText),
            'property requireFunctionsContent.regexpText requires string value'
        );

        this._functionNames = {};
        for (var i = 0, l = option.functionNames.length; i < l; i++) {
            this._functionNames[option.functionNames[i]] = true;
        }

        this._regexpText = option.regexpText;
    },

    getOptionName: function () {
        return 'requireFunctionsContent';
    },

    check: function (file, errors) {
        var fileSource = file.getSource(),
            functionNames = this._functionNames,
            regexpText = this._regexpText;
        file.iterateNodesByType([ 'FunctionDeclaration', 'FunctionExpression' ], function (node) {
            if (node.parentNode.key && node.parentNode.key.name) {
                var functionName = node.parentNode.key.name;
                if (functionNames[functionName]) {
                    var range = node.parentNode.value.body.range,
                        functionBody = fileSource.substring(range[0], range[1]),
                        regexp = new RegExp(regexpText.replace(/{functionName}/g, functionName));
                    if (!regexp.test(functionBody)) {
                        errors.add('require functions content', node.loc.start.line, 0);
                    }
                }
            }
        });
    }
};