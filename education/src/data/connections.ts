import type { Localized } from './islands';
export type { Localized } from './islands';

/** Education-only relationship labels, not core formal types or added graph edges. */
export interface ConnectionLesson {
  id: string; title: Localized; summary: Localized; lessonIds: string[]; coreRefs: string[];
  objects: Localized;
  relation: { kind: 'identity' | 'construction' | 'representation' | 'correspondence'; label: Localized; statement: Localized };
  steps: { title: Localized; body: Localized }[];
  question: Localized; answer: Localized; assumptions: Localized; boundary: Localized;
  sources: { title: string; url: string; locator: string; evidence: Localized; accessedAt: string; httpStatus?: number }[];
}

export const connections: ConnectionLesson[] = [
  {
    "id": "fourier-heat",
    "title": {
      "zh": "同一频谱，热怎样演化",
      "en": "One spectrum, evolving heat"
    },
    "summary": {
      "zh": "一个有限周期温差函数，同时显示为模态系数和热流曲线。",
      "en": "One finite periodic temperature deviation, shown as both modal coefficients and a heat-flow curve."
    },
    "lessonIds": [
      "fourier-tide",
      "heat-shore"
    ],
    "coreRefs": [
      "pm:FourierSeriesOfFunctionOfBoundedVariation",
      "pm:HeatEquation"
    ],
    "objects": {
      "zh": "周期为 2π 的函数 u₀(x)=m+Σₖ₌₁⁴ aₖsin(kx)，及其热方程演化。",
      "en": "The 2π-periodic function u₀(x)=m+Σₖ₌₁⁴ aₖsin(kx) and its heat evolution."
    },
    "relation": {
      "kind": "representation",
      "label": {
        "zh": "同一解的谱表示",
        "en": "Spectral representation of the same solution"
      },
      "statement": {
        "zh": "u(t,x)=m+Σₖ₌₁⁴ aₖe^(−k²t)sin(kx) 精确满足 u_t=u_xx；E(t)=2πm²+πΣaₖ²e^(−2k²t)，E′(t)=−2πΣk²aₖ²e^(−2k²t)≤0。",
        "en": "u(t,x)=m+Σₖ₌₁⁴ aₖe^(−k²t)sin(kx) exactly satisfies u_t=u_xx; E(t)=2πm²+πΣaₖ²e^(−2k²t), with E′(t)=−2πΣk²aₖ²e^(−2k²t)≤0."
      }
    },
    "steps": [
      {
        "title": {
          "zh": "编写一个初值",
          "en": "Set one initial condition"
        },
        "body": {
          "zh": "调节 m 和四个正弦系数；对照左侧模态柱与右侧同一函数的曲线。",
          "en": "Adjust m and the four sine coefficients; compare the modal bars with the curve of that same function."
        }
      },
      {
        "title": {
          "zh": "让时间作用在系数上",
          "en": "Evolve the coefficients"
        },
        "body": {
          "zh": "增加 t，比较频率 1 与 4 的衰减率 1 与 16；均值 m 不变。",
          "en": "Increase t and compare decay rates 1 and 16 for frequencies 1 and 4; the mean m stays fixed."
        }
      },
      {
        "title": {
          "zh": "核对能量恒等式",
          "en": "Check the energy identity"
        },
        "body": {
          "zh": "用模态表中的系数代入 E 和 E′，解释为何能量下降却不一定趋于零。",
          "en": "Substitute the modal coefficients into E and E′ and explain why decreasing energy need not tend to zero."
        }
      }
    ],
    "question": {
      "zh": "m=0.2 时，把时间持续增大，函数和能量都趋于零吗？",
      "en": "With m=0.2, do both the function and its energy tend to zero as time grows?"
    },
    "answer": {
      "zh": "不是。非零频率衰减，但 u 趋于常数 0.2，E 趋于 2π(0.2)²=0.08π。有限滑块观察不代替这个由公式得到的极限。",
      "en": "No. Nonzero modes decay, but u tends to 0.2 and E tends to 2π(0.2)²=0.08π. The limit follows from the formula, not from the finite time slider."
    },
    "assumptions": {
      "zh": "扩散系数为 1；2π 周期边界；t≥0；四个实正弦系数和实常数项。",
      "en": "Diffusivity 1; 2π-periodic boundary conditions; t≥0; four real sine coefficients and a real constant mode."
    },
    "boundary": {
      "zh": "这是有限三角多项式初值的精确解析解，显示采用浮点采样；不是任意初值 PDE 求解器，也不是波动方程或任意边界条件的结论。",
      "en": "This is an exact analytic solution for finite trigonometric-polynomial initial data, displayed with floating-point samples. It is not a general PDE solver or a claim about the wave equation or arbitrary boundaries."
    },
    "sources": [
      {
        "title": "Victor Ivrii, PDE Textbook, §6.1: Separation of variables for heat equation",
        "url": "https://www.math.toronto.edu/ivrii/PDE-textbook/Chapter6/S6.1.html",
        "locator": "Equations (6.1.4)–(6.1.7); “Other boundary conditions” and (6.1.21)",
        "evidence": {
          "zh": "实际读取模态 ODE、指数衰减、周期边界与常数模态说明；未重读全书证明。",
          "en": "Read the modal ODE, exponential decay, periodic-boundary and constant-mode passages; the textbook’s full proofs were not reverified."
        },
        "accessedAt": "2026-10-22",
        "httpStatus": 200
      },
      {
        "title": "Victor Ivrii, PDE Textbook, §4.2: Other boundary conditions",
        "url": "https://www.math.toronto.edu/ivrii/PDE-textbook/Chapter4/S4.2.html",
        "locator": "Example 4, equations (4.2.13)–(4.2.20)",
        "evidence": {
          "zh": "实际读取周期本征值与 sin/cos/复指数基；令 l=2π 得到本实验频率。",
          "en": "Read the periodic eigenvalues and sine/cosine/complex-exponential basis; setting l=2π gives the displayed frequencies."
        },
        "accessedAt": "2026-10-22",
        "httpStatus": 200
      }
    ]
  },
  {
    "id": "graph-homology",
    "title": {
      "zh": "从图的循环到同调类",
      "en": "From graph cycles to homology"
    },
    "summary": {
      "zh": "同一组 K₄ 边在图、链复形和同调商空间中保持可追踪身份。",
      "en": "The same K₄ edges retain their identities across a graph, a chain complex and its homology quotient."
    },
    "lessonIds": [
      "graph-bridges",
      "matroid-forest",
      "homology-cavern"
    ],
    "coreRefs": [
      "pm:Graph",
      "pm:Matroid",
      "pm:ChainComplex",
      "pm:HomologyOfAChainComplex"
    ],
    "objects": {
      "zh": "四个顶点、选定的 K₄ 边、可选三角面，以及 F₂ 上的边链。",
      "en": "Four vertices, selected K₄ edges, optional triangular faces, and edge chains over F₂."
    },
    "relation": {
      "kind": "construction",
      "label": {
        "zh": "由图构造链复形，再取商",
        "en": "Build a chain complex, then take a quotient"
      },
      "statement": {
        "zh": "∂₁∂₂=0；H₁=ker∂₁/im∂₂，β₁=|E|−rank∂₁−rank∂₂。没有面时 β₁=|E|−4+c；加入面只把其边界代表的循环类消去。",
        "en": "∂₁∂₂=0; H₁=ker∂₁/im∂₂ and β₁=|E|−rank∂₁−rank∂₂. With no faces, β₁=|E|−4+c; adding faces kills the cycle classes represented by their boundaries."
      }
    },
    "steps": [
      {
        "title": {
          "zh": "选择边并观察秩",
          "en": "Select edges and inspect rank"
        },
        "body": {
          "zh": "从森林走到包含一个三角圈的边集；四个顶点始终保留，包括孤立点。",
          "en": "Move from a forest to an edge set containing a triangle; retain all four vertices, including isolated ones."
        }
      },
      {
        "title": {
          "zh": "选一条链，检查边界",
          "en": "Select a chain and check its boundary"
        },
        "body": {
          "zh": "选择一组边作为 1-链。检查每个顶点处的模 2 边界，区分“链”与“循环”。",
          "en": "Choose edges as a 1-chain. Check its mod-2 boundary at every vertex to distinguish a chain from a cycle."
        }
      },
      {
        "title": {
          "zh": "填面，再问是不是同一个类",
          "en": "Fill faces and compare classes"
        },
        "body": {
          "zh": "填入已有三条边围成的面，比较该循环是否成为边界及 β₁ 的变化；检查 ∂₁∂₂ 仍为零。",
          "en": "Fill a face whose three edges are present; compare whether the cycle becomes a boundary and how β₁ changes, while checking ∂₁∂₂=0."
        }
      }
    ],
    "question": {
      "zh": "K₄ 的全部边和四个三角面都加入后，四个面边界线性独立吗？",
      "en": "After adding all K₄ edges and its four triangular faces, are the four face boundaries linearly independent?"
    },
    "answer": {
      "zh": "不是。在 F₂ 上四个面边界相加为零，因为每条边出现两次。rank∂₂=3，所以 β₁=6−3−3=0；没有三维单形时还留下一个二维同调类。",
      "en": "No. Over F₂ their sum is zero because each edge occurs twice. rank∂₂=3, so β₁=6−3−3=0; without a 3-simplex, one 2-dimensional homology class remains."
    },
    "assumptions": {
      "zh": "有限单纯复形；面要求其所有边存在；系数域为 F₂；保留四个顶点；不添加三维单形。",
      "en": "A finite simplicial complex; every face requires all its edges; coefficients are F₂; all four vertices are retained; no 3-simplex is added."
    },
    "boundary": {
      "zh": "图中的几何交叉不增加顶点。此处计算具体有限复形，不能据此忽略整数同调的挠性，也不能把所有可见闭环都称作非零同调。",
      "en": "Crossings in the drawing add no vertices. These are finite-complex calculations, not a substitute for integer torsion or a license to call every visible loop a nonzero homology class."
    },
    "sources": [
      {
        "title": "Allen Hatcher, Algebraic Topology",
        "url": "https://pi.math.cornell.edu/~hatcher/AT/AT.pdf",
        "locator": "§2.1, pp. 105–106: ∂²=0 and Hₙ=ker∂/im∂; “Homology with Coefficients”, p. 153",
        "evidence": {
          "zh": "实际读取边界平方为零、同调商群定义及 Z₂ 系数段落；K₄ 的有限秩公式由秩-零度公式特化。未重证整章。",
          "en": "Read the boundary-squared identity, homology quotient definition and Z₂-coefficient passage. The K₄ rank formula specializes rank–nullity; the whole chapter was not re-proved."
        },
        "accessedAt": "2026-10-22",
        "httpStatus": 200
      }
    ]
  },
  {
    "id": "complex-covering",
    "title": {
      "zh": "复幂映射与路径提升",
      "en": "Complex powers and lifted paths"
    },
    "summary": {
      "zh": "把同一条圆周路径同时放在复平面与覆盖空间中，保留起点和累计绕行。",
      "en": "Follow one circle path in complex coordinates and a covering space, retaining its starting lift and accumulated winding."
    },
    "lessonIds": [
      "complex-current",
      "covering-terraces"
    ],
    "coreRefs": [
      "pm:ComplexNumber",
      "pm:CoveringSpace",
      "pm:FundamentalGroup"
    ],
    "objects": {
      "zh": "p:S¹→S¹，p(z)=zⁿ；基路径 γ(t)=e^(2πiwt)；选定起点 e^(2πik/n)。",
      "en": "p:S¹→S¹, p(z)=zⁿ; base path γ(t)=e^(2πiwt); selected starting lift e^(2πik/n)."
    },
    "relation": {
      "kind": "construction",
      "label": {
        "zh": "给定起点的连续路径提升",
        "en": "Continuous path lift from a chosen start"
      },
      "statement": {
        "zh": "γ̃(t)=e^(2πi(wt+k)/n) 满足 p∘γ̃=γ。完整基闭路把纤维标签 k 送到 k+w mod n；提升闭合当且仅当 n 整除 w。",
        "en": "γ̃(t)=e^(2πi(wt+k)/n) satisfies p∘γ̃=γ. The full base loop sends fiber label k to k+w mod n; the lift closes exactly when n divides w."
      }
    },
    "steps": [
      {
        "title": {
          "zh": "先选覆盖与起点",
          "en": "Choose the covering and starting lift"
        },
        "body": {
          "zh": "设置覆盖次数 n 与纤维起点 k，区分同一基点上方的 n 个点。",
          "en": "Set the degree n and starting fiber index k, distinguishing the n points above one base point."
        }
      },
      {
        "title": {
          "zh": "推进路径而不是重选根",
          "en": "Advance the path, not a new root"
        },
        "body": {
          "zh": "改变绕数 w 和进度，观察提升点连续运动；核对提升点的 n 次幂回到当前基点。",
          "en": "Change winding w and progress; follow the continuous lift and check that its nth power is the current base point."
        }
      },
      {
        "title": {
          "zh": "读取端点置换",
          "en": "Read the endpoint permutation"
        },
        "body": {
          "zh": "走完整条基闭路，比较 k 与 k+w mod n；尝试一圈、多圈和反向绕行。",
          "en": "Complete the base loop and compare k with k+w mod n; try one turn, several turns and reverse winding."
        }
      }
    ],
    "question": {
      "zh": "三重覆盖中从 k=1 出发，让基圆正向绕一圈，再每圈重置主辐角，仍得到原来的连续提升吗？",
      "en": "In a threefold cover starting at k=1, does resetting the principal angle after one positive base turn preserve the same continuous lift?"
    },
    "answer": {
      "zh": "不能。连续提升应从标签 1 到标签 2。主辐角重置会丢掉累计角度，可能跳回错误分支；给定起点的提升必须保持连续。",
      "en": "No. The continuous lift goes from label 1 to label 2. Resetting the principal angle loses the accumulated winding and can jump to the wrong branch; the lift from a fixed start must remain continuous."
    },
    "assumptions": {
      "zh": "单位圆上的正整数 n 重覆盖；整数绕数 w；k∈{0,…,n−1}；t∈[0,1]；起点事先给定。",
      "en": "A positive-integer-degree covering of the unit circle; integer winding w; k∈{0,…,n−1}; t∈[0,1]; a fixed starting lift."
    },
    "boundary": {
      "zh": "幂映射 z 映到 zⁿ 在单位圆上是覆盖；在包含 0 的整个复平面上，n>1 时不能称为无分支覆盖。图上离散样点用于描绘解析给定的连续路径。",
      "en": "The power map is a covering on the unit circle. For n>1 it is not an unbranched covering of the entire complex plane including 0. Display samples draw an analytically defined continuous path."
    },
    "sources": [
      {
        "title": "Allen Hatcher, Algebraic Topology",
        "url": "https://pi.math.cornell.edu/~hatcher/AT/AT.pdf",
        "locator": "§1.3, pp. 56–57: p(z)=zⁿ on S¹; Proposition 1.30 and path-lifting paragraph, p. 60",
        "evidence": {
          "zh": "实际读取圆周幂覆盖例与给定起点的唯一提升段落；显式公式由代入和连续性核对，未重证一般覆盖空间分类。",
          "en": "Read the circle power-cover example and unique path lifting from a chosen start. The explicit formula is checked by substitution and continuity; general covering classification was not re-proved."
        },
        "accessedAt": "2026-10-22",
        "httpStatus": 200
      }
    ]
  },
  {
    "id": "transport-cdf",
    "title": {
      "zh": "运输成本就是累计差面积",
      "en": "Transport cost as CDF area"
    },
    "summary": {
      "zh": "同一对一维概率测度，左边搬运质量，右边累计差面积；均值相同仍可能相距很远。",
      "en": "For the same two probability measures on a line, compare transported mass with CDF-gap area; equal means need not imply zero distance."
    },
    "lessonIds": [
      "transport-sandbar",
      "mean-tide"
    ],
    "coreRefs": [
      "wikipedia:Optimal_transport",
      "pm:CumulativeDistributionFunction",
      "pm:StrongLawOfLargeNumbers"
    ],
    "objects": {
      "zh": "一维有限支撑概率测度 μ、ν，单调耦合 π，以及它们的累积分布函数 Fμ、Fν。",
      "en": "Finitely supported probability measures μ and ν on a line, a monotone coupling π, and their cumulative distribution functions Fμ and Fν."
    },
    "relation": {
      "kind": "identity",
      "label": {
        "zh": "一维 W₁ 的两种精确表达",
        "en": "Two exact expressions for one-dimensional W₁"
      },
      "statement": {
        "zh": "W₁(μ,ν)=Σᵢⱼπᵢⱼ|xᵢ−yⱼ|=∫ℝ|Fμ(x)−Fν(x)|dx；有限支撑时，积分是相邻支撑点之间矩形面积的有限和。",
        "en": "W₁(μ,ν)=Σᵢⱼπᵢⱼ|xᵢ−yⱼ|=∫ℝ|Fμ(x)−Fν(x)|dx; for finite support, the integral is a finite sum of rectangle areas between consecutive support points."
      }
    },
    "steps": [
      {
        "title": {
          "zh": "设定同一对测度",
          "en": "Set the same pair of measures"
        },
        "body": {
          "zh": "调节平移 δ、质量偏置 b 与中心概率 p；确认两侧总质量都为 1。",
          "en": "Adjust translation δ, mass bias b and central probability p; check that both measures have total mass 1."
        }
      },
      {
        "title": {
          "zh": "逐段累计差面积",
          "en": "Accumulate the CDF-gap areas"
        },
        "body": {
          "zh": "读取每个相邻支撑点区间中的 |Fμ−Fν|，乘区间长度，再求和。",
          "en": "Read |Fμ−Fν| on each interval between support points, multiply by its width, and sum."
        }
      },
      {
        "title": {
          "zh": "核对守恒与成本",
          "en": "Check marginals and cost"
        },
        "body": {
          "zh": "将面积和与单调运输的质量×距离总成本对照；使用“让两个分布相同”核对零成本。",
          "en": "Compare that area sum with the monotone plan’s mass-times-distance cost; use the matching-distribution control to check zero cost."
        }
      }
    ],
    "question": {
      "zh": "p=0.5、b=0.5、δ=0.5 时两分布均值都为 0，W₁ 就是 0 吗？",
      "en": "At p=0.5, b=0.5 and δ=0.5, both means are zero. Must W₁ also be zero?"
    },
    "answer": {
      "zh": "不是。μ 的质量为 (0.25,0.5,0.25)，位置为 (−2,0,2)；ν 在 (−1.5,0.5,2.5) 的质量为 (0.375,0.5,0.125)。累计差面积为 0.75；均值只记录分布的一部分信息。",
      "en": "No. μ has masses (0.25,0.5,0.25) at (−2,0,2); ν has masses (0.375,0.5,0.125) at (−1.5,0.5,2.5). The CDF-gap area is 0.75. A mean records only part of a distribution."
    },
    "assumptions": {
      "zh": "实直线上的单位质量概率测度；有限支撑因而一阶矩有限；成本为绝对距离；π 为单调最优耦合。",
      "en": "Probability measures of unit mass on the real line; finite support, hence finite first moments; absolute-distance cost; π is a monotone optimal coupling."
    },
    "boundary": {
      "zh": "面积恒等式属于一维 W₁；不能直接搬到高维或 W₂。离散源质量可以分拆，不能不加条件地把最优计划写成单值 Monge 映射。均值课只提供统计量的比较入口，不把 Bernoulli 模拟与这里的测度混同。",
      "en": "The CDF-area identity is for one-dimensional W₁, not arbitrary dimensions or W₂. Discrete source mass may split, so an optimal plan is not automatically a single-valued Monge map. Mean Tide supplies a comparison of statistics; its Bernoulli simulation is a separate model."
    },
    "sources": [
      {
        "title": "Gabriel Peyré and Marco Cuturi, Computational Optimal Transport",
        "url": "https://arxiv.org/pdf/1803.00567",
        "locator": "Remark 2.30, printed pp. 31–32, especially equation (2.37)",
        "evidence": {
          "zh": "实际下载 PDF 并读取 CDF 定义、分位数表达及式 (2.37)。仅使用 W₁ 的 CDF 恒等式，不把相邻 Monge 映射说明无条件用于离散原子；未重读全书证明。",
          "en": "Downloaded the PDF and read the CDF definition, quantile expression and equation (2.37). Only the W₁ CDF identity is used; nearby Monge-map language is not applied unconditionally to atomic measures. Full proofs were not reverified."
        },
        "accessedAt": "2026-10-22",
        "httpStatus": 200
      }
    ]
  },
  {
    "id": "ideal-zeros",
    "title": {
      "zh": "Bézout 系数与共同零点",
      "en": "Bézout coefficients and common zeros"
    },
    "summary": {
      "zh": "把同一对有限域多项式的理想生成元、Bézout 证据和域内共同零点并排核对。",
      "en": "Check the ideal generator, Bézout witness and field-valued common zeros of the same polynomial pair."
    },
    "lessonIds": [
      "ideal-basin",
      "finite-field-atoll",
      "zero-set-peaks"
    ],
    "coreRefs": [
      "pm:Ideal",
      "pm:FiniteField",
      "pm:BezoutDomain",
      "pm:AlgebraicSetsAndPolynomialIdeals"
    ],
    "objects": {
      "zh": "素数域 Fₚ 上一元多项式 f、g，最大公因式 d，以及 u、v 满足 uf+vg=d。",
      "en": "Univariate polynomials f and g over a prime field Fₚ, their gcd d, and polynomials u,v satisfying uf+vg=d."
    },
    "relation": {
      "kind": "identity",
      "label": {
        "zh": "理想生成与共同零点恒等式",
        "en": "Ideal-generation and common-zero identities"
      },
      "statement": {
        "zh": "(f,g)=(d)，uf+vg=d，Z_Fₚ(f)∩Z_Fₚ(g)=Z_Fₚ(d)。非零 d 取首一规范；f=g=0 时约定 d=0，理想为零且域内全部点都是零点。",
        "en": "(f,g)=(d), uf+vg=d, and Z_Fₚ(f)∩Z_Fₚ(g)=Z_Fₚ(d). Nonzero d is normalized to be monic; when f=g=0, d=0, the ideal is zero and every field point is a zero."
      }
    },
    "steps": [
      {
        "title": {
          "zh": "选定域和多项式",
          "en": "Choose the field and polynomials"
        },
        "body": {
          "zh": "选一个预设，或按常数项在前输入系数；所有运算在同一个素数域中执行。",
          "en": "Choose a preset or enter coefficients in ascending degree order; every operation uses the same prime field."
        }
      },
      {
        "title": {
          "zh": "核对 Bézout 证据",
          "en": "Check the Bézout witness"
        },
        "body": {
          "zh": "观察带余除法步骤；展开 uf+vg，逐项取模核对等于 d，并检查 d 整除 f、g。",
          "en": "Inspect the division-with-remainder steps; expand uf+vg modulo p and compare it with d, then check that d divides f and g."
        }
      },
      {
        "title": {
          "zh": "把理想与点集分开",
          "en": "Separate the ideal from its zero set"
        },
        "body": {
          "zh": "逐个代入域元素核对共同根与 d 的根；再使用“无域内零点但非单位理想”预设。",
          "en": "Evaluate every field element to compare common roots with roots of d, then use the preset with no field roots but a proper ideal."
        }
      }
    ],
    "question": {
      "zh": "在 F₃ 中，f=x²+1、g=(x+1)(x²+1) 没有共同域内零点，所以 (f,g) 是整个 F₃[x] 吗？",
      "en": "Over F₃, f=x²+1 and g=(x+1)(x²+1) have no common field-valued zero. Is (f,g) therefore all of F₃[x]?"
    },
    "answer": {
      "zh": "不是。d=x²+1 是非常数，(f,g)=(d) 是真理想；d 在 0、1、2 的值分别为 1、2、2。有限域内看不到根，不表示多项式是单位。",
      "en": "No. The nonconstant gcd d=x²+1 generates a proper ideal. Its values at 0,1,2 are 1,2,2. Having no roots inside the finite field does not make the polynomial a unit."
    },
    "assumptions": {
      "zh": "p 是素数，运算在一元多项式环 Fₚ[x] 中；Bézout 系数由欧几里得算法计算；根集合只枚举 Fₚ 中的元素。",
      "en": "p is prime and arithmetic is in the univariate polynomial ring Fₚ[x]; Bézout coefficients come from the Euclidean algorithm; the displayed roots are only elements of Fₚ."
    },
    "boundary": {
      "zh": "这一元 PID 计算不是一般多元理想的 Gröbner 基算法。域内零点集会丢失重数和扩域中的点；不能省略零点定理的代数闭域条件。",
      "en": "This univariate PID computation is not a Gröbner-basis algorithm for general multivariate ideals. Field-valued zero sets lose multiplicities and extension-field points; algebraic-closure hypotheses of the Nullstellensatz remain essential."
    },
    "sources": [
      {
        "title": "Keith Conrad, Notes on Ideals",
        "url": "https://kconrad.math.uconn.edu/blurbs/ringtheory/ideals.pdf",
        "locator": "§1, definition of (a,b); Theorem 2.1 and proof, printed p. 3",
        "evidence": {
          "zh": "实际读取生成理想的线性组合定义及 F[T] 每个理想为主理想的带余除法证明。本课由此专门推导 gcd/Bézout 与共同根等式；未宣称原文逐字给出本 UI 或重证完整讲义。",
          "en": "Read the linear-combination definition of a generated ideal and the division proof that every ideal of F[T] is principal. The lesson specializes these to gcd/Bézout and common-root identities; the notes are not claimed to describe this UI or to have been re-proved in full."
        },
        "accessedAt": "2026-10-22",
        "httpStatus": 200
      }
    ]
  },
  {
    "id": "symmetry-representation",
    "title": {
      "zh": "一个对称，三种表示",
      "en": "One symmetry, three representations"
    },
    "summary": {
      "zh": "同一个正方形对称，在复平面向量、复数公式和实矩阵乘法中使用一致的运算顺序。",
      "en": "Use the same square symmetry and composition order in complex-plane vectors, complex formulas and real matrix multiplication."
    },
    "lessonIds": [
      "symmetry-grove",
      "complex-current"
    ],
    "coreRefs": [
      "pm:DihedralGroup",
      "pm:ComplexNumber",
      "pm:GroupRepresentation"
    ],
    "objects": {
      "zh": "D₄={rᵏsᵋ}，r(z)=iz，s(z)=共轭 z；以及作用在 R² 上的 2×2 实矩阵。",
      "en": "D₄={rᵏsᵋ}, with r(z)=iz and s(z)=conjugate z, represented by 2×2 real matrices on R²."
    },
    "relation": {
      "kind": "representation",
      "label": {
        "zh": "保持复合的忠实实表示",
        "en": "A faithful real representation preserving composition"
      },
      "statement": {
        "zh": "ρ(r)=[[0,−1],[1,0]]，ρ(s)=[[1,0],[0,−1]]；ρ(AB)=ρ(A)ρ(B)。rᵏsᵋ 的复数作用是 iᵏz（ε=0）或 iᵏ共轭 z（ε=1）。",
        "en": "ρ(r)=[[0,−1],[1,0]] and ρ(s)=[[1,0],[0,−1]], with ρ(AB)=ρ(A)ρ(B). The complex action of rᵏsᵋ is iᵏz for ε=0 and iᵏconjugate(z) for ε=1."
      }
    },
    "steps": [
      {
        "title": {
          "zh": "选择同一个群元素",
          "en": "Choose the same group element"
        },
        "body": {
          "zh": "选择 A、B，对照复平面向量、复数公式和矩阵；约定 A∘B 先做 B。",
          "en": "Choose A and B and compare the complex-plane vectors, complex formulas and matrices; A∘B applies B first."
        }
      },
      {
        "title": {
          "zh": "乘矩阵并作用于点",
          "en": "Multiply matrices and act on a point"
        },
        "body": {
          "zh": "改变测试点，核对复数作用的结果与 ρ(A)ρ(B) 的坐标结果一致。",
          "en": "Change the test point and check agreement between the complex action and the coordinates obtained from ρ(A)ρ(B)."
        }
      },
      {
        "title": {
          "zh": "区分一次点重合与运算交换",
          "en": "Separate one-point agreement from commutation"
        },
        "body": {
          "zh": "交换 A、B，比较整个矩阵，而不只比较一个点的像；原点可能掩盖不交换。",
          "en": "Swap A and B and compare the full matrices rather than one point image; the origin can conceal noncommutativity."
        }
      }
    ],
    "question": {
      "zh": "A=r、B=s 时，AB 和 BA 都把 z=0 送到 0，因此 r 与 s 交换吗？",
      "en": "For A=r and B=s, both AB and BA send z=0 to 0. Does that prove r and s commute?"
    },
    "answer": {
      "zh": "不能。一个点不足以判断线性算子相等；在 z=1 上，rs(1)=i 而 sr(1)=−i。对应矩阵也不同。",
      "en": "No. One point does not determine equality of linear operators: rs(1)=i but sr(1)=−i, and the matrices differ as well."
    },
    "assumptions": {
      "zh": "D₄ 表示正方形的八个对称；r 是逆时针 90° 旋转，s 关于实轴反射；列向量；乘积从右到左作用。",
      "en": "D₄ denotes the eight square symmetries; r is a 90° counterclockwise rotation, s reflects across the real axis; vectors are columns and products act right to left."
    },
    "boundary": {
      "zh": "这是二维实表示。共轭是 R-线性而不是 C-线性，所以反射不能用一个固定复数乘法表示。实验不分类所有群表示，也不把单个点上的相等当作矩阵相等。",
      "en": "This is a two-dimensional real representation. Conjugation is R-linear but not C-linear, so reflection is not multiplication by one fixed complex scalar. The lab neither classifies all representations nor identifies matrices from one coincident point image."
    },
    "sources": [
      {
        "title": "Keith Conrad, Dihedral Groups II",
        "url": "https://kconrad.math.uconn.edu/blurbs/grouptheory/dihedral2.pdf",
        "locator": "§1, Theorem 1.1; printed p. 3, geometric realization in GL₂(R)",
        "evidence": {
          "zh": "实际读取二面体生成关系与 GL₂(R) 的旋转/反射矩阵段落。令 n=4，并把 (x,y) 写为 x+iy 核对复数与矩阵作用；未重读全文证明。",
          "en": "Read the dihedral generator relations and the geometric rotation/reflection matrices in GL₂(R). Set n=4 and identify (x,y) with x+iy to check the complex action; full proofs were not reverified."
        },
        "accessedAt": "2026-10-22",
        "httpStatus": 200
      }
    ]
  }
];
