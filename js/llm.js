// 可选大模型兜底：用户需在“设置”中填入 API 信息（仅存浏览器 localStorage）
(function () {
  'use strict';

  const KEY = 'hoi4_llm_settings';

  function getSettings() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; }
    catch (e) { return {}; }
  }
  function saveSettings(s) {
    localStorage.setItem(KEY, JSON.stringify(s));
  }
  function isEnabled() {
    const s = getSettings();
    return !!(s.enabled && s.apiKey && s.baseUrl && s.model);
  }

  // 压缩后的指令清单，作为大模型上下文
  function buildCommandBrief() {
    return window.HOI4_COMMANDS.map(function (c) {
      return c.name + ' | ' + c.syntax + ' | ' + c.desc;
    }).join('\n');
  }

  const SYSTEM = '你是《钢铁雄心4》(Hearts of Iron IV) 控制台指令助手。' +
    '用户用中文描述游戏需求，你需要输出【可直接复制进游戏控制台】的指令。' +
    '指令必须是英文、参数严格。常用国家代码：伊朗=PER，日本=JAP，美国=USA，德国=GER，苏联=SOV，中国=CHI，英国=ENG，法国=FRA，意大利=ITA。' +
    '资源代码：steel(钢) tungsten(钨) chromium(铬) aluminum(铝) rubber(橡胶) oil(石油)。' +
    '意识形态：democratic/communism/fascism/neutrality。' +
    '仅返回如下 JSON（不要额外文字）：' +
    '{"command":"指令原文","name":"指令名","explanation":"用中文说明这条指令做了什么、参数含义","confidence":0到1的数字,"note":"需要的补充信息或注意事项"}。' +
    '可用指令清单：\n' + buildCommandBrief();

  // 返回 Promise<{command,name,explanation,confidence,note,error}>
  function query(text) {
    const s = getSettings();
    if (!isEnabled()) {
      return Promise.resolve({ error: '未启用大模型或缺少 API 配置' });
    }
    const url = s.baseUrl.replace(/\/$/, '') + '/chat/completions';
    const body = {
      model: s.model,
      messages: [
        { role: 'system', content: SYSTEM },
        { role: 'user', content: text }
      ],
      temperature: 0,
      response_format: { type: 'json_object' }
    };
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + s.apiKey
      },
      body: JSON.stringify(body)
    }).then(function (r) {
      if (!r.ok) return r.text().then(function (t) { throw new Error('API ' + r.status + ': ' + t); });
      return r.json();
    }).then(function (data) {
      const content = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
      if (!content) throw new Error('返回为空');
      let obj;
      try { obj = JSON.parse(content); }
      catch (e) { throw new Error('返回不是合法 JSON：' + content); }
      return {
        command: obj.command || '',
        name: obj.name || '',
        explanation: obj.explanation || '',
        confidence: typeof obj.confidence === 'number' ? obj.confidence : 0.6,
        note: obj.note || '',
        source: 'llm'
      };
    }).catch(function (err) {
      return { error: err.message || String(err) };
    });
  }

  window.HOI4LLM = { getSettings: getSettings, saveSettings: saveSettings, isEnabled: isEnabled, query: query };
})();
