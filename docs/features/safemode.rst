.. _sec-features-safemode:

*********
Safe mode
*********

With the advent of support for plugins in TTNovember, it quickly became apparent that some of the bugs
reported on TTNovember's bug tracker were actually bugs with installed third party plugins instead of
TTNovember itself.

To allow an easier identification of these cases, TTNovember 1.3.0 introduced safe mode. Starting
TTNovember in safe mode disables all plugins that are not bundled with TTNovember, allowing to easier
identify most cases where a third party plugin is the culprit of an observed issue.

Additionally, TTNovember allows uninstalling plugins in this mode, allowing recovery from cases where
a third party plugin causes the server to not start up or the web interface to not render or function
correctly anymore.

.. _sec-features-safemode-how:

How to start TTNovember in safe mode
===================================

There exist three ways to start TTNovember in safe mode:

  * since TTNovember 1.3.2: by selecting "Restart TTNovember in safe mode" from the "System" menu,
    if the "Restart TTNovember" server command has been correctly configured (see :numref:`fig-features-safemode-systemmenu`).
  * by starting TTNovember with the command line parameter ``--safe``, e.g. ``octoprint serve --safe``
  * by setting the option ``server.startOnceInSafeMode`` in :ref:`config.yaml <sec-configuration-config_yaml>`
    to ``true`` and restarting

The last two options will have TTNovember enable safe mode only for the next server start - once you
restart TTNovember again, safe mode will be disabled again.

.. _fig-features-safemode-systemmenu:
.. figure:: ../images/features-safemode-systemmenu.png
   :align: center
   :alt: "Restart TTNovember in safe mode" in the "System" menu

   "Restart TTNovember in safe mode" in the "System" menu

.. _sec-features-safemode-differences:

Differences of safe mode vs normal operation mode
=================================================

When TTNovember is running in safe mode the following changes to its normal operation mode apply:

  * TTNovember will not enable any of the installed third party plugins. TTNovember considers all plugins third
    party plugins that do not ship with TTNovember's sources, so any plugins installed either via `pip` or
    into TTNovember's plugin folder at ``~/.octoprint/plugins`` (Linux), ``%APPDATA%/TTNovember`` (Windows) and
    ``~/Library/Application Support/TTNovember`` (MacOS).
  * TTNovember will still allow to uninstall third party plugins through the built-in Plugin Manager.
  * TTNovember will still allow to disable (bundled) plugins that are still enabled.
  * TTNovember will not allow to enable third party plugins.
  * TTNovember's web interface will display a notification to remind you that it is running in
    safe mode.

.. _fig-features-safemode-notification:
.. figure:: ../images/features-safemode-notification.png
   :align: center
   :alt: Safe mode notification

   Safe mode notification
