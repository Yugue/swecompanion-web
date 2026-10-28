# Generative adversarial networks

## 1. Train two competing models

A **generative adversarial network (GAN)** trains a generator to produce samples and a discriminator to distinguish generated samples from real ones. Each model changes the learning problem faced by the other.

The generator maps sampled noise to data. The discriminator returns a real-versus-generated score.

## 2. Follow the two updates

```genai-visual
gan-game
```

First train the discriminator on real data and generated data, holding the generator fixed. Then train the generator through discriminator feedback while holding discriminator parameters fixed.

Frozen discriminator parameters can still transmit gradients to generator outputs.

## 3. Write the original game

\[
\min_G\max_D\ \mathbb E_{x\sim p_{data}}[\log D(x)]+\mathbb E_{z\sim p(z)}[\log(1-D(G(z)))]
\]
x is real data; z sampled latent noise; G the generator; D its discriminator probability. D maximizes discrimination quality; G minimizes this original objective’s generated-sample term.

## 4. Avoid a weak generator signal

The original saturating generator objective can give weak gradients when D rejects generated samples confidently. A common **non-saturating** alternative minimizes −log D(G(z)).

Both aim at matching the data distribution, but their gradients differ. D returning 0.5 everywhere could indicate indistinguishable samples or a failed discriminator; its accuracy alone cannot distinguish these cases.

## 5. Recognize mode collapse

**Mode collapse** occurs when the generator covers only a small subset of valid outputs. It may learn many convincing variations of one face while neglecting other face types.

This differs from VAE posterior collapse: the failure here is poor output coverage in the adversarial game.

## 6. Compare practical tradeoffs

GANs can generate samples in one forward pass, but balancing the two models can be unstable. Sharpness does not guarantee diversity, correct conditioning, or absence of memorization.

Evaluate realism and coverage separately, and inspect changes over training rather than trusting one attractive sample.
