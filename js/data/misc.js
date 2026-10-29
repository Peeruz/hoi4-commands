// HOI4 资源 / 意识形态 / 建筑 / 经验 等代码映射

// 资源：中文/英文别名 -> 游戏代码
window.HOI4_RESOURCES = [
  { code: 'steel',     zh: ['钢', '钢铁', '钢材'], en: ['steel'] },
  { code: 'tungsten',  zh: ['钨', '钨矿'], en: ['tungsten'] },
  { code: 'chromium',  zh: ['铬', '铬矿'], en: ['chromium'] },
  { code: 'aluminum',  zh: ['铝', '铝矿'], en: ['aluminum', 'aluminium'] },
  { code: 'rubber',    zh: ['橡胶'], en: ['rubber'] },
  { code: 'oil',       zh: ['石油', '油'], en: ['oil'] }
];
window.resolveResource = function (text) {
  if (!text) return null;
  const t = String(text).trim().toLowerCase();
  for (const r of window.HOI4_RESOURCES) {
    if (r.code === t) return r.code;
    if (r.en.includes(t)) return r.code;
    if (r.zh.some((z) => text.includes(z))) return r.code;
  }
  return null;
};

// 意识形态：中文/英文 -> 游戏代码（用于 change_ideology / set_ruling_party / civilwar）
window.HOI4_IDEOLOGIES = [
  { code: 'democratic',      zh: ['民主', '民主主义', '自由民主'], en: ['democratic', 'democracy'] },
  { code: 'communism',       zh: ['共产', '共产主义', '马列'], en: ['communism', 'communist'] },
  { code: 'fascism',         zh: ['法西斯', '法西斯主义', '轴心', '极端民族主义'], en: ['fascism', 'fascist'] },
  { code: 'neutrality',      zh: ['中立', '不结盟'], en: ['neutrality', 'neutral'] }
];
window.resolveIdeology = function (text) {
  if (!text) return null;
  const t = String(text).trim().toLowerCase();
  for (const i of window.HOI4_IDEOLOGIES) {
    if (i.code === t) return i.code;
    if (i.en.includes(t)) return i.code;
    if (i.zh.some((z) => text.includes(z))) return i.code;
  }
  return null;
};

// 工厂类型映射：中文 -> 建筑代码（add_building / build）
window.HOI4_BUILDINGS = [
  { code: 'arms_factory',          zh: ['军用', '军工厂', '武器', '军工'], en: ['arms', 'military factory', 'mil'] },
  { code: 'industrial_complex',    zh: ['民用', '民用工厂', '工业', '工厂'], en: ['civilian', 'civ', 'industrial'] },
  { code: 'air_base',              zh: ['空军基地', '机场', '空基'], en: ['air', 'airbase'] },
  { code: 'naval_base',            zh: ['海军基地', '船坞', '港口'], en: ['naval', 'dockyard', 'navalbase'] },
  { code: 'synthetic_refinery',    zh: ['合成', '合成厂', '合成炼油厂'], en: ['synthetic', 'refinery'] },
  { code: 'fuel_silo',             zh: ['燃料库', '油库'], en: ['fuel', 'silo'] },
  { code: 'anti_air_building',     zh: ['防空', '防空炮'], en: ['anti_air', 'aa'] },
  { code: 'radar_station',         zh: ['雷达', '雷达站'], en: ['radar'] },
  { code: 'nuclear_reactor',       zh: ['核反应堆', '核弹', '核'], en: ['nuclear', 'reactor'] },
  { code: 'rocket_site',           zh: ['火箭', '火箭基地', '火箭发射'], en: ['rocket'] },
  { code: 'infrastructure',        zh: ['基建', '基础设施', '铁路'], en: ['infrastructure', 'infra'] },
  { code: 'dam',                   zh: ['水坝'], en: ['dam'] },
  { code: 'coastal_bunker',        zh: ['海岸炮', '地堡', '堡垒'], en: ['bunker', 'coastal'] }
];
window.resolveBuilding = function (text) {
  if (!text) return null;
  const t = String(text).trim().toLowerCase();
  for (const b of window.HOI4_BUILDINGS) {
    if (b.code === t) return b.code;
    if (b.en.includes(t)) return b.code;
    if (b.zh.some((z) => text.includes(z))) return b.code;
  }
  return null;
};

// 经验类型映射（xp 指令）
window.HOI4_XP = [
  { code: 'land',  zh: ['陆军', '地面', '陆地', '部队'], en: ['land', 'army'] },
  { code: 'air',   zh: ['空军', '飞机', '航空'], en: ['air'] },
  { code: 'naval', zh: ['海军', '舰船', '海上'], en: ['naval'] }
];
window.resolveXp = function (text) {
  if (!text) return null;
  const t = String(text).trim().toLowerCase();
  for (const x of window.HOI4_XP) {
    if (x.code === t) return x.code;
    if (x.en.includes(t)) return x.code;
    if (x.zh.some((z) => text.includes(z))) return x.code;
  }
  return null;
};

// 游戏速度档位
window.HOI4_SPEED_HINT = 'speed 命令参数：0=暂停, 1=正常, 2=2倍, 3=3倍, 4=4倍, 5=5倍';
