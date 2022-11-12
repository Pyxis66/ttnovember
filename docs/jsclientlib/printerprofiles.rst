.. _sec-jsclientlib-printerprofiles:

:mod:`TTNovemberClient.printerprofiles`
--------------------------------------

.. js:function:: TTNovemberClient.printerprofiles.list(opts)

   Retrieves a list of all configured printer profiles.

   :param object opts: Additional options for the request
   :returns Promise: A `jQuery Promise <http://api.jquery.com/Types/#Promise>`_ for the request's response

.. js:function:: TTNovemberClient.printerprofiles.get(id, opts)

   :param string id: The identifier of the profile to retrieve
   :param object opts: Additional options for the request
   :returns Promise: A `jQuery Promise <http://api.jquery.com/Types/#Promise>`_ for the request's response

.. js:function:: TTNovemberClient.printerprofiles.add(profile, additional, opts)

   Adds a new profile to TTNovember.

   :param string profile: The data of the profile to add
   :param string basedOn: The identifier of the profile to base this profile on (optional)
   :param object opts: Additional options for the request
   :returns Promise: A `jQuery Promise <http://api.jquery.com/Types/#Promise>`_ for the request's response

.. js:function:: TTNovemberClient.printerprofiles.update(id, profile, opts)

   Updates an existing profile in TTNovember.

   :param string id: The identifier of the profile to update
   :param string profile: The data of the profile to update
   :param object opts: Additional options for the request
   :returns Promise: A `jQuery Promise <http://api.jquery.com/Types/#Promise>`_ for the request's response

.. js:function:: TTNovemberClient.printerprofiles.delete(id, opts)

   Deletes a profile in TTNovember.

   :param string id: The identifier of the profile to delete
   :param object opts: Additional options for the request
   :returns Promise: A `jQuery Promise <http://api.jquery.com/Types/#Promise>`_ for the request's response

.. seealso::

   :ref:`Printer profile operations <sec-api-printerprofiles>`
       The documentation of the underlying printer profile API.
