import type { MlPart, MlTopic } from "./mlStudyData";

export const SPEECH_DOMAIN = "Speech / Audio";
export interface SpeechTopic extends MlTopic { prerequisites: string[] }
export interface SpeechPart extends Omit<MlPart, "topics"> {
  topics: SpeechTopic[];
  references: { title: string; url: string }[];
}

// The six-part curriculum: 31 core lessons.
// No unavailable premium quiz is advertised.
export const speechParts: SpeechPart[] = [
  {
    "id": "audio-signals",
    "number": "1",
    "title": "Audio Signals and Representations",
    "description": "Understand audio capture, frequency structure, feature extraction, and the information preprocessing changes.",
    "color": "#4285F4",
    "icon": "LineChart",
    "quizQuestionCount": 0,
    "references": [
      {
        "title": "Aalto University — Introduction to Speech Processing",
        "url": "https://speechprocessingbook.aalto.fi/"
      }
    ],
    "topics": [
      {
        "id": "sound-and-speech",
        "title": "Sound, speech, and the information in a waveform",
        "summary": "Sound is a pressure disturbance traveling through a medium. A microphone converts local pressure variation into an electrical signal; a digital recording samples that measurement. A waveform plots amplitude against time. It contains the combined effects of the source, room, microphone, and recording chain.",
        "keyPoints": [
          "Pitch reflects periodicity; formants reflect vocal-tract resonances.",
          "A recording combines source, room, microphone, and capture effects."
        ],
        "interviewPrompt": "Two people say the same vowel at the same pitch. Why can a model distinguish them?",
        "prerequisites": []
      },
      {
        "id": "digital-audio",
        "title": "Digital audio: sampling, quantization, and audio tensors",
        "summary": "A digital waveform is a sequence x[n] together with a sample rate fs. Sample n corresponds to time n/fs seconds. Without fs, the array does not determine playback speed or frequency.",
        "keyPoints": [
          "Resampling changes samples; relabeling the rate changes interpretation.",
          "Aliasing and clipping lose information that float conversion cannot restore."
        ],
        "interviewPrompt": "A model expects 16 kHz but receives 48 kHz recordings. Can you change the metadata?",
        "prerequisites": [
          "sound-and-speech"
        ]
      },
      {
        "id": "frequency-domain",
        "title": "Frequency-domain reasoning and the Fourier transform",
        "summary": "Time-domain samples describe when amplitude changes. A frequency representation describes how strongly different oscillations contribute. These are alternative views of the same finite sequence when the complete complex transform is retained.",
        "keyPoints": [
          "Complex spectra preserve magnitude and phase.",
          "Zero-padding densifies the frequency grid without adding observation time."
        ],
        "interviewPrompt": "You double the FFT size by appending zeros. Did frequency resolution double?",
        "prerequisites": [
          "digital-audio"
        ]
      },
      {
        "id": "short-time-analysis",
        "title": "Short-time analysis: windowing, spectrograms, and reconstruction",
        "summary": "A single transform of a sentence mixes vowels, consonants, silences, and noise into one spectrum. Analyze overlapping short frames to retain the evolution of frequency content.",
        "keyPoints": [
          "Window duration controls a time–frequency tradeoff; hop controls frame spacing.",
          "Reconstruction and streaming depend on window, padding, and overlap conventions."
        ],
        "interviewPrompt": "Does a 10 ms hop mean your frontend has only 10 ms latency?",
        "prerequisites": [
          "frequency-domain"
        ]
      },
      {
        "id": "perceptual-features",
        "title": "Perceptual features: log spectra, Mel spectrograms, and cepstral features",
        "summary": "Raw waveforms preserve fine timing but contain many samples. Spectra expose frequency structure. Perceptual features deliberately compress that structure to emphasize distinctions useful to a task.",
        "keyPoints": [
          "Log-Mel and cepstral features deliberately discard different information.",
          "Frontend compatibility includes conventions and normalization, not just shape."
        ],
        "interviewPrompt": "Why use log-Mel rather than cepstral coefficients for a modern acoustic encoder?",
        "prerequisites": [
          "short-time-analysis"
        ]
      },
      {
        "id": "filtering-and-preprocessing",
        "title": "Filtering, recording channels, and audio preprocessing",
        "summary": "A useful recording model is:",
        "keyPoints": [
          "Convolution models a channel; noise and reverberation are different degradations.",
          "Preprocessing must preserve targets, timestamps, and training-serving compatibility."
        ],
        "interviewPrompt": "A denoiser makes recordings sound cleaner but recognition worsens. What explains it?",
        "prerequisites": [
          "perceptual-features"
        ]
      }
    ]
  },
  {
    "id": "learning-foundations",
    "number": "2",
    "title": "The Machine-Learning Foundations Audio Actually Needs",
    "description": "Learn the mathematics, neural networks, sequence models, and pretraining needed for speech and audio.",
    "color": "#34A853",
    "icon": "Network",
    "quizQuestionCount": 0,
    "references": [
      {
        "title": "PyTorch neural-network fundamentals",
        "url": "https://docs.pytorch.org/tutorials/beginner/basics/intro.html"
      },
      {
        "title": "Attention Is All You Need",
        "url": "https://arxiv.org/abs/1706.03762"
      },
      {
        "title": "wav2vec 2.0",
        "url": "https://arxiv.org/abs/2006.11477"
      },
      {
        "title": "HuBERT: Masked Prediction of Hidden Units",
        "url": "https://arxiv.org/abs/2106.07447"
      }
    ],
    "topics": [
      {
        "id": "mathematical-tools",
        "title": "Mathematical tools and probabilistic prediction",
        "summary": "A scalar is one number; a vector is an ordered list; a matrix has two axes; a tensor generalizes this to any number of axes. An audio frame can be a vector of F features, and a recording a T × F matrix.",
        "keyPoints": [
          "Vectors and conditional probabilities describe representations and predictions.",
          "Gradients measure local sensitivity; similarity is not calibrated probability."
        ],
        "interviewPrompt": "Why is nearest-speaker cosine similarity not a probability?",
        "prerequisites": [
          "perceptual-features"
        ]
      },
      {
        "id": "neural-learning",
        "title": "Neural prediction, losses, and learning",
        "summary": "A neural network composes learned affine transformations with nonlinear functions. Without nonlinearities, stacked affine layers collapse into one affine mapping.",
        "keyPoints": [
          "Match categorical, multilabel, and regression heads to the actual target.",
          "Separate gradient computation, optimization, and held-out generalization."
        ],
        "interviewPrompt": "Your audio classifier memorizes a tiny batch but fails on validation. What next?",
        "prerequisites": [
          "mathematical-tools"
        ]
      },
      {
        "id": "convolutional-encoders",
        "title": "Convolutional audio encoders and temporal resolution",
        "summary": "A Convolutional Neural Network (CNN) learns local filters and reuses them across positions. On waveforms, filters act along samples; on spectrograms, filters can span time and frequency.",
        "keyPoints": [
          "Calculate stride, receptive field, and valid output lengths.",
          "Subsampling saves compute while risking short-event and alignment detail."
        ],
        "interviewPrompt": "Why can aggressive subsampling hurt short-word recognition?",
        "prerequisites": [
          "neural-learning",
          "filtering-and-preprocessing"
        ]
      },
      {
        "id": "sequence-modeling",
        "title": "Sequence modeling and variable-length audio",
        "summary": "A short acoustic fragment may be ambiguous until neighboring frames arrive. Sequence models carry or compute context rather than classifying each frame independently.",
        "keyPoints": [
          "Recurrence carries context; bidirectional context requires future audio.",
          "Padding, valid lengths, and stream state have different semantics."
        ],
        "interviewPrompt": "Batch recognition works, but chunked recognition degrades at every boundary. What would you inspect?",
        "prerequisites": [
          "neural-learning"
        ]
      },
      {
        "id": "attention-transformers",
        "title": "Attention, Transformers, and convolution–attention hybrids",
        "summary": "Attention computes a weighted combination of useful positions. Each position supplies a key for matching and a value for retrieval; a query specifies what the current position needs.",
        "keyPoints": [
          "Queries retrieve weighted values through keys and explicit masks.",
          "Context length, compression, and causality determine practical audio cost."
        ],
        "interviewPrompt": "Why not apply full attention directly to every raw audio sample?",
        "prerequisites": [
          "sequence-modeling",
          "convolutional-encoders"
        ]
      },
      {
        "id": "pretraining-transfer",
        "title": "Pretraining, self-supervision, and transfer learning",
        "summary": "Pretraining learns reusable structure before fitting a downstream task. Supervised pretraining uses supplied targets; self-supervised learning derives targets from the data or a learned teacher.",
        "keyPoints": [
          "Masked and contrastive objectives learn reusable representations.",
          "Choose invariances and adaptation strategy according to the downstream task."
        ],
        "interviewPrompt": "You have 20 hours of labeled call-center speech and 10,000 unlabeled hours. What would you try first?",
        "prerequisites": [
          "attention-transformers"
        ]
      }
    ]
  },
  {
    "id": "speech-recognition",
    "number": "3",
    "title": "Speech Recognition and Sequence Alignment",
    "description": "Connect acoustic evidence to linguistic targets through alignment, modeling, and decoding.",
    "color": "#EA4335",
    "icon": "GitBranch",
    "quizQuestionCount": 0,
    "references": [
      {
        "title": "Sequence Modeling with CTC",
        "url": "https://distill.pub/2017/ctc/"
      },
      {
        "title": "Sequence Transduction with Recurrent Neural Networks",
        "url": "https://arxiv.org/abs/1211.3711"
      },
      {
        "title": "PyTorch CTC loss",
        "url": "https://docs.pytorch.org/docs/stable/generated/torch.nn.CTCLoss.html"
      }
    ],
    "topics": [
      {
        "id": "recognition-targets",
        "title": "From speech to prediction targets",
        "summary": "Automatic Speech Recognition (ASR) maps audio to a transcript. Its target is not a waveform copy or a speaker identity.",
        "keyPoints": [
          "Audio timing and linguistic tokenization are different structures.",
          "Transcript conventions and vocabulary affect the target before modeling."
        ],
        "interviewPrompt": "Why not divide the recording into one equal-duration region per character?",
        "prerequisites": [
          "pretraining-transfer"
        ]
      },
      {
        "id": "ctc-alignment",
        "title": "Connectionist Temporal Classification and latent alignment",
        "summary": "Connectionist Temporal Classification (CTC) trains a framewise classifier from a full target sequence. It sums the probabilities of all valid paths that collapse to the transcript.",
        "keyPoints": [
          "CTC sums valid blank/collapse paths rather than requiring timestamps.",
          "Adjacent repeated labels require extra time positions."
        ],
        "interviewPrompt": "Why can the target “book” need more encoder frames than “boat”?",
        "prerequisites": [
          "recognition-targets"
        ]
      },
      {
        "id": "transducers-attention",
        "title": "Label-dependent recognition: transducers and attention encoder-decoders",
        "summary": "CTC's output factorization is convenient but limited. Two major alternatives explicitly use output history: Recurrent Neural Network Transducers (RNN-T) and Attention Encoder-Decoders (AED).",
        "keyPoints": [
          "Transducers and attention decoders explicitly condition on output history.",
          "A streaming loss family still requires an appropriate encoder and frontend."
        ],
        "interviewPrompt": "Would you choose a transducer or attention decoder for live captions?",
        "prerequisites": [
          "ctc-alignment",
          "attention-transformers"
        ]
      },
      {
        "id": "recognition-decoding",
        "title": "Recognition decoding, language models, and contextual biasing",
        "summary": "Decoding chooses a usable output sequence from model distributions. Search, external context, normalization, confidence, and stopping policies affect the final transcript.",
        "keyPoints": [
          "Search must match the model's path and sequence semantics.",
          "Language priors and vocabulary bias can help or overwhelm acoustic evidence."
        ],
        "interviewPrompt": "Product names are consistently misspelled. Should you retrain the recognizer?",
        "prerequisites": [
          "transducers-attention"
        ]
      }
    ]
  },
  {
    "id": "audio-understanding",
    "number": "4",
    "title": "Understanding Speakers, Events, and Acoustic Mixtures",
    "description": "Recognize events and speakers, assign turns, restore mixtures, and connect sound with language.",
    "color": "#A142F4",
    "icon": "Search",
    "quizQuestionCount": 0,
    "references": [
      {
        "title": "CLAP: Learning Audio Concepts From Natural Language Supervision",
        "url": "https://arxiv.org/abs/2206.04769"
      },
      {
        "title": "SDR — half-baked or well done?",
        "url": "https://arxiv.org/abs/1811.02508"
      },
      {
        "title": "X-vectors: Robust DNN Embeddings for Speaker Recognition",
        "url": "https://www.danielpovey.com/files/2018_icassp_xvectors.pdf"
      },
      {
        "title": "End-to-End Neural Speaker Diarization",
        "url": "https://arxiv.org/abs/1909.05952"
      }
    ],
    "topics": [
      {
        "id": "audio-events",
        "title": "Audio classification, event detection, and keyword spotting",
        "summary": "Clip classification assigns labels to a whole recording. Sound Event Detection (SED) predicts which events occur and when. Keyword spotting detects a particular spoken word or phrase, often continuously.",
        "keyPoints": [
          "Clip classification, temporal events, and continuous triggers need different outputs.",
          "False alarms per hour reveal failures that balanced clip accuracy hides."
        ],
        "interviewPrompt": "Your wake-word model reaches 99% clip accuracy but activates repeatedly overnight. Why?",
        "prerequisites": [
          "pretraining-transfer"
        ]
      },
      {
        "id": "speaker-recognition",
        "title": "Speaker embeddings, identification, and verification",
        "summary": "Identification asks which enrolled speaker produced a recording. Verification asks whether two recordings belong to the same speaker. Open-set operation permits speakers outside the enrolled population.",
        "keyPoints": [
          "Identification, verification, and open-set decisions are different tasks.",
          "Speaker similarity needs duration-aware calibration and separate spoofing evaluation."
        ],
        "interviewPrompt": "Verification improves on long recordings but deteriorates on two-second clips. What would you change?",
        "prerequisites": [
          "pretraining-transfer"
        ]
      },
      {
        "id": "diarization",
        "title": "Voice activity detection and speaker diarization",
        "summary": "Voice Activity Detection (VAD) labels speech versus nonspeech. Speaker diarization assigns local speaker identities to time intervals.",
        "keyPoints": [
          "Diarization assigns speaker activity; overlap needs multiple simultaneous labels.",
          "Segmentation and clustering errors propagate into speaker-attributed transcripts."
        ],
        "interviewPrompt": "A two-person meeting is reported as five speakers. What would you inspect?",
        "prerequisites": [
          "speaker-recognition",
          "audio-events"
        ]
      },
      {
        "id": "enhancement-separation",
        "title": "Speech enhancement, source separation, and acoustic echo cancellation",
        "summary": "Enhancement estimates a desired clean or improved signal. Source separation recovers multiple constituent signals. Acoustic Echo Cancellation (AEC) removes playback audio captured again by a microphone, using the playback reference when available.",
        "keyPoints": [
          "Mixture restoration needs assumptions about sources and acoustic paths.",
          "Permutation-invariant objectives handle arbitrary source ordering."
        ],
        "interviewPrompt": "Why is echo cancellation often easier than separating an unknown competing speaker?",
        "prerequisites": [
          "filtering-and-preprocessing",
          "neural-learning"
        ]
      },
      {
        "id": "audio-text-understanding",
        "title": "Audio–text representations and semantic audio understanding",
        "summary": "A useful system may retrieve “a dog barking near traffic,” identify an alarm, or distinguish applause from rainfall. Transcription alone discards many such acoustic events.",
        "keyPoints": [
          "Paired audio–text embeddings support retrieval and zero-shot decisions.",
          "Transcript content and general acoustic meaning are complementary evidence."
        ],
        "interviewPrompt": "Why might a speech recognizer fail as the only frontend for environmental audio search?",
        "prerequisites": [
          "pretraining-transfer",
          "audio-events"
        ]
      }
    ]
  },
  {
    "id": "audio-generation",
    "number": "5",
    "title": "Speech and Audio Generation",
    "description": "Understand linguistic conditioning, acoustic generation, waveform synthesis, and speech interactions.",
    "color": "#F29900",
    "icon": "Sparkles",
    "quizQuestionCount": 0,
    "references": [
      {
        "title": "SoundStream: An End-to-End Neural Audio Codec",
        "url": "https://arxiv.org/abs/2107.03312"
      },
      {
        "title": "Flow Matching for Generative Modeling",
        "url": "https://arxiv.org/abs/2210.02747"
      },
      {
        "title": "FastSpeech 2",
        "url": "https://arxiv.org/abs/2006.04558"
      },
      {
        "title": "Denoising Diffusion Probabilistic Models",
        "url": "https://arxiv.org/abs/2006.11239"
      }
    ],
    "topics": [
      {
        "id": "text-to-speech",
        "title": "Text-to-speech: linguistic preparation, alignment, and prosody",
        "summary": "Text-to-Speech (TTS) generates speech from text. The same sentence supports many valid timings, pitches, emphases, and voices.",
        "keyPoints": [
          "Synthesis must choose pronunciation, timing, and prosody.",
          "Alignment and duration errors can produce fluent but incorrect speech."
        ],
        "interviewPrompt": "A synthesizer sounds natural but skips words in long sentences. What would you inspect?",
        "prerequisites": [
          "recognition-targets",
          "attention-transformers"
        ]
      },
      {
        "id": "generative-modeling",
        "title": "Generative modeling: autoregression, parallel prediction, and iterative refinement",
        "summary": "Generation learns a conditional distribution over possible acoustic outputs, not merely an average target. Let c denote text, speaker, style, or other context, and z an acoustic representation.",
        "keyPoints": [
          "Autoregression, parallel prediction, diffusion, and flow matching model ambiguity differently.",
          "Compare sequential work, conditioning, quality, and inference budgets."
        ],
        "interviewPrompt": "Why might a parallel acoustic model plus a neural vocoder be faster than an autoregressive waveform model?",
        "prerequisites": [
          "text-to-speech",
          "neural-learning"
        ]
      },
      {
        "id": "vocoders-codecs",
        "title": "Waveform synthesis, neural vocoders, and audio codecs",
        "summary": "A neural vocoder converts acoustic conditioning, often a Mel spectrogram, into waveform samples. Because the features lose phase and detail, synthesis estimates plausible missing structure.",
        "keyPoints": [
          "Vocoders synthesize waveforms; codecs compress and reconstruct.",
          "Bitrate, acoustic token rate, model compute, and latency are distinct."
        ],
        "interviewPrompt": "Is halving the codec bitrate guaranteed to halve speech-generation latency?",
        "prerequisites": [
          "generative-modeling",
          "enhancement-separation"
        ]
      },
      {
        "id": "speech-language-systems",
        "title": "Conditioned generation and speech–language systems",
        "summary": "Conditioning may specify text content, speaker identity, speaking style, emotion, pace, or a reference recording. These factors interact: a reference clip may accidentally carry content or room characteristics into the output.",
        "keyPoints": [
          "Compare modular and integrated systems using grounding and interaction needs.",
          "Speaker/style control and cancellation require explicit evaluation."
        ],
        "interviewPrompt": "Would you build a voice assistant using a pipeline or an integrated audio-language model?",
        "prerequisites": [
          "vocoders-codecs",
          "recognition-decoding",
          "audio-text-understanding"
        ]
      }
    ]
  },
  {
    "id": "practical-systems",
    "number": "6",
    "title": "Building and Operating Speech / Audio ML Systems",
    "description": "Collect trustworthy data, measure quality, diagnose failures, and serve reliable real-time systems.",
    "color": "#12A89D",
    "icon": "Wrench",
    "quizQuestionCount": 0,
    "references": [
      {
        "title": "Aalto University — Introduction to Speech Processing",
        "url": "https://speechprocessingbook.aalto.fi/"
      },
      {
        "title": "SDR — half-baked or well done?",
        "url": "https://arxiv.org/abs/1811.02508"
      }
    ],
    "topics": [
      {
        "id": "data-and-baselines",
        "title": "Problem formulation, datasets, labels, and baselines",
        "summary": "State the user action, input source, output unit, allowed delay, cost of each error, and expected population. “Understand audio” is not a trainable target.",
        "keyPoints": [
          "Define annotations and split source groups before making crops.",
          "Data diversity, provenance, and a credible baseline precede architecture scaling."
        ],
        "interviewPrompt": "A random clip split gives excellent performance but new users report failures. What happened?",
        "prerequisites": [
          "speech-language-systems",
          "diarization"
        ]
      },
      {
        "id": "robustness-adaptation",
        "title": "Robust training, augmentation, and domain adaptation",
        "summary": "Specify which changes should preserve the label. Recognition may tolerate background noise; a loudness classifier may not tolerate gain changes; pitch shifting can alter speaker cues.",
        "keyPoints": [
          "Augmentation encodes assumptions about label-preserving changes.",
          "Diagnose capture, population, prevalence, and target shifts separately."
        ],
        "interviewPrompt": "Can you add arbitrary pitch shifts to improve every speech model?",
        "prerequisites": [
          "data-and-baselines",
          "pretraining-transfer"
        ]
      },
      {
        "id": "evaluation-errors",
        "title": "Evaluation metrics and systematic error analysis",
        "summary": "A metric requires a reference, matching rule, aggregation, and operating point. One number without its protocol is difficult to interpret.",
        "keyPoints": [
          "Every metric needs a matching, normalization, and aggregation protocol.",
          "Use task-specific measures, meaningful slices, and paired uncertainty estimates."
        ],
        "interviewPrompt": "WER improves but users report worse transcripts. Can both be correct?",
        "prerequisites": [
          "robustness-adaptation",
          "enhancement-separation"
        ]
      },
      {
        "id": "streaming-latency",
        "title": "Streaming, causality, endpointing, and latency",
        "summary": "Streaming consumes audio incrementally and produces useful outputs before the recording ends. State when timing begins: microphone capture, frame arrival, speech onset, or utterance end.",
        "keyPoints": [
          "Latency includes acquisition, context, queueing, and output commitment.",
          "Causality must hold across the whole pipeline, not only attention."
        ],
        "interviewPrompt": "Your recognizer has RTF 0.2 but captions appear two seconds late. Why?",
        "prerequisites": [
          "evaluation-errors",
          "recognition-decoding"
        ]
      },
      {
        "id": "efficient-deployment",
        "title": "Efficient inference and deployment tradeoffs",
        "summary": "Measure decoding, resampling, features, model execution, search, waveform generation, transfer, and queueing under realistic durations and concurrency.",
        "keyPoints": [
          "Profile weights, activations, stream state, search, and preprocessing.",
          "Compression helps only when quality and target-hardware execution validate it."
        ],
        "interviewPrompt": "Quantization reduces weight size by four times but latency barely improves. Why?",
        "prerequisites": [
          "streaming-latency"
        ]
      },
      {
        "id": "system-design",
        "title": "End-to-end system design, monitoring, and iteration",
        "summary": "```text\nrequirements → targets/data → preprocessing → baseline → model/objective\n             → evaluation/error analysis → serving → monitoring → iteration\n```",
        "keyPoints": [
          "Use one requirements-to-monitoring framework across major audio products.",
          "Stage diagnostics and representative audits distinguish warnings from quality loss."
        ],
        "interviewPrompt": "How would you improve a speech system whose overall score is already high?",
        "prerequisites": [
          "efficient-deployment"
        ]
      }
    ]
  }
];

export const speechTopics = speechParts.flatMap((part) => part.topics);
export const speechTopicCount = speechTopics.length;
export const speechTopicsById: Record<string, SpeechTopic> = Object.fromEntries(speechTopics.map((t) => [t.id, t]));
export const speechPartsById: Record<string, SpeechPart> = Object.fromEntries(speechParts.map((p) => [p.id, p]));
export const speechPartIdForTopic: Record<string, string> = Object.fromEntries(
  speechParts.flatMap((p) => p.topics.map((t) => [t.id, p.id])),
);
export const speechLessonNumbers: Record<string, string> = Object.fromEntries(
  speechParts.flatMap((p) => p.topics.map((t, i) => [t.id, p.number + "." + (i + 1)])),
);
