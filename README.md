# Serverless Scripting CLI

StackPath's serverless scripting platform allows you to add custom logic to your
applications or even build entire applications on the edge. With a simple deploy
your scripts are deployed to StackPath's vast network containing over 45 POP's.
This CLI makes deploying as easy as running a single command, no matter the
amount of scripts you have.

[![Version](https://img.shields.io/npm/v/@stackpath/serverless-scripting-cli.svg)](https://www.npmjs.com/package/@stackpath/serverless-scripting-cli)
[![Downloads/week](https://img.shields.io/npm/dw/@stackpath/serverless-scripting-cli.svg)](https://www.npmjs.com/package/@stackpath/serverless-scripting-cli)
[![License](https://img.shields.io/npm/l/@stackpath/serverless-scripting-cli.svg?style=flat)](https://github.com/stackpath/serverless-scripting-cli/blob/master/LICENSE.md)
[![Build Status](https://travis-ci.org/stackpath/serverless-scripting-cli.svg)](https://travis-ci.org/stackpath/serverless-scripting-cli)

# Introduction

This CLI makes deploying to the serverless scripting platform as easy as running
a single command. It's easy to use, but allows for a variety of use-cases. You
can run the CLI locally to make deploying a whole lot quicker, run it in a CI/CD
pipeline to automate the deployments, or implement it in any way you can think of.

**How to get started?**

1. [Install the CLI](#installing-the-cli)
2. [Save your credentials](#setting-authentication-details)
3. [Set up the configuration file](#configure-project)
4. [Deploy](#deploying-with-the-cli)

## Installing the CLI

Depending on your platform and preferences there are a couple of ways to get the
CLI.

### Installing through NPM

Run `npm install -g @stackpath/serverless-scripting-cli` to install `sp-serverless`
as a global package.

### Installing through Yarn

Run `yarn global add @stackpath/serverless-scripting-cli` to install `sp-serverless`
as a global package.

### Installing through Homebrew or Linuxbrew

StackPath maintains a [Homebrew tap](https://github.com/stackpath/homebrew-stackpath)
for users to access utilities through the popular [Homebrew](https://brew.sh/)
and [Linuxbrew](https://docs.brew.sh/Linuxbrew) package managers for macOS and
Linux.

Run `brew tap stackpath/stackpath` to install the tap, then run `brew install sp-serverless`
to install the `sp-serverless` utility.

## Setting authentication details

The CLI saves your authentication data in a file in your home directory
(`~/.stackpath/credentials`). Once you have set this up, the CLI will continue
to read the credentials from the file, meaning that you don't have to provide
your credentials over and over again.

In order to authenticate yourself, you need a client ID and a client secret. You
can find them in [the StackPath client portal](https://control.stackpath.com/api-management).

### Authenticating in an interactive environment (e.g. on your local machine)

> 👉 To authenticate in an interactive environment you can simply run `sp-serverless auth`. The CLI will prompt you for required details.

### Authenticating in a **non**-interactive environment (e.g. in a CI/CD pipeline)

Are you integrating the CLI with a non-interactive environment? Then provide the
client ID and the client secret as flags of the command. For example:

```bash
sp-serverless auth --client_id example-client-id --client_secret example-client-secret --force
```

Use the `--force` (or `-f`) flag so that the credentials file is always
overwritten, even if it already exists.

## Configure project

The serverless scripting CLI works with a per-project (or per-directory) based
configuration. Each project should have its own configuration file defining the
scripts that apply to that project. You might use it to order scripts by
website, category (such as firewalls), or otherwise.

Start by including a `sp-serverless.json`-file in your project directory. The
required contents can be found below 👇.

### stackpath-serverless.json configuration file

When deploying (`sp-serverless deploy`), the CLI tries to find the `sp-serverless.json`
configuration file in the directory you're running the command from. Through
this file you can configure which scripts you'd like to deploy to which site.

Here's an example:

```
{
  "stack_id": "2dad0e92-61f1-4fb2-bbc0-0c26466e91bf",
  "site_id": "1cb3a9ba-06a4-4528-96a4-c4e04598c856",
  "scripts": [
    {
      "name": "Admin IP firewall",
      "paths": [
        "admin/*"
      ],
      "file": "serverless_scripts/ip-firewall.js",
      // The ID is generated on first deploy, or - optionally - you can configure it yourself.
      "id": "dcdf7824-b6bd-42b8-9b16-9235eefd583d"
    },
    {
      "name": "Script to show a deploy to a different site",
      "paths": [
        "demo/*"
      ],
      "file": "serverless_scripts/demo.js",
      "site_id": "15ece821-9eed-4590-9577-b83beda947f7"
    },
    {
      "name": "Script to show a deploy to a different site and stack",
      "paths": [
        "demo/*"
      ],
      "file": "serverless_scripts/demo.js",
      "site_id": "15ece821-9eed-4590-9577-b83beda947f7",
      "stack_id": "7be2de57-d6d9-4c27-8361-aef01e1870f0"
    }
  ]
}
```

> Note that you can define the `site_id` either in a global scope or in a per-script scope. This allows you to deploy to different sites from a single configuration file.

### Overview of all configuration parameters

| Key                | Description                                                                                                                                                                            |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `stack_id`         | The ID of the stack where your site is in.                                                                                                                                             |
| `site_id`          | The ID of the site you'd like to apply the scripts to.                                                                                                                                 |
| `scripts[name]`    | The name of the script. This should be descriptive and unique to each site.                                                                                                            |
| `scripts[paths][]` | The paths the script should apply to. Relative to your site. **Without starting `/`**. If you'd like to apply the script to `http://example.org/admin/*` you'd use the `admin/*` path. |
| `scripts[file]`    | The file where the required JS is in. Define the path relative to the serverless configuration JSON. Without a starting `/`.                                                           |
| `scripts[id]`      | The ID of the script in the serverless scripting platform. Will be created after first deploy. Should be checked into version control after being created.                             |

### Where to find the stack and site ID?

You can find the stack and site ID in the URL when you're logged into the
StackPath client portal and have selected the CDN site you'd like to deploy
scripts to. See the illustration below for more information on which IDs to copy.

![How to find the IDs in the URL](https://cdn.developer.stackpath.com/assets/github.com/stackpath/edgeengine-cli/README.md/finding-stack-and-site-id.png)

## Deploying with the CLI

When talking about deploying in the context of the serverless scripting platform
we mean getting local code onto the StackPath Edge. You might also call it
"updating" or "pushing" code.

> 👉 Deploying is as easy as running `sp-serverless deploy` from your project directory (given it has the `sp-serverless.json`-file).

### Deploying from a non-interactive environment

During the deployment the CLI might prompt you in certain situations. For
example, when your `sp-serverless.json` holds an ID that can not be found in the
platform. The CLI will then prompt you if you'd like to re-create the script. In
non-interactive environments you can use the `--force` or `-f` flag to always
try to re-create the script.

# Usage

<!-- usage -->

```sh-session
$ npm install -g @stackpath/serverless-scripting-cli
$ sp-serverless COMMAND
running command...
$ sp-serverless (-v|--version|version)
@stackpath/serverless-scripting-cli/2.0.0 darwin-x64 node-v10.15.0
$ sp-serverless --help [COMMAND]
USAGE
  $ sp-serverless COMMAND
...
```

<!-- usagestop -->

# Commands

<!-- commands -->

- [`sp-serverless auth`](#sp-serverless-auth)
- [`sp-serverless deploy`](#sp-serverless-deploy)
- [`sp-serverless help [COMMAND]`](#sp-serverless-help-command)

## `sp-serverless auth`

Configures StackPath's authentication details.

```
USAGE
  $ sp-serverless auth

OPTIONS
  -c, --client_id=client_id          StackPath Client ID used to authenticate with
  -f, --force                        Set this to always overwrite current credential file, defaults to false.
  -h, --help                         show CLI help
  -s, --client_secret=client_secret  StackPath Client Secret used to authenticate with
  -v, --verbose                      Turns on verbose logging. Defaults to false

EXAMPLE
  $ sp-serverless auth
```

_See code: [src/commands/auth.ts](https://github.com/stackpath/serverless-scripting-cli/blob/master/src/commands/auth.ts)_

## `sp-serverless deploy`

Deploys the scripts in the working directory according to its `sp-serverless.json`
configuration file.

```
USAGE
  $ sp-serverless deploy

OPTIONS
  -f, --force      Force recreation of scripts if they do not exist. Defaults to false
  -h, --help       show CLI help
  -o, --only=only  Only deploy the following script named scripts. Comma separated value of script names. Defaults to ""
  -v, --verbose    Turns on verbose logging. Defaults to false

EXAMPLE
  $ sp-serverless deploy
```

_See code: [src/commands/deploy.ts](https://github.com/stackpath/serverless-scripting-cli/blob/master/src/commands/deploy.ts)_

## `sp-serverless help [COMMAND]`

Display usage information.

```
USAGE
  $ sp-serverless help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.1.4/src/commands/help.ts)_

<!-- commandsstop -->

# Contributing

We welcome contributions and pull requests to this plugin. See our
[contributing guide](https://github.com/stackpath/serverless-scripting-cli/blob/master/.github/contributing.md)
for more information.
