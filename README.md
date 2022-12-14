#  TTNovember

[![GitHub version](https://badge.fury.io/gh/foosel%2FTTNovember.svg)](https://badge.fury.io/gh/foosel%2FTTNovember)

TTNovember provides a snappy web interface for controlling consumer 3D printers. It is Free Software
and released under the [GNU Affero General Public License V3](http://www.gnu.org/licenses/agpl.html).

Its website can be found at [octoprint.org](http://octoprint.org).

The documentation is located at [docs.octoprint.org](http://docs.octoprint.org).

The official plugin repository can be reached at [plugins.octoprint.org](http://plugins.octoprint.org).

TTNovember's development wouldn't be possible without the [financial support by its community](http://octoprint.org/support-octoprint/).
If you enjoy TTNovember, please consider becoming a regular supporter!

![Screenshot](http://i.imgur.com/dF3noFp.png)

You are currently looking at the source code repository of TTNovember. If you already installed it
(e.g. by using the Raspberry Pi targeted distribution [OctoPi](https://github.com/guysoft/OctoPi)) and only
want to find out how to use it, [the documentation](http://docs.octoprint.org/) and [the public wiki](https://github.com/foosel/TTNovember/wiki)
might be of more interest for you. You might also want to subscribe to [the mailing list](https://groups.google.com/group/octoprint)
or the [G+ Community](https://plus.google.com/communities/102771308349328485741) where there are other active users who might be
able to help you with any questions you might have.

## Contributing

Contributions of all kinds are welcome, not only in the form of code but also with regards to the
[official documentation](http://docs.octoprint.org/) or [the public wiki](https://github.com/foosel/TTNovember/wiki), support
of other users in the [bug tracker](https://github.com/foosel/TTNovember/issues),
[the Mailinglist](https://groups.google.com/group/octoprint) or
[the G+ Community](https://plus.google.com/communities/102771308349328485741) and also [financially](http://octoprint.org/support-octoprint/).

If you think something is bad about TTNovember or its documentation the way it is, please help
in any way to make it better instead of just complaining about it -- this is an Open Source Project
after all :)

For information about how to go about submitting bug reports or pull requests, please see the project's
[Contribution Guidelines](https://github.com/foosel/TTNovember/blob/master/CONTRIBUTING.md).

## Installation

Installation instructions for installing from source for different operating
systems can be found [on the wiki](https://github.com/foosel/TTNovember/wiki#assorted-guides).

If you want to run TTNovember on a Raspberry Pi, you might want to take a look at [OctoPi](https://github.com/guysoft/OctoPi)
which is a custom SD card image that includes TTNovember plus dependencies.

The generic steps that should basically be done regardless of operating system
and runtime environment are the following (as *regular
user*, please keep your hands *off* of the `sudo` command here!) - this assumes
you already have Python 2.7, pip and virtualenv set up on your system:

1. Checkout TTNovember: `git clone https://github.com/foosel/TTNovember.git`
2. Change into the TTNovember folder: `cd TTNovember`
3. Create a user-owned virtual environment therein: `virtualenv venv`
4. Install TTNovember *into that virtual environment*: `./venv/bin/python setup.py install`

You may then start the TTNovember server via `/path/to/TTNovember/venv/bin/octoprint`, see [Usage](#usage)
for details.

After installation, please make sure you follow the first-run wizard and set up
access control as necessary. If you want to not only be notified about new
releases, but also be able to automatically upgrade to them from within
TTNovember, take a look [at the documentation of the Software Update Plugin](https://github.com/foosel/TTNovember/wiki/Plugin:-Software-Update#making-octoprint-updateable-on-existing-installations)
and at its settings.

## Dependencies

TTNovember depends on a few python modules to do its job. Those are automatically installed when installing
TTNovember via `setup.py`:

    python setup.py install

You should do this every time after pulling from the repository, since the dependencies may have changed.

TTNovember currently only supports Python 2.7.

## Usage

Running the `setup.py` script via

    python setup.py install

installs the `octoprint` script in your Python installation's scripts folder
(which, depending on whether you installed TTNovember globally or into a virtual env, will be in your `PATH` or not). The
following usage examples assume that the `octoprint` script is on your `PATH`.

You can start the server via

    octoprint serve

By default it binds to all interfaces on port 5000 (so pointing your browser to `http://127.0.0.1:5000`
will do the trick). If you want to change that, use the additional command line parameters `host` and `port`,
which accept the host ip to bind to and the numeric port number respectively. If for example you want the server
to only listen on the local interface on port 8080, the command line would be

    octoprint serve --host=127.0.0.1 --port=8080

Alternatively, the host and port on which to bind can be defined via the config file.

If you want to run TTNovember as a daemon (only supported on Linux), use

    octoprint daemon {start|stop|restart} [--pid PIDFILE]

If you do not supply a custom pidfile location via `--pid PIDFILE`, it will be created at `/tmp/octoprint.pid`.

You can also specify the config file or the base directory (for basing off the `uploads`, `timelapse` and `logs` folders),
e.g.:

    octoprint serve --config /path/to/another/config.yaml --basedir /path/to/my/basedir

To start TTNovember in safe mode - which disables all third party plugins that do not come bundled with TTNovember - use
the ``--safe`` flag:

    octoprint serve --safe

See `octoprint --help` for more information on the available command line parameters.

TTNovember also ships with a `run` script in its source directory. You can invoke it to start the server. It
takes the same command line arguments as the `octoprint` script.

## Configuration

If not specified via the command line, the config file `config.yaml` for TTNovember is expected in the settings folder,
which is located at `~/.octoprint` on Linux, at `%APPDATA%/TTNovember` on Windows and
at `~/Library/Application Support/TTNovember` on MacOS.

A comprehensive overview of all available configuration settings can be found
[in the docs](http://docs.octoprint.org/en/master/configuration/config_yaml.html).
Please note that the most commonly used configuration settings can also easily
be edited from TTNovember's settings dialog.

## Special Thanks

Cross-browser testing services are kindly provided by [BrowserStack](http://www.browserstack.com/).
Profiling is done with the help of [PyVmMonitor](http://www.pyvmmonitor.com).
