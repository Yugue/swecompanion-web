"""Regenerate the guide's deterministic, analytically defined signal plots.

Requires NumPy and Matplotlib. No external recordings or datasets are used.
"""
from pathlib import Path
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

OUTPUT = Path(__file__).resolve().parents[1] / "public/speech"
OUTPUT.mkdir(parents=True, exist_ok=True)
plt.rcParams.update({
    "font.size": 11, "axes.spines.top": False, "axes.spines.right": False,
    "axes.labelcolor": "#334155", "text.color": "#0f172a",
    "xtick.color": "#475569", "ytick.color": "#475569",
    "figure.facecolor": "#f8fafc", "axes.facecolor": "#f8fafc",
    "svg.hashsalt": "speech-guide", "savefig.facecolor": "#f8fafc",
})
BLUE, PURPLE, ORANGE = "#2563eb", "#7c3aed", "#c2410c"

def save(fig, name):
    fig.savefig(OUTPUT / (name + ".svg"), metadata={"Date": None}, bbox_inches="tight")
    # A preview outside the repository supports visual inspection.
    fig.savefig(Path("/tmp") / ("speech-" + name + ".png"), dpi=110, bbox_inches="tight")
    plt.close(fig)

fs = 16000
t = np.arange(fs // 2) / fs
x = np.sin(2*np.pi*120*t) + .45*np.sin(2*np.pi*240*t) + .2*np.sin(2*np.pi*360*t)
fig, ax = plt.subplots(2, 1, figsize=(9, 5), layout="constrained")
ax[0].plot(t[:480]*1000, x[:480], color=BLUE)
ax[0].set(xlabel="Time (ms)", ylabel="Amplitude", title="Harmonics combine into a periodic waveform")
freq = np.fft.rfftfreq(len(x), 1/fs)
amp = np.abs(np.fft.rfft(x)) * 2 / len(x)
ax[1].stem(freq[:251], amp[:251], linefmt=PURPLE, markerfmt=" ", basefmt=" ")
ax[1].set(xlabel="Frequency (Hz)", ylabel="Amplitude", xlim=(0, 500), title="Fundamental 120 Hz; harmonics at 240 and 360 Hz")
save(fig, "waveform-spectrum")

fig, ax = plt.subplots(figsize=(9, 3.5), layout="constrained")
t = np.linspace(0, .001, 2000)
sample_t = np.arange(9) / 8000
ax.plot(t*1000, np.cos(2*np.pi*6000*t), color=BLUE, label="6 kHz cosine")
ax.plot(t*1000, np.cos(2*np.pi*2000*t), color=ORANGE, linestyle="--", label="2 kHz cosine")
ax.scatter(sample_t*1000, np.cos(2*np.pi*6000*sample_t), color="#0f172a", zorder=5, label="Samples at 8 kHz")
ax.set(xlabel="Time (ms)", ylabel="Amplitude", title="Two different tones agree at every sample")
ax.legend(loc="upper right", fontsize=9, ncols=3)
save(fig, "aliasing")

fig, ax = plt.subplots(2, 1, figsize=(9, 5), layout="constrained")
t = np.arange(1120) / 16000
wave = np.sin(2*np.pi*250*t)
ax[0].plot(t*1000, wave, color="#94a3b8", linewidth=1)
for offset, color in [(0,BLUE),(160,PURPLE),(320,ORANGE)]:
    tw=t[offset:offset+400]
    ax[0].plot(tw*1000, np.hanning(400), color=color, linewidth=2, label=str(offset/16)+" ms start")
ax[0].set(xlabel="Time (ms)", ylabel="Amplitude / window", title="25 ms windows advance by a 10 ms hop")
ax[0].legend(fontsize=9, ncols=3)
window=np.hanning(400)
ax[1].plot(np.arange(400)/16, wave[:400]*window, color=BLUE)
ax[1].set(xlabel="Local time within frame (ms)", ylabel="Windowed amplitude", title="A taper reduces abrupt frame boundaries")
save(fig, "windowing")

fs=4000
t=np.arange(fs)/fs
gate=(t>=.12)&(t<=.88)
x=gate*(.65*np.sin(2*np.pi*300*t)+.65*np.sin(2*np.pi*360*t))
x+=np.exp(-((t-.5)/.0015)**2)*2
fig, axes=plt.subplots(2,1,figsize=(9,5.5),layout="constrained")
for ax,L,H,title in zip(axes,[40,320],[10,40],["10 ms window: brief event localized, nearby tones blurred","80 ms window: tones separated, brief event smeared"]):
    frames=np.lib.stride_tricks.sliding_window_view(x,L)[::H]
    win=np.hanning(L)
    power=20*np.log10(np.maximum(np.abs(np.fft.rfft(frames*win,axis=-1))*2/win.sum(),1e-6))
    times=(np.arange(len(frames))*H+L/2)/fs
    freqs=np.fft.rfftfreq(L,1/fs)
    mesh=ax.pcolormesh(times,freqs,power.T,shading="auto",cmap="magma",vmin=-60,vmax=0,rasterized=True)
    ax.set(xlabel="Time (s)",ylabel="Frequency (Hz)",ylim=(0,1000),title=title)
fig.colorbar(mesh,ax=list(axes),label="Magnitude (dB relative to amplitude 1)",shrink=.85)
save(fig,"spectrogram-resolution")

freq=np.linspace(0,8000,1601)
to_mel=lambda f:2595*np.log10(1+f/700)
to_hz=lambda m:700*(10**(m/2595)-1)
edges=to_hz(np.linspace(to_mel(0),to_mel(8000),11))
fig,ax=plt.subplots(figsize=(9,3.5),layout="constrained")
for i in range(9):
    a,b,c=edges[i:i+3]
    weights=np.maximum(0,np.minimum((freq-a)/(b-a),(c-freq)/(c-b)))
    ax.plot(freq,weights,linewidth=1.8)
ax.set(xlabel="Frequency (Hz)",ylabel="Filter weight",title="Equally spaced Mel centers produce wider high-frequency bands",ylim=(0,1.1))
save(fig,"mel-filterbank")

fs=8000
t=np.arange(1600)/fs
dry=np.sin(2*np.pi*220*t)*np.exp(-((t-.025)/.007)**2)
h=np.zeros(700);h[0]=1;h[200]=.55;h[400]=.32;h[600]=.18
wet=np.convolve(dry,h)[:len(dry)]
fig,ax=plt.subplots(2,1,figsize=(9,5),layout="constrained")
ax[0].stem(np.arange(len(h))/fs*1000,h,linefmt=PURPLE,markerfmt=" ",basefmt=" ")
ax[0].set(xlabel="Delay (ms)",ylabel="Weight",title="Illustrative room response: direct path and delayed reflections")
ax[1].plot(t*1000,dry,label="Source",color=BLUE)
ax[1].plot(t*1000,wet,label="Source convolved with response",color=ORANGE,alpha=.8)
ax[1].set(xlabel="Time (ms)",ylabel="Amplitude",title="Reflections spread source energy over time")
ax[1].legend(fontsize=9)
save(fig,"room-response")
print("Generated six signal figures in", OUTPUT)
