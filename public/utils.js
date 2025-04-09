function once (callback) {
    let called = false;
    return () => { if (called) return false; called = true; callback(); return true; };
}

function toText (obj) { return JSON.stringify(obj); }
function parse (str) { return JSON.parse(str); }

