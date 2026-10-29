// 页面交互逻辑
(function () {
  'use strict';

  const $ = function (id) { return document.getElementById(id); };

  // ---------- Tab 切换 ----------
  document.querySelectorAll('.tab').forEach(function (t) {
    t.addEventListener('click', function () {
      document.querySelectorAll('.tab').forEach(function (x) { x.classList.remove('active'); });
      document.querySelectorAll('.panel').forEach(function (x) { x.classList.remove('active'); });
      t.classList.add('active');
      $('tab-' + t.dataset.tab).classList.add('active');
      if (t.dataset.tab === 'ref') renderRef();
    });
  });

  // ---------- 复制 ----------
  function copyText(text, btn) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        flash(btn, '已复制 ✓');
      }).catch(function () { fallbackCopy(text, btn); });
    } else { fallbackCopy(text, btn); }
  }
  function fallbackCopy(text, btn) {
    const ta = document.createElement('textarea');
    ta.value = text; document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); flash(btn, '已复制 ✓'); }
    catch (e) { flash(btn, '复制失败'); }
    document.body.removeChild(ta);
  }
  function flash(btn, msg) {
    const old = btn.textContent;
    btn.textContent = msg;
    setTimeout(function () { btn.textContent = old; }, 1200);
  }

  // ---------- 渲染结果 ----------
  function renderResult(r) {
    const box = $('result');
    box.classList.remove('hidden');
    if (!r.matched && !r.command) {
      let html = '<div class="result-card low"><div class="exp">未能识别该需求。';
      if (window.HOI4LLM.isEnabled()) {
        html += '正在调用大模型兜底…</div></div>';
        box.innerHTML = html;
        return true; // 由调用方继续 LLM
      }
      html += '请在右上角“设置”中启用大模型兜底，或到“指令大全”手动查找。</div>';
      html += '<div class="note">提示：可尝试更具体的说法，如“给伊朗加 10000 钢”“吞并日本”“切换美国”。</div></div>';
      box.innerHTML = html;
      return false;
    }
    const isLLM = r.source === 'llm';
    const low = (!isLLM && r.confidence < 0.5) || (!r.matched);
    let badge = '<span class="badge ok">规则匹配</span>';
    if (isLLM) badge = '<span class="badge llm">大模型生成</span>';
    else if (low) badge = '<span class="badge low">仅供参考</span>';

    let html = '<div class="result-card ' + (isLLM ? 'llm' : (low ? 'low' : '')) + '">';
    html += '<div class="exp">' + (r.explanation || '已生成指令。') + '</div>';
    html += '<div class="cmd-line"><span class="cmd-text" id="cmdText">' + escapeHtml(r.command) + '</span>' +
      '<button class="copy-btn" id="copyCmd">复制</button></div>';
    html += '<div class="meta">' + badge + (r.name ? '<span>指令：' + r.name + '</span>' : '') +
      (r.confidence ? '<span>置信度：' + Math.round(r.confidence * 100) + '%</span>' : '') + '</div>';
    if (r.needs && r.needs.length) {
      html += '<div class="needs">需补充：' + r.needs.join('；') + '</div>';
    }
    if (r.note) html += '<div class="note">' + r.note + '</div>';
    html += '</div>';
    box.innerHTML = html;
    $('copyCmd').addEventListener('click', function () { copyText(r.command, this); });
    return true;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // ---------- 生成 ----------
  function generate() {
    const text = $('queryInput').value.trim();
    if (!text) { $('queryInput').focus(); return; }
    const r = window.HOI4Engine.parse(text);
    const ok = renderResult(r);
    if (ok && !r.matched && !r.command && window.HOI4LLM.isEnabled()) {
      window.HOI4LLM.query(text).then(function (res) {
        if (res.error) {
          $('result').innerHTML = '<div class="result-card low"><div class="exp">大模型兜底失败：' +
            escapeHtml(res.error) + '</div><div class="note">可到“指令大全”手动查找。</div></div>';
          return;
        }
        renderResult(res);
      });
    }
  }

  $('genBtn').addEventListener('click', generate);
  $('queryInput').addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) generate();
  });
  document.querySelectorAll('.chip').forEach(function (c) {
    c.addEventListener('click', function () {
      $('queryInput').value = c.dataset.q;
      generate();
    });
  });

  // ---------- 指令大全 ----------
  function renderRef() {
    const list = $('refList');
    const q = ($('refSearch').value || '').trim().toLowerCase();
    const cat = $('refCat').value;
    // 分类下拉只初始化一次
    if ($('refCat').options.length <= 1) {
      const cats = Array.from(new Set(window.HOI4_COMMANDS.map(function (c) { return c.category; })));
      cats.forEach(function (c) {
        const o = document.createElement('option'); o.value = c; o.textContent = c; $('refCat').appendChild(o);
      });
    }
    const filtered = window.HOI4_COMMANDS.filter(function (c) {
      if (cat && c.category !== cat) return false;
      if (!q) return true;
      const hay = (c.name + ' ' + c.desc + ' ' + (c.tags || []).join(' ') + ' ' + c.category).toLowerCase();
      return hay.indexOf(q) !== -1;
    });
    if (!filtered.length) { list.innerHTML = '<p class="hint">没有匹配的指令。</p>'; return; }
    list.innerHTML = filtered.map(function (c) {
      const params = c.params ? Object.keys(c.params).map(function (k) {
        return '<div><code>' + k + '</code> — ' + c.params[k] + '</div>';
      }).join('') : '';
      const ex = (c.examples || []).map(function (e) { return '<code>' + e + '</code>'; }).join(' &nbsp; ');
      return '<div class="cmd-card">' +
        '<h3>' + c.name + '</h3>' +
        '<div class="cmd-cat">' + c.category + '</div>' +
        '<div class="cmd-syntax">' + c.syntax + '</div>' +
        '<div class="cmd-desc">' + c.desc + '</div>' +
        (params ? '<div class="params">' + params + '</div>' : '') +
        (ex ? '<div class="examples-mini">示例：' + ex + '</div>' : '') +
        '<button class="copy-btn" data-cmd="' + c.syntax.replace(/"/g, '&quot;') + '">复制语法</button>' +
        '</div>';
    }).join('');
    list.querySelectorAll('.copy-btn').forEach(function (b) {
      b.addEventListener('click', function () { copyText(b.dataset.cmd, this); });
    });
  }
  $('refSearch').addEventListener('input', renderRef);
  $('refCat').addEventListener('change', renderRef);

  // ---------- 设置 ----------
  function openSettings() {
    const s = window.HOI4LLM.getSettings();
    $('llmEnabled').checked = !!s.enabled;
    $('llmBase').value = s.baseUrl || 'https://api.openai.com/v1';
    $('llmKey').value = s.apiKey || '';
    $('llmModel').value = s.model || 'gpt-4o-mini';
    $('settingsStatus').textContent = '';
    $('settingsModal').classList.remove('hidden');
  }
  function closeSettings() { $('settingsModal').classList.add('hidden'); }
  $('settingsBtn').addEventListener('click', openSettings);
  $('closeSettings').addEventListener('click', closeSettings);
  $('settingsModal').addEventListener('click', function (e) { if (e.target === this) closeSettings(); });
  $('saveSettings').addEventListener('click', function () {
    window.HOI4LLM.saveSettings({
      enabled: $('llmEnabled').checked,
      baseUrl: $('llmBase').value.trim(),
      apiKey: $('llmKey').value.trim(),
      model: $('llmModel').value.trim()
    });
    $('settingsStatus').textContent = '已保存 ✓';
    setTimeout(closeSettings, 500);
  });
})();
