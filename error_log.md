7:32:11 PM: Failed during stage 'Reading and parsing configuration files': 
When resolving config file /opt/build/repo/netlify.toml:
Configuration property functions.timeout must be an object.

Invalid syntax

  [functions]
  timeout = 15

Valid syntax

  [functions]

    [functions.timeout]
    external_node_modules = [
      "module-one",
      "module-two"
    ]

: exit status 1
7:32:11 PM: Failing build: Failed to parse configuration