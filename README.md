## Installation
```sh
npm install -g git+https://github.com/HeyMeXa/jscs-rules.git
```
## Configuration
Add to your `.jscs-json` the parameter `additionalRules` for a custom validation rules.
```
"additionalRules": [
    "/usr/local/lib/node_modules/jscs-rules/src/*.js"
],
```

And add the validation rule `requireFunctionsContent`.

```
"requireFunctionsContent": {
    "initialize": {
        "regexpText": "(this\\._super|origin\\.{functionName}|\\.prototype\\.{functionName})",
        "error": "required call method \"this._super\""
    },
    "_initProperties": {
        "regexpText": "(this\\._super|origin\\.{functionName}|\\.prototype\\.{functionName})",
        "error": "required call method \"this._super\""
    }
}
```
