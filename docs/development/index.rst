.. _sec-development:

###########
Development
###########

.. contents::
   :local:

.. _sec-development-environment:

Setting up a Development environment
====================================

.. _sec-development-environment-source:

Obtaining, building and running the source
------------------------------------------

This describes the general steps in obtaining, building and running. OS specific instructions can be found
below.

  * Prerequisites:

    * `Python 2.7 <https://python.org>`_ including ``pip``, ``setuptools`` and ``virtualenv``
    * `Git <https://git-scm.com>`_

  * Checkout the TTNovember sources from their Git repository: ``git clone https://github.com/foosel/TTNovember.git``
  * Create a virtual environment in the checkout folder to use for installing and running TTNovember and its
    dependencies (this avoids potential versioning issues for the dependencies with system wide installed
    instances): ``virtualenv venv``
  * Activate the virtual environment: ``source venv/bin/activate`` (might differ per your platform/OS)
  * Update ``pip`` in the virtual environment: ``pip install --upgrade pip``
  * Install TTNovember in `"editable" mode <https://pip.pypa.io/en/stable/reference/pip_install/#editable-installs>`_,
    including its regular *and* development dependencies: ``pip install -e .[develop]``

.. _sec-development-environment-source-linux:

Linux
.....

This assumes you'll host your TTNovember development checkout at ``~/devel/TTNovember``. If you want to use a different
location, please substitute accordingly.

First make sure you have python including its header files, pip, setuptools, virtualenv, git and some build requirements
installed:

  * On apt based distributions (e.g. Debian, Ubuntu, ...):

    .. code-block:: none

       sudo apt-get install python python-pip python-dev python-setuptools python-virtualenv git libyaml-dev build-essential

.. todo::

   Using a Linux distribution that doesn't use ``apt``? Please send a
   `Pull Request <https://github.com/foosel/TTNovember/blob/master/CONTRIBUTING.md#pull-requests>`_ to get the necessary
   steps into this guide!

Then:

.. code-block:: none

   cd ~/devel
   git clone https://github.com/foosel/TTNovember.git
   cd TTNovember
   virtualenv venv
   source ./venv/bin/activate
   pip install --upgrade pip
   pip install -e .[develop]

You can then start TTNovember via ``~/devel/TTNovember/venv/bin/octoprint`` or just ``octoprint`` if you activated the virtual
environment.

.. _sec-development-environment-windows:

Windows
.......

This assumes you'll host your TTNovember development checkout at ``C:\Devel\TTNovember``. If you want to use a different
location, please substitute accordingly.

First download & install:

  * `Python 2.7.12 Windows x86 MSI installer <https://www.python.org/downloads/release/python-2712/>`_

    * make sure to have the installer add Python to the ``PATH`` and have it install ``pip`` too

  * `Microsoft Visual C++ Compiler for Python 2.7 <http://www.microsoft.com/en-us/download/details.aspx?id=44266>`_
  * `Git for Windows <https://git-for-windows.github.io/>`_

Open the Git Bash you just installed and in that:

.. code-block:: none

   pip install virtualenv
   cd /c/Devel
   git clone https://github.com/foosel/TTNovember.git
   cd TTNovember
   virtualenv venv
   source ./venv/bin/activate
   pip install --upgrade pip
   pip install -e .[develop]

You can then start TTNovember via ``/c/Devel/TTNovember/venv/bin/octoprint`` or just ``octoprint`` if you activated the virtual
environment.

.. _sec-development-environment-mac:

Mac OS X
........

.. note::

   This guide is based on the `Setup Guide for Mac OS X on TTNovember's wiki <https://github.com/foosel/TTNovember/wiki/Setup-on-Mac/>`_.
   Please report back if it works for you, due to lack of access to a Mac I cannot test it myself. Thanks.

This assumes you'll host your TTNovember development checkout at ``~/devel/TTNovember``. If you want to use a different
location, please substitute accordingly.

You'll need a user account with administrator privileges.

  * Install the latest version of Xcode suitable for your OS. For example, OS X 10.11 (El Capitan) requires Xcode 7.
  * Install Xcode's command line tools:

    * ``xcode-select --install``
    * ``sudo xcodebuild`` (ensure the license was accepted)
    * If you have more than one Xcode installed: ``sudo xcode-select -s /Applications/Xcode.app/Contents/Developer``

  * Install Homebrew and use that to install Python:

    * ``ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"``
    * ``brew install python``

  * Install `virtualenv <https://virtualenv.pypa.io/>`_

    * ``pip install virtualenv``

  * Install TTNovember

    .. code-block:: none

       cd ~/devel
       git clone https://github.com/foosel/TTNovember.git
       cd TTNovember
       virtualenv venv
       source venv/bin/activate
       pip install -e .[develop]

You can then start TTNovember via ``~/devel/TTNovember/venv/bin/octoprint`` or just ``octoprint`` if you activated the virtual
environment.

.. _sec-development-environment-ides:

IDE Setup
---------

.. todo::

   Using another IDE than the ones below? Please send a
   `Pull Request <https://github.com/foosel/TTNovember/blob/master/CONTRIBUTING.md#pull-requests>`_ to get the necessary
   steps into this guide!

.. _sec-development-environment-ides-pycharm:

PyCharm
.......

  - "File" > "Open ...", select TTNovember checkout folder (e.g. ``~/devel/TTNovember`` or ``C:\Devel\TTNovember``)
  - "File" > "Settings ..." > "Project: TTNovember" > "Project Interpreter" > "Add local ...", select TTNovember venv
    folder (e.g. ``~/devel/TTNovember/venv`` or ``C:\Devel\TTNovember\venv``)
  - Right click "src" in project tree, mark as source folder
  - Add Run/Debug Configuration, select "Python":

    * Name: TTNovember server
    * Script: path to ``run`` in the TTNovember checkout folder (e.g. ``~/devel/TTNovember/run`` or ``C:\Devel\TTNovember\run``)
    * Script parameters: ``--debug``
    * Project: ``TTNovember``
    * Python interpreter: the ``venv`` local virtual environment
    * Working directory: the TTNovember checkout folder (e.g. ``~/devel/TTNovember`` or ``C:\Devel\TTNovember``)

.. note::

   Make sure you are running a PyCharm version of 2016.1 or later, or manually fix
   `a debugger bug contained in earlier versions <https://youtrack.jetbrains.com/issue/PY-18365>`_ or plugin management
   will not work in your developer install when running TTNovember from PyCharm in debug mode.
