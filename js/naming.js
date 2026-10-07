/* Cloud Toolkit: cloud resource naming rules.
 * Real naming constraints for Azure and GCP resources, encoded as data.
 * Works in the browser (sets window.CloudNaming) and in Node (module.exports).
 */
(function (root, factory) {
  var api = factory();
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    root.CloudNaming = api;
  }
})(typeof self !== 'undefined' ? self : this, function () {

  function check(test, msg) { return { test: test, msg: msg }; }

  var RULES = [
    {
      id: 'azure-storage', cloud: 'azure', label: 'Storage account',
      blurb: 'Globally unique across all of Azure. Good luck, be creative.',
      min: 3, max: 24, allowUpper: false, extra: '', joiner: '', wordSep: '',
      checks: [
        check(function (n) { return n.length >= 3 && n.length <= 24; },
          function (n) { return 'Use 3 to 24 characters (yours has ' + n.length + ').'; }),
        check(function (n) { return /^[a-z0-9]+$/.test(n); },
          function () { return 'Lowercase letters and numbers only. No hyphens, no capitals, no exceptions.'; })
      ]
    },
    {
      id: 'azure-resource-group', cloud: 'azure', label: 'Resource group',
      blurb: 'The junk drawer of Azure. Name it like you will find it later.',
      min: 1, max: 90, allowUpper: true, extra: '._\\-()', joiner: '-', wordSep: '-',
      checks: [
        check(function (n) { return n.length >= 1 && n.length <= 90; },
          function (n) { return 'Use 1 to 90 characters (yours has ' + n.length + ').'; }),
        check(function (n) { return /^[A-Za-z0-9._\-()]+$/.test(n); },
          function () { return 'Letters, numbers, periods, underscores, hyphens and parentheses only.'; }),
        check(function (n) { return !/\.$/.test(n); },
          function () { return 'Cannot end with a period.'; })
      ]
    },
    {
      id: 'azure-vm', cloud: 'azure', label: 'Virtual machine (Linux)',
      blurb: 'Your VM deserves better than vm-final-v2-REAL.',
      min: 1, max: 64, allowUpper: true, extra: '\\-', joiner: '-', wordSep: '-',
      checks: [
        check(function (n) { return n.length >= 1 && n.length <= 64; },
          function (n) { return 'Use 1 to 64 characters (yours has ' + n.length + ').'; }),
        check(function (n) { return /^[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9]$|^[A-Za-z0-9]$/.test(n); },
          function () { return 'Letters, numbers and hyphens only, and it cannot start or end with a hyphen.'; })
      ]
    },
    {
      id: 'azure-vnet', cloud: 'azure', label: 'Virtual network',
      blurb: 'The plumbing. Name it clearly or future-you will be confused.',
      min: 2, max: 64, allowUpper: true, extra: '._\\-', joiner: '-', wordSep: '-',
      checks: [
        check(function (n) { return n.length >= 2 && n.length <= 64; },
          function (n) { return 'Use 2 to 64 characters (yours has ' + n.length + ').'; }),
        check(function (n) { return /^[A-Za-z0-9._\-]+$/.test(n); },
          function () { return 'Letters, numbers, hyphens, underscores and periods only.'; }),
        check(function (n) { return !/^[-.]/.test(n) && !/[-.]$/.test(n); },
          function () { return 'Cannot start or end with a hyphen or period.'; })
      ]
    },
    {
      id: 'gcp-bq-dataset', cloud: 'gcp', label: 'BigQuery dataset',
      blurb: 'Where your tables live. Underscores are your friends here.',
      min: 1, max: 1024, allowUpper: false, extra: '_', joiner: '_', wordSep: '_',
      checks: [
        check(function (n) { return n.length >= 1 && n.length <= 1024; },
          function (n) { return 'Use 1 to 1024 characters (yours has ' + n.length + ').'; }),
        check(function (n) { return /^[a-z_][a-z0-9_]*$/.test(n); },
          function () { return 'Lowercase letters, numbers and underscores only, and it must start with a letter or underscore.'; })
      ]
    },
    {
      id: 'gcp-bucket', cloud: 'gcp', label: 'Cloud Storage bucket',
      blurb: 'Globally unique, like a good username in 2004.',
      min: 3, max: 63, allowUpper: false, extra: '._\\-', joiner: '-', wordSep: '-',
      checks: [
        check(function (n) { return n.length >= 3 && n.length <= 63; },
          function (n) { return 'Use 3 to 63 characters (yours has ' + n.length + ').'; }),
        check(function (n) { return /^[a-z0-9._\-]+$/.test(n); },
          function () { return 'Lowercase letters, numbers, hyphens, underscores and dots only.'; }),
        check(function (n) { return /^[a-z0-9]/.test(n) && /[a-z0-9]$/.test(n); },
          function () { return 'Must start and end with a letter or number.'; }),
        check(function (n) { return !/\.\./.test(n); },
          function () { return 'No consecutive dots allowed.'; }),
        check(function (n) { return !/^\d{1,3}(\.\d{1,3}){3}$/.test(n); },
          function () { return 'Cannot look like an IP address (e.g. 192.168.0.1).'; })
      ]
    },
    {
      id: 'gcp-function', cloud: 'gcp', label: 'Cloud Function',
      blurb: 'Small code, big responsibility. Keep the name tidy.',
      min: 1, max: 63, allowUpper: false, extra: '\\-', joiner: '-', wordSep: '-',
      checks: [
        check(function (n) { return n.length >= 1 && n.length <= 63; },
          function (n) { return 'Use 1 to 63 characters (yours has ' + n.length + ').'; }),
        check(function (n) { return /^[a-z][a-z0-9\-]*[a-z0-9]$|^[a-z]$/.test(n); },
          function () { return 'Lowercase letters, numbers and hyphens. Must start with a letter and end with a letter or number.'; })
      ]
    },
    {
      id: 'gcp-vm', cloud: 'gcp', label: 'Compute Engine VM',
      blurb: 'RFC 1035 compliant, which is a fancy way of saying no funny business.',
      min: 1, max: 63, allowUpper: false, extra: '\\-', joiner: '-', wordSep: '-',
      checks: [
        check(function (n) { return n.length >= 1 && n.length <= 63; },
          function (n) { return 'Use 1 to 63 characters (yours has ' + n.length + ').'; }),
        check(function (n) { return /^[a-z][a-z0-9\-]*[a-z0-9]$|^[a-z]$/.test(n); },
          function () { return 'Lowercase letters, numbers and hyphens. Must start with a letter and end with a letter or number.'; })
      ]
    }
  ];

  function getRule(id) {
    for (var i = 0; i < RULES.length; i++) {
      if (RULES[i].id === id) return RULES[i];
    }
    return null;
  }

  function rulesForCloud(cloud) {
    return RULES.filter(function (r) { return r.cloud === cloud; });
  }

  // Returns an array of human-readable failure messages. Empty means valid.
  function validate(ruleId, name) {
    var rule = getRule(ruleId);
    if (!rule) return ['Unknown resource type.'];
    var failures = [];
    for (var i = 0; i < rule.checks.length; i++) {
      var c = rule.checks[i];
      var ok = false;
      try { ok = !!c.test(name); } catch (e) { ok = false; }
      if (!ok) failures.push(c.msg(name));
    }
    return failures;
  }

  function randomSuffix(len) {
    var chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var out = '';
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      var buf = new Uint32Array(len);
      crypto.getRandomValues(buf);
      for (var i = 0; i < len; i++) out += chars[buf[i] % chars.length];
    } else {
      for (var j = 0; j < len; j++) out += chars[Math.floor(Math.random() * chars.length)];
    }
    return out;
  }

  function sanitize(prefix, rule) {
    var s = (prefix || '').trim();
    if (!rule.allowUpper) s = s.toLowerCase();
    var charClass = rule.allowUpper ? 'A-Za-z0-9' : 'a-z0-9';
    var allowed = new RegExp('[^' + charClass + (rule.extra || '') + ']', 'g');
    var sep = rule.wordSep === undefined ? '-' : rule.wordSep;
    s = s.replace(allowed, sep);
    if (sep) {
      var dup = new RegExp(sep.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '+', 'g');
      s = s.replace(dup, sep);
    }
    return s;
  }

  function stripBadEdges(name, rule) {
    var startOk = rule.allowUpper ? /^[A-Za-z0-9]/ : /^[a-z0-9]/;
    var endOk = rule.allowUpper ? /[A-Za-z0-9]$/ : /[a-z0-9]$/;
    while (name.length > 1 && !startOk.test(name)) name = name.slice(1);
    while (name.length > 1 && !endOk.test(name)) name = name.slice(0, -1);
    return name;
  }

  // Builds a compliant name from a freeform prefix plus a random suffix.
  function generate(ruleId, prefix) {
    var rule = getRule(ruleId);
    if (!rule) return '';
    var base = sanitize(prefix, rule);
    if (!/^[A-Za-z0-9]/.test(base)) base = 'lab' + (base ? '-' + base : '');
    base = stripBadEdges(base, rule) || 'lab';
    var suffixLen = Math.max(4, rule.min - base.length - 1);
    var suffix = randomSuffix(suffixLen);
    var joiner = rule.joiner === undefined ? '-' : rule.joiner;
    var name = (base + joiner + suffix).slice(0, rule.max);
    name = stripBadEdges(name, rule);
    if (name.length < rule.min) {
      name = (name + randomSuffix(rule.min - name.length)).slice(0, rule.max);
    }
    // BigQuery datasets cannot contain hyphens, swap any strays.
    if (rule.id === 'gcp-bq-dataset') name = name.replace(/-/g, '_');
    return name;
  }

  return {
    RULES: RULES,
    getRule: getRule,
    rulesForCloud: rulesForCloud,
    validate: validate,
    generate: generate
  };
});
