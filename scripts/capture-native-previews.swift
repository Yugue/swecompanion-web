// Compile with the native app's views using capture-native-previews.sh.
// Exports the real SwiftUI/AppKit renderer with bundled, offline example answers.
import AppKit
import SwiftUI
import WebKit

// Render the view at the export resolution instead of enlarging a 1× layer cache.
private final class RetinaCaptureWindow: NSWindow {
  override var backingScaleFactor: CGFloat { 4 }
}

private struct NativePreview: View {
  let mode: AnswerMode
  let action: String
  let blocks: [AnswerBlock]
  let width: CGFloat

  var body: some View {
    VStack(alignment: .leading, spacing: 0) {
      AnswerStatusBar(
        modeTitle: mode.title, actionTitle: action,
        isStreaming: false, didFail: false, captureCount: 1,
        showsAnswerStatus: true, allowsWindowSharing: false)
      AnswerView(blocks: blocks, isStreaming: false, status: "", isCompact: width < 600)
        .padding(.horizontal, Theme.answerInset)
        .padding(.top, 14)
        .padding(.bottom, 20)
    }
    .background(Theme.panel)
    .foregroundStyle(.white)
    .environment(\.colorScheme, .dark)
    .environment(\.displayScale, 4)
  }
}

@main
struct CaptureNativePreviews {
  @MainActor static func main() async throws {
    let output = URL(
      fileURLWithPath: CommandLine.arguments.dropFirst().first
        ?? "/tmp/swecompanion-native-captures", isDirectory: true)
    try FileManager.default.createDirectory(at: output, withIntermediateDirectories: true)
    let examples: [(String, AnswerMode, String)] = [
      ("coding", .leetCode, "Solve"),
      ("debug", .leetCode, "Debug"),
      ("optimize", .leetCode, "Optimize"),
      ("system-design", .systemDesign, "Solve"),
      ("ml-design", .mlSystemDesign, "Solve"),
    ]

    let only = CommandLine.arguments.dropFirst(2).first
    for (name, mode, action) in examples where only == nil || only == name {
      ModeSettings.shared.mode = mode
      let markdown = LandingPreviewAnswers.markdown(for: name)
      // Every variant contains the entire answer, including code and diagrams.
      for variant in ["-full", "", "-mobile"] {
        let width: CGFloat = variant == "-mobile" ? 380 : 640
        var blocks = AnswerParser.parse(markdown)
        for index in blocks.indices { blocks[index].id = index }
        let root = NativePreview(
          mode: mode, action: action,
          blocks: blocks, width: width)
        let hosting = NSHostingView(
          rootView: root.frame(width: width).fixedSize(horizontal: false, vertical: true))
        hosting.sizingOptions = [.intrinsicContentSize]
        hosting.frame = NSRect(x: 0, y: 0, width: width, height: 1200)
        hosting.appearance = NSAppearance(named: .darkAqua)
        // A never-shown export window supplies a real backing scale to SwiftUI.
        // No desktop contents are captured and no user window is changed.
        let window = RetinaCaptureWindow(
          contentRect: hosting.frame,
          styleMask: [.borderless], backing: .buffered, defer: false)
        window.isReleasedWhenClosed = false
        let surface = NSView(frame: hosting.frame)
        window.contentView = surface
        surface.addSubview(hosting)
        for _ in 0..<30 {
          hosting.layoutSubtreeIfNeeded()
          try await Task.sleep(for: .milliseconds(100))
        }
        let size = hosting.intrinsicContentSize
        print("Measured \(name): \(size)")
        guard size.height > 0, size.height.isFinite else {
          throw NSError(domain: "NativePreview", code: 1)
        }
        hosting.setFrameSize(NSSize(width: width, height: size.height))
        window.setContentSize(hosting.frame.size)
        for view in [hosting as NSView] + descendants(hosting) {
          view.layer?.contentsScale = 4
          view.needsDisplay = true
        }
        hosting.layoutSubtreeIfNeeded()
        try await Task.sleep(for: .milliseconds(500))

        // CacheDisplay captures native text/code; WebKit has its own compositing surface.
        let bitmap = NSBitmapImageRep(
          bitmapDataPlanes: nil, pixelsWide: Int(width * 4),
          pixelsHigh: Int(hosting.bounds.height * 4), bitsPerSample: 8,
          samplesPerPixel: 4, hasAlpha: true, isPlanar: false,
          colorSpaceName: .deviceRGB, bytesPerRow: 0, bitsPerPixel: 0)!
        bitmap.size = hosting.bounds.size
        hosting.cacheDisplay(in: hosting.bounds, to: bitmap)
        let context = NSGraphicsContext(bitmapImageRep: bitmap)!
        NSGraphicsContext.saveGraphicsState()
        NSGraphicsContext.current = context
        for web in descendants(hosting).compactMap({ $0 as? WKWebView }) {
          let config = WKSnapshotConfiguration()
          config.rect = web.bounds
          let image = try await web.takeSnapshot(configuration: config)
          let rect = hosting.convert(web.bounds, from: web)
          image.draw(
            in: NSRect(
              x: rect.minX, y: hosting.bounds.height - rect.maxY,
              width: rect.width, height: rect.height))
        }
        NSGraphicsContext.restoreGraphicsState()
        try bitmap.representation(using: .png, properties: [:])!.write(
          to: output.appendingPathComponent(name + variant + ".png"))
        print("Captured \(name + variant): \(bitmap.pixelsWide)×\(bitmap.pixelsHigh)")
        window.close()
      }
    }
  }

  static func descendants(_ view: NSView) -> [NSView] {
    view.subviews.flatMap { [$0] + descendants($0) }
  }
}
