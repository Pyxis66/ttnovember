#!/bin/sh
cd ~
sudo apt-get install subversion libjpeg62-turbo-dev imagemagick libav-tools libv4l-dev cmake
git clone https://github.com/jacksonliam/mjpg-streamer.git
cd mjpg-streamer/mjpg-streamer-experimental
export LD_LIBRARY_PATH=.
make
