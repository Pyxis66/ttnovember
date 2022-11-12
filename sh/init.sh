#!/bin/sh
#cd ~
#sudo apt-get update
#sudo apt-get install python-pip python-dev python-setuptools python-virtualenv git libyaml-dev build-essential
#git clone https://bitbucket.org/neorex/ttnovember.git
#cd ttnovember
virtualenv venv
./venv/bin/pip install pip --upgrade
./venv/bin/python setup.py install
mkdir ~/.ttnovember
sudo usermod -a -G tty pi
sudo usermod -a -G dialout pi

echo "setting webcam"
sudo cp ./sh/webcam /home/pi/scripts/webcam
sudo cp ./sh/webcamDaemon /home/pi/scripts/webcamDaemon
sudo chmod +x /home/pi/scripts/webcam
sudo chmod +x /home/pi/scripts/webcamDaemon

echo "copy ttnovember.init and default file to /etc"

sudo cp ./scripts/ttnovember.init /etc/init.d/ttnovember
sudo chmod +x /etc/init.d/ttnovember
sudo cp ./scripts/ttnovember.default /etc/default/ttnovember
