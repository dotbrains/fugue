# Homebrew formula for fugue.
#
# Canonical copy lives here; on release, copy it to dotbrains/homebrew-tap as
# Formula/fugue.rb and fill in `url`/`sha256` for the tagged tarball so users can
# `brew install dotbrains/tap/fugue`. Until then, `--HEAD` installs from main.
class Fugue < Formula
  desc "Incognito mode for AI coding agents: no-trace, sandboxed sessions"
  homepage "https://github.com/dotbrains/fugue"
  # On release, point at the tagged tarball and set its sha256:
  #   url "https://github.com/dotbrains/fugue/archive/refs/tags/v0.1.0.tar.gz"
  #   sha256 "..."
  url "https://github.com/dotbrains/fugue/archive/refs/tags/v0.1.0.tar.gz"
  sha256 "0000000000000000000000000000000000000000000000000000000000000000"
  # PolyForm Shield 1.0.0 is not an SPDX identifier Homebrew can represent.
  license :cannot_represent
  head "https://github.com/dotbrains/fugue.git", branch: "main"

  depends_on "bash"
  # The docker backend additionally needs Docker; the native backend needs macOS
  # sandbox-exec (built in). Neither can be a hard Homebrew dependency.

  def install
    # Ship the whole tree so the launcher can find profiles/ and src/.
    libexec.install "bin", "src", "profiles"
    (bin/"fugue").write <<~SH
      #!/bin/bash
      exec "#{libexec}/bin/fugue" "$@"
    SH
  end

  test do
    assert_match "Usage", shell_output("#{bin}/fugue --help")
  end
end
