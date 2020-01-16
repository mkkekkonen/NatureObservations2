if ([System.IO.File]::Exists('./capacitor.config.json.client')) {
  Rename-Item -Path './capacitor.config.json' -NewName './capacitor.config.json.server'
  Rename-Item -Path './capacitor.config.json.client' -NewName './capacitor.config.json'
} elseif ([System.IO.File]::Exists('./capacitor.config.json.server')) {
  Rename-Item -Path './capacitor.config.json' -NewName './capacitor.config.json.client'
  Rename-Item -Path './capacitor.config.json.server' -NewName './capacitor.config.json'
}
