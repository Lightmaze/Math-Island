// Original educational interpretation layer. Source graph files remain read-only.
// Teaching positions and domains are independent of the core atlas layout/classification.
export interface Localized { zh: string; en: string; }
export interface Island {
  id: string; coreId: string; coreRefs: string[]; title: Localized; subtitle: Localized;
  domain: string; object: Localized; ecology: Localized; color: string; labKey: string;
  level: 'explore' | 'structure' | 'frontier'; prerequisites: Localized;
  steps: { title: Localized; body: Localized }[]; question: Localized; answer: Localized;
  boundary: Localized; continuation: Localized; sources: { title: string; url: string }[];
  x: number; y: number;
}

export const islands: Island[] = [
  {
    "id": "prime-reef",
    "coreId": "pm:SieveOfEratosthenes",
    "coreRefs": [
      "pm:SieveOfEratosthenes",
      "pm:QuadraticSieve"
    ],
    "title": {
      "zh": "素数礁",
      "en": "Prime Reef"
    },
    "subtitle": {
      "zh": "让合数退潮，留下质数",
      "en": "Sift multiples; reveal primes"
    },
    "domain": "数论与算术",
    "object": {
      "zh": "整数区间中的素数与整除关系；以埃拉托斯特尼筛观察有条件的排除。",
      "en": "Primes and divisibility in an integer interval, explored through the sieve of Eratosthenes."
    },
    "ecology": {
      "zh": "礁格是整数；同一轮退潮标出一个质数的合数倍数。每轮排除的依据都是当前质数的整除关系。",
      "en": "Reef cells are integers. Each receding tide marks composite multiples of one prime; divisibility by the current prime justifies that round of elimination."
    },
    "color": "#247c8d",
    "labKey": "sieve",
    "level": "explore",
    "prerequisites": {
      "zh": "整数、倍数与平方。",
      "en": "Integers, multiples, and squares."
    },
    "steps": [
      {
        "title": {
          "zh": "辨认礁格",
          "en": "Read the reef"
        },
        "body": {
          "zh": "先把 1 与质数、合数分开；1 不是质数，也不是合数。",
          "en": "Separate 1 from primes and composites: it belongs to neither class."
        }
      },
      {
        "title": {
          "zh": "执行一轮",
          "en": "Run a round"
        },
        "body": {
          "zh": "选定当前质数 p，从 p² 开始划去未超过 N 的倍数，保留 p 本身。",
          "en": "For the current prime p, cross out multiples from p² through N, retaining p itself."
        }
      },
      {
        "title": {
          "zh": "解释停止",
          "en": "Explain the stopping rule"
        },
        "body": {
          "zh": "当 p²>N 时停止：任意不超过 N 的合数至少有一个不超过 √N 的质因子。",
          "en": "Stop when p²>N: every composite at most N has a prime factor at most √N."
        }
      }
    ],
    "question": {
      "zh": "筛过 2、3、5 后，49 还活着。能据此宣布 49 是质数吗？",
      "en": "After sifting 2, 3, and 5, 49 remains. Can it already be declared prime?"
    },
    "answer": {
      "zh": "不能。7²=49；只有处理到 7，或已经满足平方根停止条件，才能排除这个误判。",
      "en": "No. Since 7²=49, the round for 7 is still needed unless the valid square-root stopping condition has already been met."
    },
    "boundary": {
      "zh": "本页采用修正后的筛程：从 p² 划去，绝不划掉 p。来源已记录这一处原文错误；二次筛处理整数分解，不是本页素数列表的直接升级。",
      "en": "This lesson uses the corrected procedure: start at p² and never remove p. The source carries a recorded error here. The quadratic sieve concerns factorization, not a direct replacement for this prime-listing demonstration."
    },
    "continuation": {
      "zh": "沿筛法继续研究局部整除约束、筛权与素数分布；筛后幸存不是一个未证明命题的证明。",
      "en": "Continue toward sieve weights, local divisibility constraints, and prime distribution. Survival of a sieve is not proof of an unproved conjecture."
    },
    "sources": [
      {
        "title": "sieve of Eratosthenes",
        "url": "https://github.com/planetmath/11_Number_theory/blob/master/11A41-SieveOfEratosthenes.tex"
      },
      {
        "title": "quadratic sieve",
        "url": "https://github.com/planetmath/11_Number_theory/blob/master/11Y05-QuadraticSieve.tex"
      }
    ],
    "x": 13,
    "y": 16
  },
  {
    "id": "elliptic-garden",
    "coreId": "pm:EllipticCurve",
    "coreRefs": [
      "pm:EllipticCurve",
      "pm:ModularForm"
    ],
    "title": {
      "zh": "椭圆曲线园",
      "en": "Elliptic Garden"
    },
    "subtitle": {
      "zh": "割线与切线，让点相加",
      "en": "Add points with chords and tangents"
    },
    "domain": "数论与算术",
    "object": {
      "zh": "实数域上 y²=x³+ax+b 的非奇异射影曲线，连同无穷远点 O；图面只显示其实仿射部分。",
      "en": "The nonsingular projective curve y²=x³+ax+b over the reals, together with its point at infinity O; the drawing shows only its real affine part."
    },
    "ecology": {
      "zh": "枝条是满足曲线方程的实点；割线把三个交点联系起来，关于 x 轴的反射完成加法。O 是规则中的单位元。",
      "en": "Branches are real points satisfying the equation. A chord relates three intersections, and reflection across the x-axis completes addition. O is the identity element."
    },
    "color": "#247c8d",
    "labKey": "elliptic",
    "level": "frontier",
    "prerequisites": {
      "zh": "坐标、三次多项式、函数斜率；群可在本页逐步认识。",
      "en": "Coordinates, cubic polynomials, and slopes; the group structure can be learned here."
    },
    "steps": [
      {
        "title": {
          "zh": "先看判别式",
          "en": "Check nonsingularity"
        },
        "body": {
          "zh": "在非奇异曲线 y²=x³−x+1 与奇异对照 y²=x³ 之间切换，观察 Δ=−16(4a³+27b²)。Δ=0 时，当前椭圆曲线群规则的前提失效。",
          "en": "Switch between the nonsingular curve y²=x³−x+1 and the singular comparison y²=x³, inspecting Δ=−16(4a³+27b²). At Δ=0 the assumptions of this elliptic-curve group law fail."
        }
      },
      {
        "title": {
          "zh": "用割线相加",
          "en": "Add with a chord"
        },
        "body": {
          "zh": "选择割线情形，读取已给出的 P=(0,1)、Q=(1,1)；把第三交点 R 关于 x 轴反射得到 P+Q。再切换到 P=Q 的切线情形。",
          "en": "Select the secant construction with the supplied points P=(0,1) and Q=(1,1). Reflect the third intersection R across the x-axis to obtain P+Q, then switch to the tangent case P=Q."
        }
      },
      {
        "title": {
          "zh": "追问图外的点",
          "en": "Include the missing point"
        },
        "body": {
          "zh": "选择互逆情形 Q=−P，观察割线竖直而和为 O。不能因为 O 没画在仿射坐标里就把运算判为无解。",
          "en": "Select the inverse case Q=−P: the chord is vertical and the sum is O. An affine drawing omitting O does not make the operation undefined."
        }
      }
    ],
    "question": {
      "zh": "P=(x,y) 与 Q=(x,−y) 的和是坐标原点 (0,0) 吗？",
      "en": "Is the sum of P=(x,y) and Q=(x,−y) the coordinate origin (0,0)?"
    },
    "answer": {
      "zh": "一般不是。它们的和是曲线的无穷远点 O；(0,0) 甚至未必在这条曲线上。",
      "en": "Generally no: the sum is the point at infinity O. The coordinate origin may not even lie on the curve."
    },
    "boundary": {
      "zh": "实验提供 y²=x³−x+1 的割线、切线、互逆预设，以及 y²=x³ 的奇异对照；不支持任意参数和点。实图只是一般椭圆曲线的一部分；不同底域与奇异曲线需要另述条件。",
      "en": "The lab supplies secant, tangent, and inverse presets on y²=x³−x+1, plus the singular comparison y²=x³; parameters and points are not arbitrary. A real plot shows only part of elliptic-curve theory; other base fields and singular curves require their own conditions."
    },
    "continuation": {
      "zh": "继续研究 E(Q) 的有限生成群结构、有限域上的点数以及椭圆曲线与模形式的文献桥梁。",
      "en": "Continue to the finitely generated group E(Q), point counts over finite fields, and the documented bridge between elliptic curves and modular forms."
    },
    "sources": [
      {
        "title": "elliptic curve",
        "url": "https://github.com/planetmath/11_Number_theory/blob/master/11G07-EllipticCurve.tex"
      },
      {
        "title": "modular form",
        "url": "https://github.com/planetmath/11_Number_theory/blob/master/11F11-ModularForm.tex"
      }
    ],
    "x": 28,
    "y": 10
  },
  {
    "id": "symmetry-grove",
    "coreId": "pm:DihedralGroup",
    "coreRefs": [
      "pm:DihedralGroup",
      "pm:Group"
    ],
    "title": {
      "zh": "对称林",
      "en": "Symmetry Grove"
    },
    "subtitle": {
      "zh": "同一片叶，换一种复合顺序",
      "en": "The same square, a different composition"
    },
    "domain": "代数与结构",
    "object": {
      "zh": "正方形的八个旋转与反射组成的二面体群；这里记为 D₄。",
      "en": "The dihedral group of the square: its eight rotations and reflections, denoted D₄ here."
    },
    "ecology": {
      "zh": "四个有标记的顶点是固定物种；旋转与反射是保留邻接关系的生态操作。不同操作顺序下的标签位置揭示复合结果。",
      "en": "The four labelled vertices are persistent species; rotations and reflections preserve their adjacency. Label positions under different operation orders reveal the resulting compositions."
    },
    "color": "#78629e",
    "labKey": "group",
    "level": "structure",
    "prerequisites": {
      "zh": "平面旋转、反射与函数复合。",
      "en": "Plane rotations, reflections, and function composition."
    },
    "steps": [
      {
        "title": {
          "zh": "识别一个操作",
          "en": "Identify an operation"
        },
        "body": {
          "zh": "观察一次旋转或反射怎样置换四个带标签顶点；形状不变，标签位置可变。",
          "en": "Observe how one rotation or reflection permutes the labeled vertices: the square stays fixed as a shape, while labels move."
        }
      },
      {
        "title": {
          "zh": "交换复合顺序",
          "en": "Swap the order"
        },
        "body": {
          "zh": "选 A、B，比较 A∘B 与 B∘A；约定先执行右边的操作。",
          "en": "Choose A and B and compare A∘B with B∘A, applying the right-hand operation first."
        }
      },
      {
        "title": {
          "zh": "寻找群关系",
          "en": "Find a group relation"
        },
        "body": {
          "zh": "令 r 为四分之一转、s 为反射，检查 r⁴=e、s²=e 与 srs=r⁻¹。",
          "en": "For a quarter-turn r and a reflection s, inspect r⁴=e, s²=e, and srs=r⁻¹."
        }
      }
    ],
    "question": {
      "zh": "旋转 90° 与反射能任意交换执行顺序吗？",
      "en": "Can a 90° rotation and a reflection always be performed in either order?"
    },
    "answer": {
      "zh": "不能。正方形二面体群非交换；反射会把旋转的方向反转，srs=r⁻¹。",
      "en": "No. The square’s dihedral group is noncommutative: conjugation by a reflection reverses the rotation, srs=r⁻¹."
    },
    "boundary": {
      "zh": "本页的 D₄ 有 8 个元素；有些文献把它记为 D₈。方形对称只是有限群的一个对象，不能据此概括所有群。",
      "en": "D₄ here has eight elements; some conventions call it D₈. The square’s symmetries are one finite group, not a model for every group."
    },
    "continuation": {
      "zh": "把几何动作变成置换矩阵，再研究表示、轨道、稳定子与群作用在其他数学对象上的方式。",
      "en": "Turn the actions into permutation matrices, then study representations, orbits, stabilizers, and actions on other mathematical objects."
    },
    "sources": [
      {
        "title": "dihedral group",
        "url": "https://github.com/planetmath/20_Group_theory_and_generalizations/blob/master/20F55-DihedralGroup.tex"
      },
      {
        "title": "group",
        "url": "https://github.com/planetmath/14_Algebraic_geometry/blob/master/14F99-Group.tex"
      }
    ],
    "x": 45,
    "y": 17
  },
  {
    "id": "finite-field-atoll",
    "coreId": "pm:FiniteField",
    "coreRefs": [
      "pm:FiniteField",
      "wikipedia:Reed–Solomon_error_correction"
    ],
    "title": {
      "zh": "有限域环礁",
      "en": "Finite-field Atoll"
    },
    "subtitle": {
      "zh": "有限个元素，完整的四则运算",
      "en": "Finite elements, complete field arithmetic"
    },
    "domain": "代数与结构",
    "object": {
      "zh": "素数 p 对应的域 Fₚ，以及在不同域元素上的多项式求值与插值。",
      "en": "The prime field Fₚ and polynomial evaluation and interpolation at distinct field elements."
    },
    "ecology": {
      "zh": "环礁上的坐标标记余数类，纵坐标记录模 p 的多项式取值；保留的采样点是编码的“种子”，插值从种子恢复其他取值。",
      "en": "Coordinates on the atoll label residue classes, and vertical positions record polynomial values modulo p. Retained samples are code seeds from which interpolation restores the other values."
    },
    "color": "#78629e",
    "labKey": "finitefield",
    "level": "structure",
    "prerequisites": {
      "zh": "余数、一次或二次多项式。",
      "en": "Remainders and linear or quadratic polynomials."
    },
    "steps": [
      {
        "title": {
          "zh": "进入素域",
          "en": "Enter a prime field"
        },
        "body": {
          "zh": "选择素数 p，观察加法和乘法都回到同一个有限集合；非零元素都有乘法逆元。",
          "en": "Choose a prime p. Addition and multiplication stay inside the same finite set, and every nonzero element has a multiplicative inverse."
        }
      },
      {
        "title": {
          "zh": "播种采样值",
          "en": "Plant sample values"
        },
        "body": {
          "zh": "在三个互不相同的域元素处记录一个次数小于 3 的多项式的值。",
          "en": "Record the values of a polynomial of degree less than three at three distinct field elements."
        }
      },
      {
        "title": {
          "zh": "重建多项式",
          "en": "Reconstruct the polynomial"
        },
        "body": {
          "zh": "比较插值恢复的全部取值与原多项式取值。三个不同采样点唯一确定次数小于 3 的多项式；这正是编码结构的一部分。",
          "en": "Compare all interpolated values with the original polynomial values. Three distinct samples uniquely determine a polynomial of degree below three, a structural ingredient of the code."
        }
      }
    ],
    "question": {
      "zh": "把模数改为 6，就能得到一个有六个元素的域吗？",
      "en": "Does arithmetic modulo 6 produce a field with six elements?"
    },
    "answer": {
      "zh": "不能。模 6 中 2×3=0，但 2、3 都非零，出现零因子；有限域的元素个数必须是素数幂。",
      "en": "No: modulo 6, 2×3=0 although both factors are nonzero. Finite fields have prime-power cardinality."
    },
    "boundary": {
      "zh": "实验只覆盖小素数域，不构造一般 Fₚⁿ。三点插值要求 p≥3 且采样位置互异；重建无误样本不等于已实现任意错误纠正。",
      "en": "The experiment uses small prime fields, not general Fₚⁿ. Three-point interpolation requires p≥3 and distinct sample locations. Reconstructing error-free samples is not an implementation of arbitrary error correction."
    },
    "continuation": {
      "zh": "把“次数界限制零点数”转化为 Reed–Solomon 码的最小距离，再研究擦除、错误与解码条件。",
      "en": "Turn the root bound for a polynomial of bounded degree into the minimum distance of Reed–Solomon codes, then study erasures, errors, and decoding conditions."
    },
    "sources": [
      {
        "title": "finite field",
        "url": "https://github.com/planetmath/12_Field_theory_and_polynomials/blob/master/12E20-FiniteField.tex"
      },
      {
        "title": "Reed–Solomon error correction",
        "url": "https://en.wikipedia.org/wiki/Reed%E2%80%93Solomon_error_correction"
      }
    ],
    "x": 62,
    "y": 11
  },
  {
    "id": "ideal-basin",
    "coreId": "pm:Ideal",
    "coreRefs": [
      "pm:Ideal",
      "pm:PrimeIdeal"
    ],
    "title": {
      "zh": "理想沉积湾",
      "en": "Ideal Basin"
    },
    "subtitle": {
      "zh": "从倍数层看和与交",
      "en": "Read sums and intersections in multiples"
    },
    "domain": "交换代数",
    "object": {
      "zh": "整数环 Z 的主理想 mZ、nZ；实验把无限倍数集显示为有限观察窗。",
      "en": "The principal ideals mZ and nZ of the integer ring Z, shown through a finite window of their infinite sets of multiples."
    },
    "ecology": {
      "zh": "一层沉积对应一个主理想中的整数倍数；两层交叠显示公倍数，允许相加组合则形成由最大公约数生成的新层。",
      "en": "Each sediment layer marks multiples belonging to a principal ideal. Overlap shows common multiples; additive combinations produce the layer generated by the greatest common divisor."
    },
    "color": "#b87348",
    "labKey": "ideal",
    "level": "structure",
    "prerequisites": {
      "zh": "整除、最大公约数与最小公倍数。",
      "en": "Divisibility, greatest common divisors, and least common multiples."
    },
    "steps": [
      {
        "title": {
          "zh": "选择生成元",
          "en": "Choose generators"
        },
        "body": {
          "zh": "改变 m、n，观察 mZ 和 nZ 的倍数。生成元越大，理想不一定越大；要比较整除关系。",
          "en": "Vary m and n and inspect their multiples. A larger generator need not mean a larger ideal; inclusion is governed by divisibility."
        }
      },
      {
        "title": {
          "zh": "比较交与和",
          "en": "Compare intersection and sum"
        },
        "body": {
          "zh": "交为 lcm(m,n)Z；和为 gcd(m,n)Z。这里的和包括所有 a+b，而不是只把两套标记并在一起。",
          "en": "The intersection is lcm(m,n)Z; the sum is gcd(m,n)Z. The sum contains all a+b, not merely the union of the two marked sets."
        }
      },
      {
        "title": {
          "zh": "寻找生成关系",
          "en": "Find a generating relation"
        },
        "body": {
          "zh": "以 m=4、n=6 为例：共同倍数从 12Z 开始，而 6−4=2 解释了理想和中的生成元。",
          "en": "For m=4 and n=6, common multiples form 12Z, while 6−4=2 explains the generator of their ideal sum."
        }
      }
    ],
    "question": {
      "zh": "4Z∪6Z 是这两个理想的和吗？",
      "en": "Is 4Z∪6Z the sum of the two ideals?"
    },
    "answer": {
      "zh": "不是。6+(−4)=2 属于理想和，却既不是 4 的倍数也不是 6 的倍数；和为 2Z，交为 12Z。",
      "en": "No. The sum contains 6+(−4)=2, which lies in neither 4Z nor 6Z. Their sum is 2Z and their intersection is 12Z."
    },
    "boundary": {
      "zh": "这些 gcd/lcm 公式在 Z 的主理想中成立。屏幕只显示有限倍数，并未穷举理想；任意环中不能直接搬用整数公式。",
      "en": "These gcd/lcm formulas hold for principal ideals in Z. The screen shows finitely many multiples, not the entire ideal. The integer formulas do not transfer unchanged to arbitrary rings."
    },
    "continuation": {
      "zh": "从整数主理想前往多项式理想、商环与代数数论；区分“元素的唯一分解”和“理想的唯一分解”。",
      "en": "Continue to polynomial ideals, quotient rings, and algebraic number theory, distinguishing unique factorization of elements from unique factorization of ideals."
    },
    "sources": [
      {
        "title": "ideal",
        "url": "https://github.com/planetmath/14_Algebraic_geometry/blob/master/14K99-Ideal.tex"
      },
      {
        "title": "prime ideal",
        "url": "https://github.com/planetmath/16_Associative_rings_and_algebras/blob/master/16D99-PrimeIdeal.tex"
      }
    ],
    "x": 78,
    "y": 18
  },
  {
    "id": "spectrum-marsh",
    "coreId": "stacks:00DZ",
    "coreRefs": [
      "stacks:00DZ",
      "pm:PrimeSpectrum"
    ],
    "title": {
      "zh": "素谱湿地",
      "en": "Spectrum Marsh"
    },
    "subtitle": {
      "zh": "把素理想看作空间的点",
      "en": "Let prime ideals become points"
    },
    "domain": "交换代数",
    "object": {
      "zh": "有限商环 Z/nZ 的素谱：点由整除 n 的不同素数给出；D(f) 是不含 f 的素理想组成的基本开集。",
      "en": "The spectrum of Z/nZ: its points correspond to distinct primes dividing n, and D(f) consists of prime ideals not containing f."
    },
    "ecology": {
      "zh": "每片湿地根系是一处素理想，而非一个环元素。改变 f 像调整潮位，显露 D(f) 中的点；素因子的重数不会增加点的数量。",
      "en": "Each root system is a prime ideal, not an element of the ring. Varying f exposes the points of D(f); repeated prime factors do not create extra points."
    },
    "color": "#b87348",
    "labKey": "spectrum",
    "level": "frontier",
    "prerequisites": {
      "zh": "理想、商环与素数分解；开集概念可从本例进入。",
      "en": "Ideals, quotient rings, and prime factorization; the example introduces open sets."
    },
    "steps": [
      {
        "title": {
          "zh": "从环取点",
          "en": "Find points of the spectrum"
        },
        "body": {
          "zh": "在 n=6、8、12、30 中选择一个；枚举其不同素因子，而不是把 0 到 n−1 都当作谱的点。",
          "en": "Choose n among 6, 8, 12, and 30. Enumerate its distinct prime factors rather than treating every residue as a point of the spectrum."
        }
      },
      {
        "title": {
          "zh": "打开 D(f)",
          "en": "Open D(f)"
        },
        "body": {
          "zh": "调节 f，保留不整除 f 的素因子点；这是 f 不属于对应素理想的具体表达。",
          "en": "Vary f and retain prime-factor points that do not divide f: the concrete condition that f is not in the corresponding prime ideal."
        }
      },
      {
        "title": {
          "zh": "区分点与结构",
          "en": "Separate points from structure"
        },
        "body": {
          "zh": "比较 Z/6Z 与 Z/12Z：它们都有两个谱点，但环结构不同。仅看点数不能恢复原环。",
          "en": "Compare Z/6Z and Z/12Z: each has two spectrum points, but the rings differ. Point counts alone cannot reconstruct a ring."
        }
      }
    ],
    "question": {
      "zh": "因为 12=2²·3，Spec(Z/12Z) 有三个点吗？",
      "en": "Since 12=2²·3, does Spec(Z/12Z) have three points?"
    },
    "answer": {
      "zh": "没有，只有两个点，分别对应 (2) 与 (3)。素因子 2 的重复次数不会产生一个新素理想点。",
      "en": "No: it has two points, corresponding to (2) and (3). The repeated factor 2 does not create another prime ideal point."
    },
    "boundary": {
      "zh": "这些有限商环的谱是有限离散空间，每个点都闭；一般 Spec(R) 可以包含非闭点。实验没有模拟一般概形的结构层。",
      "en": "These spectra are finite discrete spaces with every point closed. A general Spec(R) may have nonclosed points. The experiment does not model the structure sheaf of a general scheme."
    },
    "continuation": {
      "zh": "继续研究局部化 R_f、结构层和 Spec(k[x]) 的非闭泛点，理解为什么代数几何需要比点集更多的结构。",
      "en": "Continue to localization R_f, structure sheaves, and the nonclosed generic point of Spec(k[x]), learning why algebraic geometry needs more than a set of points."
    },
    "sources": [
      {
        "title": "spectrum ring [00DZ]",
        "url": "https://stacks.math.columbia.edu/tag/00DZ"
      },
      {
        "title": "prime spectrum",
        "url": "https://github.com/planetmath/14_Algebraic_geometry/blob/master/14A15-PrimeSpectrum.tex"
      }
    ],
    "x": 91,
    "y": 28
  },
  {
    "id": "zero-set-peaks",
    "coreId": "pm:AlgebraicSetsAndPolynomialIdeals",
    "coreRefs": [
      "pm:AlgebraicSetsAndPolynomialIdeals",
      "pm:HilbertsNullstellensatz"
    ],
    "title": {
      "zh": "零点群峰",
      "en": "Zero-set Peaks"
    },
    "subtitle": {
      "zh": "方程选择地形，奇点改变形状",
      "en": "Equations select shapes; singularities matter"
    },
    "domain": "代数几何",
    "object": {
      "zh": "实平面中多项式的零点集：圆、双曲线及三次曲线族；方程与几何对象保持明确对应。",
      "en": "Polynomial zero sets in the real plane: circles, hyperbolas, and cubic families, with an explicit equation-to-geometry correspondence."
    },
    "ecology": {
      "zh": "等式的零点组成山脊；参数改变允许出现的点集。尖点、相交枝和退化点标出方程的局部结构变化。",
      "en": "The zero set forms the ridge. Parameters change which points are allowed; cusps, intersecting branches, and degenerate points mark changes in local structure."
    },
    "color": "#2b778b",
    "labKey": "algebraiccurve",
    "level": "frontier",
    "prerequisites": {
      "zh": "二元坐标、方程与偏导数的初步概念。",
      "en": "Plane coordinates, equations, and an initial understanding of partial derivatives."
    },
    "steps": [
      {
        "title": {
          "zh": "读出方程",
          "en": "Read the equation"
        },
        "body": {
          "zh": "切换圆 x²+y²=r²、双曲线 xy=c 与三次曲线。图上的每个点都应满足当前方程。",
          "en": "Switch among x²+y²=r², xy=c, and the cubic family. Every displayed point should satisfy the selected equation."
        }
      },
      {
        "title": {
          "zh": "走向退化参数",
          "en": "Approach degeneration"
        },
        "body": {
          "zh": "将 r 或 c 调到 0，比较圆缩成一点和双曲线变为两条坐标轴；这些是不同的零点集变化。",
          "en": "Set r or c to zero and compare a circle collapsing to a point with a hyperbola becoming the coordinate axes: two different degenerations."
        }
      },
      {
        "title": {
          "zh": "检查奇异性",
          "en": "Check singularity"
        },
        "body": {
          "zh": "三次族 y²=x³+ax+b 中检查 4a³+27b²=0；再用 F=F_x=F_y=0 的条件定位奇点。",
          "en": "For y²=x³+ax+b, inspect 4a³+27b²=0, then use F=F_x=F_y=0 to locate singular points."
        }
      }
    ],
    "question": {
      "zh": "xy=0 的零点集只有原点吗？",
      "en": "Does xy=0 have only the origin as its zero set?"
    },
    "answer": {
      "zh": "不是。x=0 或 y=0 都满足方程，因此零点集是两条完整坐标轴；原点是两枝相交的奇点。",
      "en": "No. Either x=0 or y=0 satisfies it, so the zero set is both entire coordinate axes; the origin is their singular intersection."
    },
    "boundary": {
      "zh": "只显示实点的有限数值采样。实零点集可比复代数曲线贫乏；根理想与代数集的标准零点定理对应需要代数闭底域。",
      "en": "Only a finite numerical sampling of real points is shown. Real loci may hide complex geometry; the standard Nullstellensatz correspondence between radical ideals and algebraic sets requires an algebraically closed base field."
    },
    "continuation": {
      "zh": "从零点集前往理想、维数、切空间与概形，研究相同点集为何仍可携带不同的代数结构。",
      "en": "Continue to ideals, dimension, tangent spaces, and schemes, asking how the same point set can carry different algebraic structures."
    },
    "sources": [
      {
        "title": "algebraic sets and polynomial ideals",
        "url": "https://github.com/planetmath/14_Algebraic_geometry/blob/master/14A10-AlgebraicSetsAndPolynomialIdeals.tex"
      },
      {
        "title": "Hilbert's Nullstellensatz",
        "url": "https://github.com/planetmath/13_Commutative_rings_and_algebras/blob/master/13A10-HilbertsNullstellensatz.tex"
      }
    ],
    "x": 8,
    "y": 36
  },
  {
    "id": "sheaf-canopy",
    "coreId": "pm:Sheaf",
    "coreRefs": [
      "pm:Sheaf",
      "pm:Presheaf"
    ],
    "title": {
      "zh": "层的云冠",
      "en": "Sheaf Canopy"
    },
    "subtitle": {
      "zh": "局部相容，才能拼成整体",
      "en": "Local agreement makes global gluing possible"
    },
    "domain": "代数几何",
    "object": {
      "zh": "实直线开覆盖 U=(−3,1)、V=(−1,3) 上的局部函数；观察限制映射和相容截面的唯一胶合。",
      "en": "Local functions on the open cover U=(−3,1), V=(−1,3) of the real line, illustrating restrictions and unique gluing of compatible sections."
    },
    "ecology": {
      "zh": "两片树冠是开集，叶片纹理由局部函数给出。重叠区是同一位置的双重描述；纹理一致才有可拼合的整体。",
      "en": "The two canopies are open sets, textured by local functions. Their overlap gives two descriptions of the same locations; matching textures allow a global section."
    },
    "color": "#2b778b",
    "labKey": "sheaf",
    "level": "frontier",
    "prerequisites": {
      "zh": "函数、区间、重叠与函数相等。",
      "en": "Functions, intervals, overlap, and equality of functions."
    },
    "steps": [
      {
        "title": {
          "zh": "查看两个局部",
          "en": "Inspect two local sections"
        },
        "body": {
          "zh": "在 U 上固定 ax+b，在 V 上调节 cx+d。先观察重叠区 (−1,1)，不只比较图线的端点。",
          "en": "Fix ax+b on U and vary cx+d on V. Inspect the overlap (−1,1), not merely the endpoints of the graphs."
        }
      },
      {
        "title": {
          "zh": "检验相容",
          "en": "Test compatibility"
        },
        "body": {
          "zh": "两个一次函数在整个重叠开区间相等，当且仅当斜率与截距都一致。",
          "en": "The affine functions agree throughout the open overlap exactly when both their slopes and intercepts agree."
        }
      },
      {
        "title": {
          "zh": "胶合并限制",
          "en": "Glue and restrict"
        },
        "body": {
          "zh": "匹配系数后得到 U∪V 上的函数；把整体再限制回 U、V，会取回最初的两片截面。",
          "en": "After matching coefficients, glue a function on U∪V. Restricting it back to U and V recovers the two original sections."
        }
      }
    ],
    "question": {
      "zh": "两条局部直线只在重叠区的一个点相交，就能胶合吗？",
      "en": "Can two local affine functions be glued merely because they meet at one point of the overlap?"
    },
    "answer": {
      "zh": "不能。胶合要求在整个重叠区相等。比如 x 与 −x 在 0 相等，却不能作为重叠区上的同一个函数。",
      "en": "No. They must agree on the entire overlap. The functions x and −x agree at 0 but are not the same function on an overlapping interval."
    },
    "boundary": {
      "zh": "这是连续函数层中仿射局部截面的一个观察窗，并非断言“所有开集上的全局一次函数”自动构成任意空间上的层。",
      "en": "This is a window onto affine local sections inside the sheaf of continuous functions; it does not assert that globally affine functions on all open sets automatically form a sheaf on every space."
    },
    "continuation": {
      "zh": "继续研究局部解是否能整体化、上同调对胶合障碍的记录，以及代数几何中结构层的作用。",
      "en": "Continue to local-to-global existence, cohomological gluing obstructions, and the role of structure sheaves in algebraic geometry."
    },
    "sources": [
      {
        "title": "sheaf",
        "url": "https://github.com/planetmath/54_General_topology/blob/master/54B40-Sheaf.tex"
      },
      {
        "title": "presheaf",
        "url": "https://github.com/planetmath/18_Category_theory_homological_algebra/blob/master/18F20-Presheaf.tex"
      }
    ],
    "x": 24,
    "y": 32
  },
  {
    "id": "homology-cavern",
    "coreId": "pm:HomologyOfAChainComplex",
    "coreRefs": [
      "pm:HomologyOfAChainComplex",
      "pm:ChainComplex",
      "pm:Homology"
    ],
    "title": {
      "zh": "同调洞窟",
      "en": "Homology Caverns"
    },
    "subtitle": {
      "zh": "区分闭环与真正留下的洞",
      "en": "Separate cycles from surviving holes"
    },
    "domain": "范畴与同调",
    "object": {
      "zh": "有限三角复形在 F₂ 上的链复形，以及 H₁=ker(∂₁)/im(∂₂) 所记录的同调类。",
      "en": "A finite triangular complex over F₂ and the homology classes recorded by H₁=ker(∂₁)/im(∂₂)."
    },
    "ecology": {
      "zh": "顶点与边搭出洞窟骨架，三角面可以填洞。闭合边链是循环；被面围出的循环成为边界，不再代表独立的洞。",
      "en": "Vertices and edges build the cavern skeleton; triangular faces can fill holes. Closed edge chains are cycles, while cycles bounding faces cease to represent independent holes."
    },
    "color": "#47866d",
    "labKey": "homology",
    "level": "frontier",
    "prerequisites": {
      "zh": "图中的边与环；模 2 加法、线性方程可在实验中认识。",
      "en": "Edges and loops in graphs; arithmetic modulo two and linear equations can be introduced here."
    },
    "steps": [
      {
        "title": {
          "zh": "搭建循环",
          "en": "Build a cycle"
        },
        "body": {
          "zh": "观察三条边围成的三角圈：每个顶点出现两次，因此在 F₂ 上边界抵消。",
          "en": "Inspect a triangular loop: each vertex occurs twice, so its boundary cancels over F₂."
        }
      },
      {
        "title": {
          "zh": "填入一个面",
          "en": "Fill a face"
        },
        "body": {
          "zh": "加入三角面，原来的循环成为这个面的边界；图像中闭环还在，但同调类已改变。",
          "en": "Add the triangular face. The old cycle now bounds that face: the visible loop remains, but its homology class changes."
        }
      },
      {
        "title": {
          "zh": "读出商空间",
          "en": "Read the quotient"
        },
        "body": {
          "zh": "比较循环空间与边界空间的维数，解释 β₁ 为什么是两者的维数之差。",
          "en": "Compare the dimensions of the cycle and boundary spaces and explain why β₁ is their difference."
        }
      }
    ],
    "question": {
      "zh": "只要能在图上画出闭环，就一定有非零 H₁ 吗？",
      "en": "Does a visible closed loop necessarily give a nonzero class in H₁?"
    },
    "answer": {
      "zh": "不一定。填满的三角形边界是一个闭环，但也是一个面边界，因此在 H₁ 中等于 0。",
      "en": "No. The perimeter of a filled triangle is a cycle but also the boundary of a face, so it represents zero in H₁."
    },
    "boundary": {
      "zh": "计算使用有限复形与 F₂ 系数，忽略定向符号；它不能展示整数系数的挠性（torsion）信息，也不能替代一般拓扑空间的完整同调理论。",
      "en": "The calculation uses a finite complex and coefficients in F₂, suppressing orientation signs. It does not reveal integral torsion or replace homology theory for arbitrary spaces."
    },
    "continuation": {
      "zh": "进一步比较不同系数、持久同调、上同调与导出函子；保留“循环模掉边界”这一可迁移的结构。",
      "en": "Compare coefficient systems, persistent homology, cohomology, and derived functors while retaining the transferable structure of cycles modulo boundaries."
    },
    "sources": [
      {
        "title": "homology of a chain complex",
        "url": "https://github.com/planetmath/18_Category_theory_homological_algebra/blob/master/18G35-HomologyOfAChainComplex.tex"
      },
      {
        "title": "chain complex",
        "url": "https://github.com/planetmath/18_Category_theory_homological_algebra/blob/master/18G35-ChainComplex.tex"
      },
      {
        "title": "homology",
        "url": "https://github.com/planetmath/55_Algebraic_topology/blob/master/55N10-Homology.tex"
      }
    ],
    "x": 40,
    "y": 38
  },
  {
    "id": "functor-harbor",
    "coreId": "pm:Functor",
    "coreRefs": [
      "pm:Functor",
      "pm:Category",
      "pm:YonedaLemma"
    ],
    "title": {
      "zh": "函子港",
      "en": "Functor Harbor"
    },
    "subtitle": {
      "zh": "换一种语言，仍保持复合",
      "en": "Change the language; preserve composition"
    },
    "domain": "范畴与同调",
    "object": {
      "zh": "有限范畴中的对象与态射，以及保持恒等态射、源靶和复合的函子；使用有限偏序和集合图式观察。",
      "en": "Objects and morphisms in finite categories, with functors preserving identities, sources, targets, and composition, explored through finite orders and set diagrams."
    },
    "ecology": {
      "zh": "港口是对象，航道是态射；不同航道组合可能抵达同一个映射。函子搬运整个港口系统，而不只给港口换名字。",
      "en": "Ports are objects and channels are morphisms. Different routes may compose to the same map. A functor transports the system of ports and channels, not just their names."
    },
    "color": "#47866d",
    "labKey": "category",
    "level": "frontier",
    "prerequisites": {
      "zh": "集合、函数、复合与相等；偏序可看作至多一条箭头的范畴。",
      "en": "Sets, functions, composition, and equality; a poset can be viewed as a category with at most one arrow between two objects."
    },
    "steps": [
      {
        "title": {
          "zh": "读两条路径",
          "en": "Read two paths"
        },
        "body": {
          "zh": "在有限集合的图式中，逐点比较沿两条路径复合后的输出；抵达同一个目标集合不等于输出相同。",
          "en": "In a diagram of finite sets, compare outputs along two composite paths point by point. Reaching the same target set does not ensure equal outputs."
        }
      },
      {
        "title": {
          "zh": "检查保持结构",
          "en": "Check preservation"
        },
        "body": {
          "zh": "改变对象或态射的对应，检查恒等与复合是否仍被保留；偏序例还要求映射保序。",
          "en": "Vary an assignment of objects or morphisms and check whether identities and composition are preserved; the poset example also requires monotonicity."
        }
      },
      {
        "title": {
          "zh": "识别反例输入",
          "en": "Find a witness"
        },
        "body": {
          "zh": "如果图式不交换，找出一个输入，使两条路径得到不同输出。一个明确见证即可否定该交换性。",
          "en": "If the diagram fails to commute, find one input whose two outputs differ. A concrete witness is enough to refute commutativity."
        }
      }
    ],
    "question": {
      "zh": "两条箭头路径起点相同、终点相同，就一定交换吗？",
      "en": "Do two paths with the same source and target necessarily commute?"
    },
    "answer": {
      "zh": "不一定。交换要求复合函数相等，即每个输入的输出都相同；同一源靶之间可以有许多不同态射。",
      "en": "No. Commutativity means equality of the composite functions on every input; many distinct morphisms may share a source and target."
    },
    "boundary": {
      "zh": "有限集合上的逐点检查能穷举当前图式，但不证明任意范畴中的图式。图中箭头表示已指定的态射，而非未证实的“关联”。",
      "en": "Pointwise checking can exhaust the current finite-set diagram, not every diagram in an arbitrary category. Arrows denote specified morphisms rather than unproved associations."
    },
    "continuation": {
      "zh": "继续研究自然变换、伴随与 Yoneda 引理：对象如何通过它与其他对象的态射被认识。",
      "en": "Continue to natural transformations, adjunctions, and the Yoneda lemma: understanding an object through its morphisms to or from other objects."
    },
    "sources": [
      {
        "title": "functor",
        "url": "https://github.com/planetmath/18_Category_theory_homological_algebra/blob/master/18-00-Functor.tex"
      },
      {
        "title": "category",
        "url": "https://github.com/planetmath/18_Category_theory_homological_algebra/blob/master/18A05-Category.tex"
      },
      {
        "title": "Yoneda lemma",
        "url": "https://github.com/planetmath/18_Category_theory_homological_algebra/blob/master/18A25-YonedaLemma.tex"
      }
    ],
    "x": 58,
    "y": 31
  },
  {
    "id": "covering-terraces",
    "coreId": "pm:CoveringSpace",
    "coreRefs": [
      "pm:CoveringSpace",
      "pm:ClassificationOfCoveringSpaces",
      "pm:FundamentalGroup"
    ],
    "title": {
      "zh": "覆盖梯田",
      "en": "Covering Terraces"
    },
    "subtitle": {
      "zh": "同一个基点，上方有多个落点",
      "en": "One base point, several points above it"
    },
    "domain": "几何与拓扑",
    "object": {
      "zh": "圆周的 n 重覆盖 p(z)=zⁿ，以及给定起点后的路径提升；相位角记录绕行。",
      "en": "The n-fold covering p(z)=zⁿ of the circle and path lifting from a specified initial point, with angles recording winding."
    },
    "ecology": {
      "zh": "基圆是同一条海岸，覆盖圆像叠合的梯田；一处基点上方的 n 个点构成纤维。沿基圆航行，会在覆盖中改变落点。",
      "en": "The base circle is one coast; its covering behaves like layered terraces. The n points above a base point form a fiber. A voyage around the base can end on a different point above it."
    },
    "color": "#b35f6b",
    "labKey": "topology",
    "level": "structure",
    "prerequisites": {
      "zh": "圆周角度、复数单位圆与连续路径。",
      "en": "Angles, the complex unit circle, and continuous paths."
    },
    "steps": [
      {
        "title": {
          "zh": "数出纤维",
          "en": "Count the fiber"
        },
        "body": {
          "zh": "选 n，固定基圆上的一点，查看它在覆盖圆上恰有 n 个原像。",
          "en": "Choose n and fix a point on the base circle; it has exactly n preimages on the covering circle."
        }
      },
      {
        "title": {
          "zh": "提升一圈",
          "en": "Lift one turn"
        },
        "body": {
          "zh": "给定起点后让基点绕行一圈；提升路径只转过 1/n 圈，一般不会回到起点。",
          "en": "From a fixed lift starting point, move once around the base. The lifted path turns only 1/n of a circle and generally does not close."
        }
      },
      {
        "title": {
          "zh": "找闭合条件",
          "en": "Find when the lift closes"
        },
        "body": {
          "zh": "让基圆连续绕 n 圈；提升绕一圈返回。用绕数解释一般路径闭合的条件。",
          "en": "Travel n turns around the base; the lift makes one complete turn. Express closure in terms of the winding number."
        }
      }
    ],
    "question": {
      "zh": "三重覆盖中，基圆绕一圈的闭路提升后仍是闭路吗？",
      "en": "In a threefold covering, does lifting one closed turn around the base produce a closed path?"
    },
    "answer": {
      "zh": "不是。它把提升起点移到相邻的纤维点；基圆绕数是 3 的倍数时，这条提升才闭合。",
      "en": "No. It ends at the next point in the fiber. The lift closes when the base winding number is a multiple of three."
    },
    "boundary": {
      "zh": "圆周上的 z↦zⁿ 是覆盖；把同一公式当作包含 0 的复平面映射时，n>1 会在 0 分歧。一般覆盖分类还需要局部路径连通等假设。",
      "en": "On the circle, z↦zⁿ is a covering. On a complex-plane domain containing 0, the same formula branches at 0 for n>1. General covering classification also requires hypotheses such as local path connectivity."
    },
    "continuation": {
      "zh": "沿覆盖与基本群的对应，继续研究单值化、Monodromy、Riemann 曲面与 étale 覆盖。",
      "en": "Follow the relationship with fundamental groups toward monodromy, Riemann surfaces, and étale coverings."
    },
    "sources": [
      {
        "title": "covering space",
        "url": "https://github.com/planetmath/55_Algebraic_topology/blob/master/55R05-CoveringSpace.tex"
      },
      {
        "title": "classification of covering spaces",
        "url": "https://github.com/planetmath/55_Algebraic_topology/blob/master/55R05-ClassificationOfCoveringSpaces.tex"
      },
      {
        "title": "fundamental group",
        "url": "https://github.com/planetmath/57_Manifolds_and_cell_complexes/blob/master/57M05-FundamentalGroup.tex"
      }
    ],
    "x": 74,
    "y": 40
  },
  {
    "id": "curvature-ridge",
    "coreId": "pm:GaussianCurvature",
    "coreRefs": [
      "pm:GaussianCurvature",
      "pm:EulerCharacteristic",
      "pm:GaussBonnetTheoremForSurfacesWithoutBoundary"
    ],
    "title": {
      "zh": "曲率山脊",
      "en": "Curvature Ridge"
    },
    "subtitle": {
      "zh": "局部角亏，汇成整体拓扑",
      "en": "Local angle defects sum to topology"
    },
    "domain": "几何与拓扑",
    "object": {
      "zh": "闭合三角网格顶点的角亏 δ(v)=2π−Σθ，以及离散 Gauss–Bonnet 恒等式 Σδ=2πχ。",
      "en": "Vertex angle defects δ(v)=2π−Σθ in a closed triangular mesh and the discrete Gauss–Bonnet identity Σδ=2πχ."
    },
    "ecology": {
      "zh": "三角岩面是平坦面片，山脊顶点聚集曲率；正、负角亏以不同标记显示。全岛的角亏总量与孔洞拓扑相连。",
      "en": "Triangular rock faces are flat patches, with curvature concentrated at vertices. Distinct marks show positive and negative angle defects; their total is tied to the island’s topology."
    },
    "color": "#b35f6b",
    "labKey": "geometry",
    "level": "frontier",
    "prerequisites": {
      "zh": "三角形内角、弧度、顶点/边/面的计数。",
      "en": "Triangle angles, radians, and counts of vertices, edges, and faces."
    },
    "steps": [
      {
        "title": {
          "zh": "观察顶点角亏",
          "en": "Inspect vertex defects"
        },
        "body": {
          "zh": "观察各顶点，比较它周围所有面角之和与 2π；差额是该顶点的离散角亏。",
          "en": "Inspect each vertex and compare the sum of its incident face angles with 2π; the difference is its discrete angle defect."
        }
      },
      {
        "title": {
          "zh": "从局部求总和",
          "en": "Sum the local contributions"
        },
        "body": {
          "zh": "在四面体或八面体网格上，计算 V−E+F，并核对角亏总和为 2π(V−E+F)。",
          "en": "For the tetrahedral or octahedral mesh, compute V−E+F and compare the total angle defect with 2π(V−E+F)."
        }
      },
      {
        "title": {
          "zh": "转向有孔曲面",
          "en": "Visit a surface with a hole"
        },
        "body": {
          "zh": "切换到环面，观察总角亏变成 0，但局部顶点的角亏可以仍有正有负。",
          "en": "Switch to the torus. The total defect becomes zero although individual vertices may still have positive or negative defects."
        }
      }
    ],
    "question": {
      "zh": "环面的总曲率为 0，是否说明每一个顶点都没有角亏？",
      "en": "If the torus has zero total curvature, must every vertex have zero angle defect?"
    },
    "answer": {
      "zh": "不是。总和为 0 允许正负贡献抵消；局部曲率与全局总曲率是不同的信息。",
      "en": "No. Positive and negative contributions may cancel. Local curvature and total curvature carry different information."
    },
    "boundary": {
      "zh": "实验计算的是闭合三角网格的离散角亏。它与光滑曲面的高斯曲率积分对应，但不是对任意光滑曲面的数值证明；有边界时公式需要边界项。",
      "en": "The experiment computes discrete defects on closed triangular meshes. This corresponds to smooth integrated Gaussian curvature but is not a numerical proof for arbitrary smooth surfaces; surfaces with boundary require boundary terms."
    },
    "continuation": {
      "zh": "继续比较内蕴几何、Gauss–Bonnet、曲率流与整体拓扑约束，区分“形状弯曲”与可由曲面内部测量的曲率。",
      "en": "Continue to intrinsic geometry, Gauss–Bonnet, curvature flow, and global topological constraints, distinguishing visible bending from curvature measurable within a surface."
    },
    "sources": [
      {
        "title": "Gaussian curvature",
        "url": "https://github.com/planetmath/53_Differential_geometry/blob/master/53A05-GaussianCurvature.tex"
      },
      {
        "title": "Euler characteristic",
        "url": "https://github.com/planetmath/55_Algebraic_topology/blob/master/55N99-EulerCharacteristic.tex"
      },
      {
        "title": "Gauss-Bonnet theorem for surfaces without boundary",
        "url": "https://github.com/planetmath/53_Differential_geometry/blob/master/53A05-GaussBonnetTheoremForSurfacesWithoutBoundary.tex"
      }
    ],
    "x": 91,
    "y": 47
  },
  {
    "id": "fourier-tide",
    "coreId": "pm:FourierSeriesOfFunctionOfBoundedVariation",
    "coreRefs": [
      "pm:FourierSeriesOfFunctionOfBoundedVariation",
      "pm:FourierTransform"
    ],
    "title": {
      "zh": "傅里叶潮汐",
      "en": "Fourier Tide"
    },
    "subtitle": {
      "zh": "用谐波叠出一条方波",
      "en": "Build a square wave from harmonics"
    },
    "domain": "分析与微分方程",
    "object": {
      "zh": "2π 周期方波 sgn(sin x) 的奇次谐波截断：S_N(x)=4/π Σ sin((2j−1)x)/(2j−1)，j=1,…,N。",
      "en": "Odd-harmonic truncations of the 2π-periodic square wave sgn(sin x): S_N(x)=4/π Σ sin((2j−1)x)/(2j−1), j=1,…,N."
    },
    "ecology": {
      "zh": "各条潮带是一种频率的正弦波；相位同步后叠成总水线。跳跃边缘的涟漪是 Gibbs 现象，不是画图噪声。",
      "en": "Each tidal band is a sine wave of one frequency; their phases combine into the total waterline. Ripples near the jumps illustrate the Gibbs phenomenon rather than plotting noise."
    },
    "color": "#a1893b",
    "labKey": "fourier",
    "level": "structure",
    "prerequisites": {
      "zh": "正弦函数、周期、函数相加。",
      "en": "Sine waves, periods, and addition of functions."
    },
    "steps": [
      {
        "title": {
          "zh": "从单频出发",
          "en": "Start with one frequency"
        },
        "body": {
          "zh": "把 N 设为 1，只保留基频；辨认其波长和幅度。",
          "en": "Set N=1 to keep only the fundamental frequency and identify its wavelength and amplitude."
        }
      },
      {
        "title": {
          "zh": "加入奇次谐波",
          "en": "Add odd harmonics"
        },
        "body": {
          "zh": "逐渐增加 N，观察平坦区的近似改善和跳跃附近更窄的振荡区。",
          "en": "Increase N and observe improved approximation on flat regions and a narrower oscillatory region near each jump."
        }
      },
      {
        "title": {
          "zh": "解释不消失的超调",
          "en": "Explain persistent overshoot"
        },
        "body": {
          "zh": "比较较大的 N：跳跃附近的超调不会以相对跳跃高度趋于 0，尽管它集中到更窄的区域。",
          "en": "Compare larger N: overshoot relative to the jump height does not tend to zero, although it is confined to an increasingly narrow region."
        }
      }
    ],
    "question": {
      "zh": "增加足够多的谐波后，跳跃附近的最大超调必定降到 0 吗？",
      "en": "Must the maximum overshoot near a jump vanish once enough harmonics are included?"
    },
    "answer": {
      "zh": "不会。这是 Gibbs 现象；在跳跃点，傅里叶级数趋向左右极限的平均值，而不是强行选取一侧。",
      "en": "No: this is the Gibbs phenomenon. At a jump, the Fourier series tends to the average of the one-sided limits rather than choosing either side."
    },
    "boundary": {
      "zh": "这里展示周期傅里叶级数的有限截断，不是整条实轴上的傅里叶变换。数值图可观察现象，但收敛结论仍依赖函数的相应条件。",
      "en": "This is a finite truncation of a periodic Fourier series, not the Fourier transform on the whole real line. The plot illustrates behavior; convergence statements still require their stated hypotheses."
    },
    "continuation": {
      "zh": "继续研究不同收敛方式、Fejér 求和、正交投影，以及频谱怎样把微分算子化成乘法。",
      "en": "Continue to modes of convergence, Fejér summation, orthogonal projection, and how spectral representations turn differentiation into multiplication."
    },
    "sources": [
      {
        "title": "Fourier series of function of bounded variation",
        "url": "https://github.com/planetmath/42_Fourier_analysis/blob/master/42A16-FourierSeriesOfFunctionOfBoundedVariation.tex"
      },
      {
        "title": "Fourier transform",
        "url": "https://github.com/planetmath/42_Fourier_analysis/blob/master/42A38-FourierTransform.tex"
      }
    ],
    "x": 12,
    "y": 59
  },
  {
    "id": "complex-current",
    "coreId": "pm:ComplexNumber",
    "coreRefs": [
      "pm:ComplexNumber",
      "pm:Holomorphic",
      "pm:ComplexExponentialFunction"
    ],
    "title": {
      "zh": "复流海峡",
      "en": "Complex Current"
    },
    "subtitle": {
      "zh": "一次乘法，同时旋转与伸缩",
      "en": "One multiplication rotates and scales"
    },
    "domain": "分析与微分方程",
    "object": {
      "zh": "复平面的线性映射 z↦wz，其中 w=ρeⁱθ；模控制伸缩，辐角控制旋转。",
      "en": "The complex-linear map z↦wz with w=ρeⁱθ: modulus controls scaling and argument controls rotation."
    },
    "ecology": {
      "zh": "海草般的坐标网格是复平面的真实网格；海流由同一个复数乘法作用于所有点。角度与长度的改变有明确计算规则。",
      "en": "The sea-grass grid is an actual grid in the complex plane. A single complex multiplication moves every point, with explicit rules for changes in angles and lengths."
    },
    "color": "#a1893b",
    "labKey": "complex",
    "level": "explore",
    "prerequisites": {
      "zh": "平面坐标、角度与相似变换。",
      "en": "Plane coordinates, angles, and similarities."
    },
    "steps": [
      {
        "title": {
          "zh": "拆开模与角",
          "en": "Separate size and angle"
        },
        "body": {
          "zh": "固定 ρ，改变 θ，观察整张网格绕原点旋转而长度比例不变。",
          "en": "Hold ρ fixed and vary θ; the whole grid rotates around the origin without changing its length ratios."
        }
      },
      {
        "title": {
          "zh": "再改变尺度",
          "en": "Change the scale"
        },
        "body": {
          "zh": "固定 θ，改变 ρ；距离都乘以 ρ，面积都乘以 ρ²。",
          "en": "Hold θ fixed and vary ρ: distances scale by ρ and areas by ρ²."
        }
      },
      {
        "title": {
          "zh": "查看退化情形",
          "en": "Inspect degeneration"
        },
        "body": {
          "zh": "令 ρ=0，所有点落在原点；此时可逆性与保角性都失效。",
          "en": "Set ρ=0 and every point collapses to the origin; invertibility and angle preservation both fail."
        }
      }
    ],
    "question": {
      "zh": "乘以 i 两次能回到原位置吗？",
      "en": "Does multiplying by i twice return a point to its original position?"
    },
    "answer": {
      "zh": "通常不能。i²=−1，对应旋转 180°；除原点外，需要乘以 i 四次才回到原位置。",
      "en": "Generally no. Since i²=−1, two multiplications rotate by 180°; except at the origin, four are needed to return to the starting point."
    },
    "boundary": {
      "zh": "本页只演示复数乘法这一类线性映射。ρ>0 时它保角；一般全纯映射只在导数非零处局部保角，并不都表现为全局同一个旋转伸缩。",
      "en": "Only complex multiplication is demonstrated. It is conformal when ρ>0; a general holomorphic map is locally conformal where its derivative is nonzero, not necessarily one global rotation and scaling."
    },
    "continuation": {
      "zh": "从局部线性作用进入复导数、临界点与 Riemann 曲面，再比较 z²、指数映射与覆盖的关系。",
      "en": "Continue from local linear behavior to complex derivatives, critical points, and Riemann surfaces, then compare z² and the exponential map with coverings."
    },
    "sources": [
      {
        "title": "complex number",
        "url": "https://github.com/planetmath/12_Field_theory_and_polynomials/blob/master/12D99-ComplexNumber.tex"
      },
      {
        "title": "holomorphic",
        "url": "https://github.com/planetmath/30_Functions_of_a_complex_variable/blob/master/30D20-Holomorphic.tex"
      },
      {
        "title": "complex exponential function",
        "url": "https://github.com/planetmath/30_Functions_of_a_complex_variable/blob/master/30D20-ComplexExponentialFunction.tex"
      }
    ],
    "x": 29,
    "y": 53
  },
  {
    "id": "brownian-delta",
    "coreId": "pm:BrownianMotion",
    "coreRefs": [
      "pm:BrownianMotion",
      "pm:QuadraticVariationOfBrownianMotion"
    ],
    "title": {
      "zh": "布朗三角洲",
      "en": "Brownian Delta"
    },
    "subtitle": {
      "zh": "不规则路径，也有精确尺度",
      "en": "Irregular paths with a precise scale"
    },
    "domain": "概率与统计",
    "object": {
      "zh": "标准一维 Brownian 运动的有限时间网格样本：独立增量按 N(0,Δt) 采样，方差随时间线性增长。",
      "en": "Finite-grid samples of standard one-dimensional Brownian motion: independent increments are modeled as N(0,Δt), with variance growing linearly in time."
    },
    "ecology": {
      "zh": "一条水道是一条样本路径，而不是概率密度；许多水道形成样本群。±2√t 线表示固定时刻的尺度参考，不是不可越过的堤岸。",
      "en": "Each channel is one sample path, not a probability density. Many channels form an ensemble. The ±2√t curves are fixed-time scale references, not impassable banks."
    },
    "color": "#b77c9c",
    "labKey": "probability",
    "level": "structure",
    "prerequisites": {
      "zh": "平均值、方差、正态分布与随机样本。",
      "en": "Means, variance, normal distributions, and random samples."
    },
    "steps": [
      {
        "title": {
          "zh": "看一条路径",
          "en": "Inspect one path"
        },
        "body": {
          "zh": "先显示一条路径，区分时间轴和随机位移；局部朝上不意味着下一步更容易朝上。",
          "en": "Show one path and distinguish time from random displacement. An upward segment does not make the next increment more likely to point upward."
        }
      },
      {
        "title": {
          "zh": "比较样本群",
          "en": "Compare an ensemble"
        },
        "body": {
          "zh": "增加到多条路径，观察固定时刻的横截面；标准差的尺度是 √t，而不是 t。",
          "en": "Add paths and inspect the cross-section at a fixed time: the standard-deviation scale is √t, not t."
        }
      },
      {
        "title": {
          "zh": "细化观察网格",
          "en": "Refine the observation grid"
        },
        "body": {
          "zh": "比较 16、64、256 个时间步，认识有限折线与理论连续路径的区别；固定种子使当前实验可重放。",
          "en": "Compare 16, 64, and 256 time steps, distinguishing a finite polyline from a theoretical continuous path. A fixed seed makes this experiment repeatable."
        }
      }
    ],
    "question": {
      "zh": "某条路径越过 2√t，就说明程序错误了吗？",
      "en": "If a path crosses 2√t, must the simulation be wrong?"
    },
    "answer": {
      "zh": "不一定。对任一固定 t>0，W(t)/√t 服从标准正态，约 4.55% 的值落在 ±2 之外；这更不是整条路径同时留在带内的保证。",
      "en": "No. At a fixed t>0, W(t)/√t is standard normal, with about 4.55% outside ±2. This does not guarantee that an entire path stays inside the band."
    },
    "boundary": {
      "zh": "浏览器使用固定种子的伪随机数和有限时间网格，不能生成或证明真实无限精度 Brownian 路径。“约 95%”只指单个固定时刻的正态范围。",
      "en": "The browser uses a fixed-seed pseudorandom generator and a finite time grid, not an infinite-precision Brownian path or its proof. The approximately 95% range concerns one fixed time only."
    },
    "continuation": {
      "zh": "进一步研究二次变差、Itô 积分与随机微分方程，再沿 Feynman–Kac 的条件化联系前往偏微分方程。",
      "en": "Continue to quadratic variation, Itô integration, and stochastic differential equations, then follow the appropriately conditioned Feynman–Kac connection to PDEs."
    },
    "sources": [
      {
        "title": "Brownian motion",
        "url": "https://github.com/planetmath/60_Probability_theory_and_stochastic_processes/blob/master/60J65-BrownianMotion.tex"
      },
      {
        "title": "quadratic variation of Brownian motion",
        "url": "https://github.com/planetmath/60_Probability_theory_and_stochastic_processes/blob/master/60H10-QuadraticVariationOfBrownianMotion.tex"
      }
    ],
    "x": 44,
    "y": 60
  },
  {
    "id": "mean-tide",
    "coreId": "pm:StrongLawOfLargeNumbers",
    "coreRefs": [
      "pm:StrongLawOfLargeNumbers",
      "pm:BrownianMotion"
    ],
    "title": {
      "zh": "均值潮汐",
      "en": "Mean Tide"
    },
    "subtitle": {
      "zh": "长期稳定，不等于每步靠近",
      "en": "Long-run stability is not monotone progress"
    },
    "domain": "概率与统计",
    "object": {
      "zh": "独立同分布 Bernoulli(p) 样本的运行均值，以及大数定律对无限样本序列的几乎处处结论。",
      "en": "Running averages of independent identically distributed Bernoulli(p) samples and the almost-sure infinite-sequence conclusion of the law of large numbers."
    },
    "ecology": {
      "zh": "单次潮珠是 0 或 1，潮线是到当前为止的样本均值；水平线 p 是模型期望。局部回摆与长期稳定可以同时发生。",
      "en": "Individual tide beads are zeros or ones; the tide line is the running average, and the horizontal line p is the model expectation. Short-term reversals can coexist with long-run stabilization."
    },
    "color": "#b77c9c",
    "labKey": "lln",
    "level": "explore",
    "prerequisites": {
      "zh": "分数、平均数与概率。",
      "en": "Fractions, averages, and probability."
    },
    "steps": [
      {
        "title": {
          "zh": "给出模型",
          "en": "Specify the model"
        },
        "body": {
          "zh": "选择成功概率 p，观察同一参数下的 0/1 样本；这里明确假设独立同分布。",
          "en": "Choose a success probability p and inspect its zero-one samples. Independence and identical distribution are explicit model assumptions."
        }
      },
      {
        "title": {
          "zh": "逐步取平均",
          "en": "Average successively"
        },
        "body": {
          "zh": "把样本数从较少增加到较多，比较运行均值与 p 的差，而不只看最后一个点。",
          "en": "Increase the sample count and compare the entire running average with p, not only the final point."
        }
      },
      {
        "title": {
          "zh": "检查有限与无限",
          "en": "Separate finite and infinite"
        },
        "body": {
          "zh": "寻找一次均值暂时远离 p 的更新；解释为什么它不违反几乎处处收敛。",
          "en": "Find an update that temporarily moves the mean away from p and explain why this does not contradict almost-sure convergence."
        }
      }
    ],
    "question": {
      "zh": "当 p=1/2、前 20 次恰有 10 次成功时，第 21 次成功会让均值更接近 p 吗？",
      "en": "For p=1/2, if exactly 10 of the first 20 trials succeed, does a success on trial 21 move the mean closer to p?"
    },
    "answer": {
      "zh": "不会。均值从 1/2 变成 11/21，反而暂时远离。大数定律不要求误差逐步单调下降。",
      "en": "No: the mean moves from 1/2 to 11/21, temporarily increasing its error. The law does not require error to decrease at every step."
    },
    "boundary": {
      "zh": "有限伪随机模拟不是大数定律证明。模型采用独立有界样本；把同一次随机结果重复很多遍会破坏独立性，不能照搬该结论。",
      "en": "A finite pseudorandom simulation is not a proof of the law. The model uses independent bounded samples; repeating one random result destroys independence and does not justify the same conclusion."
    },
    "continuation": {
      "zh": "继续比较依概率收敛、几乎处处收敛、中心极限定理与浓缩不等式，区分极限结论和有限样本误差界。",
      "en": "Continue to convergence in probability, almost-sure convergence, the central limit theorem, and concentration bounds, separating asymptotic conclusions from finite-sample guarantees."
    },
    "sources": [
      {
        "title": "strong law of large numbers",
        "url": "https://github.com/planetmath/60_Probability_theory_and_stochastic_processes/blob/master/60F15-StrongLawOfLargeNumbers.tex"
      },
      {
        "title": "Brownian motion",
        "url": "https://github.com/planetmath/60_Probability_theory_and_stochastic_processes/blob/master/60J65-BrownianMotion.tex"
      }
    ],
    "x": 60,
    "y": 53
  },
  {
    "id": "graph-bridges",
    "coreId": "pm:Graph",
    "coreRefs": [
      "pm:Graph",
      "pm:TheRealHistoryOfGettingSettledToAccomplishStudies"
    ],
    "title": {
      "zh": "图的桥群",
      "en": "Graph Bridges"
    },
    "subtitle": {
      "zh": "最少几步，与最小代价",
      "en": "Fewest steps or lowest cost?"
    },
    "domain": "离散与计算",
    "object": {
      "zh": "一个带非负边权的有限图；比较 BFS 的最少边数路径与 Dijkstra 的最小总权路径。",
      "en": "A finite graph with nonnegative edge weights, comparing BFS paths with the fewest edges and Dijkstra paths with minimum total weight."
    },
    "ecology": {
      "zh": "礁点是顶点，桥是边，桥上的数是通行代价；探索波前不是海面距离，而是算法当前认可的图上距离。",
      "en": "Reef points are vertices, bridges are edges, and numbers on bridges are costs. The exploration front records graph distance, not distance across the sea."
    },
    "color": "#6879ad",
    "labKey": "graph",
    "level": "structure",
    "prerequisites": {
      "zh": "图中的路径、加法与大小比较。",
      "en": "Paths in a graph, addition, and comparison."
    },
    "steps": [
      {
        "title": {
          "zh": "说明优化目标",
          "en": "State the objective"
        },
        "body": {
          "zh": "先问要最少跨几座桥，还是要总费用最少；这两个问题用同一张图也可能得到不同答案。",
          "en": "Decide whether the goal is to cross the fewest bridges or pay the least total cost; the same graph can give different answers."
        }
      },
      {
        "title": {
          "zh": "逐层或按距离展开",
          "en": "Expand by layers or distance"
        },
        "body": {
          "zh": "观察 BFS 的层次与 Dijkstra 的当前最小距离，比较两种探索顺序。",
          "en": "Observe BFS layers and Dijkstra’s current minimum distances, comparing their exploration orders."
        }
      },
      {
        "title": {
          "zh": "核对路径代价",
          "en": "Check the route cost"
        },
        "body": {
          "zh": "逐条加上所选路线的边权，核对其总权；不要用地图上曲线的视觉长度代替边权。",
          "en": "Add the selected route’s edge weights and verify the total; do not substitute the curve’s visual length for its weight."
        }
      }
    ],
    "question": {
      "zh": "一条两边路径权重为 8+8，另一条三边路径权重为 3+3+3，BFS 与最小权路径会相同吗？",
      "en": "For a two-edge route of weights 8+8 and a three-edge route of weights 3+3+3, must BFS and a minimum-weight search choose the same route?"
    },
    "answer": {
      "zh": "不会。BFS 优先两条边的路线；按总权计算，三边路线的 9 比两边路线的 16 更小。",
      "en": "No. BFS favors the two-edge route, while the three-edge route has lower total weight: 9 rather than 16."
    },
    "boundary": {
      "zh": "Dijkstra 的正确性要求非负边权；来源中漏条件的记录已保留。BFS 最小化边数；所有边具有相同非负权时，可保证同时最小化总权，非等权时一般无此保证。",
      "en": "Dijkstra’s guarantee requires nonnegative edge weights; the source’s missing-hypothesis finding is retained. BFS minimizes edge count. Equal nonnegative edge weights guarantee that it also minimizes total weight; unequal weights offer no such general guarantee."
    },
    "continuation": {
      "zh": "继续研究启发式搜索、负权与 Bellman–Ford、流与割，以及图上路线怎样成为有明确代价的研究导航。",
      "en": "Continue to heuristic search, negative weights and Bellman–Ford, flows and cuts, and research navigation with explicitly defined costs."
    },
    "sources": [
      {
        "title": "graph",
        "url": "https://github.com/planetmath/05_Combinatorics/blob/master/05C99-Graph.tex"
      },
      {
        "title": "Dijkstra's algorithm",
        "url": "https://github.com/planetmath/05_Combinatorics/blob/master/05C85-TheRealHistoryOfGettingSettledToAccomplishStudies.tex"
      }
    ],
    "x": 78,
    "y": 62
  },
  {
    "id": "matroid-forest",
    "coreId": "pm:Matroid",
    "coreRefs": [
      "pm:Matroid",
      "pm:HodgeTheory"
    ],
    "title": {
      "zh": "拟阵森林",
      "en": "Matroid Forest"
    },
    "subtitle": {
      "zh": "独立性，可以离开向量坐标",
      "en": "Independence beyond vector coordinates"
    },
    "domain": "离散与计算",
    "object": {
      "zh": "完全图 K₄ 的图拟阵：边集为地集，森林为独立集，秩为 r(A)=4−c(A)，其中 c(A) 包括孤立顶点。",
      "en": "The graphic matroid of K₄: edges form the ground set, forests are independent, and r(A)=4−c(A), counting isolated vertices among the components."
    },
    "ecology": {
      "zh": "选中的独立边集长成森林；简单圈是图拟阵中的最小依赖集。树枝数与秩分开记录，避免把“更多枝条”误认为“更多独立信息”。",
      "en": "Selected independent edges grow into forests; simple cycles are the graphic matroid’s minimal dependent sets. Edge count and rank are recorded separately, so more branches need not mean more independent information."
    },
    "color": "#6879ad",
    "labKey": "matroid",
    "level": "frontier",
    "prerequisites": {
      "zh": "图中的连通分量、树与回路。",
      "en": "Connected components, trees, and cycles in a graph."
    },
    "steps": [
      {
        "title": {
          "zh": "选择独立边",
          "en": "Choose independent edges"
        },
        "body": {
          "zh": "逐条选边，保持没有环；此时选中边数等于秩。",
          "en": "Select edges while avoiding cycles; for an independent set, edge count equals rank."
        }
      },
      {
        "title": {
          "zh": "制造依赖",
          "en": "Create dependence"
        },
        "body": {
          "zh": "补上闭合三角形的最后一条边，比较边数和秩：边数增加，秩却不增加。",
          "en": "Add the last edge closing a triangle. The edge count grows but the rank does not."
        }
      },
      {
        "title": {
          "zh": "比较可扩充性",
          "en": "Compare extensions"
        },
        "body": {
          "zh": "从较小森林继续加边，观察怎样扩成生成树；K₄ 的每棵生成树都有 3 条边。",
          "en": "Extend a smaller forest toward a spanning tree; every spanning tree of K₄ has three edges."
        }
      }
    ],
    "question": {
      "zh": "K₄ 中选中一个三角形的 3 条边，它们的秩就是 3 吗？",
      "en": "If three edges of K₄ form a triangle, is their rank three?"
    },
    "answer": {
      "zh": "不是。三角形加一个孤立顶点共有 2 个分量，秩为 4−2=2；第三条边形成依赖回路。",
      "en": "No. The triangle and the isolated vertex give two components, so the rank is 4−2=2. The third edge creates a dependent cycle."
    },
    "boundary": {
      "zh": "这是图拟阵，不是所有拟阵。一般拟阵可以不可图表示，甚至不能由任何给定域上的向量表示；图例不能替代一般公理。",
      "en": "This is a graphic matroid, not a model of every matroid. General matroids need not be graphic or representable over a chosen field; the example does not replace the axioms."
    },
    "continuation": {
      "zh": "沿秩、独立集与交换公理走向拟阵多项式，再研究 Chow 环与 Hodge 理论如何证明无自环元素的有限拟阵（loopless matroid）特征多项式系数的对数凹性。",
      "en": "Continue from rank, independence, and exchange to matroid polynomials, then study how Chow rings and Hodge theory establish log-concavity for characteristic polynomials of loopless matroids."
    },
    "sources": [
      {
        "title": "matroid",
        "url": "https://github.com/planetmath/05_Combinatorics/blob/master/05B35-Matroid.tex"
      },
      {
        "title": "Hodge theory",
        "url": "https://github.com/planetmath/14_Algebraic_geometry/blob/master/14N05-HodgeTheory.tex"
      },
      {
        "title": "Adiprasito, Huh, Katz — Hodge theory for combinatorial geometries",
        "url": "https://arxiv.org/abs/1511.02888"
      }
    ],
    "x": 92,
    "y": 69
  },
  {
    "id": "type-observatory",
    "coreId": "wikipedia:Type_theory",
    "coreRefs": [
      "wikipedia:Type_theory",
      "wikipedia:Homotopy_type_theory"
    ],
    "title": {
      "zh": "类型观测台",
      "en": "Type Observatory"
    },
    "subtitle": {
      "zh": "先问对象是什么，再问怎样应用",
      "en": "Know the type before applying the function"
    },
    "domain": "逻辑与基础",
    "object": {
      "zh": "简单箭头类型的函数应用与组合：从 f:A→B 和 x:A 推出 f(x):B，条件不匹配则规则不能使用。",
      "en": "Function application and composition in simple arrow types: from f:A→B and x:A infer f(x):B; a mismatched input blocks the rule."
    },
    "ecology": {
      "zh": "观察窗中标记的 A、B、C 是类型，推导树连接函数应用的前提与结论。类型匹配允许给定规则的局部推导，不表示任意文字命题都已被证明。",
      "en": "The labels A, B and C in the observatory are types. The derivation tree connects the premises and conclusion of function application. A type match permits this local rule; it does not prove arbitrary verbal claims."
    },
    "color": "#8a6c4b",
    "labKey": "logic",
    "level": "structure",
    "prerequisites": {
      "zh": "函数的输入与输出、符号相等。",
      "en": "Function inputs and outputs, and equality of symbols."
    },
    "steps": [
      {
        "title": {
          "zh": "读出输入输出",
          "en": "Read input and output types"
        },
        "body": {
          "zh": "先识别 f:A→B 的输入类型 A 和输出类型 B，不把箭头当作普通无条件连接线。",
          "en": "Identify A as the input type and B as the output type of f:A→B; the arrow is not an unconditional association."
        }
      },
      {
        "title": {
          "zh": "尝试应用",
          "en": "Attempt application"
        },
        "body": {
          "zh": "改变 x 的类型，观察何时 f(x) 可定型；记录失败时缺少的确切匹配。",
          "en": "Change the type of x and observe when f(x) is typable, identifying the exact mismatch when it fails."
        }
      },
      {
        "title": {
          "zh": "组合两个函数",
          "en": "Compose two functions"
        },
        "body": {
          "zh": "检查 f:A→B 与 g:B→C 的接口，得到 g∘f:A→C；改变中间类型可打断这个推导。",
          "en": "Match f:A→B with g:B→C to obtain g∘f:A→C; changing the middle type can break the derivation."
        }
      }
    ],
    "question": {
      "zh": "A 与 B 不同，f:A→B，x:B。仅凭这些信息能给 f(x) 定型吗？",
      "en": "If A and B differ, f:A→B, and x:B, is that information enough to type f(x)?"
    },
    "answer": {
      "zh": "不能。函数需要 A 类型的输入，而目前只给出了 B 类型的 x；必须另有转换或相等证据才能继续。",
      "en": "No. The function requires an input of type A, but x has type B; an explicit conversion or equality justification would be needed."
    },
    "boundary": {
      "zh": "这是简单箭头类型的有限交互检查，不是完整依赖类型论或证明助理内核；也不代表本体图谱中的开放工具类型字段已经完成形式化。",
      "en": "This finite interaction checks simple arrow types, not a complete dependent type theory or proof-assistant kernel. It does not fill or certify the core atlas’s open tool-type annotations."
    },
    "continuation": {
      "zh": "继续研究 λ 抽象、蕴含片段的 Curry–Howard 对应、依赖类型与恒等类型；新增逻辑连接词需要匹配的类型构造和规则。",
      "en": "Continue to lambda abstraction, the implicational Curry–Howard correspondence, dependent types, and identity types. Additional logical connectives require matching type constructors and rules."
    },
    "sources": [
      {
        "title": "Type theory",
        "url": "https://en.wikipedia.org/wiki/Type_theory"
      },
      {
        "title": "Homotopy type theory",
        "url": "https://en.wikipedia.org/wiki/Homotopy_type_theory"
      }
    ],
    "x": 8,
    "y": 80
  },
  {
    "id": "cantor-coast",
    "coreId": "pm:CantorSet",
    "coreRefs": [
      "pm:CantorSet",
      "pm:CantorSpace"
    ],
    "title": {
      "zh": "Cantor 海岸",
      "en": "Cantor Coast"
    },
    "subtitle": {
      "zh": "长度渐退，无穷并未离开",
      "en": "Vanishing length, enduring infinity"
    },
    "domain": "逻辑与基础",
    "object": {
      "zh": "从 [0,1] 反复删去中间三分之一开区间得到的 Cantor 集；有限阶段 Cₖ 与无限交 C 必须区分。",
      "en": "The Cantor set obtained by repeatedly deleting open middle thirds from [0,1], distinguishing finite stages Cₖ from the infinite intersection C."
    },
    "ecology": {
      "zh": "海岸线段是留下的闭区间；每次退潮移除开区间，因此端点保留。分枝记录三进制数字 0 或 2 的选择。",
      "en": "Coast segments are the remaining closed intervals. Each retreat removes open intervals, preserving endpoints; branches record choices of ternary digits 0 or 2."
    },
    "color": "#8a6c4b",
    "labKey": "fractal",
    "level": "structure",
    "prerequisites": {
      "zh": "区间、分数、几何级数与无限序列的初步概念。",
      "en": "Intervals, fractions, geometric sequences, and an initial idea of infinite sequences."
    },
    "steps": [
      {
        "title": {
          "zh": "执行一次删除",
          "en": "Delete one middle third"
        },
        "body": {
          "zh": "从 [0,1] 删除 (1/3,2/3)，确认两个端点仍保留。",
          "en": "Remove (1/3,2/3) from [0,1] and confirm that both endpoints remain."
        }
      },
      {
        "title": {
          "zh": "统计有限阶段",
          "en": "Count a finite stage"
        },
        "body": {
          "zh": "第 k 步有 2ᵏ 个闭区间，每个长 3⁻ᵏ，总长度为 (2/3)ᵏ。",
          "en": "At stage k there are 2ᵏ closed intervals of length 3⁻ᵏ each, for total length (2/3)ᵏ."
        }
      },
      {
        "title": {
          "zh": "从图像走向定义",
          "en": "Move from picture to definition"
        },
        "body": {
          "zh": "把 C 定义为所有阶段的交。用只含 0、2 的三进制展开，讨论为什么极限仍含不可数多个点。",
          "en": "Define C as the intersection of all stages. Ternary expansions using only 0 and 2 explain why the limit still has uncountably many points."
        }
      }
    ],
    "question": {
      "zh": "剩余总长度趋于 0，是否说明极限集合只剩有限多个点？",
      "en": "If the remaining total length tends to zero, must the limit contain only finitely many points?"
    },
    "answer": {
      "zh": "不是。Cantor 集测度为 0，却不可数；每个无限的 0/2 三进制选择序列都给出其中一个点。",
      "en": "No. The Cantor set has measure zero but is uncountable: every infinite choice of ternary digits 0 or 2 determines a point in it."
    },
    "boundary": {
      "zh": "屏幕画的是有限阶段，不是把无限集合逐点绘完。课程把它放在“逻辑与基础”以讨论有限/无限与编码；本体来源的分析分域保持不变。",
      "en": "The screen draws a finite stage, not every point of the infinite set. This course groups it under Logic and foundations to study finiteness, infinity, and coding; its core source grouping under analysis is unchanged."
    },
    "continuation": {
      "zh": "继续比较测度、基数和拓扑维数，研究 Cantor 空间与符号动力系统，避免把不同的“大小”混为一谈。",
      "en": "Continue to measure, cardinality, topological dimension, Cantor space, and symbolic dynamics, keeping these distinct notions of size separate."
    },
    "sources": [
      {
        "title": "Cantor set",
        "url": "https://github.com/planetmath/28_Measure_and_integration/blob/master/28A80-CantorSet.tex"
      },
      {
        "title": "Cantor space",
        "url": "https://github.com/planetmath/54_General_topology/blob/master/54E50-CantorSpace.tex"
      }
    ],
    "x": 25,
    "y": 75
  },
  {
    "id": "gradient-basin",
    "coreId": "pm:GradientSystem",
    "coreRefs": [
      "pm:GradientSystem",
      "pm:ConvexFunction"
    ],
    "title": {
      "zh": "梯度盆地",
      "en": "Gradient Basin"
    },
    "subtitle": {
      "zh": "下坡方向，也需要合适步长",
      "en": "A downhill direction still needs a step size"
    },
    "domain": "数值与优化",
    "object": {
      "zh": "正定二次型 f(x,y)=(λx²+y²)/2 的离散梯度下降；λ≥1，步长 η 决定迭代的稳定性。",
      "en": "Discrete gradient descent for the positive-definite quadratic f(x,y)=(λx²+y²)/2, with λ≥1 and stability governed by the step size η."
    },
    "ecology": {
      "zh": "等高线表示同一目标函数值，脚印是数值迭代点，相邻脚印的位移由负梯度与步长决定。陡峭方向对步长的限制可以直接计算。",
      "en": "Contours show equal objective values, and footprints are numerical iterates. The negative gradient and step size determine each displacement; the steep direction imposes a computable step-size limit."
    },
    "color": "#bc985a",
    "labKey": "optimization",
    "level": "structure",
    "prerequisites": {
      "zh": "坐标、函数斜率与迭代。",
      "en": "Coordinates, slopes, and iteration."
    },
    "steps": [
      {
        "title": {
          "zh": "改变地形条件",
          "en": "Change the conditioning"
        },
        "body": {
          "zh": "增加 λ，观察等高线变得狭长；两个坐标方向的曲率分别为 λ 与 1。",
          "en": "Increase λ and watch the contours become elongated; the two coordinate curvatures are λ and 1."
        }
      },
      {
        "title": {
          "zh": "按梯度行走",
          "en": "Step along the gradient"
        },
        "body": {
          "zh": "用固定 η 迭代，核对 x 下一步乘以 1−ηλ，y 下一步乘以 1−η。",
          "en": "Iterate with a fixed η and check that x is multiplied by 1−ηλ while y is multiplied by 1−η."
        }
      },
      {
        "title": {
          "zh": "越过稳定边界",
          "en": "Cross the stability boundary"
        },
        "body": {
          "zh": "比较 0<η<2/λ 与过大步长的轨迹；凸目标仍可能因为离散步长过大而发散。",
          "en": "Compare trajectories for 0<η<2/λ with oversized steps: even a convex objective can diverge under an unstable discrete update."
        }
      }
    ],
    "question": {
      "zh": "λ=4、η=0.6 时，从 x=1、y=0 出发，下一步会更靠近极小点吗？",
      "en": "For λ=4 and η=0.6, starting at x=1,y=0, does the next step move closer to the minimum?"
    },
    "answer": {
      "zh": "不会。x 变成 (1−2.4)×1=−1.4，绝对值增大；稳定上界为 2/λ=0.5。",
      "en": "No. The new x is (1−2.4)×1=−1.4, farther from zero; the stability upper bound is 2/λ=0.5."
    },
    "boundary": {
      "zh": "这是固定步长、正定二次型的精确迭代模型。连续梯度流的能量下降不能无条件搬到任意离散步长；一般非凸优化还会出现其他困难。",
      "en": "This is an exact fixed-step model for a positive-definite quadratic. Energy decrease of continuous gradient flow does not justify arbitrary discrete steps, and nonconvex optimization introduces further difficulties."
    },
    "continuation": {
      "zh": "继续研究条件数、预条件、共轭梯度、线搜索与优化收敛证明，把视觉中的“陡窄山谷”转化为定量问题。",
      "en": "Continue to condition numbers, preconditioning, conjugate gradients, line search, and convergence proofs, turning a steep narrow valley into a quantitative problem."
    },
    "sources": [
      {
        "title": "gradient system",
        "url": "https://github.com/planetmath/34_Ordinary_differential_equations/blob/master/34A34-GradientSystem.tex"
      },
      {
        "title": "convex function",
        "url": "https://github.com/planetmath/52_Convex_and_discrete_geometry/blob/master/52A41-ConvexFunction.tex"
      }
    ],
    "x": 42,
    "y": 83
  },
  {
    "id": "transport-sandbar",
    "coreId": "wikipedia:Optimal_transport",
    "coreRefs": [
      "wikipedia:Optimal_transport"
    ],
    "title": {
      "zh": "运输沙洲",
      "en": "Transport Sandbar"
    },
    "subtitle": {
      "zh": "保留质量，寻找低成本迁移",
      "en": "Conserve mass; move it at lower cost"
    },
    "domain": "数值与优化",
    "object": {
      "zh": "一维等总质量离散测度之间的运输计划，使用成本 |x−y|；单调耦合给出一个最优计划。",
      "en": "Transport plans between one-dimensional discrete measures of equal total mass, with cost |x−y|; a monotone coupling provides an optimal plan."
    },
    "ecology": {
      "zh": "沙堆旁的数值表示质量，水道宽度表示运输质量；每条水道的代价是质量乘距离。源点与终点的质量边际必须守恒。",
      "en": "Numbers beside the sand piles give their masses, and channel widths show transported masses. Each channel costs mass times distance; both source and destination marginals must be conserved."
    },
    "color": "#bc985a",
    "labKey": "transport",
    "level": "frontier",
    "prerequisites": {
      "zh": "加权平均、分配、总和与距离。",
      "en": "Weighted quantities, allocation, sums, and distance."
    },
    "steps": [
      {
        "title": {
          "zh": "核对质量",
          "en": "Check the masses"
        },
        "body": {
          "zh": "改变目标中心或分布形状，确认两侧总质量相同；这比直接画迁移箭头更先行。",
          "en": "Move the target center or change the distribution shape and first verify that both sides have equal total mass."
        }
      },
      {
        "title": {
          "zh": "读运输计划",
          "en": "Read the transport plan"
        },
        "body": {
          "zh": "逐条观察质量从哪个源位置送往哪个目标位置，检查行和、列和等于原分布。",
          "en": "Read which source sends mass to which destination and check that row and column sums recover the two distributions."
        }
      },
      {
        "title": {
          "zh": "计算总成本",
          "en": "Compute the cost"
        },
        "body": {
          "zh": "累计每条通道的 m|x−y|。在当前一维绝对距离模型中，单调耦合是最优的，但最优解未必唯一。",
          "en": "Sum m|x−y| over the channels. For this one-dimensional absolute-distance model, monotone coupling is optimal, although the optimizer need not be unique."
        }
      }
    ],
    "question": {
      "zh": "同一个源点的质量，必须全部送往同一个目标点吗？",
      "en": "Must all mass at one source point be sent to a single destination?"
    },
    "answer": {
      "zh": "不必。Kantorovich 运输计划允许分拆质量，只要所有边际守恒；要求每个源点只映到一个目标的是更受限制的映射表述。",
      "en": "No. A Kantorovich plan may split mass while preserving its marginals; requiring one destination per source point is the more restrictive map formulation."
    },
    "boundary": {
      "zh": "最优性结论针对一维、等总质量和 |x−y| 成本。不能把这里的贪心单调算法直接宣称适用于任意高维成本问题。",
      "en": "The optimality statement is for one dimension, equal total mass, and cost |x−y|. This monotone greedy construction is not a general solver for arbitrary high-dimensional costs."
    },
    "continuation": {
      "zh": "继续研究 Wasserstein 距离、对偶问题与测度空间；再沿有明确条件的文献桥梁进入合成 Ricci 曲率。",
      "en": "Continue to Wasserstein distances, duality, and spaces of measures, then follow the explicitly conditioned literature bridge to synthetic Ricci curvature."
    },
    "sources": [
      {
        "title": "Transportation theory (mathematics)",
        "url": "https://en.wikipedia.org/wiki/Transportation_theory_(mathematics)"
      }
    ],
    "x": 59,
    "y": 76
  },
  {
    "id": "heat-shore",
    "coreId": "pm:HeatEquation",
    "coreRefs": [
      "pm:HeatEquation",
      "pm:FourierSeriesOfFunctionOfBoundedVariation"
    ],
    "title": {
      "zh": "热流海岸",
      "en": "Heat Shore"
    },
    "subtitle": {
      "zh": "高频先退，粗结构后留",
      "en": "Fine oscillations fade first"
    },
    "domain": "数学物理与应用",
    "object": {
      "zh": "2π 周期热方程 u_t=u_xx，初始温度偏差 u₀=sin x+a sin 3x；解由两个模态的指数衰减精确给出。",
      "en": "The 2π-periodic heat equation u_t=u_xx with initial temperature deviation u₀=sin x+a sin 3x, solved exactly by exponential decay of the two modes."
    },
    "ecology": {
      "zh": "水线高度表示温度偏差，细纹是高频模态。时间推进时，三倍频纹理以 e⁻⁹ᵗ 退去，基频以 e⁻ᵗ 退去。",
      "en": "Waterline height represents temperature deviation, with fine texture from the higher mode. As time advances, the third harmonic fades as e⁻⁹ᵗ while the fundamental fades as e⁻ᵗ."
    },
    "color": "#74914d",
    "labKey": "heat",
    "level": "structure",
    "prerequisites": {
      "zh": "正弦函数、指数衰减与导数的基本意义。",
      "en": "Sine functions, exponential decay, and the basic meaning of derivatives."
    },
    "steps": [
      {
        "title": {
          "zh": "设定初始纹理",
          "en": "Set the initial pattern"
        },
        "body": {
          "zh": "在 t=0 改变 a，区分基频 sin x 与较细的 sin 3x。",
          "en": "At t=0 vary a and distinguish the fundamental sin x from the finer pattern sin 3x."
        }
      },
      {
        "title": {
          "zh": "推进物理时间",
          "en": "Advance time"
        },
        "body": {
          "zh": "让 t 增大，比较两种振幅的衰减；每个频率 n 的时间因子是 e⁻ⁿ²ᵗ。",
          "en": "Increase t and compare the amplitudes: a mode of frequency n has time factor e⁻ⁿ²ᵗ."
        }
      },
      {
        "title": {
          "zh": "检查平均值",
          "en": "Check the mean"
        },
        "body": {
          "zh": "本例两模态的周期平均值都为 0，随时间仍为 0；图中负值是温度偏差，不是负的绝对温度。",
          "en": "Both modes have zero periodic mean, which remains zero. Negative plotted values are temperature deviations, not negative absolute temperatures."
        }
      }
    ],
    "question": {
      "zh": "三倍频 sin 3x 的指数衰减率，是基频的 3 倍吗？",
      "en": "Is the exponential decay rate of sin 3x three times that of the fundamental?"
    },
    "answer": {
      "zh": "不是，是 9 倍。二阶空间导数给出 −3² sin 3x，所以时间因子为 e⁻⁹ᵗ。",
      "en": "No: it is nine times as large. The second spatial derivative gives −3² sin 3x, producing the time factor e⁻⁹ᵗ."
    },
    "boundary": {
      "zh": "这是一维、周期、常系数且无外部热源的精确两模态解。其他边界条件、非均匀介质或非线性方程需要新的模型与论证。",
      "en": "This is an exact two-mode solution in one dimension with periodic boundaries, constant coefficients, and no source term. Other boundaries, heterogeneous media, or nonlinear equations need different models and arguments."
    },
    "continuation": {
      "zh": "继续研究热半群、最大值原理、扩散核与 Feynman–Kac 公式，理解频谱和随机路径怎样描述同一种演化。",
      "en": "Continue to the heat semigroup, the maximum principle, heat kernels, and Feynman–Kac, exploring how spectra and random paths can describe the same evolution."
    },
    "sources": [
      {
        "title": "heat equation",
        "url": "https://github.com/planetmath/35_Partial_differential_equations/blob/master/35Q99-HeatEquation.tex"
      },
      {
        "title": "Fourier series of function of bounded variation",
        "url": "https://github.com/planetmath/42_Fourier_analysis/blob/master/42A16-FourierSeriesOfFunctionOfBoundedVariation.tex"
      }
    ],
    "x": 75,
    "y": 84
  },
  {
    "id": "spectral-lighthouse",
    "coreId": "pm:EigenvalueofAMatrix",
    "coreRefs": [
      "pm:EigenvalueofAMatrix",
      "pm:EigenvaluesOfAHermitianMatrixAreReal",
      "pm:SchrodingerOperator"
    ],
    "title": {
      "zh": "本征态灯塔",
      "en": "Spectral Lighthouse"
    },
    "subtitle": {
      "zh": "寻找算子作用下保持形状的模式",
      "en": "Find patterns whose shape survives an operator"
    },
    "domain": "数学物理与应用",
    "object": {
      "zh": "N 点一维 Dirichlet 离散 Laplacian L=tridiag(−1,2,−1) 的正弦本征向量与本征值。",
      "en": "Sine eigenvectors and eigenvalues of the N-point one-dimensional Dirichlet discrete Laplacian L=tridiag(−1,2,−1)."
    },
    "ecology": {
      "zh": "灯列是离散空间位置，灯的有符号高度是本征向量分量；算子作用后整体只乘一个本征值，节点位置保持。",
      "en": "The lamps are discrete spatial positions, and their signed heights are eigenvector components. Applying the operator multiplies the whole pattern by one eigenvalue while preserving its nodes."
    },
    "color": "#74914d",
    "labKey": "spectral",
    "level": "frontier",
    "prerequisites": {
      "zh": "向量、矩阵乘法、正弦函数。",
      "en": "Vectors, matrix multiplication, and sine functions."
    },
    "steps": [
      {
        "title": {
          "zh": "选择一个模式",
          "en": "Choose a mode"
        },
        "body": {
          "zh": "在 1≤k≤N 中选 k，观察 v_j=sin(jkπ/(N+1)) 的符号和内部节点。",
          "en": "Choose k with 1≤k≤N and inspect signs and internal nodes of v_j=sin(jkπ/(N+1))."
        }
      },
      {
        "title": {
          "zh": "直接应用算子",
          "en": "Apply the operator"
        },
        "body": {
          "zh": "比较 Lv 与 λₖv，其中 λₖ=2−2cos(kπ/(N+1))；注意边界值 v₀=v_{N+1}=0。",
          "en": "Compare Lv with λₖv, where λₖ=2−2cos(kπ/(N+1)); the boundary values are v₀=v_{N+1}=0."
        }
      },
      {
        "title": {
          "zh": "改变离散尺度",
          "en": "Change the discretization"
        },
        "body": {
          "zh": "改变 N，辨认矩阵维数与网格尺度的关系；把离散谱理解为带有具体尺度约定的对象。",
          "en": "Vary N and distinguish matrix dimension from grid spacing; read the discrete spectrum together with its scale convention."
        }
      }
    ],
    "question": {
      "zh": "固定 k、增加 N 后，未缩放的 λₖ 变小，能直接说同一根物理弦的能量降低了吗？",
      "en": "If unscaled λₖ decreases as N grows at fixed k, can we conclude that the energy of the same physical string has decreased?"
    },
    "answer": {
      "zh": "不能。若用 h=1/(N+1) 表示固定单位区间的网格，逼近连续 −d²/dx² 的矩阵还应乘 h⁻²；必须先统一尺度。",
      "en": "No. On a fixed unit interval with h=1/(N+1), approximating −d²/dx² requires multiplying the matrix by h⁻². The scale must be fixed before comparing energies."
    },
    "boundary": {
      "zh": "本页严格限于有限实对称矩阵。所示 L 未乘网格因子 h⁻²；无限维 Schrödinger 算子的定义域、自伴性与连续谱问题均不由此解决。",
      "en": "The lesson is strictly about finite real symmetric matrices. The displayed L omits the grid factor h⁻²; domains, self-adjointness, and continuous spectrum of infinite-dimensional Schrödinger operators remain separate questions."
    },
    "continuation": {
      "zh": "继续研究谱分解、Sturm–Liouville 问题、量子可观测量与谱方法，始终把定义域和边界条件作为算子的一部分。",
      "en": "Continue to spectral decompositions, Sturm–Liouville problems, quantum observables, and spectral methods, always treating domains and boundary conditions as part of the operator."
    },
    "sources": [
      {
        "title": "eigenvalue (of a matrix)",
        "url": "https://github.com/planetmath/65_Numerical_analysis/blob/master/65-00-EigenvalueofAMatrix.tex"
      },
      {
        "title": "eigenvalues of a Hermitian matrix are real",
        "url": "https://github.com/planetmath/15_Linear_and_multilinear_algebra_matrix_theory/blob/master/15A57-EigenvaluesOfAHermitianMatrixAreReal.tex"
      },
      {
        "title": "Schrödinger operator",
        "url": "https://github.com/planetmath/81_Quantum_theory/blob/master/81Q10-SchrodingerOperator.tex"
      }
    ],
    "x": 89,
    "y": 91
  }
];
