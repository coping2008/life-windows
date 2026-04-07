/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  Info, 
  Unlock, 
  Lock, 
  Clock, 
  LayoutGrid, 
  List, 
  X, 
  AlertTriangle,
  RefreshCw,
  Search
} from 'lucide-react';

interface LifeWindow {
  title: string;
  cat: string;
  s: number;
  e: number;
  lock: string;
  cost: 'Low' | 'Medium' | 'High' | 'Extreme' | 'N/A';
  desc: string;
}

const INITIAL_DATA: LifeWindow[] = [
  /* 一、 学业、职场与社会身份 */
  { title: "第一学历跃迁", cat: "学业、职场与社会身份", s: 18, e: 25, lock: "70%", cost: "High", desc: "第一学历含金量对初职影响极大。错过后进入名企门槛极高，社会人员跨考代价巨大。" },
  { title: "应届生身份窗口", cat: "学业、职场与社会身份", s: 21, e: 23, lock: "85%", cost: "High", desc: "大厂校招、考公考编的专属保护期。失去后需走社招，面临全社会残酷竞争。" },
  { title: "高强度专业训练窗口", cat: "学业、职场与社会身份", s: 15, e: 28, lock: "55%", cost: "High", desc: "“1万小时定律”黄金期。此时期需极高专注和低打扰环境，后期极难再有纯粹投入。" },
  { title: "高强度试错创业窗口", cat: "学业、职场与社会身份", s: 22, e: 32, lock: "60%", cost: "High", desc: "无房贷无子女精力巅峰。错过后因生活成本和责任绑定，风险承受力大幅萎缩。" },
  { title: "职业身份背书红利口", cat: "学业、职场与社会身份", s: 18, e: 35, lock: "55%", cost: "Medium", desc: "获取名企经历或核心项目背书，能为生涯提供溢价。越晚获取边际效应越低。" },
  { title: "行业红利切入窗口", cat: "学业、职场与社会身份", s: 22, e: 35, lock: "50%", cost: "Medium", desc: "抓住时代红利（如AI、新能源）。趋势杠杆下个人努力将被成倍放大。" },
  { title: "个人品牌冷启动窗口", cat: "学业、职场与社会身份", s: 18, e: 28, lock: "35%", cost: "Medium", desc: "受众对年轻人试错包容度高。利用该窗口建立IP，沉淀早期粉丝和品牌基调。" },
  { title: "第一核心基本盘护城河", cat: "学业、职场与社会身份", s: 25, e: 35, lock: "65%", cost: "High", desc: "形成难以替代的核心技能或资源壁垒，以抵御35岁后的职场清退风险。" },
  { title: "内容资产指数级启动", cat: "学业、职场与社会身份", s: 25, e: 35, lock: "20%", cost: "Low", desc: "建立边际成本递减的数字资产。前期回报低，但随时间推移能形成强大长尾复利。" },
  { title: "权力与组织政治第一觉醒期", cat: "学业、职场与社会身份", s: 25, e: 35, lock: "15%", cost: "Low", desc: "从单纯做事向做局思维转变。过晚觉醒会导致在组织架构中长期处于被动执行。" },
  { title: "独立技术产品闭环期", cat: "学业、职场与社会身份", s: 20, e: 35, lock: "50%", cost: "Medium", desc: "利用高专注走通单人商业闭环（如独立游戏、应用开发）。提升系统性思维，跑通第二曲线。" },

  /* 二、 财富、资产与迁移 */
  { title: "跨城/跨国迁移低成本窗口", cat: "财富、资产与迁移", s: 18, e: 30, lock: "65%", cost: "High", desc: "房贷婚姻未形成重力抽吸。此阶段迁移的时间、经济和心理成本极低，改盘最佳期。" },
  { title: "全球化身份流动窗口", cat: "财富、资产与迁移", s: 20, e: 40, lock: "70%", cost: "High", desc: "受政策和家庭绑定影响。获取跨国经验、资产或多重身份的最佳操作期。" },
  { title: "财务复利启动窗口", cat: "财富、资产与迁移", s: 20, e: 30, lock: "30%", cost: "Medium", desc: "第一笔养老金或定投时间。越早启动复利越惊人，晚年实现财务自由难度降低。" },
  { title: "财富初始积累与购房上车", cat: "财富、资产与迁移", s: 25, e: 35, lock: "40%", cost: "High", desc: "通过高强度劳动或聪明杠杆完成原始积累，获取核心资产入场券。" },
  { title: "风险兜底安全垫构建阶段", cat: "财富、资产与迁移", s: 25, e: 35, lock: "45%", cost: "High", desc: "在家庭负担最轻时，配置重疾险并建立家庭应急现金池。" },
  { title: "大宗资产加杠杆窗口", cat: "财富、资产与迁移", s: 30, e: 45, lock: "60%", cost: "High", desc: "利用收入最稳定时配置资产。年龄过大银行批贷年限缩短，月供压力剧增。" },
  { title: "信用修复窗口", cat: "财富、资产与迁移", s: 18, e: 40, lock: "68%", cost: "High", desc: "遭遇债务问题利用赚钱能力修复征信。利息越拖越大，晚年翻盘几乎无可能。" },
  { title: "保险杠杆配置底线", cat: "财富、资产与迁移", s: 22, e: 35, lock: "100%", cost: "Extreme", desc: "核保极其严苛。体检异常将面临拒保，彻底失去低成本转移大病风险资格。" },

  /* 三、 身体硬指标与健康 */
  { title: "身体硬指标巅峰训练", cat: "身体硬指标与健康", s: 18, e: 22, lock: "80%", cost: "Extreme", desc: "耐力、爆发力上限在该阶段基本锁死。此后主要靠维持，极难突破提升。" },
  { title: "深睡眠与极限通宵恢复阀门", cat: "身体硬指标与健康", s: 15, e: 25, lock: "90%", cost: "Extreme", desc: "通宵补觉即回血生理特权。28岁左右阀门关闭，通宵将引发脏器系统性损伤。" },
  { title: "身体透支可逆窗口", cat: "身体硬指标与健康", s: 18, e: 40, lock: "75%", cost: "High", desc: "早期不良习惯是可逆的。一旦超过窗口，损伤将固化为慢性病。" },
  { title: "骨密度绝对峰值储蓄期", cat: "身体硬指标与健康", s: 18, e: 30, lock: "90%", cost: "Extreme", desc: "骨量在30岁达峰。若未存够骨本，晚年面临严重的骨质疏松风险。" },
  { title: "基础代谢断崖式适应与重构", cat: "身体硬指标与健康", s: 25, e: 32, lock: "80%", cost: "High", desc: "吃不胖特权收回。必须戒除高糖碳习惯，否则代谢异常引发肥胖。" },
  { title: "牙齿正畸黄金期", cat: "身体硬指标与健康", s: 12, e: 18, lock: "60%", cost: "High", desc: "利用颌骨生长事半功倍。成年后强行矫正易导致牙套脸及复发风险。" },
  { title: "慢性光损伤可逆期", cat: "身体硬指标与健康", s: 3, e: 25, lock: "85%", cost: "High", desc: "视觉损伤早期受控。一旦眼轴变形固定，手术仅能辅助修复。" },
  { title: "长相结构性定型到高点", cat: "身体硬指标与健康", s: 22, e: 30, lock: "25%", cost: "Medium", desc: "面部骨骼和软组织发育成熟。颜值达峰期，此后进入全面抗衰老阶段。" },
  { title: "无氧体力极限流失防御", cat: "身体硬指标与健康", s: 30, e: 45, lock: "62%", cost: "High", desc: "肌肉流失速度加快。必须规律抗阻训练维持基础代谢和体态。" },
  { title: "重大疾病第一早筛与干预", cat: "身体硬指标与健康", s: 35, e: 45, lock: "95%", cost: "Extreme", desc: "肿瘤高发重疾首筛。错过往往将“早期切除”拖成“晚期化疗”，摧毁财务。" },

  /* 四、 认知、心智与技术适应 */
  { title: "语言学习黄金期", cat: "认知、心智与技术适应", s: 3, e: 15, lock: "45%", cost: "Medium", desc: "口音和吸收能力的窗口。成年后脑效率下降，需付出极大切刻意练习成本。" },
  { title: "心智原动力与少年气窗口", cat: "认知、心智与技术适应", s: 15, e: 28, lock: "85%", cost: "Extreme", desc: "纯粹好奇心与热爱的保留。错过该窗口，易变成对任何事物祛魅的成年人。" },
  { title: "底层深度阅读与心智构建", cat: "认知、心智与技术适应", s: 12, e: 25, lock: "88%", cost: "Extreme", desc: "在被碎片化信息接管前，建立长文本阅读能力和逻辑思辨能力的最后防线。" },
  { title: "认知框架重塑窗口", cat: "认知、心智与技术适应", s: 18, e: 35, lock: "45%", cost: "High", desc: "大脑神经可塑性最高期。此后改变根深蒂固思维模式难度剧增。" },
  { title: "跨学科知识横跳", cat: "认知、心智与技术适应", s: 18, e: 32, lock: "45%", cost: "High", desc: "在大脑定型前建立跨领域链接，培养触类旁通的创新能力。" },
  { title: "颠覆性技术底层逻辑内化", cat: "认知、心智与技术适应", s: 18, e: 35, lock: "60%", cost: "High", desc: "对AI等新范式接受度最高期。错过易陷入旧经验主义面临淘汰风险。" },
  { title: "原生家庭创伤第一脱敏期", cat: "认知、心智与技术适应", s: 18, e: 28, lock: "65%", cost: "Medium", desc: "利用物理隔离和经济独立，是重塑个人边界、反击有毒家庭的节点。" },
  { title: "性格内力与分化定格期", cat: "认知、心智与技术适应", s: 16, e: 25, lock: "90%", cost: "Extreme", desc: "内核塑造期。底色（乐观 vs 无助）一旦成型极难更改。不可逆遭遇彻底定性。" },
  { title: "驱动力转换期", cat: "认知、心智与技术适应", s: 25, e: 35, lock: "70%", cost: "High", desc: "从追求感官刺激向享受延迟满足转换。失败者易陷入空虚成瘾。" },

  /* 五、 婚恋、家庭与人际关系 */
  { title: "婚恋高配匹配窗口", cat: "婚恋、家庭与人际关系", s: 20, e: 35, lock: "40%", cost: "Medium", desc: "择偶池最大、能量状态兼容阶段。错过后筛选逻辑质变，妥协成分增加。" },
  { title: "生育窗口", cat: "婚恋、家庭与人际关系", s: 24, e: 38, lock: "95%", cost: "Extreme", desc: "生理极限严格锁死。错过后成本极高成功率下降，伴随更高风险。" },
  { title: "生育力冷冻/保留", cat: "婚恋、家庭与人际关系", s: 25, e: 35, lock: "80%", cost: "Extreme", desc: "暂无计划时的最佳冷冻期。为未来的生育权购买最稳妥的后悔药。" },
  { title: "亲子早期陪伴窗口", cat: "婚恋、家庭与人际关系", s: 0, e: 12, lock: "58%", cost: "High", desc: "建立亲密依恋关系的决定期。一旦错过，青春期隔阂往往需要一生弥补。" },
  { title: "重大关系试错与重建期", cat: "婚恋、家庭与人际关系", s: 18, e: 30, lock: "62%", cost: "High", desc: "有心力去试错分手并建立高质量链接。错误关系成本随年龄增长剧增。" },
  { title: "深度社交资产建设", cat: "婚恋、家庭与人际关系", s: 20, e: 35, lock: "38%", cost: "Medium", desc: "基于纯粹共鸣建立友谊最后期。此后社交多基于利益交换，毫无功利心的羁绊极难重现。" },
  { title: "老人安宁照护窗口", cat: "婚恋、家庭与人际关系", s: 40, e: 60, lock: "90%", cost: "N/A", desc: "与父母深度告别、修复关系的最后窗口。一旦去世该窗口彻底闭合，遗憾终生。" },
  { title: "自我认同与社会时钟解绑期", cat: "婚恋、家庭与人际关系", s: 35, e: 45, lock: "60%", cost: "High", desc: "接纳自身平庸或上限，心理重建完成。后半生不再为他人规定的成功模版买单。" }
];

