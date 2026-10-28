# Vision–language models

## 1. Generate language from visual evidence

A **vision–language model (VLM)** combines image information with language processing to answer questions, describe scenes, or interpret documents. A common design connects a visual encoder to a pretrained language model.

A fluent answer can still be unsupported by the image.

## 2. Connect the representations

A **projector** maps visual features to a representation compatible with the language model. Some designs insert visual vectors as sequence positions; others expose them through cross-attention.

```genai-visual
vision-language
```

The projector must do more than resize an array: training teaches the language system how visual features relate to the requested outputs.

## 3. Train the connection

Paired image–text data teaches broad alignment. Instruction examples then teach question answering, document interpretation, or other behaviors.

Training may freeze the visual encoder or language model initially and later update more components. Which weights change is a design choice.

## 4. Budget visual detail

Higher resolution or more image crops can preserve small writing but create more visual tokens and processing cost. Downsampling can erase the evidence required for counting or reading.

A language model cannot recover exact visual information that never reached its representation.

## 5. Define visual grounding

**Visual grounding** connects an output claim to relevant image evidence. Compare answers under controlled image changes, blank images, altered labels, or distractor text.

If the answer remains unchanged when decisive evidence changes, the model may be relying on language priors.

## 6. Check real failure cases

Test small text, unusual layouts, spatial relations, counting, and ambiguous images. Require the model to decline an answer when the image is unreadable rather than rewarding plausible completion.

Text embedded in images can also carry untrusted instructions. Image input belongs inside the same trust boundary analysis as retrieved text.
