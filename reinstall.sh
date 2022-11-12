#!/bin/sh
sudo service octoprint stop
sudo git pull
sudo ./venv/bin/python setup.py clean
sudo ./venv/bin/python setup.py install
sudo service octoprint start