const CATEGORIES = [
  "学业、职场与社会身份",
  "财富、资产与迁移",
  "身体硬指标与健康",
  "认知、心智与技术适应",
  "婚恋、家庭与人际关系"
];

export default function App() {
  const [age, setAge] = useState(25);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [data, setData] = useState<LifeWindow[]>(() => {
    const saved = localStorage.getItem('life_window_data');
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });
  const [selectedItem, setSelectedItem] = useState<LifeWindow | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newItem, setNewItem] = useState<Partial<LifeWindow>>({
    cat: CATEGORIES[0],
    cost: 'Medium'
  });

  useEffect(() => {
    localStorage.setItem('life_window_data', JSON.stringify(data));
  }, [data]);

  const getStatus = (age: number, s: number, e: number) => {
    if (age < s) return { type: 'future', label: '未来窗口', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' };
    if (age <= e) return { type: 'open', label: '窗口开放中', icon: Unlock, color: 'text-green-500', bg: 'bg-green-50', border: 'border-green-200' };
    return { type: 'locked', label: '窗口已关闭', icon: Lock, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' };
  };

  const getCostColor = (cost: string) => {
    switch (cost) {
      case 'Extreme': return 'text-red-800';
      case 'High': return 'text-red-600';
      case 'Medium': return 'text-orange-500';
      case 'Low': return 'text-green-500';
      default: return 'text-gray-400';
    }
  };

  const groupedData = useMemo(() => {
    return CATEGORIES.reduce((acc, cat) => {
      acc[cat] = data.filter(item => item.cat === cat);
      return acc;
    }, {} as Record<string, LifeWindow[]>);
  }, [data]);

  const handleDelete = (e: React.MouseEvent, title: string) => {
    e.stopPropagation();
    if (window.confirm(`确定要删除窗口【${title}】吗？`)) {
      setData(prev => prev.filter(item => item.title !== title));
    }
  };

  const handleSave = () => {
    if (!newItem.title || !newItem.s || !newItem.e) {
      alert('请填写完整信息');
      return;
    }
    setData(prev => [...prev, newItem as LifeWindow]);
    setIsAddModalOpen(false);
    setNewItem({ cat: CATEGORIES[0], cost: 'Medium' });
  };

  const handleReset = () => {
    if (window.confirm('确定要恢复系统默认全量数据吗？这将清除您的自定义修改。')) {
      setData(INITIAL_DATA);
      localStorage.removeItem('life_window_data');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#333] font-sans pb-20">
      {/* Top Nav */}
      <nav className="sticky top-0 z-40 bg-white/98 border-b border-[#EBEEEF] shadow-sm px-6 py-4 flex items-center justify-between gap-8">
        <div className="flex items-center gap-2">
          <span className="font-black text-xl tracking-tight">人生重构计划</span>
          <span className="text-xs text-gray-400 font-medium hidden sm:inline">V8.0 全量监测台</span>
        </div>

        <div className="flex-1 max-w-2xl flex items-center gap-6">
          <div className="text-center min-w-[80px]">
            <motion.h1 
              key={age}
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className={`text-5xl font-black tabular-nums transition-colors drop-shadow-sm ${age > 45 ? 'text-red-500' : 'text-green-500'}`}
            >
              {age}
            </motion.h1>
          </div>
          <input 
            type="range" 
            min="1" 
            max="95" 
            value={age} 
            onChange={(e) => setAge(parseInt(e.target.value))}
            style={{
              background: `linear-gradient(to right, ${age > 45 ? '#EF4444' : '#22C55E'} 0%, ${age > 45 ? '#EF4444' : '#22C55E'} ${(age / 95) * 100}%, #E5E7EB ${(age / 95) * 100}%, #E5E7EB 100%)`
            }}
            className="flex-1 h-2 rounded-lg appearance-none cursor-pointer transition-all hover:h-2.5"
          />
        </div>

        <div className="flex bg-[#F5F7FA] p-1 rounded-lg border border-[#EBEEEF]">
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-black' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <LayoutGrid size={18} />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-black' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <List size={18} />
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        {CATEGORIES.map(cat => (
          <section key={cat} className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-6 bg-black rounded-full" />
              <h2 className="text-xl font-black text-gray-800">{cat}</h2>
            </div>

            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5' : 'flex flex-col gap-3'}>
              <AnimatePresence mode="popLayout">
                {groupedData[cat].map((item) => {
                  const status = getStatus(age, item.s, item.e);
                  const StatusIcon = status.icon;

                  if (viewMode === 'grid') {
                    return (
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        key={item.title}
                        onClick={() => setSelectedItem(item)}
                        className={`group relative bg-white rounded-xl p-5 border-t-4 border-l border-r border-b border-[#EBEEEF] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer ${status.type === 'locked' ? 'grayscale-[0.7] opacity-85' : ''}`}
                        style={{ borderTopColor: `var(--${status.type === 'locked' ? 'status-danger' : status.type === 'future' ? 'status-null' : 'status-open'})` }}
                      >
                        <button 
                          onClick={(e) => handleDelete(e, item.title)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-gray-400 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-500 transition-all shadow-md z-10"
                        >
                          <X size={14} />
                        </button>

                        <div className="flex justify-between items-start mb-4 pb-3 border-b border-dashed border-gray-100">
                          <div className={`flex items-center gap-1.5 text-xs font-black ${status.color}`}>
                            <StatusIcon size={14} />
                            {status.label}
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-gray-400 font-bold block leading-tight">最佳执行期</span>
                            <span className="text-sm font-black">{item.s} - {item.e} 岁</span>
                          </div>
                        </div>

                        <h3 className={`text-lg font-black mb-2 leading-tight min-h-[3rem] line-clamp-2 ${status.type === 'locked' ? 'line-through text-gray-400' : ''}`}>
                          {item.title}
                        </h3>
                        <p className="text-xs text-gray-400 leading-relaxed line-clamp-3 flex-1">
                          {item.desc}
                        </p>

                        <div className="mt-5 flex justify-between bg-gray-50/50 p-3 rounded-lg border border-gray-100">
                          <div className="flex flex-col">
                            <span className="text-[10px] text-gray-400 font-bold">锁死强制力</span>
                            <span className="text-sm font-black">{item.lock}</span>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-[10px] text-gray-400 font-bold">事后补救代价</span>
                            <span className={`text-sm font-black ${getCostColor(item.cost)}`}>{item.cost}</span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  }

                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={item.title}
                      onClick={() => setSelectedItem(item)}
                      className={`group relative bg-white rounded-xl p-4 border-l-4 border border-[#EBEEEF] flex items-center gap-6 hover:bg-gray-50 transition-all cursor-pointer ${status.type === 'locked' ? 'grayscale-[0.7] opacity-85' : ''}`}
                      style={{ borderLeftColor: status.type === 'locked' ? '#F5222D' : status.type === 'future' ? '#BFBFBF' : '#52C41A' }}
                    >
                      <div className={`w-28 flex items-center gap-1.5 text-xs font-black ${status.color}`}>
                        <StatusIcon size={14} />
                        {status.label}
                      </div>
                      <div className="w-20 font-black text-sm">{item.s}-{item.e} 岁</div>
                      <div className={`flex-1 font-black text-base ${status.type === 'locked' ? 'line-through text-gray-400' : ''}`}>{item.title}</div>
                      <div className="hidden lg:block flex-[2] text-xs text-gray-400 truncate">{item.desc}</div>
                      <div className="w-24 text-right">
                        <span className="text-[10px] text-gray-400 font-bold block">补救代价</span>
                        <span className={`text-sm font-black ${getCostColor(item.cost)}`}>{item.cost}</span>
                      </div>
                      <button 
                        onClick={(e) => handleDelete(e, item.title)}
                        className="w-8 h-8 text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </section>
        ))}
      </main>

      {/* FAB */}
      <button 
        onClick={() => setIsAddModalOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-black text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-40"
      >
        <Plus size={28} />
      </button>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl overflow-hidden"
            >
              <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>

              {(() => {
                const status = getStatus(age, selectedItem.s, selectedItem.e);
                const StatusIcon = status.icon;
                return (
                  <>
                    <div className={`flex items-center gap-1.5 text-xs font-black mb-4 ${status.color}`}>
                      <StatusIcon size={14} />
                      {status.label}
                    </div>
                    <h2 className="text-3xl font-black mb-6 leading-tight">{selectedItem.title}</h2>
                    
                    {/* Timeline visualization */}
                    <div className="relative h-2 bg-gray-100 rounded-full mb-12 mt-8">
                      <div 
                        className="absolute h-full bg-green-500/30 rounded-full"
                        style={{ left: `${(selectedItem.s / 95) * 100}%`, width: `${((selectedItem.e - selectedItem.s) / 95) * 100}%` }}
                      />
                      <div 
                        className="absolute w-1 h-6 bg-black -top-2 rounded-full shadow-lg"
                        style={{ left: `${(age / 95) * 100}%` }}
                      >
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-black bg-black text-white px-1.5 py-0.5 rounded">
                          {age}岁
                        </div>
                      </div>
                      <div className="absolute -bottom-6 left-0 text-[10px] font-bold text-gray-400">0</div>
                      <div className="absolute -bottom-6 right-0 text-[10px] font-bold text-gray-400">95</div>
                      <div className="absolute -bottom-6 font-bold text-[10px]" style={{ left: `${(selectedItem.s / 95) * 100}%`, transform: 'translateX(-50%)' }}>{selectedItem.s}岁</div>
                      <div className="absolute -bottom-6 font-bold text-[10px]" style={{ left: `${(selectedItem.e / 95) * 100}%`, transform: 'translateX(-50%)' }}>{selectedItem.e}岁</div>
                    </div>

                    <p className="text-gray-500 leading-relaxed mb-8 text-lg">
                      {selectedItem.desc}
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                        <span className="text-xs text-gray-400 font-bold block mb-1">锁死强制力</span>
                        <span className="text-2xl font-black">{selectedItem.lock}</span>
                      </div>
                      <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                        <span className="text-xs text-gray-400 font-bold block mb-1">事后补救代价</span>
                        <span className={`text-2xl font-black ${getCostColor(selectedItem.cost)}`}>{selectedItem.cost}</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => setSelectedItem(null)}
                      className="w-full mt-8 py-4 bg-black text-white rounded-2xl font-black text-lg hover:opacity-90 active:scale-95 transition-all"
                    >
                      我知道了
                    </button>
                  </>
                );
              })()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl"
            >
              <h3 className="text-2xl font-black mb-6">添加自定义窗口</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-black text-gray-400 uppercase tracking-wider block mb-1.5">窗口名称</label>
                  <input 
                    type="text" 
                    placeholder="如：环游世界启动期"
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                    value={newItem.title || ''}
                    onChange={e => setNewItem(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-gray-400 uppercase tracking-wider block mb-1.5">所属维度</label>
                  <select 
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                    value={newItem.cat}
                    onChange={e => setNewItem(prev => ({ ...prev, cat: e.target.value }))}
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-black text-gray-400 uppercase tracking-wider block mb-1.5">起始岁</label>
                    <input 
                      type="number" 
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                      value={newItem.s || ''}
                      onChange={e => setNewItem(prev => ({ ...prev, s: parseInt(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black text-gray-400 uppercase tracking-wider block mb-1.5">结束岁</label>
                    <input 
                      type="number" 
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                      value={newItem.e || ''}
                      onChange={e => setNewItem(prev => ({ ...prev, e: parseInt(e.target.value) }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-black text-gray-400 uppercase tracking-wider block mb-1.5">锁死强制力</label>
                    <input 
                      type="text" 
                      placeholder="如: 60%"
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                      value={newItem.lock || ''}
                      onChange={e => setNewItem(prev => ({ ...prev, lock: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black text-gray-400 uppercase tracking-wider block mb-1.5">补救代价</label>
                    <select 
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                      value={newItem.cost}
                      onChange={e => setNewItem(prev => ({ ...prev, cost: e.target.value as any }))}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Extreme">Extreme</option>
                      <option value="N/A">N/A</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black text-gray-400 uppercase tracking-wider block mb-1.5">详细描述</label>
                  <textarea 
                    rows={3}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black/5 transition-all resize-none"
                    value={newItem.desc || ''}
                    onChange={e => setNewItem(prev => ({ ...prev, desc: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-black hover:bg-gray-200 transition-all"
                >
                  取消
                </button>
                <button 
                  onClick={handleSave}
                  className="flex-[2] py-3 bg-black text-white rounded-xl font-black hover:opacity-90 transition-all"
                >
                  保存窗口
                </button>
              </div>

              <button 
                onClick={handleReset}
                className="w-full mt-6 text-[10px] text-red-400 font-bold uppercase tracking-widest hover:text-red-600 transition-colors flex items-center justify-center gap-1"
              >
                <RefreshCw size={10} />
                危险操作：恢复系统默认全量数据
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global CSS for Tailwind Theme */}
      <style>{`
        :root {
          --status-open: #22C55E;
          --status-danger: #EF4444;
          --status-null: #BFBFBF;
        }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: #fff;
          cursor: pointer;
          border: 3px solid currentColor;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          transition: all 0.2s ease;
        }
        input[type=range]:active::-webkit-slider-thumb {
          transform: scale(1.2);
          box-shadow: 0 6px 18px rgba(0,0,0,0.2);
        }
        input[type=range]::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #fff;
          cursor: pointer;
          border: 3px solid currentColor;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          transition: all 0.2s ease;
        }
        input[type=range]:active::-moz-range-thumb {
          transform: scale(1.2);
        }
      `}</style>
    </div>
  );
}
