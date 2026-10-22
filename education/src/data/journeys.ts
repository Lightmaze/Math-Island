export interface LearningJourney {
  id: string;
  title: { zh: string; en: string };
  description: { zh: string; en: string };
  islands: string[];
}
/** Editorial learning sequences. These are not core-graph edges or proof dependencies. */
export const journeys: LearningJourney[] = [
  {
    id: 'waves-and-heat',
    title: { zh: '频率，怎样组织热的演化？', en: 'How do frequencies organize heat flow?' },
    description: { zh: '从复数旋转认识频率，分解周期函数，观察热流对高频的衰减，再比较离散算子的本征模式。', en: 'Meet frequencies through complex rotation, decompose a periodic function, observe high-frequency heat decay, then compare discrete eigenmodes.' },
    islands: ['complex-current', 'fourier-tide', 'heat-shore', 'spectral-lighthouse'],
  },
  {
    id: 'local-to-global',
    title: { zh: '局部的地图，能拼成世界吗？', en: 'Can local maps make a world?' },
    description: { zh: '在不同模型中分别探索理想、素谱中的点、局部函数的胶合与同调，比较理解局部与整体的工具。', en: 'Explore ideals, spectrum points, gluing of local functions, and homology in distinct models. Compare tools for understanding local and global structure.' },
    islands: ['ideal-basin', 'spectrum-marsh', 'sheaf-canopy', 'homology-cavern'],
  },
  {
    id: 'independence',
    title: { zh: '一片森林里藏着什么结构？', en: 'What structure hides in a forest?' },
    description: { zh: '从图的路径与环出发，辨认独立集，比较对称变换，再思考怎样保留结构。', en: 'Begin with graph paths and cycles, recognize independent sets, compare symmetries, and ask how structure is preserved.' },
    islands: ['graph-bridges', 'matroid-forest', 'symmetry-grove', 'functor-harbor'],
  },
  {
    id: 'chance-and-motion',
    title: { zh: '随机之中，什么会稳定下来？', en: 'What settles within randomness?' },
    description: { zh: '比较 Brownian 路径与 Bernoulli 样本均值，再讨论扩散和质量运输；每一站使用各自明确的模型。', en: 'Compare Brownian paths and Bernoulli sample means, then discuss diffusion and mass transport. Each stop uses its own specified model.' },
    islands: ['brownian-delta', 'mean-tide', 'heat-shore', 'transport-sandbar'],
  },
];
