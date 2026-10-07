/* Cloud Toolkit app: tabs, cost estimator, naming generator UI, easter egg. */
(function () {
  'use strict';

  var PRICING = {
    asOf: 'Oct 6, 2026',
    bqOnDemandPerTB: 6.25,      // USD per TB scanned
    bqFreeTB: 1,                // first TB per month free
    bqSlotPerHour: 0.04,        // Standard edition
    bqStoragePerGB: 0.02,       // active storage
    synapsePerTB: 5.00,         // serverless SQL pool, USD per TB processed
    hoursPerMonth: 730,
    bubbleTeaUSD: 5
  };

  function $(id) { return document.getElementById(id); }

  function money(n) {
    return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  var toastTimer = null;
  function toast(msg) {
    var t = $('toast');
    t.textContent = msg;
    t.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); }, 2600);
  }

  /* ---------- tabs ---------- */
  var tabBtns = document.querySelectorAll('.tab');
  tabBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      tabBtns.forEach(function (b) {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      document.querySelectorAll('.panel').forEach(function (p) { p.hidden = true; p.classList.remove('active'); });
      var panel = $('panel-' + btn.dataset.tab);
      panel.hidden = false;
      panel.classList.add('active');
    });
  });

  /* ---------- cost estimator ---------- */
  var tbSlider = $('tbSlider'), tbNumber = $('tbNumber'), tbDisplay = $('tbDisplay');
  var bqSlots = $('bqSlots'), bqStorage = $('bqStorage');

  function readNum(el, fallback) {
    var v = parseFloat(el.value);
    return (isFinite(v) && v >= 0) ? v : fallback;
  }

  function estimate() {
    var tb = readNum(tbNumber, 0);
    var slots = Math.floor(readNum(bqSlots, 0));
    var storageTB = readNum(bqStorage, 0);

    tbDisplay.textContent = tb;
    if (document.activeElement !== tbSlider) tbSlider.value = Math.min(tb, 500);
    if (document.activeElement !== tbNumber && parseFloat(tbNumber.value) !== tb) tbNumber.value = tb;

    var empty = $('costEmpty'), results = $('costResults');
    if (tb <= 0 && slots <= 0 && storageTB <= 0) {
      empty.hidden = false;
      results.hidden = true;
      return;
    }
    empty.hidden = true;
    results.hidden = false;

    var billableTB = Math.max(0, tb - PRICING.bqFreeTB);
    var bqCompute = billableTB * PRICING.bqOnDemandPerTB;
    var bqStorageCost = storageTB * 1024 * PRICING.bqStoragePerGB;
    var bqSlotsCost = slots * PRICING.bqSlotPerHour * PRICING.hoursPerMonth;
    var bqTotal = bqCompute + bqStorageCost + bqSlotsCost;
    var synTotal = tb * PRICING.synapsePerTB;

    $('bqTotal').textContent = money(bqTotal);
    $('synTotal').textContent = money(synTotal);

    var max = Math.max(bqTotal, synTotal, 0.01);
    $('bqBar').style.width = (bqTotal / max * 100).toFixed(1) + '%';
    $('synBar').style.width = (synTotal / max * 100).toFixed(1) + '%';

    var bqLines = [];
    if (tb > 0) {
      bqLines.push(['<span>On-demand scan (' + tb + ' TB' + (tb <= 1 ? ', free tier covers it' : ' minus 1 TB free') + ')</span>', '<span>' + money(bqCompute) + '</span>']);
    }
    if (slots > 0) bqLines.push(['<span>' + slots + ' slots x 730h @ $0.04</span>', '<span>' + money(bqSlotsCost) + '</span>']);
    if (storageTB > 0) bqLines.push(['<span>' + storageTB + ' TB active storage</span>', '<span>' + money(bqStorageCost) + '</span>']);
    $('bqBreakdown').innerHTML = bqLines.map(function (l) { return '<li>' + l[0] + l[1] + '</li>'; }).join('');

    var synLines = [];
    if (tb > 0) synLines.push(['<span>Data processed (' + tb + ' TB @ $5)</span>', '<span>' + money(synTotal) + '</span>']);
    else synLines.push(['<span>No scans, no bill. Beautiful.</span>', '<span>$0.00</span>']);
    $('synBreakdown').innerHTML = synLines.map(function (l) { return '<li>' + l[0] + l[1] + '</li>'; }).join('');

    var verdict = $('verdict');
    if (tb > 0) {
      if (bqCompute < synTotal) {
        var pct = ((synTotal - bqCompute) / synTotal * 100).toFixed(0);
        verdict.textContent = 'For pure scan cost, BigQuery on-demand comes out about ' + pct + '% cheaper here. Synapse bills every terabyte with no free tier, so small workloads feel it.';
      } else if (synTotal < bqCompute) {
        var pct2 = ((bqCompute - synTotal) / bqCompute * 100).toFixed(0);
        verdict.textContent = 'For pure scan cost, Synapse serverless comes out about ' + pct2 + '% cheaper here. Once you pass the free terabyte, BigQuery charges more per TB.';
      } else {
        verdict.textContent = 'A perfect tie on scan cost. Pick based on where the rest of your stack lives.';
      }
    } else {
      verdict.textContent = 'No scans this month, so compute is free on both sides. Storage and slots are where the money hides.';
    }

    var teas = Math.round(Math.max(bqTotal, synTotal) / PRICING.bubbleTeaUSD);
    $('boba').innerHTML = 'That is roughly <strong>' + teas.toLocaleString('en-US') + ' bubble teas</strong> a month. Choose wisely.';
  }

  tbSlider.addEventListener('input', function () { tbNumber.value = tbSlider.value; estimate(); });
  tbNumber.addEventListener('input', estimate);
  bqSlots.addEventListener('input', estimate);
  bqStorage.addEventListener('input', estimate);

  /* ---------- naming generator ---------- */
  var Naming = window.CloudNaming;
  var state = { cloud: 'azure', ruleId: 'azure-storage', name: '' };

  function renderChips() {
    var wrap = $('resourceChips');
    wrap.innerHTML = '';
    Naming.rulesForCloud(state.cloud).forEach(function (rule) {
      var b = document.createElement('button');
      b.className = 'chip' + (rule.id === state.ruleId ? ' active' : '');
      b.textContent = rule.label;
      b.addEventListener('click', function () {
        state.ruleId = rule.id;
        renderChips();
        refreshName();
      });
      wrap.appendChild(b);
    });
  }

  function refreshName() {
    var rule = Naming.getRule(state.ruleId);
    $('resourceHint').textContent = rule.blurb;
    var prefix = $('prefixInput').value;
    var name = prefix.trim() ? Naming.generate(state.ruleId, prefix) : '';
    if (!name) {
      // validate a placeholder-free state: show rules against empty input
      renderValidation(rule, '');
      $('generatedName').textContent = 'type a prefix to begin';
      state.name = '';
      return;
    }
    state.name = name;
    $('generatedName').textContent = name;
    renderValidation(rule, name);
  }

  function renderValidation(rule, name) {
    var list = $('ruleList');
    list.innerHTML = '';
    rule.checks.forEach(function (c) {
      var ok = false;
      try { ok = !!c.test(name); } catch (e) { ok = false; }
      var li = document.createElement('li');
      li.className = ok ? 'ok' : 'fail';
      var label = document.createElement('span');
      label.textContent = ok ? 'Looks good.' : 'Needs work.';
      var msg = document.createElement('span');
      msg.className = 'rule-msg';
      msg.textContent = c.msg(name);
      li.appendChild(label);
      li.appendChild(msg);
      list.appendChild(li);
    });
  }

  document.querySelectorAll('.seg').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.seg').forEach(function (b) {
        b.classList.remove('active');
        b.setAttribute('aria-checked', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-checked', 'true');
      state.cloud = btn.dataset.cloud;
      state.ruleId = Naming.rulesForCloud(state.cloud)[0].id;
      renderChips();
      refreshName();
    });
  });

  $('prefixInput').addEventListener('input', refreshName);
  $('regenBtn').addEventListener('click', function () {
    if (!$('prefixInput').value.trim()) {
      toast('Give me a prefix first, any word will do.');
      $('prefixInput').focus();
      return;
    }
    refreshName();
    toast('Fresh suffix minted.');
  });
  $('copyBtn').addEventListener('click', function () {
    if (!state.name) {
      toast('Nothing to copy yet.');
      return;
    }
    function done() { toast('Copied. Go forth and deploy.'); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(state.name).then(done, function () { fallbackCopy(); });
    } else {
      fallbackCopy();
    }
    function fallbackCopy() {
      var ta = document.createElement('textarea');
      ta.value = state.name;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); done(); }
      catch (e) { toast('Copy failed, select it manually.'); }
      document.body.removeChild(ta);
    }
  });

  /* ---------- easter egg: click the status dot 5 times ---------- */
  var clicks = 0, clickTimer = null;
  $('statusDot').addEventListener('click', function () {
    clicks++;
    if (clickTimer) clearTimeout(clickTimer);
    clickTimer = setTimeout(function () { clicks = 0; }, 2000);
    if (clicks === 5) {
      clicks = 0;
      toast('Achievement unlocked: Professional Button Clicker. Your cloud bill remains unchanged.');
    }
  });

  /* ---------- init ---------- */
  renderChips();
  refreshName();
  estimate();
})();
