# jschan
Anonymous imageboard software.

Demo/test instance: [Clearnet](https://fatchan.org), [Tor hidden service](http://cimixezweeq64g42vl6tyhk4becxhi4ldwqq6w43u53qhwsd3s4c3lyd.onion/), [Lokinet SNApp](http://fatchan.loki/)

## Goals
- Oldschool look, newschool features
- Work with javascript disabled
- Support using anonymizers such as Tor, Lokinet or I2P
- Be usable on mobile
- Simple static file serving

## Features
- [x] User created boards ala infinity
- [x] Multiple files per post
- [x] Basic antispam & multiple captcha options
- [x] Read-only JSON api
- [x] Multi-select moderation actions
- [x] Websocket update threads w/o polling
- [x] Webring w/proxy support (compatible with [lynxchan](https://gitlab.com/alogware/LynxChanAddon-Webring) & [infinity](https://gitlab.com/Tenicu/infinityaddon-webring) versions)
- [x] Manage everything from the web panel
- [x] Works properly with anonymizer networks

## Wants
- docker-compose file, use docker volumes and networks for super easy installation, backup and migration
- Mobile app integration (somebody pls)

## Setup
##### These instructions are not for the uninitiated and assume you have a brain. Follow them carefully and you will have a nice working imageboard by the end.

##### Requirements
- Linux - Debian used in this example
- Node.js - the application runtime
- MongoDB >= 4.4 - the database
- Redis - session store, task queue, locks, caching, websocket message arbiter
- Nginx - webserver/proxy, serve static files, handle https, GeoIP lookup
- Certbot/letsencrypt - to get a free https certificate
- Graphicsmagick+Imagemagick - identify and thumbnail images, generate captchas
- Ffmpeg - identify and thumbnail audio, video and gifs

-----

**0. Read the LICENSE**

**1. Setup server with some basics**

- Separate, non-root user to run the application
- Basic security like ssh root login disabled, key login only, firewall (ufw works) deny all incoming on ports besides http/s and ssh.
- Set the timezone to UTC

**2. Install dependencies.**

```bash
$ sudo apt-get update
$ sudo apt-get install nginx ffmpeg imagemagick graphicsmagick
```
NOTE: [Compile ffmpeg from source](https://trac.ffmpeg.org/wiki/CompilationGuide) if you plan to use animated .gif thumbnails, as there are known issues with older ffmpeg versions producing buggy thumbnails.

**3. Install MongoDB**

[MongoDB Installation](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-debian/#install-mongodb-community-edition-on-debian) & [enable authentication](https://medium.com/mongoaudit/how-to-enable-authentication-on-mongodb-b9e8a924efac)

**4. Install Redis**

[Redis Installation](https://www.digitalocean.com/community/tutorials/how-to-install-and-secure-redis-on-debian-9)

**5. Install Node.js**

For easy installation, use [node version manager](https://github.com/nvm-sh/nvm) "nvm".
Install nvm then run the following commands to get the LTS version of nodejs.
```bash
$ nvm install --lts
$ nvm use --lts
```
You can repeat this process in future to update node versions.

You may install Node.js yourself without nvm if you prefer.

**6. Configure nginx**

- Copy the nginx example config and snippets, and create a symlink from sites-available -> sites-enabled
```bash
$ sudo cp configs/nginx/nginx.example /etc/nginx/sites-available/EXAMPLE.COM
$ sudo ln -s /etc/nginx/sites-available/EXAMPLE.COM /etc/nginx/sites-enabled/EXAMPLE.COM
$ sudo cp configs/nginx/snippets/* /etc/nginx/snippets
```

- If you have a .onion or .loki address, uncomment the block in /etc/nginx/sites-available/EXAMPLE.COM

Edit/replace the following in your nginx config:
- "/path/to/jschan" with the path of your jschan root folder
- "example.com" with your domain name
- "example.onion" or "example.loki" with your tor or lokinet address

`sed` can be used to automate this process:
```bash
$ sudo sed -i 's|/path/to/jschan|/path/to/your/install|g' /etc/nginx/sites-available/EXAMPLE.COM
$ sudo sed -i 's/example.com/your.example.com/g' /etc/nginx/sites-available/EXAMPLE.COM
```

- Make sure the sites enabled folder is included by `/etc/nginx/nginx.conf` (in debian nginx package this is already done)
- Use [certbot](https://certbot.eff.org/) to get a free https certificate.

- For post flags to work, [follow this guide](http://archive.is/2SMOb) to setup the [legacy GeoIP database](https://www.miyuru.lk/geoiplegacy), then add this directive inside the http block of `/etc/nginx/nginx.conf`:
```
geoip_country /usr/share/GeoIP/GeoIP.dat;
```

If you plan on using hcaptcha or google recaptcha, you will need to modify the content-security-policy header (CSP) in your nginx config. (documentation: [google recaptcha](https://developers.google.com/recaptcha/docs/faq#im-using-content-security-policy-csp-on-my-website.-how-can-i-configure-it-to-work-with-recaptcha), [hcaptcha](https://docs.hcaptcha.com/#content-security-policy-settings))

If you use cloudflare, please read [these](https://support.cloudflare.com/hc/en-us/articles/200170786-Restoring-original-visitor-IPs-Logging-visitor-IP-addresses-with-mod-cloudflare-) [articles](https://support.cloudflare.com/hc/en-us/articles/200168236-Configuring-Cloudflare-IP-Geolocation) to setup proper IP forwarding and geolocation headers. Similar steps would apply to other CDNs/reverse proxies.

**7. Clone this repo, browse to the folder and set some things up**

```bash
# copy example secrets file and edit it to fill out the details
$ cp configs/secrets.js.example configs/secrets.js && editor configs/secrets.js

# edit rules and faq pages if desired:
$ editor views/custompages/faq.pug views/custompages/rules.pug
# you can also add more .pug files in that folder with the same general format to create other custom pages

# install dependencies and run build tasks
$ npm install
$ npm run-script setup

# setup the database and folder structure, and creates the admin account. **The (random) password will be printed in the command line.**
$ gulp reset
# NOTE: dont run gulp reset again unless you want to completely irreversibly wipe everything

# place your master favicon file in gulp/res/icons/master.png, then generate
gulp generate-favicon

# make jschan pm2 a service and load on system startup. this will output some commands you need to run to complete the process.
$ pm2 startup

# save the process list so jschan is started with pm2
$ pm2 save

# start all the backend processes
$ npm run-script start
$ gulp

# some commands you may need to use in future/find helpful
$ pm2 list #list running pm2 processes
$ pm2 logs #see logs
$ pm2 reload ecosystem.config.js #reload all backend processes

# gulp is used for various jobs like minifying and compiling scripts
# the build-worker process may also run some of these for certain operations e.g. editing global settings in the web panel
$ gulp --tasks #list available gulp tasks
$ gulp migrate #check for and run db migrations
$ gulp password #reset the admin account password if you forgot it
$ gulp #run default gulp task
```

**8. Optionally, if you plan to use the webring and want to make requests with a proxy to mask your origin server IP:**

EITHER:

- Use the socks proxy provided by a non-docker tor daemon, which is probably already setup on port 9050 if you have tor installed for a hidden service.
- Install docker and run torproxy in a container: https://github.com/dperson/torproxy (of course, audit the docker image yourself).
- Use your own socks proxy

Either of the first two options will allow you to follow .onions in your webring follow list.

To enable the proxy, tick "Use Socks Proxy" in global management settings and set the appropriate proxy address, e.g. `socks5h://127.0.0.1:9050`, then save settings.

## Updating

```bash
#stop the jschan backend
$ pm2 stop ecosystem.config.js
#pull the latest changes
$ git pull
#install dependencies again in case any have updated or changed
$ npm install
#run the gulp migrate task. this will update things such as your database schema.
$ gulp migrate
#run the default gulp task to update, scripts, css, icons, images and delete old html
$ gulp
#start the backend again
$ pm2 restart ecosystem.config.js --env production
#if something breaks, check and read the logs, they will help figure out what went wrong
$ pm2 logs
```

## For generous people

Bitcoin (BTC): [`bc1q4elrlz5puak4m9xy3hfvmpempnpqpu95v8s9m6`](bitcoin:bc1q4elrlz5puak4m9xy3hfvmpempnpqpu95v8s9m6)

Monero (XMR): [`89J9DXPLUBr5HjNDNZTEo4WYMFTouSsGjUjBnUCCUxJGUirthnii4naZ8JafdnmhPe4NP1nkWsgcK82Uga7X515nNR1isuh`](monero:89J9DXPLUBr5HjNDNZTEo4WYMFTouSsGjUjBnUCCUxJGUirthnii4naZ8JafdnmhPe4NP1nkWsgcK82Uga7X515nNR1isuh)
