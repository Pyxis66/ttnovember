.. _sec-jsclientlib-job:

:mod:`TTNovemberClient.job`
--------------------------

.. js:function:: TTNovemberClient.job.get(opts)

   Retrieves information about the current job.

   See :ref:`Retrieve information about the current job <sec-api-job-information>` for details.

   :param object opts: Additional options for the request
   :returns Promise: A `jQuery Promise <http://api.jquery.com/Types/#Promise>`_ for the request's response

.. js:function:: TTNovemberClient.job.start(opts)

   Starts the current job.

   See :ref:`Issue a job command <sec-api-jobs-command>` for details.

   :param object opts: Additional options for the request
   :returns Promise: A `jQuery Promise <http://api.jquery.com/Types/#Promise>`_ for the request's response

.. js:function:: TTNovemberClient.job.cancel(opts)

   Cancels the current job.

   See :ref:`Issue a job command <sec-api-jobs-command>` for details.

   :param object opts: Additional options for the request
   :returns Promise: A `jQuery Promise <http://api.jquery.com/Types/#Promise>`_ for the request's response

.. js:function:: TTNovemberClient.job.restart(opts)

   Restarts the current job. This is equivalent to cancelling and immediately restarting
   the job.

   **Example:**

   .. code-block:: javascript

      TTNovember.job.restart();

      // the above is a shorthand for:

      TTNovember.job.cancel()
          .done(function(response) {
              TTNovember.job.start();
          });

   See :ref:`Issue a job command <sec-api-jobs-command>` for details.

   :param object opts: Additional options for the request
   :returns Promise: A `jQuery Promise <http://api.jquery.com/Types/#Promise>`_ for the request's response

.. js:function:: TTNovemberClient.job.pause(opts)

   Pauses the current job if it's running, does nothing if it's already paused.

   See :ref:`Issue a job command <sec-api-jobs-command>` for details.

   :param object opts: Additional options for the request
   :returns Promise: A `jQuery Promise <http://api.jquery.com/Types/#Promise>`_ for the request's response

.. js:function:: TTNovemberClient.job.resume(opts)

   Resumes the current job if it's currently pause, does nothing if it's running.

   See :ref:`Issue a job command <sec-api-jobs-command>` for details.

   :param object opts: Additional options for the request
   :returns Promise: A `jQuery Promise <http://api.jquery.com/Types/#Promise>`_ for the request's response

.. js:function:: TTNovemberClient.job.togglePause(opts)

   Resumes a paused and pauses a running job.

   See :ref:`Issue a job command <sec-api-jobs-command>` for details.

   :param object opts: Additional options for the request
   :returns Promise: A `jQuery Promise <http://api.jquery.com/Types/#Promise>`_ for the request's response

