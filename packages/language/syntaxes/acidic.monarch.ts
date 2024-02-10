// Monarch syntax highlighting for the acidic language.
export default {
    keywords: [
        'Any','Asc','BigInt','Boolean','Bytes','ContextType','Date','DateTime','Decimal','Desc','FieldReference','Float','Int','Json','Mutation','Null','Object','Query','String','Subscription','Time','TransitiveFieldReference','Unsupported','abstract','attribute','baseUrl','datasource','enum','event','extend','extends','false','function','generator','import','in','model','owner','plugin','service','sort','true','type','view'
    ],
    operators: [
        '!','!=','&&',',','.',':',';','<','<=','=','==','>','>=','?','@','@@','@@@','^','_','||'
    ],
    symbols: /!|!=|&&|\(|\)|,|\.|:|;|<|<=|=|==|>|>=|\?|@|@@|@@@|\[|\]|\^|_|\{|\|\||\}/,

    tokenizer: {
        initial: [
            { regex: /null/, action: {"token":"NULL"} },
            { regex: /this/, action: {"token":"THIS"} },
            { regex: /[_a-zA-Z][\w_]*/, action: { cases: { '@keywords': {"token":"keyword"}, '@default': {"token":"ID"} }} },
            { regex: /"[^"]*"|'[^']*'/, action: {"token":"string"} },
            { regex: /[+-]?[0-9]+(\.[0-9]+)?/, action: {"token":"number"} },
            { regex: /\/\/\/[^\n\r]*/, action: {"token":"TRIPLE_SLASH_COMMENT"} },
            { include: '@whitespace' },
            { regex: /@symbols/, action: { cases: { '@operators': {"token":"operator"}, '@default': {"token":""} }} },
        ],
        whitespace: [
            { regex: /\s+/, action: {"token":"white"} },
            { regex: /\/\*/, action: {"token":"comment","next":"@comment"} },
            { regex: /\/\/[^\n\r]*/, action: {"token":"comment"} },
        ],
        comment: [
            { regex: /[^/\*]+/, action: {"token":"comment"} },
            { regex: /\*\//, action: {"token":"comment","next":"@pop"} },
            { regex: /[/\*]/, action: {"token":"comment"} },
        ],
    }
};
