import type { MlPart, MlTopic } from "./mlStudyData";

export const RL_DOMAIN = "Reinforcement Learning";
export interface RlTopic extends MlTopic { prerequisites: string[] }
export interface RlPart extends Omit<MlPart, "topics"> {
  topics: RlTopic[];
}

// Six Parts, 33 lessons. Quizzes are not advertised without published quiz content.
export const rlParts: RlPart[] = [
  {
    "id": "foundations",
    "number": "1",
    "title": "Foundations of Sequential Decision-Making",
    "description": "Build the probability, neural prediction, and decision-process foundations RL needs.",
    "color": "#4285F4",
    "icon": "Blocks",
    "topics": [
      {
        "id": "rl-problem",
        "title": "The RL problem: interaction, feedback, and delayed consequences",
        "summary": "RL learns decisions from interaction and consequences, including effects that appear after the action.",
        "keyPoints": [
          "Actions influence the experience used for future learning.",
          "Use sequential control only when future consequences justify its complexity."
        ],
        "interviewPrompt": "When is a contextual bandit sufficient instead of full RL?",
        "prerequisites": []
      },
      {
        "id": "probability-and-estimation",
        "title": "Probability and estimation for learning from experience",
        "summary": "Probabilities describe uncertain outcomes; sample averages estimate expectations from finite experience.",
        "keyPoints": [
          "Separate uncertainty in an outcome from uncertainty in its estimated mean.",
          "A policy distribution and an environment transition distribution describe different randomness."
        ],
        "interviewPrompt": "Why can two policies with equal estimated return require different confidence in deployment?",
        "prerequisites": [
          "rl-problem"
        ]
      },
      {
        "id": "function-approximation",
        "title": "Function approximation, neural networks, and gradient learning",
        "summary": "Neural networks turn observations into predictions; gradients adjust parameters to reduce a chosen loss.",
        "keyPoints": [
          "Backpropagation computes derivatives; the optimizer updates parameters.",
          "Policy, value, and model heads solve different prediction problems."
        ],
        "interviewPrompt": "How does a two-layer network learn a scalar value estimate?",
        "prerequisites": [
          "probability-and-estimation"
        ]
      },
      {
        "id": "markov-decision-processes",
        "title": "Markov Decision Processes and the information available to an agent",
        "summary": "An MDP specifies states, actions, transitions, rewards, and an objective for sequential decisions.",
        "keyPoints": [
          "A useful state contains the information needed to predict the next outcome.",
          "The agent may receive an observation that omits part of the state."
        ],
        "interviewPrompt": "A robot sees position but not velocity. Is its observation Markov?",
        "prerequisites": [
          "probability-and-estimation"
        ]
      },
      {
        "id": "policies-and-returns",
        "title": "Policies, returns, discounting, and episode boundaries",
        "summary": "A policy chooses actions; a return specifies how their future rewards are combined.",
        "keyPoints": [
          "Discounting changes the objective as well as its effective horizon.",
          "External truncation and genuine task termination have different bootstrap semantics."
        ],
        "interviewPrompt": "Should a continuing-task time limit force the next-state value to zero?",
        "prerequisites": [
          "markov-decision-processes"
        ]
      },
      {
        "id": "values-and-bellman",
        "title": "Values, advantages, and Bellman reasoning",
        "summary": "Values summarize expected future return, and Bellman equations split that return into reward and continuation.",
        "keyPoints": [
          "A policy value evaluates specified behavior; an optimal value evaluates the best attainable behavior.",
          "An advantage compares an action with the policy average in the same state."
        ],
        "interviewPrompt": "Can an action with a negative immediate reward have positive advantage?",
        "prerequisites": [
          "policies-and-returns"
        ]
      }
    ],
    "quizQuestionCount": 0
  },
  {
    "id": "learning-values",
    "number": "2",
    "title": "Learning and Improving Values from Experience",
    "description": "Connect planning, sampled backups, exploration, and tabular control.",
    "color": "#34A853",
    "icon": "TrendingUp",
    "topics": [
      {
        "id": "planning-and-dynamic-programming",
        "title": "Planning with a known model: evaluation and improvement",
        "summary": "Planning uses a known environment model to evaluate and improve decisions before gathering new experience.",
        "keyPoints": [
          "Policy iteration alternates evaluation and improvement.",
          "Value iteration combines a greedy choice with each backup."
        ],
        "interviewPrompt": "Why does policy improvement need a value estimate for future actions?",
        "prerequisites": [
          "values-and-bellman"
        ]
      },
      {
        "id": "monte-carlo-and-td",
        "title": "Learning predictions: Monte Carlo and Temporal-Difference methods",
        "summary": "Monte Carlo learns from observed returns; temporal-difference learning uses a learned continuation value.",
        "keyPoints": [
          "Bootstrapping trades dependence on future samples for dependence on current predictions.",
          "A low TD error does not establish high policy return."
        ],
        "interviewPrompt": "Why can TD learn before an episode ends while Monte Carlo cannot use its complete return yet?",
        "prerequisites": [
          "values-and-bellman"
        ]
      },
      {
        "id": "multi-step-credit",
        "title": "Multi-step returns, eligibility traces, and temporal credit",
        "summary": "Multi-step returns and traces control how observed rewards and value predictions share temporal credit.",
        "keyPoints": [
          "Longer backups propagate rewards faster but usually increase sampling variance.",
          "Lambda mixes backup lengths; it does not replace the discount factor."
        ],
        "interviewPrompt": "What changes when lambda increases while gamma stays fixed?",
        "prerequisites": [
          "monte-carlo-and-td"
        ]
      },
      {
        "id": "exploration-and-bandits",
        "title": "Exploration through the bandit lens",
        "summary": "Exploration spends actions to learn which decisions are valuable; exploitation uses current estimates.",
        "keyPoints": [
          "Bandits isolate information gathering without action-dependent future state transitions.",
          "Uncertainty-directed exploration differs from uniformly random actions."
        ],
        "interviewPrompt": "Why can epsilon-greedy waste samples after one action is clearly inferior?",
        "prerequisites": [
          "probability-and-estimation",
          "policies-and-returns"
        ]
      },
      {
        "id": "on-and-off-policy",
        "title": "On-policy and off-policy learning: whose experience is usable?",
        "summary": "On-policy and off-policy describe the relationship between the behavior generating data and the policy being evaluated or improved.",
        "keyPoints": [
          "Importance ratios correct supported action-distribution differences.",
          "Correct action ratios alone do not generally fix a different state distribution."
        ],
        "interviewPrompt": "Why can an unbiased off-policy return estimator still be unusable?",
        "prerequisites": [
          "multi-step-credit",
          "exploration-and-bandits"
        ]
      },
      {
        "id": "tabular-control",
        "title": "Learning control: SARSA, Expected SARSA, and Q-learning",
        "summary": "SARSA, Expected SARSA, and Q-learning differ in the continuation action used by their control backup.",
        "keyPoints": [
          "SARSA evaluates the behavior policy; Q-learning uses a greedy continuation target.",
          "Tabular convergence assumptions do not transfer automatically to neural networks."
        ],
        "interviewPrompt": "Why can SARSA choose a safer cliff-walking route during exploration?",
        "prerequisites": [
          "on-and-off-policy"
        ]
      }
    ],
    "quizQuestionCount": 0
  },
  {
    "id": "deep-values",
    "number": "3",
    "title": "Deep Value Learning and State Representation",
    "description": "Understand neural value learning, its instability, and incomplete observations.",
    "color": "#EA4335",
    "icon": "Network",
    "topics": [
      {
        "id": "value-instability",
        "title": "Why learned value functions can become unstable",
        "summary": "Bootstrapped value learning can amplify its own prediction errors when approximation and off-policy data interact.",
        "keyPoints": [
          "Shared parameters couple updates across states and actions.",
          "The deadly triad identifies a risk of divergence, not an inevitable failure."
        ],
        "interviewPrompt": "Why can repeated fitting of a changing value target diverge?",
        "prerequisites": [
          "function-approximation",
          "tabular-control"
        ]
      },
      {
        "id": "deep-q-networks",
        "title": "Deep Q-Networks: replay and stable targets",
        "summary": "A DQN learns discrete-action values with replayed transitions and a slowly changing target network.",
        "keyPoints": [
          "Replay improves data reuse and reduces short-range correlation.",
          "Detach bootstrap targets and preserve genuine terminal semantics."
        ],
        "interviewPrompt": "Why use a target network if the online network already predicts next-state values?",
        "prerequisites": [
          "value-instability"
        ]
      },
      {
        "id": "better-value-estimates",
        "title": "Better value estimates: maximization bias and selective replay",
        "summary": "Double DQN reduces maximization bias; prioritized replay reallocates learning effort toward selected transitions.",
        "keyPoints": [
          "Separate action selection from action evaluation.",
          "Nonuniform replay changes the sampled training objective unless corrected."
        ],
        "interviewPrompt": "How can selecting the maximum of noisy unbiased estimates create optimistic targets?",
        "prerequisites": [
          "deep-q-networks"
        ]
      },
      {
        "id": "partial-observability",
        "title": "Partial observability: observations, memory, and belief",
        "summary": "Memory and belief representations help when one observation cannot predict the consequences of an action.",
        "keyPoints": [
          "Repeated observations can hide different underlying states.",
          "Recurrent replay needs sequence context, reset masks, and valid hidden states."
        ],
        "interviewPrompt": "Why might more network width fail to fix an agent that cannot infer velocity?",
        "prerequisites": [
          "markov-decision-processes",
          "function-approximation",
          "deep-q-networks"
        ]
      }
    ],
    "quizQuestionCount": 0
  },
  {
    "id": "policy-optimization",
    "number": "4",
    "title": "Policy Optimization and Actor–Critic Learning",
    "description": "Derive policy learning and compare stable discrete and continuous control.",
    "color": "#A142F4",
    "icon": "GitBranch",
    "topics": [
      {
        "id": "policy-gradients",
        "title": "Direct policy learning and the score-function gradient",
        "summary": "Policy gradients change action probabilities using rewards attached to sampled decisions.",
        "keyPoints": [
          "Log-probability gradients work even when the action or environment is not differentiable.",
          "Return weighting makes gradient estimates noisy."
        ],
        "interviewPrompt": "Why does the REINFORCE gradient not differentiate through the sampled action?",
        "prerequisites": [
          "function-approximation",
          "on-and-off-policy"
        ]
      },
      {
        "id": "actor-critic-and-gae",
        "title": "Baselines, advantage estimation, and actor–critic updates",
        "summary": "An actor changes behavior while a critic supplies a lower-variance estimate of its improvement signal.",
        "keyPoints": [
          "Action-independent baselines preserve the expected score-function gradient.",
          "Generalized advantage estimation applies the multi-step bias–variance tradeoff to policy updates."
        ],
        "interviewPrompt": "What happens when a critic is inaccurate but its predictions reduce return variance?",
        "prerequisites": [
          "policy-gradients",
          "multi-step-credit"
        ]
      },
      {
        "id": "proximal-policy-optimization",
        "title": "Controlled policy changes: trust regions and Proximal Policy Optimization",
        "summary": "PPO uses recent rollouts and a clipped likelihood-ratio surrogate to moderate policy changes.",
        "keyPoints": [
          "Clipping removes some incentives for large changes; it does not enforce a hard KL bound.",
          "Repeated epochs on recent rollouts do not make PPO a general replay-based off-policy method."
        ],
        "interviewPrompt": "Why can PPO still collapse even when its clipping fraction is high?",
        "prerequisites": [
          "actor-critic-and-gae"
        ]
      },
      {
        "id": "continuous-actor-critics",
        "title": "Continuous control with off-policy actor–critics",
        "summary": "DDPG and TD3 use a differentiable critic to improve continuous actions without enumerating an action space.",
        "keyPoints": [
          "The actor can exploit errors in its critic.",
          "Twin targets, delayed actor updates, and target smoothing address related instability mechanisms."
        ],
        "interviewPrompt": "What does the deterministic actor gradient differentiate through?",
        "prerequisites": [
          "actor-critic-and-gae",
          "better-value-estimates"
        ]
      },
      {
        "id": "soft-actor-critic",
        "title": "Maximum-entropy learning and Soft Actor–Critic",
        "summary": "SAC learns a stochastic off-policy actor under an entropy-regularized return objective.",
        "keyPoints": [
          "Entropy changes the objective and can support broader action sampling.",
          "The log density must account for squashing continuous actions into bounds."
        ],
        "interviewPrompt": "Why does increasing the entropy temperature change both exploration and the preferred policy?",
        "prerequisites": [
          "continuous-actor-critics",
          "policy-gradients"
        ]
      }
    ],
    "quizQuestionCount": 0
  },
  {
    "id": "models-and-data",
    "number": "5",
    "title": "Models, Demonstrations, Offline Data, and Modern AI",
    "description": "Plan with models, learn from existing data, and connect RL to modern AI.",
    "color": "#F9AB00",
    "icon": "Layers",
    "topics": [
      {
        "id": "models-and-planning",
        "title": "Learning a model and planning with it",
        "summary": "A learned model supports simulated experience or lookahead, while model error limits trustworthy planning.",
        "keyPoints": [
          "Dyna improves a policy using imagined transitions.",
          "Receding-horizon planning acts on the first decision and replans after new evidence."
        ],
        "interviewPrompt": "Why can longer model rollouts make a policy worse despite using more compute?",
        "prerequisites": [
          "planning-and-dynamic-programming",
          "soft-actor-critic"
        ]
      },
      {
        "id": "learning-from-demonstrations",
        "title": "Learning from demonstrations and correcting imitation failures",
        "summary": "Imitation learns demonstrated actions; interaction can reveal states missing from demonstration data.",
        "keyPoints": [
          "Behavior cloning can fail through compounding distribution shift.",
          "Dataset aggregation requests expert labels at learner-visited states."
        ],
        "interviewPrompt": "Why is low held-out action error insufficient for a long-horizon imitation task?",
        "prerequisites": [
          "function-approximation",
          "partial-observability"
        ]
      },
      {
        "id": "offline-reinforcement-learning",
        "title": "Offline RL: improvement under dataset constraints",
        "summary": "Offline RL optimizes behavior from a fixed dataset while controlling unsupported policy improvements.",
        "keyPoints": [
          "Off-policy data reuse does not make an algorithm reliable offline.",
          "Conservative estimates and behavior constraints address different forms of extrapolation risk."
        ],
        "interviewPrompt": "Why can a large offline replay buffer still lead to a failed Q-learning policy?",
        "prerequisites": [
          "on-and-off-policy",
          "better-value-estimates",
          "learning-from-demonstrations"
        ]
      },
      {
        "id": "off-policy-evaluation",
        "title": "Evaluating a policy before online deployment",
        "summary": "Off-policy evaluation estimates a new policy using logged experience and explicit coverage and identification assumptions.",
        "keyPoints": [
          "Importance sampling, fitted evaluation, and doubly robust estimators rely on different information.",
          "Neither a narrow confidence interval nor a learned model repairs absent causal support."
        ],
        "interviewPrompt": "What must be logged to evaluate a policy that differs from the deployed behavior?",
        "prerequisites": [
          "offline-reinforcement-learning"
        ]
      },
      {
        "id": "feedback-and-preferences",
        "title": "Human feedback, reward models, and preference optimization",
        "summary": "Human comparisons can train a reward model or directly train relative policy preferences.",
        "keyPoints": [
          "RLHF separates demonstration fitting, preference reward learning, and policy optimization.",
          "Direct preference optimization uses an offline preference loss rather than an online RL rollout loop."
        ],
        "interviewPrompt": "Why can reward-model score increase while human preference decreases?",
        "prerequisites": [
          "proximal-policy-optimization",
          "offline-reinforcement-learning"
        ]
      },
      {
        "id": "language-model-decisions",
        "title": "Language-model decisions, verifiable rewards, and tool use",
        "summary": "Language generation and tool use can be formulated as decisions with outcome rewards, costs, and partial observations.",
        "keyPoints": [
          "Action granularity determines the credit-assignment problem.",
          "Verifiers and held-out execution outcomes can disagree with visible training reward."
        ],
        "interviewPrompt": "When does a tool-use task need sequential RL instead of a one-step preference objective?",
        "prerequisites": [
          "feedback-and-preferences",
          "partial-observability"
        ]
      }
    ],
    "quizQuestionCount": 0
  },
  {
    "id": "practical-systems",
    "number": "6",
    "title": "Building, Evaluating, and Operating RL Systems",
    "description": "Design rewards, collect experience, diagnose training, and deploy evaluated behavior.",
    "color": "#00ACC1",
    "icon": "Wrench",
    "topics": [
      {
        "id": "reward-design",
        "title": "Reward design, objective mismatch, and constraints",
        "summary": "Reward design turns intended behavior into an optimizable objective whose loopholes an agent can discover.",
        "keyPoints": [
          "Potential-based shaping preserves policy rankings under its stated boundary conditions.",
          "Expected cost penalties are different from hard per-action safety constraints."
        ],
        "interviewPrompt": "Why can adding a reward for moving toward a goal produce a loop?",
        "prerequisites": [
          "policies-and-returns",
          "values-and-bellman"
        ]
      },
      {
        "id": "sparse-rewards-and-exploration",
        "title": "Difficult exploration and long-horizon tasks",
        "summary": "Sparse tasks require discovering useful experience before value or policy updates can exploit it.",
        "keyPoints": [
          "Intrinsic signals and curricula influence which evidence becomes available.",
          "Goal relabeling needs valid counterfactual rewards and compatible dynamics."
        ],
        "interviewPrompt": "How can a failed goal attempt become useful training data?",
        "prerequisites": [
          "exploration-and-bandits",
          "reward-design",
          "offline-reinforcement-learning"
        ]
      },
      {
        "id": "training-systems",
        "title": "Training systems: environments, experience, and resource budgets",
        "summary": "An RL training system joins environment execution, versioned experience, storage, and learning under an explicit resource budget.",
        "keyPoints": [
          "Track interactions, updates, policy lag, wall-clock time, and replay memory separately.",
          "Reset boundaries, final observations, and random seeds are learning semantics."
        ],
        "interviewPrompt": "What breaks if a vectorized environment returns a reset observation as the transition successor?",
        "prerequisites": [
          "partial-observability",
          "proximal-policy-optimization",
          "soft-actor-critic"
        ]
      },
      {
        "id": "training-diagnostics",
        "title": "Diagnosing failed or unstable training",
        "summary": "Diagnose learning failures through a chain of falsifiable checks from environment semantics to targets, gradients, coverage, and behavior.",
        "keyPoints": [
          "Small deterministic tasks expose errors before expensive tuning.",
          "Loss, value scale, reward, and policy diagnostics answer different questions."
        ],
        "interviewPrompt": "Return rises but success falls. What do you inspect first?",
        "prerequisites": [
          "training-systems",
          "reward-design"
        ]
      },
      {
        "id": "evaluation-and-generalization",
        "title": "Reliable evaluation, generalization, and simulation-to-reality gaps",
        "summary": "Reliable RL evaluation separates policy learning, model selection, and final testing across tasks and random seeds.",
        "keyPoints": [
          "Training seeds and evaluation episodes measure different uncertainty.",
          "Evaluate task success, robustness, cost, and failures alongside reward."
        ],
        "interviewPrompt": "Why do a thousand episodes from one trained policy not replace independent training seeds?",
        "prerequisites": [
          "off-policy-evaluation",
          "training-diagnostics"
        ]
      },
      {
        "id": "selection-and-deployment",
        "title": "End-to-end algorithm selection, deployment, and monitoring",
        "summary": "Choose an algorithm and deployment plan from the task, data access, action space, observation quality, and operational constraints.",
        "keyPoints": [
          "A baseline establishes whether sequential learning adds measurable value.",
          "Deploy with versioned observations, bounded actions, fallback behavior, and outcome monitoring."
        ],
        "interviewPrompt": "Design a deployment plan for a continuous-control policy trained mostly in simulation.",
        "prerequisites": [
          "evaluation-and-generalization",
          "models-and-planning",
          "language-model-decisions"
        ]
      }
    ],
    "quizQuestionCount": 0
  }
];

export const rlTopics = rlParts.flatMap((part) => part.topics);
export const rlTopicCount = rlTopics.length;
export const rlTopicsById: Record<string, RlTopic> = Object.fromEntries(rlTopics.map((t) => [t.id, t]));
export const rlPartsById: Record<string, RlPart> = Object.fromEntries(rlParts.map((p) => [p.id, p]));
export const rlPartIdForTopic: Record<string, string> = Object.fromEntries(
  rlParts.flatMap((p) => p.topics.map((t) => [t.id, p.id])),
);
export const rlLessonNumbers: Record<string, string> = Object.fromEntries(
  rlParts.flatMap((p) => p.topics.map((t, i) => [t.id, p.number + "." + (i + 1)])),
);
