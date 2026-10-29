// HOI4 控制台指令库（尽量全覆盖）
// 字段：id, name(指令名), category(分类), syntax(语法), desc(说明),
//       params(参数说明), examples(示例), tags(搜索标签)
window.HOI4_COMMANDS = [
  // ===================== 资源 / 经济 =====================
  {
    id: 'add_resources', name: 'add_resources', category: '资源经济',
    syntax: 'add_resources <国家> <数量> <资源>',
    desc: '为指定国家添加资源到国家战略库存。',
    params: { '<国家>': '国家代码，如 IRN', '<数量>': '数字，如 10000', '<资源>': 'steel/tungsten/chromium/aluminum/rubber/oil' },
    examples: ['add_resources IRN 10000 steel', 'add_resources GER 5000 oil'],
    tags: ['资源', '钢', '石油', '铝', '橡胶', '钨', '铬', 'resource']
  },
  {
    id: 'add_equipment', name: 'add_equipment', category: '资源经济',
    syntax: 'add_equipment <数量> <装备名>',
    desc: '为当前（或带 tag 的）国家添加指定装备到库存。装备名需用引号包裹。',
    params: { '<数量>': '数字', '<装备名>': '装备内部名，如 "infantry_equipment_1"' },
    examples: ['add_equipment 100 "infantry_equipment_1"', 'add_equipment 50 "tank_designed"'],
    tags: ['装备', '武器', '坦克', '飞机', 'equipment']
  },
  {
    id: 'add_equipment_to_stockpile', name: 'add_equipment_to_stockpile', category: '资源经济',
    syntax: 'add_equipment_to_stockpile <国家> <数量> <装备名>',
    desc: '为指定国家添加装备到库存（带国家参数版本）。',
    params: { '<国家>': '国家代码', '<数量>': '数字', '<装备名>': '装备内部名（引号）' },
    examples: ['add_equipment_to_stockpile GER 200 "panzer_iv"'],
    tags: ['装备', '库存', 'stockpile']
  },
  {
    id: 'add_latest_equipment', name: 'add_latest_equipment', category: '资源经济',
    syntax: 'add_latest_equipment <数量>',
    desc: '为当前国家添加最新一级的步兵装备。',
    params: { '<数量>': '数字' }, examples: ['add_latest_equipment 500'],
    tags: ['装备', '步兵', 'latest']
  },
  {
    id: 'add_consumer', name: 'add_consumer', category: '资源经济',
    syntax: 'add_consumer <数量>',
    desc: '增加民用工厂（consumer goods）数量。',
    params: { '<数量>': '数字' }, examples: ['add_consumer 20'],
    tags: ['民用工厂', 'consumer']
  },
  {
    id: 'manpower', name: 'manpower', category: '资源经济',
    syntax: 'manpower <数量>',
    desc: '为当前国家设置/增加可用人力。',
    params: { '<数量>': '数字，如 1000000' }, examples: ['manpower 1000000'],
    tags: ['人力', '兵员', 'manpower']
  },
  {
    id: 'add_manpower', name: 'add_manpower', category: '资源经济',
    syntax: 'add_manpower <数量>',
    desc: '为当前国家增加人力（manpower 的别名）。',
    params: { '<数量>': '数字' }, examples: ['add_manpower 500000'],
    tags: ['人力', '兵员']
  },
  {
    id: 'add_political_power', name: 'add_political_power', category: '资源经济',
    syntax: 'add_political_power <数量>',
    desc: '为当前国家增加政治点（PP）。',
    params: { '<数量>': '数字，如 100' }, examples: ['add_political_power 100'],
    tags: ['政治点', 'PP', 'political power']
  },
  {
    id: 'add_dlc_latest_equipment', name: 'add_dlc_latest_equipment', category: '资源经济',
    syntax: 'add_dlc_latest_equipment <数量>',
    desc: '为当前国家添加 DLC 中的最新装备。',
    params: { '<数量>': '数字' }, examples: ['add_dlc_latest_equipment 100'],
    tags: ['装备', 'dlc']
  },

  // ===================== 科技 / 研究 =====================
  {
    id: 'research', name: 'research', category: '科技',
    syntax: 'research <科技名>',
    desc: '立即完成指定科技（若填 all 则完成所有可用科技）。',
    params: { '<科技名>': '科技内部名，或 all' }, examples: ['research all', 'research "heavy_tank_1"'],
    tags: ['科研', '科技', '研究', 'research', 'tech']
  },
  {
    id: 'research_on_icon_click', name: 'research_on_icon_click', category: '科技',
    syntax: 'research_on_icon_click',
    desc: '开启后点击科技图标即可立即完成（调试用）。',
    params: {}, examples: ['research_on_icon_click'],
    tags: ['科研', '点击', 'debug']
  },
  {
    id: 'instantconstruction', name: 'instantconstruction', category: '科技',
    syntax: 'instantconstruction',
    desc: '所有建造瞬间完成（调试）。',
    params: {}, examples: ['instantconstruction'],
    tags: ['建造', '瞬间', 'instant', '作弊']
  },
  {
    id: 'debug_powers', name: 'debug_powers', category: '科技',
    syntax: 'debug_powers',
    desc: '开启全部调试能力（含瞬间建造、强制外交、无视国策/科技限制等）。',
    params: {}, examples: ['debug_powers'],
    tags: ['作弊', '调试', '瞬间', '能力', 'powers']
  },
  {
    id: 'add_tech', name: 'add_tech', category: '科技',
    syntax: 'add_tech <科技名>',
    desc: '添加（解锁）指定科技。',
    params: { '<科技名>': '科技内部名' }, examples: ['add_tech "radio"'],
    tags: ['科技', '解锁', 'tech']
  },

  // ===================== 领土 / 外交 =====================
  {
    id: 'annex', name: 'annex', category: '领土外交',
    syntax: 'annex <国家>',
    desc: '将指定国家直接吞并，其领土归当前国家所有。',
    params: { '<国家>': '要被吞并的国家代码，如 JAP' }, examples: ['annex JAP', 'annex FRA'],
    tags: ['吞并', '占领', 'annex']
  },
  {
    id: 'add_core', name: 'add_core', category: '领土外交',
    syntax: 'add_core <州> <国家>',
    desc: '为指定国家添加某州的领土核心（core）。',
    params: { '<州>': '州 ID 数字', '<国家>': '国家代码' }, examples: ['add_core 1 GER', 'add_core 236 JAP'],
    tags: ['核心', 'core', '领土']
  },
  {
    id: 'remove_core', name: 'remove_core', category: '领土外交',
    syntax: 'remove_core <州> <国家>',
    desc: '移除指定国家在某个州上的核心。',
    params: { '<州>': '州 ID', '<国家>': '国家代码' }, examples: ['remove_core 1 POL'],
    tags: ['移除核心', 'core']
  },
  {
    id: 'set_owner', name: 'set_owner', category: '领土外交',
    syntax: 'set_owner <国家> <州>',
    desc: '将指定州的所有权（owner）转移给某国。',
    params: { '<国家>': '国家代码', '<州>': '州 ID' }, examples: ['set_owner GER 1'],
    tags: ['归属', '所有权', 'owner', '州']
  },
  {
    id: 'set_controller', name: 'set_controller', category: '领土外交',
    syntax: 'set_controller <国家> <州>',
    desc: '将指定州的控制器（controller）设为某国（不改变所有权）。',
    params: { '<国家>': '国家代码', '<州>': '州 ID' }, examples: ['set_controller GER 1'],
    tags: ['控制', 'controller', '州']
  },
  {
    id: 'transfer_state', name: 'transfer_state', category: '领土外交',
    syntax: 'transfer_state <州> <国家>',
    desc: '将某州转移给另一国（常用于和平/割让）。',
    params: { '<州>': '州 ID', '<国家>': '国家代码' }, examples: ['transfer_state 236 USA'],
    tags: ['割让', '转移', '州', 'state']
  },
  {
    id: 'release', name: 'release', category: '领土外交',
    syntax: 'release <国家>',
    desc: '释放指定国家为独立/附庸国。',
    params: { '<国家>': '国家代码' }, examples: ['release POL'],
    tags: ['释放', '独立', 'release']
  },
  {
    id: 'puppet', name: 'puppet', category: '领土外交',
    syntax: 'puppet <国家>',
    desc: '将指定国家设为当前国家的附庸。',
    params: { '<国家>': '国家代码' }, examples: ['puppet MAN'],
    tags: ['附庸', 'puppet']
  },
  {
    id: 'civilwar', name: 'civilwar', category: '领土外交',
    syntax: 'civilwar <国家> <意识形态> <国家>',
    desc: '在指定国家发动内战，分裂出具有某意识形态的新国家。',
    params: { '<国家>': '原国家代码', '<意识形态>': 'democratic/communism/fascism/neutrality', '<国家>': '新生国家代码' },
    examples: ['civilwar GER communism GER'],
    tags: ['内战', 'civil war', '革命']
  },
  {
    id: 'allowdiplomacy', name: 'allowdiplomacy', category: '领土外交',
    syntax: 'allowdiplomacy',
    desc: '开启外交行动（即使处于战争等限制下）。',
    params: {}, examples: ['allowdiplomacy'],
    tags: ['外交', 'diplomacy']
  },
  {
    id: 'allowdivergence', name: 'allowdivergence', category: '领土外交',
    syntax: 'allowdivergence',
    desc: '允许国家间意识形态分歧（AI 可自由切换意识形态）。',
    params: {}, examples: ['allowdivergence'],
    tags: ['分歧', '意识形态', 'divergence', '作弊']
  },
  {
    id: 'nocb', name: 'nocb', category: '领土外交',
    syntax: 'nocb',
    desc: '允许无宣战理由（casus belli）即可对他国行动/宣战。',
    params: {}, examples: ['nocb'],
    tags: ['无理由', 'cb', 'war']
  },
  {
    id: 'war', name: 'war', category: '领土外交',
    syntax: 'war <国家A> <国家B>',
    desc: '让国家A向国家B宣战。',
    params: { '<国家A>': '进攻方代码', '<国家B>': '防守方代码' }, examples: ['war GER POL'],
    tags: ['宣战', '战争', 'war']
  },
  {
    id: 'peace', name: 'peace', category: '领土外交',
    syntax: 'peace <国家A> <国家B>',
    desc: '让国家A与国家B之间立即和平（peace_with 同义）。',
    params: { '<国家A>': '国家代码', '<国家B>': '国家代码' }, examples: ['peace GER FRA'],
    tags: ['和平', '停战', 'peace']
  },
  {
    id: 'whitepeace', name: 'whitepeace', category: '领土外交',
    syntax: 'whitepeace',
    desc: '当前所有战争立即白和平（无领土变更）。',
    params: {}, examples: ['whitepeace'],
    tags: ['白和平', '停战', 'white peace']
  },
  {
    id: 'defeat', name: 'defeat', category: '领土外交',
    syntax: 'defeat',
    desc: '当前国家立即战败。',
    params: {}, examples: ['defeat'],
    tags: ['战败', 'defeat']
  },
  {
    id: 'justifywar', name: 'justifywar', category: '领土外交',
    syntax: 'justifywar <国家>',
    desc: '立即完成对指定国家的宣战借口。',
    params: { '<国家>': '目标国家代码' }, examples: ['justifywar POL'],
    tags: ['借口', 'justify', 'war']
  },
  {
    id: 'set_ruling_party', name: 'set_ruling_party', category: '领土外交',
    syntax: 'set_ruling_party <意识形态> <国家>',
    desc: '将指定国家的执政党改为某意识形态。',
    params: { '<意识形态>': 'democratic/communism/fascism/neutrality', '<国家>': '国家代码' },
    examples: ['set_ruling_party communism USSR'],
    tags: ['执政党', '意识形态', 'ruling party']
  },
  {
    id: 'change_ideology', name: 'change_ideology', category: '领土外交',
    syntax: 'change_ideology <意识形态> <国家>',
    desc: '修改指定国家的意识形态。',
    params: { '<意识形态>': 'democratic/communism/fascism/neutrality', '<国家>': '国家代码' },
    examples: ['change_ideology fascism ITA'],
    tags: ['意识形态', 'ideology']
  },
  {
    id: 'add_autonomy', name: 'add_autonomy', category: '领土外交',
    syntax: 'add_autonomy <国家> <等级>',
    desc: '设置附庸国的自治等级。',
    params: { '<国家>': '国家代码', '<等级>': 'autonomous_state / dominion / puppet / integrated_puppet 等' },
    examples: ['add_autonomy POL puppet'],
    tags: ['自治', 'autonomy', '附庸']
  },
  {
    id: 'set_autonomy', name: 'set_autonomy', category: '领土外交',
    syntax: 'set_autonomy <国家> <等级>',
    desc: '直接设定附庸自治等级（与 add_autonomy 类似）。',
    params: { '<国家>': '国家代码', '<等级>': '自治等级' }, examples: ['set_autonomy MAN puppet'],
    tags: ['自治', 'autonomy']
  },

  // ===================== 军事 =====================
  {
    id: 'add_units', name: 'add_units', category: '军事',
    syntax: 'add_units <国家> <师团模板名> <数量>',
    desc: '为指定国家生成若干采用某模板的师团。',
    params: { '<国家>': '国家代码', '<师团模板名>': '模板内部名', '<数量>': '数字' },
    examples: ['add_units GER "1st Infantry" 10'],
    tags: ['师团', '部队', 'units', '生成']
  },
  {
    id: 'kill', name: 'kill', category: '军事',
    syntax: 'kill <单位ID或类型>',
    desc: '摧毁/移除指定单位。',
    params: { '<单位ID或类型>': '单位标识' }, examples: ['kill all'],
    tags: ['摧毁', 'kill', '单位']
  },
  {
    id: 'deleteallunits', name: 'deleteallunits', category: '军事',
    syntax: 'deleteallunits <国家>',
    desc: '删除指定国家的所有单位。',
    params: { '<国家>': '国家代码（可省略=当前）' }, examples: ['deleteallunits JAP'],
    tags: ['删除', '部队', 'units']
  },
  {
    id: 'airwin', name: 'airwin', category: '军事',
    syntax: 'airwin',
    desc: '下一空战我方获胜。',
    params: {}, examples: ['airwin'],
    tags: ['空战', '胜利', 'air']
  },
  {
    id: 'landwin', name: 'landwin', category: '军事',
    syntax: 'landwin',
    desc: '下一陆战我方获胜。',
    params: {}, examples: ['landwin'],
    tags: ['陆战', '胜利', 'land']
  },
  {
    id: 'navalwin', name: 'navalwin', category: '军事',
    syntax: 'navalwin',
    desc: '下一海战我方获胜。',
    params: {}, examples: ['navalwin'],
    tags: ['海战', '胜利', 'naval']
  },
  {
    id: 'nuke', name: 'debug_nuking', category: '军事',
    syntax: 'debug_nuking',
    desc: '开启后可在任意地点投放核弹（调试）。',
    params: {}, examples: ['debug_nuking'],
    tags: ['核弹', 'nuke', 'debug']
  },
  {
    id: 'xp', name: 'xp', category: '军事',
    syntax: 'xp <类型> <数量>',
    desc: '为当前国家增加陆/海/空经验。',
    params: { '<类型>': 'land / air / naval', '<数量>': '数字，如 100' },
    examples: ['xp land 50', 'xp air 100'],
    tags: ['经验', 'XP', '陆军', '空军', '海军']
  },
  {
    id: 'add_operative', name: 'add_operative', category: '军事',
    syntax: 'add_operative <国家>',
    desc: '为指定国家生成一名特工（operative）。',
    params: { '<国家>': '国家代码' }, examples: ['add_operative GER'],
    tags: ['特工', '间谍', 'operative', 'spy']
  },
  {
    id: 'add_convoy', name: 'add_convoy', category: '军事',
    syntax: 'add_convoy <国家> <数量>',
    desc: '为指定国家增加护航（convoy）。',
    params: { '<国家>': '国家代码', '<数量>': '数字' }, examples: ['add_convoy GER 50'],
    tags: ['护航', 'convoy']
  },

  // ===================== 国家操作 / 切换 =====================
  {
    id: 'tag', name: 'tag', category: '国家操作',
    syntax: 'tag <国家>',
    desc: '切换到指定国家进行操控（俗称“附身”）。',
    params: { '<国家>': '国家代码，如 USA' }, examples: ['tag USA', 'tag JAP'],
    tags: ['切换', '附身', '扮演', 'tag']
  },
  {
    id: 'tp', name: 'tp', category: '国家操作',
    syntax: 'tp <国家>',
    desc: 'tag 的别名，切换操控国家。',
    params: { '<国家>': '国家代码' }, examples: ['tp GER'],
    tags: ['切换', '附身', 'tag']
  },
  {
    id: 'ai', name: 'ai', category: '国家操作',
    syntax: 'ai',
    desc: '开关当前国家的 AI 控制。',
    params: {}, examples: ['ai'],
    tags: ['AI', '人工智能', '控制']
  },
  {
    id: 'yesman', name: 'yesman', category: '国家操作',
    syntax: 'yesman',
    desc: '其他国家 AI 总是接受你的外交提议（劝导工具人）。',
    params: {}, examples: ['yesman'],
    tags: ['yesman', '同意', '外交']
  },
  {
    id: 'observe', name: 'observe', category: '国家操作',
    syntax: 'observe',
    desc: '进入观战模式（放弃对当前国家的控制）。',
    params: {}, examples: ['observe'],
    tags: ['观战', 'observe']
  },
  {
    id: 'election', name: 'election', category: '国家操作',
    syntax: 'election',
    desc: '立即触发一次选举。',
    params: {}, examples: ['election'],
    tags: ['选举', 'election']
  },

  // ===================== 事件 / 焦点 =====================
  {
    id: 'event', name: 'event', category: '事件焦点',
    syntax: 'event <命名空间.事件ID> <国家>',
    desc: '触发指定事件（命名空间.编号，国家参数可省略=当前）。',
    params: { '<命名空间.事件ID>': '如 generic.1', '<国家>': '国家代码（可选）' },
    examples: ['event generic.1', 'event germany.2 GER'],
    tags: ['事件', 'event']
  },
  {
    id: 'focus', name: 'focus', category: '事件焦点',
    syntax: 'focus <国家> <国策ID>',
    desc: '为指定国家立即完成指定国策。',
    params: { '<国家>': '国家代码', '<国策ID>': '国策内部名' }, examples: ['focus GER "focus_pol_anticom_interventionist"'],
    tags: ['国策', '焦点', 'focus', 'national focus']
  },
  {
    id: 'complete_focus', name: 'complete_focus', category: '事件焦点',
    syntax: 'complete_focus',
    desc: '立即完成当前国家正在进行的国策。',
    params: {}, examples: ['complete_focus'],
    tags: ['国策', '完成', 'focus']
  },
  {
    id: 'add_doctrine', name: 'add_doctrine', category: '事件焦点',
    syntax: 'add_doctrine <国家> <学说ID>',
    desc: '为指定国家添加军事学说。',
    params: { '<国家>': '国家代码', '<学说ID>': '学说内部名' }, examples: ['add_doctrine GER "battle_planning_leg"'],
    tags: ['学说', 'doctrine']
  },

  // ===================== 时间与速度 =====================
  {
    id: 'speed', name: 'speed', category: '时间速度',
    syntax: 'speed <0-5>',
    desc: '设置游戏速度。0=暂停,1=正常,2~5=加速。',
    params: { '<0-5>': '速度档位' }, examples: ['speed 3', 'speed 0'],
    tags: ['速度', '加速', '倍速', 'speed']
  },
  {
    id: 'pause', name: 'pause', category: '时间速度',
    syntax: 'pause',
    desc: '暂停游戏。',
    params: {}, examples: ['pause'],
    tags: ['暂停', 'pause']
  },
  {
    id: 'play', name: 'play', category: '时间速度',
    syntax: 'play',
    desc: '继续（取消暂停）游戏。',
    params: {}, examples: ['play'],
    tags: ['继续', 'play']
  },
  {
    id: 'tick', name: 'tick', category: '时间速度',
    syntax: 'tick',
    desc: '手动推进一个游戏刻（配合暂停逐帧观察）。',
    params: {}, examples: ['tick'],
    tags: ['推进', 'tick']
  },

  // ===================== 战争/世界状态 =====================
  {
    id: 'set_tension', name: 'set_tension', category: '战争状态',
    syntax: 'set_tension <数值>',
    desc: '设置全球战争紧张度（0~100）。',
    params: { '<数值>': '0~100' }, examples: ['set_tension 100'],
    tags: ['紧张度', 'tension', '战争']
  },
  {
    id: 'threat', name: 'threat', category: '战争状态',
    syntax: 'threat <国家> <数值>',
    desc: '设置某国对世界的威胁值。',
    params: { '<国家>': '国家代码', '<数值>': '数字' }, examples: ['threat GER 100'],
    tags: ['威胁', 'threat']
  },
  {
    id: 'fow', name: 'fow', category: '战争状态',
    syntax: 'fow',
    desc: '开关战争迷雾（显示全部地形）。',
    params: {}, examples: ['fow'],
    tags: ['战争迷雾', 'fog', 'fow']
  },
  {
    id: 'instant_war', name: 'instant_war', category: '战争状态',
    syntax: 'instant_war',
    desc: '开启后宣战无需等待（即时开战）。',
    params: {}, examples: ['instant_war'],
    tags: ['即时', 'war']
  },

  // ===================== 建造 / 工厂 =====================
  {
    id: 'add_building', name: 'add_building', category: '建造工厂',
    syntax: 'add_building <州> <建筑代码> <数量>',
    desc: '在指定州直接添加建筑（不消耗建造）。',
    params: { '<州>': '州 ID', '<建筑代码>': 'arms_factory/industrial_complex/air_base/naval_base 等', '<数量>': '数字' },
    examples: ['add_building 1 industrial_complex 10', 'add_building 1 arms_factory 5'],
    tags: ['建筑', '工厂', '建造', 'building']
  },
  {
    id: 'build', name: 'build', category: '建造工厂',
    syntax: 'build <州> <建筑代码> <等级>',
    desc: '在指定州开始建造（排队）。',
    params: { '<州>': '州 ID', '<建筑代码>': '建筑内部名', '<等级>': '目标等级' },
    examples: ['build 1 industrial_complex 10'],
    tags: ['建造', '工厂', 'build']
  },
  {
    id: 'add_dockyard', name: 'add_dockyard', category: '建造工厂',
    syntax: 'add_dockyard <国家> <数量>',
    desc: '为指定国家增加船坞（海军工厂）。',
    params: { '<国家>': '国家代码', '<数量>': '数字' }, examples: ['add_dockyard JAP 20'],
    tags: ['船坞', '海军工厂', 'dockyard']
  },

  // ===================== 调试 / 杂项 =====================
  {
    id: 'help', name: 'help', category: '调试杂项',
    syntax: 'help',
    desc: '列出所有可用控制台指令。',
    params: {}, examples: ['help'],
    tags: ['帮助', 'help']
  },
  {
    id: 'savegame', name: 'savegame', category: '调试杂项',
    syntax: 'savegame <文件名>',
    desc: '保存当前游戏进度。',
    params: { '<文件名>': '存档名（可选）' }, examples: ['savegame mygame'],
    tags: ['存档', 'save']
  },
  {
    id: 'reload', name: 'reload', category: '调试杂项',
    syntax: 'reload <类型>',
    desc: '重新加载资源（如 reload focus / reload gfx）。',
    params: { '<类型>': 'focus / gfx / production 等' }, examples: ['reload focus'],
    tags: ['重载', 'reload']
  },
  {
    id: 'setweather', name: 'setweather', category: '调试杂项',
    syntax: 'setweather <天气>',
    desc: '设置当前战略地图上的天气。',
    params: { '<天气>': 'clear / rain / snow / storm 等' }, examples: ['setweather snow'],
    tags: ['天气', 'weather']
  },
  {
    id: 'set_country_flag', name: 'set_country_flag', category: '调试杂项',
    syntax: 'set_country_flag <旗帜名> <国家>',
    desc: '为指定国家设置国家旗帜（flag）变量。',
    params: { '<旗帜名>': '旗帜内部名', '<国家>': '国家代码' }, examples: ['set_country_flag myflag GER'],
    tags: ['旗帜', 'flag']
  },
  {
    id: 'clr_country_flag', name: 'clr_country_flag', category: '调试杂项',
    syntax: 'clr_country_flag <旗帜名> <国家>',
    desc: '清除指定国家的国家旗帜变量。',
    params: { '<旗帜名>': '旗帜内部名', '<国家>': '国家代码' }, examples: ['clr_country_flag myflag GER'],
    tags: ['旗帜', 'flag', '清除']
  },
  {
    id: 'error', name: 'error', category: '调试杂项',
    syntax: 'error',
    desc: '打印最近的脚本错误（调试）。',
    params: {}, examples: ['error'],
    tags: ['错误', 'debug', 'error']
  },
  {
    id: 'hover', name: 'hover', category: '调试杂项',
    syntax: 'hover',
    desc: '开关悬停调试信息。',
    params: {}, examples: ['hover'],
    tags: ['悬停', 'debug']
  },
  {
    id: 'aiview', name: 'aiview', category: '调试杂项',
    syntax: 'aiview',
    desc: '开关 AI 决策视图（显示 AI 战略目标）。',
    params: {}, examples: ['aiview'],
    tags: ['AI', '视图', 'aiview']
  }
];
