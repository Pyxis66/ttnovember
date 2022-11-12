.. _sec-jsclientlib-browser:

:mod:`TTNovemberClient.browser`
------------------------------

.. js:function:: TTNovemberClient.browser.login(username, password, remember, opts)

   Logs the browser into TTNovember, using the provided ``username`` and
   ``password`` as credentials. If ``remember`` is set to ``true``, the session
   will also persist across browser restarts.

   **Example:**

   .. code-block:: javascript

      TTNovember.browser.login("myusername", "mypassword", true)
          .done(function(response) {
              // do something with the response
          });

   :param string username: Username to log in with
   :param string password: Password to log in with
   :param bool remember: "Remember me"
   :param object opts: Additional request options
   :returns Promise: A `jQuery Promise <http://api.jquery.com/Types/#Promise>`_ for the request's response

.. js:function:: TTNovemberClient.browser.passiveLogin(opts)

   Tries to perform a passive login into TTNovember, using existing session data
   stored in the browser's cookies.

   :param object opts: Additional request options
   :returns Promise: A `jQuery Promise <http://api.jquery.com/Types/#Promise>`_ for the request's response

.. js:function:: TTNovemberClient.browser.logout(opts)

   Logs the browser out of TTNovember.

   :param object opts: Additional request options
   :returns Promise: A `jQuery Promise <http://api.jquery.com/Types/#Promise>`_ for the request's response
