Setup
=====

In order to run Facet locally, here are instructions for how to structure your setup.

Development Environment
-----------------------

Prerequisites:

- Python 2.7 (currently people use 2.7.10)

- PostgreSQL 9.4

Pre-Setup for Mac
+++++++++++++

Using `Homebrew <https://brew.sh/>`_ is one approach you can take to install Python 2.7 on a Mac. There are instructions on how to install Homebrew on the `Homebrew website <https://brew.sh/>`_. Also, Homebrew provides some `documentation <https://docs.brew.sh/Homebrew-and-Python>`_ about how it manages Python on your machine.

The command used to install Python 2.7 with Homebrew for this documentation::

  brew install python@2

You may run into some trouble installing Python 2.7 with Homebrew. If you get an error that looks like::

  Linking /usr/local/Cellar/python@2/2.7.15... Error: Permission denied @ dir_s_mkdir - /usr/local/Frameworks

Try running the following commands to fix it::

  sudo mkdir /usr/local/Frameworks
  sudo chown $(whoami):admin /usr/local/Frameworks

Also, after installing Python 2.7 with Homebrew, run the following::

  brew postinstall python@2

The **postinstall** command should ensure you have the correct version of pip installed.

Now, run::

  pip install virtualenv


Setup
+++++++++++++

Go into the repo root and

  ``virtualenv-2.7 venv`` or ``virtualenv venv``

and then ::

  source venv/bin/activate
  pip install -r requirements/local.txt

  # create postgresql user "facet" which will own the database
  createuser -P facet

If you get error(s) from the pip install such as::

  Could not find a version that satisfies the requirement django-watson==1.2.0#egg=watson...
  No matching distribution found for django-watson==1.2.0#egg=watson...

Then your virtual environment may have a buggy version of pip. Try "upgrading" pip to a good version::

  pip install -U pip==8.1.1

Enter a password, and then::

  # create postgresql database "facet", owned by postgresql user "facet"
  createdb -O facet facet

  # run Django's "migrate" command, which will run newer migrations than initial
  python project/manage.py migrate

This will give you a superuser account, "admin", with the password "admin".

Ongoing Setup
+++++++++++++

As changes are made to the model, you'll want to migrate your database.
You can keep up with this with::

  python project/manage.py migrate

To update the search engine indexes::

  python project/manage.py buildwatson

To launch a development webserver::

  python project/manage.py runserver
