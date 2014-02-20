var assert = require('assert');

module.exports = function () {
};

module.exports.prototype = {

    configure: function (option) {
        assert(
            typeof option === 'object',
            'requireFunctionsContent option requires object value'
        );

        this._functions = option;
    },

    getOptionName: function () {
        return 'requireFunctionsContent';
    },

    check: function (file, errors) {
        var fileSource = file.getSource(),
            functions = this._functions;
        file.iterateNodesByType([ 'FunctionDeclaration', 'FunctionExpression' ], function (node) {
            if (node.parentNode.key && node.parentNode.key.name) {
                var functionName = node.parentNode.key.name,
                    functionOptions = functions[functionName];
                if (functionOptions) {
                    var range = node.parentNode.value.body.range,
                        functionBody = fileSource.substring(range[0], range[1]),
                        regexp = new RegExp(functionOptions.regexpText.replace(/{functionName}/g, functionName));
                    if (!regexp.test(functionBody)) {
                        errors.add(functionOptions.error, node.loc.start.line, 0);
                    }
                }
            }
        });
    }
};
