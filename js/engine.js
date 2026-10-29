// HOI4 指令规则引擎：把自然语言解析为可执行指令
(function () {
  'use strict';

  // ---------- 数字解析（含中文数字） ----------
  function cn2num(s) {
    const digits = { 零: 0, 〇: 0, 一: 1, 二: 2, 两: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9 };
    const units = { 十: 10, 百: 100, 千: 1000 };
    const bigs = { 万: 1e4, 亿: 1e8 };
    let total = 0, section = 0, num = 0;
    for (const ch of s) {
      if (ch in digits) num = digits[ch];
      else if (ch in units) { section += (num || 1) * units[ch]; num = 0; }
      else if (ch in bigs) { total += (section + num) * bigs[ch]; section = 0; num = 0; }
      else return NaN;
    }
    return total + section + num;
  }

  // 从文本提取第一个数字，返回 {value, raw, index} 或 null
  function extractNumber(text) {
    // 阿拉伯数字 + 可选 万/亿/千
    const re = /(\d[\d,]*\.?\d*)\s*(万|亿|千)?/;
    const m = text.match(re);
    if (m) {
      const base = parseFloat(m[1].replace(/,/g, ''));
      const unit = m[2];
      let val = base;
      if (unit === '万') val = base * 1e4;
      else if (unit === '亿') val = base * 1e8;
      else if (unit === '千') val = base * 1e3;
      return { value: Math.round(val), raw: m[0], index: m.index };
    }
    // 纯中文数字
    const cre = /[零〇一二两三四五六七八九十百千万亿]+/;
    const cm = text.match(cre);
    if (cm) {
      const v = cn2num(cm[0]);
      if (!isNaN(v) && v > 0) return { value: v, raw: cm[0], index: cm.index };
    }
    return null;
  }

  // ---------- 国家提取（全部出现） ----------
  function findAllCountries(text) {
    const idx = window.HOI4_COUNTRY_INDEX;
    const found = [];
    const used = new Set();
    // 优先完整中文名/英文名匹配
    idx.list.forEach(function (c) {
      const names = [c.en].concat(c.zh || []);
      names.forEach(function (n) {
        const key = n.toLowerCase();
        let i = text.toLowerCase().indexOf(key);
        while (i !== -1) {
          if (!used.has(i)) {
            found.push({ tag: c.tag, country: c, index: i, len: key.length });
            for (let k = i; k < i + key.length; k++) used.add(k);
          }
          i = text.toLowerCase().indexOf(key, i + 1);
        }
      });
    });
    // 标签（3字母大写）匹配
    const tagRe = /\b[A-Z]{3}\b/g;
    let tm;
    while ((tm = tagRe.exec(text)) !== null) {
      const tag = tm[0];
      if (idx.byTag[tag] && !used.has(tm.index)) {
        found.push({ tag: tag, country: idx.byTag[tag], index: tm.index, len: 3 });
        for (let k = tm.index; k < tm.index + 3; k++) used.add(k);
      }
    }
    found.sort(function (a, b) { return a.index - b.index; });
    // 去重（同 tag 取首个）
    const seen = new Set();
    return found.filter(function (f) {
      if (seen.has(f.tag)) return false;
      seen.add(f.tag);
      return true;
    });
  }

  // 去掉已识别国家文本，便于后续解析
  function stripCountries(text, countries) {
    let t = text;
    countries.forEach(function (c) {
      const names = [c.country.en].concat(c.country.zh || []);
      names.forEach(function (n) {
        t = t.split(n).join('');
      });
    });
    return t;
  }

  function findState(text) {
    // 州 ID：支持 "州 N" / "第N州" / "N州" / "state N" / "省份 N"
    const re = /(?:州|省份?|state|province)\s*[:：]?\s*(\d+)|(\d+)\s*(?:州|省份?|state|province)/i;
    const m = text.match(re);
    if (m) return parseInt(m[1] || m[2], 10);
    return null;
  }

  // ---------- 主解析 ----------
  function parse(raw) {
    const result = {
      matched: false, source: 'rule', command: '', name: '',
      explanation: '', confidence: 0, needs: [], note: ''
    };
    if (!raw || !raw.trim()) return result;
    let text = raw.trim().replace(/[，。、！？;；,.!?]/g, ' ');

    // 1) 直接指令透传：以已知指令名开头
    const known = window.HOI4_COMMANDS.map(function (c) { return c.name; });
    const firstWord = text.split(/\s+/)[0].toLowerCase();
    if (known.indexOf(firstWord) !== -1) {
      const cmd = window.HOI4_COMMANDS.find(function (c) { return c.name === firstWord; });
      result.matched = true; result.source = 'passthrough';
      result.command = text; result.name = cmd.name; result.confidence = 1;
      result.explanation = '已识别为直接指令：' + cmd.desc;
      return result;
    }

    const countries = findAllCountries(text);
    const country = countries[0] || null;
    const num = extractNumber(text);
    const state = findState(text);
    const resource = window.resolveResource(text);
    const ideology = window.resolveIdeology(text);
    const building = window.resolveBuilding(text);
    const xp = window.resolveXp(text);
    const low = text.toLowerCase();

    function needCountry(expl, conf) {
      if (!country) { result.needs.push('国家（可用代码如 IRN/JAP，或中文名）'); return conf * 0.4; }
      return conf;
    }

    // 2) 吞并
    if (/吞并|并吞|兼并|占领(?!.*州)/.test(text) && (country)) {
      result.matched = true; result.name = 'annex';
      result.command = 'annex ' + country.tag;
      result.explanation = '将 ' + (country.country.zh[0] || country.country.en) + '（' + country.tag + '）直接吞并，其领土归你当前操控的国家所有。';
      result.confidence = 0.95;
      return result;
    }

    // 3) 加核心
    if (/核心|加核心|core/.test(low) && state) {
      result.matched = true; result.name = 'add_core';
      const c = country ? country.tag : '<国家代码>';
      result.command = 'add_core ' + state + ' ' + c;
      result.explanation = '为' + (country ? (' ' + (country.country.zh[0] || country.country.en)) : ' 指定国家') +
        ' 添加第 ' + state + ' 州的核心（core）。' + (country ? '' : ' 请在 <国家代码> 处填入国家标签。');
      result.confidence = country ? 0.9 : 0.6;
      if (!country) result.needs.push('国家代码');
      return result;
    }

    // 4) 转移/归属（把X州给Y / 划给）
    if (/归属|划给|割让|转给|让给|给\s*到|占领.*州|州.*给/.test(text) && state && country) {
      result.matched = true; result.name = 'transfer_state';
      result.command = 'transfer_state ' + state + ' ' + country.tag;
      result.explanation = '将第 ' + state + ' 州转移给 ' + (country.country.zh[0] || country.country.en) +
        '（' + country.tag + '）。也可改用 set_owner / set_controller 仅改所有权或控制权。';
      result.confidence = 0.85;
      return result;
    }

    // 5) 资源
    if ((resource || /资源|resource/.test(low)) && num) {
      result.matched = true; result.name = 'add_resources';
      const res = resource || 'steel';
      const c = country ? country.tag : '<国家代码>';
      result.command = 'add_resources ' + c + ' ' + num.value + ' ' + res;
      const resZh = (window.HOI4_RESOURCES.find(function (r) { return r.code === res; }) || {}).zh || [res];
      result.explanation = '为' + (country ? (' ' + (country.country.zh[0] || country.country.en)) : ' 指定国家') +
        ' 添加 ' + num.value + ' 单位 ' + (resZh[0] || res) + '（' + res + '）。' +
        (country ? '' : ' 请在 <国家代码> 处填入国家标签。');
      result.confidence = (country ? 0.95 : 0.7);
      if (!country) result.needs.push('国家代码');
      return result;
    }

    // 6) 装备
    if (/装备|武器|坦克|飞机|舰艇|舰船|枪|师/.test(text) && num) {
      result.matched = true; result.name = 'add_equipment';
      result.command = 'add_equipment ' + num.value + ' "<装备内部名>"';
      result.explanation = '为当前国家添加 ' + num.value + ' 单位指定装备。请在 <装备内部名> 处填入装备内部名（如 infantry_equipment_1、tank_designed）。建议先用 tag 切换到目标国。';
      result.confidence = 0.8;
      result.needs.push('装备内部名');
      return result;
    }

    // 7) 人力
    if (/人力|兵员|人口|募兵/.test(text) && num) {
      result.matched = true; result.name = 'manpower';
      result.command = 'manpower ' + num.value;
      result.explanation = '为当前国家设置/增加 ' + num.value + ' 人力。';
      result.confidence = 0.9;
      return result;
    }

    // 8) 政治点
    if (/政治点|政治权力|\bpp\b|点数/.test(low) && num) {
      result.matched = true; result.name = 'add_political_power';
      result.command = 'add_political_power ' + num.value;
      result.explanation = '为当前国家增加 ' + num.value + ' 政治点（PP）。';
      result.confidence = 0.9;
      return result;
    }

    // 9) 科研
    if (/科研|科技|研究|技术|解锁/.test(text)) {
      result.matched = true; result.name = 'research';
      if (/所有|全部|all/.test(text)) {
        result.command = 'research all';
        result.explanation = '立即完成当前国家所有可用科技。';
      } else {
        result.command = 'research "<科技内部名>"';
        result.explanation = '立即完成指定科技。请在 <科技内部名> 处填入科技内部名（如 heavy_tank_1）。';
        result.needs.push('科技内部名（或输入“所有科技”一键完成）');
      }
      result.confidence = 0.85;
      return result;
    }

    // 10) 建造/工厂
    if ((building || /建造|建(个|设)?\s*(工厂|基地)|工厂/.test(text)) && state) {
      const b = building || 'industrial_complex';
      const amt = num ? num.value : 1;
      result.matched = true; result.name = 'add_building';
      result.command = 'add_building ' + state + ' ' + b + ' ' + amt;
      result.explanation = '在第 ' + state + ' 州直接添加 ' + amt + ' 级 ' + b + '（不消耗建造）。';
      result.confidence = 0.85;
      return result;
    }

    // 11) 切换国家
    if (/切换|附身|扮演|操控|控制.*国|变成/.test(text) && country) {
      result.matched = true; result.name = 'tag';
      result.command = 'tag ' + country.tag;
      result.explanation = '切换到 ' + (country.country.zh[0] || country.country.en) + '（' + country.tag + '）进行操控。';
      result.confidence = 0.9;
      return result;
    }

    // 12) 和平
    if (/和平|停战|休战|白和平|结束战争/.test(text)) {
      if (countries.length >= 2) {
        result.matched = true; result.name = 'peace';
        result.command = 'peace ' + countries[0].tag + ' ' + countries[1].tag;
        result.explanation = '让 ' + countries[0].tag + ' 与 ' + countries[1].tag + ' 之间立即和平。';
        result.confidence = 0.9;
      } else {
        result.matched = true; result.name = 'whitepeace';
        result.command = 'whitepeace';
        result.explanation = '当前所有战争立即白和平（无领土变更）。若只想让特定两国和平，请同时写明两国。';
        result.confidence = 0.8;
      }
      return result;
    }

    // 13) 宣战
    if (/宣战|开战|发动战争/.test(text) && countries.length >= 2) {
      result.matched = true; result.name = 'war';
      result.command = 'war ' + countries[0].tag + ' ' + countries[1].tag;
      result.explanation = '让 ' + countries[0].tag + ' 向 ' + countries[1].tag + ' 宣战。';
      result.confidence = 0.9;
      return result;
    }

    // 14) 意识形态
    if ((/意识形态|主义|执政党|体制/.test(text)) && ideology) {
      const c = country ? country.tag : '<国家代码>';
      result.matched = true; result.name = 'change_ideology';
      result.command = 'change_ideology ' + ideology + ' ' + c;
      result.explanation = '将' + (country ? (' ' + (country.country.zh[0] || country.country.en)) : ' 指定国家') +
        ' 的意识形态改为 ' + ideology + '。' + (country ? '' : ' 请在 <国家代码> 处填入国家标签。');
      result.confidence = country ? 0.9 : 0.6;
      if (!country) result.needs.push('国家代码');
      return result;
    }

    // 15) 内战
    if (/内战|革命|起义/.test(text) && country && ideology) {
      result.matched = true; result.name = 'civilwar';
      result.command = 'civilwar ' + country.tag + ' ' + ideology + ' ' + country.tag;
      result.explanation = '在 ' + country.tag + ' 发动内战，分裂出具有 ' + ideology + ' 意识形态的新国家。';
      result.confidence = 0.85;
      return result;
    }

    // 16) 释放
    if (/释放|独立/.test(text) && country) {
      result.matched = true; result.name = 'release';
      result.command = 'release ' + country.tag;
      result.explanation = '释放 ' + country.tag + ' 为独立/附庸国。';
      result.confidence = 0.85;
      return result;
    }

    // 17) 事件
    if (/事件|event/.test(low)) {
      result.matched = true; result.name = 'event';
      const c = country ? country.tag : '';
      result.command = 'event <命名空间.事件ID>' + (c ? ' ' + c : '');
      result.explanation = '触发指定事件。请在 <命名空间.事件ID> 处填入事件标识（如 generic.1）。' + (c ? (' 目标国：' + c) : '');
      result.confidence = 0.7;
      result.needs.push('事件ID（命名空间.编号）');
      return result;
    }

    // 18) 国策
    if (/国策|焦点|focus/.test(low)) {
      result.matched = true; result.name = 'focus';
      const c = country ? country.tag : '<国家代码>';
      result.command = 'focus ' + c + ' "<国策ID>"';
      result.explanation = '为' + (country ? (' ' + (country.country.zh[0] || country.country.en)) : ' 指定国家') +
        ' 立即完成指定国策。请在 <国策ID> 处填入国策内部名。';
      result.confidence = country ? 0.8 : 0.55;
      result.needs.push('国策内部名');
      if (!country) result.needs.push('国家代码');
      return result;
    }

    // 19) 经验
    if (/经验/.test(text) && xp && num) {
      result.matched = true; result.name = 'xp';
      result.command = 'xp ' + xp + ' ' + num.value;
      const xzh = { land: '陆军', air: '空军', naval: '海军' }[xp];
      result.explanation = '为当前国家增加 ' + num.value + ' 点' + xzh + '经验。';
      result.confidence = 0.88;
      return result;
    }

    // 20) 速度
    if (/加速|倍速|速度|暂停|继续/.test(text) || /speed/.test(low)) {
      let sp = 3;
      if (/暂停|停/.test(text)) sp = 0;
      else if (num) sp = Math.min(5, Math.max(0, num.value));
      else {
        const m2 = text.match(/(\d)\s*倍/);
        if (m2) sp = parseInt(m2[1], 10);
      }
      result.matched = true; result.name = 'speed';
      result.command = 'speed ' + sp;
      result.explanation = '设置游戏速度为 ' + sp + '（0=暂停，1=正常，2~5=加速）。';
      result.confidence = 0.8;
      return result;
    }

    // 21) 紧张度
    if (/紧张度|战争紧张|tension/.test(low)) {
      result.matched = true; result.name = 'set_tension';
      result.command = 'set_tension ' + (num ? num.value : 100);
      result.explanation = '设置全球战争紧张度为 ' + (num ? num.value : 100) + '（0~100）。';
      result.confidence = 0.8;
      return result;
    }

    // 22) 瞬间建造 / 调试权力（作弊类）
    if (/瞬间(完成)?(建造|建)|秒建|即时建造|建筑瞬间|建造瞬间/.test(text)) {
      result.matched = true; result.name = 'instantconstruction';
      result.command = 'instantconstruction';
      result.explanation = '开启后所有建造（工厂、建筑、舰船等）瞬间完成。无需 -debug 即可使用，再次输入可关闭。';
      result.confidence = 0.9;
      return result;
    }
    if (/调试权力|所有能力|作弊|神级|debug\s*powers/.test(low)) {
      result.matched = true; result.name = 'debug_powers';
      result.command = 'debug_powers';
      result.explanation = '开启全部调试能力（含瞬间建造、强制外交、无视国策/科技限制等）。⚠ 需以 -debug 启动游戏，否则红字报错。再次输入可关闭。';
      result.confidence = 0.9;
      return result;
    }
    if (/允许.*分歧|意识形态分歧/.test(text)) {
      result.matched = true; result.name = 'allowdivergence';
      result.command = 'allowdivergence';
      result.explanation = '允许国家间意识形态分歧（AI 可自由切换意识形态）。';
      result.confidence = 0.85;
      return result;
    }

    // 未匹配：返回低置信，交由 LLM 兜底
    result.matched = false;
    result.confidence = 0;
    result.note = '本地规则未能识别该需求，已转交大模型兜底（如已配置）。';
    return result;
  }

  window.HOI4Engine = { parse: parse, extractNumber: extractNumber, findAllCountries: findAllCountries };
})();
